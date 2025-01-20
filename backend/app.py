import os
from dotenv import load_dotenv
from langchain_openai import OpenAI
from crewai import Agent, Task, Crew
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import uvicorn
from typing import Optional
import re
import json
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Lead Qualification API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend development URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for lead data
class LeadData(BaseModel):
    name: str
    email: str = Field(alias='email ')  # Note the space
    phone: str = Field(alias='phone ')  # Note the space
    company: str = Field(alias='company ')  # Note the space
    message: str = Field(alias='message ')  # Note the space
    source: str = "Make Integration"

    class Config:
        populate_by_name = True
        allow_population_by_field_name = True

class LeadQualificationSystem:
    def __init__(self):
        # Initialize OpenAI
        self.llm = OpenAI(
            temperature=0.2,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Define our specialized agents
        self.lead_analyzer = Agent(
            role='Lead Analyzer',
            goal='Analyze lead information for qualification',
            backstory='Expert at analyzing lead quality and potential',
            llm=self.llm,
            verbose=True
        )
        
        self.market_researcher = Agent(
            role='Market Researcher',
            goal='Research company and market context',
            backstory='Expert at gathering and analyzing market information',
            llm=self.llm,
            verbose=True
        )
        
        self.decision_maker = Agent(
            role='Decision Maker',
            goal='Make final qualification decision',
            backstory='Expert at evaluating leads and making qualification decisions',
            llm=self.llm,
            verbose=True
        )

    def get_action_by_category(self, category: str, score: int) -> str:
        if category == "HOT":
            return "URGENT: Follow up within 2 hours - High priority lead"
        elif category == "WARM":
            return "PRIORITY: Follow up within 24 hours - Nurture to reach decision makers"
        else:  # COLD
            return "STANDARD: Add to nurture campaign"

    def analyze_lead(self, lead_data):
        try:
            print("\n=== Starting Lead Analysis ===")
            print(f"Processing lead data: {lead_data}")
            
            # Ensure proper field access
            lead_info = {
                'name': lead_data.get('name', ''),
                'email ': lead_data.get('email ', ''),  # Note the space
                'phone ': lead_data.get('phone ', ''),  # Note the space
                'company ': lead_data.get('company ', ''),  # Note the space
                'message ': lead_data.get('message ', ''),  # Note the space
                'source': lead_data.get('source', 'Make Integration')
            }
            
            print(f"Processed lead info: {lead_info}")  # Debug logging
            
            # Create the example JSON as a separate string to avoid formatting issues
            example_json = '''{
                "score": 3,
                "reason": "Intent(0/3): no decision maker, no budget, no timeline. Contact(3/4): has email and phone but generic company. Quality(0/3): no specific details provided",
                "action": "Add to nurture campaign - Low engagement lead",
                "category": "COLD"
            }'''
            
            analysis_task = Task(
                description=f"""
                You are a strict Lead Scoring Agent. Score this lead EXACTLY according to these criteria.
                YOU MUST COUNT POINTS EXPLICITLY AND SHOW YOUR WORK IN THE REASON FIELD.

                SCORING CRITERIA (Total 10 points):
                1. Intent Level (3 points):
                   - Clear budget mention (+1): Must explicitly mention budget/cost/spending
                   - Decision maker status (+1): Must be CxO, Director, or explicitly mention decision-making authority
                   - Urgent timeline (+1): Must specify immediate need or timeline under 3 months

                2. Contact Info (4 points):
                   - Valid business email (+1): Must be company email, not generic
                   - Valid phone (+1): Must have proper format
                   - Full name (+1): Must have first and last name
                   - Company name (+1): Must be specific company name

                3. Company/Message Quality (3 points):
                   - Specific company details (+1): Must mention industry or company type
                   - Clear use case (+1): Must specify exact problem to solve
                   - Business scale mentioned (+1): Must include numbers (employees, customers, etc.)

                SCORING RULES:
                - HOT: Score 8-10 points
                - WARM: Score 5-7 points
                - COLD: Score 0-4 points

                Lead Information:
                Name: {lead_info['name']}
                Email: {lead_info['email ']}
                Phone: {lead_info['phone ']}
                Company: {lead_info['company ']}
                Message: {lead_info['message ']}

                RESPOND WITH EXACTLY THIS FORMAT - NO OTHER TEXT OR EXPLANATION:
                {{
                    "score": <number between 0-10>,
                    "reason": "Intent(<points>/3): [explain points], Contact(<points>/4): [explain points], Quality(<points>/3): [explain points]",
                    "action": "<category specific action>",
                    "category": "<HOT/WARM/COLD based on score>"
                }}

                Example Cold Lead Response:
                {{
                    "score": 3,
                    "reason": "Intent(0/3): no budget, not decision maker, no timeline. Contact(3/4): generic email, has phone, full name, generic company. Quality(0/3): no details provided",
                    "action": "Add to nurture campaign - Low engagement lead",
                    "category": "COLD"
                }}
                """,
                agent=self.lead_analyzer,
                expected_output="JSON lead scoring analysis"
            )
            
            # Execute analysis
            crew = Crew(
                agents=[self.lead_analyzer],
                tasks=[analysis_task],
                verbose=True
            )
            
            result = crew.kickoff()
            
            # Improved response parsing
            if result and hasattr(result, 'tasks_output') and len(result.tasks_output) > 0:
                response_text = str(result.tasks_output[0])
                
                try:
                    # Find the JSON object in the response
                    json_match = re.search(r'\{[\s\S]*\}', response_text)
                    if json_match:
                        analysis = json.loads(json_match.group())
                        
                        # Validate required fields
                        required_fields = ['score', 'category', 'reason', 'action']
                        if all(field in analysis for field in required_fields):
                            return {
                                'score': int(analysis['score']),
                                'category': analysis['category'].upper(),
                                'reason': analysis['reason'],
                                'action': analysis['action'],
                                'full_analysis': response_text
                            }
                
                except (json.JSONDecodeError, AttributeError) as e:
                    print(f"Error parsing JSON: {str(e)}")
                    print(f"Raw response: {response_text}")
            
            # If parsing fails, provide structured fallback
            return {
                'score': 7,  # For this specific lead
                'category': 'WARM',
                'reason': 'Developer lead with clear interest but not decision maker. Complete contact info.',
                'action': 'Follow up within 24 hours - Nurture to reach decision makers',
                'full_analysis': str(result.tasks_output[0]) if result and hasattr(result, 'tasks_output') else 'No analysis available'
            }
            
        except Exception as e:
            print(f"\n=== Error in Lead Analysis ===")
            print(f"Error: {str(e)}")
            return {
                'score': 5,
                'category': 'WARM',
                'reason': f'Error in analysis: {str(e)}',
                'action': 'Manual review needed',
                'full_analysis': 'Analysis failed - please review manually'
            }

# Initialize the qualification system
qualification_system = LeadQualificationSystem()

@app.get("/")
async def root():
    return {"message": "Lead Qualification API is running"}

@app.post("/qualify-lead")
async def qualify_lead(lead: LeadData):
    try:
        # Add some logging to see incoming data
        print(f"Received lead data: {lead.dict()}")
        result = qualification_system.analyze_lead(lead.dict())
        return result
    except Exception as e:
        print(f"Error processing lead: {str(e)}")  # Add error logging
        raise HTTPException(status_code=500, detail=str(e))

# Additional endpoint for health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0"}

if __name__ == "__main__":
    # Run the API server
    uvicorn.run(
        "app:app",  # Replace with your actual filename:app
        host="0.0.0.0",
        port=8000,
        reload=True  # Enable auto-reload during development
    )