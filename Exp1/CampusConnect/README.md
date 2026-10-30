# CampusConnect – Student Academic Management System

**Web and Mobile Application Development — Practical Experiment 1**

---

## 📌 Project Overview & Objective

**CampusConnect** is a beginner-friendly, static academic management web portal built as **Experiment 1** of the Web and Mobile Application Development course.

The primary objective of this experiment is to demonstrate modern web page layout and semantic structure using strictly core **HTML5**, **CSS3**, and **JSON static data** — without relying on external UI libraries, frameworks, JavaScript, or backend dynamic servers.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<table>`, `<form>`, `<fieldset>`, `<legend>`, `<label>`, `<input>`)
- **CSS3**: Custom properties / CSS variables, Flexbox layout, CSS Grid, media queries for responsive design, custom styling for forms and tables.
- **JSON**: Static database representation in `db.json`.

> **Note**: As per Experiment 1 constraints, no React, JavaScript, Bootstrap, Tailwind, Node.js, or backend frameworks are used.

---

## ✨ Application Features

1. **Header & Branding**: CampusConnect crest, title, and experiment badge.
2. **Sticky Navigation Bar**: Smooth-scrolling links jumping directly to each portal section.
3. **Academic Summary Dashboard**: Summary cards displaying Student Name, Total Courses, Attendance %, CGPA, and Pending Tasks.
4. **Student Profile Section**: Profile card displaying Student ID, Full Name, Email, Branch, Semester, and Division.
5. **Courses Section**: Structured HTML table with Course Code, Course Name, Faculty, Credits, and Semester details.
6. **Attendance Section**: Attendance table with course-wise lecture counts, attendance percentages, and visual status badges (*Safe / Good* vs *Low Attendance*).
7. **Grades Section**: Academic performance table displaying Internal Marks, External Marks, Final Grade, and Grade Points.
8. **Academic Notices Section**: Styled list of 4 academic bulletins with dates and category tags.
9. **Student Registration Form**: Comprehensive HTML5 form with semantic input types (`text`, `email`, `tel`, `date`, `radio`, `select`, `textarea`, `password`), fieldsets, `required` validation, and Reset/Submit buttons.
10. **Responsive Footer**: Academic copyright notice and quick navigational links.

---

## 📁 Folder Structure

```
CampusConnect/
│
├── index.html   # Main HTML5 semantic page structure
├── styles.css   # Custom CSS3 stylesheet (Flexbox, Grid, Responsive Design)
├── db.json      # Sample JSON database containing records for students, courses, attendance, grades & notices
└── README.md    # Experiment documentation & Viva Voce preparation guide
```

---

## 🚀 How to Open and Run the Project

1. Navigate to the project folder:
   ```
   CampusConnect/
   ```
2. Double-click or open `index.html` in any standard web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
3. No server setup or `npm install` command is needed.

---

## 🎓 HTML5 & CSS3 Concepts Demonstrated (Viva Reference)

| Concept | Implementation in CampusConnect |
| :--- | :--- |
| **Semantic HTML5** | Used `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<fieldset>`, `<legend>`, `<label>`. |
| **Form Inputs & Validation** | Utilized HTML5 attributes (`required`, `minlength`, `pattern`, `type="email"`, `type="tel"`, `type="date"`). |
| **Data Tables** | Clean HTML `<table>` layout with `<thead>`, `<tbody>`, `<th>`, and `<td>` for structured academic reports. |
| **CSS Grid & Flexbox** | Used CSS Grid for summary cards and form fields; Flexbox for navigation bar and profile card layout. |
| **CSS Variables (`:root`)** | Centralized design tokens for colors, shadows, border radii, and transitions. |
| **Responsive Media Queries** | Responsive breakpoints (`@media (max-width: 768px)`) for mobile and tablet screens. |
| **UX & Interactions** | Smooth anchor scrolling (`scroll-behavior: smooth`), card hover elevations, and status pill badges. |
