'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { validatePassword, isPasswordCompromised } from '@/lib/password-validation'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter'

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const { user, token } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrors([])
    setSuccess(false)

    try {
      // Validate passwords
      if (!currentPassword) {
        setErrors(['Current password is required'])
        setIsSaving(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setErrors(['New passwords do not match'])
        setIsSaving(false)
        return
      }

      // Validate new password strength
      const personalInfo = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
      }

      const validation = await validatePassword(newPassword, personalInfo)
      
      if (!validation.isValid) {
        setErrors(validation.errors)
        setIsSaving(false)
        return
      }

      // Check if password is compromised
      const isCompromised = await isPasswordCompromised(newPassword)
      if (isCompromised) {
        setErrors(['This password has been compromised in a data breach. Please choose a different password.'])
        setIsSaving(false)
        return
      }

      // Submit password change request
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      // Reset form and show success
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess(true)
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Error changing password:', error)
      setErrors([error instanceof Error ? error.message : 'Failed to change password'])
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700">
        <DialogHeader>
          <DialogTitle className="text-purple-700 dark:text-purple-300 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Change Password
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Update your account password
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handlePasswordChange} className="space-y-4 py-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <ul className="text-sm text-red-600 list-disc pl-5 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="text-sm text-green-600">Password changed successfully!</div>
            </div>
          )}
          
          <div>
            <Label htmlFor="currentPassword" className="text-purple-700 dark:text-purple-300">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border-purple-200 dark:border-purple-700 focus:border-purple-500"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="newPassword" className="text-purple-700 dark:text-purple-300">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-purple-200 dark:border-purple-700 focus:border-purple-500"
              required
            />
            <PasswordStrengthMeter 
              password={newPassword} 
              personalInfo={{
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email
              }} 
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-purple-700 dark:text-purple-300">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-purple-200 dark:border-purple-700 focus:border-purple-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                setErrors([])
                setSuccess(false)
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
              }}
              disabled={isSaving}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}