import React from 'react';
import { X, LifeBuoy, AlertCircle, CheckCircle2 } from 'lucide-react';

export function StudentDetailsModal({ student, onClose, onInitiateSupport }) {
  if (!student) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-student-name"
      onClick={onClose}
    >
      <div
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h2 id="modal-student-name" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {student.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              {student.email} • {student.course} • Semester {student.semester} (ID: #{student.id})
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close details modal"
          >
            <X size={20} />
          </button>
        </header>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 3 Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Overall Attendance
              </div>
              <div
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: student.attendance < 75 ? 'var(--color-danger)' : 'var(--color-success)',
                }}
              >
                {student.attendance}%
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Overall Marks
              </div>
              <div
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: student.marks < 50 ? 'var(--color-danger)' : 'var(--text-main)',
                }}
              >
                {student.marks}%
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Academic Status
              </div>
              <div style={{ marginTop: '0.35rem' }}>
                <span
                  className={`stat-badge ${
                    student.status === 'On Track'
                      ? 'badge-green'
                      : student.status === 'Needs Attention'
                      ? 'badge-amber'
                      : 'badge-red'
                  }`}
                >
                  {student.status}
                </span>
              </div>
            </div>
          </div>

          {student.notes && (
            <div className="student-notes">
              <span className="notes-tag">Counselor Notes:</span> {student.notes}
            </div>
          )}

          {/* Subject-wise breakdown table */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Subject-wise Breakdown & Early Gap Flags
            </h3>
            <div className="table-container">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Subject Code & Name</th>
                    <th>Marks Score</th>
                    <th>Attendance</th>
                    <th>Status Flag</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(student.subjects || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No individual subjects entered yet. Click "Edit" to configure subject courses.
                      </td>
                    </tr>
                  ) : (
                    student.subjects.map((sub, idx) => {
                      const isAtRisk = sub.gap || sub.marks < 50 || sub.attendance < 75;
                      return (
                        <tr
                          key={idx}
                          style={{
                            backgroundColor: isAtRisk ? 'var(--color-danger-bg)' : 'transparent',
                          }}
                        >
                          <td>
                            <strong>{sub.code}</strong> - {sub.name}
                          </td>
                          <td>
                            <span
                              style={{
                                color: sub.marks < 50 ? 'var(--color-danger)' : 'inherit',
                                fontWeight: sub.marks < 50 ? 700 : 'normal',
                              }}
                            >
                              {sub.marks}%
                            </span>
                          </td>
                          <td>
                            <span
                              style={{
                                color: sub.attendance < 75 ? 'var(--color-danger)' : 'inherit',
                                fontWeight: sub.attendance < 75 ? 700 : 'normal',
                              }}
                            >
                              {sub.attendance}%
                            </span>
                          </td>
                          <td>
                            {isAtRisk ? (
                              <span
                                style={{
                                  color: 'var(--color-danger)',
                                  fontWeight: 600,
                                  fontSize: '0.82rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                <AlertCircle size={14} /> Intervention Needed
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: 'var(--color-success)',
                                  fontSize: '0.82rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                <CheckCircle2 size={14} /> On Track
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {isAtRisk && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  onClose();
                                  onInitiateSupport({
                                    studentName: student.name,
                                    studentEmail: student.email,
                                    studentId: student.id,
                                    subjectCode: sub.code,
                                  });
                                }}
                              >
                                <LifeBuoy size={12} />
                                <span>Mentoring</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
