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

class APIKeyCreate(BaseModel):
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
    company_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    company_name: Optional[str] = None
    company_url: Optional[str] = None

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

class DocumentBase(BaseModel):
    filename: str
    file_size: int
    mime_type: str

class Document(DocumentBase):
    id: int
    google_file_id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class KnowledgeBaseBase(BaseModel):
    name: str
    description: Optional[str] = None

class KnowledgeBaseCreate(KnowledgeBaseBase):
    pass

class KnowledgeBase(KnowledgeBaseBase):
    id: int
    google_vector_store_id: Optional[str] = None
    created_at: datetime
    documents: List[Document] = []

    class Config:
        from_attributes = True

class FileSearchRequest(BaseModel):
    query: str
    knowledge_base_id: int

class SearchResult(BaseModel):
    text: str
    score: Optional[float] = None
    source_document: Optional[str] = None

class FileSearchResponse(BaseModel):
    results: List[SearchResult]
    remaining_quota: int

