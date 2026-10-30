import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3000/students';

/**
 * Custom Hook: useStudents
 * Demonstrates:
 * - useEffect for fetching data on mount / refresh
 * - useState for managing students list, loading state, error messages, and refresh trigger
 * - useCallback / standard async functions for CRUD operations (create, update, patch, remove)
 * - Graceful error handling with detailed user-friendly error messages
 */
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Trigger manual refresh
  const refetch = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  // Fetch all students on initial load & when refreshIndex triggers
  useEffect(() => {
    let isCancelled = false;

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch student records (${response.status}: ${response.statusText})`);
        }
        const data = await response.json();
        if (!isCancelled) {
          setStudents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching students:', err);
          setError(
            err.message.includes('Failed to fetch')
              ? 'Could not connect to JSON Server at http://localhost:3000/students. Ensure server is running.'
              : err.message
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchStudents();

    return () => {
      isCancelled = true;
    };
  }, [refreshIndex]);

  // CREATE operation (POST)
  const createStudent = useCallback(async (newStudentData) => {
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudentData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create student (${response.status} ${response.statusText})`);
      }
      const createdStudent = await response.json();
      setStudents((prev) => [...prev, createdStudent]);
      return { success: true, student: createdStudent };
    } catch (err) {
      console.error('Create error:', err);
      const errMsg = err.message || 'Error creating student.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  }, []);

  // UPDATE operation (PUT - replace complete record)
  const updateStudent = useCallback(async (id, updatedData) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update student (${response.status} ${response.statusText})`);
      }
      const updatedStudent = await response.json();
      setStudents((prev) =>
        prev.map((student) => (String(student.id) === String(id) ? updatedStudent : student))
      );
      return { success: true, student: updatedStudent };
    } catch (err) {
      console.error('Update error:', err);
      const errMsg = err.message || 'Error updating student.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  }, []);

  // PATCH operation (partial updates: status, attendance, notes, etc.)
  const patchStudent = useCallback(async (id, partialData) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialData),
      });
      if (!response.ok) {
        throw new Error(`Failed to patch student (${response.status} ${response.statusText})`);
      }
      const patchedStudent = await response.json();
      setStudents((prev) =>
        prev.map((student) => (String(student.id) === String(id) ? patchedStudent : student))
      );
      return { success: true, student: patchedStudent };
    } catch (err) {
      console.error('Patch error:', err);
      const errMsg = err.message || 'Error updating student status.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  }, []);

  // REMOVE operation (DELETE)
  const removeStudent = useCallback(async (id) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete student (${response.status} ${response.statusText})`);
      }
      setStudents((prev) => prev.filter((student) => String(student.id) !== String(id)));
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err);
      const errMsg = err.message || 'Error deleting student.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  }, []);

  return {
    students,
    loading,
    error,
    refetch,
    createStudent,
    updateStudent,
    patchStudent,
    removeStudent,
  };
}
