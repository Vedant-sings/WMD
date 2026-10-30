"""
CampusConnect Authentication Service
=====================================
Experiment 8 — Web & Mobile Application Development
Purpose : Demonstrate JWT-based token authentication for CampusConnect.
Stack   : Python 3.x · Flask · PyJWT · Werkzeug · python-dotenv · Flask-CORS

NOTE: This service is an ADDITIVE experiment module.
      It does not replace or modify the existing React + JSON Server frontend,
      the Spring Boot Event API (Exp 7), the db.json data, or any prior module.

IMPORTANT: This experiment demonstrates JWT authentication concepts only.
           It does NOT implement a complete OAuth2 authorization server.
"""

import os
import uuid
import datetime

import jwt
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

# ---------------------------------------------------------------------------
# Bootstrap
# ---------------------------------------------------------------------------

load_dotenv()  # Load .env file (JWT_SECRET, etc.) — never commit real secrets

app = Flask(__name__)

# CORS restricted to the existing CampusConnect React dev-server origin only.
# The existing JSON Server (port 3000) and Spring Boot API (port 8080) are
# completely unaffected by this configuration.
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
    supports_credentials=True,
)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError(
        "JWT_SECRET environment variable is not set. "
        "Copy .env.example to .env and provide a strong secret."
    )

JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = int(os.environ.get("JWT_EXPIRY_HOURS", "2"))

ALLOWED_ROLES = {"student", "admin"}

# ---------------------------------------------------------------------------
# In-memory "database"
# ---------------------------------------------------------------------------
# For this experiment, users are stored in a plain Python dict keyed by email.
# Passwords are ALWAYS stored as Werkzeug pbkdf2:sha256 hashes — never plain text.
# In production, replace with a real database (PostgreSQL, SQLite, etc.)

users: dict[str, dict] = {}

# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------


def _make_error(message: str, status: int, **extra) -> tuple:
    """Return a structured JSON error response."""
    body = {"success": False, "error": message, **extra}
    return jsonify(body), status


def _make_success(data: dict, status: int = 200) -> tuple:
    """Return a structured JSON success response."""
    body = {"success": True, **data}
    return jsonify(body), status


def _extract_bearer_token() -> str | None:
    """Extract the raw JWT string from the Authorization: Bearer <token> header."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    parts = auth_header.split(" ", 1)
    return parts[1].strip() if len(parts) == 2 else None


def _decode_token(token: str) -> tuple[dict | None, str | None]:
    """
    Decode and validate a JWT token.

    Returns:
        (payload_dict, None)         on success
        (None,         error_message) on any failure
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, "Token has expired. Please log in again."
    except jwt.InvalidTokenError as exc:
        return None, f"Invalid token: {exc}"


def _require_auth() -> tuple[dict | None, tuple | None]:
    """
    Middleware helper: extract + validate the Bearer token from the request.

    Returns:
        (payload, None)         if token is valid
        (None,    error_tuple)  if token is missing / malformed / expired / invalid
    """
    token = _extract_bearer_token()
    if token is None:
        return None, _make_error(
            "Authorization header missing or malformed. "
            "Provide: Authorization: Bearer <token>",
            401,
        )
    payload, err = _decode_token(token)
    if err:
        return None, _make_error(err, 401)
    return payload, None


# ---------------------------------------------------------------------------
# Route 1: POST /register
# ---------------------------------------------------------------------------


@app.route("/register", methods=["POST"])
def register():
    """
    Register a new CampusConnect user (student or admin).

    Request body (JSON):
        name     : string  — full name
        email    : string  — unique email address
        password : string  — plain-text password (hashed before storage)
        role     : string  — "student" or "admin"

    Success  → 201 with user profile (no password/hash returned)
    Failures → 400 (validation), 409 (duplicate email)
    """
    data = request.get_json(silent=True)

    # ── 1. Parse body ──────────────────────────────────────────────────────
    if data is None:
        return _make_error("Request body must be valid JSON.", 400)
    if not isinstance(data, dict):
        return _make_error("Request body must be a JSON object.", 400)

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "").strip().lower()

    # ── 2. Field-level validation ──────────────────────────────────────────
    errors: dict[str, str] = {}

    if not name:
        errors["name"] = "Name is required."

    if not email:
        errors["email"] = "Email is required."
    elif "@" not in email or "." not in email.split("@")[-1]:
        errors["email"] = "A valid email address is required."

    if not password:
        errors["password"] = "Password is required."
    elif len(password) < 8:
        errors["password"] = "Password must be at least 8 characters."

    if not role:
        errors["role"] = "Role is required."
    elif role not in ALLOWED_ROLES:
        errors["role"] = f"Role must be one of: {', '.join(sorted(ALLOWED_ROLES))}."

    if errors:
        return _make_error("Validation failed.", 400, validation_errors=errors)

    # ── 3. Duplicate-email check ───────────────────────────────────────────
    if email in users:
        return _make_error(
            f"An account with email '{email}' already exists.", 409
        )

    # ── 4. Hash password & persist user ───────────────────────────────────
    # Werkzeug uses secure password hashing (scrypt/pbkdf2) with a random salt — never stored as plain text.
    password_hash = generate_password_hash(password)

    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "name": name,
        "email": email,
        "role": role,
        "password_hash": password_hash,  # stored internally only
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }
    users[email] = user

    # ── 5. Build safe response (no password / hash) ────────────────────────
    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    return _make_success(
        {
            "message": f"Account created successfully. Welcome to CampusConnect, {name}!",
            "user": safe_user,
        },
        201,
    )


# ---------------------------------------------------------------------------
# Route 2: POST /login
# ---------------------------------------------------------------------------


@app.route("/login", methods=["POST"])
def login():
    """
    Authenticate an existing CampusConnect user.

    Request body (JSON):
        email    : string
        password : string (plain-text — verified against stored hash)

    Success  → 200 with signed JWT token + user profile (no password/hash)
    Failures → 400 (missing fields), 401 (invalid credentials)
    """
    data = request.get_json(silent=True)
    if data is None:
        return _make_error("Request body must be valid JSON.", 400)
    if not isinstance(data, dict):
        return _make_error("Request body must be a JSON object.", 400)

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    # ── 1. Validate presence ───────────────────────────────────────────────
    errors: dict[str, str] = {}
    if not email:
        errors["email"] = "Email is required."
    if not password:
        errors["password"] = "Password is required."
    if errors:
        return _make_error("Validation failed.", 400, validation_errors=errors)

    # ── 2. Look up user ────────────────────────────────────────────────────
    user = users.get(email)

    # Use constant-time check even when user not found (prevent timing attacks)
    dummy_hash = generate_password_hash("__dummy__")
    stored_hash = user["password_hash"] if user else dummy_hash
    password_ok = check_password_hash(stored_hash, password)

    if not user or not password_ok:
        return _make_error(
            "Invalid email or password. Please check your credentials.", 401
        )

    # ── 3. Issue JWT token ─────────────────────────────────────────────────
    now = datetime.datetime.now(datetime.timezone.utc)
    expiry = now + datetime.timedelta(hours=JWT_EXPIRY_HOURS)

    payload = {
        "sub": user["id"],       # subject: user ID
        "email": user["email"],
        "role": user["role"],
        "iat": now,              # issued at
        "exp": expiry,           # expiry
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    return _make_success(
        {
            "message": "Login successful.",
            "token": token,
            "expires_at": expiry.isoformat(),
            "token_type": "Bearer",
            "user": safe_user,
        }
    )


# ---------------------------------------------------------------------------
# Route 3: GET /dashboard  (requires valid JWT — any role)
# ---------------------------------------------------------------------------


@app.route("/dashboard", methods=["GET"])
def dashboard():
    """
    Protected CampusConnect dashboard.

    Requires:
        Authorization: Bearer <token>

    Returns personalised dashboard data including role-based permitted actions.
    """
    payload, err_response = _require_auth()
    if err_response:
        return err_response

    role = payload.get("role", "")
    email = payload.get("email", "")

    # Fetch user record to retrieve the full name
    user = users.get(email, {})
    name = user.get("name", email)

    # Role-based permitted actions
    if role == "admin":
        permitted_actions = [
            "view_all_students",
            "manage_events",
            "post_notices",
            "view_grades",
            "view_attendance",
            "manage_courses",
            "access_admin_panel",
        ]
        welcome_message = (
            f"Welcome back, Administrator {name}! "
            "You have full access to the CampusConnect admin panel."
        )
    else:
        permitted_actions = [
            "view_own_profile",
            "view_courses",
            "view_attendance",
            "view_grades",
            "view_notices",
            "register_for_events",
        ]
        welcome_message = (
            f"Welcome back, {name}! "
            "Your CampusConnect academic dashboard is ready."
        )

    dashboard_data = {
        "user": {
            "id": payload.get("sub"),
            "name": name,
            "email": email,
            "role": role,
        },
        "welcome_message": welcome_message,
        "permitted_actions": permitted_actions,
        "portal_sections": [
            {"section": "Student Profile",  "route": "/profile"},
            {"section": "Courses",          "route": "/courses"},
            {"section": "Attendance",       "route": "/attendance"},
            {"section": "Grades",           "route": "/grades"},
            {"section": "Notices",          "route": "/notices"},
            {"section": "Events",           "route": "/events"},
        ],
        "system_info": {
            "campus": "CampusConnect University",
            "semester": "5th Semester — Academic Year 2026",
            "token_issued_at": datetime.datetime.fromtimestamp(
                payload["iat"], datetime.timezone.utc
            ).isoformat()
            if isinstance(payload.get("iat"), (int, float))
            else str(payload.get("iat")),
            "token_expires_at": datetime.datetime.fromtimestamp(
                payload["exp"], datetime.timezone.utc
            ).isoformat()
            if isinstance(payload.get("exp"), (int, float))
            else str(payload.get("exp")),
        },
    }

    return _make_success({"dashboard": dashboard_data})


# ---------------------------------------------------------------------------
# Route 4: GET /admin/events  (requires valid JWT with role == "admin")
# ---------------------------------------------------------------------------


@app.route("/admin/events", methods=["GET"])
def admin_events():
    """
    Admin-only protected endpoint for event management.

    Requires:
        Authorization: Bearer <token>   (token must have role == "admin")

    Returns 403 Forbidden for a valid student token.
    """
    payload, err_response = _require_auth()
    if err_response:
        return err_response

    if payload.get("role") != "admin":
        return _make_error(
            "Access denied. This endpoint requires administrator privileges. "
            "Students are not authorised to access event management.",
            403,
        )

    event_summary = {
        "message": "Admin event management panel — CampusConnect.",
        "admin_email": payload.get("email"),
        "events_summary": {
            "total_events": 5,
            "upcoming_events": 4,
            "full_events": 1,
            "event_categories": ["Hackathon", "Academic", "Cultural", "Workshop", "Sports"],
        },
        "management_actions": [
            "create_event",
            "update_event",
            "delete_event",
            "register_attendee",
            "view_registrations",
            "export_event_report",
        ],
        "linked_api": {
            "description": (
                "Full event CRUD is handled by the standalone Spring Boot Event API "
                "(Experiment 7). Use that service for actual event operations."
            ),
            "base_url": "http://localhost:8080/api/events",
        },
    }

    return _make_success({"admin_panel": event_summary})


# ---------------------------------------------------------------------------
# Health-check (optional — useful for verifying the service is up)
# ---------------------------------------------------------------------------


@app.route("/health", methods=["GET"])
def health():
    """Quick liveness probe — no auth required."""
    return jsonify(
        {
            "status": "ok",
            "service": "CampusConnect Auth Service",
            "experiment": "Experiment 8 — JWT Authentication",
            "registered_users": len(users),
        }
    )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("FLASK_PORT", 5050))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    print(f"\n  CampusConnect Auth Service — Experiment 8")
    print(f"  Running on http://127.0.0.1:{port}")
    print(f"  Debug mode : {debug}")
    print(f"  JWT expiry : {JWT_EXPIRY_HOURS} hour(s)\n")
    app.run(host="127.0.0.1", port=port, debug=debug)
