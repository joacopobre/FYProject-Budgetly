'use client'

import { Pencil } from 'lucide-react'
import type { Transaction } from '@/types/transactions'

const PAGE_SIZE = 10

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric'
  return d.toLocaleDateString('en-GB', opts)
}

type Props = {
  transactions: Transaction[]
  onEdit: (tx: Transaction) => void
  formatMoney: (value: number) => string
  getSourceLabel: (tx: Transaction) => string
  totalCount: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function TransactionsTable({
  transactions,
  onEdit,
  formatMoney,
  getSourceLabel,
  totalCount,
  currentPage,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const endIndex = Math.min(currentPage * PAGE_SIZE, totalCount)

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-white/6 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:backdrop-blur-md md:block">
      <table className="min-w-full text-sm text-slate-700 dark:text-slate-300">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase dark:border-white/8 dark:bg-white/5 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">From</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="w-10 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-10 text-center text-sm text-slate-400 dark:text-slate-500"
              >
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map(tx => {
              const isIncome = tx.amount > 0
              const amountColor = isIncome
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
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
                <tr
                  key={tx.id}
                  className="group border-t border-slate-100 transition hover:bg-slate-50/60 dark:border-white/6 dark:hover:bg-white/4"
                >
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {formatDate(tx.date)}
                  </td>
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
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {getSourceLabel(tx)}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${amountColor}`}>
                    {formatMoney(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      title="Edit transaction"
                      className="inline-flex size-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-300"
                      onClick={() => onEdit(tx)}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {/* Pagination footer */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-white/8">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing {startIndex}–{endIndex} of {totalCount} transactions
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/8"
            >
              ←
            </button>
            <span className="min-w-[2.5rem] text-center text-xs text-slate-500 dark:text-slate-400">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/8"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
