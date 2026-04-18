import BaseRepository from './BaseRepository';
import { TaskData } from '../types';

class TaskRepository extends BaseRepository<TaskData> {
  constructor() {
    super('tasks');
  }

  findByUserId(userId: number): TaskData[] {
    return this.db
      .prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC, created_at DESC')
      .all(userId) as TaskData[];
  }

  findOverdue(): TaskData[] {
    return this.db.prepare(`
      SELECT * FROM tasks
      WHERE due_date < datetime('now')
        AND status != 'completed'
    `).all() as TaskData[];
  }

  findAllWithUser(): unknown[] {
    return this.db.prepare(`
      SELECT tasks.*, users.name as user_name, users.email as user_email
      FROM tasks
      JOIN users ON tasks.user_id = users.id
      ORDER BY tasks.due_date ASC
    `).all();
  }

  findByIdAndUser(id: number, userId: number): TaskData | undefined {
    return this.db
      .prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
      .get(id, userId) as TaskData | undefined;
  }
}

export default TaskRepository;
