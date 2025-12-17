from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from .database import Base
import datetime
import enum

class PlanType(str, enum.Enum):
    STANDARD = "standard"
    ENTERPRISE = "enterprise"
    CUSTOM = "custom"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    company_name = Column(String(255))
    company_url = Column(String(500), nullable=True)  # Company website URL
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    subscription = relationship("Subscription", back_populates="user", uselist=False)
    api_keys = relationship("APIKey", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    usage_logs = relationship("UsageLog", back_populates="user")
    knowledge_bases = relationship("KnowledgeBase", back_populates="user")

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plan_type = Column(Enum(PlanType), default=PlanType.STANDARD)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime)
    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates="subscription")

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(255), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    label = Column(String(100)) # e.g., "Production", "Test"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="api_keys")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    stripe_charge_id = Column(String(255))
    amount = Column(Integer) # In cents
    currency = Column(String(10), default="usd")
    status = Column(String(50)) # succeeded, pending, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="payments")

class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    service_type = Column(String(50)) # email, sms, chatbot
    status = Column(String(50)) # success, failed
    details = Column(String(500)) # e.g. recipient email, message id
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="usage_logs")

class KnowledgeBase(Base):
    __tablename__ = "knowledge_bases"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255))
    description = Column(String(500))
    google_vector_store_id = Column(String(255))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="knowledge_bases")
    documents = relationship("Document", back_populates="knowledge_base")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    knowledge_base_id = Column(Integer, ForeignKey("knowledge_bases.id"))
    filename = Column(String(255))
    google_file_id = Column(String(255))
    file_size = Column(Integer)
    mime_type = Column(String(100))
    status = Column(String(50)) # pending, processing, active, failed, expired
    file_content = Column(String(50000), nullable=True)  # Store file content for re-upload
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    google_file_expires_at = Column(DateTime, nullable=True)  # Google files expire in 48h

    knowledge_base = relationship("KnowledgeBase", back_populates="documents")

class FileSearchQuery(Base):
    __tablename__ = "file_search_queries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    knowledge_base_id = Column(Integer, ForeignKey("knowledge_bases.id"))
    query_text = Column(String(5000)) # Long text support
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

