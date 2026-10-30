import React from 'react';

export default function LoadingState({ message = 'Loading academic records...' }) {
  return (
    <div className="state-container" role="status" aria-live="polite">
      <div className="state-spinner" aria-hidden="true" />
      <h2 className="state-title">{message}</h2>
      <p className="state-desc">Fetching data from the CourseGap API. Please wait a moment.</p>
    </div>
  );
}
