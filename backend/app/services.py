import os
from dotenv import load_dotenv

load_dotenv()

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from twilio.rest import Client as TwilioClient
import stripe
from openai import OpenAI

# Initialize clients with environment variables
# In a real app, you would load these from os.environ

class EmailService:
    def __init__(self):
        self.api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("SENDGRID_FROM_EMAIL", "support@smartbot.co.nz")
        if self.api_key:
            print(f"EmailService: Loaded API Key (starts with {self.api_key[:4]}...)")
            self.client = SendGridAPIClient(self.api_key)
        else:
            print("EmailService: No API Key found, using Mock mode.")
            self.client = None

    def send_email(self, to_email: str, subject: str, content: str):
        if not self.client:
            print(f"[Mock] Sending email to {to_email}: {subject}")
            return True, "Mock email sent successfully"
        
        message = Mail(
            from_email=self.from_email,
            to_emails=to_email,
            subject=subject,
            html_content=content)
        try:
            response = self.client.send(message)
            if response.status_code in [200, 201, 202]:
                return True, "Email sent successfully"
            else:
                return False, f"SendGrid returned status {response.status_code}"
        except Exception as e:
            print(f"Error sending email: {e}")
            error_msg = str(e)
            if hasattr(e, 'body'):
                print(f"SendGrid Error Body: {e.body}")
                try:
                    # Try to decode bytes to string if needed
                    body_str = e.body.decode('utf-8') if isinstance(e.body, bytes) else str(e.body)
                    error_msg = f"{error_msg}: {body_str}"
                except:
                    pass
            
            # If 401, it might be a bad key or unverified sender
            if hasattr(e, 'status_code') and e.status_code == 401:
                print("Tip: Check if your SendGrid API Key is valid and has 'Mail Send' permissions.")
                error_msg += " (Unauthorized - Check API Key or Credits)"
            
            return False, error_msg

class TwilioService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_number = os.getenv("TWILIO_FROM_NUMBER")
        self.client = TwilioClient(self.account_sid, self.auth_token) if self.account_sid else None

    def send_sms(self, to_number: str, body: str):
        if not self.client:
            print(f"[Mock] Sending SMS to {to_number}: {body}")
            return "mock_sms_sid", "Mock SMS sent successfully"

        try:
            message = self.client.messages.create(
                body=body,
                from_=self.from_number,
                to=to_number
            )
            return message.sid, "SMS sent successfully"
        except Exception as e:
            print(f"Error sending SMS: {e}")
            error_msg = str(e)
            if "Authenticate" in error_msg or "20003" in error_msg:
                error_msg += " (Authentication Failed - Check Account SID and Auth Token)"
            return None, error_msg

    def make_call(self, to_number: str, url: str = "http://demo.twilio.com/docs/voice.xml"):
        if not self.client:
            print(f"[Mock] Making call to {to_number} with url {url}")
            return "mock_call_sid", "Mock call initiated successfully"

        try:
            call = self.client.calls.create(
                from_=self.from_number,
                to=to_number,
                url=url
            )
            return call.sid, "Call initiated successfully"
        except Exception as e:
            print(f"Error making call: {e}")
            error_msg = str(e)
            if "Authenticate" in error_msg or "20003" in error_msg:
                error_msg += " (Authentication Failed - Check Account SID and Auth Token)"
            return None, error_msg

class ChatbotService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.assistant_id = os.getenv("OPENAI_ASSISTANT_ID")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def create_thread(self):
        if not self.client:
            return "mock_thread_id"
        try:
            thread = self.client.beta.threads.create()
            return thread.id
        except Exception as e:
            print(f"Error creating thread: {e}")
            return None

    def send_message(self, thread_id: str, content: str):
        if not self.client:
            return f"[Mock AI Response] You said: {content}"
        
        try:
            # Add message to thread
            self.client.beta.threads.messages.create(
                thread_id=thread_id,
                role="user",
                content=content
            )

            # Run assistant
            run = self.client.beta.threads.runs.create(
                thread_id=thread_id,
                assistant_id=self.assistant_id
            )

            # Wait for completion (simplified for demo, ideally use async or webhooks)
            import time
            while run.status in ['queued', 'in_progress', 'cancelling']:
                time.sleep(1)
                run = self.client.beta.threads.runs.retrieve(
                    thread_id=thread_id,
                    run_id=run.id
                )

            if run.status == 'completed':
                messages = self.client.beta.threads.messages.list(
                    thread_id=thread_id
                )
                # Return the latest message from assistant
                for msg in messages.data:
                    if msg.role == "assistant":
                        return msg.content[0].text.value
            
            return "I'm thinking..."
            
        except Exception as e:
            print(f"Error in chatbot: {e}")
            return "Sorry, I encountered an error."

class PaymentService:
    def __init__(self):
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    
    def create_checkout_session(self, customer_email: str, success_url: str, cancel_url: str, price_id: str = None, amount: int = None, currency: str = "usd", plan_name: str = None, interval: str = "month"):
        if not stripe.api_key:
            print(f"[Mock] Creating Stripe session for {customer_email}")
            return {"id": "sess_mock_12345", "url": success_url}

        try:
            line_item = {}
            mode = 'subscription'
            
            if price_id:
                line_item = {
                    'price': price_id,
                    'quantity': 1,
                }
            elif amount and plan_name:
                # Ad-hoc subscription
                mode = 'subscription'
                line_item = {
                    'price_data': {
                        'currency': currency,
                        'product_data': {
                            'name': plan_name,
                        },
                        'unit_amount': amount, # Amount in cents
                        'recurring': {
                            'interval': interval,
                        },
                    },
                    'quantity': 1,
                }
            elif amount:
                mode = 'payment'
                line_item = {
                    'price_data': {
                        'currency': currency,
                        'product_data': {
                            'name': 'Account Funds',
                        },
                        'unit_amount': amount, # Amount in cents
                    },
                    'quantity': 1,
                }
            else:
                raise ValueError("Either price_id or amount must be provided")

            checkout_session = stripe.checkout.Session.create(
                customer_email=customer_email,
                line_items=[line_item],
                mode=mode,
                success_url=success_url,
                cancel_url=cancel_url,
            )
            return checkout_session
        except Exception as e:
            print(f"Error creating Stripe session: {e}")
            return None

email_service = EmailService()
twilio_service = TwilioService()
chatbot_service = ChatbotService()
payment_service = PaymentService()

