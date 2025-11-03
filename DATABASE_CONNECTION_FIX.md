# Database Connection Fix Guide

## Current Issue
Prisma can't connect to Supabase database: `Can't reach database server`

## Solutions (Try in Order)

### Solution 1: Check Supabase Database Status
1. Go to **Supabase Dashboard** → Your Project
2. Check if database shows **"Paused"** or **"Active"**
3. If paused, click **"Restore"** or **"Resume"**
4. Wait 1-2 minutes for database to wake up
5. Try the seed request again

### Solution 2: Verify Connection String Format
Your `.env` DATABASE_URL should be:
```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?schema=public&sslmode=require"
```

**Important:**
- Must use port **5432** (direct connection, not 6543 pooler)
- Must end with `?schema=public&sslmode=require`
- If password has special characters (@, #, %), URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`

### Solution 3: Get Fresh Connection String from Supabase
1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Click **"URI"** tab (NOT "Connection pooling")
4. Copy the exact string shown
5. Make sure it has:
   - Port: `:5432`
   - Ends with: `/postgres` (not `/postgres?pgbouncer=true`)
6. Add `?schema=public&sslmode=require` if not present
7. Update your `.env` file with this exact string

### Solution 4: Check IP Restrictions
1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Check **"Connection pooling"** or **"Network restrictions"**
3. If IP restrictions are enabled:
   - Either disable them (for development)
   - Or add your current IP address to allowed list

### Solution 5: Use Connection Pooling (Alternative)
If direct connection fails, try the Session mode pooler:

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Find **"Connection pooling"** section
3. Copy **"Session mode"** connection string
4. It should look like:
   ```
   postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?pgbouncer=true
   ```
5. Update `.env` with this string
6. Remove `pgbouncer=true` and add `?schema=public&sslmode=require` instead

### Solution 6: Test Connection Manually
Run this to test if connection works:
```bash
cd asana-backend
node test-connection.js
```

If this fails, the issue is with the connection string itself.

## Quick Checklist

- [ ] Supabase database is **Active** (not paused)
- [ ] Connection string uses port **5432** (not 6543)
- [ ] Connection string ends with `?schema=public&sslmode=require`
- [ ] Password special characters are URL-encoded
- [ ] No IP restrictions blocking your connection
- [ ] Connection string is copied directly from Supabase dashboard

## After Fixing

Once connection works:
1. Restart the backend server:
   ```bash
   cd asana-backend
   # Stop current server (Ctrl+C or kill process)
   npm run dev
   ```

2. Try seed again:
   ```bash
   POST http://localhost:8000/api/seed
   ```

## Still Not Working?

If none of the above work:
1. Check Supabase project status (not suspended/paused)
2. Verify database credentials are correct
3. Try creating a new Supabase project and migrate
4. Check if your network/firewall allows PostgreSQL connections (port 5432)

