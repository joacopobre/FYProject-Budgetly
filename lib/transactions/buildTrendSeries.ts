import { Transaction } from '@/types/transactions'

export type TrendPoint = {
  label: string
  income: number
  expenses: number
}
export function buildTrendSeries(transactions: Transaction[]): TrendPoint[] {
  const map = new Map<string, { income: number; expenses: number }>()
  for (const tx of transactions.filter(t => t.type !== 'Transfer')) {
    const d = new Date(tx.date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const key = `${year}-${month}`
    if (!map.has(key)) {
      map.set(key, { income: 0, expenses: 0 })
    }
    const bucket = map.get(key)!

    if (tx.amount > 0) {
      bucket.income += tx.amount
    } else {
      bucket.expenses += Math.abs(tx.amount)
    }
  }

  const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  const series = entries.map(([key, bucket]) => {
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
    return {
      label,
      income: bucket.income,
      expenses: bucket.expenses,
    }
  })
  return series
}
