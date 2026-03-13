export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'
import { getTransactionsForUser } from '@/lib/db/transactions'
import DashboardClient from './DashboardClient'
import type { Transaction } from '@/types/transactions'
import { getBudgetsForUser } from '@/lib/db/budgets'
import type { Budget } from '@/types/budgets'
import { processRecurringTransactions } from '@/lib/db/processRecurringTransactions'
import { processBudgetRollovers } from '@/lib/db/processBudgetRollovers'
import { processNotifications } from '@/lib/db/processNotifications'

export default async function DashboardPage() {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Auto-create instances for any recurring transactions that are due
  await processRecurringTransactions(session.user.id)

  // Reset SPEND budgets with rollover=false at the start of each month
  await processBudgetRollovers(session.user.id)

  // Generate threshold notifications
  await processNotifications(session.user.id)

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
  const budgetRows = await getBudgetsForUser(session.user.id)

  const initialBudgets: Budget[] = budgetRows.map(budget => ({
    id: budget.id,
    name: budget.name,
    kind: budget.kind,
    balance: budget.balance,
    target: budget.target ?? undefined,
    rollover: budget.rollover,
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
