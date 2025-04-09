import requests
import json
import datetime

# HOT lead test case
hot_lead = {
    "name": "Sarah Johnson",
    "email": "sarah.johnson@techcorp.com",
    "phone": "+1-458-789-3456",
    "company": "TechCorp Solutions",
    "message": "I'm the CTO at TechCorp and we urgently need to implement your lead qualification system by next month. We have a budget of $50,000 for this project and we're evaluating 2-3 vendors this week. Our sales team of 35 people needs better qualification tools as we're getting 300+ leads weekly.",
    "source": "Web Form"
}

# WARM lead test case
warm_lead = {
    "name": "Michael Rodriguez",
    "email": "m.rodriguez@midmarket.co",
    "phone": "+1-332-555-7890",
    "company": "Midmarket Enterprises",
    "message": "We're looking to improve our lead qualification process. Your solution looks interesting. Could you provide some pricing information and case studies? We may implement something in the next quarter.",
    "source": "Web Form"
}

# COLD lead test case
cold_lead = {
    "name": "John Smith",
    "email": "johnsmith@gmail.com",
    "phone": "+1-123-456-7890",
    "company": "Unknown",
    "message": "Please send me more information about your services.",
    "source": "Web Form"
}

# API endpoint
api_url = "http://localhost:8000/qualify-lead"

def test_lead(lead_data):
    print(f"\n\nTesting lead: {lead_data['name']}")
    print("-" * 50)
    print(f"Email: {lead_data['email']}")
    print(f"Message: {lead_data['message'][:100]}...")
    
    try:
        response = requests.post(api_url, json=lead_data)
        if response.status_code == 200:
            result = response.json()
            print("\nQualification Result:")
            print(f"Score: {result['score']}/10")
            print(f"Category: {result['category']}")
            print(f"Action: {result['action']}")
            print(f"Reason: {result['reason'][:150]}...")
            
            # Now send to Make.com to test the integration
            print("\nSending to Make.com...")
            
            # Create timestamp
            current_date = datetime.datetime.now().strftime("%Y-%m-%d")
            
            # Structure the data exactly as shown in Make.com screenshot
            make_data = {
                "lead": {
                    "id": "test-" + lead_data['name'].replace(" ", "-").lower(),
                    "name": lead_data['name'],
                    "email": lead_data['email'],
                    "phone": lead_data['phone'],
                    "company": lead_data['company'],
                    "message": lead_data['message'],
                    "score": result['score'],
                    "category": result['category'],
                    "reason": result['reason'],
                    "action": result['action'],
                    "createdAt": current_date
                },
                "followup": {
                    "needsImmediate": result['category'] == 'HOT',
                    "nextActionDate": current_date,
                    "assignedTo": "sales@example.com"
                },
                "system": {
                    "source": "test_script",
                    "qualifiedBy": "ai_system",
                    "version": "1.0"
                }
            }
            
            print("Make.com payload:")
            print(json.dumps(make_data, indent=2))
            
            make_response = requests.post(
                "https://hook.eu2.make.com/dduf09xlbr3857g1davz382xi4k547qf", 
                json=make_data
            )
            print(f"Make.com Response: {make_response.status_code}")
            print(f"Response Text: {make_response.text}")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    print("Lead Qualification System Test")
    print("=============================")
    
    test_lead(hot_lead)
    test_lead(warm_lead)
    test_lead(cold_lead)
    
    print("\nTests completed.") 