import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(process.cwd(), 'db', 'dev.db');

const db = new Database(dbPath);

// Only create table if missing
db.prepare(`
  CREATE TABLE IF NOT EXISTS StudentNotification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    read INTEGER NOT NULL DEFAULT 0
  )
`).run();

export default db;
