import jwt from 'jsonwebtoken';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import { IAuthService } from '../interfaces/IAuthService';
import { AuthResult, UserData } from '../types';
import config from '../config/config';

class AuthService implements IAuthService {
  private readonly userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const existing = this.userRepo.findByEmail(email);
    if (existing) throw new Error('Email already registered');

    const user = new User({ name, email });
    const errors = user.validate();
    if (errors.length > 0) throw new Error(errors.join(', '));

    await user.setPassword(password);

    const { id, created_at, updated_at, ...persistData } = user.toPersistenceObject();
    const row = this.userRepo.create({ ...persistData, role: 'user' } as Partial<UserData>);

    const token = this.generateToken(new User(row));
    return { user: new User(row).toJSON(), token };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const row = this.userRepo.findByEmail(email);
    if (!row) throw new Error('Invalid email or password');
    if (!row.is_active) throw new Error('Account is deactivated');

    const user = new User(row);
    const valid = await user.checkPassword(password);
    if (!valid) throw new Error('Invalid email or password');

    const token = this.generateToken(user);
    return { user: user.toJSON(), token };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }
}

export default AuthService;
