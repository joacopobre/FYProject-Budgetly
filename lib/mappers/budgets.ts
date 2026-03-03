import type { Budget as UiBudget } from '@/types/budgets'

// Prisma returns Date objects for DateTime fields.
// This maps Prisma results into your UI Budget type (string dates).
export function mapBudgetsToUi(budgets: any[]): UiBudget[] {
  return budgets.map(b => ({
    id: b.id,
    name: b.name,
    kind: b.kind,
    balance: b.balance,
    target: b.target ?? undefined,
    createdAt:
      b.createdAt instanceof Date ? b.createdAt.toISOString() : String(b.createdAt),
    events: (b.events ?? []).map((e: any) => ({
      id: e.id,
      date: e.date instanceof Date ? e.date.toISOString() : String(e.date),
      delta: e.delta,
      note: e.note ?? undefined,
    })),
  }))
}
