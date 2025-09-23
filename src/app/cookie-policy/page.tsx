'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function CookiePolicyPage() {
  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true')
    alert('Cookie preferences saved!')
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="card-colorful border-2 border-purple-200 dark:border-purple-700">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg">
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cookie Policy
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              How we use cookies on our website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 py-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">What Are Cookies?</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Cookies are small text files that are stored on your device when you visit websites. They help websites remember your preferences and provide a better browsing experience.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">How We Use Cookies</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li><span className="font-medium">Essential Cookies:</span> These are necessary for the website to function properly.</li>
                <li><span className="font-medium">Performance Cookies:</span> These help us understand how visitors interact with our website.</li>
                <li><span className="font-medium">Functionality Cookies:</span> These allow the website to remember your preferences.</li>
                <li><span className="font-medium">Targeting Cookies:</span> These are used to deliver relevant content and advertising.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Managing Cookies</h2>
              <p className="text-gray-600 dark:text-gray-300">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. 
                However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Changes to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the &quot;Last Updated&quot; date.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about our Cookie Policy, please contact us at:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Email:</span> privacy@clinicease.com
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Phone:</span> +1 (425) 459 0221
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={handleAccept} className="clinic-gradient text-white">
                Accept All Cookies
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}