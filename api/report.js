import sqlite3 from 'sqlite3';
import { resolve } from 'path';

const dbPath = resolve('./registry.db');
const db = new sqlite3.Database(dbPath);

// Ensure tables exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS offenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agentUuid TEXT NOT NULL,
      reportedBy TEXT,
      description TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolution TEXT
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

  const { agentUuid, reportedBy, description } = req.body;

  if (!agentUuid || !description) {
    return res.status(400).json({ error: 'Agent UUID and description required' });
  }

  db.run(
    'INSERT INTO offenses (agentUuid, reportedBy, description) VALUES (?, ?, ?)',
    [agentUuid, reportedBy || 'Anonymous', description],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Report failed' });
      }
      res.status(201).json({ status: 'Offense reported' });
    }
  );
}
