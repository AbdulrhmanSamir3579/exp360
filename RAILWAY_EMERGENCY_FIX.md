# 🚨 CRITICAL: Railway Root Directory Not Working

## The Issue

Railway is **IGNORING** the Root Directory setting and building from the repository root instead of `backend/`.

**Evidence from your build logs:**
```
COPY package*.json ./
npm error path /app/package.json  ← Looking in wrong place!
```

This means Railway is doing:
```bash
cd /repo/           # Repository root (WRONG!)
docker build .      # Tries to find package.json here
```

Instead of:
```bash
cd /repo/backend/   # Backend directory (CORRECT!)
docker build .      # Would find package.json here
```

---

## 🎯 Solution: Verify and Fix Root Directory Setting

### Step 1: Check Current Settings

In Railway Dashboard:

1. Click on your **backend service**
2. Go to **Settings** tab
3. Look for **"Root Directory"** or **"Source"** section
4. **What do you see?**

### Possible Issues:

#### Issue A: Root Directory Field is Empty
**Fix**: Type `backend` in the Root Directory field

#### Issue B: Root Directory Shows `/backend` or `backend/`
**Fix**: Change it to just `backend` (no slashes)

#### Issue C: Root Directory Field Doesn't Exist
**Fix**: You might be on an older Railway version - try the CLI method below

---

## 🔧 Alternative Fix: Use Railway CLI

Since the dashboard setting isn't working, try configuring via CLI:

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

### 3. Link to Your Project

```bash
cd c:\Users\abdul\Desktop\exp360
railway link
```

Select your project when prompted.

### 4. Select the Backend Service

```bash
railway service
```

Choose the backend service from the list.

### 5. Set Root Directory via CLI

```bash
railway variables set RAILWAY_ROOT_DIRECTORY=backend
```

Or try:

```bash
railway variables set ROOT_DIRECTORY=backend
```

### 6. Redeploy

```bash
railway up
```

---

## 🆘 Nuclear Option: Recreate Service with Correct Settings

If nothing else works:

### 1. Delete Current Service

In Railway dashboard:
- Go to service settings
- Scroll to bottom
- Click "Delete Service"

### 2. Create New Service

- Click "New Service"
- Select "Deploy from GitHub repo"
- Choose `exp360` repository

### 3. **IMMEDIATELY Configure Before First Deploy**

**CRITICAL**: Set these BEFORE clicking deploy:

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| Dockerfile Path | `Dockerfile` |
| Watch Paths | `backend/**` |

### 4. Add Environment Variables

```
PORT=3000
NODE_ENV=production
```

### 5. Deploy

Now click deploy - it should work!

---

## 📸 What Root Directory Setting Should Look Like

When you open your service settings, you should see something like:

```
Service Settings
├── General
│   ├── Service Name: exp360-backend
│   └── ...
├── Source
│   ├── Repository: AbdulrhmanSamir3579/exp360
│   ├── Branch: master
│   └── Root Directory: backend  ← THIS MUST BE SET!
├── Build
│   ├── Builder: Dockerfile
│   ├── Dockerfile Path: Dockerfile
│   └── ...
```

---

## 🔍 Debug: Check What Railway is Actually Using

In your build logs, look at the very beginning. It should show:

**If Root Directory is SET correctly:**
```
Source: github.com/AbdulrhmanSamir3579/exp360
Branch: master
Root Directory: backend  ← Should see this!
Using Dockerfile: backend/Dockerfile
```

**If Root Directory is NOT set:**
```
Source: github.com/AbdulrhmanSamir3579/exp360
Branch: master
Using Dockerfile: backend/Dockerfile  ← No "Root Directory" line!
```

---

## 📋 Quick Diagnostic Checklist

Please check and tell me:

- [ ] Can you see a "Root Directory" field in Railway service settings?
- [ ] If yes, what value is currently in it?
- [ ] Does the build log show "Root Directory: backend" at the start?
- [ ] Are you using Railway's new or old dashboard? (new has dark theme)

---

## 🚀 Temporary Workaround (If Nothing Else Works)

As a last resort, we can modify the Dockerfile to work from repository root:

**Change backend/Dockerfile to:**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
CMD ["node", "dist/server.js"]
```

But this is NOT ideal - the Root Directory setting should work!

---

**Please share:**
1. Screenshot of Railway service settings page
2. First 10 lines of build logs
3. Whether you can see "Root Directory" field in settings

This will help me figure out exactly what's wrong!
