import React, { useState, useEffect } from 'react';

export default function StudentModal({
  isOpen,
  mode, // 'add' | 'edit'
  student,
  onClose,
  onSubmit,
  serverErrors,
  submitting,
}) {
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    course: '',
    phone: '',
  });

  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (student && mode === 'edit') {
      setFormData({
        studentId: student.studentId || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        department: student.department || '',
        course: student.course || '',
        phone: student.phone || '',
      });
    } else {
      setFormData({
        studentId: '',
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        course: '',
        phone: '',
      });
    }
    setClientErrors({});
  }, [student, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear client error on field edit
    if (clientErrors[name]) {
      setClientErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+()\s-]{7,20}$/;

    if (!formData.studentId.trim()) {
      errors.studentId = 'Student registration number is required';
    } else if (formData.studentId.trim().length < 3) {
      errors.studentId = 'Registration number must be at least 3 characters';
    }

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    if (!formData.course.trim()) {
      errors.course = 'Course is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (7-20 digits)';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const getFieldError = (fieldName) => {
    return clientErrors[fieldName] || (serverErrors && serverErrors[fieldName]);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit Student Record' : 'Register New Student'}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            id="close-modal-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              {/* Student Registration Number */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="studentId">
                  Student Registration Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  className={`form-input ${getFieldError('studentId') ? 'error' : ''}`}
                  placeholder="e.g. STU-2024-001"
                  value={formData.studentId}
                  onChange={handleChange}
                  disabled={submitting}
                  autoFocus
                />
                {getFieldError('studentId') && (
                  <span className="field-error">{getFieldError('studentId')}</span>
                )}
              </div>

              {/* First Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`form-input ${getFieldError('firstName') ? 'error' : ''}`}
                  placeholder="e.g. Alex"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {getFieldError('firstName') && (
                  <span className="field-error">{getFieldError('firstName')}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`form-input ${getFieldError('lastName') ? 'error' : ''}`}
                  placeholder="e.g. Morgan"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {getFieldError('lastName') && (
                  <span className="field-error">{getFieldError('lastName')}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="email">
                  University Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${getFieldError('email') ? 'error' : ''}`}
                  placeholder="e.g. alex.morgan@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {getFieldError('email') && (
                  <span className="field-error">{getFieldError('email')}</span>
                )}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  Department <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className={`form-input ${getFieldError('department') ? 'error' : ''}`}
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {getFieldError('department') && (
                  <span className="field-error">{getFieldError('department')}</span>
                )}
              </div>

              {/* Course */}
              <div className="form-group">
                <label className="form-label" htmlFor="course">
                  Course <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  className={`form-input ${getFieldError('course') ? 'error' : ''}`}
                  placeholder="e.g. Cloud DevOps Engineering"
                  value={formData.course}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {getFieldError('course') && (
                  <span className="field-error">{getFieldError('course')}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${getFieldError('phone') ? 'error' : ''}`}
                  placeholder="e.g. +1-555-0199"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {getFieldError('phone') && (
                  <span className="field-error">{getFieldError('phone')}</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
              id="cancel-modal-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="submit-student-form-btn"
            >
              {submitting ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19"/>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : mode === 'edit' ? (
                'Update Student'
              ) : (
                'Save Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
