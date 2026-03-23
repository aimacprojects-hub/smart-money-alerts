# 🚀 Smart Money Alerts - Production Deployment Checklist

**Deploy Date:** March 23, 2026
**Status:** Ready to Deploy ✅

---

## Pre-Deployment Checklist

- [x] All code complete (authentication, dashboard, payment)
- [x] Dashboard component updates applied
- [x] Procfile configured for Railway
- [x] Package.json dependencies complete
- [x] Environment variables documented
- [ ] Code pushed to GitHub

---

## Deployment Steps (Do in This Order!)

### Step 1: Push to GitHub (5 minutes)

```bash
cd /workspace/group/aiventures/smart-money-alerts

# Initialize git
git init
git add .
git commit -m "Smart Money Alerts MVP - Ready for production"

# Create GitHub repo and push
# (Do this manually in GitHub UI first, then:)
git remote add origin https://github.com/YOUR_USERNAME/smart-money-alerts.git
git branch -M main
git push -u origin main
```

**Verify:** Code visible on GitHub ✓

---

### Step 2: Deploy Backend to Railway (10 minutes)

Follow: `DEPLOY-RAILWAY.md`

**Quick Steps:**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select repo → Set root directory to `backend`
4. Railway auto-detects Procfile and deploys
5. Copy deployment URL (e.g., `https://smart-money-alerts-production-xyz.up.railway.app`)

**Test Backend:**
```bash
curl https://YOUR_RAILWAY_URL/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Write Railway URL here:** ____________________________________

**Verify:**
- [ ] Web process running (api-server.js)
- [ ] Worker process running (start-monitoring.js)
- [ ] Health check returns 200 OK
- [ ] Database initialized (check logs)

---

### Step 3: Deploy Frontend to Vercel (10 minutes)

Follow: `DEPLOY-VERCEL.md`

**Quick Steps:**
1. Go to https://vercel.com
2. New Project → Import from GitHub
3. Select repo → Set root directory to `frontend`
4. Add environment variable:
   - Name: `BACKEND_URL`
   - Value: (Your Railway URL from Step 2)
5. Deploy!

**Write Vercel URL here:** ____________________________________

**Verify:**
- [ ] Site loads at Vercel URL
- [ ] Homepage shows whale dashboard
- [ ] Wallet connection button works
- [ ] Can navigate to `/dashboard`
- [ ] No console errors

---

### Step 4: End-to-End Testing (15 minutes)

**Test Authentication Flow:**
1. Go to Vercel URL → Click "Dashboard"
2. Connect wallet (Phantom or Solflare)
3. Sign message when prompted
4. Should see dashboard with user profile
5. Verify "FREE" subscription status shows

**Test Payment Flow:**
1. Click "Upgrade to Paid - $9.90/mo"
2. Modal opens with Solana Pay component
3. Review price: $9.90 = ~0.112 SOL
4. Click "Pay X SOL Now"
5. Approve transaction in wallet
6. Wait for confirmation
7. Modal shows "Payment Successful!"
8. Refresh page → Subscription should show "PAID"

**Test Watchlist (Paid Users Only):**
1. Click "+ Add Wallet" in watchlist section
2. Enter a Solana wallet address
3. Add optional name
4. Click "Add to Watchlist"
5. Wallet appears in list
6. Click × to remove → Confirm removal

**Verify:**
- [ ] Authentication works
- [ ] Payment processes successfully
- [ ] Subscription activates
- [ ] Watchlist CRUD works
- [ ] Free users see upgrade prompts

---

### Step 5: Monitor & Debug (Ongoing)

**Check Railway Logs:**
- Whale monitoring running every 5 minutes
- API server handling requests
- Database queries working
- No errors

**Check Vercel Logs:**
- API calls succeeding
- No build errors
- No runtime errors

**Check Browser Console:**
- No JavaScript errors
- API responses look correct
- Wallet connection stable

---

## Post-Deployment Tasks

### Immediate (Day 1)
- [ ] Test with real wallet and small amount of SOL
- [ ] Verify payment arrives at `BqGw3HnmigR2KLpAenbjy2JMEgAc6yLmzd4FyXiJbCEL`
- [ ] Check database for user record
- [ ] Monitor for errors

### Week 1
- [ ] Share with 10 beta testers
- [ ] Collect feedback
- [ ] Track first paid subscription
- [ ] Add more whale wallets based on requests

### Week 2-4
- [ ] Fix any bugs reported by beta testers
- [ ] Optimize whale monitoring performance
- [ ] Add Telegram notification integration
- [ ] Expand whale coverage to 20+ wallets

---

## Emergency Rollback Plan

If something breaks badly:

**Frontend (Vercel):**
1. Go to Deployments tab
2. Find last working deployment
3. Click "..." → "Promote to Production"

**Backend (Railway):**
1. Go to Deployments tab
2. Click "Rollback" on failed deployment
3. Or redeploy previous commit

**Database Issues:**
- SQLite file persists on Railway
- Can manually fix via Railway CLI if needed
- Worst case: Database auto-recreates on restart

---

## Success Metrics (Week 1)

**Target Goals:**
- [ ] 10 beta users signed up
- [ ] 1-3 paid subscriptions
- [ ] 0 critical bugs
- [ ] 100% uptime

**Track in Database:**
```bash
# SSH into Railway or use Railway CLI
sqlite3 /path/to/users.db
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE subscription_tier = 'paid';
SELECT SUM(total_paid_sol) FROM users;
```

---

## URLs (Fill In After Deployment)

| Service | URL | Status |
|---------|-----|--------|
| Frontend (Vercel) | __________________ | ⏳ |
| Backend (Railway) | __________________ | ⏳ |
| Backend Health Check | __________________ | ⏳ |
| GitHub Repo | __________________ | ⏳ |

---

## Contact & Support

**Twitter/X:** @AiVenturesSOL
**Email:** aiventuresofficial@gmail.com
**Telegram Bot:** @SmartMoneyAlertsBot (8183254103)

---

**Ready to launch! 🚀**

Next command: `git init` in `/workspace/group/aiventures/smart-money-alerts`
