'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/budgets', label: 'Budgets' },
]

export default function AppNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggle = () => setOpen(prev => !prev)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onClickAway = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close()
      }
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

  const baseLink =
    'rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80'
  const activeLink =
    'bg-white/80 text-slate-900 shadow-sm ring-1 ring-emerald-100 backdrop-blur-lg'
  const inactiveLink =
    'text-slate-700 hover:bg-white/30 hover:text-slate-900'

  return (
    <header className="fixed inset-x-0 top-0 z-30 px-4 pt-3 md:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/30 bg-white/20 px-4 py-2 shadow-[0_20px_90px_rgba(0,0,0,0.15)] backdrop-blur-2xl backdrop-saturate-150 md:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80"
        >
          Budgetly
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${baseLink} ${isActive ? activeLink : inactiveLink}`}
                onClick={close}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={toggle}
          className="flex items-center rounded-xl border border-white/40 bg-white/40 p-2 text-slate-800 shadow-sm transition hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80 md:hidden"
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
      </nav>

      {open && (
        <div
          ref={menuRef}
          className="mx-auto mt-2 flex max-w-7xl flex-col gap-2 rounded-2xl border border-white/30 bg-white/80 px-4 py-3 shadow-[0_20px_90px_rgba(0,0,0,0.15)] backdrop-blur-2xl backdrop-saturate-150 md:hidden"
        >
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${baseLink} ${isActive ? activeLink : inactiveLink}`}
                onClick={close}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
