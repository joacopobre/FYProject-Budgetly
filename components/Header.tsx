'use client'
import { useState, useEffect } from 'react'
import { Menu, X, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
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

  return (
    <header>
      <nav className="fixed top-0 left-0 z-50 w-full px-6 pt-3">
        <div className="mx-auto max-w-7xl rounded-xl border border-white/20 bg-white/10 px-6 py-0.5 text-black shadow-[0_12px_100px_rgba(0,0,0,0.25)] backdrop-blur-lg backdrop-saturate-150">
          <div className="flex items-center justify-between gap-6">
            {/* logo and name */}
            <div className="flex w-full items-center justify-between md:w-auto">
              <a href="/" className="flex flex-1 items-center px-2 py-5">
                <Wallet color="#000000" />
              </a>
            </div>

            {/* nav links */}
            <div
              id="navigation-menu"
              className="hidden items-center justify-center font-light md:flex md:flex-row md:space-x-8"
            >
              <a href="#">Features</a>
              <a href="#">Demo</a>
              <a href="#">About</a>
              <a href="#">Contact</a>
            </div>

            {/* CTA */}
            <div className="flex w-1/3 justify-end gap-6 px-4">
              <button
                type="button"
                className="bg-primary rounded-lg px-10 py-2 font-light whitespace-nowrap text-white"
                onClick={() => router.push('/login')}
              >
                Get Started
              </button>
              <button
                type="button"
                className="hidden rounded-lg bg-white px-10 py-2 font-light whitespace-nowrap text-gray-500 lg:flex"
                onClick={() => router.push('/login')}
              >
                Sign in
              </button>
            </div>

            {/* Hamburguer Menu icon */}
            <button
              type="button"
              className="flex items-center md:hidden"
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
            <div
              id="mobile-menu"
              className="relative z-50 border-t border-white/20 px-6 py-4 md:hidden"
            >
              <div className="flex flex-col gap-6">
                <a href="#features" onClick={() => setIsOpen(false)} className="p-2">
                  Features
                </a>
                <a href="#demo" onClick={() => setIsOpen(false)} className="p-2">
                  Demo
                </a>
                <a href="#about" onClick={() => setIsOpen(false)} className="p-2">
                  About
                </a>
                <a href="#contact" onClick={() => setIsOpen(false)} className="p-2">
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
