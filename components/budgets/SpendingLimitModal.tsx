'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CategoryLimit } from '@/types/categoryLimits'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (category: string, monthlyLimit: number) => Promise<void>
  onUpdate: (id: string, monthlyLimit: number) => Promise<void>
  categories: string[]
  editingLimit: CategoryLimit | null
}

export function SpendingLimitModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  categories,
  editingLimit,
}: Props) {
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const categoryMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editingLimit) {
      setCategory(editingLimit.category)
      setAmount(String(editingLimit.monthlyLimit))
    } else {
      setCategory('')
      setAmount('')
    }
  }, [editingLimit, isOpen])

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

  useEffect(() => {
    if (!isCategoryMenuOpen) return
    const onClickAway = (e: MouseEvent | TouchEvent) => {
      if (categoryMenuRef.current && categoryMenuRef.current.contains(e.target as Node)) return
      setIsCategoryMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('touchstart', onClickAway)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('touchstart', onClickAway)
    }
  }, [isCategoryMenuOpen])

  if (!isOpen) return null

  const handleSave = async () => {
    const parsedAmount = Number(amount)
    if (!category || isNaN(parsedAmount) || parsedAmount <= 0) return

    setIsSaving(true)
    try {
      if (editingLimit) {
        await onUpdate(editingLimit.id, parsedAmount)
      } else {
        await onSave(category, parsedAmount)
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col gap-6 overflow-visible rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#0e2318]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingLimit ? 'Edit spending limit' : 'Add spending limit'}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Set a monthly cap for a transaction category.
            </p>
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
          <div className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
            Category
            {editingLimit ? (
              <input
                id="category"
                value={category ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase() : category}
                disabled
                className="rounded-xl border border-gray-200 px-3 py-2 text-gray-400 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
              />
            ) : (
              <div className="relative" ref={categoryMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen(prev => !prev)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
                >
                  <span className={category ? '' : 'text-gray-400 dark:text-slate-500'}>
                    {category ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase() : 'Select a category…'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">▼</span>
                </button>
                {isCategoryMenuOpen && (
                  <div className="absolute top-full right-0 left-0 z-[9999] mt-1 max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-white/10 dark:bg-[#0e2318] dark:ring-white/5">
                    {categories.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-gray-400 dark:text-slate-500">
                        No categories available
                      </p>
                    ) : (
                      categories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-white/10 ${
                            cat === category ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'
                          }`}
                          onClick={() => {
                            setCategory(cat)
                            setIsCategoryMenuOpen(false)
                          }}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                          {cat === category && <span className="text-emerald-600 dark:text-emerald-400">✓</span>}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <label
            className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"
            htmlFor="limit-amount"
          >
            Monthly limit (£)
            <input
              id="limit-amount"
              value={amount}
              onChange={e => setAmount(e.currentTarget.value)}
              type="number"
              min="0"
              step="0.01"
              className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
              placeholder="0.00"
            />
          </label>
        </div>

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
            disabled={isSaving}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60"
            onClick={handleSave}
          >
            {editingLimit ? 'Update' : 'Add limit'}
          </button>
        </div>
      </div>
    </div>
  )
}
