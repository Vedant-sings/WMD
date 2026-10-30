import React, { useState, useEffect } from 'react';
import { LifeBuoy, Send, CheckCircle2, AlertCircle, Clock, CheckCheck } from 'lucide-react';

export function SupportPage({
  initialStudentData = null,
  supportRequests = [],
  onSubmitRequest,
  onUpdateStatus,
}) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentId: '',
    subjectCode: '',
    issueCategory: 'Academic Counseling',
    urgency: 'Medium',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (initialStudentData) {
      setFormData((prev) => ({
        ...prev,
        studentName: initialStudentData.studentName || '',
        studentEmail: initialStudentData.studentEmail || '',
        studentId: initialStudentData.studentId || '',
        subjectCode: initialStudentData.subjectCode || '',
        description: initialStudentData.subjectCode
          ? `Requesting immediate remedial guidance and attendance counseling for course subject ${initialStudentData.subjectCode}.`
          : '',
      }));
    }
  }, [initialStudentData]);

  const validate = () => {
    const errs = {};
    if (!formData.studentName.trim()) {
      errs.studentName = 'Student name is required.';
    }
    if (!formData.studentEmail.trim()) {
      errs.studentEmail = 'Institutional email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail.trim())) {
      errs.studentEmail = 'Please provide a valid institutional email address.';
    }
    if (!formData.subjectCode.trim()) {
      errs.subjectCode = 'Course/Subject code is required.';
    }
    if (!formData.description.trim()) {
      errs.description = 'Please explain the specific academic challenge.';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters long.';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmitRequest(formData);
    setIsSubmitted(true);
    setFormData({
      studentName: '',
      studentEmail: '',
      studentId: '',
      subjectCode: '',
      issueCategory: 'Academic Counseling',
      urgency: 'Medium',
      description: '',
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 6000);
  };

  const filteredRequests = supportRequests.filter((r) => {
    if (statusFilter === 'All') return true;
    return r.status === statusFilter;
  });

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <h2 className="page-title">Academic Support & Early Intervention Hub</h2>
          <p className="page-description">
            Submit tutoring requests, address attendance deficits, and track active faculty mentoring sessions.
          </p>
        </div>
      </div>

      <div className="support-layout">
        {/* Support Request Submission Form (Exp3) */}
        <section aria-labelledby="form-heading" className="support-card">
          <div className="section-title-wrap">
            <h3 id="form-heading" className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LifeBuoy className="text-blue" size={20} />
              <span>Submit Mentoring Request</span>
            </h3>
          </div>

          {isSubmitted && (
            <div className="form-success-banner" role="status">
              <strong>✓ Support Request Dispatched Successfully!</strong>
              <p style={{ marginTop: '0.25rem' }}>
                The academic advisory department has been notified. An intervention case has been created in the tracker.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="support-form" noValidate>
            <div className="form-row">
              <div className="form-group flex-2">
                <label htmlFor="studentName" className="form-label">
                  Student Name <span className="text-red">*</span>
                </label>
                <input
                  id="studentName"
                  name="studentName"
                  type="text"
                  className={`form-input ${errors.studentName ? 'input-error' : ''}`}
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="e.g. Diya Patel"
                  aria-invalid={!!errors.studentName}
                />
                {errors.studentName && <span className="field-error-msg">{errors.studentName}</span>}
              </div>

              <div className="form-group flex-1">
                <label htmlFor="studentId" className="form-label">
                  Student ID (Optional)
                </label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  className="form-input"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. STU102"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="studentEmail" className="form-label">
                  Institutional Email <span className="text-red">*</span>
                </label>
                <input
                  id="studentEmail"
                  name="studentEmail"
                  type="email"
                  className={`form-input ${errors.studentEmail ? 'input-error' : ''}`}
                  value={formData.studentEmail}
                  onChange={handleChange}
                  placeholder="student@example.edu"
                  aria-invalid={!!errors.studentEmail}
                />
                {errors.studentEmail && <span className="field-error-msg">{errors.studentEmail}</span>}
              </div>

              <div className="form-group flex-1">
                <label htmlFor="subjectCode" className="form-label">
                  Course / Subject Code <span className="text-red">*</span>
                </label>
                <input
                  id="subjectCode"
                  name="subjectCode"
                  type="text"
                  className={`form-input ${errors.subjectCode ? 'input-error' : ''}`}
                  value={formData.subjectCode}
                  onChange={handleChange}
                  placeholder="e.g. CS601 (Compiler Design)"
                  aria-invalid={!!errors.subjectCode}
                />
                {errors.subjectCode && <span className="field-error-msg">{errors.subjectCode}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
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
                  <option value="Special Accommodations">Special Health / Lab Accommodations</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label htmlFor="urgency" className="form-label">
                  Urgency Level
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  className="form-select"
                  value={formData.urgency}
                  onChange={handleChange}
                >
                  <option value="Low">Low - General Inquiries</option>
                  <option value="Medium">Medium - Exam preparation gap</option>
                  <option value="High">High - Impending debarment / risk</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Detailed Academic Concern / Reason <span className="text-red">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain the specific syllabus topics, attendance gaps, or exam queries requiring intervention..."
                aria-invalid={!!errors.description}
              />
              {errors.description && <span className="field-error-msg">{errors.description}</span>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              <Send size={16} />
              <span>Submit Intervention Ticket</span>
            </button>
          </form>
        </section>

        {/* Support Tickets Tracker (NEW Feature) */}
        <section aria-labelledby="tracker-heading" className="support-card">
          <div className="section-title-wrap">
            <h3 id="tracker-heading" className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock className="text-purple" size={20} />
              <span>Intervention Ticket Tracker ({filteredRequests.length})</span>
            </h3>

            <select
              className="select-input btn-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter tickets by status"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="tickets-list">
            {filteredRequests.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '2rem 0' }}>
                No support tickets found under this status filter.
              </p>
            ) : (
              filteredRequests.map((req) => (
                <article key={req.id} className="ticket-card">
                  <div className="ticket-card-header">
                    <div>
                      <span className="ticket-id">{req.id}</span>
                      <h4 className="ticket-student">{req.studentName}</h4>
                      <p className="ticket-meta">
                        {req.studentEmail} • <strong>{req.subjectCode}</strong> ({req.issueCategory})
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        className={`stat-badge ${
                          req.urgency === 'High'
                            ? 'badge-red'
                            : req.urgency === 'Medium'
                            ? 'badge-amber'
                            : 'badge-blue'
                        }`}
                      >
                        {req.urgency} Urgency
                      </span>
                    </div>
                  </div>

                  <p className="ticket-desc">{req.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                      Submitted: {new Date(req.timestamp).toLocaleDateString()}
                    </small>

                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
                      <select
                        className="select-input"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                        value={req.status}
                        onChange={(e) => onUpdateStatus(req.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
