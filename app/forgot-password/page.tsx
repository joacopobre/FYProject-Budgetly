'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['800'], display: 'swap' })

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [googleAccount, setGoogleAccount] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setIsSubmitting(false)

    const data = (await res.json()) as { error?: string; googleAccount?: boolean }

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong. Please try again.')
      return
    }

    if (data.googleAccount) {
      setGoogleAccount(true)
      return
    }

    setSubmitted(true)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f5f4] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.1)]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 to-teal-400" />

          <div className="px-8 pt-10 pb-8">
            <Link
              href="/"
              className={`${jakarta.className} text-2xl tracking-tight`}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Budgetly
            </Link>

            {googleAccount ? (
              <>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">Google account detected</h1>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  This account uses Google sign-in. Please sign in with Google instead.
                </p>
                <Link
                  href="/login"
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_4px_18px_rgba(16,185,129,0.5)]"
                >
                  Go to sign in
                </Link>
              </>
            ) : submitted ? (
              <>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg
                      className="h-5 w-5 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  If an account exists for{' '}
                  <strong className="text-slate-700">{email}</strong>, you&apos;ll receive a
                  password reset link within a few minutes.
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
                </p>
                <p className="mt-8 text-center text-sm text-slate-500">
                  <Link
                    href="/login"
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Back to sign in
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h1 className="mt-6 text-2xl font-bold text-slate-900">Forgot password?</h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  Enter your email and we&apos;ll send you a reset link.
                </p>

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className={inputClass}
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                      <span className="mt-0.5 flex-shrink-0 text-rose-500">✕</span>
                      <p className="text-sm text-rose-700">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all hover:cursor-pointer hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_4px_18px_rgba(16,185,129,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Remember your password?{' '}
                  <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
