'use client'

import { useContext, useMemo, useState } from 'react'
import { TransactionsContext } from '@/context/TransactionsContext'
import { SpendingLimitModal } from './SpendingLimitModal'
import type { CategoryLimit } from '@/types/categoryLimits'

type Props = {
  initialLimits: CategoryLimit[]
}

export function SpendingLimits({ initialLimits }: Props) {
  const [limits, setLimits] = useState<CategoryLimit[]>(initialLimits)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLimit, setEditingLimit] = useState<CategoryLimit | null>(null)

  const txContext = useContext(TransactionsContext)
  if (!txContext) throw new Error('TransactionsContext missing')
  const { transactions } = txContext

  // Current month expense totals per category
  const spentByCategory = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const map: Record<string, number> = {}
    for (const tx of transactions) {
      if (tx.type !== 'Expense') continue
      const d = new Date(tx.date)
      if (d.getFullYear() !== year || d.getMonth() !== month) continue
      map[tx.category] = (map[tx.category] ?? 0) + Math.abs(tx.amount)
    }
    return map
  }, [transactions])

  // All unique categories from transactions (for the modal dropdown)
  const usedCategories = useMemo(
    () =>
      Array.from(new Set(transactions.map(tx => tx.category).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [transactions],
  )

  // Categories that don't already have a limit (for the add modal)
  const availableCategories = useMemo(
    () => usedCategories.filter(cat => !limits.some(l => l.category === cat)),
    [usedCategories, limits],
  )

  const handleAdd = async (category: string, monthlyLimit: number) => {
    const res = await fetch('/api/category-limits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, monthlyLimit }),
    })
    if (!res.ok) return
    const created: CategoryLimit = await res.json()
    setLimits(prev => [...prev, created].sort((a, b) => a.category.localeCompare(b.category)))
    setIsModalOpen(false)
  }

  const handleUpdate = async (id: string, monthlyLimit: number) => {
    const res = await fetch(`/api/category-limits/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monthlyLimit }),
    })
    if (!res.ok) return
    const updated: CategoryLimit = await res.json()
    setLimits(prev => prev.map(l => (l.id === id ? updated : l)))
    setEditingLimit(null)
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/category-limits/${id}`, { method: 'DELETE' })
    if (!res.ok) return
    setLimits(prev => prev.filter(l => l.id !== id))
  }

  const openEdit = (limit: CategoryLimit) => {
    setEditingLimit(limit)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingLimit(null)
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Spending Limits</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Monthly caps per category — resets automatically each month.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_4px_18px_rgba(16,185,129,0.5)]"
          onClick={() => {
            setEditingLimit(null)
            setIsModalOpen(true)
          }}
        >
          Add limit
        </button>
      </div>

      {limits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400 dark:border-white/10 dark:text-slate-500">
          No spending limits set. Add one to start tracking category budgets.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {limits.map(limit => {
            const spent = spentByCategory[limit.category] ?? 0
            const pct = limit.monthlyLimit > 0 ? (spent / limit.monthlyLimit) * 100 : 0
            const clampedPct = Math.min(pct, 100)
            const isOver = pct >= 100
            const isWarning = !isOver && pct >= 80

            const barClass = isOver
              ? 'bg-gradient-to-r from-rose-400 to-rose-600'
              : isWarning
                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                : 'bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600'

            const statusClass = isOver
              ? 'text-rose-600 dark:text-rose-400'
              : isWarning
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-600 dark:text-slate-400'

            return (
              <div
                key={limit.id}
                className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-white/6 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:backdrop-blur-md"
              >
                <div
                  className={`absolute top-0 right-0 left-0 h-[3px] ${isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-gradient-to-r from-teal-400 to-cyan-500'}`}
                />

                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    {limit.category}
                  </h3>
                  {isOver && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                      Over limit
                    </span>
                  )}
                  {isWarning && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                      Near limit
                    </span>
                  )}
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${barClass}`}
                    style={{ width: `${clampedPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={statusClass}>
                    £{spent.toFixed(2)} of £{limit.monthlyLimit.toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                      onClick={() => openEdit(limit)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
                      onClick={() => handleDelete(limit.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <SpendingLimitModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleAdd}
        onUpdate={handleUpdate}
        categories={availableCategories}
        editingLimit={editingLimit}
      />
    </section>
  )
}
