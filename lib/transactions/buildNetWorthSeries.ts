import type { Transaction } from '@/types/transactions'
import type { TrendRange } from './filterByDateRange'

export type NetWorthPoint = {
  date: string
  balance: number
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function buildNetWorthSeries(
  transactions: Transaction[],
  range: TrendRange,
): NetWorthPoint[] {
  const accountTx = transactions.filter(tx => tx.source === 'ACCOUNT')
  const sorted = [...accountTx].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const now = new Date()
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()

  if (range === 'This Month') {
    const dayMap = new Map<string, number>()
    let running = 0
    for (const tx of sorted) {
      const d = new Date(tx.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      running += tx.amount
      dayMap.set(key, running)
    }
    return Array.from(dayMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .filter(([key]) => {
        const [y, m] = key.split('-').map(Number)
        return y === nowYear && m - 1 === nowMonth
      })
      .map(([key, balance]) => {
        const parts = key.split('-').map(Number)
        return { date: `${MONTHS[parts[1] - 1]} ${parts[2]}`, balance }
      })
  }

  // 'Last 3 Months' and 'This Year' — group by month
  const monthMap = new Map<string, number>()
  let running = 0
  for (const tx of sorted) {
    const d = new Date(tx.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    running += tx.amount
    monthMap.set(key, running)
  }

  const allEntries = Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))

  const filtered =
    range === 'Last 3 Months'
      ? allEntries.filter(([key]) => {
          const [y, m] = key.split('-').map(Number)
          const diff = (nowYear - y) * 12 + (nowMonth - (m - 1))
          return diff >= 0 && diff < 3
        })
      : allEntries.filter(([key]) => Number(key.split('-')[0]) === nowYear)

  return filtered.map(([key, balance]) => {
    const [year, month] = key.split('-').map(Number)
    return { date: `${MONTHS[month - 1]} ${year}`, balance }
  })
}
