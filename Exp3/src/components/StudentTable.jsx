import React from 'react';

export default function StudentTable({ students, onViewDetails }) {
  if (!students || students.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No student records match the criteria.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="student-table" aria-label="Students academic progress table">
        <thead>
          <tr>
            <th scope="col">Student Name</th>
            <th scope="col">Semester</th>
            <th scope="col">Attendance</th>
            <th scope="col">Overall Marks</th>
            <th scope="col">Status</th>
            <th scope="col">At-Risk Subjects</th>
            <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const riskSubjects = (student.subjects || []).filter(
              (s) => s.gap === true || s.marks < 50 || s.attendance < 75
            );

            return (
              <tr key={student.id}>
                <td>
                  <strong style={{ display: 'block', color: 'var(--text-main)' }}>
                    {student.name}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {student.email || `ID: #${student.id}`}
                  </span>
                </td>
                <td>Sem {student.semester}</td>
                <td>
                  <span
                    style={{
                      fontWeight: 600,
                      color: student.attendance < 75 ? 'var(--danger)' : 'inherit',
                    }}
                  >
                    {student.attendance}%
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontWeight: 600,
                      color: student.overallMarks < 50 ? 'var(--danger)' : 'inherit',
                    }}
                  >
                    {student.overallMarks}%
                  </span>
                </td>
                <td>
                  <span
                    className={`student-badge ${
                      student.status === 'At Risk' ? 'badge-risk' : 'badge-active'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td>
                  {riskSubjects.length > 0 ? (
                    <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '0.8125rem' }}>
                      {riskSubjects.length} flagged ({riskSubjects.map((s) => s.code).join(', ')})
                    </span>
                  ) : (
                    <span style={{ color: 'var(--success)', fontSize: '0.8125rem' }}>
                      All clear
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn-sm"
                    onClick={() => onViewDetails(student)}
                    aria-label={`View details for ${student.name}`}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
