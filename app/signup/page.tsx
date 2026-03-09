'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
    })

    const data = (await response.json()) as { error?: string }
    if (!response.ok) {
      setIsSubmitting(false)
      setError(data.error ?? 'Unable to sign up')
      return
    }

    const signInResult = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl: '/dashboard',
    })

    setIsSubmitting(false)

    if (!signInResult || signInResult.error) {
      setError(signInResult?.error ?? 'Sign in failed after signup')
      return
    }

    router.push(signInResult.url ?? '/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
        <p className="mt-2 text-sm text-gray-500">Sign up with email/password or Google.</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name (optional)"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <button
          type="button"
          className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-black underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
