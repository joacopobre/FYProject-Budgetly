'use client'

import type { Budget } from '@/types/budgets'
import { createContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react'

type BudgetsContextValue = {
  budgets: Budget[]
  setBudgets: Dispatch<SetStateAction<Budget[]>>
}

export const BudgetsContext = createContext<BudgetsContextValue | undefined>(undefined)

const STORAGE_KEY = 'budgetly:budgets'

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([]) // ✅ stable first render

  // ✅ load after mount
  useEffect(() => {
    try {
      const localBudgets = localStorage.getItem(STORAGE_KEY)
      if (localBudgets) setBudgets(JSON.parse(localBudgets))
    } catch {}
  }, [])

  // ✅ save on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets))
    } catch (err) {
      console.error('Failed to save budgets', err)
    }
  }, [budgets])

  return (
    <BudgetsContext.Provider value={{ budgets, setBudgets }}>
      {children}
    </BudgetsContext.Provider>
  )
}