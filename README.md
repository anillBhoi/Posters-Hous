# LuxenArt - Premium Poster E-commerce Platform

A modern, full-featured e-commerce platform for selling premium art posters, built with Next.js 15, Supabase, and Razorpay.

## Features

### User-Facing Features
- 🏠 **Homepage** with hero banner, featured posters, and categories
- 🖼️ **Gallery** with advanced filters (category, price, size), sorting, and search
- 📱 **Poster Detail Pages** with image zoom, size selection, and quick add to cart
- 🛒 **Shopping Cart** with quantity management and dynamic pricing
- 💳 **Checkout Flow** with address management, coupon support, and multiple payment methods
- 👤 **User Dashboard** for order history, profile management, and address management
- 🔐 **Authentication** with email/password and Google OAuth
- 📧 **Password Reset** functionality

### Admin Features
- 📊 **Admin Dashboard** with KPIs and analytics
- 🎨 **Poster Management** - Full CRUD operations with image upload
- 📦 **Order Management** - View, update status, and track orders
- 🏷️ **Category Management** - Organize products by categories
- 🎫 **Coupon Management** - Create and manage discount codes
- 👥 **User Management** - View and manage user accounts

### Technical Features
- ⚡ **Next.js 15** with App Router
- 🎨 **Tailwind CSS** with shadcn/ui components
- 🗄️ **Supabase** for database and authentication
- 💰 **Razorpay** payment gateway integration
- 📸 **Image Upload** support (Cloudinary/S3 ready)
- 🔒 **Row Level Security** (RLS) for data protection
- 📱 **Fully Responsive** design
- ⚙️ **TypeScript** for type safety
- 🎯 **SEO Optimized**

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payments**: Razorpay
- **Image Storage**: Cloudinary / AWS S3 (configurable)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gallery-canvas-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Set up the database**
   - Go to Supabase SQL Editor
   - Run the SQL script from `supabase/schema.sql`

5. **Create an admin user**
   - Sign up through the app
   - Update the user's role to 'admin' in Supabase:
     ```sql
     UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
     ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── gallery/           # Gallery/listing page
│   ├── poster/            # Poster detail pages
│   └── checkout/          # Checkout flow
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   ├── posters/      # Poster-related components
│   │   └── cart/         # Cart components
│   ├── context/          # React contexts
│   ├── lib/              # Utility functions
│   └── integrations/     # Third-party integrations
├── supabase/
│   └── schema.sql        # Database schema
└── public/               # Static assets
```

## Key Features Implementation

### Authentication
- Email/password authentication
- Google OAuth integration
- Password reset functionality
- Protected routes with role-based access

### E-commerce Flow
1. Browse posters in gallery with filters
2. View poster details with zoom
3. Add to cart with size selection
4. Checkout with address and payment
5. Order confirmation and tracking

### Admin Panel
- Protected admin routes
- Dashboard with KPIs
- Full CRUD for posters, categories, coupons
- Order management and status updates

### Payment Integration
- Razorpay integration
- Multiple payment methods (Card, UPI, COD)
- Payment verification
- Order status updates

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The database includes:
- `profiles` - User profiles
- `categories` - Product categories
- `posters` - Product posters
- `poster_sizes` - Size variants and pricing
- `orders` - Customer orders
- `order_items` - Order line items
- `coupons` - Discount coupons
- `addresses` - User addresses
- `banners` - Homepage banners

See `supabase/schema.sql` for complete schema.

## API Routes

- `GET /api/posters` - List posters with filters
- `GET /api/posters/[id]` - Get poster details
- `POST /api/posters` - Create poster (admin)
- `PUT /api/posters/[id]` - Update poster (admin)
- `DELETE /api/posters/[id]` - Delete poster (admin)
- `GET /api/categories` - List categories
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders
- `POST /api/coupons/validate` - Validate coupon

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Your License Here]

## Support

For support, email support@luxenart.com or open an issue in the repository.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database and auth by [Supabase](https://supabase.com/)
- Payments by [Razorpay](https://razorpay.com/)
