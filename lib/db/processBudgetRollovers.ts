import { prisma } from '@/lib/prisma'

export async function processBudgetRollovers(userId: string): Promise<void> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Find SPEND budgets with rollover=false that haven't been reset this month
  const budgets = await prisma.budget.findMany({
    where: {
      userId,
      kind: 'SPEND',
      rollover: false,
      OR: [
        { lastResetAt: null },
        { lastResetAt: { lt: startOfMonth } },
      ],
    },
    select: { id: true, name: true, balance: true },
  })

  for (const budget of budgets) {
    const unusedBalance = budget.balance

    await prisma.$transaction(async (tx) => {
      if (unusedBalance > 0) {
        // Zero out the budget balance via a BudgetEvent
        await tx.budgetEvent.create({
          data: {
            budgetId: budget.id,
            delta: -unusedBalance,
            note: 'Monthly reset — unused balance returned to account',
          },
        })

        // Return the unused balance to the account as a Transfer pair
        await tx.transaction.createMany({
          data: [
            {
              userId,
              type: 'Transfer',
              source: 'BUDGET',
              amount: -unusedBalance,
              description: `Monthly reset — ${budget.name}`,
              category: 'Transfer',
              budgetId: budget.id,
              date: now,
            },
            {
              userId,
              type: 'Transfer',
              source: 'ACCOUNT',
              amount: unusedBalance,
              description: `Monthly reset — ${budget.name}`,
              category: 'Transfer',
              budgetId: budget.id,
              date: now,
            },
          ],
        })
      }

      await tx.budget.update({
        where: { id: budget.id },
        data: { balance: 0, lastResetAt: now },
      })
    })
  }
}
