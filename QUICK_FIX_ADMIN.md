# Quick Fix: Admin Access Not Working

## 🚀 Fastest Solution (3 Steps)

### Step 1: Verify in Supabase SQL Editor

Run this query:

```sql
SELECT id, email, role FROM profiles WHERE email = 'anilbhoi0008@gmail.com';
```

**If role is NOT 'admin'**, run:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'anilbhoi0008@gmail.com';
```

### Step 2: Use Debug Page

1. **Login** to your app
2. Go to: **http://localhost:3000/admin/debug**
3. This page will show:
   - Your current role status
   - Database profile info
   - A button to fix it automatically

4. **If role is wrong**, click **"Set My Role to Admin"** button
5. **Logout and login again**

### Step 3: Test Access

1. After logging in again, click your **profile icon** (top right)
2. You should see **"Admin Panel"** in the menu
3. Or go directly to: **http://localhost:3000/admin**

---

## ✅ All-in-One SQL Fix

If the profile doesn't exist or role is wrong, run this in Supabase SQL Editor:

```sql
-- This will create/update profile with admin role
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

Then:
1. **Logout** from the app
2. **Login again**
3. Check for Admin Panel

---

## 🎯 What You Should See

After fixing:
- ✅ Profile icon in header (when logged in)
- ✅ Clicking it shows "Admin Panel" option
- ✅ Can access http://localhost:3000/admin
- ✅ Can access http://localhost:3000/admin/posters
- ✅ Can access http://localhost:3000/admin/orders

---

## 🆘 Still Not Working?

1. **Check debug page**: http://localhost:3000/admin/debug
2. **Check browser console** (F12) for errors
3. **Verify in Supabase**: Run the SELECT query again
4. **Try incognito mode** to rule out cache issues

---

## 💡 Important Notes

- **Always logout and login again** after changing role in database
- The app caches your profile, so changes need a fresh login
- Make sure you're using the correct email (case-sensitive)

