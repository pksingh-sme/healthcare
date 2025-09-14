# Deployment Guide for ClinicEase AI Healthcare Management System

## Prerequisites

1. Node.js 18.x or higher
2. PostgreSQL database
3. Environment variables properly configured

## Production Build and Deployment

### Step 1: Install Dependencies

```bash
npm ci --only=production
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Build the Application

```bash
npm run build
```

This command will:
- Create an optimized production build of the Next.js application
- Generate all necessary static assets
- Prepare the application for production deployment

### Step 4: Configure Environment Variables

Create a `.env.production` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database_name"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-production-domain.com"

# Application URLs
NEXT_PUBLIC_SITE_URL="https://your-production-domain.com"

# Optional services (configure as needed)
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"
OPENAI_API_KEY="your-openai-api-key"
```

### Step 5: Start the Production Server

```bash
npm run start
```

This will start the application using the production-optimized server on port 3001.

## Deployment Options

### Vercel Deployment (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure the environment variables in the Vercel dashboard
3. Set the build command to `npm run vercel-build`
4. Set the output directory to `.next`
5. Deploy!

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t clinicease-ai .
   ```

2. Run the container:
   ```bash
   docker run -p 3001:3001 --env-file .env.production clinicease-ai
   ```

### AWS Deployment

Refer to [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) for detailed AWS deployment instructions.

## Health Check

The application includes a health check endpoint at `/api/health` which can be used for monitoring:

```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "ISO_TIMESTAMP",
  "service": "ClinicEase AI Healthcare Management System by Clinch Infosystems"
}
```

## HIPAA Compliance for Production

When deploying in a HIPAA environment, ensure:

1. All data is encrypted at rest and in transit
2. Proper access controls are implemented
3. Audit logging is enabled
4. Regular security assessments are performed
5. Business Associate Agreements are in place for all subprocessors

## Troubleshooting

### Build Issues

If you encounter build issues:

1. Clear the build cache:
   ```bash
   rm -rf .next
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Try building again:
   ```bash
   npm run build
   ```

### Runtime Issues

1. Check that all environment variables are properly set
2. Verify database connectivity
3. Ensure the database schema is up to date:
   ```bash
   npx prisma migrate deploy
   ```

### Performance Optimization

1. Use a CDN for static assets
2. Enable compression in your reverse proxy
3. Configure proper caching headers
4. Monitor application performance and optimize database queries as needed