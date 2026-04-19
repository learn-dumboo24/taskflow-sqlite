import BaseModel from './BaseModel';
import { CategoryData } from '../types';

class Category extends BaseModel {
  private _userId: number | null;
  private _name: string;
  private _color: string;

  constructor(data: CategoryData = {}) {
    super(data);
    this._userId = data.user_id ?? null;
    this._name = data.name ?? '';
    this._color = data.color ?? '#3b82f6';
  }

  get user_id(): number | null { return this._userId; }
  get name(): string { return this._name; }
  get color(): string { return this._color; }

  set name(v: string) {
    if (!v || v.trim().length < 1) throw new Error('Category name is required');
    this._name = v.trim();
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this._name || this._name.trim().length < 1) errors.push('Category name is required');
    if (!this._userId) errors.push('user_id is required');
    return errors;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      user_id: this._userId,
      name: this._name,
      color: this._color,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  getSummary(): string {
    return `Category[${this.id}]: "${this._name}" (${this._color})`;
  }
}

export default Category;
