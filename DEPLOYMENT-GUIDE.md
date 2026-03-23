# Smart Money Alerts - Deployment Guide

## 🚀 Quick Deployment Checklist

**Backend (Railway):**
- [x] Code ready
- [x] Telegram bot configured
- [ ] Deploy to Railway
- [ ] Start continuous monitoring

**Frontend (Vercel):**
- [x] Code ready
- [ ] Deploy to Vercel
- [ ] Connect domain (optional)

---

## Backend Deployment (Railway)

### Option 1: Deploy via Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd /workspace/group/aiventures/smart-money-alerts/backend
railway init

# Deploy
railway up

# Set start command
railway run node alert-system.js
```

### Option 2: Deploy via GitHub

1. Push code to GitHub repo
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select the repository
5. Set root directory: `smart-money-alerts/backend`
6. Set start command: `node alert-system.js`
7. Deploy!

### Environment Variables (if needed later)

```
HELIUS_API_KEY=2ab22721-97ce-47a8-aaec-683f239ac04e
TELEGRAM_BOT_TOKEN=8664907137:AAEpZfrjHa4DmQGyBGpcVI6MOkCx5az9oUk
TELEGRAM_CHAT_ID=1992343537
```

---

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /workspace/group/aiventures/smart-money-alerts/frontend
vercel

# Production deployment
vercel --prod
```

### Option 2: Deploy via GitHub

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select the repository
5. Set root directory: `smart-money-alerts/frontend`
6. Framework preset: Next.js (auto-detected)
7. Deploy!

### Custom Domain (Optional)

1. Go to Vercel project settings
2. Domains → Add domain
3. Follow DNS configuration instructions

**Suggested domains:**
- smartmoneyalerts.com
- aiventures.app/alerts
- whaletracker.xyz

---

## Testing Deployment

### Backend Health Check

```bash
# SSH into Railway container (or run locally)
node -e "
const { testTelegramConnection } = require('./telegram-bot.js');
testTelegramConnection();
"
```

You should receive a Telegram message confirming the bot is online.

### Frontend Health Check

Visit your Vercel URL (e.g., https://your-project.vercel.app)

You should see:
- Whale tracking dashboard
- Live balance data
- Beautiful gradient design

---

## Monitoring & Maintenance

### Railway Logs

```bash
railway logs
```

### Vercel Logs

```bash
vercel logs
```

### Alert Frequency

Current setting: Check every **5 minutes**

To change frequency, edit `alert-system.js`:

```javascript
// Line ~210
setInterval(async () => {
    await monitorWhales();
}, 5 * 60 * 1000);  // Change 5 to desired minutes
```

---

## Cost Estimate

**Railway (Backend):**
- Free tier: 500 hours/month (enough for 24/7 + some margin)
- Paid tier: $5/month (if we exceed free tier)

**Vercel (Frontend):**
- Free tier: 100 GB bandwidth, unlimited deployments
- Should be free for MVP phase

**Helius API:**
- Free tier: 100 requests/day
- Current usage: ~288 requests/day (every 5 mins)
- Need to upgrade to Growth tier: **$49/month** (100K requests)

**Telegram Bot:**
- **FREE** (no cost)

**Total Monthly Cost:**
- MVP phase: ~$49/month (just Helius Growth)
- After revenue: ~$54/month (Railway paid + Helius)

---

## Scaling Plan

**If we get 100 users:**
- Backend can handle it (Railway scales automatically)
- Frontend is serverless (Vercel scales automatically)
- Helius Growth tier supports 100K requests/day (plenty)

**If we get 1,000 users:**
- Upgrade Railway to Pro: $20/month
- Upgrade Helius to Business: $250/month
- Total: ~$270/month

**Break-even:**
- At $9.90/month per user
- Need **28 paid users** to cover $270/month cost
- Everything after = pure profit

---

## Next Steps

1. **Deploy backend to Railway** (start continuous monitoring)
2. **Deploy frontend to Vercel** (public-facing dashboard)
3. **Test end-to-end** (verify alerts work in production)
4. **Add custom domain** (make it official)
5. **Launch beta** (invite 10-20 testers)

---

**Status: Ready to deploy!** 🚀
