import type { BudgetEvent } from '@/types/budgets'

export function buildBudgetBalanceSeries(events: BudgetEvent[], days: number) {
  const now = new Date()
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const filtered = events
    .filter(e => {
      const d = new Date(e.date)
      return d >= cutoff && d <= now
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  let running = 0

  return filtered.map(e => {
    running += e.delta
    const d = new Date(e.date)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    return {
      label,
      value: running,
    }
  })
}
