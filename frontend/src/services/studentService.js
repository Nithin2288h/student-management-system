/**
 * Student Management System - API Service Client
 * Handles communication with Spring Boot backend REST endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(message, status, validationErrors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage = 'An error occurred while processing the request.';
    let validationErrors = null;

    if (isJson && data) {
      errorMessage = data.message || data.error || errorMessage;
      if (data.validationErrors) {
        validationErrors = data.validationErrors;
      }
    } else if (typeof data === 'string' && data.length > 0) {
      errorMessage = data;
    }

    throw new ApiError(errorMessage, response.status, validationErrors);
  }

  return data;
}

export const studentService = {
  /**
   * Fetch all students, optionally filtered by keyword
   */
  async getAllStudents(searchTerm = '') {
    const url = searchTerm && searchTerm.trim()
      ? `${API_BASE_URL}/students?search=${encodeURIComponent(searchTerm.trim())}`
      : `${API_BASE_URL}/students`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Fetch single student by database ID
   */
  async getStudentById(id) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`);
    return handleResponse(response);
  },

  /**
   * Create a new student record
   */
  async createStudent(studentData) {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse(response);
  },

  /**
   * Update an existing student record
   */
  async updateStudent(id, studentData) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse(response);
  },

  /**
   * Delete student record by ID
   */
  async deleteStudent(id) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  /**
   * Check backend application health
   */
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },

  /**
   * Get total student count
   */
  async getStudentCount() {
    const response = await fetch(`${API_BASE_URL}/students/count`);
    return handleResponse(response);
  },
};
