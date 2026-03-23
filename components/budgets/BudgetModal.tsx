'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import type { BudgetKind } from '@/types/budgets'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  editingBudgetId: string | null
  name: string
  setName: (v: string) => void
  limit: string
  setLimit: (v: string) => void
  startingAmount: string
  setStartingAmount: (v: string) => void
  budgetKind: BudgetKind
  setBudgetKind: (v: BudgetKind) => void
  rollover: boolean
  setRollover: (v: boolean) => void
  error?: string | null
}

export function BudgetModal({
  isOpen,
  onClose,
  onSave,
  editingBudgetId,
  name,
  setName,
  limit,
  setLimit,
  startingAmount,
  setStartingAmount,
  budgetKind,
  setBudgetKind,
  rollover,
  setRollover,
  error,
}: Props) {
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#0e2318]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add budget</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Create a new budget with a limit.</p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-300"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="name">
            Budget name
            <input
              id="name"
              value={name}
              onChange={e => setName(e.currentTarget.value)}
              type="text"
              className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
              placeholder="e.g. Groceries"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBudgetKind('SPEND')}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                budgetKind === 'SPEND'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              Spend
            </button>
            <button
              type="button"
              onClick={() => setBudgetKind('SAVE')}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                budgetKind === 'SAVE'
                  ? 'bg-green-600 text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              Save
            </button>
          </div>

          {budgetKind === 'SPEND' && (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 dark:border-white/10">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Roll over unused balance</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-500">If off, balance resets to zero each month</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={rollover}
                onClick={() => setRollover(!rollover)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  rollover ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-white/20'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    rollover ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {budgetKind === 'SAVE' && (
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="limit">
              Goal amount
              <input
                id="limit"
                value={limit}
                onChange={e => setLimit(e.currentTarget.value)}
                type="number"
                min="0"
                className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
                placeholder="0.00"
              />
            </label>
          )}

          {editingBudgetId === null && (
            <label
              className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"
              htmlFor="startingAmount"
            >
              {budgetKind === 'SAVE' ? 'Initial deposit' : 'Starting amount'}
              <input
                id="startingAmount"
                value={startingAmount}
                onChange={e => setStartingAmount(e.currentTarget.value)}
                type="number"
                min="0"
                className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
                placeholder="0.00"
              />
            </label>
          )}
        </div>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-2">
          <button
            type="button"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition hover:from-emerald-600 hover:to-teal-600"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
