import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Support from './pages/Support';
import { getStudents } from './services/api';
import './styles/main.css';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch all students on component mount
  const fetchStudentData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="app-container">
      <Header currentRoute={currentRoute} onNavigate={setCurrentRoute} />

      <main className="main-content">
        {loading && <LoadingState message="Fetching CourseGap student records..." />}

        {!loading && error && (
          <ErrorState error={error} onRetry={fetchStudentData} />
        )}

        {!loading && !error && students.length === 0 && (
          <div className="state-container">
            <h2 className="state-title">No Students Found</h2>
            <p className="state-desc">The database currently contains no student records.</p>
            <button type="button" className="btn-primary" onClick={fetchStudentData}>
              Refresh
            </button>
          </div>
        )}

        {!loading && !error && students.length > 0 && (
          <>
            {currentRoute === 'dashboard' && (
              <Dashboard
                students={students}
                onViewDetails={handleViewDetails}
                onNavigate={setCurrentRoute}
              />
            )}

            {currentRoute === 'students' && (
              <Students
                students={students}
                onViewDetails={handleViewDetails}
              />
            )}

            {currentRoute === 'support' && <Support />}
          </>
        )}
      </main>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-student-name"
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3 id="modal-student-name" className="modal-title">
                  {selectedStudent.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {selectedStudent.email} • Semester {selectedStudent.semester} (ID: #{selectedStudent.id})
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close details modal"
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  flex: 1,
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: 8,
                  border: '1px solid var(--surface-border)',
                }}
              >
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Overall Attendance</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: selectedStudent.attendance < 75 ? 'var(--danger)' : 'var(--text-main)' }}>
                  {selectedStudent.attendance}%
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: 8,
                  border: '1px solid var(--surface-border)',
                }}
              >
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Overall Marks</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: selectedStudent.overallMarks < 50 ? 'var(--danger)' : 'var(--text-main)' }}>
                  {selectedStudent.overallMarks}%
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: 8,
                  border: '1px solid var(--surface-border)',
                }}
              >
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Status</div>
                <div style={{ marginTop: '0.25rem' }}>
                  <span className={`student-badge ${selectedStudent.status === 'At Risk' ? 'badge-risk' : 'badge-active'}`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              Subject-wise Breakdown & Gap Indicators
            </h4>
            <div className="table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Attendance</th>
                    <th>Gap Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedStudent.subjects || []).map((sub, idx) => {
                    const isAtRisk = sub.gap || sub.marks < 50 || sub.attendance < 75;
                    return (
                      <tr key={idx} style={{ backgroundColor: isAtRisk ? 'var(--danger-bg)' : 'transparent' }}>
                        <td>
                          <strong>{sub.code}</strong> - {sub.name}
                        </td>
                        <td style={{ color: sub.marks < 50 ? 'var(--danger)' : 'inherit', fontWeight: sub.marks < 50 ? 600 : 'normal' }}>
                          {sub.marks}%
                        </td>
                        <td style={{ color: sub.attendance < 75 ? 'var(--danger)' : 'inherit', fontWeight: sub.attendance < 75 ? 600 : 'normal' }}>
                          {sub.attendance}%
                        </td>
                        <td>
                          {isAtRisk ? (
                            <span style={{ color: 'var(--danger)', fontWeight: 600 }}>
                              ⚠️ Intervention Needed
                            </span>
                          ) : (
                            <span style={{ color: 'var(--success)' }}>
                              ✓ On Track
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer" role="contentinfo">
        CourseGap Companion • Academic Progress & Early Intervention System • Built with React & Vite
      </footer>
    </div>
  );
}
