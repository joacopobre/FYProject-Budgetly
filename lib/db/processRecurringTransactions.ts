import { prisma } from '@/lib/prisma'

function advanceNextDue(current: Date, recurrence: string): Date {
  const next = new Date(current)
  switch (recurrence) {
    case 'DAILY':
      next.setDate(next.getDate() + 1)
      break
    case 'WEEKLY':
      next.setDate(next.getDate() + 7)
      break
    case 'MONTHLY':
      next.setMonth(next.getMonth() + 1)
      break
    case 'YEARLY':
      next.setFullYear(next.getFullYear() + 1)
      break
  }
  return next
}

export async function processRecurringTransactions(userId: string): Promise<void> {
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const due = await prisma.transaction.findMany({
    where: {
      userId,
      recurrence: { not: 'NONE' },
      nextDue: { lte: today },
    },
  })

  for (const tx of due) {
    if (!tx.nextDue) continue

    let nextDue = tx.nextDue

    // Loop to catch up all missed instances
    while (nextDue <= today) {
      const instanceDate = new Date(nextDue)

      if (tx.source === 'BUDGET' && tx.budgetId) {
        // Replicate the full budget event logic inside a transaction
        await prisma.$transaction(async (prismaTx) => {
          type TxClient = typeof prismaTx
          const budget = await (prismaTx as TxClient).budget.findFirst({
            where: { id: tx.budgetId!, userId },
            select: { id: true, name: true, balance: true },
          })

          if (!budget) return

          const amount = Math.abs(tx.amount)
          const delta = -amount // spending from budget reduces balance

          await (prismaTx as TxClient).budgetEvent.create({
            data: {
              budgetId: budget.id,
              delta,
              note: tx.description,
            },
          })

          await (prismaTx as TxClient).budget.update({
            where: { id: budget.id },
            data: { balance: budget.balance + delta },
          })

          // Create the spend transaction from budget
          await (prismaTx as TxClient).transaction.create({
            data: {
              userId: tx.userId,
              date: instanceDate,
              description: tx.description,
              category: tx.category,
              type: tx.type,
              amount: tx.amount,
              source: 'BUDGET',
              budgetId: tx.budgetId,
              recurrence: 'NONE',
              nextDue: null,
            },
          })
        })
      } else {
        await prisma.transaction.create({
          data: {
            userId: tx.userId,
            date: instanceDate,
            description: tx.description,
            category: tx.category,
            type: tx.type,
            amount: tx.amount,
            source: tx.source,
            budgetId: tx.budgetId,
            recurrence: 'NONE',
            nextDue: null,
          },
        })
      }

      nextDue = advanceNextDue(nextDue, tx.recurrence)
    }

    // Update the template's nextDue to the first future date
    await prisma.transaction.update({
      where: { id: tx.id },
      data: { nextDue },
    })
  }
}
