import React from 'react';
import { Edit3, Trash2, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

/**
 * StudentTable Component
 * Tabular view for desktop users. Memoized with React.memo.
 */
export const StudentTable = React.memo(function StudentTable({
  students,
  onEdit,
  onDeleteRequest,
  onQuickPatchStatus,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Track':
        return (
          <span className="table-badge badge-green">
            <CheckCircle2 size={12} /> On Track
          </span>
        );
      case 'Needs Attention':
        return (
          <span className="table-badge badge-amber">
            <AlertTriangle size={12} /> Needs Attention
          </span>
        );
      case 'At Risk':
        return (
          <span className="table-badge badge-red">
            <AlertCircle size={12} /> At Risk
          </span>
        );
      default:
        return <span className="table-badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="table-container" role="region" aria-label="Student records table" tabIndex="0">
      <table className="student-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name & Email</th>
            <th scope="col">Course / Sem</th>
            <th scope="col">Attendance</th>
            <th scope="col">Avg Marks</th>
            <th scope="col">Course Gaps</th>
            <th scope="col">Quick Status</th>
            <th scope="col" className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <span className="table-student-id">{student.id}</span>
              </td>
              <td>
                <div className="student-name-cell">
                  <strong>{student.name}</strong>
                  <span className="student-subemail">{student.email}</span>
                </div>
              </td>
              <td>
                <div className="student-course-cell">
                  <span>{student.course}</span>
                  <small className="muted-text">Semester {student.semester}</small>
                </div>
              </td>
              <td>
                <span
                  className={`attendance-indicator ${
                    student.attendance >= 75 ? 'text-green' : 'text-red font-semibold'
                  }`}
                >
                  {student.attendance}%
                </span>
              </td>
              <td>{student.marks}/100</td>
              <td>
                <span
                  className={`gaps-count ${
                    student.gaps > 0 ? 'gaps-alert' : 'gaps-clear'
                  }`}
                >
                  {student.gaps}
                </span>
              </td>
              <td>
                <div className="quick-table-select-wrapper">
                  <select
                    className="quick-table-select"
                    value={student.status}
                    onChange={(e) => onQuickPatchStatus(student.id, e.target.value)}
                    aria-label={`Change status for ${student.name}`}
                  >
                    <option value="On Track">On Track</option>
                    <option value="Needs Attention">Needs Attention</option>
                    <option value="At Risk">At Risk</option>
                  </select>
                </div>
              </td>
              <td className="text-right">
                <div className="table-actions">
                  <button
                    type="button"
                    className="icon-action-btn edit-btn"
                    title={`Edit ${student.name}`}
                    onClick={() => onEdit(student)}
                    aria-label={`Edit ${student.name}`}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn delete-btn"
                    title={`Delete ${student.name}`}
                    onClick={() => onDeleteRequest(student)}
                    aria-label={`Delete ${student.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
