# Quick Start Guide - Run the Project Now

## Step 1: Install Dependencies (if not already done)

```bash
npm install
```

## Step 2: Set Up Supabase (Required)

### 2.1 Create Supabase Account
1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project

### 2.2 Get Your Supabase Credentials
1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

### 2.3 Set Up Database
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for "Success. No rows returned" message

## Step 3: Create Environment File

Create a file named `.env.local` in the root directory with:

```env
# Supabase (REQUIRED - Get from Step 2.2)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay (OPTIONAL for now - can add later for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# App URL (for development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace the Supabase values with your actual credentials from Step 2.2**

## Step 4: Create Admin User (Optional but Recommended)

1. Start the dev server (Step 5)
2. Go to http://localhost:3000/auth/signup
3. Create an account with your email
4. Go back to Supabase dashboard → **SQL Editor**
5. Run this query (replace with your email):

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Step 5: Run the Development Server

```bash
npm run dev
```

## Step 6: Open in Browser

Open http://localhost:3000 in your browser

## ✅ You're Done!

The project should now be running. You can:
- Browse the homepage
- View the gallery
- Sign up and login
- Add items to cart
- Test the checkout flow (payment won't work without Razorpay, but you can test the UI)

## Troubleshooting

### Error: "Supabase environment variables are not set"
- Make sure `.env.local` exists in the root directory
- Check that variable names start with `NEXT_PUBLIC_`
- Restart the dev server after creating `.env.local`

### Error: Database connection issues
- Verify your Supabase URL and key are correct
- Make sure you ran the schema.sql in Supabase SQL Editor
- Check Supabase project is active (not paused)

### Error: Module not found
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then run `npm install`

### Can't access admin panel
- Make sure you created an admin user (Step 4)
- Check your email matches in the SQL query

## Next Steps (Optional)

1. **Add Razorpay** (for payments):
   - Create Razorpay account
   - Get Key ID and Secret
   - Add to `.env.local`

2. **Add Sample Data**:
   - Use Supabase dashboard to add categories and posters manually
   - Or create admin panel pages to add data through UI

3. **Configure Image Upload**:
   - Set up Cloudinary or AWS S3
   - Add credentials to `.env.local`

