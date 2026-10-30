import React from 'react';
import {
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

export const StudentCard = React.memo(function StudentCard({
  student,
  onEdit,
  onDeleteRequest,
  onQuickPatchStatus,
  onQuickPatchAttendance,
  onViewDetails,
}) {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'On Track':
        return 'badge-green';
      case 'Needs Attention':
        return 'badge-amber';
      case 'At Risk':
        return 'badge-red';
      default:
        return 'badge-gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Track':
        return <CheckCircle2 size={13} aria-hidden="true" />;
      case 'Needs Attention':
        return <AlertTriangle size={13} aria-hidden="true" />;
      case 'At Risk':
        return <AlertCircle size={13} aria-hidden="true" />;
      default:
        return null;
    }
  };

  const getScoreFillClass = (value, threshold) => {
    if (value < threshold) return 'fill-danger';
    if (value < threshold + 10) return 'fill-warning';
    return 'fill-safe';
  };

  // Flagged subjects from Exp3
  const gapSubjects = (student.subjects || []).filter(
    (s) => s.gap === true || s.marks < 50 || s.attendance < 75
  );

  return (
    <article className="student-card" aria-labelledby={`stu-name-${student.id}`}>
      <div>
        {/* Header: ID, Name, Course, Sem & Actions */}
        <div className="student-card-header">
          <div className="student-meta">
            <span className="student-id-tag">{student.id}</span>
            <h3 id={`stu-name-${student.id}`} className="student-name">
              {student.name}
            </h3>
            <p className="student-course">
              {student.course} • <span className="student-sem">Sem {student.semester}</span>
            </p>
          </div>

          <div className="student-card-actions">
            <button
              type="button"
              className="icon-action-btn edit-btn"
              title={`Edit ${student.name}'s complete record`}
              onClick={() => onEdit(student)}
              aria-label={`Edit ${student.name}`}
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              className="icon-action-btn delete-btn"
              title={`Delete ${student.name}`}
              onClick={() => onDeleteRequest(student)}
              aria-label={`Delete ${student.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="student-metrics-row" style={{ marginTop: '0.85rem' }}>
          {/* Attendance with Quick Stepper */}
          <div className="metric-box">
            <span className="metric-label">Attendance</span>
            <div className="metric-val-row">
              <span
                className={`metric-value ${
                  student.attendance >= 75 ? 'text-green' : 'text-red font-bold'
                }`}
              >
                {student.attendance}%
              </span>
              <div className="quick-stepper" aria-label="Quick adjust attendance">
                <button
                  type="button"
                  className="step-btn"
                  title="Increase attendance by 5%"
                  onClick={() =>
                    onQuickPatchAttendance(student.id, Math.min(100, student.attendance + 5))
                  }
                  aria-label={`Increase ${student.name} attendance`}
                >
                  +
                </button>
                <button
                  type="button"
                  className="step-btn"
                  title="Decrease attendance by 5%"
                  onClick={() =>
                    onQuickPatchAttendance(student.id, Math.max(0, student.attendance - 5))
                  }
                  aria-label={`Decrease ${student.name} attendance`}
                >
                  -
                </button>
              </div>
            </div>
          </div>

          {/* Average Marks */}
          <div className="metric-box">
            <span className="metric-label">Avg Marks</span>
            <span className={`metric-value ${student.marks < 50 ? 'text-red font-bold' : ''}`}>
              {student.marks}%
            </span>
          </div>

          {/* Course Gaps */}
          <div className="metric-box">
            <span className="metric-label">Course Gaps</span>
            <span className={`metric-value ${student.gaps > 0 ? 'text-amber' : 'text-green'}`}>
              {student.gaps} {student.gaps === 1 ? 'Gap' : 'Gaps'}
            </span>
          </div>
        </div>

        {/* Exp3 Visual Progress Bars */}
        <div className="progress-metrics" style={{ marginTop: '0.85rem' }}>
          <div className="metric-bar-group">
            <div className="metric-header">
              <span>Overall Marks Progress</span>
              <strong>{student.marks}%</strong>
            </div>
            <div
              className="progress-bar-bg"
              role="progressbar"
              aria-valuenow={student.marks}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className={`progress-bar-fill ${getScoreFillClass(student.marks, 50)}`}
                style={{ width: `${Math.min(student.marks, 100)}%` }}
              />
            </div>
          </div>

          <div className="metric-bar-group">
            <div className="metric-header">
              <span>Attendance Track</span>
              <strong>{student.attendance}%</strong>
            </div>
            <div
              className="progress-bar-bg"
              role="progressbar"
              aria-valuenow={student.attendance}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className={`progress-bar-fill ${getScoreFillClass(student.attendance, 75)}`}
                style={{ width: `${Math.min(student.attendance, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Exp3 Subject Attention Tags */}
        <div style={{ marginTop: '0.75rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Course Attention:
          </span>
          <div className="subject-tag-list">
            {gapSubjects.length > 0 ? (
              gapSubjects.map((sub, idx) => (
                <span
                  key={idx}
                  className="subject-tag alert-tag"
                  title={`${sub.name} (Marks: ${sub.marks}%, Attendance: ${sub.attendance}%)`}
                >
                  ⚠️ {sub.code}
                </span>
              ))
            ) : (
              <span className="subject-tag" style={{ color: 'var(--color-success)' }}>
                ✓ No subject gaps
              </span>
            )}
          </div>
        </div>

        {/* Quick Status Dropdown (Exp4) */}
        <div className="student-status-row" style={{ marginTop: '0.75rem' }}>
          <label htmlFor={`quick-status-${student.id}`} className="quick-status-label">
            Status:
          </label>
          <div className="status-select-wrap">
            <span className={`status-pill ${getStatusBadgeClass(student.status)}`}>
              {getStatusIcon(student.status)}
              <select
                id={`quick-status-${student.id}`}
                className="quick-status-select"
                value={student.status}
                onChange={(e) => onQuickPatchStatus(student.id, e.target.value)}
                aria-label={`Update status for ${student.name}`}
              >
                <option value="On Track">On Track</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="At Risk">At Risk</option>
              </select>
            </span>
          </div>
        </div>

        {student.notes && (
          <div className="student-notes" style={{ marginTop: '0.75rem' }}>
            <span className="notes-tag">Notes:</span> {student.notes}
          </div>
        )}
      </div>

      {/* Exp3 "View Full Breakdown" Action */}
      <div className="card-footer-action">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'space-between' }}
          onClick={() => onViewDetails(student)}
          aria-label={`View academic details for ${student.name}`}
        >
          <span>View Academic Breakdown</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </article>
  );
});
