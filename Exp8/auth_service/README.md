# CampusConnect — JWT Authentication Service

**Module:** Flask Auth Service · Python · PyJWT · Werkzeug · Flask-CORS  
**Experiment:** Web & Mobile Application Development — Practical Experiment 8  
**Purpose:** Demonstrate secure token-based authentication for CampusConnect students and administrators.

> ⚠️ **Disclaimer:** This experiment demonstrates JWT authentication concepts (registration, login, bearer-token protection, role-based authorization, and password hashing). It does **not** implement a complete OAuth2 authorization server or replace production-grade identity management.

---

## 📐 Architecture Overview

```
Exp8/
├── auth_service/                        ← Flask Auth Service (Experiment 8)
│   ├── app.py                           # Main Flask application (all endpoints)
│   ├── requirements.txt                 # Python dependencies
│   ├── .env.example                     # Environment variable template (safe to commit)
│   ├── .gitignore                       # Excludes .env, venv/, __pycache__/
│   ├── CampusConnect_Auth_Service.postman_collection.json
│   └── README.md                        # This file
│
├── index.html                           # CampusConnect portal — Exp 1 (unchanged)
├── styles.css                           # CSS3 stylesheet — Exp 1 (unchanged)
├── db.json                              # JSON Server data — Exp 1 (unchanged)
└── README.md                            # Root documentation
```

---

## 🛠️ Technology Stack

| Technology | Version | Role |
|:---|:---|:---|
| Python | 3.10+ | Language |
| Flask | 3.0.3 | Micro web framework |
| PyJWT | 2.8.0 | JWT encoding / decoding |
| Werkzeug | 3.0.4 | Password hashing (pbkdf2:sha256) |
| Flask-CORS | 4.0.1 | CORS headers for React frontend |
| python-dotenv | 1.0.1 | `.env` file loading |

---

## 🚀 How to Run the Flask Auth Service

### Step 1 — Navigate to the service folder

```cmd
cd auth_service
```

### Step 2 — Create and activate a virtual environment (recommended)

```cmd
python -m venv venv
venv\Scripts\activate
```

### Step 3 — Install dependencies

```cmd
pip install -r requirements.txt
```

### Step 4 — Create your `.env` file from the template

```cmd
copy .env.example .env
```

Then open `.env` and set a strong, random `JWT_SECRET`:

```env
JWT_SECRET=your-strong-random-secret-here-at-least-32-chars
JWT_EXPIRY_HOURS=2
FLASK_PORT=5050
FLASK_DEBUG=false
```

Generate a cryptographically secure secret:

```cmd
python -c "import secrets; print(secrets.token_hex(32))"
```

### Step 5 — Start the server

```cmd
python app.py
```

**Auth service running at:** `http://127.0.0.1:5050`

> **Port 5050** avoids conflicts with: React/Vite dev server (5173), JSON Server (3000), Spring Boot Event API (8080).

---

## 📋 API Endpoint Reference

**Base URL:** `http://127.0.0.1:5050`

| Method | Endpoint | Auth Required | Role | Description |
|:---:|:---|:---:|:---:|:---|
| `POST` | `/register` | ❌ | — | Register a new student or admin |
| `POST` | `/login` | ❌ | — | Login and receive JWT token |
| `GET` | `/dashboard` | ✅ Bearer | any | Protected dashboard data |
| `GET` | `/admin/events` | ✅ Bearer | admin only | Admin event management panel |
| `GET` | `/health` | ❌ | — | Service liveness check |

---

## 🔐 Authentication & Security Flows

### 1. Registration Flow

```
Client                            Flask Auth Service
  │                                       │
  │── POST /register ──────────────────►  │
  │   { name, email, password, role }     │
  │                                       │── Validate all fields
  │                                       │── Check role ∈ {student, admin}
  │                                       │── Reject if email already exists (409)
  │                                       │── Hash password using Werkzeug
  │                                       │   generate_password_hash()
  │                                       │   Algorithm: pbkdf2:sha256 + random salt
  │                                       │── Store { id, name, email, role, hash }
  │◄── 201 Created ──────────────────────│
  │   { user: { id, name, email, role } } │
  │   (password and hash NEVER returned)  │
```

**Key security properties:**
- Passwords are hashed with **Werkzeug's `generate_password_hash()`** using `pbkdf2:sha256` with a unique random salt per user.
- Plain-text passwords are **never stored** or logged anywhere.
- The `password_hash` field is **never included** in any API response.

---

### 2. Login Flow

```
Client                            Flask Auth Service
  │                                       │
  │── POST /login ──────────────────────► │
  │   { email, password }                 │
  │                                       │── Look up user by email
  │                                       │── check_password_hash(stored, given)
  │                                       │   (constant-time comparison)
  │                                       │── Build JWT payload:
  │                                       │   { sub: userId, email, role, iat, exp }
  │                                       │── Sign with HS256 + JWT_SECRET
  │◄── 200 OK ────────────────────────── │
  │   {                                   │
  │     token: "eyJ...",                  │
  │     expires_at: "...",                │
  │     token_type: "Bearer",             │
  │     user: { ... }                     │
  │   }                                   │
```

**Key security properties:**
- If the user does not exist, a **dummy hash comparison** is still performed (constant-time) to prevent timing-based user enumeration attacks.
- The error message for wrong password and non-existent email is **identical** ("Invalid email or password") to prevent enumeration.
- JWT payload includes: `sub` (user ID), `email`, `role`, `iat` (issued-at), `exp` (expiry).

---

### 3. JWT Bearer Token Flow

```
Client                            Flask Auth Service
  │                                       │
  │── GET /dashboard ──────────────────►  │
  │   Authorization: Bearer eyJ...        │
  │                                       │── Extract token from header
  │                                       │── jwt.decode(token, secret, algorithms)
  │                                       │── Validate signature ✓
  │                                       │── Validate expiry ✓
  │                                       │── Extract payload (sub, email, role)
  │◄── 200 OK ────────────────────────── │
  │   { dashboard: { user, welcome,       │
  │     permitted_actions, ... } }        │
```

**Token error responses:**

| Condition | HTTP Status | Error Message |
|:---|:---:|:---|
| No `Authorization` header | 401 | `Authorization header missing or malformed` |
| No `Bearer` prefix | 401 | `Authorization header missing or malformed` |
| Malformed / invalid token | 401 | `Invalid token: ...` |
| Expired token | 401 | `Token has expired. Please log in again.` |
| Wrong secret / tampered | 401 | `Invalid token: Signature verification failed` |

---

### 4. Password Hashing

This service uses **Werkzeug's security utilities** for password hashing:

```python
from werkzeug.security import generate_password_hash, check_password_hash

# On registration — hash the plain-text password
password_hash = generate_password_hash("user_plain_password")
# Result example: "pbkdf2:sha256:600000$aBcDeFgH$<long_hex_hash>"
# Each call produces a DIFFERENT hash (due to random salt)

# On login — verify the submitted password against the stored hash
is_valid = check_password_hash(stored_hash, submitted_password)
# Returns True only if the password matches; False otherwise
```

**Why Werkzeug over plain SHA256 or MD5?**

| Aspect | MD5 / SHA256 (plain) | Werkzeug pbkdf2:sha256 |
|:---|:---|:---|
| Random salt | ❌ | ✅ (unique per user) |
| Work factor / stretching | ❌ | ✅ (600,000 iterations) |
| Rainbow table resistance | ❌ | ✅ |
| Timing-safe comparison | ❌ | ✅ |

---

### 5. Role-Based Authorization

```
                  ┌─────────────────────────────────────────┐
                  │          JWT Token Payload               │
                  │  { sub, email, role: "student"|"admin" } │
                  └──────────────────┬──────────────────────┘
                                     │
              ┌──────────────────────┼─────────────────────┐
              │                      │                      │
        role="student"         role="admin"          role="admin"
              │                      │                      │
        GET /dashboard          GET /dashboard       GET /admin/events
              │                      │                      │
         200 OK                  200 OK                  200 OK
     (student view)            (admin view)          (admin panel)
              │
        GET /admin/events
              │
         403 Forbidden
   "Access denied. Admin only."
```

Role checking happens **after** JWT validation — an invalid token always returns 401 before any role check can occur.

---

## 🔒 Security Requirements Summary

| Requirement | Implementation |
|:---|:---|
| Password hashing | Werkzeug `generate_password_hash` (pbkdf2:sha256 + salt) |
| Plain-text passwords never stored | ✅ Only the Werkzeug hash is stored |
| Password never returned | ✅ `password_hash` excluded from all responses |
| JWT secret in environment variable | ✅ Loaded from `JWT_SECRET` env var via `python-dotenv` |
| No real secret in source code | ✅ Only `.env.example` (with placeholder) committed |
| Token expiration | ✅ `exp` claim set to `now + JWT_EXPIRY_HOURS` |
| Missing token → JSON error | ✅ 401 with structured JSON |
| Malformed token → JSON error | ✅ 401 via `jwt.InvalidTokenError` |
| Expired token → JSON error | ✅ 401 via `jwt.ExpiredSignatureError` |
| Invalid/tampered token → JSON error | ✅ 401 via signature verification failure |
| CORS restricted to frontend origin | ✅ Only `http://localhost:5173` and `http://127.0.0.1:5173` |
| Role-based endpoint protection | ✅ 403 for student on `/admin/events` |

---

## 🧪 Postman Testing Guide

### Step 1 — Import the Collection

1. Open **Postman**
2. Click **Import** → **File**
3. Select `auth_service/CampusConnect_Auth_Service.postman_collection.json`
4. The collection **"CampusConnect Auth Service"** appears in the sidebar

### Step 2 — Set Collection Variables (after running Login)

After running a Login request:
1. Click the collection name → **Variables** tab
2. Paste the token from the login response into `student_token` or `admin_token`

### Step 3 — Recommended Testing Sequence

```
 1.  POST /register — Register Student       → 201 Created
 2.  POST /register — Register Admin         → 201 Created
 3.  POST /register — Duplicate Email        → 409 Conflict
 4.  POST /register — Invalid Role           → 400 Bad Request
 5.  POST /register — Missing Fields         → 400 Bad Request
 6.  POST /login    — Login Student          → 200 OK  → copy token → {{student_token}}
 7.  POST /login    — Login Admin            → 200 OK  → copy token → {{admin_token}}
 8.  POST /login    — Wrong Password         → 401 Unauthorized
 9.  GET  /dashboard — Valid Student Token   → 200 OK (student permitted_actions)
10.  GET  /dashboard — Valid Admin Token     → 200 OK (admin permitted_actions)
11.  GET  /dashboard — No Token             → 401 Unauthorized
12.  GET  /dashboard — Invalid Token        → 401 Unauthorized
13.  GET  /dashboard — Expired Token        → 401 Unauthorized
14.  GET  /admin/events — Student Token     → 403 Forbidden
15.  GET  /admin/events — Admin Token       → 200 OK
16.  GET  /admin/events — No Token          → 401 Unauthorized
17.  GET  /health                           → 200 OK
```

---

## 🌐 Coexistence with Existing CampusConnect Modules

This service is **completely additive** and does not affect any prior experiment component:

| Component | Port | Data Source | Status |
|:---|:---:|:---|:---|
| CampusConnect HTML Portal (Exp 1) | — | index.html + db.json | **Unchanged** |
| JSON Server | 3000 | db.json | **Unchanged** |
| React App (Vite) | 5173 | JSON Server | **Unchanged** |
| Spring Boot Event API (Exp 7) | 8080 | H2 in-memory | **Unchanged** |
| **Flask Auth Service (Exp 8)** | **5050** | **In-memory dict** | **New** |

All services can run simultaneously without conflicts.

---

## 🎓 Key Concepts Demonstrated

| Concept | Implementation |
|:---|:---|
| **JWT (JSON Web Token)** | PyJWT encodes payload `{ sub, email, role, iat, exp }` signed with HS256 |
| **Token Bearer Flow** | Client sends `Authorization: Bearer <token>` header; server validates |
| **Password Hashing** | Werkzeug `generate_password_hash` / `check_password_hash` (pbkdf2:sha256) |
| **Token Expiry** | `exp` claim; PyJWT raises `ExpiredSignatureError` on decode |
| **Token Validation** | PyJWT raises `InvalidTokenError` for tampered / wrong-key tokens |
| **Role-Based Authorization** | `role` claim in JWT payload; 403 if role ≠ required role |
| **Duplicate Email Rejection** | 409 Conflict before hash is computed |
| **Timing-Safe Auth** | Dummy hash comparison prevents timing attacks on non-existent users |
| **CORS** | Flask-CORS restricts cross-origin access to the React frontend origin |
| **Environment Secrets** | `JWT_SECRET` loaded from `.env` via `python-dotenv`; `.env` never committed |
| **Structured JSON Errors** | All errors return `{ success: false, error: "..." }` with correct HTTP status |
