import type { Transaction } from '@/types/transactions'

// lib/shared/filterByRollingWindow.ts (or keep in lib/budgets)
export function filterByRollingWindow<T extends { date: string }>(
  items: T[],
  days: number,
): T[] {
  const now = new Date()
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  return items.filter(item => {
    const d = new Date(item.date)
    return d >= cutoff && d <= now
  })
}
