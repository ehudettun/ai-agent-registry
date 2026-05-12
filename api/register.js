const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'data.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch {
    return { agents: [], offenses: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
  const agent = { id: uuid, uuid, name, createdAt: new Date().toISOString() };

  try {
    const data = readData();
    data.agents.push(agent);
    writeData(data);
    res.status(201).json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};
