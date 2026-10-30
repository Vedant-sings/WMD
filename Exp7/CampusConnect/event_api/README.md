# CampusConnect — Event Management REST API

**Module:** Spring Boot REST API · Java 17 · Maven · Spring Data JPA · H2 Database  
**Experiment:** Web & Mobile Application Development — Practical Experiment 7  
**Purpose:** Standalone backend microservice for the CampusConnect Event resource, independently runnable alongside the existing React + JSON Server frontend.

---

## 📐 Architecture Overview

```
event_api/
├── src/main/java/com/campusconnect/events/
│   ├── CampusConnectEventsApplication.java   # @SpringBootApplication entry point
│   ├── config/
│   │   ├── DataLoader.java                   # Seeds H2 with 5 sample events on startup
│   │   └── WebConfig.java                    # Global CORS config for React frontend
│   ├── controller/
│   │   └── EventController.java              # REST endpoints — @RestController
│   ├── dto/
│   │   ├── EventRequestDTO.java              # POST / PUT request body + validation
│   │   ├── EventPatchDTO.java                # PATCH request body (partial fields)
│   │   └── ErrorResponseDTO.java             # Structured JSON error envelope
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java       # @RestControllerAdvice — maps exceptions → HTTP
│   │   ├── ResourceNotFoundException.java    # 404
│   │   ├── EventCapacityException.java       # 409
│   │   └── InvalidEventDataException.java    # 400
│   ├── model/
│   │   └── Event.java                        # @Entity — JPA mapped to H2 table `events`
│   ├── repository/
│   │   └── EventRepository.java              # JpaRepository<Event, Long>
│   └── service/
│       └── EventService.java                 # Business logic + capacity validation
├── src/main/resources/
│   └── application.properties                # H2, JPA, CORS, port config
├── src/test/java/com/campusconnect/events/
│   ├── CampusConnectEventsApplicationTests.java
│   └── EventControllerIntegrationTest.java   # MockMvc tests for all endpoints
├── CampusConnect_Event_API.postman_collection.json
├── mvnw.cmd                                  # Windows Maven wrapper
├── .mvn/wrapper/maven-wrapper.properties
└── pom.xml
```

---

## 🛠️ Technology Stack

| Technology | Version | Role |
|:---|:---|:---|
| Java | 17 (SE) | Language |
| Spring Boot | 3.3.4 | Framework |
| Spring Web (MVC) | included | REST controller layer |
| Spring Data JPA | included | ORM / repository layer |
| Hibernate | included (auto) | JPA implementation |
| H2 Database | included | In-memory database |
| Jakarta Validation | included | Bean validation annotations |
| Maven (Wrapper) | 3.9.9 | Build tool |

---

## 🚀 How to Run Using Maven

> **Prerequisites:** Java 17+ must be installed (Java 24 works fine). No system-wide Maven required — use the bundled wrapper.

### Option A — Maven Wrapper (Recommended, no Maven install needed)

```cmd
cd CampusConnect\event_api
mvnw.cmd spring-boot:run
```

### Option B — Using system Maven (if installed)

```cmd
cd CampusConnect\event_api
mvn spring-boot:run
```

### Option C — Build JAR then run

```cmd
cd CampusConnect\event_api
mvnw.cmd clean package -DskipTests
java -jar target\campusconnect-event-api-1.0.0.jar
```

### Option D — Run tests

```cmd
mvnw.cmd test
```

**API ready at:** `http://localhost:8080`

> **Note:** The existing React + JSON Server frontend is completely unaffected. Both can run simultaneously — JSON Server on port 3000/4000 and this Spring Boot API on port 8080.

---

## 🗄️ H2 In-Memory Database

### Accessing the H2 Web Console

1. Start the Spring Boot application (any option above)
2. Open your browser and navigate to: **http://localhost:8080/h2-console**
3. Use these login credentials:

| Field | Value |
|:---|:---|
| **JDBC URL** | `jdbc:h2:mem:campusconnect_db` |
| **Username** | `sa` |
| **Password** | *(leave empty)* |
| **Driver Class** | `org.h2.Driver` |

### Useful SQL Queries

```sql
-- View all events
SELECT * FROM EVENTS;

-- Count registrations
SELECT TITLE, REGISTERED_COUNT, CAPACITY,
       (CAPACITY - REGISTERED_COUNT) AS AVAILABLE_SEATS
FROM EVENTS;

-- Find full events
SELECT TITLE, REGISTERED_COUNT, CAPACITY
FROM EVENTS
WHERE REGISTERED_COUNT = CAPACITY;

-- Find events by category
SELECT * FROM EVENTS WHERE UPPER(CATEGORY) = 'HACKATHON';
```

### Pre-loaded Sample Data

The `DataLoader` seeds the H2 database automatically on startup with 5 CampusConnect events:

| # | Title | Category | Date | Capacity | Registered |
|:---:|:---|:---|:---|:---:|:---:|
| 1 | National Campus Hackathon 2026 | Hackathon | 2026-10-15 | 120 | 95 |
| 2 | Guest Lecture: Enterprise Spring Boot & Cloud | Academic | 2026-10-18 | 250 | 180 |
| 3 | Campus Cultural Fiesta - Tarang 2026 | Cultural | 2026-11-05 | 500 | 320 |
| 4 | Workshop: Modern React & Full-Stack Synergy | Workshop | 2026-10-22 | 60 | **60** (full) |
| 5 | Annual Inter-Department Sports Meet | Sports | 2026-11-12 | 300 | 145 |

> Data resets every time the Spring Boot application restarts (H2 in-memory).

---

## 📋 API Endpoint Reference

**Base URL:** `http://localhost:8080`

| Method | Endpoint | Description | Success | Error Codes |
|:---:|:---|:---|:---:|:---|
| `GET` | `/api/events` | Retrieve all events | 200 | — |
| `GET` | `/api/events/{id}` | Retrieve one event by ID | 200 | 404, 400 |
| `POST` | `/api/events` | Create a new event | 201 | 400 |
| `PUT` | `/api/events/{id}` | Fully replace an event | 200 | 400, 404 |
| `PATCH` | `/api/events/{id}` | Partially update 1–4 fields | 200 | 400, 404 |
| `DELETE` | `/api/events/{id}` | Delete an event | 204 | 404 |
| `POST` | `/api/events/{id}/register` | Increment registeredCount | 200 | 404, 409 |

### HTTP Status Code Meanings

| Code | Status | Used When |
|:---:|:---|:---|
| `200` | OK | Successful GET, PUT, PATCH, and /register |
| `201` | Created | Successful POST (new event created) |
| `204` | No Content | Successful DELETE (no body returned) |
| `400` | Bad Request | Validation failure, blank required fields, capacity rules violated |
| `404` | Not Found | Event ID does not exist in the database |
| `409` | Conflict | Registration attempted on a fully booked event |

---

## 📦 Event Resource — Fields & Validation

### Event JSON Structure

```json
{
  "id": 1,
  "title": "National Campus Hackathon 2026",
  "category": "Hackathon",
  "date": "2026-10-15",
  "time": "09:00 AM",
  "venue": "Innovation & Tech Lab, Block C",
  "organizer": "ACM Student Chapter",
  "capacity": 120,
  "registeredCount": 95,
  "description": "36-hour hackathon focused on full-stack web applications, AI automation, and cloud microservices."
}
```

### Field Validation Rules

| Field | Type | Required | Constraints |
|:---|:---|:---:|:---|
| `id` | Long | Auto | Auto-generated by JPA; do not send in POST/PUT |
| `title` | String | ✅ | Not blank, max 120 characters |
| `category` | String | ✅ | Not blank, max 60 characters |
| `date` | String | ✅ | Not blank (e.g., `YYYY-MM-DD`) |
| `time` | String | ✅ | Not blank (e.g., `10:00 AM`) |
| `venue` | String | ✅ | Not blank, max 150 characters |
| `organizer` | String | ✅ | Not blank, max 120 characters |
| `capacity` | Integer | ✅ | Not null, min value = 1 (> 0) |
| `registeredCount` | Integer | ✅ | Not null, min value = 0 (≥ 0) |
| `description` | String | ✅ | Not blank, max 1000 characters |

**Cross-field rule:** `registeredCount` must never exceed `capacity` (validated in service layer for POST and PUT; computed for PATCH).

### PATCH — Patchable Fields Only

Only these 4 fields can be included in a PATCH request body:

```json
{
  "category": "string (optional)",
  "date": "string (optional)",
  "capacity": 0,
  "registeredCount": 0
}
```

Any field omitted keeps its existing value.

---

## 📬 Request Body Examples

### POST /api/events — Create Event

```json
{
  "title": "AI & Robotics Symposium 2026",
  "category": "Technical",
  "date": "2026-11-20",
  "time": "11:00 AM",
  "venue": "Robotics Arena, Hall 3",
  "organizer": "Robotics Society",
  "capacity": 80,
  "registeredCount": 25,
  "description": "Showcase of autonomous robotics and ML projects from campus teams."
}
```

### PUT /api/events/{id} — Full Update (all fields required)

```json
{
  "title": "National Campus Hackathon 2026 — Extended Edition",
  "category": "Hackathon",
  "date": "2026-10-16",
  "time": "09:30 AM",
  "venue": "Innovation & Tech Lab, Block C & D",
  "organizer": "ACM Student Chapter & GDSC",
  "capacity": 150,
  "registeredCount": 110,
  "description": "Extended 48-hour hackathon covering full-stack, AI, and cloud."
}
```

### PATCH /api/events/{id} — Partial Update (include only what you want to change)

```json
{
  "category": "Mega Hackathon",
  "date": "2026-10-17",
  "capacity": 200,
  "registeredCount": 115
}
```

### POST /api/events/{id}/register — No request body required

```
POST http://localhost:8080/api/events/1/register
```

---

## ❌ Error Response Format

All error responses use the same structured JSON envelope:

```json
{
  "timestamp": "2026-10-06T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Event with ID 99 not found",
  "path": "/api/events/99",
  "validationErrors": null
}
```

For validation failures (400), `validationErrors` contains field-level details:

```json
{
  "timestamp": "2026-10-06T10:31:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for one or more fields",
  "path": "/api/events",
  "validationErrors": {
    "title": "Title is required and cannot be blank",
    "capacity": "Capacity must be greater than zero",
    "venue": "Venue is required and cannot be blank"
  }
}
```

---

## 🧪 Postman Testing Guide

### Step 1 — Import the Collection

1. Open Postman
2. Click **Import** → choose **File**
3. Select `event_api/CampusConnect_Event_API.postman_collection.json`
4. The collection **CampusConnect Event API** appears in the sidebar

### Step 2 — Set Collection Variables

1. Click the collection name → **Variables** tab
2. Verify `base_url` = `http://localhost:8080`
3. Set `event_id` = `1` (or update after running POST)

### Step 3 — Recommended Testing Sequence

Run requests in this order for a complete walkthrough:

```
1.  GET  /api/events                    → Confirm 5 sample events loaded (200 OK)
2.  GET  /api/events/1                  → Fetch Hackathon event (200 OK)
3.  GET  /api/events/9999               → Test 404 Not Found
4.  GET  /api/events/abc                → Test 400 type mismatch
5.  POST /api/events                    → Create AI & Robotics Symposium (201 Created)
                                          → Save new `id` to collection variable `event_id`
6.  POST /api/events (empty body {})    → Test 400 all-field validation errors
7.  POST /api/events (capacity=0)       → Test 400 capacity validation
8.  POST /api/events (registered>cap)   → Test 400 cross-field rule
9.  GET  /api/events/{{event_id}}       → Confirm new event exists (200 OK)
10. PUT  /api/events/{{event_id}}       → Full update (200 OK)
11. PUT  /api/events/9999               → Test 404 on update
12. PUT  /api/events/{{event_id}}       → Test 400 registered > capacity on PUT
13. PATCH /api/events/{{event_id}}      → Partial update category & date (200 OK)
14. PATCH /api/events/{{event_id}}      → Partial update capacity & registeredCount (200 OK)
15. PATCH /api/events/{{event_id}}      → Test 400 blank category
16. PATCH /api/events/{{event_id}}      → Test 400 capacity drops below registered
17. POST /api/events/1/register         → Register (200 OK — registeredCount++)
18. POST /api/events/4/register         → Full Workshop → 409 Conflict
19. POST /api/events/9999/register      → Non-existent → 404
20. DELETE /api/events/{{event_id}}     → Delete the created event (204 No Content)
21. GET  /api/events/{{event_id}}       → Confirm deleted → 404
22. DELETE /api/events/9999             → Test 404 on double-delete
```

---

## 📖 HTTP Methods Explained

### GET — Read Data

Retrieves event data without modifying anything. Safe and idempotent.

- `GET /api/events` — Returns all events as a JSON array.
- `GET /api/events/{id}` — Returns one event. Returns 404 if not found.

### POST — Create / Action

Creates a new resource or triggers an action. Not idempotent (calling twice creates two records or applies twice).

- `POST /api/events` — Creates an event from the JSON body. Returns 201 with the new event including its generated `id`.
- `POST /api/events/{id}/register` — Business action: atomically increments `registeredCount` by 1 if capacity allows. Returns 409 if the event is full.

### PUT — Full Replacement

Replaces all fields of an existing event. Every field must be provided in the body. Idempotent — calling with the same body twice gives the same result.

- `PUT /api/events/{id}` — Overwrites the event entirely. Returns the updated event.

### PATCH — Partial Update

Modifies only the specified fields, leaving others unchanged. This API allows patching: `category`, `date`, `capacity`, and `registeredCount`.

- `PATCH /api/events/{id}` — Include only the fields you want to change. Cross-field capacity rules still apply.

### DELETE — Remove Data

Permanently removes an event from the H2 database. Returns 204 (no body). Returns 404 if the ID doesn't exist.

- `DELETE /api/events/{id}` — Deletes the event. Data is lost for the session (H2 is in-memory).

### Registration Endpoint (`POST /{id}/register`)

This is a custom "action" endpoint — not a standard CRUD operation. It encapsulates the business rule:

> *Increment `registeredCount` by 1 **only if** `registeredCount < capacity`; otherwise reject with 409 Conflict.*

This keeps the capacity enforcement logic centralized in the service layer rather than leaving it to the API consumer.

---

## 🔒 CORS Configuration

The API allows cross-origin requests from the React frontend:

| Setting | Value |
|:---|:---|
| Allowed Origins | `http://localhost:5173`, `http://127.0.0.1:5173` |
| Allowed Methods | GET, POST, PUT, PATCH, DELETE, OPTIONS |
| Allowed Headers | `*` (all) |
| Allow Credentials | `true` |

CORS is configured in two layers:
1. **Controller level:** `@CrossOrigin(origins = "http://localhost:5173")` on `EventController`
2. **Global level:** `WebConfig.java` implements `WebMvcConfigurer.addCorsMappings()`

---

## ⚙️ application.properties Reference

```properties
# Server
server.port=8080

# H2 in-memory database
spring.datasource.url=jdbc:h2:mem:campusconnect_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# H2 Web Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.h2.console.settings.web-allow-others=true

# Logging
logging.level.com.campusconnect.events=DEBUG
logging.level.org.springframework.web=INFO
```

---

## 🔗 Coexistence with React Frontend

This Spring Boot module is **completely independent** from the existing React frontend:

| Component | Port | Data Source | Status |
|:---|:---:|:---|:---|
| React App (Vite) | 5173 | JSON Server (db.json) | Unchanged |
| JSON Server | 3000 | db.json | Unchanged |
| **Spring Boot Event API** | **8080** | **H2 in-memory** | **New** |

The React app continues to use JSON Server for students, courses, attendance, grades, and notices. The Spring Boot API is a separate experiment module demonstrating how a production-grade REST API would be implemented for the Events resource using proper layered architecture.

---

## 🎓 Key Concepts Demonstrated

| Concept | Implementation |
|:---|:---|
| **REST Architecture** | Stateless HTTP, resource-based URLs, standard verbs |
| **Spring MVC** | `@RestController`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping` |
| **Spring Data JPA** | `JpaRepository<Event, Long>` — auto-implements CRUD |
| **Bean Validation** | `@NotBlank`, `@NotNull`, `@Min`, `@Size` on DTO fields |
| **DTO Pattern** | Separate `EventRequestDTO` / `EventPatchDTO` for input; `Event` entity for persistence |
| **Global Exception Handling** | `@RestControllerAdvice` maps custom exceptions to structured JSON + correct HTTP status |
| **H2 In-Memory DB** | Zero-config embedded database; auto-schema via `ddl-auto=update` |
| **Data Seeding** | `CommandLineRunner` `@Bean` in `DataLoader` seeds 5 sample events |
| **CORS** | `WebMvcConfigurer` + `@CrossOrigin` for React dev server compatibility |
| **Service Layer** | Business logic and cross-field validation decoupled from controller |
| **Custom Action Endpoint** | `POST /register` — non-CRUD action with capacity guard (409 on full) |
