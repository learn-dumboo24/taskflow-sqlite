const Database = require('better-sqlite3');
const path = require('path');
const config = require('../config/config');

let db;

function getDB() {
  if (!db) {
    db = new Database(path.resolve(config.dbPath));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

module.exports = { getDB };
