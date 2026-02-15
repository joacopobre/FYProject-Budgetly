'use client'

import type { Transaction } from '@/types/transactions'

type Props = {
  transactions: Transaction[]
  onEdit: (tx: Transaction) => void
  onDelete: (id: number) => void
  formatMoney: (value: number) => string
}

export function TransactionsTable({ transactions, onEdit, onDelete, formatMoney }: Props) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => {
            const isIncome = tx.amount > 0
            const amountColor = isIncome ? 'text-emerald-600' : 'text-rose-600'
            return (
              <tr key={tx.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{tx.date}</td>
                <td className="px-4 py-3">{tx.description}</td>
                <td className="px-4 py-3">{tx.category}</td>
                <td className="px-4 py-3">{tx.type}</td>
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
  )
}
