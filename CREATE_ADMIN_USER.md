# How to Create Admin User - Two Easy Methods

## ✅ Method 1: Direct in Supabase (EASIEST - Recommended)

This is the fastest way to create an admin user without using the signup page.

### Steps:

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Go to **Authentication** → **Users** (left sidebar)

2. **Create User Manually**
   - Click **"Add user"** or **"Create new user"** button
   - Fill in:
     - **Email**: `admin@PostersHous.com` (or your email)
     - **Password**: Create a strong password
     - **Auto Confirm User**: ✅ Check this box (important!)
   - Click **"Create user"**

3. **Make User Admin**
   - Go to **SQL Editor** in Supabase
   - Run this query (replace with your email):

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@luxenart.com';
```

4. **Verify**
   - Check the result - it should say "1 row updated"
   - Your user is now an admin!

5. **Login**
   - Go to http://localhost:3000/auth/login
   - Use the email and password you created
   - You'll now have admin access!

---

## ✅ Method 2: Use Signup Page (Alternative)

The signup page **IS built** and available. Here's how to access it:

### Steps:

1. **Start your dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Access Signup Page**:
   - Go to: **http://localhost:3000/signup**
   - OR click "Sign Up" button in the header

3. **Create Account**:
   - Fill in your details
   - Email: `admin@luxenart.com` (or your email)
   - Password: (at least 6 characters)
   - Click "Create Account"

4. **Verify Email** (if required):
   - Check your email for verification link
   - Click the link to verify

5. **Make User Admin**:
   - Go to Supabase → **SQL Editor**
   - Run this query:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

6. **Login**:
   - Go to http://localhost:3000/auth/login
   - Login with your credentials
   - You'll have admin access!

---

## 🔍 Troubleshooting

### "Signup page not found" or 404 error

The signup page route is `/signup` (not `/auth/signup`).

Try these URLs:
- ✅ http://localhost:3000/signup
- ✅ http://localhost:3000/auth/login (then click "Sign up" link)

### "Can't access admin panel"

After making user admin:
1. **Logout** from the app
2. **Login again** (to refresh the session)
3. Admin panel should be accessible at `/admin`

### "User not found" in SQL query

Make sure:
- Email matches exactly (case-sensitive)
- User was created successfully
- Check Supabase → Authentication → Users to see all users

---

## 🎯 Quick Admin Setup (Copy-Paste)

If you want the fastest method, use this SQL in Supabase SQL Editor:

```sql
-- First, create the user manually in Supabase Dashboard → Authentication → Users
-- Then run this (replace email):

UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify it worked:
SELECT id, email, role FROM profiles WHERE email = 'your-email@example.com';
```

The last query should show `role = 'admin'`.

---

## ✅ Verification Checklist

After creating admin user:
- [ ] User exists in Supabase → Authentication → Users
- [ ] SQL query updated role to 'admin'
- [ ] Can login at http://localhost:3000/auth/login
- [ ] Can access http://localhost:3000/admin
- [ ] See "Admin Panel" link in user menu

---

## 💡 Pro Tip

**Method 1 (Direct in Supabase)** is recommended because:
- ✅ Faster (no email verification needed)
- ✅ Works even if signup page has issues
- ✅ More control over user creation
- ✅ Can set password directly

Use **Method 2** if you want to test the full signup flow.

