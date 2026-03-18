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
      const res = await fetch('/api/ai-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, patientId, doctorId })
      });
      if (!res.ok) throw new Error('AI service error');
      const data = await res.json();
      setResponse(data.result);
    } catch (err) {
      setError(err.message);
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
      {loading && <div style={{ color: '#1976d2' }}>Loading...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {response && <div style={{ marginTop: '1em', background: '#f5f5f5', padding: '1em', borderRadius: 4 }}><strong>AI Response:</strong> {response}</div>}
    </div>
  );
};

export default AIAdvisor;
