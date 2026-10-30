import React, { useState, useEffect, useRef } from 'react';
import { X, Save, UserPlus, AlertCircle, Plus, Trash2, Calculator } from 'lucide-react';
import { COURSE_OPTIONS, SUBJECT_PRESETS } from '../data/defaultData';

const INITIAL_FORM_STATE = {
  id: '',
  name: '',
  email: '',
  semester: '4',
  course: 'Computer Science & Engineering',
  status: 'On Track',
  attendance: '85',
  marks: '75',
  gaps: '0',
  notes: '',
  subjects: [],
};

export function StudentModal({ isOpen, mode = 'add', initialData = null, onClose, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Field refs for autofocus jumping using useRef
  const idRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const attendanceRef = useRef(null);
  const marksRef = useRef(null);
  const gapsRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          id: initialData.id || '',
          name: initialData.name || '',
          email: initialData.email || '',
          semester: String(initialData.semester || '4'),
          course: initialData.course || 'Computer Science & Engineering',
          status: initialData.status || 'On Track',
          attendance: String(initialData.attendance ?? '85'),
          marks: String(initialData.marks ?? '75'),
          gaps: String(initialData.gaps ?? '0'),
          notes: initialData.notes || '',
          subjects: Array.isArray(initialData.subjects)
            ? JSON.parse(JSON.stringify(initialData.subjects))
            : [],
        });
      } else {
        const autoId = `STU${Math.floor(100 + Math.random() * 900)}`;
        const course = 'Computer Science & Engineering';
        const defaultSubs = (SUBJECT_PRESETS[course] || []).slice(0, 4).map((s) => ({
          code: s.code,
          name: s.name,
          marks: 75,
          attendance: 85,
          gap: false,
        }));

        setFormData({
          ...INITIAL_FORM_STATE,
          id: autoId,
          course,
          subjects: defaultSubs,
        });
      }
      setErrors({});

      setTimeout(() => {
        nameRef.current?.focus();
      }, 100);
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Subject management inside modal
  const handleSubjectChange = (index, field, value) => {
    setFormData((prev) => {
      const nextSubs = [...prev.subjects];
      nextSubs[index] = {
        ...nextSubs[index],
        [field]: field === 'marks' || field === 'attendance' ? Number(value) : value,
      };
      return { ...prev, subjects: nextSubs };
    });
  };

  const handleAddSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          code: `SUB${prev.subjects.length + 1}`,
          name: 'New Academic Subject',
          marks: 70,
          attendance: 80,
          gap: false,
        },
      ],
    }));
  };

  const handleRemoveSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, idx) => idx !== index),
    }));
  };

  // Auto-calculate averages from subjects
  const handleRecalculateFromSubjects = () => {
    if (formData.subjects.length === 0) return;
    const totalMarks = formData.subjects.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0);
    const totalAtt = formData.subjects.reduce((acc, curr) => acc + (Number(curr.attendance) || 0), 0);
    const gapCount = formData.subjects.filter(
      (s) => s.gap || Number(s.marks) < 50 || Number(s.attendance) < 75
    ).length;

    const avgM = Math.round(totalMarks / formData.subjects.length);
    const avgA = Math.round(totalAtt / formData.subjects.length);

    let derivedStatus = 'On Track';
    if (gapCount >= 2 || avgA < 75 || avgM < 50) {
      derivedStatus = 'At Risk';
    } else if (gapCount === 1 || avgA < 80 || avgM < 65) {
      derivedStatus = 'Needs Attention';
    }

    setFormData((prev) => ({
      ...prev,
      marks: String(avgM),
      attendance: String(avgA),
      gaps: String(gapCount),
      status: derivedStatus,
    }));
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
      newErrors.email = 'Please provide a valid institutional email.';
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

    // Demonstration of useRef: Move focus directly to first invalid field
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
      subjects: formData.subjects,
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
      <div className="modal-content modal-content-lg">
        <header className="modal-header">
          <div className="modal-title-wrap">
            {mode === 'add' ? (
              <UserPlus className="modal-title-icon text-blue" size={22} />
            ) : (
              <Save className="modal-title-icon text-purple" size={22} />
            )}
            <h2 id="modal-title">
              {mode === 'add' ? 'Enroll New Student Record' : `Edit Student: ${initialData?.name}`}
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
                disabled={mode === 'edit'}
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
                placeholder="e.g. Diya Patel"
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
                Institutional Email <span className="text-red">*</span>
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
                {COURSE_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
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
                Academic Status
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
              />
              {errors.attendance && (
                <span className="field-error-msg">
                  <AlertCircle size={13} /> {errors.attendance}
                </span>
              )}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="student-marks-field" className="form-label">
                Average Marks (%) <span className="text-red">*</span>
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
              />
              {errors.marks && (
                <span className="field-error-msg">
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
              />
              {errors.gaps && (
                <span className="field-error-msg">
                  <AlertCircle size={13} /> {errors.gaps}
                </span>
              )}
            </div>
          </div>

          {/* Row 5: Dynamic Subject Catalog & Marks Manager */}
          <div className="form-subjects-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  Enrolled Subjects & Marks Breakdown ({formData.subjects.length})
                </strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Manage individual subject examination scores and attendance records.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleRecalculateFromSubjects}
                  title="Auto-calculate overall marks and attendance from subject scores"
                >
                  <Calculator size={13} />
                  <span>Sync Metrics</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddSubject}
                >
                  <Plus size={13} />
                  <span>Add Subject</span>
                </button>
              </div>
            </div>

            {formData.subjects.map((sub, idx) => (
              <div key={idx} className="subject-item-row">
                <input
                  type="text"
                  className="form-input btn-sm"
                  placeholder="Code (CS401)"
                  value={sub.code}
                  onChange={(e) => handleSubjectChange(idx, 'code', e.target.value)}
                  title="Subject Code"
                />
                <input
                  type="text"
                  className="form-input btn-sm"
                  placeholder="Subject Name"
                  value={sub.name}
                  onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)}
                  title="Subject Name"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input btn-sm"
                  placeholder="Marks %"
                  value={sub.marks}
                  onChange={(e) => handleSubjectChange(idx, 'marks', e.target.value)}
                  title="Marks Score (0-100)"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input btn-sm"
                  placeholder="Att %"
                  value={sub.attendance}
                  onChange={(e) => handleSubjectChange(idx, 'attendance', e.target.value)}
                  title="Attendance % (0-100)"
                />
                <button
                  type="button"
                  className="icon-action-btn delete-btn"
                  onClick={() => handleRemoveSubject(idx)}
                  title="Remove this subject"
                  aria-label="Remove subject"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Row 6: Counselor Remarks / Notes */}
          <div className="form-group">
            <label htmlFor="student-notes-field" className="form-label">
              Academic Counselor Remarks / Notes
            </label>
            <textarea
              id="student-notes-field"
              name="notes"
              rows={2}
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
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : mode === 'add' ? 'Enroll Student' : 'Update Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
