import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useStudents } from './hooks/useStudents';
import { DashboardStats } from './components/DashboardStats';
import { FilterBar } from './components/FilterBar';
import { StudentCard } from './components/StudentCard';
import { StudentTable } from './components/StudentTable';
import { StudentModal } from './components/StudentModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { ToastAlert, LoadingSkeletonGrid } from './components/ToastAlert';
import {
  Sun,
  Moon,
  Plus,
  RefreshCw,
  LayoutGrid,
  List,
  GraduationCap,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import './App.css';

export default function App() {
  // -------------------------------------------------------------
  // 1. Theme Management (useEffect + useState + localStorage)
  // -------------------------------------------------------------
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('coursegap-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('coursegap-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // -------------------------------------------------------------
  // 2. Custom Hook: useStudents
  // -------------------------------------------------------------
  const {
    students,
    loading,
    error,
    refetch,
    createStudent,
    updateStudent,
    patchStudent,
    removeStudent,
  } = useStudents();

  // -------------------------------------------------------------
  // 3. Search and Filters State (useState)
  // -------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Notification Toast State
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
  // 4. Modal States (useState)
  // -------------------------------------------------------------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // -------------------------------------------------------------
  // 5. useRef: Autofocus Search Input on Page Load
  // -------------------------------------------------------------
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Focus search input automatically once on initial page load
    searchInputRef.current?.focus();
  }, []);

  // -------------------------------------------------------------
  // 6. useMemo: Filtered Student Data & Dashboard Statistics
  // -------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 1. Search term (by Name or Student ID)
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        student.name?.toLowerCase().includes(term) ||
        student.id?.toLowerCase().includes(term);

      // 2. Status filter
      const matchesStatus =
        statusFilter === 'All' || student.status === statusFilter;

      // 3. Semester filter
      const matchesSemester =
        semesterFilter === 'All' || String(student.semester) === String(semesterFilter);

      return matchesSearch && matchesStatus && matchesSemester;
    });
  }, [students, searchTerm, statusFilter, semesterFilter]);

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

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('All');
    setSemesterFilter('All');
    searchInputRef.current?.focus();
  }, []);

  const isFiltered = searchTerm !== '' || statusFilter !== 'All' || semesterFilter !== 'All';

  // -------------------------------------------------------------
  // 7. useCallback: Memoized Handlers for Reusable Components
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
          showToast(`Student ${formData.name} record updated successfully!`, 'success');
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

  // Delete modal flows
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

  return (
    <div className="app-container">
      {/* Toast Alert */}
      <ToastAlert notification={notification} onDismiss={() => setNotification(null)} />

      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="brand-badge">
            <GraduationCap className="brand-icon" size={28} />
          </div>
          <div>
            <h1 className="brand-title">CourseGap Companion</h1>
            <p className="brand-subtitle">
              Academic Intervention, Attendance Monitoring & Learning Gap Tracker
            </p>
          </div>
        </div>

        <div className="header-right">
          <button
            type="button"
            className="btn btn-secondary btn-icon-text"
            onClick={refetch}
            title="Refresh student records from server"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
            <span className="hide-mobile">Refresh</span>
          </button>

          <button
            type="button"
            className="btn btn-icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Toggle Theme (Current: ${theme})`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-icon-text"
            onClick={handleOpenAddModal}
          >
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Error Banner if API failed */}
        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={22} className="error-icon" />
            <div className="error-text-wrap">
              <strong>Server Connection Error:</strong>
              <p>{error}</p>
              <p className="error-hint">
                💡 Run <code>npm run server</code> to start JSON Server on port 3000.
              </p>
            </div>
            <button type="button" className="btn btn-sm btn-secondary" onClick={refetch}>
              Retry Connection
            </button>
          </div>
        )}

        {/* Dashboard Statistics (useMemo) */}
        <DashboardStats stats={stats} />

        {/* Filters and View Switcher */}
        <section className="controls-section" aria-label="Filters and controls">
          <FilterBar
            searchInputRef={searchInputRef}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            semesterFilter={semesterFilter}
            onSemesterFilterChange={setSemesterFilter}
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

        {/* Student Records List / Table */}
        <section className="students-content-section" aria-label="Students List">
          {loading && students.length === 0 ? (
            <LoadingSkeletonGrid />
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state-card" role="status">
              <HelpCircle size={48} className="empty-state-icon" />
              <h3>No Students Found</h3>
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
                  Add First Student
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
                />
              ))}
            </div>
          ) : (
            <StudentTable
              students={filteredStudents}
              onEdit={handleOpenEditModal}
              onDeleteRequest={handleDeleteRequest}
              onQuickPatchStatus={handleQuickPatchStatus}
            />
          )}
        </section>
      </main>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={selectedStudent}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteDialogOpen}
        student={studentToDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
