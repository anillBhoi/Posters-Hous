# Admin Panel User Guide - For Non-Technical Users

## 🎉 Welcome to Your Admin Panel!

Your admin panel is now fully functional and easy to use. No coding knowledge required!

---

## 📊 Dashboard Overview

**Access**: http://localhost:3000/admin

The dashboard shows:
- **Total Revenue**: Money earned from all paid orders
- **Total Orders**: Number of orders received
- **Total Users**: Number of registered customers
- **Active Posters**: Number of posters available for sale

All numbers update automatically!

---

## 🖼️ Managing Posters (Add/Edit/Delete)

### Access: http://localhost:3000/admin/posters

### Adding a New Poster:

1. Click **"Add New Poster"** button (top right)
2. Fill in the form:
   - **Poster Title***: e.g., "Golden Waves"
   - **Artist Name***: e.g., "Luxen Art Studio"
   - **Category***: Select from dropdown
   - **Image URL***: Paste image link (see below for help)
   - **Description**: Write about the poster
   - **Featured**: Check if you want it on homepage
   - **New Arrival**: Check if it's a new product
   - **Status**: Active/Inactive/Draft

3. **Set Prices**:
   - Small: Enter price (e.g., 1299)
   - Medium: Enter price (e.g., 2499)
   - Large: Enter price (e.g., 3999)
   - Leave at 0 if you don't want to offer that size

4. Click **"Create Poster"**

### Editing a Poster:

1. Find the poster in the table
2. Click the **Edit icon** (pencil) in the Actions column
3. Make your changes
4. Click **"Update Poster"**

### Deleting a Poster:

1. Find the poster in the table
2. Click the **Delete icon** (trash) in the Actions column
3. Confirm deletion

---

## 📦 Managing Orders

### Access: http://localhost:3000/admin/orders

### Viewing Orders:

- See all orders in a table
- Each order shows: Order number, Customer, Date, Items, Total, Status

### Updating Order Status:

1. Find the order
2. Use the **Status dropdown** to change:
   - Pending → Processing → Shipped → Delivered
   - Or mark as Cancelled

### Adding Tracking Number:

1. Click the **Eye icon** to view order details
2. In the dialog, find "Tracking Information"
3. Enter tracking number
4. It saves automatically when you click away

### Viewing Order Details:

1. Click the **Eye icon** next to any order
2. See:
   - Customer information
   - Shipping address
   - All items in the order
   - Total amount
   - Update status and tracking

---

## 🖼️ How to Get Image URLs (For Posters)

### Option 1: Use Unsplash (Free, Easy)

1. Go to **https://unsplash.com**
2. Search for images (e.g., "abstract art", "nature")
3. Click on an image you like
4. Click **"Download"** button
5. Right-click the image → **"Copy image address"**
6. Paste that URL in the Image URL field

**Example**: `https://images.unsplash.com/photo-1541961017774-22349e4a1262`

### Option 2: Use Imgur (Free)

1. Go to **https://imgur.com**
2. Upload your image
3. Right-click the uploaded image → **"Copy image address"**
4. Paste in Image URL field

### Option 3: Use Your Own Hosting

If you have images on Google Drive, Dropbox, or your own website:
1. Get the direct image link
2. Make sure it's publicly accessible
3. Paste in Image URL field

### ⚠️ Important:
- Image must be publicly accessible (anyone can view it)
- Use direct image links (ending in .jpg, .png, etc.)
- Test the link in a new browser tab first

---

## 📊 Understanding Analytics

### Total Revenue:
- Shows money from **paid orders only**
- Updates automatically
- Includes percentage change from last month

### Total Orders:
- Count of all orders (paid and unpaid)
- Shows growth percentage

### Total Users:
- Number of registered customers
- Includes both regular users and admins

### Active Posters:
- Number of posters with status "active"
- Inactive or draft posters don't count

---

## ✅ Quick Tips

1. **Always set prices** for at least one size when adding posters
2. **Use clear, descriptive titles** for posters
3. **Update order status** as you process orders
4. **Add tracking numbers** when you ship orders
5. **Check dashboard regularly** to monitor sales

---

## 🆘 Common Questions

### "I can't see the admin panel"
- Make sure you're logged in as admin
- Check your email matches the admin user
- Try logging out and back in

### "Image not showing"
- Check the image URL is correct
- Make sure image is publicly accessible
- Try opening the URL in a new browser tab

### "Can't update order status"
- Make sure you're on the Orders page
- Click the dropdown and select new status
- It saves automatically

### "Numbers seem wrong"
- Click "Refresh Stats" button on dashboard
- Wait a few seconds for update

---

## 🎯 Workflow Example

**Adding a new poster:**
1. Find image on Unsplash
2. Copy image URL
3. Go to Admin → Posters → Add New Poster
4. Fill form, paste image URL, set prices
5. Click Create
6. Poster appears in gallery immediately!

**Processing an order:**
1. Go to Admin → Orders
2. Find new order
3. Change status: Pending → Processing
4. When shipped, add tracking number
5. Update status: Processing → Shipped
6. When delivered, update: Shipped → Delivered

---

## 🚀 You're All Set!

Your admin panel is ready to use. Start adding posters and managing orders!

**Need help?** Check the dashboard for quick links to all management pages.

