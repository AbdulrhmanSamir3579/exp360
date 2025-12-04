# Railway Deployment Guide for exp360

## Quick Answer: NO, you don't need to build locally! 🚀

Railway will automatically build both projects using the Dockerfiles when you deploy. The Docker build process handles everything.

---

## How Railway Deployment Works

1. **You push code to GitHub** (no local build needed)
2. **Railway pulls your code** from the repository
3. **Railway runs Docker build** using the Dockerfiles
4. **Docker builds your projects** inside containers
5. **Railway deploys** the built containers

---

## Step-by-Step Railway Deployment

### 1. Commit and Push Your Changes

```bash
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

### 2. Create Two Railway Services

#### Service 1: Backend

1. Go to Railway dashboard → **New Project** → **Deploy from GitHub repo**
2. Select your `exp360` repository
3. Railway will detect the Dockerfile automatically
4. **Configure the service:**
   - **Name**: `exp360-backend`
   - **Root Directory**: Leave empty (Dockerfile handles paths)
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Start Command**: `node dist/server.js` (optional, Dockerfile has this)

5. **Add Environment Variables:**
   - `PORT` = `3000`
   - `NODE_ENV` = `production`

6. **Generate Domain**: Railway will give you a public URL like `https://exp360-backend-production.up.railway.app`

#### Service 2: Frontend

1. In the same Railway project → **New Service** → **Deploy from GitHub repo**
2. Select the same `exp360` repository
3. **Configure the service:**
   - **Name**: `exp360-frontend`
   - **Root Directory**: Leave empty (Dockerfile handles paths)
   - **Dockerfile Path**: `frontend/Dockerfile`

4. **Add Environment Variables:**
   - `API_URL` = `https://your-backend-url.up.railway.app` (use the backend URL from step 1)
   - `WS_URL` = `wss://your-backend-url.up.railway.app` (note: wss not ws for HTTPS)

5. **Generate Domain**: Railway will give you a public URL for the frontend

### 3. Update Frontend Configuration

After you get the backend URL, you need to inject it into the frontend. Railway doesn't support build-time env vars for static files easily, so we'll use a different approach:

**Option A: Use Railway's Internal Networking (Recommended)**

If both services are in the same Railway project, they can communicate via internal URLs:
- Backend internal URL: `exp360-backend.railway.internal:3000`
- But the frontend runs in the browser, so it needs the public URL

**Option B: Rebuild with correct URL**

After getting the backend URL, you can set it as an environment variable in Railway's frontend service, but since it's a static build, you'll need to use a startup script.

---

## Alternative: Use Nginx Environment Variable Substitution

I'll create a startup script that injects the environment variables into your built files at runtime.

### Create Startup Script for Frontend

This script will run when the container starts and replace the placeholder URLs with actual Railway URLs.

---

## What Happens During Deployment

### Backend Build Process:
```
1. Railway pulls code
2. Docker builds: npm install → npm run build (TypeScript → JavaScript)
3. Creates production image with only dist/ and production dependencies
4. Starts: node dist/server.js
```

### Frontend Build Process:
```
1. Railway pulls code
2. Docker builds: npm ci → ng build (Angular → static HTML/CSS/JS)
3. Copies built files to Nginx
4. Starts: nginx serving static files
```

---

## Important Notes

- ✅ **No local build needed** - Railway does it all
- ✅ **Dockerfiles handle the build** - npm install, npm run build, etc.
- ⚠️ **You need the backend URL** before the frontend can connect to it
- ⚠️ **Use WSS (not WS)** for WebSocket in production (Railway uses HTTPS)
- 💡 **Deploy backend first**, get its URL, then configure frontend

---

## Troubleshooting

### If Build Fails:
1. Check Railway build logs
2. Verify Dockerfile paths are correct
3. Ensure package.json has all dependencies

### If Frontend Can't Connect to Backend:
1. Verify CORS is enabled in backend (already done ✅)
2. Check that API_URL and WS_URL are set correctly
3. Use browser DevTools → Network tab to see the actual requests

---

## Next Steps

1. **Commit the changes I just made**
2. **Push to GitHub**
3. **Deploy to Railway following the steps above**
4. **Let me know the backend URL** and I'll help you configure the frontend to use it
