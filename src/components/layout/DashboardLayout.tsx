'use client'

import { ReactNode, Suspense, lazy, useState } from 'react'
import { LoadingSkeleton } from '../ui/loading-skeleton'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NotificationCenter } from '@/components/realtime/NotificationCenter'
import { SimpleSettingsDropdown } from '@/components/ui/simple-settings-dropdown'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

// Lazy load the sidebar for better performance
const Sidebar = lazy(() => import('./Sidebar').then(mod => ({ default: mod.Sidebar })))

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed md:relative z-50 md:z-auto inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:w-64 md:flex md:flex-col`}>
        <Suspense fallback={<LoadingSkeleton className="w-64 h-screen" />}>
          <Sidebar />
        </Suspense>
      </div>
      
      {/* Floating Settings Panel - Top Right (Fixed at 24px from top) */}
      <div className="fixed top-6 right-6 z-50 hidden md:block">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-purple-200 dark:border-purple-700 p-2 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
          <div className="flex items-center space-x-1">
            {user?.role !== 'PROVIDER' && (
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <ThemeToggle />
              </div>
            )}
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
              <NotificationCenter />
            </div>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
              <SimpleSettingsDropdown />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile sidebar button */}
        <div className="md:hidden header-colorful border-b-2 border-purple-300 dark:border-purple-600 px-4 py-3 shadow-lg flex items-center">
          <button 
            className="text-white hover:text-purple-100 transition-colors mr-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">ClinicEase</h1>
        </div>
        
        {/* Page content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-white via-blue-25 to-purple-25 dark:from-gray-800 dark:via-purple-900/20 dark:to-blue-900/20">
          <Suspense fallback={<LoadingSkeleton className="w-full h-64" />}>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </Suspense>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-400">&copy; {new Date().getFullYear()} Clinch Infosystems. All rights reserved.</p>
              </div>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}