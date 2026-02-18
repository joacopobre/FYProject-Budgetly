export type Budget = {
  id: number
  name: string
  category: string
  limit: number
  period: 'Monthly' | 'Weekly'
  createdAt: string
}
