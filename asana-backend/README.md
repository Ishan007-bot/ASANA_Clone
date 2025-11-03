# Asana Clone Backend (Merged)

**Complete backend implementation merging features from both backend implementations.**

## Features

- ✅ **REST API** for all CRUD operations (with 1-2s statistical latency on GET routes)
- ✅ **Socket.io** for real-time updates (create, update, move, delete)
- ✅ **Optimistic UI Support** (tempId matching for instant feedback)
- ✅ **Room-Based** real-time logic (socket.join(projectId))
- ✅ **Prisma ORM** with PostgreSQL (type-safe database access)
- ✅ **JWT Authentication** for secure API access
- ✅ **Modular Route Structure** (auth, users, teams, projects, tasks, comments)

## Tech Stack

- **Node.js** with Express
- **Prisma ORM** for database management
- **PostgreSQL** database
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Database

1. Get your PostgreSQL connection string from Supabase (or use local PostgreSQL)
2. Copy `.env.example` to `.env` (or create `.env` file)
3. Paste your connection string into `DATABASE_URL` in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/asana_clone"
JWT_SECRET="your-secret-key-change-in-production"
CORS_ORIGIN="http://localhost:5173"
PORT=8000
```

### Step 3: Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates all tables)
npm run db:push
```

### Step 4: Seed Database (Optional)

```bash
node temp_seed.js
```

This creates test data. Copy the Project ID it logs for testing.

### Step 5: Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:8000` by default.

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users (`/api/users`)
- `GET /api/users` - Get all users (with search)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Teams (`/api/teams`)
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team details
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:userId` - Remove team member

### Projects (`/api/projects`)
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project with sections and tasks
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks (`/api/tasks`)
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/reorder` - Reorder tasks (drag-and-drop)

### Comments (`/api/comments`)
- `GET /api/comments/task/:taskId` - Get comments for a task
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/reactions` - Add/remove reaction

## Socket.io Events

**Client → Server:**
- `project:join` - Join project room
- `project:leave` - Leave project room
- `task:create` - Create task (with tempId for optimistic UI)
- `task:update` - Update task
- `task:move` - Move/reorder task
- `task:delete` - Delete task

**Server → Client:**
- `task:created` - Task created (includes tempId for optimistic UI)
- `task:updated` - Task updated
- `task:moved` - Task moved
- `task:deleted` - Task deleted
- `error` - Error occurred

## Frontend Integration

Update your frontend `.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=localhost:8000
VITE_USE_API=true
```

## Database Schema

The Prisma schema includes comprehensive models for:
- **Users** - Authentication, profiles, preferences
- **Workspaces** - Top-level organization
- **Teams** - Team management with roles
- **Projects** - Project management
- **Sections** - Task grouping within projects
- **Tasks** - Task management with subtasks
- **Comments** - Task comments with reactions
- **Activity Logs** - Activity tracking

See `prisma/schema.prisma` for full schema details.

## Authentication

All protected routes require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Development Commands

```bash
npm run dev          # Start with auto-reload
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma Client
npm run db:studio    # Open Prisma Studio (database GUI)
```

## Testing

1. Seed the database: `node temp_seed.js`
2. Test REST API: `GET http://localhost:8000/api/projects/:projectId` (should take 1-2 seconds due to statistical latency)
3. Test Socket.io: Connect from frontend and join a project room
4. Test Auth: Register/login to get JWT token

## Migration Notes

This backend merges features from:
- **asana-backend**: Prisma ORM, Socket.io, optimistic UI, statistical latency
- **asana-clone-backend**: Modular routes, JWT auth, teams, comments, better organization

All features are now combined into this single, well-organized backend.
