'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SocketProvider } from '@/contexts/SocketContext'
import { CookiePolicyBanner } from '@/components/CookiePolicyBanner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <AuthProvider>
        <SocketProvider>
          {children}
          <CookiePolicyBanner />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}