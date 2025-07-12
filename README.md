# 📚 StackIt – Minimal Q\&A Forum Platform

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Django](https://img.shields.io/badge/django-4.2+-success)

---

## 🚀 Overview

**StackIt** is a lightweight question-and-answer forum platform built for collaborative learning and structured knowledge sharing.

* 🐍 **Backend:** Django + Django REST Framework (DRF)
* 🔒 **Authentication:** DRF Token
* 🌐 **Frontend:** HTML, CSS, JavaScript (fetch calls to DRF APIs)

---

## 🔥 Features

✅ User registration & token-based login
✅ Update user profile (bio, phone, image)
✅ Create, view, answer, vote on questions (planned)
✅ Notifications on answers & mentions (planned)
✅ Admin panel for moderation

---

## 🔌 API Endpoints

### 🔒 Auth & Users

| Endpoint           | Method | Description       |
| ------------------ | ------ | ----------------- |
| `/api/register/`   | POST   | Register new user |
| `/api-token-auth/` | POST   | Obtain auth token |
| `/api/users/`      | GET    | List users (auth) |

### 👤 Profiles

\| `/api/profiles/`           | GET    | Get your profile info   |
\| `/api/profiles/{id}/`      | PUT    | Update your profile     |

### 📝 Example headers

```
Authorization: Token <your-token-here>
Content-Type: application/json
```

---

## ⚡ Quick Postman Tests

### ✅ Register user

```
POST /api/register/
{
  "username": "darsh",
  "email": "darsh@example.com",
  "password": "securepassword123"
}
```

### ✅ Get token

```
POST /api-token-auth/
{
  "username": "darsh",
  "password": "securepassword123"
}
```

Response:

```json
{"token": "36be493bdc534b4a86d1182d37..."}
```

### ✅ List users

```
GET /api/users/
Headers:
Authorization: Token <your-token>
```

---

## 🛠 Tech Stack

* **Backend:** Django 4.2+, Django REST Framework
* **Auth:** DRF Token Authentication
* **Database:** SQLite (default), easily switch to Postgres/MySQL
* **Frontend:** Vanilla HTML, CSS, JavaScript (Fetch API)

---

## 🚀 Future Roadmap

* ✅ Users & Profiles API
* 🚀 Rich text editor for questions/answers
* 🚀 Tag-based filtering
* 🚀 Voting & accepting answers
* 🚀 Notifications (via REST & WebSockets)
* 🚀 Docker deployment

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Pull requests welcome! If you want to collaborate, please fork the repo and submit a PR.

---

## ✨ Authors

**Darsh & Team**

> Made with ❤️ for collaborative learning.
