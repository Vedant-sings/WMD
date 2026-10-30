import React from 'react';
import { AlertCircle, LifeBuoy, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { exportGapAlertsToCSV } from '../utils/exportUtils';

export function GapAlerts({ students, onInitiateSupport, onViewStudent }) {
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
          student,
          studentName: student.name,
          studentId: student.id,
          studentEmail: student.email,
          course: student.course,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', padding: '1rem 0' }}>
          <CheckCircle2 size={20} />
          <p style={{ fontWeight: 600, fontSize: '0.92rem' }}>
            All clear! No academic or attendance gaps detected across all enrolled subjects.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="section-title-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <h2 className="section-title">Critical Gap Alerts</h2>
          <span className="stat-badge badge-red" aria-label={`${alerts.length} subjects requiring intervention`}>
            {alerts.length} Flagged
          </span>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => exportGapAlertsToCSV(students)}
          title="Export gap alerts list to CSV"
        >
          <FileSpreadsheet size={14} />
          <span className="hide-mobile">Export CSV</span>
        </button>
      </div>

      <div className="gap-alerts-container" role="region" aria-label="Subject Gap Alerts List">
        {alerts.map((alert) => (
          <article key={alert.id} className="alert-item">
            <div className="alert-item-header">
              <button
                type="button"
                className="btn-link"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  font: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                }}
                onClick={() => onViewStudent && onViewStudent(alert.student)}
                title="View student breakdown"
              >
                <span className="alert-student-name">{alert.studentName}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                  {alert.studentId} • {alert.course}
                </span>
              </button>
              <span className="alert-subject">{alert.subjectCode}</span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {alert.subjectName}
            </p>

            <div className="alert-reasons">
              {alert.reasons.map((reason, idx) => (
                <span key={idx} className="alert-badge-chip">
                  • {reason}
                </span>
              ))}
            </div>

            <div className="alert-footer-action">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  onInitiateSupport &&
                  onInitiateSupport({
                    studentName: alert.studentName,
                    studentEmail: alert.studentEmail,
                    studentId: alert.studentId,
                    subjectCode: alert.subjectCode,
                  })
                }
              >
                <LifeBuoy size={13} />
                <span>Request Mentoring</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
