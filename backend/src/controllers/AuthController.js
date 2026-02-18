const AuthService = require('../services/AuthService');

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email and password are required' });
      }
      const result = await this.authService.register(name, email, password);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
