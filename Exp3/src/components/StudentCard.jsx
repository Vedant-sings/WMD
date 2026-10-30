import React from 'react';

export default function StudentCard({ student, onViewDetails }) {
  const getBadgeClass = (status) => {
    return status === 'At Risk' ? 'badge-risk' : 'badge-active';
  };

  const getScoreFillClass = (value, threshold) => {
    if (value < threshold) return 'fill-danger';
    if (value < threshold + 10) return 'fill-warning';
    return 'fill-safe';
  };

  const gapSubjects = (student.subjects || []).filter(
    (s) => s.gap === true || s.marks < 50 || s.attendance < 75
  );

  return (
    <article className="student-card" aria-labelledby={`student-name-${student.id}`}>
      <div>
        <div className="student-card-header">
          <div>
            <h3 id={`student-name-${student.id}`} className="student-card-name">
              {student.name}
            </h3>
            <p className="student-card-meta">
              Semester {student.semester} • ID: #{student.id}
            </p>
          </div>
          <span className={`student-badge ${getBadgeClass(student.status)}`}>
            {student.status}
          </span>
        </div>

        <div className="progress-metrics">
          <div className="metric-bar-group">
            <div className="metric-header">
              <span>Overall Marks</span>
              <strong>{student.overallMarks}%</strong>
            </div>
            <div className="progress-bar-bg" role="progressbar" aria-valuenow={student.overallMarks} aria-valuemin="0" aria-valuemax="100">
              <div
                className={`progress-bar-fill ${getScoreFillClass(student.overallMarks, 50)}`}
                style={{ width: `${Math.min(student.overallMarks, 100)}%` }}
              />
            </div>
          </div>

          <div className="metric-bar-group">
            <div className="metric-header">
              <span>Attendance</span>
              <strong>{student.attendance}%</strong>
            </div>
            <div className="progress-bar-bg" role="progressbar" aria-valuenow={student.attendance} aria-valuemin="0" aria-valuemax="100">
              <div
                className={`progress-bar-fill ${getScoreFillClass(student.attendance, 75)}`}
                style={{ width: `${Math.min(student.attendance, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Course Attention:
          </span>
          <div className="subject-tag-list">
            {gapSubjects.length > 0 ? (
              gapSubjects.map((sub, idx) => (
                <span key={idx} className="subject-tag alert-tag" title={`${sub.name} (Marks: ${sub.marks}%, Att: ${sub.attendance}%)`}>
                  ⚠️ {sub.code}
                </span>
              ))
            ) : (
              <span className="subject-tag" style={{ color: 'var(--success)' }}>
                ✓ No course gaps
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--surface-border)' }}>
        <button
          type="button"
          className="btn-sm"
          style={{ width: '100%', textAlign: 'center' }}
          onClick={() => onViewDetails && onViewDetails(student)}
          aria-label={`View academic details for ${student.name}`}
        >
          View Full Breakdown →
        </button>
      </div>
    </article>
  );
}
