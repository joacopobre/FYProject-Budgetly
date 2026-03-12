'use client'

import type { Transaction } from '@/types/transactions'

type Props = {
  transactions: Transaction[]
  onEdit: (tx: Transaction) => void
  onDelete: (id: number) => void
  formatMoney: (value: number) => string
  getSourceLabel: (tx: Transaction) => string
}

export function TransactionsMobileList({
  transactions,
  onEdit,
  onDelete,
  formatMoney,
  getSourceLabel,
}: Props) {
  return (
    <div className="space-y-3 md:hidden">
      {transactions.map(tx => {
        const isIncome = tx.amount > 0
        const amountColor = isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
        const accentBar = isIncome ? 'bg-emerald-500' : 'bg-rose-500'
        return (
          <div
            key={tx.id}
            className="relative overflow-hidden flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)] dark:border-white/8 dark:bg-white/6 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:backdrop-blur-md"
          >
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentBar}`} />
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>{tx.date}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-400">
                {tx.type}
              </span>
            </div>
            <div className="text-base font-semibold text-slate-800 dark:text-slate-100">{tx.description}</div>
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>{tx.category}</span>
              <span className={`font-semibold ${amountColor}`}>{formatMoney(tx.amount)}</span>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">From: {getSourceLabel(tx)}</div>
            <div className="flex items-center justify-end gap-2">
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
          </div>
        )
      })}
    </div>
  )
}
