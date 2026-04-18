import BaseRepository from './BaseRepository';
import { FollowUpData } from '../types';

class FollowUpRepository extends BaseRepository<FollowUpData> {
  constructor() {
    super('followups');
  }

  findByTaskId(taskId: number): FollowUpData | undefined {
    return this.db
      .prepare('SELECT * FROM followups WHERE task_id = ?')
      .get(taskId) as FollowUpData | undefined;
  }

  findByUserId(userId: number): FollowUpData[] {
    return this.db.prepare(`
      SELECT followups.*, tasks.title as task_title, tasks.due_date
      FROM followups
      JOIN tasks ON followups.task_id = tasks.id
      WHERE followups.user_id = ?
      ORDER BY followups.level DESC, followups.created_at DESC
    `).all(userId) as FollowUpData[];
  }

  findAll(): FollowUpData[] {
    return this.db.prepare(`
      SELECT followups.*, tasks.title as task_title, users.name as user_name
      FROM followups
      JOIN tasks ON followups.task_id = tasks.id
      JOIN users ON followups.user_id = users.id
      ORDER BY followups.level DESC, followups.created_at DESC
    `).all() as FollowUpData[];
  }

  findUnresolvedForEscalation(): FollowUpData[] {
    return this.db.prepare(`
      SELECT followups.*, tasks.due_date, tasks.title as task_title
      FROM followups
      JOIN tasks ON followups.task_id = tasks.id
      WHERE followups.status = 'pending'
        AND tasks.status != 'completed'
    `).all() as FollowUpData[];
  }
}

export default FollowUpRepository;
