import { v4 as uuidv4 } from 'uuid';
import sqlite3 from 'sqlite3';
import { resolve } from 'path';

const dbPath = resolve('./registry.db');

const db = new sqlite3.Database(dbPath);

// Ensure tables exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Agent name required' });
  }

  const uuid = uuidv4();

  db.run('INSERT INTO agents (uuid, name) VALUES (?, ?)', [uuid, name], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Registration failed' });
    }
    res.status(201).json({ uuid, name, createdAt: new Date() });
  });
}
