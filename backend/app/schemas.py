from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .models import PlanType

class SubscriptionBase(BaseModel):
    plan_type: PlanType

class SubscriptionCreate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    id: int
    start_date: datetime
    is_active: bool

    class Config:
        from_attributes = True

class APIKeyBase(BaseModel):
    label: str

class APIKey(APIKeyBase):
    id: int
    key: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    company_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    subscription: Optional[Subscription] = None
    api_keys: List[APIKey] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
