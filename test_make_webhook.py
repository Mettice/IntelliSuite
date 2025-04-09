import requests
import json
import time

# Make.com webhook URL
WEBHOOK_URL = "https://hook.eu2.make.com/dduf09xlbr3857g1davz382xi4k547qf"

def test_webhook(category):
    """Test webhook with a specific lead category"""
    print(f"\n\nTesting webhook with {category} lead")
    print("-" * 50)
    
    # Create a test payload based on category
    payload = {
        "lead": {
            "id": f"test-{category.lower()}-{int(time.time())}",
            "name": f"Test {category}",
            "email": f"{category.lower()}@example.com",
            "phone": "+1-555-123-4567",
            "company": "Test Company",
            "message": f"This is a test {category} lead for webhook testing",
            "score": 9 if category == "HOT" else 6 if category == "WARM" else 3,
            "category": category,
            "reason": f"Test reason for {category} lead",
            "action": f"Test action for {category} lead",
            "createdAt": "2023-04-08"
        },
        "followup": {
            "needsImmediate": category == "HOT",
            "nextActionDate": "2023-04-09",
            "assignedTo": "test@example.com"
        },
        "system": {
            "source": "webhook_test",
            "qualifiedBy": "test_script",
            "version": "1.0"
        }
    }
    
    # Print the payload
    print("Payload:")
    print(json.dumps(payload, indent=2))
    
    try:
        # Send the request
        response = requests.post(WEBHOOK_URL, json=payload)
        
        # Print the response
        print(f"Response status: {response.status_code}")
        print(f"Response text: {response.text}")
        
        if response.status_code == 200:
            print(f"✅ {category} lead webhook test successful")
        else:
            print(f"❌ {category} lead webhook test failed")
    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Make.com Webhook Test")
    print("====================")
    
    # Test with different lead categories
    test_webhook("HOT")
    time.sleep(2)  # Add delay between requests
    
    test_webhook("WARM")
    time.sleep(2)
    
    test_webhook("COLD")
    
    print("\nAll tests completed") 