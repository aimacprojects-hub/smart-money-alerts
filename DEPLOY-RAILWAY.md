# Deploy Backend to Railway

## Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)
- Code pushed to GitHub repo

## Step 1: Prepare Backend for Deployment

Verify these files exist:
- [x] `backend/Procfile` - Defines web and worker processes
- [x] `backend/package.json` - Lists all dependencies
- [x] `backend/api-server.js` - Express API server
- [x] `backend/start-monitoring.js` - Whale monitoring worker
- [x] `backend/db.js` - Database functions

## Step 2: Deploy to Railway

### Option A: Via Railway Dashboard (Recommended)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure service:
   - **Service Name:** `smart-money-alerts-backend`
   - **Root Directory:** `backend` (IMPORTANT!)
   - **Start Command:** Railway will auto-detect Procfile

5. Railway will automatically:
   - Install dependencies from `package.json`
   - Run `web` process (api-server.js) on port $PORT
   - Run `worker` process (start-monitoring.js) in background
   - Provide a public URL (e.g., `https://smart-money-alerts-production-abc123.up.railway.app`)

6. Environment Variables (Railway auto-sets these):
   - `PORT` - Auto-assigned by Railway
   - No other variables needed for MVP

### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
cd backend
railway init

# Deploy
railway up
```

## Step 3: Verify Deployment

1. Check deployment logs in Railway dashboard
2. Verify both processes are running:
   - **web:** API server on port 3001 (or Railway's assigned port)
   - **worker:** Whale monitoring (runs every 5 minutes)

3. Test API endpoint:
```bash
curl https://YOUR_RAILWAY_URL.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

## Step 4: Copy Backend URL

1. Go to Railway dashboard → Your service → Settings
2. Copy the public URL (e.g., `https://smart-money-alerts-production-abc123.up.railway.app`)
3. **IMPORTANT:** Update this in Vercel environment variables as `BACKEND_URL`

## Railway Configuration

### Procfile (Already Created)
```
web: node api-server.js
worker: node start-monitoring.js
```

### Database
- SQLite database file created automatically at `../database/users.db`
- Persists across deployments (Railway uses persistent volumes)
- Whale data stored in `../database/whale-data.json`

### Resource Usage (Free Tier)
- **RAM:** ~100-200 MB (well within free tier)
- **CPU:** Minimal (API is lightweight)
- **Disk:** <100 MB
- **Network:** Depends on usage, but MVP should stay under limits

## Monitoring & Logs

View logs in Railway dashboard:
- Click on service → "Deployments" → "View Logs"
- Watch for:
  - ✓ Database initialized
  - ✓ API server running on port X
  - ✓ Whale monitoring started
  - ⚠️ Any errors

## Troubleshooting

**Build fails:**
- Check Railway build logs
- Verify `package.json` has all dependencies
- Ensure `better-sqlite3` compiles (Railway handles this automatically)

**Database errors:**
- Check file permissions
- Verify `database/` directory exists
- Railway should create it automatically

**API not responding:**
- Check if web process is running
- Verify PORT environment variable is used: `const PORT = process.env.PORT || 3001`
- Check Railway logs for errors

**Whale monitoring not working:**
- Check worker process logs
- Verify Helius API key is in code (it's hardcoded for MVP)
- Check for rate limit errors

## Environment Variables (If Needed Later)

For production, you might want to add:
- `HELIUS_API_KEY` - Move from hardcoded to environment variable
- `TELEGRAM_BOT_TOKEN` - When Telegram notifications are live
- `SOLANA_RPC_URL` - If you want custom RPC endpoint

Add in Railway dashboard → Service → Variables

## Scaling (Future)

When you outgrow free tier:
- Upgrade to Railway Pro ($5/month)
- Or switch to Railway's usage-based pricing
- Consider moving to dedicated server if traffic is high

## Next Steps

1. Copy Railway URL
2. Update Vercel `BACKEND_URL` environment variable
3. Redeploy Vercel frontend
4. Test full flow: wallet connection → authentication → payment

---

**Deployed Backend URL:** (Write here after deployment)

**Example:** `https://smart-money-alerts-production-abc123.up.railway.app`

**Health Check:** `https://YOUR_URL/health`

**API Endpoints:**
- POST `/api/auth/wallet` - Authenticate user
- GET `/api/user/:token` - Get user profile
- GET `/api/watchlist/:token` - Get watchlist
- POST `/api/payment/:token` - Record payment
- GET `/api/stats` - Public stats
