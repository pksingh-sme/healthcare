const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSessionCreation() {
  try {
    // First, let's get a user to test with
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found in the database');
      return;
    }

    // Test creating a session with the new fields
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: 'test-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        ipAddress: '::1',
        userAgent: 'Test User Agent',
        lastActivityAt: new Date(),
      },
    });

    console.log('Session created successfully:', session);

    // Clean up - delete the test session
    await prisma.session.delete({
      where: { id: session.id },
    });

    console.log('Test session cleaned up successfully');
  } catch (error) {
    console.error('Error testing session creation:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testSessionCreation();