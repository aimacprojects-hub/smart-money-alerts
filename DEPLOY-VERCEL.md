# Deploy Frontend to Vercel

## Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- Code pushed to GitHub repo

## Step 1: Push Code to GitHub

```bash
cd /workspace/group/aiventures/smart-money-alerts
git init
git add .
git commit -m "Initial commit - Smart Money Alerts MVP"
git remote add origin https://github.com/YOUR_USERNAME/smart-money-alerts.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

5. Add Environment Variable:
   - **Name:** `BACKEND_URL`
   - **Value:** (wait - you'll get this from Railway in Step 3)
   - For now, leave it as: `http://localhost:3001`

6. Click "Deploy"

### Option B: Via Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

When prompted:
- Set up and deploy? **Y**
- Which scope? (Choose your account)
- Link to existing project? **N**
- Project name: `smart-money-alerts`
- Directory: `./`
- Override build settings? **N**

## Step 3: Update Backend URL (After Railway Deployment)

1. Deploy backend to Railway first (see DEPLOY-RAILWAY.md)
2. Get Railway URL (e.g., `https://smart-money-alerts-production-abc123.up.railway.app`)
3. Go to Vercel dashboard → Your project → Settings → Environment Variables
4. Update `BACKEND_URL` to Railway URL
5. Redeploy (Deployments tab → Click "..." → "Redeploy")

## Step 4: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add custom domain (e.g., `smartmoneyalerts.com`)
3. Update DNS records as instructed by Vercel
4. SSL certificate auto-generated

## Verification Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL (e.g., `smart-money-alerts.vercel.app`)
- [ ] Homepage shows whale dashboard
- [ ] Wallet connection works (Phantom/Solflare)
- [ ] Can navigate to `/dashboard`
- [ ] Dashboard requires wallet connection
- [ ] API calls work (check browser console for errors)

## Troubleshooting

**Build fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies in `package.json`
- Verify Next.js version compatibility

**API errors:**
- Verify `BACKEND_URL` environment variable is set
- Check Railway backend is deployed and running
- Check browser console for CORS errors

**Wallet not connecting:**
- Check that Solana Wallet Adapter packages are installed
- Verify WalletProvider is properly configured
- Check browser console for errors

## Next Steps

1. Deploy backend to Railway (see DEPLOY-RAILWAY.md)
2. Update `BACKEND_URL` environment variable
3. Test full authentication and payment flow
4. Share link with beta testers!

---

**Deployed Frontend URL:** (Write here after deployment)

**Example:** `https://smart-money-alerts.vercel.app`
