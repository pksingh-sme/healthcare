'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NotificationCenter } from '@/components/realtime/NotificationCenter'
import { SimpleSettingsDropdown } from '@/components/ui/simple-settings-dropdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SidebarProps {
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  description?: string
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10z" />
      </svg>
    ),
  },
  {
    title: 'Patients',
    href: '/dashboard/patients',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Providers',
    href: '/dashboard/providers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Appointments',
    href: '/dashboard/appointments',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Billing',
    href: '/dashboard/billing',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9 8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'EHR',
    href: '/dashboard/ehr',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9 8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9 8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'Demo Requests',
    href: '/demo-requests',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className={cn('sidebar-colorful flex flex-col h-full border-r-4 border-gradient-to-b from-blue-400 via-purple-500 to-pink-500', className)}>
      {/* Logo */}
      <div className="p-6 border-b-2 border-gradient-to-r from-blue-400 to-purple-500 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
            <svg className="w-7 h-7" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M53.5529 13.0146C53.5529 10.2546 52.081 7.71957 49.708 6.35457L42.1534 1.98957C39.7804 0.62457 36.8517 0.62457 34.4637 1.98957L4.20034 19.4346C1.82733 20.8146 0.355469 23.3496 0.355469 26.0796V28.6146C0.355469 31.3596 1.82733 33.8946 4.20034 35.2596L34.4637 52.7196C36.8367 54.0846 39.7654 54.0846 42.1534 52.7196L49.708 48.3546C52.081 46.9896 53.5529 44.4546 53.5529 41.7096C53.5529 37.4646 50.1135 34.0296 45.8631 34.0296H38.7741V40.4496L16.1405 27.3996L38.7741 14.3496V20.6946H45.8631C50.1135 20.6946 53.5529 17.2596 53.5529 13.0146Z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">ClinicEase</h2>
            <p className="text-xs bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">Clinch Infosystems</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto pt-4">
        {navItems
          .filter(item => {
            // Show patients link only for admin users
            if (item.href === '/dashboard/patients') {
              return user?.role === 'ADMIN'
            }
            // Show providers link only for admin users
            if (item.href === '/dashboard/providers') {
              return user?.role === 'ADMIN'
            }
            // Show demo requests link only for admin users
            if (item.href === '/demo-requests') {
              return user?.role === 'ADMIN'
            }
            return true
          })
          .map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white shadow-xl border-2 border-blue-300 dark:border-purple-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 dark:hover:from-blue-900/50 dark:hover:via-purple-900/50 dark:hover:to-pink-900/50 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-lg'
                )}
              >
                <div className={isActive ? 'text-white' : 'text-current'}>
                  {item.icon}
                </div>
                <span className="relative z-10">{item.title}</span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-xl animate-pulse"></div>
                )}
              </Link>
            )
          })}
      </nav>

      {/* User Info at Bottom */}
      <div className="p-4 border-t-2 border-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-red-900/40">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-12 h-12 border-2 border-purple-300 shadow-xl transform hover:scale-110 transition-all duration-300">
            <AvatarImage 
              src={user?.profileImage} 
              alt={`${user?.firstName} ${user?.lastName}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent truncate font-medium">
              {user?.role === 'PROVIDER' ? 'Healthcare Provider' : user?.role}
            </p>
          </div>
        </div>
        
        {/* Logout for non-providers */}
        {user?.role !== 'PROVIDER' && (
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="logout-button w-full justify-start font-semibold text-base transform hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </Button>
        )}
      </div>
    </div>
  )
}