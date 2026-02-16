import type { Transaction } from '@/types/transactions'

export function calculateDashboardStats(transactions: Transaction[]) {
  const balance = transactions.reduce((sum, tx) => {
    return sum + tx.amount
  }, 0)

  const totalIncome = transactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpenses = transactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

  return {
    totalIncome,
    totalExpenses,
    balance,
  }
}
