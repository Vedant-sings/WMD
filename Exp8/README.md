# CampusConnect – Student Academic Management System

**Web and Mobile Application Development — Practical Experiment 8**

---

## 📌 Project Overview & Objective

**CampusConnect** is the ongoing student academic management system built across multiple Web & Mobile Application Development experiments.

**Experiment 8** adds a standalone **Python Flask JWT Authentication Service** that demonstrates secure token-based authentication for CampusConnect students and administrators — without modifying, replacing, or breaking any prior experiment module.

> ⚠️ **Note:** This experiment demonstrates JWT authentication concepts only. It does **not** claim to implement a complete OAuth2 authorization server.

---

## 📁 Folder Structure

```
Exp8/
│
├── auth_service/                              ← Experiment 8 (NEW)
│   ├── app.py                                 # Flask application — all endpoints
│   ├── requirements.txt                       # Python dependencies
│   ├── .env.example                           # Environment variable template
│   ├── .gitignore                             # Excludes .env, venv/, __pycache__/
│   ├── CampusConnect_Auth_Service.postman_collection.json
│   └── README.md                              # Full auth service documentation
│
├── index.html                                 # CampusConnect portal — Exp 1 (unchanged)
├── styles.css                                 # CSS3 stylesheet — Exp 1 (unchanged)
├── db.json                                    # JSON Server data — Exp 1 (unchanged)
└── README.md                                  # This file
```

---

## 🛠️ Technologies Used

### Existing CampusConnect Modules (unchanged)

- **HTML5 + CSS3**: Static academic portal (`index.html`, `styles.css`)
- **JSON** (`db.json`): Static data for students, courses, attendance, grades, notices

### Experiment 8 — Flask Auth Service (new, additive)

- **Python 3.10+**: Language
- **Flask 3.0.3**: Lightweight web framework
- **PyJWT 2.8.0**: JWT token encoding and decoding
- **Werkzeug 3.0.4**: Secure password hashing (pbkdf2:sha256)
- **Flask-CORS 4.0.1**: Cross-origin resource sharing
- **python-dotenv 1.0.1**: Environment variable management
- **Postman**: API testing collection

---

## 🔐 Experiment 8 — Flask JWT Authentication Service

### Endpoint Summary

| Method | Endpoint | Auth | Role | Description |
|:---:|:---|:---:|:---:|:---|
| `POST` | `/register` | ❌ | — | Register student or admin |
| `POST` | `/login` | ❌ | — | Login → receive JWT token |
| `GET` | `/dashboard` | ✅ Bearer | any | Protected dashboard |
| `GET` | `/admin/events` | ✅ Bearer | admin | Admin-only event panel |
| `GET` | `/health` | ❌ | — | Service liveness |

### Quick Start

```cmd
cd auth_service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
rem  → Edit .env and set JWT_SECRET to a strong random string
python app.py
```

Service runs at: **http://127.0.0.1:5050**

> See [`auth_service/README.md`](auth_service/README.md) for the complete documentation including all authentication flows, security properties, and Postman testing guide.

---

## 🌐 Service Coexistence

All modules run on separate ports and do not interfere with each other:

| Module | Port | Experiment |
|:---|:---:|:---|
| CampusConnect HTML Portal | — (file) | Exp 1 |
| JSON Server | 3000 | Exp 1 |
| React App (Vite) | 5173 | Exp 1+ |
| Spring Boot Event API | 8080 | Exp 7 |
| **Flask Auth Service** | **5050** | **Exp 8** |

---

## 🧪 Testing with Postman

1. Import `auth_service/CampusConnect_Auth_Service.postman_collection.json`
2. Run `python app.py` to start the Flask service
3. Follow the recommended testing sequence in [`auth_service/README.md`](auth_service/README.md)

---

## 🔗 Experiment History

| Exp | Module | Technology |
|:---:|:---|:---|
| 1 | CampusConnect HTML Portal | HTML5, CSS3, JSON |
| 7 | Event Management REST API | Spring Boot 3, Java 17, H2 |
| **8** | **JWT Authentication Service** | **Python, Flask, PyJWT, Werkzeug** |
