import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { send2FALoginCode } from '@/lib/email'
import { errorResponse, handleApiError } from '@/lib/api'

const Send2FASchema = z.object({
  email: z.string().email('Invalid email format'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = Send2FASchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return errorResponse('User not found', 404)
    }

    if (!user.twoFAEnabled) {
      return errorResponse('2FA is not enabled for this user', 400)
    }

    // Generate and send 2FA code via email
    const code = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit code
    try {
      await send2FALoginCode(user.email, code)
      console.log(`2FA code resent to ${user.email}: ${code}`)
      return new Response(JSON.stringify({ message: '2FA code sent successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Failed to send 2FA code:', error)
      return errorResponse('Failed to send 2FA code. Please try again.', 500)
    }
  } catch (error) {
    return handleApiError(error)
  }
}