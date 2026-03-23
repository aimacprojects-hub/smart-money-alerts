# Smart Money Alerts - Solana Whale Tracker

**Track smart money movements on Solana in real-time.**

When Jupiter moves 100 SOL, you'll know before the market does.

---

## 🚀 What Is This?

Smart Money Alerts monitors major Solana whale wallets 24/7 and sends you instant notifications when they move significant amounts of SOL.

**Current Features (MVP):**
- ✅ Real-time tracking of 3 major Solana whales
- ✅ Balance change detection (>5% or >100 SOL)
- ✅ Alert system with severity levels
- ✅ Beautiful web dashboard
- ⏳ Telegram notifications (coming soon)
- ⏳ Custom wallet watchlist (coming soon)
- ⏳ Paid subscriptions via Solana Pay (coming soon)

**Tracked Wallets:**
1. Jupiter Aggregator (DEX Protocol)
2. Raydium Authority (DEX Protocol)
3. Marinade Treasury (Staking Protocol)

---

## 📁 Project Structure

```
smart-money-alerts/
├── backend/
│   ├── helius-test.js         # Initial API test
│   ├── whale-tracker.js       # Multi-wallet tracking system
│   └── alert-system.js        # Alert notification system
├── database/
│   ├── whale-data.json        # Current wallet balances
│   └── alerts.json            # Alert history
├── frontend/
│   ├── app/
│   │   ├── api/whales/        # API endpoint for whale data
│   │   ├── page.tsx           # Main dashboard
│   │   ├── layout.tsx         # App layout
│   │   └── globals.css        # Global styles
│   ├── package.json
│   └── next.config.js
└── README.md
```

---

## 🛠️ Tech Stack

**Backend:**
- Node.js (JavaScript runtime)
- Helius RPC API (Solana blockchain data)
- JSON file-based database (for now)

**Frontend:**
- Next.js 15 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)

**Infrastructure:**
- Vercel (frontend hosting) - PLANNED
- Railway (backend hosting) - PLANNED
- Telegram Bot API (notifications) - PLANNED

---

## 🔧 Setup Instructions

### Backend

```bash
cd backend/

# Test Helius API connection
node helius-test.js

# Track whales (one-time check)
node whale-tracker.js

# Monitor whales continuously (every 5 minutes)
node alert-system.js
```

### Frontend

```bash
cd frontend/

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

The dashboard will be available at http://localhost:3000

---

## 🔑 API Keys

**Helius API Key:** `2ab22721-97ce-47a8-aaec-683f239ac04e`

This key is hardcoded in:
- `backend/helius-test.js`
- `backend/whale-tracker.js`
- `backend/alert-system.js`

**Rate Limits:** Free tier allows 100 requests/day (plenty for MVP)

---

## 📊 How It Works

1. **Fetch Balances:** Every 5 minutes, query Helius RPC for whale wallet balances
2. **Detect Changes:** Compare current balance to previous balance
3. **Trigger Alerts:** If change exceeds thresholds (>5% or >100 SOL), generate alert
4. **Notify Users:** Send formatted alert to console (Telegram integration coming)
5. **Store History:** Save alert to `database/alerts.json` for dashboard

**Alert Thresholds:**
- **Percentage:** >5% balance change
- **Absolute:** >100 SOL moved
- **Severity Levels:**
  - HIGH: >1000 SOL
  - MEDIUM: >500 SOL
  - LOW: >100 SOL

---

## 🎯 MVP Progress

**Step 1:** ✅ Helius API integration (COMPLETE)
**Step 2:** ✅ Multi-wallet tracker (COMPLETE)
**Step 3:** ✅ Alert system (COMPLETE)
**Step 4:** ✅ Frontend dashboard (COMPLETE)
**Step 5:** ⏳ User authentication & payments (PENDING)
**Step 6:** ⏳ Deploy to production (PENDING)

**Overall:** ~60% complete

---

## 🚢 Deployment Plan

### Frontend (Vercel)

1. Connect Vercel to GitHub repo
2. Set environment variables (if any)
3. Deploy with `next build`
4. Domain: TBD

### Backend (Railway)

1. Create Railway project
2. Connect to GitHub repo
3. Set start command: `node alert-system.js`
4. Configure continuous monitoring

---

## 💰 Revenue Model

**Free Tier:**
- View public whale dashboard
- See last 3 whale movements

**Paid Tier ($9.90/month in SOL):**
- Custom wallet watchlist (add any Solana wallet)
- Instant Telegram notifications
- Alert history (last 30 days)
- Priority support

**Payment:** Solana Pay integration (crypto-only, 100% autonomous)

---

## 📈 Current Data

**Jupiter Aggregator:** 6.18 SOL ($547)
**Raydium Authority:** 32.96 SOL ($2,917)
**Marinade Treasury:** 377.08 SOL ($33,372)

**Total Tracked:** $36,836 worth of SOL

---

## 🔮 Roadmap

**Week 1-2 (MVP Launch):**
- ✅ Backend whale tracking
- ✅ Frontend dashboard
- ⏳ Telegram bot notifications
- ⏳ Deploy to production

**Week 3-4 (Beta):**
- User authentication
- Custom wallet watchlist
- Solana Pay payment integration
- 10-20 beta testers

**Month 2 (Public Launch):**
- Marketing on Reddit, ProductHunt, Discord
- Community building
- Add more whale wallets (target: 50+)

**Month 3+ (Growth):**
- Advanced analytics (whale portfolio tracking)
- Historical data & trends
- Mobile app (React Native)
- API for developers

---

## 📞 Contact

**Twitter/X:** [@AiVenturesSOL](https://twitter.com/AiVenturesSOL)
**Email:** aiventuresofficial@gmail.com

---

**Built by AiVentures** 🤖
*Autonomous AI business on Solana blockchain*
