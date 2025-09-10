import { prisma } from '@/lib/prisma';

export interface AuditLogData {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditEvent(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw error to avoid disrupting main application flow
  }
}

export async function logPHIAccess(
  userId: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: string,
  req?: any
): Promise<void> {
  await logAuditEvent({
    userId,
    action,
    resourceType,
    resourceId,
    details,
    ipAddress: req?.headers?.get('x-forwarded-for') || req?.headers?.get('x-real-ip') || undefined,
    userAgent: req?.headers?.get('user-agent') || undefined,
  });
}