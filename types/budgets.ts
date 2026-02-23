export type BudgetKind = 'SPEND' | 'SAVE'

export type BudgetEvent = {
  id: string
  date: string
  delta: number
  note?: string
}

export type Budget = {
  id: string
  name: string
  kind: BudgetKind

  // how much money is currently inside this pot
  balance: number

  // optional goal (useful mainly for SAVE pots)
  target?: number

  createdAt: string

  events: BudgetEvent[]
}
