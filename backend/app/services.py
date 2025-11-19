import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from twilio.rest import Client as TwilioClient
import stripe

# Initialize clients with environment variables
# In a real app, you would load these from os.environ

class EmailService:
    def __init__(self):
        self.api_key = os.getenv("SENDGRID_API_KEY")
        self.client = SendGridAPIClient(self.api_key) if self.api_key else None

    def send_email(self, to_email: str, subject: str, content: str):
        if not self.client:
            print(f"[Mock] Sending email to {to_email}: {subject}")
            return True
        
        message = Mail(
            from_email='noreply@apiverse.com',
            to_emails=to_email,
            subject=subject,
            html_content=content)
        try:
            response = self.client.send(message)
            return response.status_code in [200, 201, 202]
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

class SMSService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_number = os.getenv("TWILIO_FROM_NUMBER")
        self.client = TwilioClient(self.account_sid, self.auth_token) if self.account_sid else None

    def send_sms(self, to_number: str, body: str):
        if not self.client:
            print(f"[Mock] Sending SMS to {to_number}: {body}")
            return True

        try:
            message = self.client.messages.create(
                body=body,
                from_=self.from_number,
                to=to_number
            )
            return message.sid
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return False

class PaymentService:
    def __init__(self):
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    
    def create_checkout_session(self, customer_email: str, price_id: str, success_url: str, cancel_url: str):
        if not stripe.api_key:
            print(f"[Mock] Creating Stripe session for {customer_email}")
            return {"id": "sess_mock_12345", "url": success_url}

        try:
            checkout_session = stripe.checkout.Session.create(
                customer_email=customer_email,
                line_items=[
                    {
                        'price': price_id,
                        'quantity': 1,
                    },
                ],
                mode='subscription',
                success_url=success_url,
                cancel_url=cancel_url,
            )
            return checkout_session
        except Exception as e:
            print(f"Error creating Stripe session: {e}")
            return None

email_service = EmailService()
sms_service = SMSService()
payment_service = PaymentService()
