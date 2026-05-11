import { useState } from 'react';

export default function LookupPage() {
  const [uuid, setUuid] = useState('');
  const [agent, setAgent] = useState(null);
  const [offenses, setOffenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!uuid.trim()) return;

    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`http://localhost:3001/api/agent/${uuid}`);
      if (!res.ok) {
        throw new Error('Agent not found');
      }
      const data = await res.json();
      setAgent(data.agent);
      setOffenses(data.offenses || []);
    } catch (err) {
      setError(err.message);
      setAgent(null);
      setOffenses([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page lookup-page">
      <h1>Look Up Agent</h1>
      <p className="subtitle">Search for an agent by UUID to see their compliance record.</p>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter Agent UUID (e.g., 550e8400-e29b-41d4-a716-446655440000)"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {searched && agent && (
        <div className="agent-result">
          <section className="agent-info">
            <h2>Agent Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <strong>Name:</strong>
                <p>{agent.name}</p>
              </div>
              <div className="info-item">
                <strong>UUID:</strong>
                <code>{agent.uuid}</code>
              </div>
              <div className="info-item">
                <strong>Registered:</strong>
                <p>{formatDate(agent.createdAt)}</p>
              </div>
              <div className="info-item">
                <strong>Offense Count:</strong>
                <p className={offenses.length === 0 ? 'clean-record' : 'has-violations'}>
                  {offenses.length}
                </p>
              </div>
            </div>
          </section>

          <section className="offenses-section">
            <h2>Reported Violations ({offenses.length})</h2>
            {offenses.length === 0 ? (
              <div className="no-offenses">
                ✅ This agent has a clean record!
              </div>
            ) : (
              <div className="offenses-list">
                {offenses.map((offense) => (
                  <div key={offense.id} className="offense-card">
                    <div className="offense-header">
                      <strong>Reported by:</strong> {offense.reportedBy}
                      <span className="offense-date">{formatDate(offense.timestamp)}</span>
                    </div>
                    <div className="offense-description">
                      <p>{offense.description}</p>
                    </div>
                    {offense.resolution && (
                      <div className="offense-resolution">
                        <strong>Resolution:</strong> {offense.resolution}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {searched && !agent && !error && (
        <div className="no-result">
          No agent found with that UUID. Check the ID and try again.
        </div>
      )}

      {!searched && (
        <section className="lookup-info">
          <h2>What You Can Find Here</h2>
          <ul>
            <li>Agent registration information</li>
            <li>All reported violations and complaints</li>
            <li>Resolution status (if any)</li>
            <li>Reporter names and timestamps</li>
          </ul>
          <p><strong>Privacy Note:</strong> All data is public. This is by design—transparency drives accountability.</p>
        </section>
      )}
    </div>
  );
}
