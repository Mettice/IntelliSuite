import os
import json
from dotenv import load_dotenv
from app import qualification_system

# Load environment variables
load_dotenv()

def test_direct_scoring():
    """Test the direct scoring method without CrewAI"""
    
    # Hot lead test case
    hot_lead = {
        "name": "Sarah Johnson",
        "email": "sarah.johnson@techcorp.com",
        "phone": "+1-458-789-3456",
        "company": "TechCorp Solutions",
        "message": "I'm the CTO at TechCorp and we urgently need to implement your lead qualification system by next month. We have a budget of $50,000 for this project and we're evaluating 2-3 vendors this week. Our sales team of 35 people needs better qualification tools as we're getting 300+ leads weekly.",
        "source": "Web Form"
    }

    # Warm lead test case
    warm_lead = {
        "name": "Michael Rodriguez",
        "email": "m.rodriguez@midmarket.co",
        "phone": "+1-332-555-7890",
        "company": "Midmarket Enterprises",
        "message": "We're looking to improve our lead qualification process. Your solution looks interesting. Could you provide some pricing information and case studies? We may implement something in the next quarter.",
        "source": "Web Form"
    }

    # Cold lead test case
    cold_lead = {
        "name": "John Smith",
        "email": "johnsmith@gmail.com",
        "phone": "+1-123-456-7890",
        "company": "Unknown",
        "message": "Please send me more information about your services.",
        "source": "Web Form"
    }
    
    # Test direct scoring
    print("\n=== Testing Direct Scoring ===")
    
    print("\nHOT lead:")
    hot_result = qualification_system._direct_score_lead(hot_lead)
    print(json.dumps(hot_result, indent=2))
    
    print("\nWARM lead:")
    warm_result = qualification_system._direct_score_lead(warm_lead)
    print(json.dumps(warm_result, indent=2))
    
    print("\nCOLD lead:")
    cold_result = qualification_system._direct_score_lead(cold_lead)
    print(json.dumps(cold_result, indent=2))

if __name__ == "__main__":
    test_direct_scoring() 