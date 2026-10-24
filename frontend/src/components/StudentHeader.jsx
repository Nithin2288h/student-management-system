import React from 'react';

export default function StudentHeader({
  totalCount,
  healthStatus,
  onOpenAddModal,
  onRefresh,
  loading,
}) {
  const isHealthy = healthStatus && healthStatus.status === 'UP';

  return (
    <header className="header-card">
      <div className="header-top">
        <div className="header-title-group">
          <div className="logo-badge" title="AWS DevOps Project">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div className="header-title-text">
            <h1>
              Student Management System
              <span className="course-tag">AWS DevOps Course</span>
            </h1>
            <div className="header-subtitle">
              <span>Full-Stack Cloud Architecture</span>
              <span className="tech-pills">
                <span className="tech-pill">React + Vite</span>
                <span className="tech-pill">Spring Boot 3</span>
                <span className="tech-pill">MySQL 8</span>
                <span className="tech-pill">Docker Compose</span>
                <span className="tech-pill">AWS EC2</span>
              </span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <div className={`health-badge ${isHealthy ? 'connected' : 'disconnected'}`} id="backend-health-indicator">
            <span className="pulse-dot"></span>
            <span>{isHealthy ? 'Backend & DB Online' : 'Connecting to API...'}</span>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-icon-only"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh Data"
            id="refresh-students-btn"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19"/>
            </svg>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenAddModal}
            id="add-student-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Student</span>
          </button>
        </div>
      </div>
    </header>
  );
}
