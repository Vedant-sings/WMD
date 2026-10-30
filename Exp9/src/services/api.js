/**
 * Centralized API service for CourseGap Companion Pro (Exp9)
 * Combines Exp3 and Exp4 RESTful capabilities with graceful fallback support.
 */

const API_ROOT = 'http://localhost:3000';
const STUDENTS_URL = `${API_ROOT}/students`;
const SUPPORT_URL = `${API_ROOT}/supportRequests`;

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || JSON.stringify(errorJson);
    } catch {
      errorDetail = response.statusText || `Status ${response.status}`;
    }
    throw new Error(`API Error [${response.status}]: ${errorDetail}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

// ================= STUDENTS API =================

export async function getStudents() {
  const response = await fetch(STUDENTS_URL, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return await handleResponse(response);
}

export async function getStudentById(id) {
  const response = await fetch(`${STUDENTS_URL}/${id}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return await handleResponse(response);
}

export async function createStudent(studentData) {
  const response = await fetch(STUDENTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(studentData),
  });
  return await handleResponse(response);
}

export async function updateStudent(id, studentData) {
  const response = await fetch(`${STUDENTS_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(studentData),
  });
  return await handleResponse(response);
}

export async function patchStudent(id, partialData) {
  const response = await fetch(`${STUDENTS_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(partialData),
  });
  return await handleResponse(response);
}

export async function deleteStudent(id) {
  const response = await fetch(`${STUDENTS_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
  });
  return await handleResponse(response);
}

// ================= SUPPORT REQUESTS API =================

export async function getSupportRequests() {
  const response = await fetch(SUPPORT_URL, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return await handleResponse(response);
}

export async function createSupportRequest(requestData) {
  const response = await fetch(SUPPORT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  return await handleResponse(response);
}

export async function patchSupportRequest(id, partialData) {
  const response = await fetch(`${SUPPORT_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(partialData),
  });
  return await handleResponse(response);
}

export { STUDENTS_URL, SUPPORT_URL, API_ROOT };
