export type TxType = 'Income' | 'Expense' | 'Transfer'

export type MonthFilter = 'All time' | 'This month' | 'Last month' | 'This year'

export type TypeFilter = 'All types' | 'Income' | 'Expense' | 'Transfer'

export type TxSource = 'ACCOUNT' | 'BUDGET'

export type Transaction = {
  id: number
  date: string
  description: string
  category: string
  type: TxType
  amount: number
  budgetId?: string | null
  source: TxSource
}
