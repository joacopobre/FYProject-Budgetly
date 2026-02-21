export type TxType = 'Income' | 'Expense'

export type MonthFilter = 'All time' | 'This month' | 'Last month' | 'This year'

export type TypeFilter = 'All types' | 'Income' | 'Expense'

export type Transaction = {
  id: number
  date: string
  description: string
  category: string
  type: TxType
  amount: number
  budgetId?: number | null
}
