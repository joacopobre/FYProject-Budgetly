'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { signOut } from 'next-auth/react'
import { Moon, Sun } from 'lucide-react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { useTheme } from '@/context/ThemeContext'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['800'], display: 'swap' })

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/budgets', label: 'Budgets' },
]

export default function AppNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  const toggle = () => setOpen(prev => !prev)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onClickAway = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('touchstart', onClickAway)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('touchstart', onClickAway)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-30 px-4 pt-3 md:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-2 shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl dark:border-white/12 dark:bg-[#061310]/60 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:px-6">
        <Link
          href="/dashboard"
          className={`${jakarta.className} text-xl tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80`}
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Budgetly
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-white/15 dark:text-white dark:ring-white/20'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
                onClick={close}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-1 flex size-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="ml-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Sign out
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* Theme toggle mobile */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <button
            type="button"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={toggle}
            className="flex items-center rounded-xl border border-white/60 bg-white/60 p-2 text-slate-700 shadow-sm transition hover:bg-white dark:border-white/15 dark:bg-white/8 dark:text-slate-200 dark:hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80"
          >
            <span className="sr-only">Toggle menu</span>
            {open ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={menuRef}
          className="mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-[0_8px_32px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-white/12 dark:bg-[#0a1d17]/90 md:hidden"
        >
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-white/15 dark:text-white dark:ring-white/20'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
                onClick={close}
              >
                {link.label}
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="mt-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  )
}
