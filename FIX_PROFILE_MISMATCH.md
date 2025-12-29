# Fix: Profile Not Found in Database

## 🔍 Problem

Your profile exists in Supabase, but the app can't find it. This usually means:
- The profile `id` doesn't match your `auth.users.id`
- The profile was created with a different ID

## ✅ Solution: Match the IDs

### Step 1: Get Your Auth User ID

In Supabase SQL Editor, run:

```sql
SELECT id, email FROM auth.users WHERE email = 'anilbhoi0008@gmail.com';
```

**Copy the `id`** (it's a UUID like: `17bab6cc-5316-4f91-9b93-b6128cbabd99`)

### Step 2: Check Current Profile ID

```sql
SELECT id, email, role FROM profiles WHERE email = 'anilbhoi0008@gmail.com';
```

**Compare the IDs** - they should be EXACTLY the same!

### Step 3: Fix the Profile ID

If the IDs don't match, run this (replace with your actual auth.users.id):

```sql
-- Delete the old profile with wrong ID
DELETE FROM profiles WHERE email = 'anilbhoi0008@gmail.com';

-- Create new profile with correct ID
INSERT INTO profiles (id, email, role, full_name)
SELECT 
  id, 
  email, 
  'admin'::user_role,
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User')
FROM auth.users
WHERE email = 'anilbhoi0008@gmail.com';
```

### Step 4: Verify

```sql
-- Check both IDs match
SELECT 
  u.id as auth_id,
  u.email,
  p.id as profile_id,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'anilbhoi0008@gmail.com';
```

Both `auth_id` and `profile_id` should be **exactly the same**.

### Step 5: Refresh App

1. **Logout** from the app
2. **Login again**
3. Check debug page: http://localhost:3000/admin/debug
4. Should now show "Profile Loaded: Yes" and "Is Admin: ✅ YES"

---

## 🚀 All-in-One Fix Query

Run this single query to fix everything:

```sql
-- This will delete any existing profile and create a new one with correct ID
DELETE FROM profiles WHERE email = 'anilbhoi0008@gmail.com';

INSERT INTO profiles (id, email, role, full_name)
SELECT 
  id, 
  email, 
  'admin'::user_role,
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User')
FROM auth.users
WHERE email = 'anilbhoi0008@gmail.com';
```

Then logout and login again!

