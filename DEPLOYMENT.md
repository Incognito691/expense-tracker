# 🚀 Deployment Guide - Expense Tracker

## Vercel Deployment (Recommended)

### Prerequisites

- GitHub account
- Vercel account (free tier is perfect)
- Resend API key

### Step-by-Step Deployment

#### 1. **Push to GitHub**

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git branch -M main
git push -u origin main
```

#### 2. **Deploy to Vercel**

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings
5. Click "Deploy"

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### 3. **Configure Environment Variables**

In Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add these variables:
   - `RESEND_API_KEY` = `your_resend_api_key_here`
3. Click "Save"
4. Redeploy if needed

#### 4. **Update API Endpoint in Code**

After deployment, update your Login.tsx to use the production API:

Replace:

```typescript
const response = await fetch('http://localhost:3001/api/send-otp', {
```

With:

```typescript
const response = await fetch('/api/send-otp', {
```

The `/api/send-otp` will automatically route to your serverless function.

### Important Notes

✅ **What's Different:**

- Your Express server (`server.js`) is replaced by serverless function (`api/send-otp.js`)
- No need to run a separate server - Vercel handles it
- Automatic HTTPS and CDN
- Zero-downtime deployments

✅ **API Endpoint Structure:**

- Local: `http://localhost:3001/api/send-otp`
- Production: `https://your-app.vercel.app/api/send-otp`
- Or just: `/api/send-otp` (relative path works everywhere)

### Troubleshooting

**Issue: OTP emails not sending**

- Check environment variables are set in Vercel dashboard
- Verify Resend API key is valid
- Check Vercel function logs

**Issue: Build fails**

- Run `npm run build` locally to test
- Check for TypeScript errors
- Ensure all dependencies are in package.json

**Issue: White screen after deployment**

- Check browser console for errors
- Verify all environment variables are set
- Check Vercel deployment logs

### Development vs Production

**Local Development:**

```bash
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

**Production:**

```bash
# Everything runs on your Vercel domain
# https://your-app.vercel.app
```

### Post-Deployment Checklist

- [ ] Test login/signup flow
- [ ] Verify OTP emails arrive
- [ ] Test all CRUD operations (expenses, income, savings)
- [ ] Check theme toggle works
- [ ] Verify month navigation
- [ ] Test on mobile devices
- [ ] Check all pages load correctly

### Updating Your App

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push

# Vercel automatically deploys when you push to main branch
```

### Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS instructions
4. Wait for DNS propagation (usually < 1 hour)

---

## Alternative: Netlify Deployment

If you prefer Netlify:

1. Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. Move `api/send-otp.js` to `netlify/functions/send-otp.js`

3. Deploy via Netlify Dashboard or CLI

---

**Need Help?** Check Vercel documentation: https://vercel.com/docs
