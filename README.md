# APIVerse

![APIVerse Dashboard](assets/dashboard.png)

**APIVerse** is a next-generation SaaS platform designed to unify communication APIs. It provides a high-performance, developer-friendly interface for managing Email, SMS, and AI Chatbot integrations.

Built with a modern tech stack, APIVerse offers a seamless experience from registration to API key management and usage analytics.

## 🚀 Features

-   **Unified Dashboard**: A cyberpunk-inspired, high-end dashboard to monitor all your services in one place.
-   **Multi-Channel Support**:
    -   📧 **Email API**: High deliverability transactional emails.
    -   💬 **SMS API**: Global SMS reach with low latency.
    -   🤖 **AI Chatbot**: Integrated AI conversational agents.
-   **Real-time Analytics**: Interactive SVG charts and data visualization for usage tracking.
-   **Secure Authentication**: Robust user management with secure password hashing and JWT-based sessions.
-   **Developer First**: Easy API key management and comprehensive documentation.

## 🛠 Tech Stack

### Frontend
-   **Framework**: [React](https://reactjs.org/) (Vite)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Language**: TypeScript

### Backend
-   **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
-   **Database**: MySQL (SQLAlchemy ORM)
-   **Security**: Passlib (PBKDF2), OAuth2 (JWT)
-   **Language**: Python 3.10+

## 📦 Installation

### Prerequisites
-   Node.js (v16+)
-   Python (v3.10+)
-   MySQL Server

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the server:
    ```bash
    uvicorn app.main:app --reload
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ by [Spark Zou](https://github.com/sparkzou)*
