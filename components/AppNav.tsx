'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { signOut } from 'next-auth/react'
import { AlertTriangle, Bell, CheckCircle, Info, Map, Moon, Settings, Sun, X } from 'lucide-react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { useTheme } from '@/context/ThemeContext'
import { useOnboarding, TOUR_DONE_KEY } from '@/context/OnboardingContext'
import type { Notification } from '@/types/notifications'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['800'], display: 'swap' })

const links = [
  { href: '/dashboard', label: 'Dashboard', tourTarget: 'nav-dashboard' },
  { href: '/transactions', label: 'Transactions', tourTarget: 'nav-transactions' },
  { href: '/budgets', label: 'Budgets', tourTarget: 'nav-budgets' },
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function TypeIcon({ type }: { type: Notification['type'] }) {
  if (type === 'WARNING')
    return <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
  if (type === 'SUCCESS')
    return <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-500" />
  return <Info className="mt-0.5 size-4 shrink-0 text-sky-500" />
}

export default function AppNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()
  const { startTour } = useOnboarding()

  const handleStartTour = () => {
    try {
      localStorage.removeItem(TOUR_DONE_KEY)
    } catch {}
    startTour()
    if (pathname !== '/dashboard') {
      router.push('/dashboard')
    }
  }

  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const notifRefMobile = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const toggle = () => setOpen(prev => !prev)
  const close = () => setOpen(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) setNotifications(await res.json())
    } catch {}
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllRead = async () => {
    await fetch('/api/notifications/mark-all-read', { method: 'PATCH' })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Close mobile menu on click-away
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

  // Close notification panel on click-away
  useEffect(() => {
    if (!notifOpen) return
    const onClickAway = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      const insideDesktop = notifRef.current?.contains(target)
      const insideMobile = notifRefMobile.current?.contains(target)
      if (!insideDesktop && !insideMobile) setNotifOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('touchstart', onClickAway)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('touchstart', onClickAway)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [notifOpen])

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
                data-tour={link.tourTarget}
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

          {/* Notification bell */}
          <div className="relative ml-1" ref={notifRef}>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotifOpen(prev => !prev)}
              className="relative flex size-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-[0_16px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/12 dark:bg-[#0a1d17]/95 dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/8">
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">
                    Notifications
                  </span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-xs font-medium text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        Mark all as read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="flex size-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 transition ${
                          !n.read
                            ? 'bg-emerald-50/60 dark:bg-emerald-900/20'
                            : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <TypeIcon type={n.type} />
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm leading-snug ${
                              n.read
                                ? 'text-slate-500 dark:text-slate-400'
                                : 'text-slate-800 dark:text-slate-100'
                            }`}
                          >
                            {n.message}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            {timeAgo(n.createdAt)}
                          </p>
                        </div>
                        {!n.read && (
                          <button
                            type="button"
                            onClick={() => markRead(n.id)}
                            className="shrink-0 text-xs font-medium text-slate-400 transition hover:text-emerald-600 dark:hover:text-emerald-400"
                            aria-label="Mark as read"
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex size-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <button
            type="button"
            onClick={handleStartTour}
            title="Take the tour"
            aria-label="Take the tour"
            className="flex size-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Map className="size-4" />
          </button>

          <Link
            href="/settings"
            aria-label="Account settings"
            title="Account settings"
            className={`flex size-9 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80 ${
              pathname === '/settings'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-white/15 dark:text-white dark:ring-white/20'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
            }`}
          >
            <Settings className="size-4" />
          </Link>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="ml-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Sign out
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* Notification bell mobile */}
          <div className="relative" ref={notifRefMobile}>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotifOpen(prev => !prev)}
              className="relative flex size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-[0_16px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/12 dark:bg-[#0a1d17]/95 dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/8">
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">
                    Notifications
                  </span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-xs font-medium text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        Mark all as read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="flex size-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 transition ${
                          !n.read
                            ? 'bg-emerald-50/60 dark:bg-emerald-900/20'
                            : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <TypeIcon type={n.type} />
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm leading-snug ${
                              n.read
                                ? 'text-slate-500 dark:text-slate-400'
                                : 'text-slate-800 dark:text-slate-100'
                            }`}
                          >
                            {n.message}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            {timeAgo(n.createdAt)}
                          </p>
                        </div>
                        {!n.read && (
                          <button
                            type="button"
                            onClick={() => markRead(n.id)}
                            className="shrink-0 text-xs font-medium text-slate-400 transition hover:text-emerald-600 dark:hover:text-emerald-400"
                            aria-label="Mark as read"
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
            onClick={() => { close(); handleStartTour() }}
            className="mt-1 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <Map className="size-4" />
            Take the tour
          </button>
          <Link
            href="/settings"
            onClick={close}
            className={`mt-1 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              pathname === '/settings'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-white/15 dark:text-white dark:ring-white/20'
                : 'text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
            }`}
          >
            <Settings className="size-4" />
            Account settings
          </Link>
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
