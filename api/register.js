const storage = require('./storage');
// Build: 2026-05-12 00:35 UTC

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const readData = storage.getData;
const writeData = storage.setData;

module.exports = async function handler(req, res) {
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
  if (!body) {
    return res.status(400).json({ error: 'Request body required' });
  }
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }
  const { name } = body;
  if (!name) {
    return res.status(400).json({ error: 'Agent name required' });
  }

  const uuid = generateUUID();
  const agent = { id: uuid, uuid, name, createdAt: new Date().toISOString() };

  try {
    const data = await readData();
    data.agents.push(agent);
    await writeData(data);
    res.status(201).json(agent);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};
