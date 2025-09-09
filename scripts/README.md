# Billing Status Validation Scripts

This directory contains scripts to validate and correct billing status inconsistencies in the ClinicEase AI system.

## Scripts

### fix-billing-status.ts
A TypeScript script that checks all billing records and corrects any status inconsistencies:
- Updates records with paidAmount >= total to PAID status
- Updates records with paidAmount = 0 to PENDING status
- Updates records with 0 < paidAmount < total to PARTIAL status

### validate-billing-status.js
A JavaScript version of the same validation script that can be run directly with Node.js.

## Usage

### One-time correction
```bash
npx tsx scripts/fix-billing-status.ts
```

or

```bash
node scripts/validate-billing-status.js
```

### Scheduled validation
To set up periodic validation, you can use cron jobs (Linux/Mac) or Task Scheduler (Windows):

#### Linux/Mac Cron Job
Add this line to your crontab (`crontab -e`) to run validation daily at 2 AM:
```
0 2 * * * cd /path/to/healthcare && node scripts/validate-billing-status.js >> /var/log/billing-validation.log 2>&1
```

#### Windows Task Scheduler
1. Open Task Scheduler
2. Create a new task
3. Set trigger to daily at 2 AM
4. Set action to run: `node C:\path\to\healthcare\scripts\validate-billing-status.js`
5. Set working directory to: `C:\path\to\healthcare`

## What the scripts do

The scripts automatically correct common billing status inconsistencies:
1. Records that are fully paid but not marked as PAID
2. Records with no payments but not marked as PENDING
3. Records with partial payments but not marked as PARTIAL

This ensures data integrity and prevents issues like the one with invoice INV10008.