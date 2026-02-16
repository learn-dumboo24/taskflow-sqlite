const BaseRepository = require('./BaseRepository');

class FollowUpRepository extends BaseRepository {
  constructor() {
    super('followups');
  }

  findByTaskId(taskId) {
    return this.db.prepare('SELECT * FROM followups WHERE task_id = ?').get(taskId);
  }

  findByUserId(userId) {
    return this.db.prepare(`
      SELECT followups.*, tasks.title as task_title, tasks.due_date
      FROM followups
      JOIN tasks ON followups.task_id = tasks.id
      WHERE followups.user_id = ?
      ORDER BY followups.level DESC, followups.created_at DESC
    `).all(userId);
  }

  findAll() {
    return this.db.prepare(`
      SELECT followups.*, tasks.title as task_title, users.name as user_name
      FROM followups
      JOIN tasks ON followups.task_id = tasks.id
      JOIN users ON followups.user_id = users.id
      ORDER BY followups.level DESC, followups.created_at DESC
    `).all();
  }

  findUnresolvedForEscalation() {
    return this.db.prepare(`
      SELECT followups.*, tasks.due_date
      FROM followups
      JOIN tasks ON followups.task_id = tasks.id
      WHERE followups.status = 'pending'
        AND tasks.status != 'completed'
    `).all();
  }
}

module.exports = FollowUpRepository;
