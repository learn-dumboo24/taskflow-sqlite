import Database from 'better-sqlite3';
import { IRepository } from '../interfaces/IRepository';
import { getDB } from '../database/db';

// Generic repository — T is the row type from SQLite (plain object)
// Inheritance: concrete repositories extend this and get CRUD for free
abstract class BaseRepository<T extends Record<string, unknown>> implements IRepository<T> {
  protected readonly db: Database.Database;
  protected readonly tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.db = getDB();
  }

  findById(id: number): T | undefined {
    return this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`).get(id) as T | undefined;
  }

  findAll(): T[] {
    return this.db.prepare(`SELECT * FROM ${this.tableName}`).all() as T[];
  }

  create(data: Partial<T>): T {
    const keys = Object.keys(data);
    const columns = keys.join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const values = Object.values(data);

    const result = this.db
      .prepare(`INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`)
      .run(...values);

    return this.findById(result.lastInsertRowid as number) as T;
  }

  update(id: number, data: Partial<T>): T {
    const setClauses = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];

    this.db
      .prepare(`UPDATE ${this.tableName} SET ${setClauses}, updated_at = datetime('now') WHERE id = ?`)
      .run(...values);

    return this.findById(id) as T;
  }

  delete(id: number): boolean {
    const result = this.db
      .prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
      .run(id);
    return result.changes > 0;
  }
}

export default BaseRepository;
