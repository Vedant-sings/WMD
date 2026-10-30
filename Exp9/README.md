# CourseGap Companion Pro • Unified Academic Progress & Intervention Platform (Exp9)

**CourseGap Companion Pro** is an academic-progress, attendance-monitoring, and early-intervention platform built with **React 19**, **Vite**, and **JSON Server**. It seamlessly unifies and enhances all capabilities, designs, and architectural patterns from **Experiment 3** and **Experiment 4**, while introducing advanced analytics, CSV reporting, sortable data grids, and a live counseling ticket tracker.

---

## 🚀 Quick Setup & Run

### 1. Install Dependencies
Open your terminal in `C:\Users\DELL\Desktop\WMD\Exp9` and run:
```bash
npm install
```

### 2. Start the Mock REST API (JSON Server)
In your first terminal tab, run:
```bash
npm run server
```
> Serves `db.json` at: `http://localhost:3000/students` and `http://localhost:3000/supportRequests`

### 3. Start the Vite React Application
In a second terminal window, run:
```bash
npm run dev
```
> Launch the app locally at: [http://localhost:5173](http://localhost:5173)

### 4. Build for Production
```bash
npm run build
```

---

## 🏛️ Comprehensive Architecture: Combining Exp3 & Exp4

```
Exp9/
├── CourseGap-Postman-Collection.json  # Complete 7-endpoint REST test collection
├── db.json                           # Unified dataset (students with subjects + supportRequests)
├── index.html                        # Application HTML entry point
├── package.json                      # Dependencies & project scripts
├── vite.config.js                    # Vite configuration
├── README.md                         # Detailed documentation
└── src/
    ├── main.jsx                      # React 19 root rendering
    ├── App.jsx                       # Main application shell, state & multi-page navigation
    ├── App.css                       # Unified CSS styling system with Dark/Light theme
    ├── data/
    │   └── defaultData.js            # Seed data, course options & subject catalog presets
    ├── hooks/
    │   ├── useStudents.js            # RESTful CRUD custom hook with offline persistence
    │   └── useSupportRequests.js     # Mentoring & support ticket state manager
    ├── services/
    │   └── api.js                    # Centralized fetch API service layer
    ├── utils/
    │   └── exportUtils.js            # Client-side CSV export generator
    ├── components/
    │   ├── Header.jsx                # Responsive navigation, brand, tabs, theme & actions
    │   ├── DashboardStats.jsx        # KPI performance summary cards (useMemo)
    │   ├── FilterBar.jsx             # Search input (useRef autofocus) & multi-filters
    │   ├── StudentCard.jsx           # Metric card with quick steppers & progress bars
    │   ├── StudentTable.jsx          # Sortable responsive table with quick-patch dropdown
    │   ├── GapAlerts.jsx             # Automated academic & attendance gap aggregator
    │   ├── StudentModal.jsx          # Enroll/Edit modal with subject manager & focus jump
    │   ├── StudentDetailsModal.jsx   # Exp3 comprehensive subject breakdown modal
    │   ├── ConfirmDeleteModal.jsx    # Accessible deletion confirmation dialog
    │   └── ToastAlert.jsx            # Toast alerts & shimmer skeleton loading cards
    └── pages/
        ├── SupportPage.jsx           # Mentoring request form & live ticket status tracker
        └── AnalyticsPage.jsx         # Department performance & risk matrix analytics
```

---

## 🧩 Features Unified from Experiment 3

1. **Multi-Page View Navigation**:
   - Header tab routing between **Dashboard**, **Students Directory**, **Gap Alerts**, **Support & Mentoring**, and **Analytics**.
2. **Automated Academic Gap Detection (`GapAlerts.jsx`)**:
   - Computes alerts dynamically if:
     - `subject.gap === true`, OR
     - `subject.marks < 50` (Passing threshold), OR
     - `subject.attendance < 75` (Mandatory attendance threshold).
   - Shows student name, subject code, subject name, marks %, attendance %, and reasons.
3. **Student Academic Breakdown Modal (`StudentDetailsModal.jsx`)**:
   - Detailed modal displaying full profile, overall marks progress, overall attendance, and complete subject-by-subject breakdown table.
4. **Academic Support Request System**:
   - Validated form for academic counseling, attendance rectification, and remedial class requests.

---

## ⚡ Features Unified from Experiment 4

1. **Full React Hooks Architecture**:
   - **`useStudents`**: Custom hook encapsulating `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
   - **`useState`**: Controlled inputs, active view tabs, filter states, modal states, and theme state.
   - **`useEffect`**: Theme persistence to `localStorage` and `data-theme` attribute, autofocus management, and auto-dismissing toast notifications.
   - **`useMemo`**: Client-side filtering across name, ID, email, status, semester, and course; statistical dashboard KPI computations; and gap counters.
   - **`useCallback`**: Referential stability of handlers preventing unnecessary re-renders of memoized components (`React.memo`).
   - **`useRef`**: Automatic search input focus on page load, plus focus-jumping to the first invalid field upon form validation error.
2. **Dashboard KPI Stats (`DashboardStats.jsx`)**:
   - 4 performance cards (Total Students, Avg Attendance, Avg Marks, Total Course Gaps) with trend badges and Lucide icons.
3. **Multi-Criteria Filter Bar (`FilterBar.jsx`)**:
   - Search input with clear button, Status filter, Semester filter, Branch filter, and single-click Reset button.
4. **Inline Quick Actions (HTTP PATCH)**:
   - Direct status change dropdown on cards and table rows.
   - Attendance increment (`+5%`) and decrement (`-5%`) stepper buttons on cards.
5. **Full CRUD Modal (`StudentModal.jsx`) & Confirm Delete Dialog (`ConfirmDeleteModal.jsx`)**:
   - Create (POST), Read (Cards & Table), Update (PUT), Patch (PATCH), Delete (DELETE).
6. **Dark / Light Theme Switcher**:
   - Instant toggle persisted in `localStorage`.
7. **Accessible Feedback & Skeletons**:
   - Live dismissible toast alerts and shimmer skeleton grid cards.

---

## ✨ New Pro Features Added in Experiment 9

1. **One-Click CSV Data Export**:
   - Export full student directory roster or flagged critical gap alerts directly to downloadable CSV files (`exportStudentsToCSV`, `exportGapAlertsToCSV`).
2. **Interactive Support Ticket Tracker**:
   - The Support page now features a live ticket management log with status tracking (`Pending` → `In Review` → `Resolved`), urgency pill badges, and status filtering.
3. **Department / Branch Cohort Health Analytics**:
   - Dedicated Analytics tab comparing average marks, attendance, and gap counts across all engineering departments (CSE, IT, AI&DS, ECE, EEE).
4. **Composite Risk Matrix & Performance Tiers**:
   - Predictive classification into:
     - 🌟 **Dean's Honors Tier** (>85% composite, zero gaps)
     - 📘 **Satisfactory Standing** (70% - 84%)
     - ⚠️ **Needs Attention** (50% - 69%)
     - 🚨 **Critical At-Risk Tier** (<50% marks or <75% attendance)
5. **Multi-Column Sortable Table**:
   - Sort table records ascending/descending by clicking on column headers (ID, Name, Attendance, Avg Marks, Course Gaps).
6. **Dynamic Subject Manager in Student Modal**:
   - Add, edit, or remove individual course subjects within the modal.
   - "Sync Metrics" button automatically computes overall marks, overall attendance, and course gaps from individual subject scores!
7. **Direct Mentoring Trigger from Gap Alerts**:
   - Clicking "Request Mentoring" on any gap alert immediately navigates to the Support page and pre-fills student details and problematic subject codes.
8. **Seamless Local Persistence Fallback**:
   - If JSON Server is offline, the app displays a clear diagnostic notice and runs in Local Storage persistence mode so all features remain functional.

---

## 📬 Postman API Testing

Import `CourseGap-Postman-Collection.json` into Postman to run 7 pre-configured requests:
- `GET /students`: Fetch all student records
- `GET /students/:id`: Fetch student profile
- `POST /students`: Enroll new student
- `PUT /students/:id`: Overwrite student details
- `PATCH /students/:id`: Partially update status or attendance
- `DELETE /students/:id`: Remove student record
- `GET /supportRequests`: Fetch all mentoring tickets
