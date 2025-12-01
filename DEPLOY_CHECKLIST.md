# 🚀 Quick Deployment Checklist

Follow these steps to deploy your Expense Tracker to Vercel:

## ✅ Pre-Deployment Checklist

- [ ] Code is working locally (`npm run dev`)
- [ ] Build passes (`npm run build`)
- [ ] `.env.local` has `RESEND_API_KEY`
- [ ] All changes committed to git

## 📋 Step-by-Step Deployment

### Step 1: Test Build Locally

```bash
npm run build
npm run preview
```

If this works, you're ready to deploy!

### Step 2: Push to GitHub

If you haven't already:

```bash
# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create GitHub repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git branch -M main
git push -u origin main
```

If repo exists:

```bash
git add .
git commit -m "Ready for deployment"
git push
```

### Step 3: Deploy to Vercel

**Method 1: Vercel Dashboard (Recommended for first time)**

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Select your `expense-tracker` repository
5. Vercel auto-detects Vite settings ✅
6. Click "Deploy" (Don't add env vars yet, we'll do it next)

**Method 2: Vercel CLI**

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Choose your account
# - Link to existing project? No
# - What's your project's name? expense-tracker
# - In which directory is your code? ./
# - Want to override settings? No
```

### Step 4: Add Environment Variables

**In Vercel Dashboard:**

1. Go to your project
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_YourActualResendAPIKey` (from your .env.local)
   - **Environment:** Production, Preview, Development (select all)
5. Click "Save"

**Important:** Copy your actual Resend API key from `.env.local`

### Step 5: Redeploy (if needed)

If you added env vars after first deployment:

1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

Or just push a new commit:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

### Step 6: Test Your Deployment

1. Click "Visit" button in Vercel dashboard
2. Your app should open at `https://your-app-name.vercel.app`
3. Test the login flow:
   - Enter email and name
   - Click "Send OTP"
   - Check email for OTP
   - Enter OTP and verify
4. Test all features:
   - Add income
   - Add expense
   - Add savings
   - Change months
   - Toggle theme

## 🎉 Success Indicators

✅ Site loads at your Vercel URL
✅ Login page shows up
✅ OTP emails arrive in inbox
✅ Can log in successfully
✅ All features work (expenses, income, savings)
✅ Theme toggle works
✅ Monthly navigation works

## 🔧 Common Issues & Fixes

### Issue: "OTP email not sending"

**Fix:**

1. Check Vercel → Settings → Environment Variables
2. Verify `RESEND_API_KEY` is set correctly
3. Check Vercel → Deployments → Latest → Functions → send-otp logs
4. Verify your Resend account is active

### Issue: "Build failed"

**Fix:**

1. Run `npm run build` locally
2. Fix any TypeScript errors
3. Commit and push again

### Issue: "White screen / blank page"

**Fix:**

1. Open browser console (F12)
2. Check for errors
3. Verify all routes are working
4. Check Vercel deployment logs

### Issue: "API not found"

**Fix:**

- Verify `api/send-otp.js` exists in your repo
- Check vercel.json is present
- Clear browser cache and hard refresh (Ctrl+Shift+R)

## 📱 Share Your App

Once deployed, share your link:

```
https://your-expense-tracker.vercel.app
```

## 🔄 Making Updates

After deployment, any changes you push to GitHub will auto-deploy:

```bash
# Make your changes
# Then:
git add .
git commit -m "Description of changes"
git push

# Vercel automatically deploys!
# Watch progress at vercel.com/your-username/expense-tracker
```

## 🌐 Custom Domain (Optional)

Want `expense-tracker.yourdomain.com`?

1. Vercel Dashboard → Settings → Domains
2. Click "Add"
3. Enter your domain
4. Follow DNS instructions
5. Wait 1-24 hours for DNS propagation

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Resend Docs: https://resend.com/docs
- GitHub Issues: Create an issue in your repo

---

**🎊 Congratulations on deploying your Expense Tracker!**
