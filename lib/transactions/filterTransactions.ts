import type { MonthFilter, Transaction, TypeFilter } from '@/types/transactions'

type FilterTransactionsProps = {
  transactions: Transaction[]
  searchTerm: string
  filterType: TypeFilter
  filterMonth: MonthFilter
}

export function filterTransactions({
  transactions,
  searchTerm,
  filterType,
  filterMonth,
}: FilterTransactionsProps) {
  return transactions
    .filter(tx => {
      if (searchTerm === '') return true
      const normalized = searchTerm.toLowerCase()
      return (
        tx.description.toLowerCase().includes(normalized) ||
        tx.category.toLowerCase().includes(normalized)
      )
    })
    .filter(tx => {
      if (filterType === 'All types') return true
      return tx.type === filterType
    })
    .filter(tx => {
      if (filterMonth === 'All time') return true
      const now = new Date()
      const txDate = new Date(tx.date)
      const nowMonth = now.getMonth()
      const nowYear = now.getFullYear()
      const txMonth = txDate.getMonth()
      const txYear = txDate.getFullYear()
      const nowLastMonth = nowMonth === 0 ? 11 : nowMonth - 1
      const lastMonthYear = nowMonth === 0 ? nowYear - 1 : nowYear
      if (filterMonth === 'This month') return txMonth === nowMonth && txYear === nowYear
      if (filterMonth === 'Last month') return txMonth === nowLastMonth && txYear === lastMonthYear
      if (filterMonth === 'This year') return txYear === nowYear
      return true
    })
}
