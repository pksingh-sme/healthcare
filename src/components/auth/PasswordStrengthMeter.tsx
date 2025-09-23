'use client'

import React from 'react'
import { validatePassword } from '@/lib/password-validation'

interface PasswordStrengthMeterProps {
  password: string
  personalInfo?: {
    firstName?: string
    lastName?: string
    email?: string
  }
}

export default function PasswordStrengthMeter({ password, personalInfo }: PasswordStrengthMeterProps) {
  const [validationResult, setValidationResult] = React.useState<any>(null)
  const [isChecking, setIsChecking] = React.useState(false)

  React.useEffect(() => {
    if (password.length > 0) {
      setIsChecking(true)
      validatePassword(password, personalInfo)
        .then(result => {
          setValidationResult(result)
          setIsChecking(false)
        })
        .catch(() => {
          setIsChecking(false)
        })
    } else {
      setValidationResult(null)
    }
  }, [password, personalInfo])

  if (!password) return null

  const getStrengthColor = () => {
    if (!validationResult) return 'bg-gray-200'
    
    switch (validationResult.strength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      case 'veryStrong': return 'bg-green-700'
      default: return 'bg-gray-200'
    }
  }

  const getStrengthText = () => {
    if (!validationResult) return ''
    
    switch (validationResult.strength) {
      case 'weak': return 'Weak'
      case 'medium': return 'Medium'
      case 'strong': return 'Strong'
      case 'veryStrong': return 'Very Strong'
      default: return ''
    }
  }

  const getStrengthWidth = () => {
    if (!validationResult) return 'w-0'
    
    switch (validationResult.strength) {
      case 'weak': return 'w-1/4'
      case 'medium': return 'w-2/4'
      case 'strong': return 'w-3/4'
      case 'veryStrong': return 'w-full'
      default: return 'w-0'
    }
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password Strength
        </span>
        {validationResult && (
          <span className={`text-sm font-medium ${getStrengthColor().includes('red') ? 'text-red-500' : getStrengthColor().includes('yellow') ? 'text-yellow-500' : 'text-green-500'}`}>
            {getStrengthText()}
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: password ? getStrengthWidth() : '0%' }}
        ></div>
      </div>
      
      {isChecking && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Checking password...
        </div>
      )}
      
      {validationResult && validationResult.errors.length > 0 && (
        <div className="mt-2">
          <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
            {validationResult.errors.map((error: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {validationResult && validationResult.suggestions.length > 0 && (
        <div className="mt-2">
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            {validationResult.suggestions.map((suggestion: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}