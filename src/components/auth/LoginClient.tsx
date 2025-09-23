'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginClient() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFAToken: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [twoFASent, setTwoFASent] = useState(false)
  const { login, user, error: authError, twoFARequired } = useAuth()
  const router = useRouter()
  
  // Safely handle useSearchParams
  let searchParams;
  try {
    searchParams = useSearchParams()
  } catch (e) {
    searchParams = null
  }
  
  const roleFromQuery = searchParams?.get('role') || null

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === 'PATIENT') {
        router.push('/patient')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, router])

  useEffect(() => {
    // When 2FA is required, clear any previous errors and show info message
    if (twoFARequired) {
      setError('')
      setInfoMessage('Please enter the 2FA code sent to your email.')
    }
  }, [twoFARequired])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setInfoMessage('')

    try {
      const success = await login(
        formData.email,
        formData.password,
        twoFARequired ? formData.twoFAToken : undefined
      )

      if (!success) {
        // Only show error if it's not the 2FA flow
        if (!twoFARequired) {
          setError(authError || 'Login failed. Please check your credentials.')
        } else {
          setInfoMessage('Please enter the 2FA code sent to your email.')
        }
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSend2FA = async () => {
    setIsSubmitting(true)
    setError('')
    setInfoMessage('')
    
    try {
      const response = await fetch('/api/auth/send-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send 2FA code')
      }
      
      setTwoFASent(true)
      setInfoMessage('2FA code sent to your email. Please check your inbox.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send 2FA code')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg mx-auto">
            <svg className="w-10 h-10" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M53.5529 13.0146C53.5529 10.2546 52.081 7.71957 49.708 6.35457L42.1534 1.98957C39.7804 0.62457 36.8517 0.62457 34.4637 1.98957L4.20034 19.4346C1.82733 20.8146 0.355469 23.3496 0.355469 26.0796V28.6146C0.355469 31.3596 1.82733 33.8946 4.20034 35.2596L34.4637 52.7196C36.8367 54.0846 39.7654 54.0846 42.1534 52.7196L49.708 48.3546C52.081 46.9896 53.5529 44.4546 53.5529 41.7096C53.5529 37.4646 50.1135 34.0296 45.8631 34.0296H38.7741V40.4496L16.1405 27.3996L38.7741 14.3496V20.6946H45.8631C50.1135 20.6946 53.5529 17.2596 53.5529 13.0146Z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            ClinicEase <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Smarter Healthcare Management by Clinch Infosystems
          </p>
        </div>
        
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting || twoFARequired}
                      className="pl-10 py-6 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting || twoFARequired}
                      className="pl-10 py-6 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl"
                    />
                  </div>
                </div>

                {(twoFARequired || twoFASent) && (
                  <div className="space-y-2">
                    <Label htmlFor="twoFAToken" className="text-gray-700 dark:text-gray-300">2FA Code</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <Input
                        id="twoFAToken"
                        name="twoFAToken"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={formData.twoFAToken}
                        onChange={handleInputChange}
                        maxLength={6}
                        disabled={isSubmitting}
                        className="pl-10 py-6 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl"
                      />
                    </div>
                    {twoFASent && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        2FA code sent to your email. Please check your inbox.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Error messages */}
              {(error || authError) && !twoFARequired && (
                <div className="text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {error || authError}
                </div>
              )}

              {/* Info messages */}
              {infoMessage && (
                <div className="text-blue-600 text-sm text-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  {infoMessage}
                </div>
              )}

              {!twoFARequired ? (
                <Button 
                  type="submit" 
                  className="w-full clinic-gradient text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </Button>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full clinic-gradient text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : 'Verify 2FA Code'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleSend2FA}
                    disabled={isSubmitting}
                    className="w-full py-6 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resending...
                      </span>
                    ) : 'Resend 2FA Code'}
                  </Button>
                </div>
              )}
            </form>

            <div className="mt-8 text-center space-y-4">
              <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline block">
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Clinch Infosystems. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}