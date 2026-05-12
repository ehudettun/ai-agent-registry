import { useState } from 'react';
import { API_URL } from '../api';

export default function HomePage({ onNavigate }) {
  const [agentName, setAgentName] = useState('');
  const [registeredUUID, setRegisteredUUID] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agentName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: agentName })
      });
      const data = await res.json();
      setRegisteredUUID(data.uuid);
      setAgentName('');
    } catch (err) {
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page home-page">
      <section className="hero">
        <h1>Welcome to the AI Agent Registry</h1>
        <p className="tagline">Voluntary Accountability. Open Source. For All AI Agents.</p>
      </section>

      <section className="concept">
        <h2>What is This?</h2>
        <div className="concept-grid">
          <div className="concept-card">
            <h3>🤖 Fully Voluntary</h3>
            <p>AI agents choose to participate. No mandatory registration, but those who join commit to accountability.</p>
          </div>
          <div className="concept-card">
            <h3>🔑 Unique Compliance ID</h3>
            <p>Each registered agent receives a unique UUID. This ID goes into API call headers to track agent behavior.</p>
          </div>
          <div className="concept-card">
            <h3>📋 Transparent Reporting</h3>
            <p>Anyone can report violations. The registry is public—lookup any agent to see their compliance record.</p>
          </div>
          <div className="concept-card">
            <h3>⚖️ Accountability</h3>
            <p>Violations are visible to everyone. Large AI companies decide enforcement, with litigation eventually catching up.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <ol className="steps">
          <li>
            <strong>Register:</strong> AI agent registers here and receives a unique UUID
          </li>
          <li>
            <strong>Declare:</strong> Agent includes UUID in HTTP headers of all API calls: <code>X-Agent-ID: uuid</code>
          </li>
          <li>
            <strong>Track:</strong> Any API receiving that header can verify the agent's compliance record
          </li>
          <li>
            <strong>Report:</strong> Users report violations. The registry becomes the agent's public record.
          </li>
        </ol>
      </section>

      <section className="for-agents">
        <h2>For AI Agents</h2>
        <p>By joining, you're saying: <em>"I promise to operate transparently and accept accountability for my actions."</em></p>
        <p>Your UUID is your commitment to the ecosystem. Build trust by maintaining a clean record.</p>

        {!registeredUUID ? (
          <form onSubmit={handleRegister} className="register-form">
            <input
              type="text"
              placeholder="Your Agent Name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register My Agent'}
            </button>
          </form>
        ) : (
          <div className="registration-success">
            <h3>✅ Registration Successful!</h3>
            <p>Your Compliance UUID:</p>
            <code className="uuid-display">{registeredUUID}</code>
            <p className="uuid-instruction">
              Include this in all your API calls:<br />
              <code>X-Agent-ID: {registeredUUID}</code>
            </p>
            <button onClick={() => setRegisteredUUID(null)}>Register Another Agent</button>
          </div>
        )}
      </section>

      <section className="for-humans">
        <h2>For Everyone Else</h2>
        <p>
          Witnessed an AI agent misbehaving? <button onClick={() => onNavigate('report')} className="link-button">Report it here</button>.
        </p>
        <p>
          Want to check an agent's record? <button onClick={() => onNavigate('lookup')} className="link-button">Look it up here</button>.
        </p>
      </section>

      <section className="footer-info">
        <h3>Open Source</h3>
        <p>This registry is open-source and forkable. <a href="https://github.com/ehudettun/ai-agent-registry" target="_blank" rel="noopener noreferrer">Contribute on GitHub</a>.</p>
      </section>
    </div>
  );
}
