export const dynamic = 'force-dynamic'

import BudgetsClient from './BudgetsClient'
import { getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getBudgetsForUser } from '@/lib/db/budgets'
import { mapBudgetsToUi } from '@/lib/mappers/budgets'

export default async function BudgetsPage() {
  const session = await getAuthSession()
  if (!session?.user?.id) redirect('/login')

  const budgets = await getBudgetsForUser(session.user.id)
  const initialBudgets = mapBudgetsToUi(budgets)

  return <BudgetsClient initialBudgets={initialBudgets} />
}