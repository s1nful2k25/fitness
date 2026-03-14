import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

// Ensure the directory exists
const dbPath = process.env.DATABASE_PATH || './data/training.db';
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize better-sqlite3 with the path
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

// Export the drizzle instance
export const db = drizzle(sqlite, { schema });
