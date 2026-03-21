'use client'

import { useTheme } from '@/context/ThemeContext'
import AppNav from '@/components/AppNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div
      id="wrapper"
      className={`relative min-h-screen ${
        theme === 'dark' ? 'dark bg-[#0d2118]' : 'bg-[#f1f5f9]'
      }`}
    >
      {/* Grain texture overlay — matches landing page */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise.png")' }}
      />
      <AppNav />
      <main className="relative z-10 pt-24">{children}</main>
    </div>
  )
}
