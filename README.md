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

## 📚 Documentation

This section provides comprehensive documentation covering architecture, data modeling, real-time updates, edge cases, and future enhancements.

### 1. Setup and Run Instructions

See [Quick Start](#-quick-start) section above for detailed setup instructions. Summary:

```bash
# 1. Install dependencies
cd asana-frontend && npm install
cd ../asana-backend && npm install

# 2. Configure environment variables (.env files)

# 3. Setup database
cd asana-backend
npm run db:generate
npm run db:push
npm run seed

# 4. Start servers
npm run dev  # Backend in one terminal
cd ../asana-frontend && npm run dev  # Frontend in another terminal
```

### 2. Architecture and Technology Choices

#### Frontend Architecture

**Why React 19 + TypeScript?**
- **React 19**: Latest React with improved performance, Server Components support, and better concurrent rendering
- **TypeScript**: Type safety prevents runtime errors, improves IDE support, and enhances code maintainability
- **Vite**: Ultra-fast development server with HMR (Hot Module Replacement) for instant feedback
- **Component-based Architecture**: Reusable components (`TaskCard`, `TaskDetail`, `FilterModal`) for maintainability

**State Management:**
- **React Context API**: Global state (`TaskContext`, `ThemeContext`) without external dependencies
- **Context Providers**: Separate providers for API-based (`TaskContextApi`) and local (`TaskContext`) modes
- **Optimistic Updates**: Immediate UI updates before server confirmation for better UX

**Routing:**
- **React Router**: Client-side routing with dynamic routes (`/projects/:id`)
- **Layout Component**: Consistent navigation and sidebar across pages
- **Protected Routes**: Authentication-based route guards (via context)

#### Backend Architecture

**Why Express + Prisma?**
- **Express**: Lightweight, unopinionated framework with extensive middleware ecosystem
- **Prisma ORM**: Type-safe database queries, migrations, and auto-generated TypeScript types
- **PostgreSQL**: Robust relational database with ACID compliance, perfect for complex relationships

**API Design:**
- **RESTful Principles**: Standard HTTP methods (GET, POST, PATCH, DELETE) with semantic URLs
- **Modular Routes**: Separate route files (`auth.js`, `tasks.js`, `projects.js`) for organization
- **Middleware Chain**: Authentication, CORS, JSON parsing, and statistical latency middleware
- **Error Handling**: Centralized error handling with consistent JSON error responses

**Real-time Architecture:**
- **Socket.io**: Bidirectional WebSocket communication for real-time updates
- **Room-based Broadcasting**: Clients join project rooms (`socket.join(projectId)`) for targeted updates
- **Event-driven**: Separate events for `task:create`, `task:update`, `task:move`, `task:delete`

**Why Statistical Latency?**
- Simulates real-world network conditions (1-2s delay on GET routes)
- Tests application resilience and loading states
- Helps identify race conditions in optimistic UI updates

### 3. Data Modeling

#### Entity Relationship Diagram

```
Workspace
  ├── Teams (many)
  │     └── TeamMembers (many Users)
  └── Projects (many)
        ├── ProjectMembers (many Users)
        ├── Sections (many)
        │     └── Tasks (many)
        │           ├── Assignee (User)
        │           ├── Creator (User)
        │           ├── Subtasks (many Tasks)
        │           ├── Comments (many)
        │           │     └── CommentReactions (many)
        │           └── ActivityLogs (many)
```

#### Core Models

**User**
- Central entity with authentication (`passwordHash`, `email`)
- Profile data (`name`, `avatarUrl`, `initials`)
- Preferences (`theme`, `notificationPreferences`)
- Relations: Assigned tasks, created tasks, team memberships, comments

**Workspace**
- Top-level organization container
- Hierarchical: Workspace → Teams → Projects → Sections → Tasks
- Supports multi-tenant architecture

**Team**
- Group of users within a workspace
- Team members have roles (`member`, `admin`, `viewer`)
- Teams can own multiple projects

**Project**
- Container for tasks organized by sections
- View types: `list`, `board`, `timeline`
- Customizable: `color`, `icon`, `description`
- Project members control access

**Section**
- Task organization within projects (e.g., "To Do", "In Progress", "Done")
- Position-based ordering for drag-and-drop
- Kanban board columns are sections

**Task**
- Core entity with rich metadata:
  - **Identity**: `name`, `description`, `id`
  - **State**: `completed`, `completedAt`, `completedBy`
  - **Assignment**: `assigneeId`, `creatorId`
  - **Organization**: `projectId`, `sectionId`, `parentTaskId` (for subtasks)
  - **Metadata**: `priority` (low/medium/high), `tags[]`, `dueDate`, `dueTime`
  - **Ordering**: `position` for sortable lists
- Supports subtasks via self-referential relationship
- Cascading deletes protect data integrity

**Comment**
- Threaded comments on tasks
- Supports parent-child relationships (`parentCommentId`)
- Includes user attribution and timestamps
- Reactions via `CommentReaction` model

**ActivityLog**
- Audit trail for task changes
- Tracks: `actionType` (created, updated, completed, assigned, etc.)
- Stores `actionDetails` as JSON for flexibility
- Enables timeline views and activity feeds

#### Data Relationships

**One-to-Many:**
- Workspace → Teams, Projects
- Team → TeamMembers, Projects
- Project → Sections, Tasks, ProjectMembers
- Section → Tasks
- Task → Subtasks, Comments, ActivityLogs
- Comment → Replies, Reactions

**Many-to-Many:**
- Users ↔ Teams (via TeamMember)
- Users ↔ Projects (via ProjectMember)

**Key Design Decisions:**
1. **Soft References**: Tasks reference sections, but section deletion sets `sectionId` to null (not cascade delete)
2. **Position Ordering**: Tasks use `position` integer for sortable lists/boards
3. **Tags as Arrays**: PostgreSQL array type for flexible tagging without join tables
4. **JSON for Flexibility**: `actionDetails` and `notificationPreferences` use JSON for extensibility
5. **UUID Primary Keys**: All IDs are UUIDs for distributed systems and security

### 4. Real-time Updates, Animations, and UX Decisions

#### Real-time Updates (WebSocket)

**Implementation:**
- **Socket.io Client**: Connects on app initialization
- **Room-based Subscription**: Clients join project rooms when viewing a project
- **Optimistic UI**: Frontend updates immediately, server confirms later
- **tempId Matching**: Temporary IDs for created tasks matched with server-generated IDs

**Events Flow:**
```
User Action → Optimistic Update → WebSocket Event → Server Processing → Broadcast to Room → UI Update
```

**Example: Task Creation**
1. User creates task → UI shows task immediately with `tempId`
2. WebSocket emits `task:create` with `tempId` and task data
3. Server creates task in database
4. Server broadcasts `task:created` to project room with real ID and `tempId`
5. Frontend matches `tempId` and updates with real ID
6. Other clients in room receive update and show new task

**Handling Failures:**
- If WebSocket fails, falls back to REST API
- Optimistic updates rollback on error
- Toast notifications inform users of failures

#### Animations and Transitions

**Drag and Drop (dnd-kit):**
- Smooth transitions when reordering tasks
- Visual feedback during drag (opacity, transform)
- Drop indicators show valid drop zones
- Animations use CSS transforms for performance

**Modal Transitions:**
- Fade-in/fade-out for modal dialogs
- Backdrop blur for focus
- Escape key and click-outside to close

**Loading States:**
- Skeleton loaders for task lists
- Spinner for API calls
- Progressive loading: show data as it arrives

**UX Decisions:**

1. **Dark Theme Default**
   - Reduces eye strain
   - Matches modern tool aesthetics
   - Consistent across all pages

2. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: 480px (mobile), 768px (tablet), 1024px (desktop)
   - Touch-friendly button sizes (min 44px)

3. **Optimistic Updates**
   - Immediate feedback before server response
   - Users feel application is "instant"
   - Reduces perceived latency

4. **Statistical Latency Simulation**
   - 1-2s delay on GET routes simulates production conditions
   - Tests loading states and race conditions
   - Can be disabled for faster development

5. **Keyboard Shortcuts**
   - `Ctrl+K` / `Cmd+K` for quick search
   - `Escape` to close modals
   - Arrow keys for navigation (planned)

6. **Toast Notifications**
   - Non-intrusive success/error messages
   - Auto-dismiss after 3-5 seconds
   - Stacking for multiple notifications

### 5. Edge Cases and Handling

#### Concurrent Edits

**Problem:** Multiple users editing the same task simultaneously

**Solution:**
- **Last-write-wins**: Most recent update takes precedence
- **Real-time Sync**: WebSocket broadcasts updates immediately
- **Optimistic Locking**: (Future) Version numbers could prevent overwrites

**Current Handling:**
- WebSocket events update UI in real-time
- If conflict, latest update from server wins
- No data loss as server is source of truth

#### Task Dependencies

**Problem:** Tasks depend on other tasks (subtasks relationship)

**Current Implementation:**
- Subtasks via `parentTaskId` relationship
- Cascading delete: Deleting parent deletes all subtasks
- Position tracking for ordering

**Edge Cases Handled:**
- ✅ Circular dependencies prevented (subtask cannot be parent of its parent)
- ✅ Deleting task with subtasks shows confirmation (planned)
- ✅ Moving task with subtasks preserves relationship

**Future Enhancement:**
- Predecessor/successor dependencies (Task A must complete before Task B)
- Dependency visualization (Gantt chart, dependency graph)

#### Network Failures

**Problem:** API calls fail due to network issues

**Solution:**
- **Retry Logic**: Automatic retry for failed requests (planned)
- **Fallback**: Graceful degradation to local state
- **Offline Support**: (Future) Service Worker for offline mode
- **Error Boundaries**: React error boundaries catch crashes

**Current Handling:**
- Toast notifications inform users of failures
- UI remains functional with cached data
- Retry button allows manual retry

#### Large Datasets

**Problem:** Loading 1000+ tasks causes performance issues

**Solution:**
- **Pagination**: API supports limit/offset (planned)
- **Virtual Scrolling**: Render only visible items (planned)
- **Lazy Loading**: Load projects/tasks on demand
- **Filtering**: Server-side filtering reduces payload

**Current Handling:**
- Seed script generates ~400 tasks (manageable size)
- Frontend handles up to ~1000 tasks before slowdown
- Future: Implement pagination and infinite scroll

#### Authentication Edge Cases

**Token Expiration:**
- JWT tokens expire after set duration
- Auto-refresh tokens (planned)
- Redirect to login on 401 response

**Multiple Sessions:**
- Same user logged in on multiple devices
- WebSocket connections per session
- Real-time updates sync across devices

#### Database Consistency

**Foreign Key Constraints:**
- Prisma enforces relationships
- Cascading deletes protect referential integrity
- Nullable foreign keys for soft deletes (e.g., `assigneeId` can be null if user deleted)

**Transaction Safety:**
- Prisma transactions for multi-step operations
- Atomic updates prevent partial states

### 6. Future Enhancements

#### AI-Powered Features

**AI Task Suggestions**
- Analyze task descriptions and suggest similar tasks
- Auto-categorize tasks based on content
- Suggest assignees based on workload and skills
- Natural language task creation ("Create task to fix login bug by Friday")

**Smart Prioritization**
- ML model suggests task priority based on:
  - Due dates
  - Project deadlines
  - User workload
  - Historical completion patterns

**Automated Summaries**
- Daily/weekly summaries of completed work
- Project progress insights
- Team productivity metrics

#### Integrations

**Slack Integration**
- Notifications sent to Slack channels
- Create tasks from Slack messages
- Update task status via Slack commands
- Thread Slack messages to task comments

**GitHub Integration**
- Link tasks to GitHub issues/PRs
- Auto-create tasks from issue labels
- Track code changes related to tasks
- Show commit history in task detail

**Email Integration**
- Email notifications for task assignments
- Create tasks from emails
- Email digest of daily tasks

**Calendar Integration**
- Sync due dates to Google Calendar/Outlook
- Show tasks in calendar view
- Schedule meetings from tasks

#### Advanced Features

**Advanced Reports & Analytics**
- Custom dashboards with widgets
- Burndown charts for projects
- Velocity tracking for teams
- Time tracking and estimates vs. actuals
- Resource allocation visualization

**Custom Fields**
- Define custom fields per project (e.g., "Story Points", "Customer")
- Custom field types: text, number, date, dropdown, checkbox
- Bulk edit custom fields

**Automation Rules**
- If-this-then-that workflows
- Auto-assign tasks based on rules
- Auto-move tasks between sections on completion
- Scheduled task creation (recurring tasks)

**Advanced Permissions**
- Role-based access control (RBAC)
- Fine-grained permissions (view, edit, delete)
- Project templates with permission presets
- Guest access with limited permissions

**Enhanced Collaboration**
- @mentions in comments with notifications
- File attachments to tasks
- Video/audio comments
- Screen sharing during task discussion
- Collaborative editing of task descriptions

**Mobile Apps**
- Native iOS and Android apps
- Offline mode with sync
- Push notifications
- Camera integration for task photos

**API Enhancements**
- GraphQL API option
- Webhook support for integrations
- API rate limiting
- OAuth2 for third-party apps

**Performance Optimizations**
- Server-side rendering (SSR) for faster initial load
- Code splitting and lazy loading
- CDN for static assets
- Database query optimization and indexing
- Redis caching for frequently accessed data

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
