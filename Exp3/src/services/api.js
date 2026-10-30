/**
 * API service for CourseGap Companion
 * Centralized base URL and standard fetch abstraction with error handling
 */

const BASE_URL = 'http://localhost:3000/students';

/**
 * Handles fetch response and throws descriptive errors
 */
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

  // Handle empty responses or 204 No Content
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

/**
 * Retrieve all students
 * GET /students
 */
export async function getStudents() {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw error;
  }
}

/**
 * Retrieve a single student by ID
 * GET /students/:id
 */
export async function getStudentById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to fetch student with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new student record
 * POST /students
 */
export async function createStudent(studentData) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to create student:', error);
    throw error;
  }
}

/**
 * Replace/Update an entire student record
 * PUT /students/:id
 */
export async function updateStudent(id, studentData) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to update student ${id}:`, error);
    throw error;
  }
}

/**
 * Partially update a student record
 * PATCH /students/:id
 */
export async function patchStudent(id, partialData) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(partialData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to patch student ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a student record
 * DELETE /students/:id
 */
export async function deleteStudent(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to delete student ${id}:`, error);
    throw error;
  }
}

export { BASE_URL };
