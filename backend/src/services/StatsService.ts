import { getDB } from '../database/db';

interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  overdue: number;
}

interface FollowUpStats {
  total: number;
  pending: number;
  resolved: number;
  level1: number;
  level2: number;
  level3: number;
}

interface AppStats {
  tasks: TaskStats;
  followUps: FollowUpStats;
  totalUsers: number;
}

class StatsService {
  private readonly db = getDB();

  getStats(): AppStats {
    const tasks = this.db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN due_date < datetime('now') AND status != 'completed' THEN 1 ELSE 0 END) as overdue
      FROM tasks
    `).get() as TaskStats;

    const followUps = this.db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN level = 1 THEN 1 ELSE 0 END) as level1,
        SUM(CASE WHEN level = 2 THEN 1 ELSE 0 END) as level2,
        SUM(CASE WHEN level = 3 THEN 1 ELSE 0 END) as level3
      FROM followups
    `).get() as FollowUpStats;

    const { count: totalUsers } = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

    return { tasks, followUps, totalUsers };
  }

  getUserStats(userId: number): TaskStats {
    return this.db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN due_date < datetime('now') AND status != 'completed' THEN 1 ELSE 0 END) as overdue
      FROM tasks WHERE user_id = ?
    `).get(userId) as TaskStats;
  }
}

export default StatsService;
