# How to Seed Database via Postman

## ✅ Correct Postman Setup

### Method
Select **POST** from the dropdown (not GET)

### URL (IMPORTANT: No "post" prefix!)
```
http://localhost:8000/api/seed
```

**❌ WRONG:**
- `post http://localhost:8000/api/seed` ← Don't include "post"
- `POST http://localhost:8000/api/seed` ← Don't include "POST"

**✅ CORRECT:**
- `http://localhost:8000/api/seed` ← Just the URL

### Headers
Postman will automatically add these, but you can verify:
- `Content-Type: application/json`

### Body
Leave it empty or select "none" - no body required for this endpoint.

### Steps in Postman:
1. Open Postman
2. Create new request
3. Select **POST** from method dropdown
4. Enter URL: `http://localhost:8000/api/seed`
5. Click **Send**
6. Wait for response (may take 2-5 minutes for full seed)

## Expected Response

### Success:
```json
{
  "success": true,
  "message": "Database seeded successfully!",
  "stats": {
    "users": 50,
    "workspaces": 5,
    "teams": 15,
    "projects": 20,
    "tasks": 400
  }
}
```

### Error:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Alternative: Using curl (Command Line)

```bash
curl -X POST http://localhost:8000/api/seed
```

## Alternative: Using PowerShell

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/seed" -Method POST
```

## Troubleshooting

### Error: "Invalid protocol: post http:"
- **Solution**: Remove "post" or "POST" from the URL field in Postman
- The method (POST) is selected from the dropdown, not part of the URL

### Error: "Connection refused"
- **Solution**: Make sure backend server is running:
  ```bash
  cd asana-backend
  npm run dev
  ```

### Error: "500 Internal Server Error"
- This usually means database connection issue
- Check backend console logs for detailed error
- Verify DATABASE_URL in `.env` is correct

### Timeout
- Seeding can take 2-5 minutes
- Increase Postman timeout settings
- Or run seed in smaller batches

