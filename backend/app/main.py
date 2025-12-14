from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import users, subscriptions, api_services, file_search, widget

# Create tables (for simple local dev without alembic run initially)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="APIverse API",
    description="Enterprise API Subscription Platform for Email, SMS, and Chatbots",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173", # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(subscriptions.router)
app.include_router(api_services.router)
app.include_router(file_search.router)
app.include_router(widget.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to APIverse API"}
