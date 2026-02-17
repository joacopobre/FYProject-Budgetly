import { Transaction } from '@/types/transactions'

export type TrendRange = 'This Month' | 'Last 3 Months' | 'This Year'

export function filterByDateRange(
  transactions: Transaction[],
  range: TrendRange,
): Transaction[] {
  const now = new Date()
  const nowMonth = now.getMonth()
  const nowYear = now.getFullYear()

  if (range === 'This Month')
    return transactions.filter(tx => {
      const txDate = new Date(tx.date)
      return txDate.getMonth() === nowMonth && txDate.getFullYear() === nowYear
    })
  if (range === 'This Year')
    return transactions.filter(tx => {
      const txDate = new Date(tx.date)
      return txDate.getFullYear() === nowYear
    })
  if (range === 'Last 3 Months')
    return transactions.filter(tx => {
      const txDate = new Date(tx.date)
      const monthDiff =
        (now.getFullYear() - txDate.getFullYear()) * 12 +
        (now.getMonth() - txDate.getMonth())
      return monthDiff >= 0 && monthDiff < 3
    })
  return transactions
}
