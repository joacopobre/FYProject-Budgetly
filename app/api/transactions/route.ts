import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'

type Body = {
  date: string
  description: string
  category: string
  type: 'Income' | 'Expense'
  amount: number
  source: 'ACCOUNT' | 'BUDGET'
  budgetId?: string | null
  recurrence?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  nextDue?: string | null
}

export async function POST(req: Request) {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as Body

  if (body.source === 'ACCOUNT' && body.type === 'Expense') {
    const [txSum, budgetSum] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId: session.user.id },
        _sum: { amount: true },
      }),
      prisma.budget.aggregate({
        where: { userId: session.user.id },
        _sum: { balance: true },
      }),
    ])
    const available = (txSum._sum.amount ?? 0) - (budgetSum._sum.balance ?? 0)
    if (Math.abs(body.amount) > available) {
      return NextResponse.json(
        { error: `Insufficient available balance. You have £${available.toFixed(2)} available.` },
        { status: 400 },
      )
    }
  }

  const recurrence = body.recurrence ?? 'NONE'
  const created = await prisma.transaction.create({
    data: {
      userId: session.user.id,
      date: new Date(body.date),
      description: body.description,
      category: body.category,
      type: body.type,
      amount: body.amount,
      source: body.source,
      budgetId: body.source === 'BUDGET' ? (body.budgetId ?? null) : null,
      recurrence,
      nextDue: recurrence !== 'NONE' && body.nextDue ? new Date(body.nextDue) : null,
    },
  })

  return NextResponse.json(created)
}
