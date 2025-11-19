# APIverse - Enterprise API SaaS Platform

This is a full-stack SaaS platform for API subscriptions (Email, SMS, Chatbot).

## Project Structure

- `backend/`: Python FastAPI application
- `frontend/`: React + TypeScript + Tailwind CSS application

## Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL (Optional, defaults to SQLite for local demo)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.
   Docs are at `http://localhost:8000/docs`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Features

- **Landing Page**: Modern UI with animations and pricing tables.
- **Dashboard**: User usage statistics and API key management.
- **Authentication**: Mock registration and login flows.
- **API**: FastAPI backend with SQLAlchemy models.

## Configuration

- **Database**: By default, the backend uses SQLite (`apiverse.db`) for zero-config local development. To use MySQL, update `backend/app/database.py` and uncomment the MySQL connection string.
