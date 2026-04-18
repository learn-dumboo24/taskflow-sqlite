import bcrypt from 'bcryptjs';
import BaseModel from './BaseModel';
import { UserData, UserRole } from '../types';
import config from '../config/config';

class User extends BaseModel {
  // TypeScript private — access modifiers enforced at compile time (Encapsulation)
  private _name: string;
  private _email: string;
  private _passwordHash: string;
  private readonly _role: UserRole;
  private _isActive: boolean;

  constructor(data: UserData = {}) {
    super(data);
    this._name = data.name ?? '';
    this._email = data.email ?? '';
    this._passwordHash = data.password_hash ?? '';
    this._role = data.role ?? 'user';
    this._isActive = data.is_active !== undefined ? Boolean(data.is_active) : true;
  }

  // Getters — read-only access to private state
  get name(): string { return this._name; }
  get email(): string { return this._email; }
  get role(): UserRole { return this._role; }
  get is_active(): number { return this._isActive ? 1 : 0; }

  // Setters — write access with built-in validation
  set name(v: string) {
    if (!v || v.trim().length < 2) throw new Error('Name must be at least 2 characters');
    this._name = v.trim();
  }

  set email(v: string) {
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new Error('Invalid email address');
    this._email = v.toLowerCase().trim();
  }

  // Behaviour methods — logic encapsulated inside the object
  async setPassword(plainText: string): Promise<void> {
    if (!plainText || plainText.length < 6) throw new Error('Password must be at least 6 characters');
    this._passwordHash = await bcrypt.hash(plainText, config.bcryptSaltRounds);
  }

  async checkPassword(plainText: string): Promise<boolean> {
    return bcrypt.compare(plainText, this._passwordHash);
  }

  isAdmin(): boolean {
    return this._role === 'admin';
  }

  deactivate(): void {
    this._isActive = false;
  }

  // Polymorphism — User's own implementation of validate()
  validate(): string[] {
    const errors: string[] = [];
    if (!this._name || this._name.trim().length < 2) errors.push('Name must be at least 2 characters');
    if (!this._email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) errors.push('Invalid email');
    return errors;
  }

  // Polymorphism — User's own toJSON() (password never exposed)
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this._name,
      email: this._email,
      role: this._role,
      is_active: this._isActive ? 1 : 0,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Separate persistence object — password_hash exposed ONLY here
  toPersistenceObject(): Record<string, unknown> {
    return { ...this.toJSON(), password_hash: this._passwordHash };
  }

  // Polymorphism — User's own getSummary()
  getSummary(): string {
    return `User[${this.id}]: ${this._name} <${this._email}> (${this._role})`;
  }
}

export default User;
