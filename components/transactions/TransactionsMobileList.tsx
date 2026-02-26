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
        const amountColor = isIncome ? 'text-emerald-600' : 'text-rose-600'
        return (
          <div
            key={tx.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{tx.date}</span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                {tx.type}
              </span>
            </div>
            <div className="text-base font-semibold text-gray-800">{tx.description}</div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{tx.category}</span>
              <span className={`font-semibold ${amountColor}`}>{formatMoney(tx.amount)}</span>
            </div>
            <div className="text-xs text-gray-500">From: {getSourceLabel(tx)}</div>
            <div className="flex items-center justify-end gap-2">
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
          </div>
        )
      })}
    </div>
  )
}
