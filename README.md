# TaskFlow — Task Manager with FollowUp System

A full-stack task management app. Create tasks with due dates. Miss a deadline — system automatically creates a followup with escalation levels.

## Tech Stack
- **Backend**: Node.js, Express, SQLite (better-sqlite3)
- **Frontend**: React, Vite
- **Auth**: JWT + bcrypt + RBAC

## Architecture
```
backend/src/
  controllers/   → handle HTTP request/response
  services/      → business logic
  repositories/  → database access only
  models/        → OOP classes (User, Task, FollowUp)
  middleware/    → auth, RBAC, error handling
  utils/         → scheduler, date helpers, jwt
  database/      → db connection + migrations
```

## Features
- CRUD tasks with due dates
- Auto followup generation for overdue tasks
- Followup escalation: Level 1 → 2 → 3
- Role-Based Access Control: Admin sees all, User sees own
- JWT authentication

## Setup
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## API Endpoints
```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/followups
PATCH  /api/followups/:id/resolve
```
