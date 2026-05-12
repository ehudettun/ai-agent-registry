import sqlite3 from 'sqlite3';
import { resolve } from 'path';

const dbPath = resolve('./registry.db');
const db = new sqlite3.Database(dbPath);

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uuid } = req.query;

  db.get('SELECT * FROM agents WHERE uuid = ?', [uuid], (err, agent) => {
    if (err || !agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    db.all('SELECT * FROM offenses WHERE agentUuid = ? ORDER BY timestamp DESC', [uuid], (err, offenses) => {
      if (err) {
        return res.status(500).json({ error: 'Query failed' });
      }

      res.json({
        agent,
        offenseCount: offenses?.length || 0,
        offenses: offenses || []
      });
    });
  });
}
