# Email-based 2FA Setup

This document explains how to configure email-based two-factor authentication for ClinicEase AI.

## Prerequisites

1. A Gmail account (or other email provider) with app password enabled
2. Access to the application's environment variables

## Setup Instructions

### 1. Configure Environment Variables

Add the following variables to your `.env.local` file:

```env
# Email Configuration for 2FA
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="ClinicEase AI <no-reply@clinicease.ai>"
```

### 2. Gmail Specific Setup

If using Gmail, you need to:

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password as the `EMAIL_PASS` value

### 3. Testing the Setup

1. Run the test script to verify email functionality:
   ```bash
   npm run test-email-2fa
   ```

2. Enable 2FA for a specific user:
   ```bash
   npm run enable-2fa
   ```

## How It Works

1. When a user with 2FA enabled logs in, the system:
   - Verifies email and password
   - Generates a 6-digit code
   - Sends the code to the user's email
   - Prompts the user to enter the code

2. The user receives an email with the 6-digit code and enters it in the login form

3. Upon successful 2FA verification, the user is logged in

## Security Considerations

- App passwords are more secure than regular passwords for this use case
- Codes expire after 10 minutes
- Rate limiting should be implemented to prevent abuse
- All 2FA attempts are logged for security monitoring

## Troubleshooting

### Common Issues

1. **"Invalid login" error**: 
   - Ensure EMAIL_USER and EMAIL_PASS are correct
   - Verify app password is being used, not regular password

2. **"Service not available" error**:
   - Check network connectivity
   - Verify EMAIL_HOST and EMAIL_PORT are correct

3. **Emails not arriving**:
   - Check spam/junk folder
   - Verify recipient email address is correct
   - Check Gmail's "Sent" folder to confirm email was sent

### Testing Without Email

For development/testing without email configuration:
- The system will log a warning but continue with the login process
- You can use any 6-digit code for 2FA verification in development mode