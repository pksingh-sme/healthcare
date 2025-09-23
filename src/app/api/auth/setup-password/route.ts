import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, hashPassword } from '@/lib/auth'
import { validatePassword, isPasswordCompromised } from '@/lib/password-validation'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Verify the token
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired setup token' },
        { status: 400 }
      )
    }

    // Validate password according to HIPAA and NIST guidelines
    const passwordValidation = await validatePassword(password, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email
    })

    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(', ') },
        { status: 400 }
      )
    }

    // Check if password has been compromised
    const isCompromised = await isPasswordCompromised(password)
    if (isCompromised) {
      return NextResponse.json(
        { error: 'Password has been found in breach databases. Please choose a different password.' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password)

    // Update the user's password
    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json(
      { message: 'Password has been set up successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Setup password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}