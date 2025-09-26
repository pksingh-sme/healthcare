import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'
import { sendPasswordSetupEmail } from '@/lib/email'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, firstName, userId } = body

    if (!email || !firstName || !userId) {
      return NextResponse.json(
        { error: 'Email, firstName, and userId are required' },
        { status: 400 }
      )
    }

    // Fetch user's last name and role from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastName: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate a setup token
    const setupToken = generateToken({
      userId,
      email,
      firstName,
      lastName: user.lastName,
      role: user.role,
    })

    // Send the password setup email
    await sendPasswordSetupEmail(email, firstName, setupToken)

    return NextResponse.json(
      { message: 'Password setup email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Send password setup email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}