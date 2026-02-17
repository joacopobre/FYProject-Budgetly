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
    <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
      <h3 className="text-sm font-semibold text-gray-700">Recent Transactions</h3>

      {recent.length === 0 ? (
        <p className="text-sm text-gray-500">No transactions yet</p>
      ) : (
        <div className="max-h-72 space-y-3 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {recent.map(tx => {
            const amountColor = tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
            return (
              <div key={tx.id} className="rounded-lg bg-white px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-700">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.category}</p>
                  </div>
                  <span className={`shrink-0 text-sm font-semibold ${amountColor}`}>
                    {formatMoney(tx.amount)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{tx.date}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}