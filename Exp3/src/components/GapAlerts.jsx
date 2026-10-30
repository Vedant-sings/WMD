import React from 'react';

/**
 * GapAlerts component
 * Displays alerts derived from subjects whose gap value is true, marks < 50, or attendance < 75.
 */
export default function GapAlerts({ students }) {
  const alerts = [];

  students.forEach((student) => {
    (student.subjects || []).forEach((subject) => {
      const isGapFlagged = subject.gap === true;
      const isLowMarks = subject.marks < 50;
      const isLowAttendance = subject.attendance < 75;

      if (isGapFlagged || isLowMarks || isLowAttendance) {
        const reasons = [];
        if (isGapFlagged) reasons.push('Gap Flagged');
        if (isLowMarks) reasons.push(`Low Marks (${subject.marks}%)`);
        if (isLowAttendance) reasons.push(`Low Attendance (${subject.attendance}%)`);

        alerts.push({
          id: `${student.id}-${subject.code}`,
          studentName: student.name,
          studentId: student.id,
          subjectCode: subject.code,
          subjectName: subject.name,
          marks: subject.marks,
          attendance: subject.attendance,
          reasons,
        });
      }
    });
  });

  if (alerts.length === 0) {
    return (
      <div className="section-card">
        <div className="section-title-wrap">
          <h2 className="section-title">Critical Gap Alerts</h2>
        </div>
        <p style={{ color: 'var(--success)', fontSize: '0.9375rem' }}>
          ✓ No academic or attendance gaps detected across all subjects!
        </p>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="section-title-wrap">
        <h2 className="section-title">Critical Gap Alerts</h2>
        <span
          className="student-badge badge-risk"
          aria-label={`${alerts.length} subjects requiring intervention`}
        >
          {alerts.length} Flagged
        </span>
      </div>

      <div className="gap-alerts-container" role="region" aria-label="Subject Gap Alerts">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-item">
            <div className="alert-item-header">
              <span className="alert-student-name">{alert.studentName}</span>
              <span className="alert-subject">{alert.subjectCode}</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {alert.subjectName}
            </p>
            <div className="alert-reasons">
              {alert.reasons.map((reason, idx) => (
                <span key={idx} className="alert-badge-chip">
                  • {reason}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
