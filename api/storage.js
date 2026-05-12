const { kv } = require('@vercel/kv');

const AGENTS_KEY = 'agents';
const OFFENSES_KEY = 'offenses';

async function getData() {
  try {
    const agents = (await kv.get(AGENTS_KEY)) || [];
    const offenses = (await kv.get(OFFENSES_KEY)) || [];
    return { agents, offenses };
  } catch (err) {
    console.error('KV read error:', err);
    return { agents: [], offenses: [] };
  }
}

async function setData(data) {
  try {
    await Promise.all([
      kv.set(AGENTS_KEY, data.agents),
      kv.set(OFFENSES_KEY, data.offenses)
    ]);
  } catch (err) {
    console.error('KV write error:', err);
    throw err;
  }
}

module.exports = { getData, setData };
