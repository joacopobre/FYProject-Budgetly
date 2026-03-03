import { prisma } from '@/lib/prisma'

export async function getBudgetsForUser(userId: string) {
  return prisma.budget.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      events: { orderBy: { date: 'asc' } },
    },
  })
}
