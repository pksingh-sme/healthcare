import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api'
import { Role } from '@prisma/client'
import { validatePassword, isPasswordCompromised } from '@/lib/password-validation'
import bcrypt from 'bcryptjs'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

const ProviderSchema = z.object({
  email: z.string().email('Invalid email format'),
  // Remove password requirement for provider creation
  // password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  // Provider specific fields
  title: z.string().optional(),
  specialty: z.string().optional(),
  licenseNumber: z.string().optional(),
  department: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = ProviderSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return errorResponse('User with this email already exists', 409)
    }

    // Generate a temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

    // Hash the temporary password
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12)

    // Create user with transaction (with temporary password)
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: Role.PROVIDER,
        },
      })

      // Create provider profile
      await tx.provider.create({
        data: {
          userId: user.id,
          title: data.title,
          specialty: data.specialty,
          licenseNumber: data.licenseNumber,
          department: data.department,
        },
      })

      return user
    })

    // Send password setup email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/send-password-setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          userId: result.id,
        }),
      })
    } catch (emailError) {
      console.error('Failed to send password setup email:', emailError)
      // Don't fail the whole operation if email sending fails
    }

    // Get user with relations
    const userWithRelations = await prisma.user.findUnique({
      where: { id: result.id },
      include: {
        provider: true,
      },
    })

    const userData = {
      id: userWithRelations!.id,
      email: userWithRelations!.email,
      firstName: userWithRelations!.firstName,
      lastName: userWithRelations!.lastName,
      role: userWithRelations!.role,
      phone: userWithRelations!.phone,
      profileImage: userWithRelations!.profileImage,
      twoFAEnabled: userWithRelations!.twoFAEnabled,
      provider: userWithRelations!.provider,
    }

    return successResponse(
      {
        user: userData,
      },
      'Provider created successfully. A password setup email has been sent to the provider.',
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}