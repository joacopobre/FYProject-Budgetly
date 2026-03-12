export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'

export async function GET() {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const limits = await prisma.categoryLimit.findMany({
    where: { userId: session.user.id },
    orderBy: { category: 'asc' },
  })

  return NextResponse.json(limits)
}

export async function POST(req: Request) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as { category?: string; monthlyLimit?: number }

  const category = body.category?.trim()
  if (!category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 })
  }

  if (typeof body.monthlyLimit !== 'number' || body.monthlyLimit <= 0) {
    return NextResponse.json({ error: 'Monthly limit must be a positive number' }, { status: 400 })
  }

  try {
    const limit = await prisma.categoryLimit.create({
      data: {
        category,
        monthlyLimit: body.monthlyLimit,
        userId: session.user.id,
      },
    })
    return NextResponse.json(limit, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'A limit for this category already exists' },
      { status: 409 },
    )
  }
}
