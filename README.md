# KinyarwandaLearn

A polished language-learning app for Kinyarwanda beginners and intermediate learners.

## Requirements
- Node.js 18+
- MySQL 8+ (optional for production persistence)

## Quick launch

### 1) Frontend
```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL in the terminal, usually http://localhost:5173

### 2) Backend
In a second terminal:
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

API health check:
- http://localhost:5000/api/health

## Database setup
If you want to connect MySQL and save real user data, run the SQL in `database/schema.sql` in MySQL before starting the backend.

The app also includes a safe demo mode, so it can still run without a database connection.

## Included pages
Home, Learn, Lessons, Quizzes, Progress, Dictionary, Translation, Tutors, Forum, Resources, Pricing, Contact, Login, Register, Admin Dashboard.
