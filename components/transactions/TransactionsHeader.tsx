'use client'

type Props = {
  onAdd: () => void
}

export function TransactionsHeader({ onAdd }: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">Transactions</h1>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_4px_18px_rgba(16,185,129,0.5)]"
        onClick={onAdd}
      >
        Add transaction
      </button>
    </div>
  )
}
