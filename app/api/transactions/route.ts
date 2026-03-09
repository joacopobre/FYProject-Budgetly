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
}

export async function POST(req: Request) {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as Body

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
    },
  })

  return NextResponse.json(created)
}
