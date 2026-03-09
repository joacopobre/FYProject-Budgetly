'use client'
import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Menu, X, Wallet, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const reduceMotion = useReducedMotion()
  const { data: session } = useSession()
  const router = useRouter()
  const handleClick = () => setIsOpen(prev => !prev)

  // useEffect to change isOpen when window expanded
  useEffect(() => {
    const mq = window.matchMedia('(min-width:768px)')

    if (mq.matches) setIsOpen(false)

    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false)
    }

    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // useEffect to clsoe mobile menue with esc
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  // Prevent background scroll while nav bar menu open
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  // Increase nav surface opacity after scroll for readability
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
        initial={reduceMotion ? undefined : { opacity: 0, y: -10 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <motion.div
          className={`relative mx-auto max-w-7xl rounded-full px-4 py-1.5 transition-[background-color,border-color,box-shadow,color] duration-200 sm:px-6 ${
            hasScrolled
              ? 'border border-slate-200/80 bg-white/78 text-slate-900 shadow-[0_10px_26px_rgba(15,23,42,0.12)] backdrop-blur-xl'
              : 'border border-white/20 bg-slate-950/45 text-white shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-xl'
          }`}
          animate={{
            opacity: hasScrolled ? 1 : 0.96,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div
            className={`pointer-events-none absolute inset-px rounded-full border ${
              hasScrolled ? 'border-white/55' : 'border-white/18'
            }`}
            aria-hidden
          />
          <div
            className={`pointer-events-none absolute inset-x-6 top-0 h-px ${
              hasScrolled ? 'bg-white/70' : 'bg-white/30'
            }`}
            aria-hidden
          />
          <div className="relative flex items-center justify-between gap-6">
            {/* logo and name */}
            <div className="flex w-full items-center justify-between md:w-auto">
              <a href="/" className="flex flex-1 items-center px-2 py-5">
                <Wallet color={hasScrolled ? '#0f172a' : '#f8fafc'} />
              </a>
            </div>

            {/* nav links */}
            <div
              id="navigation-menu"
              className={`hidden items-center justify-center font-medium md:flex md:flex-row md:space-x-8 ${
                hasScrolled ? 'text-slate-700' : 'text-slate-100/90'
              }`}
            >
              <a
                href="#features"
                className={`transition-colors duration-150 ${
                  hasScrolled ? 'hover:text-slate-900' : 'hover:text-white'
                }`}
              >
                Features
              </a>
              <a
                href="#demo"
                className={`transition-colors duration-150 ${
                  hasScrolled ? 'hover:text-slate-900' : 'hover:text-white'
                }`}
              >
                Demo
              </a>
              <a
                href="#about"
                className={`transition-colors duration-150 ${
                  hasScrolled ? 'hover:text-slate-900' : 'hover:text-white'
                }`}
              >
                About
              </a>
              <a
                href="#contact"
                className={`transition-colors duration-150 ${
                  hasScrolled ? 'hover:text-slate-900' : 'hover:text-white'
                }`}
              >
                Contact
              </a>
            </div>

            {/* CTA */}
            <div className="flex w-1/3 justify-end gap-3 px-2 sm:gap-4 sm:px-4">
              {session?.user ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-2 text-sm font-medium whitespace-nowrap text-white hover:cursor-pointer"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                  <ArrowRight className="size-4" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="rounded-md bg-[#10b981] px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors duration-150 hover:cursor-pointer hover:bg-[#059669]"
                    onClick={() => router.push('/signup')}
                  >
                    Sign up
                  </button>
                  <button
                    type="button"
                    className={`hidden rounded-md px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 hover:cursor-pointer lg:flex ${
                      hasScrolled
                        ? 'text-slate-700 hover:text-slate-900'
                        : 'text-slate-100/90 hover:text-white'
                    }`}
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </button>
                </>
              )}
            </div>

            {/* Hamburguer Menu icon */}
            <button
              type="button"
              className={`flex items-center hover:cursor-pointer md:hidden ${
                hasScrolled ? 'text-slate-700' : 'text-slate-100'
              }`}
              onClick={handleClick}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Dropdown */}
          {isOpen && (
            <motion.div
              id="mobile-menu"
              className={`relative z-50 border-t px-4 py-4 md:hidden ${
                hasScrolled ? 'border-slate-200' : 'border-white/20'
              }`}
              initial={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="flex flex-col gap-4">
                <a
                  href="#features"
                  onClick={() => setIsOpen(false)}
                  className={`p-2 ${hasScrolled ? 'text-slate-700' : 'text-slate-100'}`}
                >
                  Features
                </a>
                <a
                  href="#demo"
                  onClick={() => setIsOpen(false)}
                  className={`p-2 ${hasScrolled ? 'text-slate-700' : 'text-slate-100'}`}
                >
                  Demo
                </a>
                <a
                  href="#about"
                  onClick={() => setIsOpen(false)}
                  className={`p-2 ${hasScrolled ? 'text-slate-700' : 'text-slate-100'}`}
                >
                  About
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className={`p-2 ${hasScrolled ? 'text-slate-700' : 'text-slate-100'}`}
                >
                  Contact
                </a>
                {!session?.user && (
                  <div
                    className={`mt-1 grid gap-2 border-t pt-3 ${
                      hasScrolled ? 'border-slate-200' : 'border-white/20'
                    }`}
                  >
                    <button
                      type="button"
                      className="rounded-md bg-[#10b981] px-4 py-2 text-sm font-medium text-white hover:cursor-pointer"
                      onClick={() => {
                        setIsOpen(false)
                        router.push('/signup')
                      }}
                    >
                      Sign up
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:cursor-pointer"
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
        </motion.div>
      </motion.nav>
    </header>
  )
}
