'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DocumentationPage() {
  const docsSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn how to set up and configure ClinicEase AI for your practice',
      articles: [
        { id: 'installation', title: 'System Requirements' },
        { id: 'account-setup', title: 'Account Creation and Setup' },
        { id: 'initial-configuration', title: 'Initial Configuration' },
        { id: 'user-management', title: 'User Management' }
      ]
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Master the smart scheduling system and appointment management',
      articles: [
        { id: 'scheduling', title: 'Creating Appointments' },
        { id: 'calendar', title: 'Calendar Management' },
        { id: 'notifications', title: 'Appointment Notifications' },
        { id: 'cancellations', title: 'Handling Cancellations' }
      ]
    },
    {
      id: 'patients',
      title: 'Patient Management',
      description: 'Efficiently manage patient records and communications',
      articles: [
        { id: 'patient-records', title: 'Patient Records' },
        { id: 'portal-access', title: 'Patient Portal Access' },
        { id: 'messaging', title: 'Secure Messaging' },
        { id: 'reminders', title: 'Automated Reminders' }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      description: 'Streamline your billing process with intelligent automation',
      articles: [
        { id: 'invoice-creation', title: 'Creating Invoices' },
        { id: 'ai-coding', title: 'AI-Powered Coding' },
        { id: 'payment-processing', title: 'Payment Processing' },
        { id: 'insurance', title: 'Insurance Claims' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Reporting',
      description: 'Gain insights with powerful analytics and reporting tools',
      articles: [
        { id: 'dashboard', title: 'Dashboard Overview' },
        { id: 'financial-reports', title: 'Financial Reports' },
        { id: 'performance-metrics', title: 'Performance Metrics' },
        { id: 'custom-reports', title: 'Custom Reports' }
      ]
    },
    {
      id: 'telehealth',
      title: 'Telehealth',
      description: 'Provide virtual care with integrated telehealth features',
      articles: [
        { id: 'virtual-appointments', title: 'Virtual Appointments' },
        { id: 'video-conferencing', title: 'Video Conferencing' },
        { id: 'digital-prescriptions', title: 'Digital Prescriptions' },
        { id: 'patient-engagement', title: 'Patient Engagement Tools' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-block mb-8">
            <Button variant="outline" className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive guides and resources to help you get the most out of ClinicEase AI
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
            />
            <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {docsSections.map((section) => (
            <div 
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {section.description}
                </p>
                <ul className="space-y-3">
                  {section.articles.map((article) => (
                    <li key={article.id}>
                      <Link 
                        href={`/docs/${section.id}/${article.id}`}
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/docs/getting-started/account-setup">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Setup
              </Button>
            </Link>
            <Link href="/docs/appointments/scheduling">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Scheduling
              </Button>
            </Link>
            <Link href="/docs/billing/invoice-creation">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Billing
              </Button>
            </Link>
            <Link href="/docs/analytics/dashboard">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}