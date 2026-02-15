'use client'

type Props = {
  onAdd: () => void
}

export function TransactionsHeader({ onAdd }: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-4xl font-semibold text-gray-800 md:text-5xl">Transactions</h1>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        onClick={onAdd}
      >
        Add transaction
      </button>
    </div>
  )
}
