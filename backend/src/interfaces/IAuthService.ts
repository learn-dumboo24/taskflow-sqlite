import { AuthResult } from '../types';

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
}
