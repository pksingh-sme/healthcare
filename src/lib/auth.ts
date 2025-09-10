import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
// Add session timeout configuration
const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT || '28800', 10); // 8 hours default

export interface JWTPayload {
  userId: string
  email: string
  role: Role
  firstName: string
  lastName: string
}

export interface AuthenticatedUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  phone?: string
  twoFAEnabled: boolean
  patient?: {
    id: string
    userId: string
    dateOfBirth?: Date
    emergencyContact?: string
    insuranceProvider?: string
  }
  provider?: {
    id: string
    userId: string
    licenseNumber?: string
    specialty?: string
    department?: string
  }
}

export async function verifyTokenFromRequest(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const token = extractTokenFromHeaders(request.headers)
    if (!token) {
      return null
    }

    // Validate session
    const isSessionValid = await validateSession(token, request);
    if (!isSessionValid) {
      return null;
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    // Get user with relations
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        patient: true,
        provider: true,
      },
    })

    if (!user || !user.isActive) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone || undefined,
      twoFAEnabled: user.twoFAEnabled,
      patient: user.patient ? {
        id: user.patient.id,
        userId: user.patient.userId,
        dateOfBirth: user.patient.dateOfBirth || undefined,
        emergencyContact: user.patient.emergencyContact || undefined,
        insuranceProvider: user.patient.insuranceProvider || undefined,
      } : undefined,
      provider: user.provider ? {
        id: user.provider.id,
        userId: user.provider.userId,
        licenseNumber: user.provider.licenseNumber || undefined,
        specialty: user.provider.specialty || undefined,
        department: user.provider.department || undefined,
      } : undefined,
    }
  } catch (error) {
    console.error('Error verifying token from request:', error)
    return null
  }
}

// Enhanced session creation with security features
export async function createSession(userId: string, req?: NextRequest): Promise<string> {
  const token = generateToken({
    userId,
    email: '', // Will be populated when verifying
    role: Role.PATIENT, // Will be populated when verifying
    firstName: '',
    lastName: '',
  });

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + SESSION_TIMEOUT * 1000),
      ipAddress: req?.headers?.get('x-forwarded-for') || req?.headers?.get('x-real-ip') || undefined,
      userAgent: req?.headers?.get('user-agent') || undefined,
      lastActivityAt: new Date(),
    },
  });

  return token;
}

// Enhanced session validation with inactivity timeout
export async function validateSession(token: string, req?: NextRequest): Promise<boolean> {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session || session.expiresAt < new Date()) {
      return false;
    }

    // Check for inactivity timeout (30 minutes)
    const lastActivity = session.lastActivityAt || session.createdAt;
    const inactivityTime = Date.now() - lastActivity.getTime();
    if (inactivityTime > 30 * 60 * 1000) { // 30 minutes
      // Session expired due to inactivity
      await prisma.session.delete({
        where: { id: session.id },
      });
      return false;
    }

    // Update last activity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivityAt: new Date() },
    });

    // Check IP address match if available (optional security feature)
    if (process.env.ENFORCE_IP_BINDING === 'true' && session.ipAddress) {
      const currentIp = req?.headers?.get('x-forwarded-for') || req?.headers?.get('x-real-ip') || 'unknown';
      if (session.ipAddress !== currentIp) {
        // Log suspicious activity
        console.warn(`IP mismatch detected for session ${session.id}: ${session.ipAddress} vs ${currentIp}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function extractTokenFromHeaders(headers: Headers): string | null {
  const authorization = headers.get('authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }
  return authorization.substring(7)
}

export function hasPermission(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole)
}

// Role hierarchy for access control
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  [Role.ADMIN]: [Role.ADMIN, Role.PROVIDER, Role.PATIENT],
  [Role.PROVIDER]: [Role.PROVIDER, Role.PATIENT],
  [Role.PATIENT]: [Role.PATIENT],
}

export function canAccessRole(userRole: Role, targetRole: Role): boolean {
  return ROLE_HIERARCHY[userRole].includes(targetRole)
}

// 2FA utilities
export function generateTwoFASecret(): string {
  // In a real app, use speakeasy or similar library
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function verifyTwoFAToken(secret: string, token: string): boolean {
  // Simplified 2FA verification - in production, use proper TOTP library
  // For demo purposes, accept any 6-digit number
  return /^\d{6}$/.test(token)
}