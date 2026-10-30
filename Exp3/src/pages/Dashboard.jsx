import React from 'react';
import StudentCard from '../components/StudentCard';
import GapAlerts from '../components/GapAlerts';

export default function Dashboard({ students, onViewDetails, onNavigate }) {
  // Compute overview metrics
  const totalStudents = students.length;
  const avgAttendance =
    totalStudents > 0
      ? Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / totalStudents)
      : 0;
  const avgMarks =
    totalStudents > 0
      ? Math.round(students.reduce((acc, s) => acc + (s.overallMarks || 0), 0) / totalStudents)
      : 0;
  const atRiskStudents = students.filter((s) => s.status === 'At Risk').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Academic Progress Overview</h2>
          <p className="page-description">
            Live cohort monitoring, subject attendance analysis, and student risk identification.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => onNavigate('students')}
        >
          View Full Student Roster →
        </button>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="stats-grid" role="region" aria-label="Key Performance Indicators">
        <div className="stat-card normal">
          <span className="stat-label">Total Enrolled Students</span>
          <span className="stat-value">{totalStudents}</span>
          <span className="stat-indicator" style={{ color: 'var(--primary)' }}>
            Active cohort batch
          </span>
        </div>

        <div className="stat-card attendance">
          <span className="stat-label">Average Attendance</span>
          <span className="stat-value">{avgAttendance}%</span>
          <span
            className="stat-indicator"
            style={{ color: avgAttendance < 75 ? 'var(--danger)' : 'var(--success)' }}
          >
            {avgAttendance < 75 ? '⚠️ Below 75% threshold' : '✓ Good attendance track'}
          </span>
        </div>

        <div className="stat-card marks">
          <span className="stat-label">Average Marks</span>
          <span className="stat-value">{avgMarks}%</span>
          <span
            className="stat-indicator"
            style={{ color: avgMarks < 50 ? 'var(--danger)' : 'var(--success)' }}
          >
            {avgMarks < 50 ? '⚠️ Academic warning' : '✓ Satisfactory performance'}
          </span>
        </div>

        <div className="stat-card risk">
          <span className="stat-label">Students At Risk</span>
          <span className="stat-value" style={{ color: atRiskStudents > 0 ? 'var(--danger)' : 'inherit' }}>
            {atRiskStudents}
          </span>
          <span className="stat-indicator" style={{ color: 'var(--danger)' }}>
            {atRiskStudents > 0 ? 'Requires academic intervention' : 'No at-risk students'}
          </span>
        </div>
      </div>

      {/* Main Grid: Student Cards + Gap Alerts */}
      <div className="dashboard-grid">
        <section aria-labelledby="featured-students-title">
          <div className="section-title-wrap">
            <h2 id="featured-students-title" className="section-title">
              Enrolled Students
            </h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Showing {students.length} students
            </span>
          </div>

          <div className="cards-grid">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="gap-alerts-title">
          <GapAlerts students={students} />
        </section>
      </div>
    </div>
  );
}
