import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixInvoice() {
  try {
    // Find the specific invoice
    const invoice = await prisma.billing.findUnique({
      where: {
        invoiceNumber: 'INV10008'
      }
    });

    if (!invoice) {
      console.log('Invoice INV10008 not found');
      return;
    }

    console.log('Current invoice status:', invoice);
    
    // Check if the invoice is fully paid
    if (invoice.paidAmount >= invoice.total - 0.01) {
      // Update the status to PAID
      const updatedInvoice = await prisma.billing.update({
        where: {
          invoiceNumber: 'INV10008'
        },
        data: {
          status: 'PAID'
        }
      });
      
      console.log('Invoice status updated to PAID:', updatedInvoice);
    } else {
      console.log('Invoice is not fully paid. No update needed.');
      console.log(`Paid: ${invoice.paidAmount}, Total: ${invoice.total}, Balance: ${invoice.total - invoice.paidAmount}`);
    }
  } catch (error) {
    console.error('Error fixing invoice:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixInvoice();