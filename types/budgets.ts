export type BudgetKind = 'SPEND' | 'SAVE'

export type Budget = {
  id: number
  name: string
  kind: BudgetKind

  // how much money is currently inside this pot
  balance: number

  // optional goal (useful mainly for SAVE pots)
  target?: number

  createdAt: string
}