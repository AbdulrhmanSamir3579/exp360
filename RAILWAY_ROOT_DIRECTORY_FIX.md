# 🚨 CRITICAL: Railway Root Directory Configuration

## The Problem You're Experiencing

Railway is **NOT** using the `backend/` directory as the build context, which is why it can't find `package.json`.

**Error**: `Could not read package.json: Error: ENOENT: no such file or directory`

**Cause**: The "Root Directory" setting in Railway dashboard is either:
- Not set at all (defaults to repository root)
- Set incorrectly

---

## ✅ THE FIX: Set Root Directory in Railway Dashboard

### Step-by-Step Instructions

#### 1. Go to Your Railway Project

Navigate to: https://railway.app/dashboard

#### 2. Select Your Backend Service

Click on the service that's failing to build (probably named `exp360` or similar)

#### 3. Open Service Settings

Look for a **Settings** tab or **⚙️ Settings** button

#### 4. Find "Root Directory" Field

Scroll down in the settings until you find a field labeled:
- **"Root Directory"** or
- **"Source Directory"** or  
- **"Working Directory"**

#### 5. Set the Value

**For Backend Service:**
```
backend
```

**For Frontend Service (when you create it):**
```
frontend
```

⚠️ **Important**: 
- Do NOT include slashes: ❌ `/backend/` or `backend/`
- Just the folder name: ✅ `backend`

#### 6. Save and Redeploy

- Click **Save** or **Update**
- Railway should automatically trigger a new deployment
- Watch the build logs - it should now find `package.json`!

---

## 🔍 How to Verify It's Set Correctly

### In Railway Build Logs, you should see:

**BEFORE (Wrong - Root Directory not set):**
```
Build context: /
Looking for: /package.json ❌ (doesn't exist)
```

**AFTER (Correct - Root Directory = "backend"):**
```
Build context: /backend/
Looking for: /backend/package.json ✅ (exists!)
```

---

## 📸 Visual Guide

The Root Directory setting looks like this in Railway:

```
┌─────────────────────────────────────────┐
│  Service Settings                        │
├─────────────────────────────────────────┤
│                                          │
│  Service Name                            │
│  ┌────────────────────────────────────┐ │
│  │ exp360-backend                     │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Root Directory                    ⭐    │
│  ┌────────────────────────────────────┐ │
│  │ backend                            │ │ ← SET THIS!
│  └────────────────────────────────────┘ │
│                                          │
│  Dockerfile Path                         │
│  ┌────────────────────────────────────┐ │
│  │ Dockerfile                         │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Watch Paths                             │
│  ┌────────────────────────────────────┐ │
│  │ backend/**                         │ │
│  └────────────────────────────────────┘ │
│                                          │
│  [ Save Changes ]                        │
└─────────────────────────────────────────┘
```

---

## 🎯 Quick Checklist

Before redeploying, verify:

- [ ] Root Directory is set to `backend` (for backend service)
- [ ] Dockerfile Path is `Dockerfile` (not `backend/Dockerfile`)
- [ ] Watch Paths includes `backend/**`
- [ ] You clicked Save/Update
- [ ] You triggered a new deployment

---

## 🐛 Still Not Working?

### Option 1: Delete and Recreate Service

Sometimes Railway caches settings. Try:

1. Delete the failing service
2. Create a new service from the same GitHub repo
3. **IMMEDIATELY** set Root Directory to `backend` before first deploy
4. Add environment variables
5. Deploy

### Option 2: Use Railway CLI

You can also configure this via Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set root directory
railway variables set ROOT_DIRECTORY=backend

# Deploy
railway up
```

### Option 3: Contact Railway Support

If nothing works, Railway support is very responsive:
- Discord: https://discord.gg/railway
- Email: team@railway.app

---

## 📋 Environment Variables Reference

Once the build succeeds, make sure these are set:

### Backend Service
```
PORT=3000
NODE_ENV=production
```

### Frontend Service
```
API_URL=https://your-backend-url.up.railway.app
WS_URL=wss://your-backend-url.up.railway.app
```

---

## ✅ Success Indicators

You'll know it's working when:

1. Build logs show: `COPY package*.json ./` succeeds
2. Build logs show: `RUN npm install` completes successfully
3. Build logs show: `RUN npm run build` completes
4. Service deploys and shows "Active" status
5. Health check endpoint responds: `https://your-backend-url/health`

---

## 🎉 Next Steps After Backend Deploys

1. Copy the backend public URL
2. Create frontend service with Root Directory = `frontend`
3. Set frontend environment variables with backend URL
4. Deploy frontend
5. Test the application!

---

**Need help?** Share a screenshot of your Railway service settings and I can verify the configuration!
