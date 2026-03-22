import { getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export const metadata = { title: 'Settings — Budgetly' }

export default async function SettingsPage() {
  const session = await getAuthSession()
  if (!session) redirect('/login')

  return (
    <main className="min-h-screen px-4 pb-16 pt-28 md:px-6">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account settings
        </h1>
        <SettingsClient />
      </div>
    </main>
  )
}
