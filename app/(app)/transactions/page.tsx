export const dynamic = 'force-dynamic'

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
    date: tx.date.toISOString(),
    description: tx.description,
    category: tx.category,
    type: tx.type,
    amount: tx.amount,
    source: tx.source,
    budgetId: tx.budgetId ?? null,
    recurrence: tx.recurrence,
    nextDue: tx.nextDue ? tx.nextDue.toISOString() : null,
  }))

  return <TransactionsClient initialTransactions={initialTransactions}/>
}
