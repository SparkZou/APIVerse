from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..services import email_service, twilio_service, chatbot_service, payment_service

router = APIRouter(
    prefix="/api/v1",
    tags=["services"]
)

class EmailRequest(BaseModel):
    to_email: str
    subject: str
    content: str

class SMSRequest(BaseModel):
    to_number: str
    body: str

class PhoneCallRequest(BaseModel):
    to_number: str
    url: str = "http://demo.twilio.com/docs/voice.xml"

class ChatRequest(BaseModel):
    message: str
    thread_id: str = None

class PaymentRequest(BaseModel):
    amount: int
    currency: str = "usd"
    plan_name: str = None
    interval: str = "month"

@router.post("/email/send")
async def send_email(request: EmailRequest):
    success, message = email_service.send_email(request.to_email, request.subject, request.content)
    if not success:
        # Return 400 Bad Request with the specific error message from the service
        raise HTTPException(status_code=400, detail=f"Failed to send email: {message}")
    return {"status": "sent", "message": message}

@router.post("/sms/send")
async def send_sms(request: SMSRequest):
    sid, message = twilio_service.send_sms(request.to_number, request.body)
    if not sid:
        raise HTTPException(status_code=400, detail=f"Failed to send SMS: {message}")
    return {"status": "sent", "sid": sid, "message": message}

@router.post("/phone/call")
async def make_phone_call(request: PhoneCallRequest):
    sid, message = twilio_service.make_call(request.to_number, request.url)
    if not sid:
        raise HTTPException(status_code=400, detail=f"Failed to initiate call: {message}")
    return {"status": "initiated", "sid": sid, "message": message}

@router.post("/chat/thread")
async def create_chat_thread():
    thread_id = chatbot_service.create_thread()
    if not thread_id:
        raise HTTPException(status_code=500, detail="Failed to create thread")
    return {"thread_id": thread_id}

@router.post("/chat/message")
async def chat_message(request: ChatRequest):
    if not request.thread_id:
        # Create a new thread if not provided
        request.thread_id = chatbot_service.create_thread()
    
    response = chatbot_service.send_message(request.thread_id, request.message)
    return {"response": response, "thread_id": request.thread_id}

@router.post("/payment/create-session")
async def create_payment_session(request: PaymentRequest):
    # In a real app, you'd get the customer email from the logged-in user
    # and look up or create a Stripe customer.
    # For this demo, we'll use a mock email or pass it in.
    
    # Use dynamic amount from request (defaulting to $10.00 if passed as 1000 cents)
    session = payment_service.create_checkout_session(
        customer_email="user@example.com",
        amount=request.amount,
        currency=request.currency,
        plan_name=request.plan_name,
        interval=request.interval,
        success_url="http://localhost:5173/dashboard?payment=success",
        cancel_url="http://localhost:5173/dashboard?payment=cancelled"
    )
    
    if not session:
        raise HTTPException(status_code=500, detail="Failed to create payment session")
    
    return {"checkout_url": session.get("url")}
