import { formatMoney } from '@/lib/transactions/formatMoney'
import type { Transaction } from '@/types/transactions'

type Props = {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: Props) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-4 dark:border-white/8 dark:bg-white/5">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300">Recent Transactions</h3>

      {recent.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          No transactions yet.
        </p>
      ) : (
        <div className="max-h-72 space-y-3 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {recent.map(tx => {
            const amountColor = tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            const categoryColors: Record<string, string> = {
              Food: 'bg-emerald-500',
              Groceries: 'bg-lime-500',
              Rent: 'bg-rose-500',
              Salary: 'bg-sky-500',
              Transfer: 'bg-violet-500',
              Entertainment: 'bg-amber-500',
              Transport: 'bg-cyan-500',
              Shopping: 'bg-pink-500',
            }
            const categoryDot = categoryColors[tx.category] ?? 'bg-gray-400'
            return (
              <div
                key={tx.id}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition-colors hover:bg-slate-50 dark:border-white/8 dark:bg-white/6 dark:hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-700 dark:text-slate-200">{tx.description}</p>
                    <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-white/8 dark:text-slate-400">
                      <span className={`h-2 w-2 rounded-full ${categoryDot}`} />
                      {tx.category}
                    </span>
                  </div>
                  <span className={`shrink-0 text-sm font-semibold ${amountColor}`}>
                    {formatMoney(tx.amount)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">{tx.date}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}