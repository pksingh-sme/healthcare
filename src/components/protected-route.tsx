'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'PROVIDER' | 'PATIENT'
}

export function ProtectedRoute({ children, requiredRole = 'ADMIN' }: ProtectedRouteProps) {
  const { user, loading, token } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Wait until we're on the client and auth state is loaded
    if (!isClient) return
    
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push('/login')
    } else if (!loading && user && requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case 'ADMIN':
          router.push('/dashboard')
          break
        case 'PROVIDER':
          router.push('/dashboard')
          break
        case 'PATIENT':
          router.push('/patient')
          break
        default:
          router.push('/')
      }
    }
  }, [user, loading, router, requiredRole, isClient])

  // Show loading state while checking auth or while not on client
  if (!isClient || loading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Check if user is authenticated and has the required role
  if (user && (!requiredRole || user.role === requiredRole)) {
    return <>{children}</>
  }

  // If not authorized, return null (redirect will happen via useEffect)
  return null
}