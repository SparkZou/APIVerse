from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# For production/MySQL:
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./apiverse.db")
# For local development/demo (easier to run immediately):
# SQLALCHEMY_DATABASE_URL = "sqlite:///./apiverse.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
