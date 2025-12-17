import os
import google.generativeai as genai
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from typing import List
import time
import base64
from ..models import KnowledgeBase, Document, FileSearchQuery, User, UsageLog
from ..schemas import SearchResult
from datetime import datetime, timedelta

# Initialize Google AI
GOOGLE_API_KEY = os.getenv("GOOGLE_AI_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

FREE_QUOTA_LIMIT = int(os.getenv("FREE_SEARCH_QUOTA", "100"))

# Google AI files expire after 48 hours, we refresh at 47 hours to be safe
GOOGLE_FILE_EXPIRY_HOURS = 47

class FileSearchService:
    def get_quota_usage(self, db: Session, user_id: int) -> int:
        """Calculate total number of search queries made by user"""
        return db.query(FileSearchQuery).filter(FileSearchQuery.user_id == user_id).count()

    def check_quota(self, db: Session, user_id: int):
        """Raise error if quota exceeded"""
        usage = self.get_quota_usage(db, user_id)
        if usage >= FREE_QUOTA_LIMIT:
            raise HTTPException(
                status_code=402, 
                detail=f"Free quota exceeded ({FREE_QUOTA_LIMIT} calls). Please upgrade your plan."
            )
        return FREE_QUOTA_LIMIT - usage

    def create_knowledge_base(self, db: Session, user_id: int, name: str, description: str = None):
        """Create a new knowledge base (Logical grouping)"""
        # In this implementation, KB is just a logical container in DB
        # We don't create a persistent Google Vector Store object
        
        kb = KnowledgeBase(
            user_id=user_id,
            name=name,
            description=description,
            google_vector_store_id="logical-kb" 
        )
        db.add(kb)
        db.commit()
        db.refresh(kb)
        return kb

    async def upload_document(self, db: Session, user_id: int, knowledge_base_id: int, file: UploadFile):
        """Upload document to Google AI and add to vector store"""
        kb = db.query(KnowledgeBase).filter(
            KnowledgeBase.id == knowledge_base_id, 
            KnowledgeBase.user_id == user_id
        ).first()
        
        if not kb:
            raise HTTPException(status_code=404, detail="Knowledge base not found")

        # Save file temporarily
        temp_filename = f"temp_{file.filename}"
        with open(temp_filename, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            file_size = len(content)

        try:
            # Upload to Google AI (using genai imported at top of file)
            print(f"DEBUG: genai version: {genai.__version__}")
            google_file = genai.upload_file(path=temp_filename, display_name=file.filename)
            
            # Read file content for potential re-upload later (Google files expire in 48h)
            with open(temp_filename, "rb") as f:
                file_content_bytes = f.read()
            # Store as base64 for text column compatibility
            file_content_b64 = base64.b64encode(file_content_bytes).decode('utf-8')
            
            # Handle None content_type
            mime_type = file.content_type or 'application/octet-stream'
            
            # Calculate expiry time (48 hours from now, but we use 47 to be safe)
            expires_at = datetime.utcnow() + timedelta(hours=GOOGLE_FILE_EXPIRY_HOURS)
            
            doc = Document(
                knowledge_base_id=kb.id,
                filename=file.filename,
                google_file_id=google_file.name,
                file_size=file_size,
                mime_type=mime_type,
                status="active",
                file_content=file_content_b64,
                google_file_expires_at=expires_at
            )
            db.add(doc)
            db.commit()
            db.refresh(doc)
            
            return doc
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload to Google AI: {str(e)}")
        finally:
            if os.path.exists(temp_filename):
                os.remove(temp_filename)

    def delete_document(self, db: Session, user_id: int, knowledge_base_id: int, document_id: int):
        """Delete a document from knowledge base and Google AI"""
        # Verify ownership
        kb = db.query(KnowledgeBase).filter(
            KnowledgeBase.id == knowledge_base_id,
            KnowledgeBase.user_id == user_id
        ).first()
        
        if not kb:
            raise HTTPException(status_code=404, detail="Knowledge base not found")
        
        doc = db.query(Document).filter(
            Document.id == document_id,
            Document.knowledge_base_id == knowledge_base_id
        ).first()
        
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Try to delete from Google AI
        try:
            genai.delete_file(doc.google_file_id)
            print(f"DEBUG: Deleted file {doc.google_file_id} from Google AI")
        except Exception as e:
            print(f"Warning: Could not delete file from Google AI: {e}")
            # Continue with local deletion even if Google delete fails
        
        # Delete from database
        db.delete(doc)
        db.commit()
        
        return {"message": "Document deleted successfully"}

    def _reupload_expired_file(self, db: Session, doc: Document) -> str:
        """Re-upload an expired file to Google AI and update the document record"""
        if not doc.file_content:
            print(f"Cannot re-upload {doc.filename}: no stored content")
            return None
            
        try:
            # Decode the stored base64 content
            file_content_bytes = base64.b64decode(doc.file_content)
            
            # Write to temp file
            temp_filename = f"temp_reupload_{doc.filename}"
            with open(temp_filename, "wb") as f:
                f.write(file_content_bytes)
            
            try:
                # Upload to Google AI
                google_file = genai.upload_file(path=temp_filename, display_name=doc.filename)
                
                # Update document record
                doc.google_file_id = google_file.name
                doc.google_file_expires_at = datetime.utcnow() + timedelta(hours=GOOGLE_FILE_EXPIRY_HOURS)
                doc.status = "active"
                db.commit()
                
                print(f"Re-uploaded expired file {doc.filename} -> {google_file.name}")
                return google_file.name
            finally:
                if os.path.exists(temp_filename):
                    os.remove(temp_filename)
                    
        except Exception as e:
            print(f"Failed to re-upload {doc.filename}: {e}")
            doc.status = "expired"
            db.commit()
            return None

    def _get_valid_file(self, db: Session, doc: Document):
        """Get a valid Google AI file object, re-uploading if expired"""
        # Check if file is expired or about to expire
        now = datetime.utcnow()
        is_expired = (doc.google_file_expires_at and doc.google_file_expires_at < now)
        
        if is_expired:
            print(f"File {doc.filename} is expired, attempting re-upload...")
            new_file_id = self._reupload_expired_file(db, doc)
            if not new_file_id:
                return None
        
        # Try to get the file from Google AI
        try:
            rf = genai.get_file(doc.google_file_id)
            return rf
        except Exception as e:
            error_str = str(e)
            # Check if it's a 403/404 error (file expired or deleted)
            if "403" in error_str or "404" in error_str or "not exist" in error_str.lower():
                print(f"File {doc.filename} not accessible, attempting re-upload...")
                new_file_id = self._reupload_expired_file(db, doc)
                if new_file_id:
                    try:
                        return genai.get_file(new_file_id)
                    except Exception as e2:
                        print(f"Still cannot access re-uploaded file: {e2}")
                        return None
            else:
                print(f"Error accessing file {doc.google_file_id}: {e}")
                return None

    def search(self, db: Session, user_id: int, knowledge_base_id: int, query_text: str):
        """Perform semantic search using Google AI"""
        # 1. Check quota
        self.check_quota(db, user_id)
        
        # 2. Get knowledge base and docs
        kb = db.query(KnowledgeBase).filter(
            KnowledgeBase.id == knowledge_base_id,
            KnowledgeBase.user_id == user_id
        ).first()
        
        if not kb:
            raise HTTPException(status_code=404, detail="Knowledge base not found")
            
        docs = db.query(Document).filter(Document.knowledge_base_id == kb.id).all()
        if not docs:
            return []
            
        # 3. Perform search
        # We will use the generative model to answer based on these files.
        # This acts as a RAG system.
        file_uris = [d.google_file_id for d in docs]
        
        # Note: We need to properly attach files to the generation request
        # The SDK constructs a content query.
        
        model = genai.GenerativeModel('gemini-flash-latest')
        
        # Track usage
        usage = FileSearchQuery(
            user_id=user_id,
            knowledge_base_id=knowledge_base_id,
            query_text=query_text
        )
        db.add(usage)
        
        # Log generic usage
        log = UsageLog(
            user_id=user_id,
            service_type="file_search",
            status="success",
            details=f"KB: {kb.name}"
        )
        db.add(log)
        db.commit()
        
        try:
            # We use the generate_content with context
            # Get file objects (with automatic re-upload of expired files)
            remote_files = []
            for d in docs:
                rf = self._get_valid_file(db, d)
                if rf:
                    remote_files.append(rf)
            
            if not remote_files:
                return [SearchResult(text="No accessible documents found in this knowledge base. Please try re-uploading your documents.")]

            # RAG System Prompt - This is the key to good responses!
            # Supports multiple languages (Chinese, English, etc.)
            system_prompt = """You are a helpful multilingual AI assistant that answers questions based on the provided documents.

IMPORTANT INSTRUCTIONS:
1. RESPOND IN THE SAME LANGUAGE as the user's question (if user asks in Chinese, respond in Chinese; if English, respond in English)
2. ONLY answer based on information found in the provided documents
3. If the user's question is a greeting (like "hello", "hi", "你好", "嗨"), respond with a friendly greeting in their language and briefly describe what information is available in the documents
4. If the information is not in the documents, say "I couldn't find specific information about that in the documents" (in the user's language)
5. Provide clear, concise, and helpful answers
6. Use a friendly, conversational tone
7. Format your response nicely - use bullet points or numbered lists when appropriate
8. Keep responses focused and not too long unless the user asks for detailed information

Remember: You are a helpful AI assistant for documentation. Be professional and supportive."""

            # Construct the full prompt
            user_prompt = f"""Based on the attached documents, please answer the following question.
Reply in the same language as the question.

User Question: {query_text}

Please provide a helpful and relevant response."""

            # Construct prompt parts: system instruction, files, then user query
            prompt_parts = remote_files + [system_prompt + "\n\n" + user_prompt]
            
            # Configure safety settings to be less restrictive for normal Q&A
            safety_settings = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_ONLY_HIGH"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"},
            ]
            
            response = model.generate_content(
                prompt_parts,
                safety_settings=safety_settings
            )
            
            # Check if response was blocked or empty
            if not response.candidates:
                return [SearchResult(
                    text="抱歉，我无法处理这个请求。请尝试用其他方式提问。\n\nSorry, I couldn't process this request. Please try rephrasing your question.",
                    score=0.0,
                    source_document="system"
                )]
            
            candidate = response.candidates[0]
            
            # Check finish reason
            if candidate.finish_reason and candidate.finish_reason != 1:  # 1 = STOP (normal)
                # Check if there's still text content
                if candidate.content and candidate.content.parts:
                    response_text = candidate.content.parts[0].text
                else:
                    return [SearchResult(
                        text="抱歉，我无法回答这个问题。请尝试其他问题。\n\nSorry, I couldn't answer this question. Please try a different one.",
                        score=0.0,
                        source_document="system"
                    )]
            else:
                # Normal response
                response_text = response.text
            
            return [SearchResult(
                text=response_text,
                score=1.0, 
                source_document="combined"
            )]
            
        except Exception as e:
            error_msg = str(e)
            print(f"Search failed: {error_msg}")
            
            # Provide user-friendly error message
            if "finish_reason" in error_msg or "Part" in error_msg:
                return [SearchResult(
                    text="抱歉，AI 暂时无法处理您的问题。请尝试换一种方式提问。\n\nSorry, the AI couldn't process your question. Please try rephrasing it.",
                    score=0.0,
                    source_document="system"
                )]
            
            raise HTTPException(status_code=500, detail=f"Search failed: {error_msg}")

    async def search_stream(self, db: Session, user_id: int, knowledge_base_id: int, query_text: str):
        """Perform streaming semantic search using Google AI - yields text chunks"""
        import asyncio
        
        # 1. Check quota
        self.check_quota(db, user_id)
        
        # 2. Get knowledge base and docs
        kb = db.query(KnowledgeBase).filter(
            KnowledgeBase.id == knowledge_base_id,
            KnowledgeBase.user_id == user_id
        ).first()
        
        if not kb:
            yield "Knowledge base not found."
            return
            
        docs = db.query(Document).filter(Document.knowledge_base_id == kb.id).all()
        if not docs:
            yield "No documents found in this knowledge base."
            return
            
        # 3. Get file objects (with automatic re-upload of expired files)
        remote_files = []
        for d in docs:
            rf = self._get_valid_file(db, d)
            if rf:
                remote_files.append(rf)
        
        if not remote_files:
            yield "No accessible documents found in this knowledge base. Please try re-uploading your documents."
            return

        # Track usage
        usage = FileSearchQuery(
            user_id=user_id,
            knowledge_base_id=knowledge_base_id,
            query_text=query_text
        )
        db.add(usage)
        
        log = UsageLog(
            user_id=user_id,
            service_type="file_search_stream",
            status="success",
            details=f"KB: {kb.name}"
        )
        db.add(log)
        db.commit()

        # RAG System Prompt
        system_prompt = """You are a helpful multilingual AI assistant that answers questions based on the provided documents.

IMPORTANT INSTRUCTIONS:
1. RESPOND IN THE SAME LANGUAGE as the user's question (if user asks in Chinese, respond in Chinese; if English, respond in English)
2. ONLY answer based on information found in the provided documents
3. If the user's question is a greeting (like "hello", "hi", "你好", "嗨"), respond with a friendly greeting in their language and briefly describe what information is available in the documents
4. If the information is not in the documents, say "I couldn't find specific information about that in the documents" (in the user's language)
5. Provide clear, concise, and helpful answers
6. Use a friendly, conversational tone
7. Format your response nicely - use bullet points or numbered lists when appropriate
8. Keep responses focused and not too long unless the user asks for detailed information

Remember: You are a helpful AI assistant for documentation. Be professional and supportive."""

        user_prompt = f"""Based on the attached documents, please answer the following question.
Reply in the same language as the question.

User Question: {query_text}

Please provide a helpful and relevant response."""

        prompt_parts = remote_files + [system_prompt + "\n\n" + user_prompt]
        
        # Configure safety settings
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_ONLY_HIGH"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"},
        ]

        try:
            model = genai.GenerativeModel('gemini-flash-latest')
            
            # Use streaming generation
            response = model.generate_content(
                prompt_parts,
                safety_settings=safety_settings,
                stream=True  # Enable streaming!
            )
            
            # Iterate through chunks and yield with small delay for proper streaming
            for chunk in response:
                if chunk.text:
                    yield chunk.text
                    # Small delay to ensure proper chunk delivery
                    await asyncio.sleep(0.01)
                    
        except Exception as e:
            error_msg = str(e)
            print(f"Stream search failed: {error_msg}")
            
            if "finish_reason" in error_msg or "Part" in error_msg:
                yield "抱歉，AI 暂时无法处理您的问题。请尝试换一种方式提问。"
            else:
                yield f"Error: {error_msg}"

file_search_service = FileSearchService()
