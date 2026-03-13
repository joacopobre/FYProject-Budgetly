import { prisma } from '@/lib/prisma'

export async function processNotifications(userId: string): Promise<void> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Fetch existing notifications this month (read or unread) to avoid duplicates
  const existingUnread = await prisma.notification.findMany({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
    select: { message: true },
  })
  const existingMessages = new Set(existingUnread.map(n => n.message))

  const toCreate: { message: string; type: 'WARNING' | 'INFO' | 'SUCCESS' }[] = []

  // --- SPEND budgets: < 20% balance remaining relative to total funded ---
  const spendBudgets = await prisma.budget.findMany({
    where: { userId, kind: 'SPEND' },
    select: { id: true, name: true, balance: true, events: { select: { delta: true } } },
  })

  for (const budget of spendBudgets) {
    const totalFunded = budget.events
      .filter(e => e.delta > 0)
      .reduce((sum, e) => sum + e.delta, 0)

    if (totalFunded <= 0) continue

    const pct = budget.balance / totalFunded
    if (pct < 0.2) {
      const msg = `Budget "${budget.name}" is running low — less than 20% remaining.`
      if (!existingMessages.has(msg)) {
        toCreate.push({ message: msg, type: 'WARNING' })
      }
    }
  }

  // --- SAVE budgets: >= 90% of target reached ---
  const saveBudgets = await prisma.budget.findMany({
    where: { userId, kind: 'SAVE', target: { not: null } },
    select: { id: true, name: true, balance: true, target: true },
  })

  for (const budget of saveBudgets) {
    if (!budget.target) continue
    const pct = budget.balance / budget.target
    if (pct >= 0.9) {
      const msg = `Savings goal "${budget.name}" is ${Math.round(pct * 100)}% funded — almost there!`
      if (!existingMessages.has(msg)) {
        toCreate.push({ message: msg, type: 'SUCCESS' })
      }
    }
  }

  // --- Category limits: >= 80% of monthly limit reached ---
  const categoryLimits = await prisma.categoryLimit.findMany({
    where: { userId },
    select: { category: true, monthlyLimit: true },
  })

  if (categoryLimits.length > 0) {
    // Sum expenses this month per category
    const expenses = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        type: 'Expense',
        date: { gte: startOfMonth },
      },
      _sum: { amount: true },
    })

    const spendingByCategory = new Map(
      expenses.map(e => [e.category, Math.abs(e._sum.amount ?? 0)])
    )

    for (const limit of categoryLimits) {
      const spent = spendingByCategory.get(limit.category) ?? 0
      const pct = spent / limit.monthlyLimit
      if (pct >= 0.8) {
        const msg = `Category "${limit.category}" has used ${Math.round(pct * 100)}% of its monthly limit.`
        if (!existingMessages.has(msg)) {
          toCreate.push({ message: msg, type: 'WARNING' })
        }
      }
    }
  }

  // Bulk create new notifications
  if (toCreate.length > 0) {
    await prisma.notification.createMany({
      data: toCreate.map(n => ({ ...n, userId })),
    })
  }
}
