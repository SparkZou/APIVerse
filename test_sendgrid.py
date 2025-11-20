import os
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Load from backend/.env
load_dotenv("backend/.env")

api_key = os.getenv("SENDGRID_API_KEY")
from_email = os.getenv("SENDGRID_FROM_EMAIL", "support@smartbot.co.nz")

print(f"Testing SendGrid with Key: {api_key[:5]}...")
print(f"From Email: {from_email}")

message = Mail(
    from_email=from_email,
    to_emails='test@example.com',
    subject='Test Email',
    html_content='<strong>Test</strong>'
)

try:
    sg = SendGridAPIClient(api_key)
    response = sg.send(message)
    print(f"Status Code: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'body'):
        print(f"Body: {e.body}")
