export const dynamic = 'force-dynamic'

import BudgetsClient from './BudgetsClient'
import { getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getBudgetsForUser } from '@/lib/db/budgets'
import { mapBudgetsToUi } from '@/lib/mappers/budgets'
import { prisma } from '@/lib/prisma'

export default async function BudgetsPage() {
  const session = await getAuthSession()
  if (!session?.user?.id) redirect('/login')

  const [budgets, rawLimits] = await Promise.all([
    getBudgetsForUser(session.user.id),
    prisma.categoryLimit.findMany({
      where: { userId: session.user.id },
      orderBy: { category: 'asc' },
    }),
  ])

  const initialBudgets = mapBudgetsToUi(budgets)
  const initialLimits = rawLimits.map(l => ({
    id: l.id,
    category: l.category,
    monthlyLimit: l.monthlyLimit,
  }))

  return <BudgetsClient initialBudgets={initialBudgets} initialLimits={initialLimits} />
}