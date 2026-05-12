const storage = require('./storage');

function readData() {
  return storage.getData();
}

function writeData(data) {
  storage.setData(data);
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

  let body = req.body;
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }
  const { agentUuid, reportedBy, description } = body;

  if (!agentUuid || !description) {
    return res.status(400).json({ error: 'Agent UUID and description required' });
  }

  const offense = {
    id: Date.now().toString(),
    agentUuid,
    reportedBy: reportedBy || 'Anonymous',
    description,
    timestamp: new Date().toISOString()
  };

  try {
    const data = readData();
    data.offenses.push(offense);
    writeData(data);
    res.status(201).json({ status: 'Offense reported' });
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).json({ error: 'Report failed', details: err.message });
  }
};
