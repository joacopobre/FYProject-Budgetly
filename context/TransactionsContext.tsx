'use client'

import { transactionsData } from '@/staticData/transactions'
import type { Transaction } from '@/types/transactions'
import { createContext, useState, type Dispatch, type SetStateAction } from 'react'

type TransactionsContextValue = {
  transactions: Transaction[]
  setTransactions: Dispatch<SetStateAction<Transaction[]>>
}
export const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined)

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState(transactionsData)

  return (
    <TransactionsContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionsContext.Provider>
  )
}
