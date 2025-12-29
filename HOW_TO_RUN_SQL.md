# How to Run SQL Query in Supabase - Step by Step

## 📍 Where to Run the SQL Query

You need to run it in **Supabase Dashboard → SQL Editor**

---

## 🎯 Step-by-Step Instructions

### Step 1: Open Supabase Dashboard
1. Go to **https://supabase.com**
2. **Sign in** to your account
3. Click on your project (the one you created earlier)

### Step 2: Navigate to SQL Editor
1. Look at the **left sidebar** in Supabase dashboard
2. Find and click **"SQL Editor"** 
   - It has an icon that looks like `</>` or a code symbol
   - It's usually in the left menu, below "Table Editor"

### Step 3: Create New Query
1. In the SQL Editor page, click the **"New query"** button
   - It's usually at the top left or center
   - Or you'll see a blank editor area

### Step 4: Paste Your SQL Query
1. **Copy** this exact query:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'anilbhoi0008@gmail.com';
```

2. **Paste** it into the SQL Editor text area

### Step 5: Run the Query
1. Click the **"Run"** button (usually green, at the bottom right)
   - OR press **Ctrl + Enter** (Windows) or **Cmd + Enter** (Mac)
2. Wait a few seconds

### Step 6: Check the Result
1. You should see a message like:
   - ✅ **"Success. No rows returned"** OR
   - ✅ **"1 row updated"**
2. This means it worked!

### Step 7: Verify It Worked (Optional)
1. In the same SQL Editor, run this query to check:

```sql
SELECT email, role FROM profiles WHERE email = 'anilbhoi0008@gmail.com';
```

2. You should see:
   - `email`: `anilbhoi0008@gmail.com`
   - `role`: `admin`

---

## 🖼️ Visual Guide

```
Supabase Dashboard
├── Table Editor
├── SQL Editor  ← CLICK HERE
├── Authentication
└── Settings
```

Inside SQL Editor:
```
┌─────────────────────────────────┐
│  New query                      │
├─────────────────────────────────┤
│                                 │
│  [Paste your SQL here]          │
│                                 │
│                                 │
├─────────────────────────────────┤
│              [Run] button        │
└─────────────────────────────────┘
```

---

## ✅ Quick Checklist

- [ ] Opened Supabase Dashboard
- [ ] Clicked "SQL Editor" in left sidebar
- [ ] Clicked "New query"
- [ ] Pasted the UPDATE query
- [ ] Clicked "Run" (or pressed Ctrl+Enter)
- [ ] Saw "Success" message
- [ ] (Optional) Verified with SELECT query

---

## 🚨 Troubleshooting

### "SQL Editor not found"
- Look in the **left sidebar** menu
- It might be under a menu icon (☰) if sidebar is collapsed
- Try scrolling down in the sidebar

### "No rows updated" or "0 rows affected"
- Check the email is correct (case-sensitive)
- Make sure the user exists in `profiles` table
- Try this first to check if user exists:
  ```sql
  SELECT * FROM profiles WHERE email = 'anilbhoi0008@gmail.com';
  ```

### "Table 'profiles' does not exist"
- You need to run the schema first!
- Go back and run `supabase/schema.sql` in SQL Editor
- Then try the UPDATE query again

### "Permission denied"
- Make sure you're logged into the correct Supabase project
- Check you have admin access to the project

---

## 💡 Pro Tip

After running the UPDATE query:
1. **Logout** from your app (if logged in)
2. **Login again** at http://localhost:3000/login
3. You should now see "Admin Panel" in your user menu!

---

## 🎯 Your Exact Query

Copy and paste this:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'anilbhoi0008@gmail.com';
```

Then click **Run**! ✅

