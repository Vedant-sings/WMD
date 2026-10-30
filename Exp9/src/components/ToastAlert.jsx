import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function ToastAlert({ notification, onDismiss }) {
  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div
      className={`toast-alert ${isSuccess ? 'toast-success' : 'toast-error'}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-content">
        {isSuccess ? (
          <CheckCircle2 size={18} className="toast-icon text-green" />
        ) : (
          <AlertCircle size={18} className="toast-icon text-red" />
        )}
        <span className="toast-message">{notification.message}</span>
      </div>
      <button
        type="button"
        className="toast-dismiss-btn"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function LoadingSkeletonGrid() {
  return (
    <div className="cards-grid" aria-label="Loading student records">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="student-card skeleton-card">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-sub"></div>
          <div className="skeleton-row">
            <div className="skeleton-box"></div>
            <div className="skeleton-box"></div>
            <div className="skeleton-box"></div>
          </div>
          <div className="skeleton-line skeleton-pill"></div>
        </div>
      ))}
    </div>
  );
}
