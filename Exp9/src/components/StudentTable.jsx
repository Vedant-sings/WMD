import React, { useState, useMemo } from 'react';
import {
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const StudentTable = React.memo(function StudentTable({
  students,
  onEdit,
  onDeleteRequest,
  onQuickPatchStatus,
  onViewDetails,
}) {
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, sortField, sortOrder]);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} style={{ opacity: 0.4, marginLeft: 4 }} />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} style={{ marginLeft: 4, color: 'var(--primary-blue)' }} />
    ) : (
      <ArrowDown size={12} style={{ marginLeft: 4, color: 'var(--primary-blue)' }} />
    );
  };

  return (
    <div className="table-container" role="region" aria-label="Student records table" tabIndex="0">
      <table className="student-table">
        <thead>
          <tr>
            <th scope="col" className="sortable" onClick={() => handleSort('id')}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                ID {renderSortIcon('id')}
              </span>
            </th>
            <th scope="col" className="sortable" onClick={() => handleSort('name')}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                Name & Email {renderSortIcon('name')}
              </span>
            </th>
            <th scope="col">Course / Sem</th>
            <th scope="col" className="sortable" onClick={() => handleSort('attendance')}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                Attendance {renderSortIcon('attendance')}
              </span>
            </th>
            <th scope="col" className="sortable" onClick={() => handleSort('marks')}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                Avg Marks {renderSortIcon('marks')}
              </span>
            </th>
            <th scope="col" className="sortable" onClick={() => handleSort('gaps')}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                Gaps {renderSortIcon('gaps')}
              </span>
            </th>
            <th scope="col">Flagged Subjects</th>
            <th scope="col">Quick Status</th>
            <th scope="col" className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student) => {
            const riskSubjects = (student.subjects || []).filter(
              (s) => s.gap === true || s.marks < 50 || s.attendance < 75
            );

            return (
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
                      student.attendance >= 75 ? 'text-green font-semibold' : 'text-red font-bold'
                    }`}
                  >
                    {student.attendance}%
                  </span>
                </td>
                <td>
                  <span
                    className={`font-semibold ${
                      student.marks < 50 ? 'text-red font-bold' : ''
                    }`}
                  >
                    {student.marks}%
                  </span>
                </td>
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
                  {riskSubjects.length > 0 ? (
                    <span style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {riskSubjects.map((s) => s.code).join(', ')}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-success)', fontSize: '0.8rem' }}>
                      ✓ Clear
                    </span>
                  )}
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
                      className="icon-action-btn"
                      title={`View academic breakdown for ${student.name}`}
                      onClick={() => onViewDetails(student)}
                      aria-label={`View academic breakdown for ${student.name}`}
                    >
                      <Eye size={15} />
                    </button>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
