'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { transactionsData } from '@/staticData/transactions'
import type { TxType, MonthFilter, TypeFilter } from '@/types/transactions'
const formatMoney = (value: number) =>
  `${value < 0 ? '-' : ''}$${Math.abs(value).toFixed(2)}`

const monthOptions = ['All time', 'This month', 'Last month', 'This year'] as const
const typeOptions = ['All types', 'Income', 'Expense'] as const

export default function Transactions() {
  const [transactions, setTransactions] = useState(transactionsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<TxType>('Expense')
  const [amount, setAmount] = useState('')
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false)
  const typeMenuRef = useRef<HTMLDivElement>(null)
  const [filterMonth, setFilterMonth] = useState<MonthFilter>('All time')
  const [filterType, setFilterType] = useState<TypeFilter>('All types')
  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false)
  const [isFilterTypeMenuOpen, setIsFilterTypeMenuOpen] = useState(false)
  const monthMenuRef = useRef<HTMLDivElement>(null)
  const filterTypeMenuRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const filteredTransactions = transactions
    .filter(tx => {
      if (searchTerm === '') return true
      const normalized = searchTerm.toLowerCase()
      return (
        tx.description.toLowerCase().includes(normalized) ||
        tx.category.toLowerCase().includes(normalized)
      )
    })
    .filter(tx => {
      if (filterType === 'All types') return true
      return tx.type === filterType
    })
    .filter(tx => {
      if (filterMonth === 'All time') return true
      //Date now and date from transaction
      const now = new Date()
      const txDate = new Date(tx.date)
      // Month and year now
      const nowMonth = now.getMonth()
      const nowYear = now.getFullYear()
      // Month and year from transaction
      const txMonth = txDate.getMonth()
      const txYear = txDate.getFullYear()

      const nowLastMonth = nowMonth === 0 ? 11 : nowMonth - 1
      const lastMonthYear = nowMonth === 0 ? nowYear - 1 : nowYear
      if (filterMonth === 'This month') return txMonth === nowMonth && txYear === nowYear
      if (filterMonth === 'Last month')
        return txMonth === nowLastMonth && txYear === lastMonthYear
      if (filterMonth === 'This year') return txYear === nowYear
      return true
    })

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setDate('')
    setDescription('')
    setCategory('')
    setType('Expense')
    setAmount('')
    setEditingId(null)
    setIsTypeMenuOpen(false)
  }, [])

  const openModal = (tx?: (typeof transactionsData)[number]) => {
    if (tx) {
      setEditingId(tx.id)
      setDate(tx.date)
      setDescription(tx.description)
      setCategory(tx.category)
      setType(tx.type as 'Income' | 'Expense')
      setAmount(String(Math.abs(tx.amount)))
    } else {
      setEditingId(null)
      setDate('')
      setDescription('')
      setCategory('')
      setType('Expense')
      setAmount('')
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    const validatedDate = date.trim()
    const validatedDescription = description.trim()
    const validatedCategory = category.trim()
    const numericAmount = Number(amount)

    if (
      !validatedDate ||
      !validatedDescription ||
      !validatedCategory ||
      isNaN(numericAmount) ||
      numericAmount <= 0
    )
      return

    const signedAmount =
      type === 'Income' ? Math.abs(numericAmount) : -Math.abs(numericAmount)

    if (editingId !== null) {
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === editingId
            ? {
                ...tx,
                date: validatedDate,
                description: validatedDescription,
                category: validatedCategory,
                type,
                amount: signedAmount,
              }
            : tx,
        ),
      )
    } else {
      setTransactions(prev => [
        ...prev,
        {
          id: Date.now(),
          date: validatedDate,
          description: validatedDescription,
          category: validatedCategory,
          type,
          amount: signedAmount,
        },
      ])
    }
    closeModal()
  }

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }

  useEffect(() => {
    if (!isModalOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prev
    }
  }, [isModalOpen, closeModal])

  useEffect(() => {
    if (!isTypeMenuOpen && !isMonthMenuOpen && !isFilterTypeMenuOpen) return
    const onClickAway = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (typeMenuRef.current && typeMenuRef.current.contains(target)) return
      if (monthMenuRef.current && monthMenuRef.current.contains(target)) return
      if (filterTypeMenuRef.current && filterTypeMenuRef.current.contains(target)) return
      setIsTypeMenuOpen(false)
      setIsMonthMenuOpen(false)
      setIsFilterTypeMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('touchstart', onClickAway)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('touchstart', onClickAway)
    }
  }, [isTypeMenuOpen, isMonthMenuOpen, isFilterTypeMenuOpen])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-8 px-5 py-10 md:px-8 lg:px-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-4xl font-semibold text-gray-800 md:text-5xl">Transactions</h1>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          onClick={() => openModal()}
        >
          Add transaction
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.currentTarget.value)
            }}
            placeholder="Search transactions..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <div className="relative w-full md:w-44" ref={monthMenuRef}>
            <button
              type="button"
              onClick={() => setIsMonthMenuOpen(prev => !prev)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {filterMonth}
              <span className="text-xs text-gray-500">▼</span>
            </button>
            {isMonthMenuOpen && (
              <div className="absolute top-full right-0 left-0 z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5">
                {monthOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${
                      option === filterMonth
                        ? 'font-semibold text-emerald-600'
                        : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setFilterMonth(option)
                      setIsMonthMenuOpen(false)
                    }}
                  >
                    {option}
                    {option === filterMonth && (
                      <span className="text-emerald-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative w-full md:w-32" ref={filterTypeMenuRef}>
            <button
              type="button"
              onClick={() => setIsFilterTypeMenuOpen(prev => !prev)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {filterType}
              <span className="text-xs text-gray-500">▼</span>
            </button>
            {isFilterTypeMenuOpen && (
              <div className="absolute top-full right-0 left-0 z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5">
                {typeOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${
                      option === filterType
                        ? 'font-semibold text-emerald-600'
                        : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setFilterType(option)
                      setIsFilterTypeMenuOpen(false)
                    }}
                  >
                    {option}
                    {option === filterType && <span className="text-emerald-600">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table for md+ */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(tx => {
              const isIncome = tx.amount > 0
              const amountColor = isIncome ? 'text-emerald-600' : 'text-rose-600'
              return (
                <tr key={tx.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{tx.date}</td>
                  <td className="px-4 py-3">{tx.description}</td>
                  <td className="px-4 py-3">{tx.category}</td>
                  <td className="px-4 py-3">{tx.type}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${amountColor}`}>
                    {formatMoney(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                        onClick={() => openModal(tx)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                        onClick={() => {
                          handleDeleteTransaction(tx.id)
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="space-y-3 md:hidden">
        {filteredTransactions.map(tx => {
          const isIncome = tx.amount > 0
          const amountColor = isIncome ? 'text-emerald-600' : 'text-rose-600'
          return (
            <div
              key={tx.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{tx.date}</span>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  {tx.type}
                </span>
              </div>
              <div className="text-base font-semibold text-gray-800">
                {tx.description}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{tx.category}</span>
                <span className={`font-semibold ${amountColor}`}>
                  {formatMoney(tx.amount)}
                </span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                  onClick={() => openModal(tx)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                  onClick={() => {
                    handleDeleteTransaction(tx.id)
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId !== null ? 'Edit transaction' : 'Add transaction'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter details for this transaction.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                className="flex flex-col gap-2 text-sm font-medium text-gray-700"
                htmlFor="date"
              >
                Date
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
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
                  className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                  {type}
                  <span className="text-xs text-gray-500">▼</span>
                </button>
                {isTypeMenuOpen && (
                  <div className="absolute top-full right-0 left-0 z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5">
                    {['Expense', 'Income'].map(option => (
                      <button
                        key={option}
                        type="button"
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${
                          option === type
                            ? 'font-semibold text-emerald-600'
                            : 'text-gray-700'
                        }`}
                        onClick={() => {
                          setType(option as 'Income' | 'Expense')
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
              <label
                className="flex flex-col gap-2 text-sm font-medium text-gray-700"
                htmlFor="description"
              >
                Description
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  placeholder="e.g. Coffee"
                />
              </label>
              <label
                className="flex flex-col gap-2 text-sm font-medium text-gray-700"
                htmlFor="category"
              >
                Category
                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  placeholder="e.g. Food"
                />
              </label>
            </div>

            <label
              className="flex flex-col gap-2 text-sm font-medium text-gray-700"
              htmlFor="amount"
            >
              Amount
              <input
                id="amount"
                type="number"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="0.00"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-2">
              <button
                type="button"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
