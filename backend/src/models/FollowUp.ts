import BaseModel from './BaseModel';
import { FollowUpData, FollowUpLevel, FollowUpStatus } from '../types';

const LEVEL_LABELS: Record<FollowUpLevel, string> = {
  1: 'Reminder',
  2: 'Urgent',
  3: 'Critical',
};

class FollowUp extends BaseModel {
  private readonly _taskId: number | null;
  private readonly _userId: number | null;
  private _level: FollowUpLevel;
  private _status: FollowUpStatus;
  private _message: string;
  private _resolvedAt: string | null;

  constructor(data: FollowUpData = {}) {
    super(data);
    this._taskId = data.task_id ?? null;
    this._userId = data.user_id ?? null;
    this._level = (data.level as FollowUpLevel) ?? 1;
    this._status = data.status ?? 'pending';
    this._message = data.message ?? '';
    this._resolvedAt = data.resolved_at ?? null;
  }

  // Getters
  get task_id(): number | null { return this._taskId; }
  get user_id(): number | null { return this._userId; }
  get level(): FollowUpLevel { return this._level; }
  get status(): FollowUpStatus { return this._status; }
  get message(): string { return this._message; }
  get resolved_at(): string | null { return this._resolvedAt; }

  get isResolved(): boolean { return this._status === 'resolved'; }

  // Level can only increase — prevents going backwards (Encapsulation)
  escalate(): void {
    if (this._status === 'resolved') throw new Error('Cannot escalate a resolved followup');
    if (this._level >= 3) return;
    this._level = (this._level + 1) as FollowUpLevel;
  }

  // Resolving sets timestamp atomically — caller cannot set arbitrary resolved_at
  resolve(): void {
    if (this.isResolved) throw new Error('FollowUp is already resolved');
    this._status = 'resolved';
    this._resolvedAt = new Date().toISOString();
  }

  // Polymorphism — FollowUp's own validate()
  validate(): string[] {
    const errors: string[] = [];
    if (!this._taskId) errors.push('task_id is required');
    if (!this._userId) errors.push('user_id is required');
    if (![1, 2, 3].includes(this._level)) errors.push('level must be 1, 2, or 3');
    if (!this._message) errors.push('message is required');
    return errors;
  }

  // Polymorphism — FollowUp's own toJSON()
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      task_id: this._taskId,
      user_id: this._userId,
      level: this._level,
      status: this._status,
      message: this._message,
      resolved_at: this._resolvedAt,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Polymorphism — FollowUp's own getSummary()
  getSummary(): string {
    const label = LEVEL_LABELS[this._level];
    return `FollowUp[${this.id}]: Level ${this._level} (${label}) for task #${this._taskId} — ${this._status}`;
  }
}

export default FollowUp;
