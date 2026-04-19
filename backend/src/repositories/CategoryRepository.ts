import BaseRepository from './BaseRepository';
import { CategoryData } from '../types';

class CategoryRepository extends BaseRepository<CategoryData> {
  constructor() {
    super('categories');
  }

  findByUserId(userId: number): CategoryData[] {
    return this.db.prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC').all(userId) as CategoryData[];
  }

  findByTaskId(taskId: number): CategoryData[] {
    return this.db.prepare(`
      SELECT categories.*
      FROM categories
      JOIN task_categories ON categories.id = task_categories.category_id
      WHERE task_categories.task_id = ?
    `).all(taskId) as CategoryData[];
  }

  addToTask(taskId: number, categoryId: number): void {
    this.db.prepare('INSERT OR IGNORE INTO task_categories (task_id, category_id) VALUES (?, ?)').run(taskId, categoryId);
  }

  removeFromTask(taskId: number, categoryId: number): void {
    this.db.prepare('DELETE FROM task_categories WHERE task_id = ? AND category_id = ?').run(taskId, categoryId);
  }
}

export default CategoryRepository;
