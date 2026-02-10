# Project Idea — TaskFlow

## What I'm Building

A **task management system** where users can create tasks with due dates. If a task is not completed by its due date, the system automatically generates a **followup** for that task. FollowUps escalate over time if still ignored.

Think of it like a personal accountability system — it doesn't let you forget things.

## Core Problem

Most todo apps let you mark tasks as done — but they don't actively remind or escalate when you miss a deadline. TaskFlow solves this by treating missed deadlines as events that trigger a followup workflow.

## Scope

### What will be built
- User registration and login with JWT
- Role-based access: Admin and regular User
- Task CRUD with title, description, due date, status
- Automatic followup creation when task is overdue
- FollowUp escalation: Level 1 (gentle reminder) → Level 2 (urgent) → Level 3 (critical)
- Background scheduler that checks overdue tasks every hour
- REST API backend
- React frontend to interact with the system

### What will NOT be built (out of scope)
- Email/SMS notifications (only in-app)
- File attachments on tasks
- Team collaboration / shared tasks
- Mobile app

## Key Features

| Feature | Description |
|---|---|
| Task Creation | Title, description, due_date, priority (low/medium/high) |
| FollowUp Engine | Cron job scans overdue tasks, creates followups automatically |
| Escalation | Level 1 after 1 day overdue, Level 2 after 3 days, Level 3 after 7 days |
| RBAC | Admin can view/manage all users' tasks. User manages only their own |
| Auth | JWT-based stateless auth, bcrypt hashed passwords |

## Why SQLite

- Perfect for this kind of local-first, single-server application
- No external database setup needed
- better-sqlite3 gives synchronous API — simpler code for a student project
- Full SQL support: joins, transactions, foreign keys

## Design Principles Followed

- **OOP**: Model classes (User, Task, FollowUp) with encapsulated behavior
- **Layered Architecture**: Controller → Service → Repository (separation of concerns)
- **Repository Pattern**: All DB queries abstracted behind repository classes
- **Observer-like Pattern**: FollowUp scheduler observes task state and reacts
- **Factory Pattern**: FollowUp creation logic centralized in FollowUpFactory
