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

---

## ☕ Experiment 5: CampusConnect Event Registration Manager (Kotlin Console Module)

### 1. Overview & Domain Integration
As part of **Experiment 5**, a standalone Kotlin console application was added under `kotlin_module/` using the same CampusConnect domain (campus event registrations). It models university campus members registering for campus events such as *"AI Innovation Summit"*, *"Hackathon"*, *"Cultural Fest"*, and *"Sports Meet"*.

### 2. Kotlin Classes and Inheritance
- **Open Base Class**: [`CampusMember`](file:///c:/Users/DELL/Desktop/WMD/Exp5/CampusConnect/kotlin_module/src/main/kotlin/campusconnect/events/CampusMember.kt)
  - Properties: `id: String`, `var name: String`, `var email: String?`, `registeredEvents: List<String>`, `interests: Set<String>`, `baseRegistrationFee: Double = 500.0`.
  - Methods: `open fun calculateRegistrationFee(): Double`, `open fun getDetails(): String`, and `fun isRegisteredFor(eventName: String): Boolean`.
  - Marked with `open` so subclasses can inherit and extend it.
- **Subclasses**:
  - [`StudentMember`](file:///c:/Users/DELL/Desktop/WMD/Exp5/CampusConnect/kotlin_module/src/main/kotlin/campusconnect/events/CampusMember.kt): Adds `collegeName: String` and `studentDiscount: Double` (e.g., 25% discount).
  - [`FacultyMember`](file:///c:/Users/DELL/Desktop/WMD/Exp5/CampusConnect/kotlin_module/src/main/kotlin/campusconnect/events/CampusMember.kt): Adds `department: String` and `facultyAllowance: Double` (department-subsidized flat allowance).
  - [`GuestMember`](file:///c:/Users/DELL/Desktop/WMD/Exp5/CampusConnect/kotlin_module/src/main/kotlin/campusconnect/events/CampusMember.kt): Adds `organization: String` and `guestSurcharge: Double` (external guest participation surcharge).

### 3. Why Method Overriding Demonstrates Polymorphism
- Each subclass overrides `calculateRegistrationFee()` and `getDetails()` using the `override` keyword.
- In [`Main.kt`](file:///c:/Users/DELL/Desktop/WMD/Exp5/CampusConnect/kotlin_module/src/main/kotlin/campusconnect/events/Main.kt), members are held in a generic collection `List<CampusMember>`.
- When iterating through `members.forEach { member -> println(member.getDetails()) }`, Kotlin resolves method calls dynamically at **runtime** depending on the actual underlying object (`StudentMember`, `FacultyMember`, or `GuestMember`), not the compile-time reference type (`CampusMember`).
- This dynamic dispatch is runtime **subtype polymorphism**: students get discounted fees formatted with college details, faculty receive department subsidies, and guests have surcharges computed automatically without type conditionals.

### 4. Collections: List, Set, and Map Usage
- **`List<CampusMember>`**: Stores ordered member registrations (mixed students, faculty, and guests).
- **`Set<String>`**: Stores unique event interests across members (e.g., *"Artificial Intelligence"*, *"Robotics"*, *"Athletics"*), eliminating duplicates automatically.
- **`Map<String, CampusMember>`**: Indexed by member ID (e.g., `"STU-101"`, `"GST-301"`), enabling instantaneous \(O(1)\) lookup.

### 5. Collection Operations and Console Outputs
| Operation | Implementation & Purpose | Output Generated |
| :--- | :--- | :--- |
| `forEach` | Iterates over `members` | Invokes overridden `getDetails()` to print each member polymorphically |
| `filter` & `filterIsInstance` | Filters `StudentMember` entries registered for `"AI Innovation Summit"` or `"Hackathon"` | Lists tech-registered students and their events |
| `filter` & `count` | Filters members where `registeredEvents.size > 2` | Identifies active members enrolled in > 2 events |
| `sumOf` | Sums `calculateRegistrationFee()` over all members | Computes total registration revenue and average fee |
| `groupBy` | Groups members into categories (`Student`, `Faculty`, `Guest`) | Displays member lists and revenue subtotals by category |
| `flatMap` & `toSet` | Extracts all `interests` sets into a single unified `Set<String>` | Shows all unique interests and count of interested members |
| `Map` index lookup (`memberMap[id]`) | Key-based retrieval by Member ID | O(1) query for existing and non-existing members |

### 6. How to Compile and Run the Kotlin Module
From the `CampusConnect/` directory:
```bash
# Compile to a runnable JAR
kotlinc kotlin_module/src/main/kotlin/campusconnect/events/CampusMember.kt kotlin_module/src/main/kotlin/campusconnect/events/Main.kt -include-runtime -d kotlin_module/CampusConnectEvents.jar

# Run the application
java -jar kotlin_module/CampusConnectEvents.jar
```
