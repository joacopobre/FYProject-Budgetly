import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'

export const runtime = 'nodejs'

type Body = {
  mode: 'ADD' | 'WITHDRAW'
  amount: number
  note?: string
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }, // Next 15+ "params must be awaited"
) {
  const session = await getAuthSession()
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const amount = Number(body.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'Amount must be > 0' }, { status: 400 })
  }

  // Find budget and ensure it belongs to the logged-in user
  const budget = await prisma.budget.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, balance: true },
  })

  if (!budget) return NextResponse.json({ error: 'Budget not found' }, { status: 404 })

  const delta = body.mode === 'WITHDRAW' ? -Math.min(amount, budget.balance) : amount

  // Transaction: create event + update balance together
  const updated = await prisma.$transaction(async tx => {
    await tx.budgetEvent.create({
      data: {
        budgetId: budget.id,
        delta,
        note: body.note?.trim() || null,
      },
    })

    return tx.budget.update({
      where: { id: budget.id },
      data: { balance: { increment: delta } },
      include: { events: { orderBy: { date: 'asc' } } },
    })
  })

  return NextResponse.json(updated)
}
