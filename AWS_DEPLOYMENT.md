# AWS Deployment Guide for ClinicEase AI

This guide provides instructions for deploying the ClinicEase AI Healthcare Management System on AWS using either Elastic Beanstalk or ECS.

## Prerequisites

1. AWS Account
2. AWS CLI configured
3. Docker installed (for ECS deployment)
4. PostgreSQL database (AWS RDS recommended)

## Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended for simplicity)

1. **Prepare the application**:
   ```bash
   # Install dependencies
   npm install
   
   # Generate Prisma client
   npx prisma generate
   ```

2. **Create environment variables file**:
   Create a `.env.production` file with your production configuration:
   ```
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_production_jwt_secret
   NEXTAUTH_SECRET=your_production_nextauth_secret
   NEXTAUTH_URL=https://your-app-url.aws.eb.com
   ```

3. **Deploy to Elastic Beanstalk**:
   ```bash
   # Install EB CLI if not already installed
   pip install awsebcli
   
   # Initialize EB application
   eb init
   
   # Create environment and deploy
   eb create production
   eb deploy
   ```

### Option 2: AWS ECS (Recommended for scalability)

1. **Build Docker image**:
   ```bash
   docker build -t clinicease-ai .
   ```

2. **Push to ECR**:
   ```bash
   # Tag image
   docker tag clinicease-ai:latest your-account-id.dkr.ecr.region.amazonaws.com/clinicease-ai:latest
   
   # Push to ECR
   docker push your-account-id.dkr.ecr.region.amazonaws.com/clinicease-ai:latest
   ```

3. **Deploy to ECS**:
   - Create ECS task definition
   - Create ECS service
   - Configure load balancer
   - Set environment variables in ECS task definition

## Environment Configuration

Ensure the following environment variables are set:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Public URL of your application
- `NEXT_PUBLIC_SITE_URL` - Public URL of your application

## Health Checks

The application includes a health check endpoint at `/api/health` which returns:
```json
{
  "status": "ok",
  "timestamp": "ISO_TIMESTAMP",
  "service": "ClinicEase AI Healthcare Management System by Clinch Infosystems"
}
```

## Security Considerations

1. Ensure all secrets are stored in AWS Secrets Manager or Parameter Store
2. Use IAM roles for ECS tasks instead of hardcoding credentials
3. Enable encryption at rest and in transit
4. Configure VPC and security groups appropriately
5. Regularly update dependencies and monitor for vulnerabilities

## HIPAA Compliance

When deploying in a HIPAA environment:
1. Use AWS services that are HIPAA eligible
2. Sign a Business Associate Agreement (BAA) with AWS
3. Enable audit logging
4. Implement proper access controls
5. Encrypt all PHI at rest and in transit