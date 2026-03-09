'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function LoginPage() {
  const { data } = useSession()

  return (
    <main className="p-8">
      {data?.user ? (
        <>
          <p>Signed in as {data.user.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      )}
    </main>
  )
}
