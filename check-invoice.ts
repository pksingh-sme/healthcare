import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkInvoice() {
  try {
    const invoice = await prisma.billing.findUnique({
      where: { invoiceNumber: 'INV10008' },
      select: { 
        id: true, 
        invoiceNumber: true, 
        total: true, 
        paidAmount: true, 
        status: true 
      }
    });
    
    console.log('Invoice details:', invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkInvoice();