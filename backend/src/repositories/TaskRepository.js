const BaseRepository = require('./BaseRepository');

class TaskRepository extends BaseRepository {
  constructor() {
    super('tasks');
  }

  findByUserId(userId) {
    return this.db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC, created_at DESC').all(userId);
  }

  findOverdue() {
    return this.db.prepare(`
      SELECT * FROM tasks
      WHERE due_date < datetime('now')
        AND status != 'completed'
    `).all();
  }

  findAllWithUser() {
    return this.db.prepare(`
      SELECT tasks.*, users.name as user_name, users.email as user_email
      FROM tasks
      JOIN users ON tasks.user_id = users.id
      ORDER BY tasks.due_date ASC
    `).all();
  }

  findByIdAndUser(id, userId) {
    return this.db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
  }
}

module.exports = TaskRepository;
