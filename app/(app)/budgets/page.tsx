'use client'

import { X, ChevronDown } from 'lucide-react'
import { useEffect, useState, useContext } from 'react'
import { BudgetsContext } from '@/context/BudgetsContext'
import { TransactionsContext } from '@/context/TransactionsContext'
import { Budget, BudgetKind } from '@/types/budgets'
import { filterByRollingWindow } from '@/lib/budgets/filterByRollingWindow'
import { createUuid } from '@/lib/budgets/createUuidBudget'
import { BudgetLineChart } from '@/components/budgets/BudgetLineChart'
import { buildBudgetBalanceSeries } from '@/lib/budgets/buildBudgetBalanceSeries'

export default function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [budgetKind, setBudgetKind] = useState<BudgetKind>('SPEND')

  const [name, setName] = useState<string>('')
  const [limit, setLimit] = useState<string>('')
  const [startingAmount, setStartingAmount] = useState<string>('')
  const [editingBudgetId, setEditingBudgetId] = useState<null | string>(null)
  const context = useContext(BudgetsContext)
  if (!context) throw new Error('BudgetsContext missing')
  const { budgets, setBudgets } = context

  const txContext = useContext(TransactionsContext)
  if (!txContext) throw new Error('TransactionsContext missing')
  const { transactions } = txContext

  const [expandedBudgetId, setExpandedBudgetId] = useState<string | null>(null)

  const toggleExpandBudget = (budgetId: string) => {
    setExpandedBudgetId(prev => (prev === budgetId ? null : budgetId))
  }

  const handleDelete = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id))
  }

  const handleAddFunds = (budgetId: string) => {
    const raw = prompt('Enter amount to add: ')
    if (!raw) return

    const amount = Number(raw)
    if (isNaN(amount) || amount <= 0) return

    setBudgets(prev =>
      prev.map(budget => {
        if (budget.id !== budgetId) return budget
        else {
          const newBalance = budget.balance + amount
          return {
            ...budget,
            balance: newBalance,
            events: [
              ...(budget.events ?? []),
              {
                id: createUuid(),
                date: new Date().toISOString(),
                delta: amount,
              },
            ],
          }
        }
      }),
    )
  }

  const handleWithdrawFunds = (budgetId: string) => {
    const raw = prompt('Enter amount to withdraw:')
    if (!raw) return

    const amount = Number(raw)
    if (isNaN(amount) || amount <= 0) return

    setBudgets(prev =>
      prev.map(budget => {
        if (budget.id !== budgetId) return budget

        const actual = Math.min(amount, budget.balance)
        const newBalance = budget.balance - actual

        return {
          ...budget,
          balance: newBalance,
          events: [
            ...(budget.events ?? []),
            {
              id: createUuid(),
              date: new Date().toISOString(),
              delta: -actual,
            },
          ],
        }
      }),
    )
  }

  const handleSave = () => {
    const validatedName = name.trim()
    const validatedLimit = Number(limit)

    if (validatedName === '') return
    //if we are edditing..
    if (editingBudgetId !== null) {
      setBudgets(prev =>
        prev.map(budget => {
          if (budget.id === editingBudgetId) {
            return {
              ...budget,
              name: validatedName,
              kind: budgetKind,
              target: budgetKind === 'SAVE' ? validatedLimit : undefined,
            }
          }
          return budget
        }),
      )
    } else {
      const isSave = budgetKind === 'SAVE'
      const validatedTarget = Number(limit)
      const hasStartingAmount = startingAmount.trim() !== ''
      const validatedStartingAmount = Number(startingAmount)

      if (isSave && (isNaN(validatedTarget) || validatedTarget <= 0)) return
      if (
        !isSave &&
        hasStartingAmount &&
        (isNaN(validatedStartingAmount) || validatedStartingAmount < 0)
      )
        return

      const initialBalance = !isSave
        ? hasStartingAmount
          ? validatedStartingAmount
          : 0
        : 0

      const newBudget: Budget = {
        id: createUuid(),
        name: validatedName,
        kind: budgetKind,
        createdAt: new Date().toISOString(),
        balance: initialBalance,
        target: isSave ? validatedTarget : undefined,
        events:
          initialBalance > 0
            ? [
                {
                  id: createUuid(),
                  date: new Date().toISOString(),
                  delta: initialBalance,
                  note: 'Initial allocation',
                },
              ]
            : [],
      }
      setBudgets(prev => [...prev, newBudget])
    }
    closeModal()
  }

  const closeModal = () => {
    setLimit('')
    setStartingAmount('')
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
            setStartingAmount('')
            setIsModalOpen(true)
            setBudgetKind('SPEND')
          }}
        >
          Add budget
        </button>
      </div>

      <div className="grid items-start grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map(budget => {
          const chartData = buildBudgetBalanceSeries(budget.events ?? [], 30)

          const formatMoney = (value: number) => `$${value.toFixed(2)}`

          const isSave = budget.kind === 'SAVE'
          const current = budget.balance
          const target = budget.target ?? 0

          const progress =
            isSave && target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0

          const fillWidth = isSave ? `${progress}%` : '100%'

          const fillClass = isSave
            ? 'bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600'
            : 'bg-gradient-to-r from-sky-300 via-sky-400 to-sky-600'

          const statusLabel = isSave
            ? target > 0
              ? `${progress}% to goal`
              : 'No goal set'
            : `Available: ${formatMoney(current)}`

          const rightLabel = isSave
            ? `${formatMoney(current)} / ${target > 0 ? formatMoney(target) : '—'}`
            : formatMoney(current)

          return (
            <div
              key={budget.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">{budget.name}</h2>
                <span className="text-sm font-medium text-gray-500">
                  {rightLabel}{' '}
                  <button type="button" onClick={() => toggleExpandBudget(budget.id)}>
                    {expandedBudgetId === budget.id ? <X /> : <ChevronDown />}
                  </button>
                </span>
              </div>

              {expandedBudgetId === budget.id ? (
                chartData.length === 0 ? (
                  <div className="mt-2 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                    No activity yet — add or withdraw funds to see the trend.
                  </div>
                ) : (
                  <div className="mt-2 rounded-xl bg-gray-50 p-4">
                    <BudgetLineChart data={chartData} />
                  </div>
                )
              ) : (
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${fillClass}`}
                    style={{ width: fillWidth }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{statusLabel}</span>

                <div className="flex items-center gap-2">
                  {/* Add funds */}
                  <button
                    type="button"
                    className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-600 transition hover:bg-emerald-50"
                    onClick={() => {
                      handleAddFunds(budget.id)
                    }}
                  >
                    Add
                  </button>

                  {/* Withdraw funds */}
                  <button
                    type="button"
                    className="rounded-lg border border-amber-200 px-3 py-1 text-xs font-medium text-amber-600 transition hover:bg-amber-50"
                    onClick={() => handleWithdrawFunds(budget.id)}
                  >
                    Withdraw
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                    onClick={() => {
                      setEditingBudgetId(budget.id)
                      setName(budget.name)
                      setLimit(String(budget.target ?? ''))
                      setBudgetKind(budget.kind)
                      setIsModalOpen(true)
                    }}
                  >
                    Edit
                  </button>

                  {/* Delete */}
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
      {/* Modal Card */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add budget</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create a new budget with a limit.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                onClick={closeModal}
              >
                <X className="size-4" />
              </button>
            </div>
            {/* Modal section */}
            <div className="flex flex-col gap-4">
              <label
                className="flex flex-col gap-2 text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Budget name
                <input
                  id="name"
                  value={name}
                  onChange={e => {
                    setName(e.currentTarget.value)
                  }}
                  type="text"
                  className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
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
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
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
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Save
                </button>
              </div>

              {budgetKind === 'SAVE' && (
                <label
                  className="flex flex-col gap-2 text-sm font-medium text-gray-700"
                  htmlFor="limit"
                >
                  Goal amount
                  <input
                    id="limit"
                    value={limit}
                    onChange={e => setLimit(e.currentTarget.value)}
                    type="number"
                    min="0"
                    className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="0.00"
                  />
                </label>
              )}

              {budgetKind === 'SPEND' && editingBudgetId === null && (
                <label
                  className="flex flex-col gap-2 text-sm font-medium text-gray-700"
                  htmlFor="startingAmount"
                >
                  Starting amount
                  <input
                    id="startingAmount"
                    value={startingAmount}
                    onChange={e => setStartingAmount(e.currentTarget.value)}
                    type="number"
                    min="0"
                    className="rounded-xl border border-gray-200 px-3 py-2 text-gray-800 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="0.00"
                  />
                </label>
              )}
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
