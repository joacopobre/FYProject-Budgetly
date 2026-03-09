'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Wallet } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onGoogleSignIn() {
    // Clear any local session first, then force account picker.
    await signOut({ redirect: false })
    await signIn('google', { callbackUrl: '/dashboard' }, { prompt: 'select_account' })
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl: '/dashboard',
    })

    setIsSubmitting(false)

    if (!result || result.error) {
      setError(result?.error ?? 'Invalid email or password')
      return
    }

    router.push(result.url ?? '/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#f4f8f6] to-[#e9efec] px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200/90 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.1)] sm:p-9">
        <div className="mb-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <Wallet className="size-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900">Budgetly</p>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to manage your budgets and spending.
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-[#10b981] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:cursor-pointer hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">or continue with</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:cursor-pointer hover:bg-slate-50"
          onClick={onGoogleSignIn}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#EA4335"
              d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.6-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.5 14.5 2.7 12 2.7c-5.1 0-9.3 4.2-9.3 9.3s4.2 9.3 9.3 9.3c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.6H12Z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-slate-900 underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}