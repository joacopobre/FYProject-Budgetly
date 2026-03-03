import { prisma } from '@/lib/prisma'

export async function getTransactionsForUser(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    include: { budget: { select: { id: true, name: true } } },
  })
}
