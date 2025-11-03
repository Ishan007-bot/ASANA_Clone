# Docker Quick Start Guide

## What is Docker?

**Docker** packages your application into a container - a lightweight, portable environment that includes:
- Your application code
- Dependencies (Node.js, libraries, etc.)
- Runtime environment
- Configuration

**Think of it like:** A shipping container that works the same way on any ship (Windows, Mac, Linux, servers).

## Why Use Docker?

✅ **One Command to Start Everything**: `docker-compose up -d`  
✅ **No Manual Setup**: No need to install Node.js, PostgreSQL, npm packages  
✅ **Consistent Environment**: Works the same on any computer  
✅ **Perfect for Submissions**: Reviewers can run your app immediately  
✅ **Isolated**: Doesn't affect your system's existing software

## Is Docker Required?

- **Not strictly required** - You can run the app without Docker (see main README)
- **Highly recommended** - Makes everything easier
- **Perfect for submissions** - Ensures reviewers can test your app

## Quick Start with Docker

### Step 1: Install Docker Desktop

- **Windows/Mac**: Download from https://www.docker.com/products/docker-desktop/
- **Linux**: Install Docker Engine

### Step 2: Start Everything

```bash
# From project root directory
docker-compose up -d
```

That's it! 🎉

### Step 3: Seed Database

After containers are running, seed the database:

```bash
# Option 1: Via API (recommended)
curl -X POST http://localhost:8000/api/seed

# Option 2: Or use Postman
# POST http://localhost:8000/api/seed
```

### Step 4: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Health**: http://localhost:8000/api/health

## What Gets Started?

1. **PostgreSQL Database** - Runs on port 5432
2. **Backend API** - Runs on port 8000, connects to database
3. **Frontend** - Runs on port 3000, served via Nginx

## Useful Commands

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Remove everything including database
docker-compose down -v
```

## Troubleshooting

**Port already in use?**
- Change ports in `docker-compose.yml` or stop conflicting services

**Container won't start?**
- Check logs: `docker-compose logs backend`
- Rebuild: `docker-compose build --no-cache`

**Database connection failed?**
- Wait a few seconds for PostgreSQL to be ready
- Check: `docker-compose ps` (all services should be "Up")

---

For detailed Docker documentation, see the main [README.md](README.md#-docker-setup).

