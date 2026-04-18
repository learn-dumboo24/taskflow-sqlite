import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
      if (!name || !email || !password) {
        res.status(400).json({ error: 'name, email and password are required' });
        return;
      }
      const result = await this.authService.register(name, email, password);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || !password) {
        res.status(400).json({ error: 'email and password are required' });
        return;
      }
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
