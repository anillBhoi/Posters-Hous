# Free Deployment Guide - Deploy Your Project Live for Free! 🚀

## Yes, You Can Deploy Completely Free!

Both **Supabase** (backend/database) and **Vercel** (frontend hosting) offer generous free tiers that are perfect for this project.

---

## 🆓 Free Tier Limits

### Supabase (Free Tier)
- ✅ **500 MB database storage** - Enough for thousands of posters
- ✅ **2 GB bandwidth** - Good for moderate traffic
- ✅ **50,000 monthly active users** - More than enough
- ✅ **Unlimited API requests**
- ✅ **Email authentication** (free)
- ✅ **Google OAuth** (free)
- ✅ **Row Level Security** (free)
- ✅ **Real-time subscriptions** (free)

### Vercel (Free Tier)
- ✅ **Unlimited deployments**
- ✅ **100 GB bandwidth/month**
- ✅ **Automatic HTTPS**
- ✅ **Custom domains** (free)
- ✅ **Automatic deployments** from GitHub
- ✅ **Preview deployments** for every PR

**Bottom line: You can run this project completely free!**

---

## 📋 Step-by-Step Free Deployment

### Part 1: Deploy Backend (Supabase) - FREE

#### Step 1: Create Supabase Account
1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub (easiest) or email
4. Click **"New Project"**

#### Step 2: Create Project
1. **Organization**: Create new or use default
2. **Name**: `luxenart` (or any name)
3. **Database Password**: Create a strong password (save it!)
4. **Region**: Choose closest to your users (e.g., `Southeast Asia (Mumbai)` for India)
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

#### Step 3: Get Your Credentials
1. Once project is ready, go to **Settings** → **API**
2. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
3. **Copy both** - you'll need them!

#### Step 4: Set Up Database
1. Go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open `supabase/schema.sql` from this project
4. Copy **ALL** the SQL code
5. Paste into SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for "Success" message

✅ **Your backend is now live and free!**

---

### Part 2: Deploy Frontend (Vercel) - FREE

#### Step 1: Push Code to GitHub
1. Create a GitHub account (if you don't have one)
2. Create a new repository:
   - Go to **github.com** → **New repository**
   - Name: `luxenart-ecommerce`
   - Make it **Public** (or Private, both work)
   - **Don't** initialize with README
   - Click **"Create repository"**

3. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/luxenart-ecommerce.git
   git push -u origin main
   ```

#### Step 2: Deploy to Vercel
1. Go to **https://vercel.com**
2. Click **"Sign Up"** → Sign in with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository:
   - Select `luxenart-ecommerce`
   - Click **"Import"**

#### Step 3: Configure Environment Variables
1. In Vercel project settings, go to **Environment Variables**
2. Add these variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL = (paste your Supabase URL)
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (paste your Supabase anon key)
   NEXT_PUBLIC_APP_URL = https://your-project.vercel.app
   ```

3. Click **"Save"**

#### Step 4: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your site will be live at: `https://your-project.vercel.app`

✅ **Your frontend is now live and free!**

---

## 🔗 Connect Frontend to Backend

### Update Supabase Settings
1. Go to Supabase Dashboard → **Settings** → **API**
2. Under **"URL Configuration"**, add your Vercel URL to allowed origins:
   - `https://your-project.vercel.app`
   - `https://*.vercel.app` (for preview deployments)

3. Go to **Authentication** → **URL Configuration**
4. Add redirect URLs:
   - `https://your-project.vercel.app/auth/callback`
   - `https://your-project.vercel.app/**`

---

## 🎯 Complete Setup Checklist

### Backend (Supabase)
- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied Project URL and anon key
- [ ] Ran `supabase/schema.sql` in SQL Editor
- [ ] Added Vercel URL to allowed origins

### Frontend (Vercel)
- [ ] Pushed code to GitHub
- [ ] Connected GitHub to Vercel
- [ ] Added environment variables in Vercel
- [ ] Deployed successfully
- [ ] Site is accessible

### Final Steps
- [ ] Create admin user (sign up, then update role in Supabase SQL Editor)
- [ ] Test the site
- [ ] Share your live URL! 🎉

---

## 🌐 Your Live URLs

After deployment, you'll have:
- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-project.supabase.co`
- **Database**: Managed by Supabase (no separate URL needed)

---

## 💡 Pro Tips

### 1. Custom Domain (Free on Vercel)
- In Vercel project settings → **Domains**
- Add your custom domain (if you have one)
- Vercel provides free SSL certificate

### 2. Monitor Usage
- Supabase Dashboard shows your usage
- Vercel Dashboard shows bandwidth usage
- Both have clear limits displayed

### 3. Upgrade When Needed
- If you exceed free limits, you'll get notified
- Supabase Pro: $25/month (if you need more)
- Vercel Pro: $20/month (if you need more)
- But free tier is usually enough for starting!

### 4. Backup Your Database
- Supabase allows database backups
- Export data regularly (free)

---

## 🚨 Important Notes

1. **Never commit `.env.local`** to GitHub
   - It's already in `.gitignore`
   - Only add env vars in Vercel dashboard

2. **Supabase Password**
   - Save your database password securely
   - You'll need it if you want direct database access

3. **Free Tier Limits**
   - Monitor your usage in both dashboards
   - You'll get warnings before hitting limits

---

## 🆘 Troubleshooting

### "Supabase connection error"
- Check environment variables in Vercel
- Verify Supabase project is active (not paused)
- Check Supabase URL is correct

### "Deployment failed"
- Check build logs in Vercel
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

### "Can't access admin panel"
- Create admin user (see QUICK_START.md)
- Check user role in Supabase

---

## ✅ You're All Set!

Once deployed, your e-commerce site will be:
- ✅ **Live and accessible worldwide**
- ✅ **Completely free** (within limits)
- ✅ **Automatically updated** when you push to GitHub
- ✅ **HTTPS secured** (free SSL)
- ✅ **Fast and reliable**

**Share your live URL and start selling! 🎨**

---

## 📞 Need Help?

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

