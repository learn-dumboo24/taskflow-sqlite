import BaseRepository from './BaseRepository';
import { CommentData } from '../types';

class CommentRepository extends BaseRepository<CommentData> {
  constructor() {
    super('comments');
  }

  findByTaskId(taskId: number): CommentData[] {
    return this.db.prepare(`
      SELECT comments.*, users.name as user_name
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.task_id = ?
      ORDER BY comments.created_at ASC
    `).all(taskId) as CommentData[];
  }
}

export default CommentRepository;
