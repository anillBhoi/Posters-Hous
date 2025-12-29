# Environment Setup - Step by Step Guide

## What You Need Right Now

To run the project locally, you need **Supabase credentials**. Here's exactly what to do:

---

## Step 1: Create Supabase Account (5 minutes)

1. **Go to**: https://supabase.com
2. **Click**: "Start your project" (top right)
3. **Sign up** with:
   - GitHub (easiest) OR
   - Email
4. **Verify your email** if needed

---

## Step 2: Create Supabase Project

1. After signing in, click **"New Project"**
2. Fill in:
   - **Organization**: Create new (or use default)
   - **Name**: `luxenart` (or any name you like)
   - **Database Password**: Create a strong password ⚠️ **SAVE THIS!**
   - **Region**: Choose closest to you (e.g., `Southeast Asia (Mumbai)` for India)
3. Click **"Create new project"**
4. **Wait 2-3 minutes** for setup to complete

---

## Step 3: Get Your Credentials

Once your project is ready:

1. In Supabase dashboard, go to **Settings** (gear icon, bottom left)
2. Click **"API"** in the settings menu
3. You'll see two important values:

   ### a) Project URL
   - Look for **"Project URL"**
   - It looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - **Copy this entire URL**

   ### b) anon public key
   - Look for **"Project API keys"** section
   - Find **"anon"** or **"public"** key
   - It's a long string starting with `eyJhbGc...`
   - **Copy this entire key**

---

## Step 4: Set Up Database

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"** button
3. Open the file `supabase/schema.sql` from this project folder
4. **Copy ALL the SQL code** (Ctrl+A, Ctrl+C)
5. **Paste** into the SQL Editor
6. Click **"Run"** button (or press Ctrl+Enter)
7. Wait for **"Success. No rows returned"** message

✅ Database is now set up!

---

## Step 5: Create .env.local File

1. In your project root folder (`gallery-canvas-main`), create a new file named:
   ```
   .env.local
   ```
   (Note: The dot at the beginning is important!)

2. **Copy and paste** this template:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Replace the values**:
   - Replace `https://your-project-id.supabase.co` with your **Project URL** from Step 3a
   - Replace `your-anon-key-here` with your **anon public key** from Step 3b

### Example .env.local file:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 6: Test It Works

1. **Save** the `.env.local` file
2. In terminal, run:
   ```bash
   npm run dev
   ```
3. Open browser: http://localhost:3000
4. You should see the homepage!

---

## ✅ Checklist

- [ ] Created Supabase account
- [ ] Created Supabase project
- [ ] Copied Project URL
- [ ] Copied anon public key
- [ ] Ran schema.sql in SQL Editor
- [ ] Created `.env.local` file
- [ ] Added Supabase URL to `.env.local`
- [ ] Added anon key to `.env.local`
- [ ] Started dev server (`npm run dev`)
- [ ] Site loads in browser

---

## 🚨 Common Mistakes

### ❌ Wrong: Missing NEXT_PUBLIC_ prefix
```env
SUPABASE_URL=...  # WRONG!
```
### ✅ Correct:
```env
NEXT_PUBLIC_SUPABASE_URL=...  # CORRECT!
```

### ❌ Wrong: Extra spaces or quotes
```env
NEXT_PUBLIC_SUPABASE_URL = "https://..."  # WRONG!
```
### ✅ Correct:
```env
NEXT_PUBLIC_SUPABASE_URL=https://...  # CORRECT!
```

### ❌ Wrong: File named wrong
- `env.local` ❌
- `.env` ❌
- `env` ❌
### ✅ Correct:
- `.env.local` ✅

---

## 🆘 Troubleshooting

### "Supabase environment variables are not set"
- Check file is named `.env.local` (with dot at start)
- Check variable names start with `NEXT_PUBLIC_`
- Restart dev server after creating file
- No spaces around `=` sign

### "Failed to fetch" or connection errors
- Verify Supabase URL is correct (ends with `.supabase.co`)
- Verify anon key is complete (very long string)
- Check Supabase project is active (not paused)

### Can't find SQL Editor
- Look in left sidebar of Supabase dashboard
- Icon looks like `</>` or "SQL Editor"

---

## 📝 What's Next?

After `.env.local` is set up:

1. **Create admin user**:
   - Sign up at http://localhost:3000/auth/signup
   - Then in Supabase SQL Editor, run:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
     ```

2. **Add sample data** (optional):
   - Use Supabase dashboard to add categories and posters
   - Or wait for admin panel pages to be built

3. **Test the site**:
   - Browse gallery
   - Add to cart
   - Test checkout flow

---

## 💡 Pro Tip

You can test the project **without** Razorpay credentials for now. Payment features won't work, but everything else will!

Just add Razorpay later when you're ready to accept payments.

