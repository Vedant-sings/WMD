import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { DEFAULT_SUPPORT_REQUESTS } from '../data/defaultData';

const LOCAL_STORAGE_KEY = 'coursegap_exp9_support_requests';

export function useSupportRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await api.getSupportRequests();
        if (!isCancelled && Array.isArray(data)) {
          setRequests(data);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Using local storage for support requests:', err.message);
      }

      if (!isCancelled) {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          try {
            setRequests(JSON.parse(cached));
          } catch {
            setRequests(DEFAULT_SUPPORT_REQUESTS);
          }
        } else {
          setRequests(DEFAULT_SUPPORT_REQUESTS);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SUPPORT_REQUESTS));
        }
        setLoading(false);
      }
    };

    fetchRequests();
    return () => {
      isCancelled = true;
    };
  }, []);

  const submitRequest = useCallback(async (newRequestData) => {
    const formatted = {
      ...newRequestData,
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending',
      timestamp: new Date().toISOString(),
    };

    try {
      await api.createSupportRequest(formatted);
    } catch {
      // offline fallback
    }

    setRequests((prev) => {
      const next = [formatted, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    return { success: true, request: formatted };
  }, []);

  const updateRequestStatus = useCallback(async (id, newStatus) => {
    try {
      await api.patchSupportRequest(id, { status: newStatus });
    } catch {
      // offline fallback
    }

    setRequests((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    requests,
    loading,
    submitRequest,
    updateRequestStatus,
  };
}
