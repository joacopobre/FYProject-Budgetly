import type { Transaction } from '@/types/transactions'

export function calculateDashboardStats(transactions: Transaction[]) {
  const balance = transactions
    .filter(tx => tx.type === 'Income' || tx.type === 'Expense')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalIncome = transactions
    .filter(tx => tx.type === 'Income')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpenses = transactions
    .filter(tx => tx.type === 'Expense')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

  return {
    totalIncome,
    totalExpenses,
    balance,
  }
}
