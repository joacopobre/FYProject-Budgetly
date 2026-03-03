import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'
import { getTransactionsForUser } from '@/lib/db/transactions'
import TransactionsClient from './TransactionsClient'
import type { Transaction } from '@/types/transactions'

export default async function TransactionsPage() {
  const session = await getAuthSession()
  if (!session?.user?.id) redirect('/login')

  const rows = await getTransactionsForUser(session.user.id)

  const initialTransactions: Transaction[] = rows.map(tx => ({
    id: tx.id,
    date: tx.date.toISOString(), // prisma Date -> string
    description: tx.description,
    category: tx.category,
    type: tx.type, // should match your union ('Income'|'Expense'|'Transfer')
    amount: tx.amount,
    source: tx.source, // 'ACCOUNT'|'BUDGET'
    budgetId: tx.budgetId ?? null,
  }))

  return <TransactionsClient initialTransactions={initialTransactions}/>
}
