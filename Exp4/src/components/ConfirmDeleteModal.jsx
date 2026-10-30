import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

/**
 * ConfirmDeleteModal Component
 * Accessible dialog confirming student deletion.
 */
export function ConfirmDeleteModal({ isOpen, student, onCancel, onConfirm, isDeleting }) {
  if (!isOpen || !student) return null;

  return (
    <div
      className="modal-backdrop"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
    >
      <div className="modal-content modal-content-sm">
        <div className="delete-dialog-header">
          <div className="delete-icon-wrap">
            <AlertTriangle className="text-red" size={28} />
          </div>
          <div>
            <h2 id="delete-dialog-title" className="delete-dialog-heading">
              Confirm Student Removal
            </h2>
            <p id="delete-dialog-desc" className="delete-dialog-text">
              Are you sure you want to permanently delete record for{' '}
              <strong>{student.name}</strong> ({student.id})? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="modal-actions delete-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-icon-text"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Student'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
