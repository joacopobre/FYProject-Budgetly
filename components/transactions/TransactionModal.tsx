'use client'

import { useEffect, useRef, useState } from 'react'
import type { TxType } from '@/types/transactions'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  editingId: number | null
  date: string
  setDate: (v: string) => void
  description: string
  setDescription: (v: string) => void
  category: string
  setCategory: (v: string) => void
  type: TxType
  setType: (v: TxType) => void
  amount: string
  setAmount: (v: string) => void
}

const typeOptions: TxType[] = ['Expense', 'Income']

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  editingId,
  date,
  setDate,
  description,
  setDescription,
  category,
  setCategory,
  type,
  setType,
  amount,
  setAmount,
}: Props) {
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false)
  const typeMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prev
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isTypeMenuOpen) return
    const onClickAway = (e: MouseEvent | TouchEvent) => {
      if (typeMenuRef.current && typeMenuRef.current.contains(e.target as Node)) return
      setIsTypeMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('touchstart', onClickAway)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('touchstart', onClickAway)
    }
  }, [isTypeMenuOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit transaction' : 'Add transaction'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Enter details for this transaction.</p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700" htmlFor="date">
            Date
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <div
            className="relative flex flex-col gap-2 text-sm font-medium text-gray-700"
            ref={typeMenuRef}
          >
            <span>Type</span>
            <button
              type="button"
              onClick={() => setIsTypeMenuOpen(prev => !prev)}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {type}
              <span className="text-xs text-gray-500">▼</span>
            </button>
            {isTypeMenuOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5">
                {typeOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${
                      option === type ? 'font-semibold text-emerald-600' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setType(option)
                      setIsTypeMenuOpen(false)
                    }}
                  >
                    {option}
                    {option === type && <span className="text-emerald-600">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700" htmlFor="description">
            Description
            <input
              id="description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              placeholder="e.g. Coffee"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700" htmlFor="category">
            Category
            <input
              id="category"
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              placeholder="e.g. Food"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700" htmlFor="amount">
          Amount
          <input
            id="amount"
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            placeholder="0.00"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-2">
          <button
            type="button"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}


