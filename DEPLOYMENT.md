# Deployment Guide - LuxenArt E-commerce Platform

## Overview

This is a comprehensive deployment guide for the LuxenArt poster selling e-commerce platform built with Next.js 15, Supabase, and Razorpay.

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Razorpay account (for payments)
- Cloudinary account (for image uploads) - Optional
- AWS S3 account (alternative to Cloudinary) - Optional

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gallery-canvas-main
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Payment Gateway (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Image Upload (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Shipping Configuration
SHIPPING_FREE_THRESHOLD=2999
SHIPPING_COST=99
TAX_RATE=18
```

### 3. Database Setup (Supabase)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `supabase/schema.sql`
4. This will create all necessary tables, indexes, and RLS policies

### 4. Create Admin User

After running the schema, create an admin user:

1. Sign up a user through the application
2. Go to Supabase Dashboard > Authentication > Users
3. Note the user ID
4. Go to SQL Editor and run:

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = 'your-user-id-here';
```

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

### 3. Start Production Server

```bash
npm start
```

## Deployment Platforms

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

Vercel will automatically detect Next.js and configure everything.

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify dashboard
4. Deploy

### Railway/Render

1. Connect your GitHub repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

## Post-Deployment Checklist

- [ ] Verify Supabase connection
- [ ] Test user registration and login
- [ ] Test admin panel access
- [ ] Verify payment gateway integration
- [ ] Test order creation flow
- [ ] Verify email functionality (if configured)
- [ ] Test image uploads
- [ ] Verify RLS policies are working
- [ ] Test mobile responsiveness
- [ ] Set up error monitoring (Sentry, etc.)

## Payment Gateway Setup (Razorpay)

1. Create a Razorpay account
2. Get your Key ID and Key Secret from dashboard
3. Set up webhook URL: `https://your-domain.com/api/payments/webhook`
4. Configure webhook events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`

## Image Upload Setup

### Option 1: Cloudinary

1. Create Cloudinary account
2. Get API credentials
3. Configure upload preset
4. Update environment variables

### Option 2: AWS S3

1. Create S3 bucket
2. Configure CORS
3. Set up IAM user with S3 permissions
4. Update environment variables

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Use server-side environment variables for sensitive keys
3. **RLS Policies**: Ensure Row Level Security is enabled on all tables
4. **Rate Limiting**: Consider adding rate limiting for API routes
5. **CORS**: Configure CORS properly for API endpoints
6. **HTTPS**: Always use HTTPS in production

## Monitoring & Analytics

Consider setting up:
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Uptime monitoring (UptimeRobot, Pingdom)
- Performance monitoring (Vercel Analytics)

## Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Verify environment variables
   - Check Supabase project status
   - Verify RLS policies

2. **Payment Gateway Issues**
   - Verify Razorpay credentials
   - Check webhook configuration
   - Verify order creation flow

3. **Image Upload Failures**
   - Check Cloudinary/S3 credentials
   - Verify CORS configuration
   - Check file size limits

4. **Build Errors**
   - Clear `.next` folder
   - Delete `node_modules` and reinstall
   - Check TypeScript errors

## Support

For issues and questions, please refer to:
- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- Razorpay Documentation: https://razorpay.com/docs

## License

[Your License Here]

