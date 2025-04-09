import os
import json
from dotenv import load_dotenv
from langchain_openai import OpenAI
import re

# Load environment variables
load_dotenv()

class SimpleLeadQualifier:
    """A simplified version of the lead qualification system that bypasses CrewAI"""
    
    def __init__(self):
        # Initialize OpenAI
        self.llm = OpenAI(
            temperature=0.2,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    def get_action_by_category(self, category: str, score: int) -> str:
        if category == "HOT":
            return "URGENT: Follow up within 2 hours - High priority lead"
        elif category == "WARM":
            return "PRIORITY: Follow up within 24 hours - Nurture to reach decision makers"
        else:  # COLD
            return "STANDARD: Add to nurture campaign"
    
    def _determine_category(self, score):
        """Determine lead category based on score"""
        if score >= 8: return "HOT"
        elif score >= 5: return "WARM"
        else: return "COLD"
    
    def qualify_lead(self, lead_data):
        """Directly qualify a lead using OpenAI, no CrewAI"""
        print(f"Processing lead: {lead_data['name']}")
        
        # Build prompt with scoring criteria
        prompt = f"""
        You are a strict Lead Scoring Agent. Score this lead EXACTLY according to these criteria.
        COUNT POINTS EXPLICITLY AND SHOW YOUR WORK.

        SCORING CRITERIA (Total 10 points):
        1. Intent Level (4 points):
           - Clear budget mention (+2): Must explicitly mention budget/cost/spending
           - Decision maker status (+1.5): Must be CxO, Director, or explicitly mention decision-making authority
           - Urgent timeline (+0.5): Must specify immediate need or timeline under 3 months

        2. Contact Info (3 points):
           - Valid business email (+1): Must be company email, not generic
           - Valid phone (+1): Must have proper format
           - Full name (+0.5): Must have first and last name
           - Company name (+0.5): Must be specific company name

        3. Company/Message Quality (3 points):
           - Specific company details (+1): Must mention industry or company type
           - Clear use case (+1.5): Must specify exact problem to solve
           - Business scale mentioned (+0.5): Must include numbers (employees, customers, etc.)

        SCORING RULES:
        - HOT: Score 8-10 points
        - WARM: Score 5-7 points
        - COLD: Score 0-4 points

        Lead Information:
        Name: {lead_data['name']}
        Email: {lead_data['email']}
        Phone: {lead_data['phone']}
        Company: {lead_data['company']}
        Message: {lead_data['message']}

        RESPOND WITH EXACTLY THIS FORMAT AS A VALID JSON:
        {{
            "score": <number between 0-10>,
            "reason": "Intent(<points>/4): [explain points], Contact(<points>/3): [explain points], Quality(<points>/3): [explain points]",
            "category": "<HOT/WARM/COLD based on score>"
        }}
        """
        
        # Get response from OpenAI
        print("Sending to OpenAI...")
        response = self.llm.invoke(prompt)
        print(f"Raw response: {response}")
        
        # Extract JSON from response
        try:
            # Try to parse the entire response as JSON
            result = json.loads(response)
            print("Successfully parsed response as JSON")
        except json.JSONDecodeError:
            # Try to find a JSON block in the response
            print("Trying to extract JSON block...")
            json_pattern = r'\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}'
            json_match = re.search(json_pattern, response)
            
            if json_match:
                json_str = json_match.group(0)
                print(f"Found JSON block: {json_str}")
                try:
                    result = json.loads(json_str)
                    print("Successfully parsed JSON block")
                except json.JSONDecodeError as e:
                    print(f"Error parsing JSON block: {e}")
                    # Fall back to manual scoring
                    score = self._manual_score(lead_data, response)
                    category = self._determine_category(score)
                    result = {
                        "score": score,
                        "reason": f"Manual scoring: {response[:200]}...",
                        "category": category
                    }
            else:
                print("No JSON found in response, using manual scoring")
                # Fall back to manual scoring
                score = self._manual_score(lead_data, response)
                category = self._determine_category(score)
                result = {
                    "score": score,
                    "reason": f"Manual scoring: {response[:200]}...",
                    "category": category
                }
        
        # Add action based on category
        if "action" not in result:
            result["action"] = self.get_action_by_category(result["category"], result["score"])
        
        return result
    
    def _manual_score(self, lead_data, response_text=None):
        """Manual scoring as a fallback"""
        print("Performing manual scoring...")
        score = 0
        message = lead_data['message'].lower()
        email = lead_data['email'].lower()
        
        # Intent Level (4 points)
        # Budget mention
        if re.search(r'budget|cost|\$\d+|\d+ dollars|financial|invest(ment)?|spend', message):
            score += 2
            print("Added 2 points for budget mention")
        
        # Decision maker
        if re.search(r'cto|ceo|cio|chief|director|vp|decision maker|authority', message):
            score += 1.5
            print("Added 1.5 points for decision maker")
        
        # Urgency
        if re.search(r'urgent|immediately|asap|tomorrow|next week|this month|next month', message):
            score += 0.5
            print("Added 0.5 points for urgency")
        
        # Contact Info (3 points)
        # Business email
        if not re.search(r'@gmail|@yahoo|@hotmail|@outlook|@aol|@icloud', email):
            score += 1
            print("Added 1 point for business email")
        
        # Valid phone
        if re.search(r'\+\d', lead_data['phone']):
            score += 1
            print("Added 1 point for valid phone")
        
        # Full name
        if ' ' in lead_data['name']:
            score += 0.5
            print("Added 0.5 points for full name")
        
        # Company name
        if lead_data['company'] and lead_data['company'].lower() not in ['unknown', 'none', 'na', 'n/a']:
            score += 0.5
            print("Added 0.5 points for company name")
        
        # Quality (3 points)
        # Specific company details
        if re.search(r'tech|software|retail|manufacturing|healthcare|financial|insurance|banking', message):
            score += 1
            print("Added 1 point for company details")
        
        # Clear use case
        if re.search(r'need|looking for|interested in|want to|implement|solution|problem|challenge', message) and len(message) > 50:
            score += 1.5
            print("Added 1.5 points for clear use case")
        
        # Business scale
        if re.search(r'\d+ employees|\d+ customers|\d+ leads|\d+ clients|\d+ users|\d+ people', message):
            score += 0.5
            print("Added 0.5 points for business scale")
        
        return score

def test_leads():
    # Initialize qualifier
    qualifier = SimpleLeadQualifier()
    
    # Test HOT lead
    hot_lead = {
        "name": "Sarah Johnson",
        "email": "sarah.johnson@techcorp.com",
        "phone": "+1-458-789-3456",
        "company": "TechCorp Solutions",
        "message": "I'm the CTO at TechCorp and we urgently need to implement your lead qualification system by next month. We have a budget of $50,000 for this project and we're evaluating 2-3 vendors this week. Our sales team of 35 people needs better qualification tools as we're getting 300+ leads weekly.",
        "source": "Web Form"
    }
    
    # Test WARM lead  
    warm_lead = {
        "name": "Michael Rodriguez",
        "email": "m.rodriguez@midmarket.co",
        "phone": "+1-332-555-7890",
        "company": "Midmarket Enterprises",
        "message": "We're looking to improve our lead qualification process. Your solution looks interesting. Could you provide some pricing information and case studies? We may implement something in the next quarter.",
        "source": "Web Form"
    }
    
    # Test COLD lead
    cold_lead = {
        "name": "John Smith",
        "email": "johnsmith@gmail.com", 
        "phone": "+1-123-456-7890",
        "company": "Unknown",
        "message": "Please send me more information about your services.",
        "source": "Web Form"
    }
    
    # Run tests
    print("\n=== Testing HOT Lead ===")
    hot_result = qualifier.qualify_lead(hot_lead)
    print(f"Result: {json.dumps(hot_result, indent=2)}")
    
    print("\n=== Testing WARM Lead ===")
    warm_result = qualifier.qualify_lead(warm_lead)
    print(f"Result: {json.dumps(warm_result, indent=2)}")
    
    print("\n=== Testing COLD Lead ===")
    cold_result = qualifier.qualify_lead(cold_lead)
    print(f"Result: {json.dumps(cold_result, indent=2)}")

if __name__ == "__main__":
    print("=== Simple Lead Qualification Test ===")
    
    # Check for API key
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: OPENAI_API_KEY environment variable is not set")
        exit(1)
    
    test_leads() 