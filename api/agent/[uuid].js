const fs = require('fs');
const path = require('path');

const dataPath = '/tmp/data.json';

function readData() {
  try {
    if (!fs.existsSync(dataPath)) {
      return { agents: [], offenses: [] };
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('readData error:', err);
    return { agents: [], offenses: [] };
  }
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uuid } = req.query;

  try {
    const data = readData();
    const agent = data.agents.find(a => a.uuid === uuid);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const offenses = data.offenses.filter(o => o.agentUuid === uuid);

    res.json({
      agent,
      offenseCount: offenses.length,
      offenses
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Query failed' });
  }
};
