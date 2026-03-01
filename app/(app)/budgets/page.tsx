import BudgetsClient from './BudgetsClient'
import { getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function BudgetsPage() {
  const session = await getAuthSession()
  if (!session) {
    redirect('/login')
  }
  return <BudgetsClient />
}
