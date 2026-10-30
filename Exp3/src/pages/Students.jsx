import React, { useState } from 'react';
import StudentTable from '../components/StudentTable';

export default function Students({ students, onViewDetails }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter((student) => {
    const matchesStatus =
      filterStatus === 'All' || student.status === filterStatus;
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Student Academic Directory</h2>
          <p className="page-description">
            Complete roster with attendance tracking, examination outcomes, and course-gap flags.
          </p>
        </div>
      </div>

      <div
        className="section-card"
        style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flex: 1, minWidth: 260, gap: '0.5rem', alignItems: 'center' }}>
            <label htmlFor="search-input" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Search:
            </label>
            <input
              id="search-input"
              type="search"
              className="form-input"
              style={{ width: '100%', maxWidth: 350 }}
              placeholder="Search by student name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label htmlFor="status-filter" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Filter Status:
            </label>
            <select
              id="status-filter"
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="All">All Students</option>
              <option value="Active">Active</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-title-wrap">
          <h3 className="section-title">
            Enrolled Students ({filteredStudents.length})
          </h3>
        </div>

        <StudentTable
          students={filteredStudents}
          onViewDetails={onViewDetails}
        />
      </div>
    </div>
  );
}
