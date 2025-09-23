'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function CookiePolicyBanner() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has already accepted the cookie policy
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted')
    if (!hasAcceptedCookies) {
      setIsOpen(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cookie Policy</DialogTitle>
          <DialogDescription>
            We use cookies to improve your experience on our website. By continuing to browse, you consent to our use of cookies.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Cookies help us understand how you use our site, remember your preferences, and provide personalized content. 
            You can review our full cookie policy for more information.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild>
            <Link href="/cookie-policy">Learn More</Link>
          </Button>
          <Button onClick={handleAccept}>
            Accept All Cookies
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}