export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'

type CreateBudgetBody = {
  name: string
  kind: 'SPEND' | 'SAVE'
  target?: number
  startingAmount?: number // optional initial balance for either kind
  rollover?: boolean
}
export async function GET() {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id },
    include: { events: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(budgets)
}

export async function POST(req: Request) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as CreateBudgetBody

  const name = body.name?.trim()
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const kind = body.kind
  if (kind !== 'SPEND' && kind !== 'SAVE') {
    return NextResponse.json({ error: 'Invalid kind' }, { status: 400 })
  }

  const target =
    kind === 'SAVE' && typeof body.target === 'number' && body.target > 0
      ? body.target
      : null

  const startingAmount =
    typeof body.startingAmount === 'number' && body.startingAmount >= 0
      ? body.startingAmount
      : 0

  const rollover = kind === 'SPEND' && typeof body.rollover === 'boolean' ? body.rollover : false

  // If you want to record an initial event when startingAmount > 0
  type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
  const created = await prisma.$transaction(async (tx: TxClient) => {
    const budget = await tx.budget.create({
      data: {
        name,
        kind,
        target: target ?? null,
        balance: startingAmount ?? 0,
        rollover,
        lastResetAt: kind === 'SPEND' ? new Date() : null,
        userId: session.user.id,
        events: startingAmount
          ? {
              create: {
                delta: startingAmount,
                note: 'Initial allocation',
              },
            }
          : undefined,
      },
      include: { events: true },
    })

    if (startingAmount && startingAmount > 0) {
      await tx.transaction.createMany({
        data: [
          {
            userId: session.user.id,
            type: 'Transfer',
            source: 'ACCOUNT',
            amount: -startingAmount,
            description: `Transfer to ${budget.name}`,
            category: 'Transfer',
            budgetId: budget.id,
          },
          {
            userId: session.user.id,
            type: 'Transfer',
            source: 'BUDGET',
            amount: startingAmount,
            description: `Transfer from Account`,
            category: 'Transfer',
            budgetId: budget.id,
          },
        ],
      })
    }

    return budget
  })

  return NextResponse.json(created)
}
