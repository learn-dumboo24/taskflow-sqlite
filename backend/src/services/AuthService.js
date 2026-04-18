const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserRepository = require('../repositories/UserRepository');
const config = require('../config/config');

class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(name, email, password) {
    const existing = this.userRepo.findByEmail(email);
    if (existing) throw new Error('Email already registered');

    const user = new User({ name, email });
    const errors = user.validate();
    if (errors.length > 0) throw new Error(errors.join(', '));
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

    await user.setPassword(password);

    // toPersistenceObject() — only place password_hash is exposed
    const { id, created_at, updated_at, ...persistData } = user.toPersistenceObject();
    const row = this.userRepo.create({ ...persistData, role: 'user' });

    const token = this._generateToken(row);
    return { user: new User(row).toJSON(), token };
  }

  async login(email, password) {
    const row = this.userRepo.findByEmail(email);
    if (!row) throw new Error('Invalid email or password');
    if (!row.is_active) throw new Error('Account is deactivated');

    const user = new User(row);
    const valid = await user.checkPassword(password);
    if (!valid) throw new Error('Invalid email or password');

    const token = this._generateToken(row);
    return { user: user.toJSON(), token };
  }

  _generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }
}

module.exports = AuthService;
