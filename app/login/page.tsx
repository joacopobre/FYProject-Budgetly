'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
        <p className="mt-2 text-sm text-gray-500">
          Use Google to access your Budgetly dashboard.
        </p>

        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          Continue with Google
        </button>
      </div>
    </main>
  )
}