'use client'
import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['800'], display: 'swap' })

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#demo', label: 'Demo' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const reduceMotion = useReducedMotion()
  const { data: session } = useSession()
  const router = useRouter()
  const handleClick = () => setIsOpen(prev => !prev)

  useEffect(() => {
    const mq = window.matchMedia('(min-width:768px)')
    if (mq.matches) setIsOpen(false)
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 14)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header>
      <motion.nav
        className="fixed top-0 left-0 z-50 w-full px-4 pt-3 sm:px-6"
        initial={reduceMotion ? undefined : { opacity: 0, y: -12 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div
          className={`relative mx-auto max-w-7xl rounded-full transition-[background-color,border-color,box-shadow] duration-300 ${
            hasScrolled
              ? 'border border-emerald-200/50 bg-white/90 shadow-[0_8px_24px_rgba(15,23,42,0.09),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl'
              : 'border border-white/12 bg-[#061310]/58 shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl'
          }`}
        >
          <div className="relative flex items-center justify-between px-5 sm:px-6">
            {/* Logo */}
            <a href="/" className="flex flex-shrink-0 items-center py-3.5">
              <span
                className={`${jakarta.className} text-xl tracking-tight`}
                style={
                  hasScrolled
                    ? {
                        background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }
                    : { color: '#fff' }
                }
              >
                Budgetly
              </span>
            </a>

            {/* Desktop nav links */}
            <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    hasScrolled
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      : 'text-slate-200/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA + hamburger */}
            <div className="flex flex-shrink-0 items-center gap-1.5 py-2">
              {session?.user ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-medium whitespace-nowrap text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all duration-150 hover:cursor-pointer hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_4px_18px_rgba(16,185,129,0.5)]"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                  <ArrowRight className="size-3.5" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className={`hidden rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 hover:cursor-pointer lg:flex ${
                      hasScrolled
                        ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all duration-150 hover:cursor-pointer hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_4px_18px_rgba(16,185,129,0.5)]"
                    onClick={() => router.push('/signup')}
                  >
                    Sign up
                  </button>
                </>
              )}

              {/* Hamburger */}
              <button
                type="button"
                className={`flex size-9 items-center justify-center rounded-full transition-colors duration-150 hover:cursor-pointer md:hidden ${
                  hasScrolled
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-slate-100 hover:bg-white/12'
                }`}
                onClick={handleClick}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <motion.div
              id="mobile-menu"
              className={`border-t px-3 pt-3 pb-4 md:hidden ${
                hasScrolled ? 'border-slate-200/70' : 'border-white/12'
              }`}
              initial={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div className="flex flex-col gap-0.5">
                {navLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                      hasScrolled
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}

                {!session?.user && (
                  <div
                    className={`mt-2 grid gap-2 border-t pt-3 ${
                      hasScrolled ? 'border-slate-200' : 'border-white/12'
                    }`}
                  >
                    <button
                      type="button"
                      className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:cursor-pointer"
                      onClick={() => {
                        setIsOpen(false)
                        router.push('/signup')
                      }}
                    >
                      Sign up
                    </button>
                    <button
                      type="button"
                      className={`rounded-xl border px-4 py-2.5 text-sm font-medium hover:cursor-pointer ${
                        hasScrolled
                          ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          : 'border-white/18 text-slate-200 hover:bg-white/8'
                      }`}
                      onClick={() => {
                        setIsOpen(false)
                        router.push('/login')
                      }}
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </header>
  )
}
