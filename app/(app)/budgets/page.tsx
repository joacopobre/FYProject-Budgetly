'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [budgets, setBudgets] = useState([
    { id: 1, name: 'Groceries', spent: 320, limit: 500 },
    { id: 2, name: 'Rent', spent: 1200, limit: 1200 },
    { id: 3, name: 'Transport', spent: 90, limit: 150 },
    { id: 4, name: 'Entertainment', spent: 140, limit: 250 },
  ])
  const [name, setName] = useState<string>('')
  const [limit, setLimit] = useState<string>('')
  const [editingBudgetId, setEditingBudgetId] = useState<null | number>(null)

  const handleDelete = (id: number) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id))
  }

  const handleSave = () => {
    const validatedName = name.trim()
    const validatedLimit = Number(limit)

    if (validatedLimit <= 0 || validatedName === '' || isNaN(validatedLimit)) return
    //if we are edditing..
    if (editingBudgetId !== null) {
      setBudgets(prev =>
        prev.map(budget => {
          if (budget.id === editingBudgetId) {
            return {
              ...budget,
              name: validatedName,
              limit: validatedLimit,
            }
          }
          return budget
        }),
      )
    } else {
      const newBudget = {
        id: Date.now(),
        name: validatedName,
        spent: 0,
        limit: validatedLimit,
      }
      setBudgets(prev => [...prev, newBudget])
    }
    closeModal()
  }

  const closeModal = () => {
    setLimit('')
    setName('')
    setIsModalOpen(false)
    setEditingBudgetId(null)
  }

  useEffect(() => {
    if (!isModalOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isModalOpen])

  useEffect(() => {
    if (!isModalOpen) return

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prev
    }
  }, [isModalOpen])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 lg:px-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-4xl font-semibold text-gray-800 md:text-5xl">Budgets</h1>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          onClick={() => {
            setEditingBudgetId(null)
            setName('')
            setLimit('')
            setIsModalOpen(true)
          }}
        >
          Add budget
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map(budget => {
          const safeLimit = budget.limit > 0 ? budget.limit : 0
          const safeSpent = budget.spent < 0 ? 0 : budget.spent
          const overBudget = safeLimit > 0 && safeSpent > safeLimit
          const progress =
            safeLimit > 0 ? Math.min(100, Math.round((safeSpent / safeLimit) * 100)) : 0
          const fillWidth = overBudget ? '100%' : `${progress}%`
          const fillClass = overBudget
            ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-rose-500'
            : 'bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600'
          const statusLabel = overBudget
            ? `Over by $${safeSpent - safeLimit}`
            : `${progress}% used`
          const formatMoney = (value: number) => `$${value.toFixed(2)}`
          const limitLabel = safeLimit > 0 ? formatMoney(safeLimit) : '—'
          const spentLabel = formatMoney(safeSpent)
          return (
            <div
              key={budget.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">{budget.name}</h2>
                <span className="text-sm font-medium text-gray-500">
                  {spentLabel} / {limitLabel}
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${fillClass}`}
                  style={{ width: fillWidth }}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className={overBudget ? 'font-semibold text-amber-700' : ''}>
                  {statusLabel}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                    onClick={() => {
                      setEditingBudgetId(budget.id)
                      setName(budget.name)
                      setLimit(String(budget.limit))
                      setIsModalOpen(true)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                    onClick={() => handleDelete(budget.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add budget</h2>
                <p className="mt-1 text-sm text-gray-500">Create a new budget with a limit.</p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                onClick={closeModal}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700" htmlFor="name">
                Budget name
                <input
                  id="name"
                  value={name}
                  onChange={e => {
                    setName(e.currentTarget.value)
                  }}
                  type="text"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  placeholder="e.g. Groceries"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700" htmlFor="limit">
                Limit
                <input
                  id="limit"
                  value={limit}
                  onChange={e => {
                    setLimit(e.currentTarget.value)
                  }}
                  type="number"
                  min="0"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  placeholder="0.00"
                />
              </label>
            </div>

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
