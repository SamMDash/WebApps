import React, { useState } from 'react';

const AIAdvisor = ({ patientId, doctorId }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await fetch('/api/clinical-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, doctorId, query: input })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Invalid response from backend');
      }
      if (!res.ok) throw new Error(data.error || 'AI service error');
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2em' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter clinical question"
          style={{ width: '70%', marginRight: '0.5em' }}
          required
        />
        <button type="submit" disabled={loading}>Ask AI</button>
      </form>
      {loading && (
        <div style={{ color: '#1976d2', marginTop: '1em' }}>
          <span className="loader" style={{ marginRight: '0.5em' }}>⏳</span> Loading AI response...
        </div>
      )}
      {error && (
        <div style={{ color: 'red', marginTop: '1em' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {response && (
        <div style={{ marginTop: '1em', background: '#f5f5f5', padding: '1em', borderRadius: 4 }}>
          <strong>AI Response:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
