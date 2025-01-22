import requests
import json
import traceback

# URLs
webhook_url = "https://hook.eu2.make.com/z2t98fek6llh43lihtjknw27iga7sirc"
fastapi_url = "https://2dbc-2001-861-3505-5b30-4839-54f0-b583-6ae5.ngrok-free.app/qualify-lead"  # Your ngrok URL

test_data = {
    "name": "Michael Smith",
    "email ": "m.smith@techstartup.io",    # Space after 'email'
    "phone ": "415-555-0123",              # Space after 'phone'
    "company ": "TechStartup Solutions",    # Space after 'company'
    "message ": """Looking for information about AI integration possibilities. 
                  Our startup is growing and we might need automation soon.
                  Currently have a team of 5 developers.
                  I'm a developer interested in your solution.
                  Hoping to learn more about pricing options.""",
    "source": "Make Integration"
}

# Test cases for different lead qualities
hot_lead = {
    "name": "Sarah Johnson",
    "email ": "sarah.johnson@enterprise.com",
    "phone ": "415-555-9876",
    "company ": "Enterprise Solutions Inc",
    "message ": """Urgently seeking AI automation solution for our customer service department.
                  I'm the CTO and have budget approved for immediate implementation.
                  Need to automate 500+ daily customer interactions within next month.
                  Currently spending $2M annually on manual processes.
                  Please contact me ASAP to discuss implementation timeline.""",
    "source": "Make Integration"
}

warm_lead = {
    "name": "Michael Smith",
    "email ": "m.smith@techstartup.io",
    "phone ": "415-555-0123",
    "company ": "TechStartup Solutions",
    "message ": """Looking for information about AI integration possibilities. 
                  Our startup is growing and we might need automation soon.
                  Currently have a team of 5 developers.
                  I'm a developer interested in your solution.
                  Hoping to learn more about pricing options.""",
    "source": "Make Integration"
}

cold_lead = {
    "name": "John Doe",
    "email ": "john@gmail.com",
    "phone ": "555-123-4567",
    "company ": "Unknown Company",
    "message ": """Just browsing different AI solutions.
                  Might be interested in learning more.
                  No immediate plans or timeline.
                  Please send some information.""",
    "source": "Make Integration"
}

def validate_test_data(data):
    required_fields = {
        "name": str,
        "email ": str,
        "phone ": str,
        "company ": str,
        "message ": str
    }
    
    for field, field_type in required_fields.items():
        if field not in data:
            print(f"Warning: Missing required field '{field}'")
        elif not isinstance(data[field], field_type):
            print(f"Warning: Field '{field}' should be {field_type.__name__}")
        elif not data[field]:
            print(f"Warning: Empty value for field '{field}'")

# Use it before sending
validate_test_data(test_data)

def test_lead_qualification(lead_data):
    try:
        print(f"\n=== Testing Lead: {lead_data['name']} ===")
        validate_test_data(lead_data)
        
        print("\n=== Test Data Being Sent ===")
        print(json.dumps(lead_data, indent=2))
        
        # Send to FastAPI for analysis
        print("\n=== Sending to FastAPI for Analysis ===")
        api_response = requests.post(fastapi_url, json=lead_data)
        print(f"API Response Status Code: {api_response.status_code}")
        print(f"API Analysis Results: {api_response.json()}")
        
        # Send to Make webhook
        print("\n=== Sending to Make Webhook ===")
        webhook_response = requests.post(webhook_url, json=lead_data)
        print(f"Webhook Response Status Code: {webhook_response.status_code}")
        print(f"Webhook Response: {webhook_response.text}")
        print("=" * 80)
        
    except Exception as e:
        print(f"Error testing lead: {str(e)}")
        traceback.print_exc()

# Run tests for all lead types
print("\n=== Starting Lead Qualification Tests ===")
print("\nTesting HOT Lead...")
test_lead_qualification(hot_lead)

print("\nTesting WARM Lead...")
test_lead_qualification(warm_lead)

print("\nTesting COLD Lead...")
test_lead_qualification(cold_lead)