# Fix Admin Access - Step by Step Guide

## 🔍 Problem: Admin Panel Not Showing

If you set the admin role via SQL but don't see the admin panel, follow these steps:

---

## ✅ Step 1: Verify Role in Database

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this query to check your role:

```sql
SELECT id, email, role FROM profiles WHERE email = 'anilbhoi0008@gmail.com';
```

3. **Expected result**: Should show `role = 'admin'`
4. **If it shows `role = 'user'`**, run this again:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'anilbhoi0008@gmail.com';
```

5. **Verify again** with the SELECT query

---

## ✅ Step 2: Check if Profile Exists

Sometimes the profile might not exist. Run this:

```sql
SELECT * FROM profiles WHERE email = 'anilbhoi0008@gmail.com';
```

**If no results:**
- The profile doesn't exist
- You need to create it first (see Step 3)

**If results show:**
- Check the `role` column
- Should be `'admin'` (with quotes, lowercase)

---

## ✅ Step 3: Create Profile if Missing

If profile doesn't exist, you need to:

1. **First, get your user ID from auth.users:**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'anilbhoi0008@gmail.com';
   ```
   Copy the `id` (it's a UUID)

2. **Then create the profile:**
   ```sql
   INSERT INTO profiles (id, email, role)
   VALUES (
     'paste-your-user-id-here',
     'anilbhoi0008@gmail.com',
     'admin'
   );
   ```

3. **Or use this (if user exists in auth.users):**
   ```sql
   INSERT INTO profiles (id, email, role)
   SELECT id, email, 'admin'
   FROM auth.users
   WHERE email = 'anilbhoi0008@gmail.com'
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

---

## ✅ Step 4: Logout and Login Again

**This is IMPORTANT!** The app caches your profile, so:

1. **Logout** from the app
   - Click your profile icon → "Sign Out"

2. **Clear browser cache** (optional but recommended):
   - Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
   - Clear "Cached images and files"
   - Or use Incognito/Private window

3. **Login again**:
   - Go to http://localhost:3000/login
   - Use: `anilbhoi0008@gmail.com` and your password

4. **Check for Admin Panel**:
   - Click your profile icon (top right)
   - You should see **"Admin Panel"** in the dropdown

---

## ✅ Step 5: Direct Access Test

Even if the menu doesn't show, try accessing directly:

1. Go to: **http://localhost:3000/admin**
2. If you see the admin dashboard → **It's working!**
3. If you get redirected → Role not set correctly (go back to Step 1)

---

## 🔧 Quick Fix SQL (All-in-One)

Run this in Supabase SQL Editor to fix everything at once:

```sql
-- Step 1: Ensure profile exists with admin role
INSERT INTO profiles (id, email, role, full_name)
SELECT 
  id, 
  email, 
  'admin'::user_role,
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User')
FROM auth.users
WHERE email = 'anilbhoi0008@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin'::user_role,
  email = EXCLUDED.email;
```

This will:
- ✅ Create profile if it doesn't exist
- ✅ Set role to admin
- ✅ Update existing profile to admin if it exists

---

## 🐛 Debug: Check Current Status

Create a test page to see what's happening:

1. **Go to**: http://localhost:3000/admin (even if redirected)
2. **Open browser console** (F12 → Console tab)
3. **Look for errors** related to:
   - "profiles" table
   - "role" field
   - Authentication errors

---

## ✅ Verification Checklist

After following all steps:

- [ ] Profile exists in `profiles` table
- [ ] Role is set to `'admin'` (lowercase, with quotes)
- [ ] Logged out and logged back in
- [ ] Can access http://localhost:3000/admin
- [ ] See "Admin Panel" in user menu

---

## 🆘 Still Not Working?

### Check 1: RLS Policies
Make sure Row Level Security allows you to read your profile:

```sql
-- Check if you can read your profile
SELECT * FROM profiles WHERE email = 'anilbhoi0008@gmail.com';
```

If this fails, RLS might be blocking. The schema should have policies, but verify.

### Check 2: User ID Match
The profile `id` must match the `auth.users.id`:

```sql
-- Check both
SELECT id, email FROM auth.users WHERE email = 'anilbhoi0008@gmail.com';
SELECT id, email, role FROM profiles WHERE email = 'anilbhoi0008@gmail.com';
```

Both `id` values should be **exactly the same**.

### Check 3: Restart Dev Server
Sometimes the app needs a restart:

1. Stop the dev server (Ctrl+C)
2. Run `npm run dev` again
3. Login fresh

---

## 🎯 Expected Result

After fixing, when you login:
- ✅ Profile icon shows in header
- ✅ Clicking it shows dropdown with "Admin Panel"
- ✅ Can access `/admin` directly
- ✅ See dashboard with analytics
- ✅ Can access `/admin/posters` and `/admin/orders`

---

## 💡 Pro Tip

If you're still having issues, share:
1. The result of: `SELECT id, email, role FROM profiles WHERE email = 'anilbhoi0008@gmail.com';`
2. Any console errors (F12 → Console)
3. What happens when you go to `/admin`

This will help diagnose the exact issue!

