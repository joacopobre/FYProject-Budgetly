import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'

type Ctx = {
  params: Promise<{ id: string }>
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params

  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, kind, target } = await req.json()

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  // target can be null/undefined for SPEND, or a positive number for SAVE
  if (target !== undefined && target !== null) {
    const num = Number(target)
    if (Number.isNaN(num) || num <= 0) {
      return NextResponse.json({ error: 'Invalid target' }, { status: 400 })
    }
  }

  try {
    const updated = await prisma.budget.update({
      where: { id, userId: session.user.id },
      data: {
        name: name.trim(),
        kind,
        target: target ?? null,
      },
      include: { events: true },
    })

    return NextResponse.json(updated)
  } catch (e) {
    // If id+userId not found, Prisma throws
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const budget = await prisma.budget.findFirst({
    where: { id, userId: session.user.id },
    select: { balance: true },
  })

  if (!budget) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (budget.balance !== 0) {
    return NextResponse.json(
      { error: 'Budget balance must be zero before deleting. Please withdraw all funds first.' },
      { status: 400 },
    )
  }

  await prisma.budget.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
