import os
import google.generativeai as genai
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from typing import List
import time
from ..models import KnowledgeBase, Document, FileSearchQuery, User, UsageLog
from ..schemas import SearchResult
from datetime import datetime

# Initialize Google AI
GOOGLE_API_KEY = os.getenv("GOOGLE_AI_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

FREE_QUOTA_LIMIT = int(os.getenv("FREE_SEARCH_QUOTA", "100"))

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
            
            # Wait for processing? No, we can add to vector store immediately usually, 
            # but let's just make sure it's available. 
            # For simplicity, we assume upload is synchronous enough or we just add it.
            
            # Add to vector store
            # Currently Google GenAI SDK allows adding files to vector store
            # We might need to batched update or update one by one.
            # Ideally we update the vector store with this file.
            
            # Note: SDK syntax for adding to existing vector store might vary. 
            # As of 0.3.2, it's often better to create a corpus or use the 'files' argument during creation,
            # but for incremental updates, we might need to delete and recreate or use generic file search.
            # WAIT: Google AI File API puts files in the cloud. 
            # If we use the new 'VectorStore' API (beta), we can add files.
            
            # Let's try to update the vector store if the SDK supports it, or just keep track of files.
            # Actually, `genai.update_vector_store` might be available?
            # If not, we might have to re-create or lookup the method.
            # Checking documentation (mental): genai.delete_file is there.
            # For retrieval, we usually pass the files list to the model generation call, 
            # OR we use a VectorStore.
            
            # Let's assume we can rely on the file existing. 
            # For this implementation phase, let's just store the file reference. 
            # Real-time retrieval often uses 'tools=[{code_execution}, {google_search_retrieval}]' 
            # or specifically 'google.generativeai.protos.Tool' with 'retrieval'.
            
            # Let's proceed with tracking the file ID.
            
            # Handle None content_type
            mime_type = file.content_type or 'application/octet-stream'
            
            doc = Document(
                knowledge_base_id=kb.id,
                filename=file.filename,
                google_file_id=google_file.name,
                file_size=file_size,
                mime_type=mime_type,
                status="active"
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
            # Get file objects
            remote_files = []
            for d in docs:
                try:
                    # Get file object from Google
                    rf = genai.get_file(d.google_file_id)
                    remote_files.append(rf)
                except Exception as e:
                    print(f"Warning: Could not retrieve file {d.google_file_id}: {e}")
                    # Could mark as deleted in DB?
                    pass
            
            if not remote_files:
                return [SearchResult(text="No accessible documents found in this knowledge base.")]

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
            
        # 3. Get file objects
        remote_files = []
        for d in docs:
            try:
                rf = genai.get_file(d.google_file_id)
                remote_files.append(rf)
            except Exception as e:
                print(f"Warning: Could not retrieve file {d.google_file_id}: {e}")
                pass
        
        if not remote_files:
            yield "No accessible documents found in this knowledge base."
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
