# TaskFlow — Task Manager with FollowUp System

A full-stack TypeScript task management app built as a university project demonstrating OOP principles. Create tasks with due dates. Miss a deadline — system auto-creates a followup with escalation levels.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, SQLite (better-sqlite3)
- **Mobile**: Expo React Native, TypeScript
- **Auth**: JWT + bcrypt + RBAC
- **Tests**: Jest + ts-jest (38 unit tests)

---

## OOP Design Decisions

### 1. Encapsulation

All model fields are declared `private readonly` in TypeScript. External code can only read via getters — never mutate directly.

```typescript
// Task.ts
private _status: TaskStatus;

get status(): TaskStatus { return this._status; }

transition(newStatus: TaskStatus): void {
  const allowed = VALID_TRANSITIONS[this._status];
  if (!allowed.includes(newStatus)) throw new Error(`Invalid transition`);
  this._status = newStatus;
}
```

`User.password_hash` is `private` and never appears in `toJSON()`. Only exposed via `toPersistenceObject()` for DB writes. Password ops go through `setPassword()` / `checkPassword()` which encapsulate bcrypt internally.

### 2. Abstraction

`BaseModel` is an `abstract class` — cannot be instantiated directly. Forces every model to implement three methods at compile time:

```typescript
abstract class BaseModel {
  abstract validate(): string[];
  abstract toJSON(): Record<string, unknown>;
  abstract getSummary(): string;
  toString(): string { return this.getSummary(); }  // template method
}
```

`IRepository<T>` interface defines the contract; `BaseRepository<T>` provides the implementation. Controllers depend on services; services depend on repository abstractions — not direct DB calls.

### 3. Inheritance

```
BaseModel (abstract)
  ├── User
  ├── Task
  ├── FollowUp
  ├── Category
  └── Comment

BaseRepository<T> (abstract, implements IRepository<T>)
  ├── UserRepository
  ├── TaskRepository
  ├── FollowUpRepository
  ├── CategoryRepository
  └── CommentRepository
```

`BaseRepository<T>` provides `findById`, `findAll`, `create`, `update`, `delete` — inherited by all repositories. Subclasses only add domain-specific queries (e.g., `findByUserId`, `findOverdue`).

### 4. Polymorphism

Each model overrides `validate()`, `toJSON()`, and `getSummary()` with its own rules:

```typescript
// Task.ts
validate(): string[] {
  const errors: string[] = [];
  if (!this._title?.trim()) errors.push('Title required');
  if (!this._dueDate) errors.push('Due date required');
  return errors;
}

// FollowUp.ts
validate(): string[] {
  const errors: string[] = [];
  if (!this._message?.trim()) errors.push('Message required');
  if (![1, 2, 3].includes(this._level)) errors.push('Level must be 1, 2, or 3');
  return errors;
}
```

`toString()` in `BaseModel` calls `getSummary()` — same call, different behaviour per subclass (Template Method pattern).

---

## Design Patterns Used

| Pattern | Where | Why |
|---|---|---|
| **Repository** | `BaseRepository<T>` → subclasses | Separates DB access from business logic |
| **Factory** | `FollowUpFactory` | Centralises followup creation logic |
| **Singleton** | `getDB()` in `db.ts` | Single SQLite connection across app |
| **State Machine** | `Task.transition()` | Enforces valid status changes |
| **Template Method** | `BaseModel.toString()` calls `getSummary()` | Shared algorithm, subclass fills in details |
| **Observer/Scheduler** | `FollowUpScheduler` + node-cron | Decouples task-checking from HTTP layer |

---

## Architecture

```
backend/src/
  controllers/    → handle HTTP request/response
  services/       → business logic
  repositories/   → database access only
  models/         → OOP classes (User, Task, FollowUp, Category, Comment)
  factories/      → FollowUpFactory
  interfaces/     → IRepository<T>, IAuthService, IFollowUpService
  middleware/     → auth, RBAC, error handling
  utils/          → scheduler, date helpers, jwt
  database/       → db connection (singleton) + migrations
  config/         → typed config object
  __tests__/      → Jest unit tests (38 tests, 4 suites)

mobile/src/
  screens/        → LoginScreen, TasksScreen, FollowUpsScreen
  navigation/     → AppNavigator (stack + bottom tabs)
  services/       → ApiService, StorageService (OOP classes)
  context/        → AuthContext
  types/          → shared TypeScript interfaces
```

---

## Features
- CRUD tasks with due dates, priority, categories
- Comments on tasks
- Auto followup generation for overdue tasks
- Followup escalation: Level 1 → 2 → 3 (hourly cron)
- Role-Based Access Control: Admin sees all, User sees own
- JWT authentication with secure token storage on mobile
- Admin stats endpoint
- 38 unit tests covering all OOP principles

---

## Setup

```bash
# Backend
cd backend
npm install
npm run dev        # ts-node, port 3000
npm test           # Jest unit tests

# Mobile
cd mobile
npm install
npx expo start
```

---

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

GET    /api/categories
POST   /api/categories
DELETE /api/categories/:id

GET    /api/tasks/:id/comments
POST   /api/tasks/:id/comments

GET    /api/stats              (admin only)
```

---

## FollowUp Escalation Logic

| Days Overdue | Level | Action |
|---|---|---|
| 1+ day  | Level 1 | Gentle reminder |
| 3+ days | Level 2 | Urgent escalation |
| 7+ days | Level 3 | Critical escalation |

Scheduler runs every hour via node-cron. Resolving a followup marks the task as `completed`.

---

## Running Tests

```bash
cd backend
npm test
npm run test:coverage
```

Test suites:
- `models/Task.test.ts` — state machine, validation, overdue logic
- `models/FollowUp.test.ts` — escalate, resolve, guard conditions
- `models/User.test.ts` — password hashing, toJSON security, validation
- `oopDemo.test.ts` — explicit tests for all 4 OOP principles + design patterns
