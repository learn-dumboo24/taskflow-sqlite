import BaseModel from './BaseModel';
import { CommentData } from '../types';

class Comment extends BaseModel {
  private _taskId: number | null;
  private _userId: number | null;
  private _content: string;
  private readonly _userName?: string;

  constructor(data: CommentData = {}) {
    super(data);
    this._taskId = data.task_id ?? null;
    this._userId = data.user_id ?? null;
    this._content = data.content ?? '';
    this._userName = data.user_name;
  }

  get task_id(): number | null { return this._taskId; }
  get user_id(): number | null { return this._userId; }
  get content(): string { return this._content; }
  get user_name(): string | undefined { return this._userName; }

  validate(): string[] {
    const errors: string[] = [];
    if (!this._taskId) errors.push('task_id is required');
    if (!this._userId) errors.push('user_id is required');
    if (!this._content || this._content.trim().length < 1) errors.push('Content is required');
    return errors;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      task_id: this._taskId,
      user_id: this._userId,
      content: this._content,
      user_name: this._userName,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  getSummary(): string {
    return `Comment[${this.id}]: by user#${this._userId} on task#${this._taskId}`;
  }
}

export default Comment;
