import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'

type Body = {
  date: string
  description: string
  category: string
  type: 'Income' | 'Expense' | 'Transfer'
  amount: number
  source: 'ACCOUNT' | 'BUDGET'
  budgetId?: string | null
  recurrence?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  nextDue?: string | null
}

type Ctx = {
  params: Promise<{ id: string }>
}

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const txId = Number(id)

  if (!Number.isInteger(txId)) {
    return NextResponse.json({ error: 'Invalid transaction id' }, { status: 400 })
  }

  const body = (await req.json()) as Body

  const recurrence = body.recurrence ?? 'NONE'
  const updated = await prisma.transaction.updateMany({
    where: {
      id: txId,
      userId: session.user.id,
    },
    data: {
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

  if (updated.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const tx = await prisma.transaction.findFirst({
    where: {
      id: txId,
      userId: session.user.id,
    },
  })

  return NextResponse.json(tx)
}
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const txId = Number(id)

  if (!Number.isInteger(txId)) {
    return NextResponse.json({ error: 'Invalid transaction id' }, { status: 400 })
  }

  const deleted = await prisma.transaction.deleteMany({
    where: {
      id: txId,
      userId: session.user.id,
    },
  })

  if (deleted.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
