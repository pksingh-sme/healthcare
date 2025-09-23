import nodemailer from 'nodemailer'
import { Transporter } from 'nodemailer'

// Email configuration - using environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com'
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587')
const EMAIL_USER = process.env.EMAIL_USER || '' // Will be set in .env.local
const EMAIL_PASS = process.env.EMAIL_PASS || '' // Will be set in .env.local
const EMAIL_FROM = process.env.EMAIL_FROM || 'ClinicEase AI <no-reply@clinicease.ai>'

let transporter: Transporter | null = null

// Create transporter only if credentials are provided
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  })

  // Verify transporter configuration
  transporter.verify((error: Error | null, success: boolean) => {
    if (error) {
      console.error('Email transporter configuration error:', error)
    } else {
      console.log('Email transporter is ready to send messages')
    }
  })
} else {
  console.warn('Email credentials not configured. Email features will be disabled.')
}

/**
 * Send 2FA code via email
 * @param to Recipient email address
 * @param code 6-digit 2FA code
 * @returns Promise resolving to sent message info
 */
export async function send2FACode(to: string, code: string) {
  if (!transporter) {
    console.warn('Email transporter not configured. Skipping email send.')
    return Promise.resolve()
  }

  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject: 'ClinicEase AI - Your 2FA Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">ClinicEase AI</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Your 2FA Verification Code</h2>
          <p>Hello,</p>
          <p>You have requested to enable two-factor authentication on your ClinicEase AI account. Please use the following code to complete the process:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; padding: 15px 30px; background: #f5f5f5; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
              ${code}
            </div>
          </div>
          
          <p>This code will expire in 10 minutes. If you didn't request this code, please ignore this email or contact our support team.</p>
          
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
    console.log(`2FA code email sent successfully to ${to}`)
    return result
  } catch (error) {
    console.error(`Failed to send 2FA code email to ${to}:`, error)
    throw error
  }
}

/**
 * Send 2FA login code via email
 * @param to Recipient email address
 * @param code 6-digit 2FA code
 * @returns Promise resolving to sent message info
 */
export async function send2FALoginCode(to: string, code: string) {
  if (!transporter) {
    console.warn('Email transporter not configured. Skipping email send.')
    return Promise.resolve()
  }

  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject: 'ClinicEase AI - Login Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">ClinicEase AI</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Your Login Verification Code</h2>
          <p>Hello,</p>
          <p>You are logging into your ClinicEase AI account. Please use the following verification code to complete your login:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; padding: 15px 30px; background: #f5f5f5; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
              ${code}
            </div>
          </div>
          
          <p>This code will expire in 10 minutes. If you didn't attempt to log in, please change your password immediately.</p>
          
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
    console.log(`2FA login code email sent successfully to ${to}`)
    return result
  } catch (error) {
    console.error(`Failed to send 2FA login code email to ${to}:`, error)
    throw error
  }
}