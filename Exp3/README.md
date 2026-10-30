# CourseGap Companion

**CourseGap Companion** is a student academic-progress and early-intervention dashboard built with **React**, **Vite**, and **JSON Server**. It monitors attendance metrics, subject examination marks, and automatically flags academic gaps to help educators and students intervene before course deadlines.

---

## 🚀 Quick Setup & Run

The application consists of a **JSON Server API backend** and a **React + Vite frontend**.

### 1. Install Dependencies
Open your terminal in the project root directory and run:
```bash
npm install
```

### 2. Start the JSON Server (API Backend)
Run JSON Server to host the mock REST API on port `3000`:
```bash
npx json-server --watch db.json --port 3000
```
> The API will be available at: `http://localhost:3000/students`

### 3. Start the Vite React Frontend
In a second terminal window (or tab), start the Vite development server:
```bash
npm run dev
```
> The web application will launch locally (usually at `http://localhost:5173`).

---

## 📂 Project Architecture

```
Exp3/
├── CourseGap-Postman-Collection.json  # Postman test collection (GET, POST, PUT, PATCH, DELETE, HEAD)
├── db.json                           # JSON Server student & subject dataset
├── index.html                        # HTML entry point
├── package.json                      # Project metadata & dependencies
├── README.md                         # Documentation & instructions
├── vite.config.js                    # Vite configuration
└── src/
    ├── main.jsx                      # React root rendering
    ├── App.jsx                       # Main application shell & routing state
    ├── components/
    │   ├── Header.jsx                # Accessible navigation header
    │   ├── StudentCard.jsx           # Reusable metric card per student
    │   ├── StudentTable.jsx          # Sortable/filterable responsive table
    │   ├── GapAlerts.jsx             # Aggregator for subjects requiring intervention
    │   ├── LoadingState.jsx          # Accessible spinner loading screen
    │   └── ErrorState.jsx            # Error recovery & diagnostic banner
    ├── pages/
    │   ├── Dashboard.jsx             # KPI overview, student cards & gap alerts
    │   ├── Students.jsx              # Roster view with search & status filters
    │   └── Support.jsx               # Student intervention & counseling request form
    ├── services/
    │   └── api.js                    # Centralized fetch API service layer
    └── styles/
        └── main.css                  # Custom, responsive, accessible CSS
```

---

## 🔄 API Flow & Architecture

1. **Centralized Base URL**:
   Defined in `src/services/api.js`:
   ```javascript
   const BASE_URL = 'http://localhost:3000/students';
   ```

2. **Standard CRUD & Fetch Operations**:
   - `getStudents()`: Fetches all student records (`GET /students`).
   - `getStudentById(id)`: Fetches individual student profile (`GET /students/:id`).
   - `createStudent(data)`: Adds a new student (`POST /students`).
   - `updateStudent(id, data)`: Completely updates a student profile (`PUT /students/:id`).
   - `patchStudent(id, partialData)`: Partially modifies attendance or status (`PATCH /students/:id`).
   - `deleteStudent(id)`: Deletes an existing student (`DELETE /students/:id`).

3. **Data Lifecycle in React**:
   - `App.jsx` handles initial asynchronous loading via `fetchStudentData()` wrapped in a `try...catch` block.
   - While requests are in flight, `LoadingState.jsx` is displayed with accessible ARIA live regions.
   - If JSON Server is unreachable or responds with an HTTP error, `ErrorState.jsx` provides error diagnostics and a "Retry Connection" action.
   - When data is loaded, state is passed down to `Dashboard` and `Students` views.

4. **Gap Alert Computation Logic**:
   The `GapAlerts` component dynamically processes all subjects and flags an alert if:
   - `subject.gap === true`, OR
   - `subject.marks < 50` (Passing score threshold), OR
   - `subject.attendance < 75` (Mandatory attendance threshold).

---

## 📬 Postman API Testing

The file `CourseGap-Postman-Collection.json` is ready to import into [Postman](https://www.postman.com/):

1. Open Postman and click **Import**.
2. Select `CourseGap-Postman-Collection.json`.
3. The imported collection contains 7 pre-configured requests:
   - **`GET All Students`**: Inspect all student records.
   - **`GET Student By ID`**: Fetch student `1`.
   - **`POST Create Student`**: Add new student `7` (Meera Nair).
   - **`PUT Update Student`**: Full overwrite of student `1` grades.
   - **`PATCH Partial Update Student`**: Update `attendance` and `status` for student `2`.
   - **`DELETE Student`**: Remove student `7`.
   - **`HEAD Students Endpoint Headers`**: Retrieve HTTP response headers without payload.

---

## ♿ Accessibility & Responsiveness

- Built with semantic HTML elements (`<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, `<table>`, `<form>`).
- Forms include paired `<label>` tags with matching `htmlFor` and `id`, `aria-required`, `aria-invalid`, and `aria-describedby` error announcements.
- Mobile-friendly responsive layouts with CSS Grid and Flexbox (no Tailwind dependency).
