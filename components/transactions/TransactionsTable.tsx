'use client'

import type { Transaction } from '@/types/transactions'

type Props = {
  transactions: Transaction[]
  onEdit: (tx: Transaction) => void
  onDelete: (id: number) => void
  formatMoney: (value: number) => string
  getSourceLabel: (tx: Transaction) => string
}

export function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
  formatMoney,
  getSourceLabel,
}: Props) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-white/6 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:backdrop-blur-md md:block">
      <div className="max-h-[50vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:none">
        <table className="min-w-full text-sm text-slate-700 dark:text-slate-300">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase dark:border-white/8 dark:bg-white/5 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">From</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => {
              const isIncome = tx.amount > 0
              const amountColor = isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
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
              const categoryDot = categoryColors[tx.category] ?? 'bg-slate-400'
              return (
                <tr key={tx.id} className="border-t border-slate-100 transition hover:bg-slate-50/60 dark:border-white/6 dark:hover:bg-white/4">
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{new Date(tx.date).toISOString().slice(0, 10)}</td>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                    <span className="flex items-center gap-2">
                      {tx.description}
                      {tx.recurrence !== 'NONE' && (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                          ↻ {tx.recurrence.charAt(0) + tx.recurrence.slice(1).toLowerCase()}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-300">
                      <span className={`h-2 w-2 rounded-full ${categoryDot}`} />
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{tx.type}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{getSourceLabel(tx)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${amountColor}`}>
                    {formatMoney(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                        onClick={() => onEdit(tx)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
                        onClick={() => onDelete(tx.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
