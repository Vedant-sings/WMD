import React, { useState, useEffect, useRef } from 'react';
import { X, Save, UserPlus, AlertCircle } from 'lucide-react';

const INITIAL_FORM_STATE = {
  id: '',
  name: '',
  email: '',
  semester: '1',
  course: 'Computer Science & Engineering',
  status: 'On Track',
  attendance: '85',
  marks: '75',
  gaps: '0',
  notes: '',
};

/**
 * StudentModal Component
 * - Manages controlled form inputs with useState
 * - Uses useRef to move focus to the first invalid field upon form validation error
 * - Supports both "Add Student" and "Edit Student" modes
 */
export function StudentModal({ isOpen, mode = 'add', initialData = null, onClose, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Field refs for targeted autofocus using useRef
  const idRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const attendanceRef = useRef(null);
  const marksRef = useRef(null);
  const gapsRef = useRef(null);

  // Sync form data whenever modal opens or editing student changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          id: initialData.id || '',
          name: initialData.name || '',
          email: initialData.email || '',
          semester: String(initialData.semester || '1'),
          course: initialData.course || 'Computer Science & Engineering',
          status: initialData.status || 'On Track',
          attendance: String(initialData.attendance ?? '85'),
          marks: String(initialData.marks ?? '75'),
          gaps: String(initialData.gaps ?? '0'),
          notes: initialData.notes || '',
        });
      } else {
        // Generate automatic ID for quick convenience in Add mode
        const autoId = `STU${Math.floor(100 + Math.random() * 900)}`;
        setFormData({ ...INITIAL_FORM_STATE, id: autoId });
      }
      setErrors({});

      // Focus name or id upon opening
      setTimeout(() => {
        if (mode === 'add') {
          nameRef.current?.focus();
        } else {
          nameRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.id.trim()) {
      newErrors.id = 'Student ID is required.';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const attendanceNum = Number(formData.attendance);
    if (formData.attendance === '' || isNaN(attendanceNum) || attendanceNum < 0 || attendanceNum > 100) {
      newErrors.attendance = 'Attendance must be between 0% and 100%.';
    }

    const marksNum = Number(formData.marks);
    if (formData.marks === '' || isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      newErrors.marks = 'Marks must be between 0 and 100.';
    }

    const gapsNum = Number(formData.gaps);
    if (formData.gaps === '' || isNaN(gapsNum) || gapsNum < 0) {
      newErrors.gaps = 'Course gaps must be 0 or greater.';
    }

    setErrors(newErrors);

    // Demonstration of useRef: Move focus to the first invalid field
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.id) {
        idRef.current?.focus();
      } else if (newErrors.name) {
        nameRef.current?.focus();
      } else if (newErrors.email) {
        emailRef.current?.focus();
      } else if (newErrors.attendance) {
        attendanceRef.current?.focus();
      } else if (newErrors.marks) {
        marksRef.current?.focus();
      } else if (newErrors.gaps) {
        gapsRef.current?.focus();
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      id: formData.id.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      semester: parseInt(formData.semester, 10),
      course: formData.course,
      status: formData.status,
      attendance: Number(formData.attendance),
      marks: Number(formData.marks),
      gaps: Number(formData.gaps),
      notes: formData.notes.trim(),
    };

    const success = await onSubmit(payload);
    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <header className="modal-header">
          <div className="modal-title-wrap">
            {mode === 'add' ? (
              <UserPlus className="modal-title-icon text-blue" size={22} />
            ) : (
              <Save className="modal-title-icon text-purple" size={22} />
            )}
            <h2 id="modal-title">
              {mode === 'add' ? 'Enroll New Student' : `Edit Student: ${initialData?.name}`}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="student-form" noValidate>
          {/* Row 1: ID & Name */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="student-id-field" className="form-label">
                Student ID <span className="text-red">*</span>
              </label>
              <input
                ref={idRef}
                id="student-id-field"
                name="id"
                type="text"
                className={`form-input ${errors.id ? 'input-error' : ''}`}
                value={formData.id}
                onChange={handleChange}
                disabled={mode === 'edit'} // Keep ID constant when editing in typical REST APIs
                placeholder="e.g. STU108"
                aria-invalid={!!errors.id}
                aria-describedby={errors.id ? 'id-error' : undefined}
              />
              {errors.id && (
                <span id="id-error" className="field-error-msg">
                  <AlertCircle size={13} /> {errors.id}
                </span>
              )}
            </div>

            <div className="form-group flex-2">
              <label htmlFor="student-name-field" className="form-label">
                Full Name <span className="text-red">*</span>
              </label>
              <input
                ref={nameRef}
                id="student-name-field"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <span id="name-error" className="field-error-msg">
                  <AlertCircle size={13} /> {errors.name}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Email & Course */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="student-email-field" className="form-label">
                Email Address <span className="text-red">*</span>
              </label>
              <input
                ref={emailRef}
                id="student-email-field"
                name="email"
                type="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.edu"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <span id="email-error" className="field-error-msg">
                  <AlertCircle size={13} /> {errors.email}
                </span>
              )}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="student-course-field" className="form-label">
                Degree / Branch
              </label>
              <select
                id="student-course-field"
                name="course"
                className="form-select"
                value={formData.course}
                onChange={handleChange}
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence & Data Science">
                  Artificial Intelligence & Data Science
                </option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
              </select>
            </div>
          </div>

          {/* Row 3: Semester & Status */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="student-semester-field" className="form-label">
                Semester
              </label>
              <select
                id="student-semester-field"
                name="semester"
                className="form-select"
                value={formData.semester}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="student-status-field" className="form-label">
                Current Status
              </label>
              <select
                id="student-status-field"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="On Track">On Track</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>
          </div>

          {/* Row 4: Attendance, Marks, Gaps */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="student-attendance-field" className="form-label">
                Attendance (%) <span className="text-red">*</span>
              </label>
              <input
                ref={attendanceRef}
                id="student-attendance-field"
                name="attendance"
                type="number"
                min="0"
                max="100"
                className={`form-input ${errors.attendance ? 'input-error' : ''}`}
                value={formData.attendance}
                onChange={handleChange}
                aria-invalid={!!errors.attendance}
                aria-describedby={errors.attendance ? 'attendance-error' : undefined}
              />
              {errors.attendance && (
                <span id="attendance-error" className="field-error-msg">
                  <AlertCircle size={13} /> {errors.attendance}
                </span>
              )}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="student-marks-field" className="form-label">
                Average Marks (0-100) <span className="text-red">*</span>
              </label>
              <input
                ref={marksRef}
                id="student-marks-field"
                name="marks"
                type="number"
                min="0"
                max="100"
                className={`form-input ${errors.marks ? 'input-error' : ''}`}
                value={formData.marks}
                onChange={handleChange}
                aria-invalid={!!errors.marks}
                aria-describedby={errors.marks ? 'marks-error' : undefined}
              />
              {errors.marks && (
                <span id="marks-error" className="field-error-msg">
                  <AlertCircle size={13} /> {errors.marks}
                </span>
              )}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="student-gaps-field" className="form-label">
                Course Gaps <span className="text-red">*</span>
              </label>
              <input
                ref={gapsRef}
                id="student-gaps-field"
                name="gaps"
                type="number"
                min="0"
                max="20"
                className={`form-input ${errors.gaps ? 'input-error' : ''}`}
                value={formData.gaps}
                onChange={handleChange}
                aria-invalid={!!errors.gaps}
                aria-describedby={errors.gaps ? 'gaps-error' : undefined}
              />
              {errors.gaps && (
                <span id="gaps-error" className="field-error-msg">
                  <AlertCircle size={13} /> {errors.gaps}
                </span>
              )}
            </div>
          </div>

          {/* Row 5: Notes */}
          <div className="form-group">
            <label htmlFor="student-notes-field" className="form-label">
              Academic Counselor Remarks / Notes
            </label>
            <textarea
              id="student-notes-field"
              name="notes"
              rows={3}
              className="form-textarea"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Advised to participate in weekend peer tutoring..."
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : mode === 'add' ? 'Add Student' : 'Update Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
