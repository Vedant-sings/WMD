import React from 'react';

export default function ErrorState({ error, onRetry }) {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to communicate with JSON server.';

  return (
    <div className="state-container" role="alert" style={{ borderColor: 'var(--danger)' }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          marginBottom: '1rem',
        }}
        aria-hidden="true"
      >
        ⚠️
      </div>
      <h2 className="state-title" style={{ color: 'var(--danger)' }}>
        Unable to Load Data
      </h2>
      <p className="state-desc">{errorMessage}</p>
      <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        Make sure the backend is running at <code>http://localhost:3000</code>:
        <br />
        <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: 4, display: 'inline-block', marginTop: '0.5rem' }}>
          npx json-server --watch db.json --port 3000
        </code>
      </div>
      {onRetry && (
        <button type="button" className="btn-primary" onClick={onRetry}>
          Retry Connection
        </button>
      )}
    </div>
  );
}
