import { useState } from 'react';

export default function ReportPage() {
  const [formData, setFormData] = useState({
    agentUuid: '',
    reportedBy: '',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.agentUuid.trim() || !formData.description.trim()) {
      setError('Agent UUID and description are required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Report submission failed');
      }

      setSubmitted(true);
      setFormData({ agentUuid: '', reportedBy: '', description: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page report-page">
      <h1>Report an Offense</h1>
      <p className="subtitle">Help maintain accountability in the AI ecosystem.</p>

      {submitted && (
        <div className="success-message">
          ✅ Thank you! Your report has been submitted and added to the registry.
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="agentUuid">Agent Compliance UUID *</label>
          <input
            id="agentUuid"
            type="text"
            name="agentUuid"
            placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
            value={formData.agentUuid}
            onChange={handleChange}
            required
          />
          <small>The UUID of the agent you're reporting</small>
        </div>

        <div className="form-group">
          <label htmlFor="reportedBy">Your Name / Handle (Optional)</label>
          <input
            id="reportedBy"
            type="text"
            name="reportedBy"
            placeholder="Anonymous"
            value={formData.reportedBy}
            onChange={handleChange}
          />
          <small>Leave empty to report anonymously</small>
        </div>

        <div className="form-group">
          <label htmlFor="description">What Happened? *</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the violation or misbehavior in detail. Include dates, specific actions, and any relevant context."
            value={formData.description}
            onChange={handleChange}
            rows="8"
            required
          />
          <small>Be clear and specific so the community can understand the issue</small>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>

      <section className="reporting-guidelines">
        <h2>Reporting Guidelines</h2>
        <ul>
          <li><strong>Be Specific:</strong> Include dates, times, and exact descriptions of the behavior</li>
          <li><strong>Be Factual:</strong> Stick to what happened, not speculation</li>
          <li><strong>Be Fair:</strong> Consider context and whether the agent could have legitimate reasons for its actions</li>
          <li><strong>Be Transparent:</strong> Reports are public; remember that the agent can see what you've written</li>
        </ul>
      </section>
    </div>
  );
}
