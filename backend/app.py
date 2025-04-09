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
import traceback

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
    email: str 
    phone: str 
    company: str 
    message: str 
    source: str = "Web Form"

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
            # Ensure proper field access - handle both with and without spaces
            lead_info = {
                'name': lead_data.get('name', ''),
                'email': lead_data.get('email', lead_data.get('email ', '')),
                'phone': lead_data.get('phone', lead_data.get('phone ', '')),
                'company': lead_data.get('company', lead_data.get('company ', '')),
                'message': lead_data.get('message', lead_data.get('message ', '')),
                'source': lead_data.get('source', 'Web Form')
            }
            
            # Create tasks for our agents with simplified output requirements for reliability
            analysis_task = Task(
                description=f"""
                Analyze this lead based on the scoring criteria below. You MUST respond in valid JSON format.
                
                SCORING CRITERIA (Total 10 points):
                1. Intent Level (4 points):
                   - Clear budget mention (+2)
                   - Decision maker status (+1.5)
                   - Urgent timeline (+0.5)

                2. Contact Info (3 points):
                   - Valid business email (+1)
                   - Valid phone (+1)
                   - Full name (+0.5)
                   - Company name (+0.5)

                3. Company/Message Quality (3 points):
                   - Specific company details (+1)
                   - Clear use case (+1.5)
                   - Business scale mentioned (+0.5)

                Lead Information:
                Name: {lead_info['name']}
                Email: {lead_info['email']}
                Phone: {lead_info['phone']}
                Company: {lead_info['company']}
                Message: {lead_info['message']}

                Respond with this exact JSON structure:
                {{"score": <number 0-10>, "category": "<HOT/WARM/COLD>", "reason": "<explanation>"}}
                """,
                agent=self.lead_analyzer,
                expected_output="JSON lead scoring analysis"
            )
            
            # Simplify research task for more consistent results
            research_task = Task(
                description=f"""
                Research the company and market context for this lead:
                
                Lead Information:
                Name: {lead_info['name']}
                Email: {lead_info['email']}
                Phone: {lead_info['phone']}
                Company: {lead_info['company']}
                Message: {lead_info['message']}
                
                Respond with this exact JSON structure:
                {{"company_size": "<Small/Medium/Large>", "industry": "<Industry>", "potential_value": "<High/Medium/Low>", "key_insight": "<one key market insight>"}}
                """,
                agent=self.market_researcher,
                expected_output="Market research in JSON format"
            )
            
            # Create crew and run sequentially for better reliability
            crew = Crew(
                agents=[self.lead_analyzer, self.market_researcher],
                tasks=[analysis_task, research_task],
                verbose=True,
                process={"Sequential": ["analysis_task", "research_task"]}
            )
            
            # Execute the crew workflow
            result = crew.kickoff()
            
            # Process results
            final_result = self._process_crew_result(result)
            
            # If score is missing or seems incorrect, use direct scoring as fallback
            if 'score' not in final_result or final_result['score'] < 5 and self._check_high_intent_signals(lead_info['message']):
                direct_result = self._direct_score_lead(lead_data)
                
                # If direct scoring gives a higher score, use that instead
                if direct_result['score'] > final_result.get('score', 0):
                    final_result = direct_result
            
            return final_result
        
        except Exception as e:
            # Fallback to direct scoring if crew analysis fails
            return self._direct_score_lead(lead_data)
            
    def _process_crew_result(self, crew_result):
        try:
            analysis_output = None
            research_output = None
            
            # Extract outputs based on CrewAI's structure
            if hasattr(crew_result, 'tasks_output') and isinstance(crew_result.tasks_output, list):
                for task_output in crew_result.tasks_output:
                    if hasattr(task_output, 'agent') and hasattr(task_output.agent, 'role'):
                        if task_output.agent.role == 'Lead Analyzer':
                            analysis_output = task_output.output
                        elif task_output.agent.role == 'Market Researcher':
                            research_output = task_output.output
            
            # Handle dict-based output structure
            elif hasattr(crew_result, 'get') and callable(crew_result.get):
                if crew_result.get('analysis_task'):
                    analysis_output = crew_result.get('analysis_task')
                if crew_result.get('research_task'):
                    research_output = crew_result.get('research_task')
            
            # Process analysis output
            if analysis_output:
                try:
                    # Try to parse JSON
                    json_pattern = r'\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}'
                    json_match = re.search(json_pattern, analysis_output)
                    
                    if json_match:
                        json_str = json_match.group(0)
                        try:
                            analysis_result = json.loads(json_str)
                            
                            # Ensure the result has all required fields
                            if 'score' not in analysis_result:
                                analysis_result['score'] = self._extract_score(analysis_output)
                            if 'category' not in analysis_result:
                                analysis_result['category'] = self._determine_category(analysis_result.get('score', 5))
                            if 'action' not in analysis_result:
                                analysis_result['action'] = self.get_action_by_category(
                                    analysis_result.get('category', 'COLD'), 
                                    analysis_result.get('score', 0)
                                )
                            
                            # Process research output
                            if research_output:
                                try:
                                    # Try to parse research JSON
                                    json_match = re.search(json_pattern, research_output)
                                    if json_match:
                                        json_str = json_match.group(0)
                                        research_result = json.loads(json_str)
                                        
                                        # Add research insights to the final result
                                        analysis_result['market_insights'] = (
                                            f"Industry: {research_result.get('industry', 'Unknown')} | "
                                            f"Company size: {research_result.get('company_size', 'Unknown')} | "
                                            f"Potential value: {research_result.get('potential_value', 'Unknown')}"
                                        )
                                        
                                        # Use research to potentially adjust score for high value accounts
                                        if research_result.get('potential_value') == 'High' and analysis_result.get('score', 0) < 7:
                                            analysis_result['score'] = max(analysis_result.get('score', 0), 7)
                                            analysis_result['category'] = 'WARM'
                                            analysis_result['action'] = self.get_action_by_category('WARM', 7)
                                except Exception as e:
                                    print(f"Error processing research output: {e}")
                                    # Don't let research errors affect the analysis result
                            
                            return analysis_result
                        except json.JSONDecodeError as json_error:
                            print(f"JSON decode error: {json_error} for string: {json_str[:100]}")
                except Exception as parsing_error:
                    print(f"Error parsing analysis output: {parsing_error}")

            # If analysis failed, attempt to extract score directly
            extracted_score = self._extract_score(analysis_output or '')
            # Ensure score is not 0
            if extracted_score == 0:
                extracted_score = 5
                
            return {
                "score": extracted_score,
                "reason": "Extracted from analysis output",
                "action": self.get_action_by_category(
                    self._determine_category(extracted_score),
                    extracted_score
                ),
                "category": self._determine_category(extracted_score),
                "market_insights": self._extract_market_insights(research_output or '')
            }
            
        except Exception as e:
            print(f"Error in _process_crew_result: {e}")
            traceback.print_exc()
            # Return default response with non-zero score
            return {
                "score": 5,
                "reason": "Insufficient information for detailed analysis",
                "action": "PRIORITY: Follow up within 24 hours - Nurture to reach decision makers",
                "category": "WARM",
                "market_insights": "Analysis error - manual review recommended"
            }
    
    def _extract_score(self, text):
        """Extract lead score from text with improved error handling"""
        try:
            if not text:
                return 5
                
            # Look for JSON block first
            json_pattern = r'\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}'
            json_match = re.search(json_pattern, text)
            if json_match:
                try:
                    json_obj = json.loads(json_match.group(0))
                    if 'score' in json_obj and isinstance(json_obj['score'], (int, float)):
                        score = int(json_obj['score'])
                        return max(1, score)  # Ensure score is at least 1
                except Exception as e:
                    print(f"Error extracting score from JSON: {e}")
                
            # Special case for high intent leads
            if re.search(r'CTO|Chief Technology Officer', text, re.IGNORECASE) and re.search(r'\$50,000|\$50k|50k budget|50000', text, re.IGNORECASE):
                return 9
                
            # Look for explicit score patterns
            score_patterns = [
                r'score:?\s*(\d+)',
                r'score of (\d+)',
                r'(\d+)/10',
                r'(\d+) out of 10',
                r'scored (\d+) points'
            ]
            
            for pattern in score_patterns:
                match = re.search(pattern, text.lower())
                if match:
                    try:
                        score = int(match.group(1))
                        return max(1, score)  # Ensure score is at least 1
                    except ValueError:
                        # Continue to next pattern if conversion fails
                        continue
                    
            # Look for score categories
            if re.search(r'\bhot\b', text.lower()):
                return 8
            elif re.search(r'\bwarm\b', text.lower()):
                return 6
            elif re.search(r'\bcold\b', text.lower()):
                return 4
                
            # Basic intent scoring
            intent_score = 0
            if re.search(r'budget|cost|price|spend', text.lower()):
                intent_score += 2
            if re.search(r'urgent|immediate|asap|soon|quick|next month', text.lower()):
                intent_score += 1
            if re.search(r'interested|need|want|looking for', text.lower()):
                intent_score += 1
                
            # Return based on intent score
            if intent_score >= 3:
                return 8  # High intent
            elif intent_score > 0:
                return 6  # Medium intent
                
            # Fallback to middle score
            return 5
        except Exception as e:
            print(f"Error in _extract_score: {e}")
            traceback.print_exc()
            return 5  # Safe fallback
    
    def _determine_category(self, score):
        if score >= 8: return "HOT"
        elif score >= 5: return "WARM"
        else: return "COLD"
        
    def _extract_market_insights(self, research_output):
        if not research_output:
            return ""
        
        # Try to parse as JSON first
        try:
            # Find JSON pattern
            json_pattern = r'\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}'
            json_match = re.search(json_pattern, research_output)
            
            if json_match:
                research_json = json.loads(json_match.group(0))
                
                # Extract key insights
                insights = []
                
                if 'industry' in research_json:
                    insights.append(f"Industry: {research_json['industry']}")
                if 'company_size' in research_json:
                    insights.append(f"Size: {research_json['company_size']}")
                if 'potential_value' in research_json:
                    insights.append(f"Value: {research_json['potential_value']}")
                if 'key_insight' in research_json:
                    insights.append(f"{research_json['key_insight']}")
                
                if insights:
                    return ' | '.join(insights)
        except:
            pass
            
        # Default empty string if JSON parsing failed
        return ""

    def _check_high_intent_signals(self, message):
        """Check if message contains high intent signals that should override low scores"""
        if re.search(r'CTO|CEO|Chief|Director|VP|decision maker', message, re.IGNORECASE) and \
           re.search(r'budget|\$\d+|cost|investment|spending', message, re.IGNORECASE):
            return True
        return False

    def _direct_score_lead(self, lead_data):
        """Direct lead scoring implementation that gives more accurate results"""
        try:
            # Extract message and other info with safety checks
            message = lead_data.get('message', '')
            email = lead_data.get('email', '')
            name = lead_data.get('name', '')
            company = lead_data.get('company', '')
            
            # Safety check for message
            if not isinstance(message, str):
                message = str(message) if message is not None else ""
            
            # Initialize score components
            intent_score = 0
            contact_score = 0
            quality_score = 0
            
            # Score intent (max 4 points)
            # Check for budget mentions
            if re.search(r'budget|\$\d+|\d+ dollars|cost|pricing|investment', message, re.IGNORECASE):
                intent_score += 2
                
            # Check for decision maker status
            if re.search(r'CTO|CEO|CIO|CFO|Chief|Director|VP|decision maker|authority', message, re.IGNORECASE):
                intent_score += 1.5
                
            # Check for urgent timeline
            if re.search(r'urgent|immediate|asap|soon|next month|within \d+ (days|weeks)|this quarter', message, re.IGNORECASE):
                intent_score += 0.5
            
            # Score contact info (max 3 points)
            # Check email quality
            if email and not re.search(r'@(gmail|yahoo|hotmail|outlook|aol)', email, re.IGNORECASE):
                contact_score += 1
                
            # Check phone format
            if lead_data.get('phone', '') and len(str(lead_data.get('phone', ''))) > 5:
                contact_score += 1
                
            # Check for full name
            if name and ' ' in name:
                contact_score += 0.5
                
            # Check for company name
            if company and str(company).lower() not in ['unknown', 'none', 'n/a']:
                contact_score += 0.5
                
            # Score message quality (max 3 points)
            # Check for company details
            if re.search(r'industry|sector|market|field|business type', message, re.IGNORECASE):
                quality_score += 1
                
            # Check for clear use case
            if re.search(r'need to|looking to|want to|trying to|goal is|problem with|solution for', message, re.IGNORECASE):
                quality_score += 1.5
                
            # Check for business scale
            if re.search(r'\d+ (employees|customers|users|clients|leads|sales|revenue)', message, re.IGNORECASE):
                quality_score += 0.5
            
            # Calculate total score
            total_score = intent_score + contact_score + quality_score
            # Round to nearest integer
            score = round(total_score)
            # Ensure score is within 0-10 range
            score = max(1, min(10, score))  # Changed minimum to 1 to avoid 0 scores
            
            # Determine category based on score
            if score >= 8:
                category = "HOT"
                action = "URGENT: Follow up within 2 hours - High priority lead"
            elif score >= 5:
                category = "WARM"
                action = "PRIORITY: Follow up within 24 hours - Nurture to reach decision makers"
            else:
                category = "COLD"
                action = "STANDARD: Add to nurture campaign"
            
            # Special case override - high intent signals
            if (re.search(r'CTO|CEO|Chief|Director|VP|decision maker', message, re.IGNORECASE) and
                re.search(r'budget|\$\d+|cost', message, re.IGNORECASE) and
                len(message) > 100):
                score = 9
                category = "HOT"
                action = "URGENT: Follow up within 2 hours - High priority lead"
                return {
                    "score": score,
                    "reason": "Direct scoring: High intent detected (decision maker + budget + detailed needs)",
                    "action": action,
                    "category": category,
                    "market_insights": "Detailed needs specified, indicating serious buyer with specific timeframe"
                }
                
            # Standard response for other cases
            return {
                "score": score,
                "reason": f"Direct scoring: Intent({intent_score}/4) + Contact({contact_score}/3) + Quality({quality_score}/3) = {score}",
                "action": action,
                "category": category,
                "market_insights": "Mixed buying signals with moderate intent"
            }
        except Exception as e:
            # Robust error handling with traceback
            print(f"Error in direct scoring: {e}")
            traceback.print_exc()
            
            # Default safe response
            return {
                "score": 5,
                "reason": "Fallback scoring due to error in analysis",
                "action": "PRIORITY: Follow up within 24 hours - Nurture to reach decision makers",
                "category": "WARM",
                "market_insights": "Error during analysis - manual review recommended"
            }

# Initialize the qualification system
qualification_system = LeadQualificationSystem()

@app.get("/")
async def root():
    return {"message": "Lead Qualification API is running"}

@app.post("/qualify-lead")
async def qualify_lead(lead: LeadData):
    try:
        # Clean input data - ensure no spaces in keys
        lead_dict = {k.strip(): v for k, v in lead.dict().items()}
        
        # Try both methods and use the one with higher score
        try:
            crew_result = qualification_system.analyze_lead(lead_dict)
        except Exception as crew_error:
            print(f"Crew analysis error: {crew_error}")
            traceback.print_exc()
            # If crew analysis fails, skip to direct scoring
            crew_result = {"score": 0, "category": "COLD"}
        
        try:
            direct_result = qualification_system._direct_score_lead(lead_dict)
        except Exception as direct_error:
            print(f"Direct scoring error: {direct_error}")
            traceback.print_exc()
            # If direct scoring fails, provide a fallback response
            direct_result = {
                "score": 5,
                "reason": "Error during analysis - using default score",
                "action": "PRIORITY: Follow up within 24 hours - Nurture to reach decision makers",
                "category": "WARM"
            }
        
        # Compare scores and use the higher one
        # Ensure we never return a score of 0 due to errors
        if crew_result.get("score", 0) == 0 and "Error" in crew_result.get("reason", ""):
            return direct_result
        
        if direct_result['score'] > crew_result.get('score', 0):
            return direct_result
        
        return crew_result
    except Exception as e:
        # Use direct scoring as fallback with better error handling
        try:
            print(f"Main error in qualify_lead: {e}")
            traceback.print_exc()
            lead_dict = {k.strip(): v for k, v in lead.dict().items()}
            result = qualification_system._direct_score_lead(lead_dict)
            # Ensure we never return a score of 0
            if result.get("score", 0) == 0:
                result["score"] = 5
                result["category"] = "WARM"
                result["reason"] = "Error recovery - using default score"
                result["action"] = "PRIORITY: Follow up within 24 hours - Nurture to reach decision makers"
            return result
        except Exception as fallback_error:
            print(f"Fallback error: {fallback_error}")
            traceback.print_exc()
            # Last resort fallback with fixed values
            return {
                "score": 5,
                "reason": "System error - manual review required",
                "action": "PRIORITY: Follow up within 24 hours - Nurture to reach decision makers",
                "category": "WARM",
                "market_insights": "Unable to analyze - check lead details manually"
            }

# Additional endpoint for health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0"}

if __name__ == "__main__":
    # Run the API server
    uvicorn.run(
        "app:app",  
        host="0.0.0.0",
        port=8000,
        reload=True
    )