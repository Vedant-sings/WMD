import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useStudents } from './hooks/useStudents';
import { useSupportRequests } from './hooks/useSupportRequests';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { FilterBar } from './components/FilterBar';
import { StudentCard } from './components/StudentCard';
import { StudentTable } from './components/StudentTable';
import { GapAlerts } from './components/GapAlerts';
import { StudentModal } from './components/StudentModal';
import { StudentDetailsModal } from './components/StudentDetailsModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { ToastAlert, LoadingSkeletonGrid } from './components/ToastAlert';
import { SupportPage } from './pages/SupportPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { exportStudentsToCSV } from './utils/exportUtils';
import {
  LayoutGrid,
  List,
  AlertTriangle,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import './App.css';

export default function App() {
  // -------------------------------------------------------------
  // 1. Theme Management (useState + useEffect + localStorage)
  // -------------------------------------------------------------
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('coursegap-pro-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('coursegap-pro-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // -------------------------------------------------------------
  // 2. Navigation State (Exp3 Multi-page routing)
  // -------------------------------------------------------------
  const [currentRoute, setCurrentRoute] = useState('dashboard');

  // -------------------------------------------------------------
  // 3. Custom Hooks: useStudents & useSupportRequests
  // -------------------------------------------------------------
  const {
    students,
    loading,
    error,
    isOfflineMode,
    refetch,
    createStudent,
    updateStudent,
    patchStudent,
    removeStudent,
  } = useStudents();

  const {
    requests: supportRequests,
    submitRequest,
    updateRequestStatus,
  } = useSupportRequests();

  // -------------------------------------------------------------
  // 4. Search and Filters State (useState)
  // -------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Toast Notification State
  const [notification, setNotification] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setNotification({ message, type });
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification]);

  // -------------------------------------------------------------
  // 5. Modal States (useState)
  // -------------------------------------------------------------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [studentForDetails, setStudentForDetails] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pre-filled data for Support page when jumping from Gap Alert
  const [prefilledSupportData, setPrefilledSupportData] = useState(null);

  // -------------------------------------------------------------
  // 6. Autofocus Search Input with useRef
  // -------------------------------------------------------------
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (currentRoute === 'students' || currentRoute === 'dashboard') {
      searchInputRef.current?.focus();
    }
  }, [currentRoute]);

  // -------------------------------------------------------------
  // 7. useMemo: Filtered Student Data & Dashboard Statistics
  // -------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        student.name?.toLowerCase().includes(term) ||
        student.id?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.course?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'All' || student.status === statusFilter;

      const matchesSemester =
        semesterFilter === 'All' || String(student.semester) === String(semesterFilter);

      const matchesCourse =
        courseFilter === 'All' || student.course === courseFilter;

      return matchesSearch && matchesStatus && matchesSemester && matchesCourse;
    });
  }, [students, searchTerm, statusFilter, semesterFilter, courseFilter]);

  // Dashboard Stats computed using useMemo
  const stats = useMemo(() => {
    if (!students || students.length === 0) {
      return {
        totalStudents: 0,
        avgAttendance: 0,
        avgMarks: 0,
        totalGaps: 0,
        onTrackCount: 0,
        atRiskCount: 0,
      };
    }

    const totalStudents = students.length;
    const totalAttendance = students.reduce((acc, curr) => acc + (Number(curr.attendance) || 0), 0);
    const totalMarks = students.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0);
    const totalGaps = students.reduce((acc, curr) => acc + (Number(curr.gaps) || 0), 0);

    const onTrackCount = students.filter((s) => s.status === 'On Track').length;
    const atRiskCount = students.filter((s) => s.status === 'At Risk').length;

    return {
      totalStudents,
      avgAttendance: Math.round(totalAttendance / totalStudents),
      avgMarks: Math.round(totalMarks / totalStudents),
      totalGaps,
      onTrackCount,
      atRiskCount,
    };
  }, [students]);

  // Total flagged gaps count across all students (Exp3 GapAlerts)
  const gapCount = useMemo(() => {
    let count = 0;
    students.forEach((s) => {
      (s.subjects || []).forEach((sub) => {
        if (sub.gap || sub.marks < 50 || sub.attendance < 75) {
          count++;
        }
      });
    });
    return count;
  }, [students]);

  // Reset Filters handler
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('All');
    setSemesterFilter('All');
    setCourseFilter('All');
    searchInputRef.current?.focus();
  }, []);

  const isFiltered =
    searchTerm !== '' ||
    statusFilter !== 'All' ||
    semesterFilter !== 'All' ||
    courseFilter !== 'All';

  // -------------------------------------------------------------
  // 8. useCallback: Memoized Handlers for Reusable Components
  // -------------------------------------------------------------
  const handleOpenAddModal = useCallback(() => {
    setModalMode('add');
    setSelectedStudent(null);
    setModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((student) => {
    setModalMode('edit');
    setSelectedStudent(student);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedStudent(null);
  }, []);

  const handleViewBreakdown = useCallback((student) => {
    setStudentForDetails(student);
    setDetailsModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback(
    async (formData) => {
      if (modalMode === 'add') {
        const result = await createStudent(formData);
        if (result.success) {
          showToast(`Student ${formData.name} successfully enrolled!`, 'success');
          return true;
        } else {
          showToast(result.error || 'Failed to enroll student.', 'error');
          return false;
        }
      } else {
        const result = await updateStudent(formData.id, formData);
        if (result.success) {
          showToast(`Record for ${formData.name} updated successfully!`, 'success');
          return true;
        } else {
          showToast(result.error || 'Failed to update record.', 'error');
          return false;
        }
      }
    },
    [modalMode, createStudent, updateStudent, showToast]
  );

  // Quick PATCH handlers for status and attendance
  const handleQuickPatchStatus = useCallback(
    async (id, newStatus) => {
      const targetStudent = students.find((s) => String(s.id) === String(id));
      const res = await patchStudent(id, { status: newStatus });
      if (res.success) {
        showToast(`Updated ${targetStudent?.name || id}'s status to "${newStatus}"`, 'success');
      } else {
        showToast(res.error || 'Failed to update status', 'error');
      }
    },
    [students, patchStudent, showToast]
  );

  const handleQuickPatchAttendance = useCallback(
    async (id, newAttendance) => {
      const res = await patchStudent(id, { attendance: newAttendance });
      if (res.success) {
        showToast(`Attendance updated to ${newAttendance}%`, 'success');
      } else {
        showToast(res.error || 'Failed to adjust attendance', 'error');
      }
    },
    [patchStudent, showToast]
  );

  // Delete modal handlers
  const handleDeleteRequest = useCallback((student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    const result = await removeStudent(studentToDelete.id);
    setIsDeleting(false);

    if (result.success) {
      showToast(`Removed student ${studentToDelete.name} (${studentToDelete.id})`, 'success');
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    } else {
      showToast(result.error || 'Failed to delete student', 'error');
    }
  }, [studentToDelete, removeStudent, showToast]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  }, []);

  // Jump from Gap Alert to Support page with prefilled data
  const handleInitiateSupport = useCallback((studentAlertInfo) => {
    setPrefilledSupportData(studentAlertInfo);
    setCurrentRoute('support');
    showToast(`Mentoring form pre-filled for ${studentAlertInfo.studentName}`, 'success');
  }, [showToast]);

  // Support form submission
  const handleSupportSubmit = useCallback(
    async (requestData) => {
      const res = await submitRequest(requestData);
      if (res.success) {
        showToast('Academic support ticket submitted!', 'success');
      }
    },
    [submitRequest, showToast]
  );

  // Export CSV
  const handleExportCSV = useCallback(() => {
    exportStudentsToCSV(students);
    showToast('Exported student roster to CSV', 'success');
  }, [students, showToast]);

  return (
    <div className="app-container">
      {/* Toast Alert */}
      <ToastAlert notification={notification} onDismiss={() => setNotification(null)} />

      {/* Header (Exp3 + Exp4 + Pro Additions) */}
      <Header
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        gapCount={gapCount}
        theme={theme}
        onToggleTheme={toggleTheme}
        onRefresh={refetch}
        loading={loading}
        onOpenAddModal={handleOpenAddModal}
        onExportCSV={handleExportCSV}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Offline Diagnostic Banner */}
        {isOfflineMode && (
          <div className="offline-banner" role="status">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <AlertTriangle size={18} />
              <span>
                <strong>Running in Local Persistence Mode:</strong> REST server at{' '}
                <code>http://localhost:3000</code> is offline. All CRUD operations will persist in
                your browser storage.
              </span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={refetch}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* -------------------- 1. DASHBOARD VIEW (Exp3 + Exp4) -------------------- */}
        {currentRoute === 'dashboard' && (
          <>
            <div className="page-header">
              <div>
                <h2 className="page-title">Academic Intervention & Progress Overview</h2>
                <p className="page-description">
                  Real-time cohort monitoring, course gap flags, and early intervention metrics.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCurrentRoute('students')}
              >
                <span>View Full Student Directory →</span>
              </button>
            </div>

            {/* Performance KPI Summary Cards (Exp4 useMemo) */}
            <DashboardStats stats={stats} />

            {/* Dashboard 2-Column Grid: Featured Students (Exp4) + GapAlerts (Exp3) */}
            <div className="dashboard-grid">
              {/* Left Column: Enrolled Students */}
              <section aria-labelledby="enrolled-students-title">
                <div className="section-title-wrap">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h3 id="enrolled-students-title" className="section-title">
                      Enrolled Students
                    </h3>
                    <span className="stat-badge badge-blue">
                      {students.length} Total
                    </span>
                  </div>

                  <div className="view-buttons" role="group" aria-label="Dashboard view format">
                    <button
                      type="button"
                      className={`view-btn ${viewMode === 'grid' ? 'view-btn-active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      title="Grid Card View"
                      aria-pressed={viewMode === 'grid'}
                    >
                      <LayoutGrid size={15} />
                    </button>
                    <button
                      type="button"
                      className={`view-btn ${viewMode === 'table' ? 'view-btn-active' : ''}`}
                      onClick={() => setViewMode('table')}
                      title="Table View"
                      aria-pressed={viewMode === 'table'}
                    >
                      <List size={15} />
                    </button>
                  </div>
                </div>

                {loading && students.length === 0 ? (
                  <LoadingSkeletonGrid />
                ) : students.length === 0 ? (
                  <div className="empty-state-card" role="status">
                    <HelpCircle size={44} className="empty-state-icon" />
                    <h3>No Students Found</h3>
                    <p>Get started by enrolling the first student into CourseGap Companion.</p>
                    <button
                      type="button"
                      className="btn btn-primary mt-3"
                      onClick={handleOpenAddModal}
                    >
                      Enroll First Student
                    </button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="cards-grid">
                    {students.map((student) => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        onEdit={handleOpenEditModal}
                        onDeleteRequest={handleDeleteRequest}
                        onQuickPatchStatus={handleQuickPatchStatus}
                        onQuickPatchAttendance={handleQuickPatchAttendance}
                        onViewDetails={handleViewBreakdown}
                      />
                    ))}
                  </div>
                ) : (
                  <StudentTable
                    students={students}
                    onEdit={handleOpenEditModal}
                    onDeleteRequest={handleDeleteRequest}
                    onQuickPatchStatus={handleQuickPatchStatus}
                    onViewDetails={handleViewBreakdown}
                  />
                )}
              </section>

              {/* Right Column: Dynamic Gap Alerts (Exp3) */}
              <section aria-labelledby="gap-alerts-sidebar">
                <GapAlerts
                  students={students}
                  onInitiateSupport={handleInitiateSupport}
                  onViewStudent={handleViewBreakdown}
                />
              </section>
            </div>
          </>
        )}

        {/* -------------------- 2. STUDENTS DIRECTORY VIEW (Exp4 Full) -------------------- */}
        {currentRoute === 'students' && (
          <>
            <div className="page-header">
              <div>
                <h2 className="page-title">Student Academic Directory</h2>
                <p className="page-description">
                  Filter, search, adjust attendance, and manage student performance profiles.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleOpenAddModal}
                >
                  <span>+ Enroll Student</span>
                </button>
              </div>
            </div>

            {/* Filter Controls (Exp4 useState + useRef) */}
            <section className="controls-section" aria-label="Filters and controls">
              <FilterBar
                searchInputRef={searchInputRef}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                semesterFilter={semesterFilter}
                onSemesterFilterChange={setSemesterFilter}
                courseFilter={courseFilter}
                onCourseFilterChange={setCourseFilter}
                onResetFilters={handleResetFilters}
                isFiltered={isFiltered}
                matchCount={filteredStudents.length}
              />

              <div className="view-toggle-bar">
                <span className="results-counter">
                  Showing <strong>{filteredStudents.length}</strong> of{' '}
                  <strong>{students.length}</strong> students
                </span>

                <div className="view-buttons" role="group" aria-label="View format">
                  <button
                    type="button"
                    className={`view-btn ${viewMode === 'grid' ? 'view-btn-active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid Card View"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <LayoutGrid size={16} />
                    <span className="hide-mobile">Grid</span>
                  </button>
                  <button
                    type="button"
                    className={`view-btn ${viewMode === 'table' ? 'view-btn-active' : ''}`}
                    onClick={() => setViewMode('table')}
                    title="Table View"
                    aria-pressed={viewMode === 'table'}
                  >
                    <List size={16} />
                    <span className="hide-mobile">Table</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Student Records Grid / Table */}
            <section aria-label="Students List">
              {loading && students.length === 0 ? (
                <LoadingSkeletonGrid />
              ) : filteredStudents.length === 0 ? (
                <div className="empty-state-card" role="status">
                  <HelpCircle size={48} className="empty-state-icon" />
                  <h3>No Matching Students Found</h3>
                  <p>
                    {isFiltered
                      ? 'No records match your active search and filter combinations.'
                      : 'No student records are currently available in the database.'}
                  </p>
                  {isFiltered ? (
                    <button
                      type="button"
                      className="btn btn-secondary mt-3"
                      onClick={handleResetFilters}
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary mt-3"
                      onClick={handleOpenAddModal}
                    >
                      Enroll First Student
                    </button>
                  )}
                </div>
              ) : viewMode === 'grid' ? (
                <div className="cards-grid">
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onEdit={handleOpenEditModal}
                      onDeleteRequest={handleDeleteRequest}
                      onQuickPatchStatus={handleQuickPatchStatus}
                      onQuickPatchAttendance={handleQuickPatchAttendance}
                      onViewDetails={handleViewBreakdown}
                    />
                  ))}
                </div>
              ) : (
                <StudentTable
                  students={filteredStudents}
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={handleDeleteRequest}
                  onQuickPatchStatus={handleQuickPatchStatus}
                  onViewDetails={handleViewBreakdown}
                />
              )}
            </section>
          </>
        )}

        {/* -------------------- 3. GAP ALERTS VIEW (Exp3 Full) -------------------- */}
        {currentRoute === 'gap-alerts' && (
          <div>
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h2 className="page-title">Critical Academic Gap Alerts</h2>
                <p className="page-description">
                  Automated detection of students with marks &lt; 50%, attendance &lt; 75%, or explicit gap flags.
                </p>
              </div>
            </div>

            <GapAlerts
              students={students}
              onInitiateSupport={handleInitiateSupport}
              onViewStudent={handleViewBreakdown}
            />
          </div>
        )}

        {/* -------------------- 4. SUPPORT & ASSISTANCE (Exp3 Form + Tracker) -------------------- */}
        {currentRoute === 'support' && (
          <SupportPage
            initialStudentData={prefilledSupportData}
            supportRequests={supportRequests}
            onSubmitRequest={handleSupportSubmit}
            onUpdateStatus={updateRequestStatus}
          />
        )}

        {/* -------------------- 5. ANALYTICS & RISK MATRIX (New Pro Feature) -------------------- */}
        {currentRoute === 'analytics' && <AnalyticsPage students={students} />}
      </main>

      {/* Add / Edit Student Modal (Exp4 + Subject Manager) */}
      <StudentModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={selectedStudent}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />

      {/* Student Academic Breakdown Modal (Exp3) */}
      <StudentDetailsModal
        student={studentForDetails}
        onClose={() => setStudentForDetails(null)}
        onInitiateSupport={handleInitiateSupport}
      />

      {/* Delete Confirmation Modal (Exp4) */}
      <ConfirmDeleteModal
        isOpen={deleteDialogOpen}
        student={studentToDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="app-footer" role="contentinfo">
        <p>
          CourseGap Companion Pro • Unified Academic Progress & Intervention System • Built with React 19 & Vite
        </p>
      </footer>
    </div>
  );
}
