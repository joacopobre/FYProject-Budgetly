import type { Transaction } from '@/types/transactions'

export type BalancePoint = {
  label: string
  balance: number
}

export function buildBalanceSeries(transactions: Transaction[]): BalancePoint[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  let running = 0
  const monthToBalance = new Map<string, number>()
  for (const tx of sorted) {
    const d = new Date(tx.date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const key = `${year}-${month}`
    running += tx.amount
    monthToBalance.set(key, running)
  }
  const entries = Array.from(monthToBalance.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  )
  const series = entries.map(([key, balance]) => {
    const [year, month] = key.split('-')
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const label = `${months[Number(month) - 1]} ${year}`
    return { label, balance }
  })
  return series
}
