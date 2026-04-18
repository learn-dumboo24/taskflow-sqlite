import Database from 'better-sqlite3';
import path from 'path';
import config from '../config/config';

let db: Database.Database | null = null;

export function getDB(): Database.Database {
  if (!db) {
    db = new Database(path.resolve(config.dbPath));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}
