-- ============================================
-- COMPLETE FIX FOR ADMIN USER CREATION
-- Run these commands in Supabase SQL Editor
-- ============================================

-- STEP 1: Check if user exists in auth.users
-- If this returns nothing, the user hasn't signed up yet!
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'anilbhoi9096@gmail.com';

-- STEP 2: If user exists, check ALL profiles (bypass RLS)
-- This will show all profiles regardless of RLS
SELECT id, email, role, full_name, created_at 
FROM public.profiles 
ORDER BY created_at DESC;

-- STEP 3: Check profiles with case-insensitive search
SELECT id, email, role, full_name
FROM public.profiles 
WHERE LOWER(email) LIKE '%anilbhoi%';

-- STEP 4: If user exists in auth.users, create/update profile
-- This uses SECURITY DEFINER to bypass RLS
DO $$
DECLARE
  user_id UUID;
  user_email TEXT;
BEGIN
  -- Get user from auth.users
  SELECT id, email INTO user_id, user_email
  FROM auth.users
  WHERE email = 'anilbhoi9096@gmail.com'
  LIMIT 1;
  
  -- If user exists, create/update profile
  IF user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, role, full_name)
    VALUES (
      user_id,
      user_email,
      'admin'::user_role,
      'Admin User'
    )
    ON CONFLICT (id) 
    DO UPDATE SET 
      role = 'admin'::user_role,
      email = EXCLUDED.email,
      updated_at = NOW();
    
    RAISE NOTICE 'Profile created/updated for user: %', user_email;
  ELSE
    RAISE NOTICE 'User not found in auth.users. User must sign up/login first!';
  END IF;
END $$;

-- STEP 5: Verify the profile was created (bypass RLS)
-- Use this to check without RLS restrictions
SELECT id, email, role, full_name, created_at, updated_at
FROM public.profiles 
WHERE email = 'anilbhoi9096@gmail.com';

-- ============================================
-- ALTERNATIVE: Direct INSERT (if you have the user ID)
-- ============================================
-- First get the user ID from Step 1, then use it here:
-- INSERT INTO public.profiles (id, email, role, full_name)
-- VALUES (
--   'PASTE_USER_ID_HERE',
--   'anilbhoi9096@gmail.com',
--   'admin'::user_role,
--   'Admin User'
-- )
-- ON CONFLICT (id) 
-- DO UPDATE SET 
--   role = 'admin'::user_role,
--   email = EXCLUDED.email,
--   updated_at = NOW();

