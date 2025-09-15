# Vercel Deployment Guide for ClinicEase AI Healthcare Management System

## Overview

This guide explains how to deploy the ClinicEase AI Healthcare Management System to Vercel. Due to the application's use of Socket.IO for real-time messaging, special considerations are needed for Vercel deployment.

## Prerequisites

1. A Vercel account
2. A GitHub/GitLab/Bitbucket repository with the application code
3. A PostgreSQL database (can be hosted on services like Supabase, Railway, or Vercel Postgres)

## Deployment Steps

### Step 1: Prepare Your Repository

1. Ensure all code changes are committed and pushed to your repository 
2. Remove any sensitive files from the repository (use `.gitignore`)
3. Verify that the following files exist in your repository:
   - `package.json`
   - `next.config.js`
   - `vercel.json`
   - `prisma/schema.prisma`

### Step 2: Configure Environment Variables

In the Vercel dashboard, add the following environment variables:

```
# Database
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# Authentication
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# Application URLs
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app

# Optional services (configure as needed)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
OPENAI_API_KEY=your-openai-api-key
```

### Step 3: Connect to Vercel

1. Go to the Vercel dashboard
2. Click "New Project"
3. Import your Git repository
4. Configure the project settings:
   - Framework Preset: Next.js
   - Build Command: `npm run vercel-build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy your application
3. The first build may take several minutes

## Important Notes

### Socket.IO Limitations

Vercel Serverless Functions do not support long-running connections like Socket.IO. For real-time messaging functionality:

1. **Option 1 (Recommended)**: Use a separate dedicated Socket.IO server deployed on a platform that supports WebSockets (like AWS, DigitalOcean, or a VPS)
2. **Option 2**: Use a service like Pusher or Ably for real-time communication
3. **Option 3**: Consider using Vercel's experimental serverless-websocket support (if available)

### Custom Server

The application uses a custom server (`server.ts`) for Socket.IO functionality. Vercel does not support custom servers. The application has been modified to work with Vercel's standard deployment process:

- The `start` script in `package.json` now uses `next start` instead of the custom server
- A placeholder Socket.IO API route has been created at `/api/socket/route.ts`

### Health Check

The application includes a health check endpoint at `/api/health` which returns:

```json
{
  "status": "ok",
  "timestamp": "ISO_TIMESTAMP",
  "service": "ClinicEase AI Healthcare Management System"
}
```

## Troubleshooting

### Build Issues

If you encounter build issues:

1. Check the build logs in the Vercel dashboard
2. Ensure all dependencies are correctly listed in `package.json`
3. Verify that the Prisma schema is valid
4. Make sure environment variables are properly configured

### Runtime Issues

1. Check that all environment variables are properly set in the Vercel dashboard
2. Verify database connectivity
3. Ensure the database schema is up to date:
   ```bash
   npx prisma migrate deploy
   ```

### Performance Optimization

1. Use Vercel's built-in CDN for static assets
2. Enable compression through Vercel's configuration
3. Configure proper caching headers in `next.config.js`
4. Monitor application performance through Vercel Analytics

## Post-Deployment Steps

### Database Seeding

After deployment, you may want to seed the database with initial data:

1. Connect to your production database
2. Run the seed script:
   ```bash
   npx prisma db seed
   ```

### User Setup

Create initial users using the registration interface or by directly inserting records into the database.

## Support

For additional support with deployment, please contact the development team at Clinch Infosystems.

This concludes the Vercel deployment guide for the ClinicEase AI Healthcare Management System.