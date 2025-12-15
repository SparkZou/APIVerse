from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
from passlib.context import CryptContext
from typing import List
import secrets
import os
from datetime import datetime, timedelta
from jose import jwt

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# Use pbkdf2_sha256 which is pure python and doesn't have C-extension version conflicts
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "AICLOUD0610")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/login")
def login(user_credentials: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(status_code=403, detail="Invalid credentials")
    
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=403, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"token": access_token, "user": user}

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, company_name=user.company_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create a default API key for the user
    api_key = models.APIKey(key=f"sk_{secrets.token_hex(16)}", user_id=db_user.id, label="Default Key")
    db.add(api_key)
    db.commit()
    
    return db_user

@router.get("/me", response_model=schemas.User)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """Get current logged-in user's information including API keys"""
    return current_user

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/me", response_model=schemas.User)
def update_current_user(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    """Update current user's profile (company name, website URL)"""
    if user_update.company_name is not None:
        current_user.company_name = user_update.company_name
    if user_update.company_url is not None:
        current_user.company_url = user_update.company_url
    
    db.commit()
    db.refresh(current_user)
    return current_user

# API Keys Management
@router.get("/me/api-keys", response_model=List[schemas.APIKey])
def get_api_keys(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    """Get all API keys for current user"""
    api_keys = db.query(models.APIKey).filter(models.APIKey.user_id == current_user.id).all()
    return api_keys

@router.post("/me/api-keys", response_model=schemas.APIKey)
def create_api_key(key_data: schemas.APIKeyCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    """Create a new API key for current user"""
    new_key = models.APIKey(
        key=f"sk_{secrets.token_hex(16)}",
        user_id=current_user.id,
        label=key_data.label
    )
    db.add(new_key)
    db.commit()
    db.refresh(new_key)
    return new_key

@router.delete("/me/api-keys/{key_id}")
def delete_api_key(key_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    """Delete an API key"""
    api_key = db.query(models.APIKey).filter(
        models.APIKey.id == key_id,
        models.APIKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    db.delete(api_key)
    db.commit()
    return {"message": "API key deleted successfully"}

