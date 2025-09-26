'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter'
import Link from 'next/link'
import { AlertCircle, CheckCircle } from 'lucide-react'

// Force this page to be dynamic and not statically generated
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import SetupPasswordContent from './SetupPasswordContent'

export default function SetupPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      }>
        <SetupPasswordContent />
      </Suspense>
    </div>
  )
}
