import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'
import { comparePassword, hashPassword } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return errorResponse('Current password and new password are required', 400)
    }

    if (currentPassword === newPassword) {
      return errorResponse('New password must be different from current password', 400)
    }

    if (newPassword.length < 8) {
      return errorResponse('New password must be at least 8 characters long', 400)
    }

    // Find user with current password hash
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true }
    })

    if (!dbUser) {
      return errorResponse('User not found', 404)
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, dbUser.password)
    if (!isCurrentPasswordValid) {
      return errorResponse('Current password is incorrect', 400)
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    })

    return successResponse(null, 'Password changed successfully')
  } catch (error) {
    return handleApiError(error)
  }
}