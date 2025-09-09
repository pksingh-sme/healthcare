import { PrismaClient, BillingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function fixBillingStatuses() {
  try {
    console.log('Checking for billing status inconsistencies...');
    
    // Find all billing records
    const allRecords = await prisma.billing.findMany();
    
    let fixedCount = 0;
    
    // Check each record for inconsistencies
    for (const record of allRecords) {
      let correctStatus: BillingStatus = record.status;
      
      // Determine what the status should be based on paidAmount
      if (record.paidAmount >= record.total - 0.01) {
        correctStatus = BillingStatus.PAID;
      } else if (record.paidAmount > 0) {
        correctStatus = BillingStatus.PARTIAL;
      } else if (record.paidAmount === 0) {
        correctStatus = BillingStatus.PENDING;
      }
      
      // If status is incorrect, update it
      if (record.status !== correctStatus) {
        await prisma.billing.update({
          where: { id: record.id },
          data: { status: correctStatus },
        });
        console.log(`Fixed record ${record.invoiceNumber}: updated status from ${record.status} to ${correctStatus}`);
        fixedCount++;
      }
    }
    
    console.log(`Billing status correction completed. Fixed ${fixedCount} records.`);
  } catch (error) {
    console.error('Error fixing billing statuses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBillingStatuses();