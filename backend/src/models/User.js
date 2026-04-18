const bcrypt = require('bcryptjs');
const BaseModel = require('./BaseModel');
const config = require('../config/config');

class User extends BaseModel {
  // Private fields — data is hidden from outside (Encapsulation)
  #name;
  #email;
  #passwordHash;
  #role;
  #isActive;

  constructor(data = {}) {
    super(data);
    this.#name = data.name || '';
    this.#email = data.email || '';
    this.#passwordHash = data.password_hash || '';
    this.#role = data.role || 'user';
    this.#isActive = data.is_active !== undefined ? Boolean(data.is_active) : true;
  }

  // Getters — outside world reads through controlled interface
  get name() { return this.#name; }
  get email() { return this.#email; }
  get role() { return this.#role; }
  get is_active() { return this.#isActive ? 1 : 0; }

  // Setters with built-in validation — data can't be set to invalid state
  set name(v) {
    if (!v || v.trim().length < 2) throw new Error('Name must be at least 2 characters');
    this.#name = v.trim();
  }

  set email(v) {
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new Error('Invalid email address');
    this.#email = v.toLowerCase().trim();
  }

  // Behavior methods — business logic lives inside the object
  async setPassword(plainText) {
    if (!plainText || plainText.length < 6) throw new Error('Password must be at least 6 characters');
    this.#passwordHash = await bcrypt.hash(plainText, config.bcryptSaltRounds);
  }

  async checkPassword(plainText) {
    return bcrypt.compare(plainText, this.#passwordHash);
  }

  isAdmin() {
    return this.#role === 'admin';
  }

  deactivate() {
    this.#isActive = false;
  }

  // Polymorphism — User's own version of validate()
  validate() {
    const errors = [];
    if (!this.#name || this.#name.trim().length < 2) errors.push('Name must be at least 2 characters');
    if (!this.#email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.#email)) errors.push('Invalid email');
    return errors;
  }

  // Polymorphism — User's own version of toJSON() (password excluded)
  toJSON() {
    return {
      id: this.id,
      name: this.#name,
      email: this.#email,
      role: this.#role,
      is_active: this.#isActive ? 1 : 0,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Separate method for persistence — password_hash included only here
  toPersistenceObject() {
    return { ...this.toJSON(), password_hash: this.#passwordHash };
  }

  // Polymorphism — User's own version of getSummary()
  getSummary() {
    return `User[${this.id}]: ${this.#name} <${this.#email}> (${this.#role})`;
  }
}

module.exports = User;
