'use client'

import { transactionsData } from '@/staticData/transactions'
import type { Transaction } from '@/types/transactions'
import {
  createContext,
  useEffect,
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

const STORAGE_KEY = 'budgetly:transactions'


export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsData)
  //load from localStorage on mount
  useEffect(() => {
    try {
      const localStorageData = localStorage.getItem(STORAGE_KEY)
      if (localStorageData) setTransactions(JSON.parse(localStorageData))
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    } catch (err) {
      console.error('Failed to save transactions from storage', err)
    }
  }, [transactions])

  return (
    <TransactionsContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionsContext.Provider>
  )
}
