import React, { useState } from 'react';

export default function Support() {
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    subjectCode: '',
    issueCategory: 'Academic Counseling',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.studentName.trim()) {
      errs.studentName = 'Student name is required';
    }
    if (!formData.studentEmail.trim()) {
      errs.studentEmail = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.studentEmail)) {
      errs.studentEmail = 'Please provide a valid email address';
    }
    if (!formData.subjectCode.trim()) {
      errs.subjectCode = 'Course/Subject code is required';
    }
    if (!formData.description.trim()) {
      errs.description = 'Please describe the challenge or question';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters long';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Process submission
    setIsSubmitted(true);
    setFormData({
      studentName: '',
      studentEmail: '',
      subjectCode: '',
      issueCategory: 'Academic Counseling',
      description: '',
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Academic Support & Assistance</h2>
          <p className="page-description">
            Request tutoring, resolve attendance discrepancies, or schedule faculty mentoring.
          </p>
        </div>
      </div>

      <div className="support-card">
        {isSubmitted && (
          <div className="form-success-banner" role="status">
            <strong>✓ Support Request Submitted!</strong>
            <p style={{ marginTop: '0.25rem' }}>
              Your academic advisor has been notified. You will receive an appointment confirmation shortly.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="CourseGap Support Form">
          <div className="form-group">
            <label htmlFor="studentName" className="form-label">
              Full Name <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="studentName"
              name="studentName"
              type="text"
              className="form-input"
              value={formData.studentName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={errors.studentName ? 'true' : 'false'}
              aria-describedby={errors.studentName ? 'studentName-error' : undefined}
              placeholder="e.g. Diya Patel"
            />
            {errors.studentName && (
              <span id="studentName-error" className="form-error">
                {errors.studentName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="studentEmail" className="form-label">
              Institutional Email <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="studentEmail"
              name="studentEmail"
              type="email"
              className="form-input"
              value={formData.studentEmail}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={errors.studentEmail ? 'true' : 'false'}
              aria-describedby={errors.studentEmail ? 'studentEmail-error' : undefined}
              placeholder="e.g. diya.patel@example.edu"
            />
            {errors.studentEmail && (
              <span id="studentEmail-error" className="form-error">
                {errors.studentEmail}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="subjectCode" className="form-label">
              Subject Code <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="subjectCode"
              name="subjectCode"
              type="text"
              className="form-input"
              value={formData.subjectCode}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={errors.subjectCode ? 'true' : 'false'}
              aria-describedby={errors.subjectCode ? 'subjectCode-error' : undefined}
              placeholder="e.g. CS601 (Compiler Design)"
            />
            {errors.subjectCode && (
              <span id="subjectCode-error" className="form-error">
                {errors.subjectCode}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="issueCategory" className="form-label">
              Support Category
            </label>
            <select
              id="issueCategory"
              name="issueCategory"
              className="form-select"
              value={formData.issueCategory}
              onChange={handleChange}
            >
              <option value="Academic Counseling">Academic Counseling & Guidance</option>
              <option value="Attendance Rectification">Attendance Condonation / Review</option>
              <option value="Remedial Classes">Remedial Class Enrollment</option>
              <option value="Assignment / Internal Test Query">Assignment / Internal Test Query</option>
              <option value="Other">Other Query</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Detailed Description <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={errors.description ? 'true' : 'false'}
              aria-describedby={errors.description ? 'description-error' : undefined}
              placeholder="Explain what specific concept, syllabus section, or attendance issue you need assistance with..."
            />
            {errors.description && (
              <span id="description-error" className="form-error">
                {errors.description}
              </span>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Submit Support Request
          </button>
        </form>
      </div>
    </div>
  );
}
