from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Annotated, Optional
from ..database import SessionLocal
from ..models import APIKey, User, KnowledgeBase
from ..schemas import FileSearchResponse, SearchResult
from ..services.file_search import file_search_service
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/widget",
    tags=["widget"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

class WidgetSearchRequest(BaseModel):
    query: str
    knowledge_base_id: Optional[int] = None # Optional if API key is bound to default KB, but usually passed by widget config

async def verify_api_key(
    x_api_key: Annotated[str, Header()] = None,
    db: Session = Depends(get_db)
) -> User:
    if not x_api_key:
        raise HTTPException(status_code=403, detail="API Key header missing")
    
    key_record = db.query(APIKey).filter(APIKey.key == x_api_key).first()
    if not key_record:
        raise HTTPException(status_code=403, detail="Invalid API Key")
        
    return key_record.user

@router.get("/config/{api_key}")
def get_widget_config(
    api_key: str,
    db: db_dependency
):
    """
    Get configuration for the widget based on API Key.
    Returns the user's preferred settings and available knowledge bases.
    """
    key_record = db.query(APIKey).filter(APIKey.key == api_key).first()
    if not key_record:
        raise HTTPException(status_code=404, detail="Invalid API Key")
        
    user = key_record.user
    
    # Get first knowledge base as default if not specified
    kb = db.query(KnowledgeBase).filter(KnowledgeBase.user_id == user.id).first()
    kb_id = kb.id if kb else None
    
    return {
        "valid": True,
        "company_name": user.company_name,
        "company_url": user.company_url or "https://web.smartbot.co.nz",
        "default_knowledge_base_id": kb_id,
        "theme": {
            "primaryColor": "#6366f1", # Default Indigo
            "position": "bottom-right"
        }
    }

@router.post("/search", response_model=FileSearchResponse)
def widget_search(
    request: WidgetSearchRequest,
    user: Annotated[User, Depends(verify_api_key)],
    db: db_dependency
):
    """
    Public search endpoint for the widget.
    Usage is charged to the owner of the API Key.
    """
    if not request.knowledge_base_id:
        # Try to find a default KB
        kb = db.query(KnowledgeBase).filter(KnowledgeBase.user_id == user.id).first()
        if not kb:
            raise HTTPException(status_code=400, detail="No knowledge base specified or found")
        request.knowledge_base_id = kb.id
    else:
        # Verify KB belongs to user
        kb = db.query(KnowledgeBase).filter(
            KnowledgeBase.id == request.knowledge_base_id,
            KnowledgeBase.user_id == user.id
        ).first()
        if not kb:
            raise HTTPException(status_code=404, detail="Knowledge base not accessible")

    results = file_search_service.search(
        db,
        user.id,
        request.knowledge_base_id,
        request.query
    )
    
    remaining = file_search_service.check_quota(db, user.id)
    
    return FileSearchResponse(
        results=results,
        remaining_quota=remaining
    )
