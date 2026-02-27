import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const budgetCount = await prisma.budget.count()

  return NextResponse.json({
    ok: true,
    prisma: 'connected',
    budgetCount,
  })
}
