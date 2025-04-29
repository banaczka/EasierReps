import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('trening.db');

export async function initDatabase() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      name TEXT NOT NULL,
      days TEXT NOT NULL, -- JSON: ["Monday", "Thursday"]
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS plan_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      planId INTEGER NOT NULL,
      name TEXT NOT NULL,
      sets INTEGER NOT NULL,
      repsRange TEXT NOT NULL,
      FOREIGN KEY (planId) REFERENCES plans(id) ON DELETE CASCADE
    );
  `);
  
}
