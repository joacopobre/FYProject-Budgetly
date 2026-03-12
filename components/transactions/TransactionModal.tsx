'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import type { RecurrenceFrequency, TxSource, TxType } from '@/types/transactions'
import { BudgetsContext } from '@/context/BudgetsContext'
import { DatePicker } from '@/components/ui/DatePicker'

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
  categories: string[]
  type: TxType
  setType: (v: TxType) => void
  amount: string
  setAmount: (v: string) => void
  source: TxSource
  setSource: (v: TxSource) => void
  budgetId: string | null
  setBudgetId: (v: string | null) => void
  recurrence: RecurrenceFrequency
  setRecurrence: (v: RecurrenceFrequency) => void
}

const typeOptions: TxType[] = ['Expense', 'Income']

const recurrenceOptions: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
]

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
  categories,
  type,
  setType,
  amount,
  setAmount,
  source,
  setSource,
  budgetId,
  setBudgetId,
  recurrence,
  setRecurrence,
}: Props) {
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false)
  const typeMenuRef = useRef<HTMLDivElement>(null)

  const [isFromMenuOpen, setIsFromMenuOpen] = useState(false)
  const fromMenuRef = useRef<HTMLDivElement>(null)

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')
  const categoryMenuRef = useRef<HTMLDivElement>(null)
  const categoryInputRef = useRef<HTMLInputElement>(null)

  const [isRecurrenceMenuOpen, setIsRecurrenceMenuOpen] = useState(false)
  const recurrenceMenuRef = useRef<HTMLDivElement>(null)

  // get budgets via context
  const context = useContext(BudgetsContext)
  if (!context) throw new Error('BudgetsContext missing')
  const { budgets } = context

  const spendBudgets = budgets.filter(b => b.kind === 'SPEND')

  const isRecurring = recurrence !== 'NONE'

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
    if (!isTypeMenuOpen && !isFromMenuOpen && !isCategoryMenuOpen && !isRecurrenceMenuOpen) return
    const onClickAway = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (typeMenuRef.current && typeMenuRef.current.contains(target)) return
      if (fromMenuRef.current && fromMenuRef.current.contains(target)) return
      if (categoryMenuRef.current && categoryMenuRef.current.contains(target)) return
      if (recurrenceMenuRef.current && recurrenceMenuRef.current.contains(target)) return
      setIsTypeMenuOpen(false)
      setIsFromMenuOpen(false)
      setIsCategoryMenuOpen(false)
      setIsRecurrenceMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('touchstart', onClickAway)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('touchstart', onClickAway)
    }
  }, [isTypeMenuOpen, isFromMenuOpen, isCategoryMenuOpen, isRecurrenceMenuOpen])

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
              {editingId ? 'Edit transaction' : 'Add transaction'}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter details for this transaction.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-300"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
            <DatePicker value={date} onChange={setDate} />
          </div>
          <div
            className="relative flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            ref={typeMenuRef}
          >
            <span>Type</span>
            <button
              type="button"
              onClick={() => setIsTypeMenuOpen(prev => !prev)}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
            >
              {type}
              <span className="text-xs text-gray-500 dark:text-gray-400">▼</span>
            </button>

            {isTypeMenuOpen && (
              <div className="absolute top-full right-0 left-0 z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 dark:border-white/10 dark:bg-[#0e2318] dark:ring-white/5">
                {typeOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-white/10 ${
                      option === type ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => {
                      setType(option)
                      setIsTypeMenuOpen(false)
                      if (option === 'Income') {
                        setSource('ACCOUNT')
                        setBudgetId(null)
                      }
                    }}
                  >
                    {option}
                    {option === type && <span className="text-emerald-600 dark:text-emerald-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label
            className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="description"
          >
            Description
            <input
              id="description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
              placeholder="e.g. Coffee"
            />
          </label>
          <div
            className="relative flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            ref={categoryMenuRef}
          >
            <span>Category</span>
            <button
              type="button"
              onClick={() => {
                setIsCategoryMenuOpen(prev => !prev)
                setCategorySearch('')
                setTimeout(() => categoryInputRef.current?.focus(), 0)
              }}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-left text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
            >
              <span className={category ? '' : 'text-gray-400 dark:text-gray-500'}>
                {category || 'e.g. Food'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">▼</span>
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute top-full right-0 left-0 z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 dark:border-white/10 dark:bg-[#0e2318] dark:ring-white/5">
                <div className="border-b border-gray-100 p-2 dark:border-white/10">
                  <input
                    ref={categoryInputRef}
                    type="text"
                    value={categorySearch}
                    onChange={e => setCategorySearch(e.target.value)}
                    placeholder="Search or create..."
                    className="w-full rounded-lg px-2 py-1 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:bg-white/8 dark:text-slate-200 dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {categories
                    .filter(c => c.toLowerCase().includes(categorySearch.toLowerCase()))
                    .map(c => (
                      <button
                        key={c}
                        type="button"
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-white/10 ${
                          c === category
                            ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => {
                          setCategory(c)
                          setIsCategoryMenuOpen(false)
                          setCategorySearch('')
                        }}
                      >
                        {c}
                        {c === category && (
                          <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                        )}
                      </button>
                    ))}
                  {categorySearch.trim() &&
                    !categories.some(
                      c => c.toLowerCase() === categorySearch.trim().toLowerCase(),
                    ) && (
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-emerald-600 transition hover:bg-gray-100 dark:text-emerald-400 dark:hover:bg-white/10"
                        onClick={() => {
                          setCategory(categorySearch.trim())
                          setIsCategoryMenuOpen(false)
                          setCategorySearch('')
                        }}
                      >
                        <span className="font-semibold">+</span> Create new category:{' '}
                        <span className="font-medium">"{categorySearch.trim()}"</span>
                      </button>
                    )}
                  {categories.length === 0 && !categorySearch.trim() && (
                    <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
                      Start typing to create a category
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <label
          className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          htmlFor="amount"
        >
          Amount
          <input
            id="amount"
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
            placeholder="0.00"
          />
        </label>

        {type !== 'Income' && (
        <div
          className="relative flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          ref={fromMenuRef}
        >
          <span>From</span>
          <button
            type="button"
            onClick={() => {
              setIsFromMenuOpen(prev => !prev)
            }}
            className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
          >
            {source === 'ACCOUNT'
              ? 'Account'
              : spendBudgets.find(b => b.id === budgetId)?.name ?? 'Budget'}
            <span className="text-xs text-gray-500 dark:text-gray-400">▼</span>
          </button>

          {isFromMenuOpen && (
            <div className="absolute top-full right-0 left-0 z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 dark:border-white/10 dark:bg-[#0e2318] dark:ring-white/5">
              <button
                type="button"
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-white/10 ${
                  source === 'ACCOUNT' ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => {
                  setSource('ACCOUNT')
                  setBudgetId(null)
                  setIsFromMenuOpen(false)
                }}
              >
                Account
                {source === 'ACCOUNT' && <span className="text-emerald-600 dark:text-emerald-400">✓</span>}
              </button>
              {spendBudgets.map(budget => (
                <button
                  key={budget.id}
                  type="button"
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-white/10 ${
                    source === 'BUDGET' && budgetId === budget.id
                      ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => {
                    setSource('BUDGET')
                    setBudgetId(budget.id)
                    setIsFromMenuOpen(false)
                  }}
                >
                  {budget.name}
                  {source === 'BUDGET' && budgetId === budget.id && (
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Recurrence section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurring</span>
            <button
              type="button"
              role="switch"
              aria-checked={isRecurring}
              onClick={() => setRecurrence(isRecurring ? 'NONE' : 'MONTHLY')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isRecurring ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  isRecurring ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isRecurring && (
            <div
              className="relative flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              ref={recurrenceMenuRef}
            >
              <span>Frequency</span>
              <button
                type="button"
                onClick={() => setIsRecurrenceMenuOpen(prev => !prev)}
                className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
              >
                {recurrenceOptions.find(o => o.value === recurrence)?.label ?? 'Monthly'}
                <span className="text-xs text-gray-500 dark:text-gray-400">▼</span>
              </button>

              {isRecurrenceMenuOpen && (
                <div className="absolute top-full right-0 left-0 z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 dark:border-white/10 dark:bg-[#0e2318] dark:ring-white/5">
                  {recurrenceOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-white/10 ${
                        option.value === recurrence
                          ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => {
                        setRecurrence(option.value)
                        setIsRecurrenceMenuOpen(false)
                      }}
                    >
                      {option.label}
                      {option.value === recurrence && (
                        <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-2">
          <button
            type="button"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
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
