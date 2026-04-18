import BaseRepository from './BaseRepository';
import { UserData } from '../types';

class UserRepository extends BaseRepository<UserData> {
  constructor() {
    super('users');
  }

  findByEmail(email: string): UserData | undefined {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserData | undefined;
  }

  findAllActive(): UserData[] {
    return this.db.prepare('SELECT * FROM users WHERE is_active = 1').all() as UserData[];
  }
}

export default UserRepository;
