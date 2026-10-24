import React, { useState, useEffect, useCallback } from 'react';
import StudentHeader from './components/StudentHeader';
import StudentStats from './components/StudentStats';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import NotificationToast from './components/NotificationToast';
import { studentService } from './services/studentService';

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [healthStatus, setHealthStatus] = useState(null);

  // Modal states
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add', // 'add' | 'edit'
    student: null,
  });
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    student: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Health
  const checkHealth = useCallback(async () => {
    try {
      const data = await studentService.checkHealth();
      setHealthStatus(data);
    } catch (err) {
      setHealthStatus({ status: 'DOWN', error: err.message });
    }
  }, []);

  // Fetch Students
  const loadStudents = useCallback(async (searchQuery = '') => {
    setLoading(true);
    try {
      const data = await studentService.getAllStudents(searchQuery);
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students:', err);
      addToast(err.message || 'Failed to connect to backend service', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    checkHealth();
    loadStudents();

    // Check health periodically
    const healthInterval = setInterval(checkHealth, 30000);
    return () => clearInterval(healthInterval);
  }, [checkHealth, loadStudents]);

  // Handle Search Input (debounced / on submit)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents(searchTerm);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, loadStudents]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setServerErrors(null);
    setModalState({
      isOpen: true,
      mode: 'add',
      student: null,
    });
  };

  // Open Edit Modal
  const handleOpenEditModal = (student) => {
    setServerErrors(null);
    setModalState({
      isOpen: true,
      mode: 'edit',
      student,
    });
  };

  // Close Student Form Modal
  const handleCloseModal = () => {
    if (!submitting) {
      setModalState({ isOpen: false, mode: 'add', student: null });
      setServerErrors(null);
    }
  };

  // Open Delete Confirmation
  const handleOpenDeleteModal = (student) => {
    setDeleteModalState({
      isOpen: true,
      student,
    });
  };

  // Close Delete Modal
  const handleCloseDeleteModal = () => {
    if (!deleting) {
      setDeleteModalState({ isOpen: false, student: null });
    }
  };

  // Handle Form Submit (Create or Update)
  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    setServerErrors(null);

    try {
      if (modalState.mode === 'add') {
        const created = await studentService.createStudent(formData);
        addToast(`Student "${created.firstName} ${created.lastName}" registered successfully!`, 'success');
      } else {
        const updated = await studentService.updateStudent(modalState.student.id, formData);
        addToast(`Student "${updated.firstName} ${updated.lastName}" updated successfully!`, 'success');
      }

      handleCloseModal();
      loadStudents(searchTerm);
      checkHealth();
    } catch (err) {
      console.error('Form submission error:', err);
      if (err.validationErrors) {
        setServerErrors(err.validationErrors);
      }
      addToast(err.message || 'Operation failed. Please check the form fields.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async (studentId) => {
    setDeleting(true);
    try {
      await studentService.deleteStudent(studentId);
      addToast('Student record successfully removed from MySQL database', 'success');
      handleCloseDeleteModal();
      loadStudents(searchTerm);
      checkHealth();
    } catch (err) {
      console.error('Deletion error:', err);
      addToast(err.message || 'Failed to delete student record.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header with Title, Architecture Pills, Health Badge, and Add Button */}
      <StudentHeader
        totalCount={students.length}
        healthStatus={healthStatus}
        onOpenAddModal={handleOpenAddModal}
        onRefresh={() => {
          checkHealth();
          loadStudents(searchTerm);
          addToast('Data refreshed from MySQL database', 'info');
        }}
        loading={loading}
      />

      {/* KPI Stats Grid */}
      <StudentStats students={students} />

      {/* Records Table & Search */}
      <StudentTable
        students={students}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={() => setSearchTerm('')}
        onEditStudent={handleOpenEditModal}
        onDeleteStudent={handleOpenDeleteModal}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Add / Edit Student Dialog */}
      <StudentModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        student={modalState.student}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        serverErrors={serverErrors}
        submitting={submitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        student={deleteModalState.student}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />

      {/* Notification Toast Alert Stack */}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
