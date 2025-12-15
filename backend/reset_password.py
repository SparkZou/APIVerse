"""
Password Reset Script
Run this on the server to reset a user's password.

Usage:
    python reset_password.py <email> <new_password>

Example:
    python reset_password.py sparksqlmvp@gmail.com 123456
"""

import sys
from passlib.context import CryptContext
from app.database import SessionLocal
from app import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def reset_password(email: str, new_password: str):
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            print(f"❌ User with email '{email}' not found!")
            print("\nExisting users:")
            users = db.query(models.User).all()
            for u in users:
                print(f"  - {u.email} ({u.company_name})")
            return False
        
        # Hash the new password
        hashed_password = pwd_context.hash(new_password)
        user.hashed_password = hashed_password
        db.commit()
        
        print(f"✅ Password reset successfully for {email}")
        return True
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python reset_password.py <email> <new_password>")
        print("Example: python reset_password.py sparksqlmvp@gmail.com 123456")
        sys.exit(1)
    
    email = sys.argv[1]
    new_password = sys.argv[2]
    
    reset_password(email, new_password)
