'use client'

import { X } from 'lucide-react'
import type { Budget } from '@/types/budgets'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  fundMode: 'ADD' | 'WITHDRAW' | null
  activeBudget: Budget | null
  fundAmount: string
  setFundAmount: (v: string) => void
  fundNote: string
  setFundNote: (v: string) => void
  isFundNoteOpen: boolean
  setIsFundNoteOpen: (v: boolean) => void
}

const formatMoney = (value: number) => `$${value.toFixed(2)}`

export function FundModal({
  isOpen,
  onClose,
  onConfirm,
  fundMode,
  activeBudget,
  fundAmount,
  setFundAmount,
  fundNote,
  setFundNote,
  isFundNoteOpen,
  setIsFundNoteOpen,
}: Props) {
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {fundMode === 'ADD' ? 'Add Funds' : 'Withdraw Funds'}
            </h2>
            {activeBudget && (
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Current balance:{' '}
                <span className="font-medium text-gray-700 dark:text-slate-300">
                  {formatMoney(activeBudget.balance)}
                </span>
              </p>
            )}
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
          <label className="flex flex-col text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="fund">
            {fundMode === 'ADD' ? 'Amount to add:' : 'Amount to withdraw:'}
            {fundMode === 'WITHDRAW' && activeBudget && (
              <span className="mb-2 text-xs text-gray-400 dark:text-slate-500">
                Max available: {formatMoney(activeBudget.balance)}
              </span>
            )}
            <input
              id="fund"
              type="number"
              className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
              placeholder="e.g. 100"
              value={fundAmount}
              onChange={e => setFundAmount(e.currentTarget.value)}
            />
          </label>

          <div className="flex gap-3">
            {isFundNoteOpen ? (
              <button
                type="button"
                className="cursor-pointer rounded-xl px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-200 hover:text-gray-500 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-400"
                onClick={() => {
                  setIsFundNoteOpen(false)
                  setFundNote('')
                }}
              >
                <X className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                className="cursor-pointer rounded-xl px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-200 hover:text-gray-500 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-400"
                onClick={() => setIsFundNoteOpen(true)}
              >
                + add note
              </button>
            )}
            {isFundNoteOpen && (
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-slate-300" htmlFor="note">
                <input
                  id="note"
                  type="text"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
                  placeholder="e.g. rent"
                  value={fundNote}
                  onChange={e => setFundNote(e.currentTarget.value)}
                />
              </label>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-2">
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition hover:from-emerald-600 hover:to-teal-600"
              onClick={onConfirm}
            >
              Save
            </button>
            <button
              type="button"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
