'use client'

type Props = {
  onAdd: () => void
  onImport: () => void
}

export function TransactionsHeader({ onAdd, onImport }: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white md:text-5xl lg:text-6xl">Transactions</h1>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/8"
          onClick={onImport}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Import CSV
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_4px_18px_rgba(16,185,129,0.5)]"
          onClick={onAdd}
        >
          Add transaction
        </button>
      </div>
    </div>
  )
}
