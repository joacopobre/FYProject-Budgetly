'use client'

import { useTheme } from '@/context/ThemeContext'
import AppNav from '@/components/AppNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div
      id="wrapper"
      className={`min-h-screen ${
        theme === 'dark'
          ? 'dark bg-gradient-to-br from-[#06120f] via-[#0a1d17] to-[#0d241c]'
          : 'bg-[#f3f5f4]'
      }`}
    >
      <AppNav />
      <main className="pt-24">{children}</main>
    </div>
  )
}
