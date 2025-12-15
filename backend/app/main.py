from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routers import users, subscriptions, api_services, file_search, widget
import os

# Create tables (for simple local dev without alembic run initially)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="APIverse API",
    description="Enterprise API Subscription Platform for Email, SMS, and Chatbots",
    version="1.0.0"
)

# CORS configuration - Allow all origins for troubleshooting
# After confirming it works, you can restrict to specific origins
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
    "http://localhost:8001",
    "https://web.smartbot.co.nz",      # Production frontend
    "https://apiverse.smartbot.co.nz", # Production API (same-origin)
    "https://smartbot.co.nz",          # Main domain
    "http://web.smartbot.co.nz",       # HTTP version (in case)
    "http://apiverse.smartbot.co.nz",  # HTTP version (in case)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for debugging
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(users.router)
app.include_router(subscriptions.router)
app.include_router(api_services.router)
app.include_router(file_search.router)
app.include_router(widget.router)

# Mount static files for widget
# This serves files from the widget/dist directory at /widget path
# Try multiple possible paths for flexibility across different deployment setups
possible_widget_paths = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "widget", "dist"),  # ../../../widget/dist
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "widget", "dist"),  # ../../widget/dist
    os.path.join(os.getcwd(), "widget", "dist"),  # ./widget/dist from cwd
    r"C:\webroot\Projects\APIVerse.smartbot.co.nz\widget\dist",  # Production server path
]

widget_dist_path = None
for path in possible_widget_paths:
    if os.path.exists(path):
        widget_dist_path = path
        break

if widget_dist_path:
    app.mount("/widget", StaticFiles(directory=widget_dist_path), name="widget")
    print(f"Widget static files mounted from: {widget_dist_path}")
else:
    print(f"Warning: Widget dist directory not found. Tried: {possible_widget_paths}")

@app.get("/")
def read_root():
    return {"message": "Welcome to APIverse API"}
