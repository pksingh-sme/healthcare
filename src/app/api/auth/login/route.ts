import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, createSession } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  twoFAToken: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, twoFAToken } = LoginSchema.parse(body)

    // Find user with patient or provider relation
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patient: true,
        provider: true,
      },
    })

    if (!user) {
      return errorResponse('Invalid credentials', 401)
    }

    if (!user.isActive) {
      return errorResponse('Account is deactivated', 401)
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return errorResponse('Invalid credentials', 401)
    }

    // Check 2FA if enabled
    if (user.twoFAEnabled) {
      if (!twoFAToken) {
        return errorResponse('2FA token required', 401)
      }
      // In production, implement proper 2FA verification
      // For demo, accept any 6-digit token
      if (!/^\d{6}$/.test(twoFAToken)) {
        return errorResponse('Invalid 2FA token', 401)
      }
    }

    // Create enhanced session with security features
    const token = await createSession(user.id, request);

    // Return user data without password
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      twoFAEnabled: user.twoFAEnabled,
      patient: user.patient,
      provider: user.provider,
    }

    return successResponse(
      {
        user: userData,
        token,
      },
      'Login successful'
    )
  } catch (error) {
    return handleApiError(error)
  }
}