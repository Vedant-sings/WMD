# CourseGap Companion

An academic intervention, attendance monitoring, and learning gap tracking dashboard built with React functional components to clearly demonstrate core React state management and hooks.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Mock JSON Server
The application integrates with JSON Server at `http://localhost:3000/students`:
```bash
npm run server
```
This serves `db.json` with sample academic records (ID, name, email, course, semester, attendance, marks, gaps, and status).

### 3. Start the Vite React Application
In a second terminal window, run:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧠 Comprehensive React Hooks & State Management Guide

This project intentionally does not use Redux, Zustand, or Context API. Instead, it demonstrates the granular power of React's core primitives. Below is a breakdown of **where and why** each hook is employed:

---

### 1. `useStudents` (Custom Hook)
- **Location:** [`src/hooks/useStudents.js`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/hooks/useStudents.js)
- **Why it was used:**
  - Encapsulates all RESTful communication (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with the backend API (`http://localhost:3000/students`).
  - Separates data-fetching logic and error handling from presentation components, keeping [`src/App.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/App.jsx) clean and focused on user experience.
  - Maintains `students`, `loading`, `error`, and manual `refetch` states.
  - Returns stable memoized CRUD operations (`createStudent`, `updateStudent`, `patchStudent`, `removeStudent`) that can safely be consumed by downstream handlers.

---

### 2. `useState`
- **Locations:**
  - [`src/App.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/App.jsx):
    - `theme`: Holds current theme (`'light'` or `'dark'`).
    - `searchTerm`: Search query string for filtering by name or ID.
    - `statusFilter`: Selected status filter (`'All'`, `'On Track'`, `'Needs Attention'`, `'At Risk'`).
    - `semesterFilter`: Selected semester (`'All'`, `'1'` through `'8'`).
    - `viewMode`: UI layout mode (`'grid'` or `'table'`).
    - `modalOpen`, `modalMode`, `selectedStudent`: Modal visibility and active student being edited.
    - `deleteDialogOpen`, `studentToDelete`, `isDeleting`: Confirmation dialog states.
    - `notification`: Toast message and type (`success` or `error`).
  - [`src/components/StudentModal.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/components/StudentModal.jsx):
    - `formData`: Controlled inputs for all student fields (ID, name, email, semester, course, status, attendance, marks, gaps, notes).
    - `errors`: Field-level validation error messages.
    - `submitting`: Loading state while asynchronous network operations are pending.
  - [`src/hooks/useStudents.js`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/hooks/useStudents.js):
    - `students`: Central array of student records.
    - `loading`: Boolean flag indicating pending fetch.
    - `error`: Network error or server response failure messages.
    - `refreshIndex`: Counter used to trigger declarative refetching in `useEffect`.
- **Why it was used:**
  - Allows functional components to manage local, reactive state that triggers re-renders whenever inputs change, filters update, or modals open and close.
  - Ensures all form fields are strictly controlled inputs, adhering to React best practices.

---

### 3. `useEffect`
- **Locations:**
  - [`src/hooks/useStudents.js`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/hooks/useStudents.js):
    - Runs on initial component mount and whenever `refreshIndex` changes to fetch data from `http://localhost:3000/students`.
    - Includes cleanup (`isCancelled = true`) to prevent state updates on unmounted components.
  - [`src/App.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/App.jsx):
    - **Theme Persistence:** Synchronizes the active theme to `localStorage` and updates the root `data-theme` DOM attribute whenever `theme` changes.
    - **Initial Autofocus:** Focuses the student search input element on initial page mount.
    - **Auto-dismissing Toasts:** Cleans up timer after 4.5 seconds to hide notification alerts.
  - [`src/components/StudentModal.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/components/StudentModal.jsx):
    - Prefills form values with existing student details when entering `'edit'` mode, or generates a fresh ID when switching to `'add'` mode.
- **Why it was used:**
  - Handles side effects (network I/O, browser storage, timers, and external DOM synchronization) in a safe, lifecycle-compliant manner.

---

### 4. `useMemo`
- **Location:** [`src/App.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/App.jsx)
  - `filteredStudents`:
    ```javascript
    const filteredStudents = useMemo(() => {
      return students.filter((student) => {
        // Matches search query + status + semester
      });
    }, [students, searchTerm, statusFilter, semesterFilter]);
    ```
  - `stats` (Dashboard KPIs):
    ```javascript
    const stats = useMemo(() => {
      // Computes total students, average attendance, average marks, and course gaps
    }, [students]);
    ```
- **Why it was used:**
  - Avoids expensive recalculations of student filtering, string matching, and statistical aggregations on unrelated re-renders (e.g., when toggling the theme, opening a modal, or typing into an unrelated field).
  - Keeps the dashboard snappy and resource-efficient even with growing datasets.

---

### 5. `useCallback`
- **Location:** [`src/App.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/App.jsx)
  - Handlers passed down to child components:
    - `handleOpenAddModal`, `handleOpenEditModal`, `handleModalClose`, `handleModalSubmit`
    - `handleQuickPatchStatus`, `handleQuickPatchAttendance` (for direct PATCH updates)
    - `handleDeleteRequest`, `handleConfirmDelete`, `handleCancelDelete`
    - `handleResetFilters`, `toggleTheme`, `showToast`
- **Why it was used:**
  - Preserves referential equality of callback functions across re-renders.
  - Coupled with `React.memo` on [`src/components/StudentCard.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/components/StudentCard.jsx), [`src/components/StudentTable.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/components/StudentTable.jsx), and [`src/components/DashboardStats.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/components/DashboardStats.jsx), it prevents entire grids of cards from re-rendering when parent state changes.

---

### 6. `useRef`
- **Locations:**
  - [`src/App.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/App.jsx):
    - `searchInputRef`: Direct reference to the main search `<input>` element. Triggered in `useEffect` on page load to automatically focus the search field without blocking user interaction.
  - [`src/components/StudentModal.jsx`](file:///c:/Users/DELL/Desktop/WMD/Exp4/src/components/StudentModal.jsx):
    - `idRef`, `nameRef`, `emailRef`, `attendanceRef`, `marksRef`, `gapsRef`: References to form inputs.
    - When `validate()` detects invalid fields during submission, `useRef` moves focus directly to the first invalid field:
      ```javascript
      if (newErrors.id) {
        idRef.current?.focus();
      } else if (newErrors.name) {
        nameRef.current?.focus();
      }
      ```
- **Why it was used:**
  - Provides direct access to DOM nodes for imperative operations (focus management) without triggering unnecessary React component re-renders.
  - Crucial for keyboard accessibility (WCAG 2.1) and smooth user experience.

---

## 🎨 Features & Capabilities

- **CRUD Operations:**
  - **Create:** Enrolls new students with validation.
  - **Read:** Card and Table views with loading skeletons.
  - **Update:** Full PUT edit modal pre-filled with student data.
  - **Patch:** Quick-action dropdown and attendance +/- stepper that executes HTTP `PATCH`.
  - **Delete:** Protected by a dedicated, accessible confirmation dialog.
- **Search & Multi-criteria Filtering:** Filter by name, student ID, academic status, and semester with single-click reset.
- **Theme Switcher:** Dark and light mode toggle persisted to `localStorage`.
- **Responsive Layout:** Optimized for mobile phones, tablets, and widescreen desktop monitors.
- **Accessibility & Feedback:** ARIA attributes, semantic HTML tags, live toast alerts, and empty states.
