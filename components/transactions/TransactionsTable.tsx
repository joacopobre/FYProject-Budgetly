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
    <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
      <div className="max-h-[50vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:none">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
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
              const amountColor = isIncome ? 'text-emerald-600' : 'text-rose-600'
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
                <tr key={tx.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{new Date(tx.date).toISOString().slice(0, 10)}</td>
                  <td className="px-4 py-3">{tx.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                      <span className={`h-2 w-2 rounded-full ${categoryDot}`} />
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">{tx.type}</td>
                  <td className="px-4 py-3">{getSourceLabel(tx)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${amountColor}`}>
                    {formatMoney(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                        onClick={() => onEdit(tx)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
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
