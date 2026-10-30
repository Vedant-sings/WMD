import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { DEFAULT_STUDENTS } from '../data/defaultData';

const LOCAL_STORAGE_KEY = 'coursegap_exp9_students';

/**
 * Enhanced Custom Hook: useStudents
 * Demonstrates:
 * - Real RESTful API integration with JSON Server (GET, POST, PUT, PATCH, DELETE)
 * - Automatic seamless offline fallback to localStorage when server is offline
 * - Referential stability with useCallback
 * - Controlled loading and error diagnostics
 */
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refetch = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  // Fetch all students
  useEffect(() => {
    let isCancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getStudents();
        if (!isCancelled) {
          const list = Array.isArray(data) ? data : [];
          setStudents(list);
          setIsOfflineMode(false);
          // Sync to localStorage as backup cache
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('JSON Server not reachable, falling back to local storage cache:', err.message);
          setIsOfflineMode(true);
          setError(
            'JSON Server is currently offline (port 3000). Running in Local Persistence Mode. Start server via: npm run server'
          );

          // Retrieve cached or default students
          const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (cached) {
            try {
              setStudents(JSON.parse(cached));
            } catch {
              setStudents(DEFAULT_STUDENTS);
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_STUDENTS));
            }
          } else {
            setStudents(DEFAULT_STUDENTS);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_STUDENTS));
          }
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAll();

    return () => {
      isCancelled = true;
    };
  }, [refreshIndex]);

  // Helper to persist locally when in offline mode
  const persistOffline = useCallback((updatedList) => {
    setStudents(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  }, []);

  // CREATE operation (POST)
  const createStudent = useCallback(async (newStudentData) => {
    setError(null);
    try {
      if (!isOfflineMode) {
        const created = await api.createStudent(newStudentData);
        setStudents((prev) => {
          const next = [...prev, created];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
        return { success: true, student: created };
      }
    } catch (err) {
      console.warn('API create failed, falling back locally:', err);
    }

    // Local fallback
    const studentWithId = {
      ...newStudentData,
      id: newStudentData.id || `STU${Math.floor(100 + Math.random() * 900)}`,
    };
    setStudents((prev) => {
      const next = [...prev, studentWithId];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return { success: true, student: studentWithId };
  }, [isOfflineMode]);

  // UPDATE operation (PUT)
  const updateStudent = useCallback(async (id, updatedData) => {
    setError(null);
    try {
      if (!isOfflineMode) {
        const updated = await api.updateStudent(id, updatedData);
        setStudents((prev) => {
          const next = prev.map((s) => (String(s.id) === String(id) ? updated : s));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
        return { success: true, student: updated };
      }
    } catch (err) {
      console.warn('API update failed, falling back locally:', err);
    }

    // Local fallback
    setStudents((prev) => {
      const next = prev.map((s) => (String(s.id) === String(id) ? { ...s, ...updatedData } : s));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return { success: true, student: updatedData };
  }, [isOfflineMode]);

  // PATCH operation
  const patchStudent = useCallback(async (id, partialData) => {
    setError(null);
    try {
      if (!isOfflineMode) {
        const patched = await api.patchStudent(id, partialData);
        setStudents((prev) => {
          const next = prev.map((s) => (String(s.id) === String(id) ? patched : s));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
        return { success: true, student: patched };
      }
    } catch (err) {
      console.warn('API patch failed, falling back locally:', err);
    }

    // Local fallback
    let updatedStudent = null;
    setStudents((prev) => {
      const next = prev.map((s) => {
        if (String(s.id) === String(id)) {
          updatedStudent = { ...s, ...partialData };
          return updatedStudent;
        }
        return s;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return { success: true, student: updatedStudent };
  }, [isOfflineMode]);

  // REMOVE operation (DELETE)
  const removeStudent = useCallback(async (id) => {
    setError(null);
    try {
      if (!isOfflineMode) {
        await api.deleteStudent(id);
      }
    } catch (err) {
      console.warn('API delete failed, falling back locally:', err);
    }

    setStudents((prev) => {
      const next = prev.filter((s) => String(s.id) !== String(id));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return { success: true };
  }, [isOfflineMode]);

  return {
    students,
    loading,
    error,
    isOfflineMode,
    refetch,
    createStudent,
    updateStudent,
    patchStudent,
    removeStudent,
  };
}
