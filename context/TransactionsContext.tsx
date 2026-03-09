'use client'

import type { Transaction } from '@/types/transactions'
import { useSession } from 'next-auth/react'
import {
  createContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

type TransactionsContextValue = {
  transactions: Transaction[]
  setTransactions: Dispatch<SetStateAction<Transaction[]>>
}
export const TransactionsContext = createContext<TransactionsContextValue | undefined>(
  undefined,
)

const STORAGE_KEY_PREFIX = 'budgetly:transactions'
const LEGACY_STORAGE_KEY = 'budgetly:transactions'


export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const previousUserIdRef = useRef<string | null>(null)
  const storageKey = session?.user?.id ? `${STORAGE_KEY_PREFIX}:${session.user.id}` : null
  const currentUserId = session?.user?.id ?? null

  // Load transactions from user-scoped localStorage key.
  useEffect(() => {
    if (!storageKey) {
      setTransactions([])
      return
    }

    try {
      const localStorageData = localStorage.getItem(storageKey)
      if (localStorageData) setTransactions(JSON.parse(localStorageData))
      else setTransactions([])
    } catch {}
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(transactions))
    } catch (err) {
      console.error('Failed to save transactions from storage', err)
    }
  }, [transactions, storageKey])

  useEffect(() => {
    const previousUserId = previousUserIdRef.current

    // Reset only when an established session changes users or logs out.
    if (previousUserId && previousUserId !== currentUserId) {
      setTransactions([])
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
    <TransactionsContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionsContext.Provider>
  )
}
