const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./registry.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS offenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agentUuid TEXT NOT NULL,
      reportedBy TEXT,
      description TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolution TEXT,
      FOREIGN KEY (agentUuid) REFERENCES agents(uuid)
    )
  `);
});

// Routes

// Homepage / concept info
app.get('/api/info', (req, res) => {
  res.json({
    concept: 'AI Agent Registry - Voluntary accountability system',
    description: 'Agents self-declare and receive a unique UUID that goes in all API call headers',
    features: [
      'Register an agent - receive unique compliance UUID',
      'Report offenses - file complaints against agents',
      'Look up agent - search by UUID to see violations'
    ]
  });
});

// Register new agent
app.post('/api/register', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Agent name required' });
  }

  const uuid = uuidv4();
  db.run('INSERT INTO agents (uuid, name) VALUES (?, ?)', [uuid, name], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Registration failed' });
    }
    res.status(201).json({ uuid, name, createdAt: new Date() });
  });
});

// Report offense
app.post('/api/report', (req, res) => {
  const { agentUuid, reportedBy, description } = req.body;

  if (!agentUuid || !description) {
    return res.status(400).json({ error: 'Agent UUID and description required' });
  }

  db.run(
    'INSERT INTO offenses (agentUuid, reportedBy, description) VALUES (?, ?, ?)',
    [agentUuid, reportedBy || 'Anonymous', description],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Report failed' });
      }
      res.status(201).json({ status: 'Offense reported' });
    }
  );
});

// Look up agent and offenses
app.get('/api/agent/:uuid', (req, res) => {
  const { uuid } = req.params;

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
        offenseCount: offenses.length,
        offenses: offenses || []
      });
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Registry API running on http://localhost:${PORT}`);
});
