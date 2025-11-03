# Asana Clone - Full Stack Application

A high-fidelity Asana clone built with React (TypeScript) frontend and Node.js/Express backend, designed for reinforcement learning environment training.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Database Configuration](#database-configuration)
- [Seeding Database](#seeding-database)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [RL Environment Readiness](#rl-environment-readiness)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This is a complete Asana clone with:
- **Frontend**: React + TypeScript + Vite (modern, responsive UI)
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Real-time**: Socket.io for WebSocket support
- **Authentication**: JWT-based authentication
- **High-Fidelity Data**: Comprehensive seed script for realistic training data

Perfect for:
- ✅ Production-ready task management
- ✅ Reinforcement learning model training
- ✅ Real-time collaboration
- ✅ Full CRUD operations

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Navigation
- **date-fns** - Date formatting
- **@dnd-kit** - Drag and drop
- **React Calendar** - Calendar views

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database (Supabase recommended)
- **Socket.io** - Real-time WebSocket
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **@faker-js/faker** - Data generation

---

## 📁 Project Structure

```
new scrapper/
├── asana-clone/          # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── hooks/        # Custom hooks
│   ├── public/           # Static assets
│   └── package.json
│
└── asana-backend/        # Backend Node.js application
    ├── src/
    │   ├── routes/       # API route handlers
    │   ├── middleware/   # Express middleware
    │   └── utils/        # Utility functions
    ├── prisma/
    │   └── schema.prisma # Database schema
    ├── seed.js          # Database seeding script
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Git

### 1. Clone & Install

```bash
# Navigate to project root
cd "new scrapper"

# Install frontend dependencies
cd asana-clone
npm install

# Install backend dependencies
cd ../asana-backend
npm install
```

### 2. Configure Environment

**Frontend** (create `asana-clone/.env`):
```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=localhost:8000
VITE_USE_API=true
```

**Backend** (create `asana-backend/.env`):
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?schema=public&sslmode=require"
PORT=8000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Setup Database

```bash
cd asana-backend

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database (optional but recommended)
npm run seed
# OR via API: POST http://localhost:8000/api/seed
```

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd asana-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd asana-clone
npm run dev
```

### 5. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Health**: http://localhost:8000/api/health

---

## 🎨 Frontend Setup

### Pages Available
- `/login` - Login page
- `/login-password` - Password entry
- `/home` - Dashboard with "My week" and "My month" views
- `/my-tasks` - Personal task management (List/Board/Timeline views)
- `/projects` - Browse all projects
- `/projects/:id` - Project detail with tasks
- `/goals` - Goals management (Strategy, Team goals, My goals)
- `/portfolios` - Portfolio management
- `/reporting` - Reports and analytics
- `/inbox` - Notification inbox
- `/search` - Global search
- `/profile` - User profile
- `/new-project` - Create new project

### Key Features
- ✅ **Responsive Design** - Mobile, tablet, desktop support
- ✅ **Dark Theme** - Consistent dark UI across all pages
- ✅ **Modals** - Filter, Sort, Share, Options, Create modals
- ✅ **Real-time Updates** - WebSocket integration
- ✅ **Drag & Drop** - Task reordering (dnd-kit)
- ✅ **Multiple Views** - List, Board, Timeline, Calendar

### Frontend Scripts

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## ⚙️ Backend Setup

### API Architecture
- **REST API** - Standard CRUD endpoints
- **WebSocket** - Real-time task updates
- **JWT Auth** - Secure authentication
- **Statistical Latency** - 1-2s delay on GET routes (simulates real-world)

### Backend Scripts

```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio (database GUI)
npm run seed         # Seed database with high-fidelity data
```

---

## 🗄 Database Configuration

### Using Supabase (Recommended)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Wait for database to initialize

2. **Get Connection String**
   - Settings → Database → Connection string
   - Select **"URI"** tab (not Connection pooling)
   - Copy the connection string
   - Format: `postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

3. **Add to .env**
   ```env
   DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres?schema=public&sslmode=require"
   ```

4. **Important Notes**
   - Use port **5432** (direct connection)
   - Add `?schema=public&sslmode=require` at the end
   - URL-encode special characters in password:
     - `@` → `%40`
     - `#` → `%23`
     - `%` → `%25`

### Database Schema

The Prisma schema includes:
- **Users** - User accounts with authentication
- **Workspaces** - Top-level organization containers
- **Teams** - Team structures within workspaces
- **Projects** - Project containers with sections
- **Sections** - Task organization (e.g., "To Do", "In Progress")
- **Tasks** - Individual tasks with assignments, priorities, due dates
- **Comments** - Task comments with threading
- **CommentReactions** - Emoji reactions on comments
- **ActivityLog** - Task activity tracking

---

## 🌱 Seeding Database

### Option 1: Direct Prisma Seed (Recommended if connection works)

```bash
cd asana-backend
npm run seed
```

### Option 2: Via API Endpoint (If direct Prisma fails)

**Using Postman:**
1. Method: `POST`
2. URL: `http://localhost:8000/api/seed`
3. Body: None
4. Send

**Using curl:**
```bash
curl -X POST http://localhost:8000/api/seed
```

**Using PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/seed" -Method POST
```

### Seed Data Generated

The seed script creates:
- **50 users** - Realistic user profiles
- **5 workspaces** - Organization containers
- **~15 teams** - Team structures
- **20 projects** - Mix of Engineering & Marketing workflows
- **~400 tasks** - Realistic task names and descriptions
- **~1000 comments** - Natural conversation threads
- **Activity logs** - Task lifecycle tracking
- **Comment reactions** - Engagement data

This provides **high-fidelity data** perfect for RL training!

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (with search)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team details
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:userId` - Remove team member

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project with sections and tasks
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/reorder` - Reorder tasks

### Comments
- `GET /api/comments/task/:taskId` - Get comments for a task
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/reactions` - Add/remove reaction

### Utilities
- `GET /` - API information
- `GET /api/health` - Health check
- `POST /api/seed` - Seed database (development only)

---

## 🎮 Features

### Frontend Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark theme throughout
- ✅ Multiple view types (List, Board, Timeline, Calendar)
- ✅ Drag and drop task reordering
- ✅ Real-time updates via WebSocket
- ✅ Modal dialogs for actions
- ✅ Task filtering and sorting
- ✅ Goal management (Strategy map, Team goals, My goals)
- ✅ Project management
- ✅ Portfolio management
- ✅ Reporting dashboard
- ✅ User authentication
- ✅ Search functionality

### Backend Features
- ✅ RESTful API with full CRUD operations
- ✅ Real-time WebSocket updates (Socket.io)
- ✅ JWT authentication
- ✅ Statistical latency (1-2s on GET routes)
- ✅ Optimistic UI support (tempId matching)
- ✅ Room-based real-time logic
- ✅ Comprehensive data models
- ✅ Activity logging
- ✅ Comment threading and reactions

---

## 🔐 Environment Variables

### Frontend (.env in `asana-clone/`)

```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=localhost:8000
VITE_USE_API=true
```

### Backend (.env in `asana-backend/`)

```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?schema=public&sslmode=require"

# Server
PORT=8000
CORS_ORIGIN=http://localhost:5173

# Authentication
JWT_SECRET=your-secret-key-change-in-production
```

---

## 💻 Development

### Running in Development Mode

**Backend:**
```bash
cd asana-backend
npm run dev  # Uses nodemon for auto-reload
```

**Frontend:**
```bash
cd asana-clone
npm run dev  # Vite dev server with HMR
```

### Building for Production

**Frontend:**
```bash
cd asana-clone
npm run build
# Output in dist/ folder
```

**Backend:**
```bash
cd asana-backend
npm start  # Production mode
```

### Database Management

```bash
cd asana-backend

# View database in GUI
npm run db:studio

# Generate Prisma Client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push
```

---

## 🤖 RL Environment Readiness

### Ready for Reinforcement Learning Training

**Data Fidelity:**
- ✅ 50 diverse users
- ✅ 20 projects (Engineering & Marketing workflows)
- ✅ ~400 tasks with realistic states
- ✅ ~1000 comments for conversation data
- ✅ Activity logs for task lifecycles
- ✅ Varied priorities, due dates, tags

**State Space:**
- Task properties (priority, due date, assignee, status)
- Project context (sections, progress, team composition)
- User workload and availability
- Task dependencies and relationships

**Action Space:**
- Create/update/delete tasks
- Assign/reassign tasks
- Move tasks between sections
- Set priorities and due dates
- Add comments and reactions

**Reward Signals:**
- Task completion rate
- On-time completion (due date adherence)
- Team collaboration (comments, reactions)
- Project progress
- User workload balance

**Episode Structure:**
- Episode = Project lifecycle
- Reset = New project with initial tasks
- Terminal state = All tasks completed

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
1. Check Supabase dashboard - ensure database is **Active** (not paused)
2. Verify connection string format (port 5432, SSL enabled)
3. Check IP restrictions in Supabase settings
4. Ensure password special characters are URL-encoded

**Error: "Authentication failed"**
- Verify username and password in connection string
- Check Supabase credentials

### Frontend Can't Connect to Backend

**Error: "Failed to fetch"**
1. Ensure backend is running on port 8000
2. Check `VITE_API_URL` in frontend `.env`
3. Verify CORS settings in backend
4. Check browser console for detailed errors

### Seed Script Fails

**Option 1:** Fix database connection (see above)
**Option 2:** Use API endpoint instead: `POST http://localhost:8000/api/seed`

### Port Already in Use

```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 8000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

---

## 📚 Additional Resources

- **Frontend Integration Guide**: See `README_BACKEND_INTEGRATION.md`
- **Database Connection Fix**: See `DATABASE_CONNECTION_FIX.md`
- **RL Environment Details**: See `RL_ENVIRONMENT_READINESS.md`
- **Postman Seed Instructions**: See `POSTMAN_SEED_INSTRUCTIONS.md`

---

## 📝 License

ISC

---

## 🤝 Contributing

This is a learning/training project. Feel free to fork and modify for your needs.

---

## 📧 Support

For issues or questions:
1. Check troubleshooting section above
2. Review error logs in console
3. Verify environment variables
4. Ensure all dependencies are installed

---

**Happy Coding! 🚀**
