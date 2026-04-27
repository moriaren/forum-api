# 🚀 Forum API

RESTful API untuk aplikasi forum diskusi yang dibangun menggunakan **Node.js**, **Express.js**, dan **PostgreSQL**. API ini mendukung fitur thread, komentar, balasan, serta sistem like/unlike komentar.

---

## 🌐 Live Demo

**Base URL (HTTPS):**

```
https://forum-api.cloud
```

---

## 📌 Fitur Utama

* ✅ Autentikasi JWT (Login & Register)
* ✅ Membuat Thread
* ✅ Menambahkan Komentar
* ✅ Membalas Komentar
* ✅ Hapus Komentar & Balasan (soft delete)
* ✅ Like & Unlike Komentar
* ✅ Menampilkan Detail Thread (nested comment & reply)
* ✅ Like Count pada komentar

---

## 🏗️ Arsitektur

Project ini menggunakan pendekatan:

* Clean Architecture
* Separation of Concerns
* Layered Structure (Domain, Application, Infrastructure, Interface)

```
src/
├── Domains/
├── Applications/
├── Infrastructures/
├── Interfaces/
└── Commons/
```

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* PostgreSQL
* JWT (Authentication)
* Bcrypt (Password Hashing)
* Vitest (Testing)
* PM2 (Process Manager)
* NGINX (Reverse Proxy)
* GitHub Actions (CI/CD)

---

## ⚙️ Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/moriaren/forum-api.git
cd forum-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Buat file `.env`

```env
PORT=5000
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=yourpassword
PGDATABASE=forum_api
PGPORT=5432
ACCESS_TOKEN_KEY=youraccesstoken
REFRESH_TOKEN_KEY=yourrefreshtoken
```

### 4. Jalankan Migration

```bash
npm run migrate up
```

### 5. Run Server

```bash
npm run start
```

---

## 🧪 Testing

Menjalankan seluruh test:

```bash
npm run test
```

Testing mencakup:

* Unit Test
* Integration Test
* Endpoint Test

---

## 🔄 CI/CD

Pipeline otomatis menggunakan **GitHub Actions**:

* Run test saat push
* Deploy ke VPS via SSH
* Pull update dari repository
* Restart server menggunakan PM2

---

## 🌍 Deployment

Aplikasi di-deploy menggunakan:

* VPS (Linux)
* NGINX sebagai reverse proxy
* HTTPS (SSL)
* PM2 untuk menjaga uptime

---

## 📮 Endpoint Utama

### 🔐 Auth

* `POST /users`
* `POST /authentications`

### 🧵 Threads

* `POST /threads`
* `GET /threads/{threadId}`

### 💬 Comments

* `POST /threads/{threadId}/comments`
* `DELETE /threads/{threadId}/comments/{commentId}`

### 🔁 Replies

* `POST /threads/{threadId}/comments/{commentId}/replies`
* `DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}`

### ❤️ Likes

* `PUT /threads/{threadId}/comments/{commentId}/likes`

---

