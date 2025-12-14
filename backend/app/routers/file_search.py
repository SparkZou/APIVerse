from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Annotated
from ..database import SessionLocal
from ..models import User
from ..schemas import (
    KnowledgeBase, KnowledgeBaseCreate, 
    Document, 
    FileSearchRequest, FileSearchResponse, SearchResult
)
from ..services.file_search import file_search_service
from ..routers.users import get_current_user # Assuming auth is here

router = APIRouter(
    prefix="/api/file-search",
    tags=["file-search"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[User, Depends(get_current_user)]

@router.post("/knowledge-bases", response_model=KnowledgeBase)
def create_knowledge_base(
    kb: KnowledgeBaseCreate,
    current_user: user_dependency,
    db: db_dependency
):
    return file_search_service.create_knowledge_base(
        db, 
        current_user.id, 
        kb.name, 
        kb.description
    )

@router.get("/knowledge-bases", response_model=List[KnowledgeBase])
def list_knowledge_bases(
    current_user: user_dependency,
    db: db_dependency
):
    return current_user.knowledge_bases

@router.post("/knowledge-bases/{kb_id}/documents", response_model=Document)
async def upload_document(
    kb_id: int,
    current_user: user_dependency,
    db: db_dependency,
    file: UploadFile = File(...)
):
    try:
        print(f"DEBUG: Uploading file '{file.filename}' to KB {kb_id} for user {current_user.id}")
        result = await file_search_service.upload_document(db, current_user.id, kb_id, file)
        print(f"DEBUG: Upload successful, doc id: {result.id}")
        return result
    except Exception as e:
        print(f"ERROR: Upload failed: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise

@router.delete("/knowledge-bases/{kb_id}/documents/{doc_id}")
def delete_document(
    kb_id: int,
    doc_id: int,
    current_user: user_dependency,
    db: db_dependency
):
    return file_search_service.delete_document(db, current_user.id, kb_id, doc_id)

@router.post("/query", response_model=FileSearchResponse)
def search_documents(
    request: FileSearchRequest,
    current_user: user_dependency,
    db: db_dependency
):
    results = file_search_service.search(
        db,
        current_user.id,
        request.knowledge_base_id,
        request.query
    )
    
    remaining = file_search_service.check_quota(db, current_user.id)
    
    return FileSearchResponse(
        results=results,
        remaining_quota=remaining
    )

@router.get("/quota")
def get_quota(
    current_user: user_dependency,
    db: db_dependency
):
    used = file_search_service.get_quota_usage(db, current_user.id)
    limit = 100 # Should trigger from env or constant
    return {"used": used, "limit": limit, "remaining": limit - used}
