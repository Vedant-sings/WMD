# 🎓 CourseGap Companion — REST API Practice Project

> A hands-on REST API practice project using **JSON Server** and **Postman** to perform full CRUD operations on a `students` resource. Built with plain HTML5 and CSS3 — no frameworks.

---

## 📁 Project Structure

```
Exp2/
├── index.html                        # Dashboard UI with endpoint cards, student table, API sandbox
├── style.css                         # Responsive CSS with method badges & card layouts
├── db.json                           # JSON Server database (students resource)
├── CourseGap-Postman-Collection.json # Ready-to-import Postman v2.1 collection
└── README.md                         # This documentation file
```

---

## 🚀 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Postman](https://www.postman.com/downloads/) desktop app (or Postman web)

### Step 1 — Start the JSON Server

Open a terminal in the project folder and run:

```bash
npx json-server --watch db.json --port 3000
```

You should see output confirming the server is running:

```
JSON Server started on PORT :3000
Press CTRL-C to stop
```

**Base URL:** `http://localhost:3000/students`

### Step 2 — Open the Dashboard

Open `index.html` directly in your browser (double-click or use Live Server).

The dashboard will:
- Attempt to fetch live data from `http://localhost:3000/students`
- Fall back to static sample data if the server is not running

### Step 3 — Import the Postman Collection

1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `CourseGap-Postman-Collection.json`
4. All 7 pre-configured requests will appear in your workspace

---

## 📚 API Endpoint Reference

All endpoints operate on the base URL: `http://localhost:3000/students`

---

### 1. GET /students — Retrieve All Students

| Property        | Value                                |
|-----------------|--------------------------------------|
| **Method**      | `GET`                                |
| **URL**         | `http://localhost:3000/students`     |
| **Request Body**| None                                 |
| **Status Code** | `200 OK`                             |
| **Result**      | JSON array of all student records    |

---

### 2. GET /students/:id — Retrieve One Student

| Property        | Value                                    |
|-----------------|------------------------------------------|
| **Method**      | `GET`                                    |
| **URL**         | `http://localhost:3000/students/S101`    |
| **Request Body**| None                                     |
| **Status Code** | `200 OK`                                 |
| **Result**      | JSON object for student with id `S101`   |

---

### 3. POST /students — Add a New Student

| Property        | Value                                |
|-----------------|--------------------------------------|
| **Method**      | `POST`                               |
| **URL**         | `http://localhost:3000/students`     |
| **Headers**     | `Content-Type: application/json`     |
| **Status Code** | `201 Created`                        |
| **Result**      | Newly created student JSON object    |

**Sample Request Body:**

```json
{
  "id": "S105",
  "name": "Vikramaditya Rao",
  "semester": 5,
  "department": "Computer Science & Engineering",
  "email": "vikram.rao@example.com",
  "attendance": 91,
  "status": "On Track",
  "subjects": [
    "Artificial Intelligence",
    "Web Technologies",
    "Cloud Infrastructure"
  ]
}
```

---

### 4. PUT /students/:id — Full Replace a Student

| Property        | Value                                     |
|-----------------|-------------------------------------------|
| **Method**      | `PUT`                                     |
| **URL**         | `http://localhost:3000/students/S105`     |
| **Headers**     | `Content-Type: application/json`          |
| **Status Code** | `200 OK`                                  |
| **Result**      | Fully replaced student JSON object        |

> ⚠️ **PUT replaces the entire object.** Any field you omit in the request body will be **deleted** from the record. Always send all fields.

**Sample Request Body:**

```json
{
  "id": "S105",
  "name": "Vikramaditya Rao",
  "semester": 6,
  "department": "Computer Science & Engineering",
  "email": "vikram.rao.updated@example.com",
  "attendance": 95,
  "status": "Excellent",
  "subjects": [
    "Artificial Intelligence",
    "Web Technologies",
    "Cloud Infrastructure",
    "Deep Learning"
  ]
}
```

---

### 5. PATCH /students/:id — Partial Update a Student

| Property        | Value                                     |
|-----------------|-------------------------------------------|
| **Method**      | `PATCH`                                   |
| **URL**         | `http://localhost:3000/students/S102`     |
| **Headers**     | `Content-Type: application/json`          |
| **Status Code** | `200 OK`                                  |
| **Result**      | Updated student object (all fields intact)|

> 💡 **PATCH updates only the supplied fields** while preserving all other existing properties unchanged. This is the key difference from PUT.

**Sample Request Body (only updating attendance and status):**

```json
{
  "attendance": 78,
  "status": "On Track"
}
```

---

### 6. HEAD /students — Inspect Response Headers

| Property        | Value                                |
|-----------------|--------------------------------------|
| **Method**      | `HEAD`                               |
| **URL**         | `http://localhost:3000/students`     |
| **Request Body**| None                                 |
| **Status Code** | `200 OK`                             |
| **Result**      | Headers only — no response body      |

**Observed Headers:**

```
Content-Type: application/json; charset=utf-8
Content-Length: <size of response>
Cache-Control: no-cache
Access-Control-Allow-Credentials: true
```

> **Note on HEAD behavior:** The HEAD method is identical to GET except the server does not return a response body. In Postman, you will see headers and status in the response panel but the Body tab will show "0 bytes". Some versions of JSON Server may still return a body — this is a known behavior variance. Check the Headers tab in Postman for the authoritative response.

---

### 7. DELETE /students/:id — Delete a Test Student

| Property        | Value                                     |
|-----------------|-------------------------------------------|
| **Method**      | `DELETE`                                  |
| **URL**         | `http://localhost:3000/students/S105`     |
| **Request Body**| None                                      |
| **Status Code** | `200 OK` (or `204 No Content`)            |
| **Result**      | Empty object `{}` — record is removed     |

> ⚠️ **Important:** Always create a test student first (using POST request #3) before running DELETE. This prevents accidentally removing base student data from `db.json`. If you accidentally delete a base record, restart JSON Server to reload from the original `db.json`.

---

## ✅ Recommended Postman Testing Order

Follow this sequence for a clean, logical testing workflow:

| Step | Method     | Action                                   | Why This Order                         |
|------|------------|------------------------------------------|----------------------------------------|
| 1    | `GET`      | Fetch all students                       | Verify initial dataset                 |
| 2    | `POST`     | Create test student S105                 | Add a safe test record                 |
| 3    | `GET`      | Fetch student S105 by ID                 | Confirm creation succeeded             |
| 4    | `PUT`      | Full replace S105                        | Test complete entity replacement       |
| 5    | `PATCH`    | Partial update S102 (attendance/status)  | Test delta update on existing record   |
| 6    | `HEAD`     | Inspect headers on /students             | Verify metadata without body payload   |
| 7    | `DELETE`   | Delete test student S105                 | Clean up test data safely              |

---

## 🔑 PUT vs PATCH — Key Difference

| Aspect               | PUT                                    | PATCH                                  |
|----------------------|----------------------------------------|----------------------------------------|
| **Behavior**         | Replaces the **entire** resource       | Updates **only supplied** fields       |
| **Omitted fields**   | **Removed** from the record            | **Preserved** unchanged               |
| **Use case**         | Full record correction or overwrite    | Quick field-level edits                |
| **Idempotent?**      | Yes                                    | Not guaranteed                         |

---

## 🧰 Tech Stack

| Technology     | Role                                          |
|----------------|-----------------------------------------------|
| HTML5          | Dashboard UI structure and semantics          |
| CSS3           | Responsive layout, method badges, cards       |
| JSON Server    | Zero-config REST API mock server              |
| Postman        | API testing and documentation                 |
| Vanilla JS     | Live data fetching and interactive sandbox    |

---

## 📝 License

This project is for educational and practice purposes as part of the **CourseGap Companion** learning series.
