import BaseModel from './BaseModel';
import { TaskData, TaskStatus, TaskPriority } from '../types';

// Defines which transitions are valid from each state (State Machine)
const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  pending:     ['in_progress', 'completed'],
  in_progress: ['pending', 'completed'],
  completed:   [],
};

const VALID_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

class Task extends BaseModel {
  private readonly _userId: number | null;
  private _title: string;
  private _description: string;
  private _status: TaskStatus;
  private _priority: TaskPriority;
  private _dueDate: string | null;

  constructor(data: TaskData = {}) {
    super(data);
    this._userId = data.user_id ?? null;
    this._title = data.title ?? '';
    this._description = data.description ?? '';
    this._status = data.status ?? 'pending';
    this._priority = data.priority ?? 'medium';
    this._dueDate = data.due_date ?? null;
  }

  // Getters
  get user_id(): number | null { return this._userId; }
  get title(): string { return this._title; }
  get description(): string { return this._description; }
  get status(): TaskStatus { return this._status; }
  get priority(): TaskPriority { return this._priority; }
  get due_date(): string | null { return this._dueDate; }

  // Computed property — derived from private state, no setter
  get isOverdue(): boolean {
    return !!this._dueDate && new Date(this._dueDate) < new Date() && this._status !== 'completed';
  }

  // Setter with type checking + validation
  set priority(v: TaskPriority) {
    if (!VALID_PRIORITIES.includes(v)) throw new Error(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    this._priority = v;
  }

  // State machine — rejects invalid transitions (Encapsulation)
  // Example: 'completed' → 'in_progress' throws
  transition(newStatus: TaskStatus): void {
    const allowed = VALID_TRANSITIONS[this._status];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Cannot transition from '${this._status}' to '${newStatus}'`);
    }
    this._status = newStatus;
  }

  // Polymorphism — Task's own validate()
  validate(): string[] {
    const errors: string[] = [];
    if (!this._title || this._title.trim().length === 0) errors.push('Title is required');
    if (!this._dueDate) errors.push('Due date is required');
    if (this._dueDate && isNaN(Date.parse(this._dueDate))) errors.push('Invalid due date format');
    if (!VALID_PRIORITIES.includes(this._priority)) errors.push('Invalid priority');
    return errors;
  }

  // Polymorphism — Task's own toJSON()
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      user_id: this._userId,
      title: this._title,
      description: this._description,
      status: this._status,
      priority: this._priority,
      due_date: this._dueDate,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Polymorphism — Task's own getSummary()
  getSummary(): string {
    const overdueTag = this.isOverdue ? ' ⚠ OVERDUE' : '';
    return `Task[${this.id}]: "${this._title}" [${this._status}/${this._priority}] due: ${this._dueDate}${overdueTag}`;
  }
}

export default Task;
