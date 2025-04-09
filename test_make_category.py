import requests
import json
import time

# Make.com webhook URL
WEBHOOK_URL = "https://hook.eu2.make.com/dduf09xlbr3857g1davz382xi4k547qf"

def send_test_lead(category):
    """Send a test lead with specified category directly to Make.com"""
    print(f"\n\nSending {category} Test Lead to Make.com")
    print("-" * 50)
    
    # Create specific test data for each category
    if category == "HOT":
        test_data = {
            "lead": {
                "id": f"hot-lead-{int(time.time())}",
                "name": "Executive Buyer",
                "email": "ceo@enterprise.com",
                "phone": "+1-555-123-4567",
                "company": "Fortune 500 Corp",
                "message": "As the CEO, I need your solution immediately. We have $100K budget approved.",
                "score": 9,
                "category": "HOT",
                "reason": "Decision maker with explicit budget and urgent need",
                "action": "URGENT: Contact within 2 hours - C-level with budget",
                "createdAt": "2023-04-08"
            },
            "followup": {
                "needsImmediate": True,
                "nextActionDate": "2023-04-08",
                "assignedTo": "sales@example.com"
            },
            "system": {
                "source": "category_test",
                "qualifiedBy": "manual_test",
                "version": "1.0"
            }
        }
    elif category == "WARM":
        test_data = {
            "lead": {
                "id": f"warm-lead-{int(time.time())}",
                "name": "Manager Susan",
                "email": "susan@midsize-company.com",
                "phone": "+1-555-987-6543",
                "company": "Midsize Business Inc.",
                "message": "We're interested in learning more about your solution. Might have budget next quarter.",
                "score": 6,
                "category": "WARM",
                "reason": "Manager-level with interest but no immediate budget",
                "action": "PRIORITY: Follow up within 24 hours - Nurture to decision maker",
                "createdAt": "2023-04-08"
            },
            "followup": {
                "needsImmediate": False,
                "nextActionDate": "2023-04-09",
                "assignedTo": "sales@example.com"
            },
            "system": {
                "source": "category_test",
                "qualifiedBy": "manual_test",
                "version": "1.0"
            }
        }
    else:  # COLD
        test_data = {
            "lead": {
                "id": f"cold-lead-{int(time.time())}",
                "name": "Generic Person",
                "email": "someone@gmail.com",
                "phone": "+1-555-111-2222",
                "company": "Unknown",
                "message": "Please send me some information.",
                "score": 3,
                "category": "COLD",
                "reason": "Generic request with no specific details, using personal email",
                "action": "STANDARD: Add to nurture campaign",
                "createdAt": "2023-04-08"
            },
            "followup": {
                "needsImmediate": False,
                "nextActionDate": "2023-04-15",
                "assignedTo": "marketing@example.com"
            },
            "system": {
                "source": "category_test",
                "qualifiedBy": "manual_test",
                "version": "1.0"
            }
        }
    
    # Print the payload
    print("Sending payload:")
    print(json.dumps(test_data, indent=2))
    
    try:
        # Send the request
        response = requests.post(WEBHOOK_URL, json=test_data)
        
        # Print the response
        print(f"Response status: {response.status_code}")
        print(f"Response text: {response.text}")
        
        if response.status_code == 200:
            print(f"✅ {category} test lead sent successfully!")
        else:
            print(f"❌ Failed to send {category} test lead")
    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Make.com Category Router Test")
    print("============================")
    print("This test will send 3 leads with explicit categories")
    
    # Test each category
    send_test_lead("HOT")
    time.sleep(2)  # Delay to prevent rate limiting
    
    send_test_lead("WARM")
    time.sleep(2)
    
    send_test_lead("COLD")
    
    print("\nAll test leads sent. Check Make.com execution history.") 