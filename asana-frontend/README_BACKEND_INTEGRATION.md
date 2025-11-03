# Backend Integration Guide

## ✅ What Has Been Fixed

### 1. Frontend API Configuration
- **Updated API URL**: Changed from `http://localhost:5000/api` to `http://localhost:8000/api`
- **Updated WebSocket URL**: Changed from `localhost:5000` to `localhost:8000`
- **Files Updated**:
  - `src/services/api.ts` - API base URL now points to port 8000
  - `src/services/websocket.ts` - WebSocket URL now points to port 8000

### 2. Backend Server
- **Port**: Running on `http://localhost:8000`
- **Health Check**: `http://localhost:8000/api/health`
- **Root Endpoint**: `http://localhost:8000/` - Shows all available endpoints

### 3. Seeding Options
Two methods to seed the database:

#### Option A: Direct Prisma Seed (if database connection works)
```bash
cd asana-backend
npm run seed
```

#### Option B: API Endpoint Seed (recommended if direct Prisma fails)
```bash
# Make sure backend is running, then:
curl -X POST http://localhost:8000/api/seed
# Or use Postman/Insomnia to POST to http://localhost:8000/api/seed
```

The API seed endpoint will:
- Wipe existing data
- Create 50 users
- Create 5 workspaces
- Create ~15 teams
- Create 20 projects with realistic data
- Create ~300-400 tasks
- Create ~1000+ comments

## 📋 Environment Variables

### Frontend (.env)
Create `asana-clone/.env` file with:
```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=localhost:8000
VITE_USE_API=true
```

### Backend (.env)
Ensure `asana-backend/.env` has:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?schema=public&sslmode=require"
PORT=8000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key
```

## 🚀 Quick Start

1. **Start Backend**:
   ```bash
   cd asana-backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd asana-clone
   npm run dev
   ```

3. **Seed Database** (choose one):
   - Direct: `npm run seed` (in asana-backend)
   - Via API: `POST http://localhost:8000/api/seed`

## 🔍 Available Endpoints

- `GET /` - API information
- `GET /api/health` - Health check
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/users` - Get users (requires auth)
- `GET /api/projects` - Get projects (requires auth)
- `GET /api/tasks` - Get tasks (requires auth)
- `POST /api/seed` - Seed database (no auth required)

## ⚠️ Database Connection Issues

If you're having trouble connecting to Supabase:

1. **Check Database Status**: Ensure your Supabase database is active (not paused)
2. **Connection String**: Verify it ends with `?schema=public&sslmode=require`
3. **IP Restrictions**: Check Supabase settings for any IP restrictions
4. **Use API Seed**: If direct Prisma connection fails, use the API seed endpoint instead

## 🎯 Next Steps

1. Ensure backend is running on port 8000
2. Create frontend `.env` file with correct API URL
3. Seed the database (via API endpoint if direct Prisma fails)
4. Test the frontend connection to backend
5. Verify all features are working

