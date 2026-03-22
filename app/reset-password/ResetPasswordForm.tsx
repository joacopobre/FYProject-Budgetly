'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['800'], display: 'swap' })

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100'

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isInvalidToken = !token

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword }),
    })

    setIsSubmitting(false)

    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Something went wrong. Please try again.')
      return
    }

    router.push('/login?success=password-reset')
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

            {isInvalidToken ? (
              <>
                <h1 className="mt-6 text-2xl font-bold text-slate-900">Invalid link</h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  This password reset link is missing or invalid. Please request a new one.
                </p>
                <Link
                  href="/forgot-password"
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all hover:from-emerald-600 hover:to-teal-600"
                >
                  Request new link
                </Link>
              </>
            ) : (
              <>
                <h1 className="mt-6 text-2xl font-bold text-slate-900">Reset your password</h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  Choose a new password for your account.
                </p>

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                      New password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Confirm new password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
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
                    {isSubmitting ? 'Resetting…' : 'Reset password'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  <Link
                    href="/login"
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Back to sign in
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
