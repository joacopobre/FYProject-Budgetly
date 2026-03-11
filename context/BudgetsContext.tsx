'use client'

import type { Budget } from '@/types/budgets'
import { useSession } from 'next-auth/react'
import { createContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

type BudgetsContextValue = {
  budgets: Budget[]
  setBudgets: Dispatch<SetStateAction<Budget[]>>
}

export const BudgetsContext = createContext<BudgetsContextValue | undefined>(undefined)

const STORAGE_KEY_PREFIX = 'budgetly:budgets'
const LEGACY_STORAGE_KEY = 'budgetly:budgets'

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [budgets, setBudgets] = useState<Budget[]>([]) // ✅ stable first render
  const previousUserIdRef = useRef<string | null>(null)
  const storageKey = session?.user?.id ? `${STORAGE_KEY_PREFIX}:${session.user.id}` : null
  const currentUserId = session?.user?.id ?? null

  // ✅ load from user-scoped storage
  useEffect(() => {
    if (!storageKey) return

    try {
      const localBudgets = localStorage.getItem(storageKey)
      if (localBudgets) setBudgets(JSON.parse(localBudgets))
    } catch {}
  }, [storageKey])

  // ✅ save on changes (user-scoped)
  useEffect(() => {
    if (!storageKey) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(budgets))
    } catch (err) {
      console.error('Failed to save budgets', err)
    }
  }, [budgets, storageKey])

  useEffect(() => {
    const previousUserId = previousUserIdRef.current

    // Reset only when an established session changes users or logs out.
    if (previousUserId && previousUserId !== currentUserId) {
      setBudgets([])
    }

    if (currentUserId) {
      previousUserIdRef.current = currentUserId
    }
  }, [currentUserId])

  // Remove old shared key to prevent cross-user leakage.
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {}
  }, [])

  return (
    <BudgetsContext.Provider value={{ budgets, setBudgets }}>
      {children}
    </BudgetsContext.Provider>
  )
}