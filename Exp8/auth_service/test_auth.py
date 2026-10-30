"""
CampusConnect Auth Service — Comprehensive Unit Tests
======================================================
Tests all requirements for Experiment 8:
- Registration validation, role check, duplicate emails, password hashing
- Login credential validation, JWT token generation with required claims
- Protected dashboard with valid token, permitted actions per role
- Token errors: missing, invalid, malformed, expired
- Role-based authorization on /admin/events (403 for student, 200 for admin)
- Password and hash confidentiality in responses
"""

import datetime
import os
import unittest
import jwt

# Set JWT_SECRET in environment before importing app if not already set
os.environ.setdefault(
    "JWT_SECRET", "test-secret-key-exp8-campusconnect-32chars"
)

from app import app, users, JWT_SECRET, JWT_ALGORITHM


class CampusConnectAuthTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        # Reset in-memory users dictionary for test isolation
        users.clear()

        self.student_data = {
            "name": "Sophia Patel",
            "email": "sophia.patel@campusconnect.edu",
            "password": "SecurePassword123!",
            "role": "student",
        }

        self.admin_data = {
            "name": "Dr. Sarah Jenkins",
            "email": "sarah.jenkins@campusconnect.edu",
            "password": "AdminSecurePassword123!",
            "role": "admin",
        }

    # -------------------------------------------------------------------------
    # 1. Registration Tests
    # -------------------------------------------------------------------------

    def test_register_student_success(self):
        res = self.client.post("/register", json=self.student_data)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertIn("user", data)
        self.assertEqual(data["user"]["name"], "Sophia Patel")
        self.assertEqual(data["user"]["email"], "sophia.patel@campusconnect.edu")
        self.assertEqual(data["user"]["role"], "student")
        # Ensure password and password hash are NEVER exposed
        self.assertNotIn("password", data["user"])
        self.assertNotIn("password_hash", data["user"])

        # Verify password is stored hashed in memory
        stored_user = users["sophia.patel@campusconnect.edu"]
        self.assertNotEqual(stored_user["password_hash"], self.student_data["password"])
        self.assertTrue(
            stored_user["password_hash"].startswith("scrypt:")
            or stored_user["password_hash"].startswith("pbkdf2:sha256:")
        )

    def test_register_admin_success(self):
        res = self.client.post("/register", json=self.admin_data)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertEqual(data["user"]["role"], "admin")
        self.assertNotIn("password", data["user"])
        self.assertNotIn("password_hash", data["user"])

    def test_register_duplicate_email(self):
        self.client.post("/register", json=self.student_data)
        res = self.client.post("/register", json=self.student_data)
        self.assertEqual(res.status_code, 409)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("already exists", data["error"])

    def test_register_invalid_role(self):
        invalid_user = {
            "name": "Hacker",
            "email": "hacker@campusconnect.edu",
            "password": "Password123!",
            "role": "superadmin",
        }
        res = self.client.post("/register", json=invalid_user)
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("Role must be one of", data["validation_errors"]["role"])

    def test_register_validation_missing_fields(self):
        res = self.client.post("/register", json={})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("validation_errors", data)
        self.assertIn("name", data["validation_errors"])
        self.assertIn("email", data["validation_errors"])
        self.assertIn("password", data["validation_errors"])
        self.assertIn("role", data["validation_errors"])

    def test_register_short_password(self):
        bad_pass = dict(self.student_data, password="123")
        res = self.client.post("/register", json=bad_pass)
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("at least 8 characters", data["validation_errors"]["password"])

    def test_register_invalid_email_format(self):
        bad_email = dict(self.student_data, email="notanemail")
        res = self.client.post("/register", json=bad_email)
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("valid email address", data["validation_errors"]["email"])

    # -------------------------------------------------------------------------
    # 2. Login Tests
    # -------------------------------------------------------------------------

    def test_login_student_success(self):
        self.client.post("/register", json=self.student_data)
        res = self.client.post(
            "/login",
            json={
                "email": "sophia.patel@campusconnect.edu",
                "password": "SecurePassword123!",
            },
        )
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertIn("token", data)
        self.assertEqual(data["token_type"], "Bearer")
        self.assertIn("expires_at", data)

        # Verify decoded JWT claims: sub, email, role, iat, exp
        decoded = jwt.decode(
            data["token"], JWT_SECRET, algorithms=[JWT_ALGORITHM]
        )
        self.assertIn("sub", decoded)
        self.assertEqual(decoded["email"], "sophia.patel@campusconnect.edu")
        self.assertEqual(decoded["role"], "student")
        self.assertIn("iat", decoded)
        self.assertIn("exp", decoded)

    def test_login_wrong_password(self):
        self.client.post("/register", json=self.student_data)
        res = self.client.post(
            "/login",
            json={
                "email": "sophia.patel@campusconnect.edu",
                "password": "WrongPassword!",
            },
        )
        self.assertEqual(res.status_code, 401)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("Invalid email or password", data["error"])

    def test_login_nonexistent_email(self):
        res = self.client.post(
            "/login",
            json={
                "email": "nonexistent@campusconnect.edu",
                "password": "SomePassword123!",
            },
        )
        self.assertEqual(res.status_code, 401)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("Invalid email or password", data["error"])

    def test_login_missing_fields(self):
        res = self.client.post("/login", json={})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("validation_errors", data)

    # -------------------------------------------------------------------------
    # 3. Protected Dashboard Tests
    # -------------------------------------------------------------------------

    def test_dashboard_with_valid_student_token(self):
        self.client.post("/register", json=self.student_data)
        login_res = self.client.post(
            "/login",
            json={
                "email": "sophia.patel@campusconnect.edu",
                "password": "SecurePassword123!",
            },
        )
        token = login_res.get_json()["token"]

        res = self.client.get(
            "/dashboard",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertIn("dashboard", data)
        dash = data["dashboard"]
        self.assertEqual(dash["user"]["name"], "Sophia Patel")
        self.assertEqual(dash["user"]["role"], "student")
        self.assertIn("Welcome back, Sophia Patel!", dash["welcome_message"])
        self.assertIn("view_own_profile", dash["permitted_actions"])
        self.assertIn("view_courses", dash["permitted_actions"])

    def test_dashboard_with_valid_admin_token(self):
        self.client.post("/register", json=self.admin_data)
        login_res = self.client.post(
            "/login",
            json={
                "email": "sarah.jenkins@campusconnect.edu",
                "password": "AdminSecurePassword123!",
            },
        )
        token = login_res.get_json()["token"]

        res = self.client.get(
            "/dashboard",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        dash = data["dashboard"]
        self.assertEqual(dash["user"]["role"], "admin")
        self.assertIn("Administrator Dr. Sarah Jenkins", dash["welcome_message"])
        self.assertIn("manage_events", dash["permitted_actions"])
        self.assertIn("access_admin_panel", dash["permitted_actions"])

    def test_dashboard_without_token(self):
        res = self.client.get("/dashboard")
        self.assertEqual(res.status_code, 401)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("Authorization header missing or malformed", data["error"])

    def test_dashboard_with_invalid_token(self):
        res = self.client.get(
            "/dashboard",
            headers={"Authorization": "Bearer invalid.malformed.token"},
        )
        self.assertEqual(res.status_code, 401)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("Invalid token", data["error"])

    def test_dashboard_with_expired_token(self):
        # Create a token that expired 1 hour ago
        past = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=1)
        expired_payload = {
            "sub": "user-expired",
            "email": "expired@campusconnect.edu",
            "role": "student",
            "iat": past - datetime.timedelta(hours=1),
            "exp": past,
        }
        expired_token = jwt.encode(
            expired_payload, JWT_SECRET, algorithm=JWT_ALGORITHM
        )

        res = self.client.get(
            "/dashboard",
            headers={"Authorization": f"Bearer {expired_token}"},
        )
        self.assertEqual(res.status_code, 401)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("expired", data["error"].lower())

    # -------------------------------------------------------------------------
    # 4. Role-Restricted Admin Events Tests
    # -------------------------------------------------------------------------

    def test_admin_events_forbidden_for_student(self):
        self.client.post("/register", json=self.student_data)
        login_res = self.client.post(
            "/login",
            json={
                "email": "sophia.patel@campusconnect.edu",
                "password": "SecurePassword123!",
            },
        )
        student_token = login_res.get_json()["token"]

        res = self.client.get(
            "/admin/events",
            headers={"Authorization": f"Bearer {student_token}"},
        )
        self.assertEqual(res.status_code, 403)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("Access denied", data["error"])

    def test_admin_events_allowed_for_admin(self):
        self.client.post("/register", json=self.admin_data)
        login_res = self.client.post(
            "/login",
            json={
                "email": "sarah.jenkins@campusconnect.edu",
                "password": "AdminSecurePassword123!",
            },
        )
        admin_token = login_res.get_json()["token"]

        res = self.client.get(
            "/admin/events",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertIn("admin_panel", data)
        self.assertIn("events_summary", data["admin_panel"])

    def test_admin_events_without_token(self):
        res = self.client.get("/admin/events")
        self.assertEqual(res.status_code, 401)

    def test_health_check(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "ok")


if __name__ == "__main__":
    unittest.main()
