import React from 'react';

export default function StudentStats({ students }) {
  const totalStudents = students ? students.length : 0;

  const uniqueDepartments = students
    ? new Set(students.map((s) => s.department).filter(Boolean)).size
    : 0;

  const uniqueCourses = students
    ? new Set(students.map((s) => s.course).filter(Boolean)).size
    : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card" id="stat-total-students">
        <div className="stat-info">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-desc">Enrolled in database</div>
        </div>
        <div className="stat-icon primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      </div>

      <div className="stat-card" id="stat-departments">
        <div className="stat-info">
          <div className="stat-label">Departments</div>
          <div className="stat-value">{uniqueDepartments}</div>
          <div className="stat-desc">Academic faculties</div>
        </div>
        <div className="stat-icon cyan">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </div>
      </div>

      <div className="stat-card" id="stat-courses">
        <div className="stat-info">
          <div className="stat-label">Active Courses</div>
          <div className="stat-value">{uniqueCourses}</div>
          <div className="stat-desc">Degree programs</div>
        </div>
        <div className="stat-icon emerald">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
      </div>

      <div className="stat-card" id="stat-deployment">
        <div className="stat-info">
          <div className="stat-label">Target Infrastructure</div>
          <div className="stat-value" style={{ fontSize: '1.45rem', marginTop: '0.4rem' }}>AWS EC2</div>
          <div className="stat-desc">Multi-container Docker Compose</div>
        </div>
        <div className="stat-icon amber">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
