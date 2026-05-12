const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS offenses (
        id SERIAL PRIMARY KEY,
        agent_uuid VARCHAR(255) NOT NULL,
        reported_by VARCHAR(255) DEFAULT 'Anonymous',
        description TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (agent_uuid) REFERENCES agents(uuid)
      );
    `);
  } catch (err) {
    console.error('DB init error:', err);
  }
}

initDB();

async function getData() {
  try {
    const agentsRes = await pool.query('SELECT * FROM agents');
    const offensesRes = await pool.query('SELECT * FROM offenses');
    return {
      agents: agentsRes.rows.map(r => ({
        id: r.uuid,
        uuid: r.uuid,
        name: r.name,
        createdAt: r.created_at
      })),
      offenses: offensesRes.rows.map(r => ({
        id: r.id.toString(),
        agentUuid: r.agent_uuid,
        reportedBy: r.reported_by,
        description: r.description,
        timestamp: r.timestamp
      }))
    };
  } catch (err) {
    console.error('getData error:', err);
    return { agents: [], offenses: [] };
  }
}

async function setData(data) {
  try {
    for (const agent of data.agents) {
      await pool.query(
        'INSERT INTO agents (uuid, name) VALUES ($1, $2) ON CONFLICT (uuid) DO NOTHING',
        [agent.uuid, agent.name]
      );
    }
    for (const offense of data.offenses) {
      await pool.query(
        'INSERT INTO offenses (agent_uuid, reported_by, description) VALUES ($1, $2, $3)',
        [offense.agentUuid, offense.reportedBy, offense.description]
      );
    }
  } catch (err) {
    console.error('setData error:', err);
    throw err;
  }
}

module.exports = { getData, setData };
