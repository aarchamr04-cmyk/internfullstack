# TaskFlow — Full Stack Task Manager

A full-stack task management application built with **React**, **Node.js**, **Express**, and **MongoDB**.

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | *(add Vercel URL after deploy)* |
| **Backend API** | *(add Render URL after deploy)* |

---

## ✨ Features

- 🔐 **Authentication** — Register & Login with JWT tokens
- 📝 **Task CRUD** — Create, Read, Update, Delete tasks
- 🏷️ **Priority Levels** — High, Medium, Low with visual badges
- 📅 **Due Dates** — Calendar date picker per task
- ✅ **Status Toggle** — Mark tasks complete/pending inline
- 🔍 **Search & Filter** — Filter by All / Pending / Completed / High Priority
- 🌅 **Sunset UI** — Glassmorphism auth pages, dark dashboard, animated blobs
- 🔒 **Protected Routes** — Dashboard & Tasks require login

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| React Router v6 | Client-side routing |
| Vite | Build tool & dev server |
| Vanilla CSS | Styling (glassmorphism + dark mode) |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment config |
| cors | Cross-origin requests |

---

## 📁 Project Structure

```
intern fullstack/
├── backend/                  # Express REST API
│   ├── controllers/          # Route handler logic
│   ├── middleware/           # Auth middleware (JWT verify)
│   ├── models/               # Mongoose schemas (User, Task)
│   ├── Routes/               # Express route definitions
│   ├── .env.example          # Environment variable template
│   └── server.js             # App entry point
│
└── frontend/                 # React SPA
    ├── src/
    │   ├── context/          # AuthContext + useAuth hook
    │   ├── pages/            # Login, Register, Dashboard pages
    │   ├── api.js            # Base URL helper (VITE_API_URL)
    │   ├── App.jsx           # Tasks page (protected)
    │   ├── AddTask.jsx       # Add task modal
    │   └── EditTaskModal.jsx # Edit/delete task modal
    ├── vercel.json           # Vercel SPA routing config
    └── vite.config.js        # Dev proxy → localhost:5000
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/taskflow-backend.git
git clone https://github.com/YOUR_USERNAME/taskflow-frontend.git
```

### 2. Backend setup

```bash
cd taskflow-backend
npm install

# Create your .env file
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, PORT
```

Edit `.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskflow
JWT_SECRET=your_super_secret_key_min_32_chars
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev       # starts on http://localhost:5000
```

### 3. Frontend setup

```bash
cd taskflow-frontend
npm install
# No .env needed for local dev (Vite proxies /api → localhost:5000)
npm run dev       # starts on http://localhost:5173
```

---

## 🚀 Deployment

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your backend repo
4. Set **Build Command**: `npm install`  
   Set **Start Command**: `npm start`
5. Add environment variables:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — random secret (32+ chars)
   - `CLIENT_URL` — your Vercel frontend URL
6. Deploy → copy the `https://your-app.onrender.com` URL

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import repo
3. Framework preset: **Vite**
4. Add environment variable:
   - `VITE_API_URL` = `https://your-app.onrender.com`
5. Deploy → your app is live!

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Body |
|--------|----------|--------|------|
| `POST` | `/api/auth/register` | Public | `{ name, email, password }` |
| `POST` | `/api/auth/login` | Public | `{ email, password }` |

### Tasks *(all require `Authorization: Bearer <token>`)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks for user |
| `POST` | `/api/tasks` | Create new task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

---

## 🧪 Testing the Live App

1. Visit the live frontend URL
2. Click **Create one free** → fill in name, email, password → **Create Account**
3. You are redirected to the Dashboard
4. Click **Go to Tasks → New Task**
5. Fill in title, description, priority, due date → **Create Task**
6. The task appears in the list — try editing, completing, and deleting it
7. Click **Sign out** → login again with the same credentials ✅

---

## 👩‍💻 Author

Built as a full-stack internship project.
