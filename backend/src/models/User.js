const bcrypt = require('bcryptjs');
const BaseModel = require('./BaseModel');
const config = require('../config/config');

class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name || '';
    this.email = data.email || '';
    this.password_hash = data.password_hash || '';
    this.role = data.role || 'user';
    this.is_active = data.is_active !== undefined ? data.is_active : 1;
  }

  async setPassword(plainText) {
    this.password_hash = await bcrypt.hash(plainText, config.bcryptSaltRounds);
  }

  async checkPassword(plainText) {
    return bcrypt.compare(plainText, this.password_hash);
  }

  isAdmin() {
    return this.role === 'admin';
  }

  validate() {
    const errors = [];
    if (!this.name || this.name.trim().length < 2) errors.push('Name must be at least 2 characters');
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) errors.push('Invalid email');
    return errors;
  }

  toJSON() {
    const json = super.toJSON();
    delete json.password_hash;
    return json;
  }
}

module.exports = User;
