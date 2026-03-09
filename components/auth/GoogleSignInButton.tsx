'use client'

import { type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  className?: string
  children: ReactNode
}

export default function GoogleSignInButton({ className, children }: Props) {
  const router = useRouter()

  return (
    <button
      type="button"
      className={`${className ?? ''} hover:cursor-pointer`}
      onClick={() => router.push('/login')}
    >
      {children}
    </button>
  )
}
