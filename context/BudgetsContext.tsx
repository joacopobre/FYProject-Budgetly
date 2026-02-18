'use client'
import type { Budget } from '@/types/budgets'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { createContext } from 'react'

type BudgetsContextValue = {
  budgets: Budget[]
  setBudgets: Dispatch<SetStateAction<Budget[]>>
}
export const BudgetsContext = createContext<BudgetsContextValue | undefined>(undefined)

const STORAGE_KEY = 'budgetly:budgets'

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    try {
      const localBudgets = localStorage.getItem(STORAGE_KEY)
      if (localBudgets) return JSON.parse(localBudgets)
      else return []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets))
    } catch (err) {
      console.error('Failed to save budgets on local storage ' + err)
    }
  }, [budgets])
  return (
    <BudgetsContext.Provider value={{ budgets, setBudgets }}>
      {children}
    </BudgetsContext.Provider>
  )
}
