import React from 'react';
import { Edit3, Trash2, AlertCircle, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';

/**
 * StudentCard Component
 * Memoized with React.memo to prevent re-renders when other items change.
 * Handlers are passed as memoized useCallback from App.jsx.
 */
export const StudentCard = React.memo(function StudentCard({
  student,
  onEdit,
  onDeleteRequest,
  onQuickPatchStatus,
  onQuickPatchAttendance,
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

  return (
    <article className="student-card" aria-labelledby={`stu-name-${student.id}`}>
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

      <div className="student-metrics-row">
        {/* Attendance */}
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
                aria-label={`Increase ${student.name} attendance to ${Math.min(100, student.attendance + 5)}%`}
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
                aria-label={`Decrease ${student.name} attendance to ${Math.max(0, student.attendance - 5)}%`}
              >
                -
              </button>
            </div>
          </div>
        </div>

        {/* Marks */}
        <div className="metric-box">
          <span className="metric-label">Average Marks</span>
          <span className="metric-value">{student.marks}/100</span>
        </div>

        {/* Course Gaps */}
        <div className="metric-box">
          <span className="metric-label">Course Gaps</span>
          <span className={`metric-value ${student.gaps > 0 ? 'text-amber' : 'text-green'}`}>
            {student.gaps} {student.gaps === 1 ? 'Gap' : 'Gaps'}
          </span>
        </div>
      </div>

      <div className="student-status-row">
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
        <div className="student-notes">
          <span className="notes-tag">Notes:</span> {student.notes}
        </div>
      )}
    </article>
  );
});
