# Railway Configuration Guide

## Important: Railway Service Settings

Railway needs to be configured via the **dashboard**, not just the TOML files. Here's what you need to set:

### Backend Service Configuration

**In Railway Dashboard → Service Settings:**

1. **Root Directory**: `backend`
   - This tells Railway to use `backend/` as the build context
   - The Dockerfile will then find `package.json` correctly

2. **Watch Paths**: `backend/**`
   - Only rebuild when backend files change

3. **Environment Variables:**
   - `PORT` = `3000`
   - `NODE_ENV` = `production`

### Frontend Service Configuration

**In Railway Dashboard → Service Settings:**

1. **Root Directory**: `frontend`
   - This tells Railway to use `frontend/` as the build context
   - The Dockerfile will then find all frontend files correctly

2. **Watch Paths**: `frontend/**`
   - Only rebuild when frontend files change

3. **Environment Variables:**
   - `API_URL` = `https://your-backend-url.up.railway.app`
   - `WS_URL` = `wss://your-backend-url.up.railway.app`

---

## Why This Matters

Railway's build process works like this:

```
1. Railway clones your repo
2. Railway changes to the "Root Directory" you specified
3. Railway runs: docker build -f Dockerfile .
4. The Dockerfile's COPY commands now work relative to that directory
```

**Without setting Root Directory:**
- Build context = repository root
- `COPY package*.json ./` looks for `/package.json` ❌ (doesn't exist)

**With Root Directory = "backend":**
- Build context = `/backend/`
- `COPY package*.json ./` looks for `/backend/package.json` ✅ (exists!)

---

## Step-by-Step Deployment

### 1. Push Changes to GitHub

```bash
git add .
git commit -m "Fix Railway configuration for monorepo"
git push origin main
```

### 2. Deploy Backend

1. **Railway Dashboard** → New Project → Deploy from GitHub
2. Select `exp360` repository
3. **Important Settings:**
   - Service Name: `exp360-backend`
   - **Root Directory**: `backend` ⚠️ CRITICAL
   - Dockerfile Path: `Dockerfile` (relative to root directory)
4. Add environment variables (PORT, NODE_ENV)
5. Deploy
6. **Copy the public URL** (e.g., `https://exp360-backend-production.up.railway.app`)

### 3. Deploy Frontend

1. Same Railway project → **New Service**
2. Select `exp360` repository again
3. **Important Settings:**
   - Service Name: `exp360-frontend`
   - **Root Directory**: `frontend` ⚠️ CRITICAL
   - Dockerfile Path: `Dockerfile` (relative to root directory)
4. Add environment variables:
   - `API_URL` = `https://[your-backend-url]`
   - `WS_URL` = `wss://[your-backend-url]` (note: wss not ws)
5. Deploy
6. Open the frontend URL and test!

---

## Troubleshooting

### "Could not read package.json"
- **Cause**: Root Directory not set in Railway dashboard
- **Solution**: Set Root Directory to `backend` or `frontend` in service settings

### "File not found: nginx.conf"
- **Cause**: Root Directory not set for frontend service
- **Solution**: Set Root Directory to `frontend` in service settings

### Frontend can't connect to backend
- **Cause**: Wrong API_URL or WS_URL
- **Solution**: 
  - Check environment variables in Railway dashboard
  - Ensure using `https://` and `wss://` (not http/ws)
  - Verify backend URL is correct

---

## Quick Reference

| Setting | Backend | Frontend |
|---------|---------|----------|
| Root Directory | `backend` | `frontend` |
| Dockerfile Path | `Dockerfile` | `Dockerfile` |
| Watch Paths | `backend/**` | `frontend/**` |
| Port | 3000 | 80 |
| Health Check | `/health` | `/` |

**Remember**: The Root Directory setting is in the Railway dashboard, not in the TOML file!
