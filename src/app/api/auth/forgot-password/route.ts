import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // For security reasons, we don't reveal if the email exists
      return NextResponse.json(
        { message: 'Password reset instructions have been sent to your email.' },
        { status: 200 }
      )
    }

    // Generate a reset token (in a real app, this would be a separate token)
    // For now, we'll use a JWT with a short expiration
    const resetToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    // In a real application, you would:
    // 1. Save the reset token to the database with an expiration time
    // 2. Send an email with a link containing the token
    // For this implementation, we'll just return a success message
    
    // For demo purposes, we'll simulate sending an email
    console.log(`Reset password link: /reset-password?token=${resetToken}`)
    
    // In a real app, you would send an actual email here
    // await sendPasswordResetEmail(user.email, resetToken)

    return NextResponse.json(
      { message: 'Password reset instructions have been sent to your email.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}