const { getDB } = require('../database/db');

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = getDB();
  }

  findById(id) {
    return this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`).get(id);
  }

  findAll() {
    return this.db.prepare(`SELECT * FROM ${this.tableName}`).all();
  }

  create(data) {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.join(', ');
    const values = keys.map(k => data[k]);

    const stmt = this.db.prepare(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`
    );
    const result = stmt.run(...values);
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    const updates = Object.keys(data)
      .map(k => `${k} = ?`)
      .join(', ');
    const values = [...Object.values(data), id];

    this.db.prepare(
      `UPDATE ${this.tableName} SET ${updates}, updated_at = datetime('now') WHERE id = ?`
    ).run(...values);

    return this.findById(id);
  }

  delete(id) {
    const result = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`).run(id);
    return result.changes > 0;
  }
}

module.exports = BaseRepository;
