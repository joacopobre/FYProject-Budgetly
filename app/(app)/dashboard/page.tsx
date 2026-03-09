export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'
import { getTransactionsForUser } from '@/lib/db/transactions'
import DashboardClient from './DashboardClient'
import type { Transaction } from '@/types/transactions'
import { getBudgetsForUser } from '@/lib/db/budgets'
import type { Budget } from '@/types/budgets'

export default async function DashboardPage() {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    redirect('/login')
  }

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
  }))
  const budgetRows = await getBudgetsForUser(session.user.id)

  const initialBudgets: Budget[] = budgetRows.map(budget => ({
    id: budget.id,
    name: budget.name,
    kind: budget.kind,
    balance: budget.balance,
    target: budget.target ?? undefined,
    createdAt: budget.createdAt.toISOString(),
    events: budget.events.map(event => ({
      id: event.id,
      date: event.date.toISOString(),
      delta: event.delta,
      note: event.note ?? undefined,
    })),
  }))

  return (
    <DashboardClient
      initialTransactions={initialTransactions}
      initialBudgets={initialBudgets}
    />
  )
}
