import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'

type Body = {
  mode: 'ADD' | 'WITHDRAW'
  amount: number
  note?: string
}

type Ctx = { params: Promise<{ id: string }> }

export async function POST(req: Request, { params }: Ctx) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: budgetId } = await params
  const body = (await req.json()) as Body

  const amount = Number(body.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const mode = body.mode
  if (mode !== 'ADD' && mode !== 'WITHDRAW') {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  }

  try {
    type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
    const result = await prisma.$transaction(async (tx: TxClient) => {
      const budget = await tx.budget.findFirst({
        where: { id: budgetId, userId: session.user.id },
        select: { id: true, name: true, balance: true },
      })

      if (!budget) throw new Error('NOT_FOUND')
      if (mode === 'WITHDRAW' && budget.balance < amount)
        throw new Error('INSUFFICIENT_FUNDS')

      const delta = mode === 'ADD' ? amount : -amount

      await tx.budgetEvent.create({
        data: {
          budgetId: budget.id,
          delta,
          note: body.note?.trim() || null,
        },
      })

      const updated = await tx.budget.update({
        where: { id: budget.id },
        data: { balance: budget.balance + delta },
        include: { events: true },
      })

      let createdTransactions: Awaited<ReturnType<typeof tx.transaction.create>>[] = []

      if (mode === 'ADD') {
        const t1 = await tx.transaction.create({
          data: {
            userId: session.user.id,
            type: 'Transfer',
            source: 'ACCOUNT',
            amount: -amount,
            description: `Transfer to ${budget.name}`,
            category: 'Transfer',
            budgetId: budget.id,
          },
        })
        const t2 = await tx.transaction.create({
          data: {
            userId: session.user.id,
            type: 'Transfer',
            source: 'BUDGET',
            amount,
            description: `Transfer from Account`,
            category: 'Transfer',
            budgetId: budget.id,
          },
        })
        createdTransactions = [t1, t2]
      } else {
        const t1 = await tx.transaction.create({
          data: {
            userId: session.user.id,
            type: 'Transfer',
            source: 'BUDGET',
            amount: -amount,
            description: `Transfer to Account`,
            category: 'Transfer',
            budgetId: budget.id,
          },
        })
        const t2 = await tx.transaction.create({
          data: {
            userId: session.user.id,
            type: 'Transfer',
            source: 'ACCOUNT',
            amount,
            description: `Transfer from ${budget.name}`,
            category: 'Transfer',
            budgetId: budget.id,
          },
        })
        createdTransactions = [t1, t2]
      }

      return { budget: updated, transactions: createdTransactions }
    })

    return NextResponse.json(result)
  } catch (err: any) {
    if (err?.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (err?.message === 'INSUFFICIENT_FUNDS') {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
    }
    throw err
  }
}
