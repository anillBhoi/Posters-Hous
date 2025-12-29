-- ============================================
-- FIX FOR INFINITE RECURSION IN RLS POLICIES
-- This fixes the "infinite recursion detected in policy" error
-- Run these commands in Supabase SQL Editor
-- ============================================

-- STEP 1: Create a SECURITY DEFINER function to check if user is admin
-- This function bypasses RLS, preventing infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- STEP 2: Drop the problematic admin policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage posters" ON public.posters;
DROP POLICY IF EXISTS "Admins can manage poster sizes" ON public.poster_sizes;
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage banners" ON public.banners;

-- STEP 3: Recreate all admin policies using the is_admin() function
-- This prevents recursion because is_admin() uses SECURITY DEFINER

-- Profiles: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR SELECT USING (public.is_admin());

-- Categories: Admins can manage categories
CREATE POLICY "Admins can manage categories" ON public.categories 
FOR ALL USING (public.is_admin());

-- Posters: Admins can manage posters
CREATE POLICY "Admins can manage posters" ON public.posters 
FOR ALL USING (public.is_admin());

-- Poster sizes: Admins can manage poster sizes
CREATE POLICY "Admins can manage poster sizes" ON public.poster_sizes 
FOR ALL USING (public.is_admin());

-- Coupons: Admins can manage coupons
CREATE POLICY "Admins can manage coupons" ON public.coupons 
FOR ALL USING (public.is_admin());

-- Orders: Admins can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders 
FOR SELECT USING (public.is_admin());

-- Orders: Admins can update orders
CREATE POLICY "Admins can update orders" ON public.orders 
FOR UPDATE USING (public.is_admin());

-- Order items: Admins can view all order items
CREATE POLICY "Admins can view all order items" ON public.order_items 
FOR SELECT USING (public.is_admin());

-- Banners: Admins can manage banners
CREATE POLICY "Admins can manage banners" ON public.banners 
FOR ALL USING (public.is_admin());

-- ============================================
-- VERIFICATION
-- ============================================
-- Test that the function works (should return true/false without recursion)
SELECT public.is_admin() AS is_current_user_admin;

-- Check all policies are created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'categories', 'posters', 'poster_sizes', 'coupons', 'orders', 'order_items', 'banners')
ORDER BY tablename, policyname;

