import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'
import nodemailer from 'nodemailer'

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic'

// Email configuration - using environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com'
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587')
const EMAIL_USER = process.env.EMAIL_USER || ''
const EMAIL_PASS = process.env.EMAIL_PASS || ''
const EMAIL_FROM = process.env.EMAIL_FROM || 'ClinicEase AI <no-reply@clinicease.ai>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

let transporter: nodemailer.Transporter | null = null

// Create transporter only if credentials are provided
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  })
}

/**
 * Send password setup email to newly created users
 * @param to Recipient email address
 * @param firstName User's first name
 * @param token Password setup token
 * @returns Promise resolving to sent message info
 */
export async function sendPasswordSetupEmail(to: string, firstName: string, token: string) {
  if (!transporter) {
    console.warn('Email transporter not configured. Skipping email send.')
    return Promise.resolve()
  }

  const setupLink = `${APP_URL}/setup-password?token=${token}`

  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject: 'ClinicEase AI - Set Up Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">ClinicEase AI</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Welcome to ClinicEase AI!</h2>
          <p>Hello ${firstName},</p>
          <p>Your administrator has created an account for you in ClinicEase AI. To get started, please set up your password by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${setupLink}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Set Up Your Password
            </a>
          </div>
          
          <p style="text-align: center; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="text-align: center; word-break: break-all; color: #666; font-size: 14px;">
            ${setupLink}
          </p>
          
          <p>This link will expire in 24 hours. If you didn't expect this email, please ignore it or contact your administrator.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              © ${new Date().getFullYear()} ClinicEase AI by Clinch Infosystems. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log(`Password setup email sent successfully to ${to}`)
    return result
  } catch (error) {
    console.error(`Failed to send password setup email to ${to}:`, error)
    throw error
  }
}

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