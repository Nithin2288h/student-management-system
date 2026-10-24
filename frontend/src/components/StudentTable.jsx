import React from 'react';

export default function StudentTable({
  students,
  loading,
  searchTerm,
  onSearchChange,
  onClearSearch,
  onEditStudent,
  onDeleteStudent,
  onOpenAddModal,
}) {
  return (
    <div className="content-card">
      <div className="controls-bar">
        <div className="search-box">
          <span className="search-icon-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by student ID, name, email, department, or course..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            id="student-search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={onClearSearch}
              title="Clear search"
              id="clear-search-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="controls-meta">
          <span>
            Showing <strong>{students ? students.length : 0}</strong> record(s)
          </span>
          {searchTerm && (
            <span>
              filtered for "<em>{searchTerm}</em>"
            </span>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="students-table" id="students-data-table">
          <thead>
            <tr>
              <th scope="col">DB ID</th>
              <th scope="col">Student Reg No</th>
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Department</th>
              <th scope="col">Course</th>
              <th scope="col">Phone</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="skeleton-row">
                  <td><div className="skeleton-box" style={{ width: '28px' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '100px' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '140px' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '180px' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '110px' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '120px' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '100px' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '80px', marginLeft: 'auto' }}></div></td>
                </tr>
              ))
            ) : students && students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} id={`student-row-${student.id}`}>
                  <td>
                    <span style={{ color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                      #{student.id}
                    </span>
                  </td>
                  <td>
                    <span className="badge-reg">{student.studentId}</span>
                  </td>
                  <td className="student-name-cell">
                    {student.firstName} {student.lastName}
                  </td>
                  <td>
                    <a
                      href={`mailto:${student.email}`}
                      style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.target.style.color = '#38bdf8')}
                      onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
                    >
                      {student.email}
                    </a>
                  </td>
                  <td>
                    <span className="badge-dept">{student.department}</span>
                  </td>
                  <td>
                    <span className="badge-course">{student.course}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {student.phone}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn-action edit"
                        onClick={() => onEditStudent(student)}
                        title="Edit Student"
                        id={`edit-student-btn-${student.id}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="btn-action delete"
                        onClick={() => onDeleteStudent(student)}
                        title="Delete Student"
                        id={`delete-student-btn-${student.id}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <h3>No Student Records Found</h3>
                    <p>
                      {searchTerm
                        ? `No students matching "${searchTerm}". Try a different search keyword or clear the filter.`
                        : 'The student database is currently empty. Start by adding your first student record.'}
                    </p>
                    {searchTerm ? (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClearSearch}
                      >
                        Clear Search Filter
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onOpenAddModal}
                      >
                        Add First Student
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
