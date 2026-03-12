'use client'

import { ChevronDown, X } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { BudgetsContext } from '@/context/BudgetsContext'
import type { Budget, BudgetKind } from '@/types/budgets'
import { BudgetLineChart } from '@/components/budgets/BudgetLineChart'
import { BudgetModal } from '@/components/budgets/BudgetModal'
import { FundModal } from '@/components/budgets/FundModal'
import { buildBudgetBalanceSeries } from '@/lib/budgets/buildBudgetBalanceSeries'
import { Transaction } from '@/types/transactions'
import { TransactionsContext } from '@/context/TransactionsContext'

type Props = {
  initialBudgets: Budget[]
}

export default function BudgetsClient({ initialBudgets }: Props) {
  console.log('initialBudgets', initialBudgets)

  const [isFundModalOpen, setIsFundModalOpen] = useState(false)
  const [fundMode, setFundMode] = useState<'ADD' | 'WITHDRAW' | null>(null)
  const [activeBudgetId, setActiveBudgetId] = useState<string | null>(null)
  const [fundAmount, setFundAmount] = useState('')
  const [fundNote, setFundNote] = useState('')
  const [isFundNoteOpen, setIsFundNoteOpen] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [budgetKind, setBudgetKind] = useState<BudgetKind>('SPEND')

  const [name, setName] = useState<string>('')
  const [limit, setLimit] = useState<string>('')
  const [startingAmount, setStartingAmount] = useState<string>('')
  const [rollover, setRollover] = useState<boolean>(false)
  const [editingBudgetId, setEditingBudgetId] = useState<null | string>(null)
  const context = useContext(BudgetsContext)
  if (!context) throw new Error('BudgetsContext missing')
  const { budgets, setBudgets } = context

  useEffect(() => {
    setBudgets(initialBudgets)
  }, [initialBudgets, setBudgets])

  const txContext = useContext(TransactionsContext)
  if (!txContext) throw new Error('TransactionsContext missing')
  const { setTransactions } = txContext

  const [expandedBudgetId, setExpandedBudgetId] = useState<string | null>(null)

  const toggleExpandBudget = (budgetId: string) => {
    setExpandedBudgetId(prev => (prev === budgetId ? null : budgetId))
  }

  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeleteError(null)
    const res = await fetch(`/api/budgets/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const data = await res.json()
      setDeleteError(data.error ?? 'Failed to delete budget.')
      return
    }

    setBudgets(prev => prev.filter(budget => budget.id !== id))
  }

  const handleConfirmFunds = async (
    id: string | null,
    fund: string | null,
    mode: 'ADD' | 'WITHDRAW' | null,
  ) => {
    if (!id || !mode) return

    const amount = Number(fund)
    if (!Number.isFinite(amount) || amount <= 0) return

    const res = await fetch(`/api/budgets/${id}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode,
        amount,
        note: fundNote.trim() || undefined,
      }),
    })

    if (!res.ok) return

    const data = await res.json()

    const updatedBudget: Budget = data.budget
    const createdTransactions: Transaction[] = data.transactions

    setBudgets(prev => prev.map(b => (b.id === updatedBudget.id ? updatedBudget : b)))
    setTransactions(prev => [...createdTransactions, ...prev])
    closeFundModal()
  }
  const closeFundModal = () => {
    setActiveBudgetId(null)
    setFundMode(null)
    setFundAmount('')
    setFundNote('')
    setIsFundModalOpen(false)
    setIsFundNoteOpen(false)
  }

  const handleSave = async () => {
    const validatedName = name.trim()
    const validatedLimit = Number(limit)

    if (validatedName === '') return
    //if we are editing..
    if (editingBudgetId !== null) {
      const isSave = budgetKind === 'SAVE'
      const target = isSave ? validatedLimit : undefined

      // optional: validate SAVE target before hitting the API
      if (isSave && (isNaN(validatedLimit) || validatedLimit <= 0)) return

      const res = await fetch(`/api/budgets/${editingBudgetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: validatedName,
          kind: budgetKind,
          target,
          rollover: budgetKind === 'SPEND' ? rollover : undefined,
        }),
      })

      if (!res.ok) return

      const updatedBudget: Budget = await res.json()

      setBudgets(prev => prev.map(b => (b.id === updatedBudget.id ? updatedBudget : b)))

      closeModal()
      return
    } else {
      const isSave = budgetKind === 'SAVE'
      const validatedTarget = Number(limit)
      const hasStartingAmount = startingAmount.trim() !== ''
      const validatedStartingAmount = Number(startingAmount)

      if (isSave && (isNaN(validatedTarget) || validatedTarget <= 0)) return
      if (
        hasStartingAmount &&
        (isNaN(validatedStartingAmount) || validatedStartingAmount < 0)
      )
        return

      const initialBalance = hasStartingAmount ? validatedStartingAmount : 0

      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: validatedName,
          kind: budgetKind,
          target: isSave ? validatedTarget : undefined,
          startingAmount: hasStartingAmount ? validatedStartingAmount : undefined,
          rollover: budgetKind === 'SPEND' ? rollover : undefined,
        }),
      })

      if (!res.ok) return

      const createdBudget: Budget = await res.json()

      setBudgets(prev => [...prev, createdBudget])
    }

    closeModal()
  }

  const closeModal = () => {
    setLimit('')
    setStartingAmount('')
    setName('')
    setRollover(false)
    setIsModalOpen(false)
    setEditingBudgetId(null)
  }

  const activeBudget = activeBudgetId ? (budgets.find(b => b.id === activeBudgetId) ?? null) : null

  const formatMoney = (value: number) => `$${value.toFixed(2)}`

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 lg:px-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">Budgets</h1>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_4px_18px_rgba(16,185,129,0.5)]"
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

      {deleteError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
          {deleteError}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map(budget => {
          const chartData = buildBudgetBalanceSeries(budget.events ?? [], 30)

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
              className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-white/6 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:backdrop-blur-md"
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${isSave ? 'bg-emerald-500' : 'bg-gradient-to-r from-teal-400 to-cyan-500'}`} />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{budget.name}</h2>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {rightLabel}{' '}
                  <button type="button" onClick={() => toggleExpandBudget(budget.id)}>
                    {expandedBudgetId === budget.id ? <X /> : <ChevronDown />}
                  </button>
                </span>
              </div>

              {expandedBudgetId === budget.id ? (
                chartData.length === 0 ? (
                  <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
                    No activity yet — add or withdraw funds to see the trend.
                  </div>
                ) : (
                  <div className="mt-2 rounded-xl bg-slate-50 p-4 dark:bg-white/5">
                    <BudgetLineChart data={chartData} />
                  </div>
                )
              ) : (
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${fillClass}`}
                    style={{ width: fillWidth }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>{statusLabel}</span>

                <div className="flex items-center gap-2">
                  {/* Add funds */}
                  <button
                    type="button"
                    className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                    onClick={() => {
                      setFundMode('ADD')
                      setActiveBudgetId(budget.id)
                      setFundAmount('')
                      setFundNote('')
                      setIsFundModalOpen(true)
                      setIsFundNoteOpen(false)
                    }}
                  >
                    Add
                  </button>

                  {/* Withdraw funds */}
                  <button
                    type="button"
                    className="rounded-lg border border-amber-200 px-3 py-1 text-xs font-medium text-amber-600 transition hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/10"
                    onClick={() => {
                      setFundMode('WITHDRAW')
                      setActiveBudgetId(budget.id)
                      setFundAmount('')
                      setFundNote('')
                      setIsFundModalOpen(true)
                      setIsFundNoteOpen(false)
                    }}
                  >
                    Withdraw
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                    onClick={() => {
                      setEditingBudgetId(budget.id)
                      setName(budget.name)
                      setLimit(String(budget.target ?? ''))
                      setBudgetKind(budget.kind)
                      setRollover(budget.rollover)
                      setIsModalOpen(true)
                    }}
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
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
      <BudgetModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingBudgetId={editingBudgetId}
        name={name}
        setName={setName}
        limit={limit}
        setLimit={setLimit}
        startingAmount={startingAmount}
        setStartingAmount={setStartingAmount}
        budgetKind={budgetKind}
        setBudgetKind={setBudgetKind}
        rollover={rollover}
        setRollover={setRollover}
      />
      <FundModal
        isOpen={isFundModalOpen}
        onClose={closeFundModal}
        onConfirm={() => handleConfirmFunds(activeBudgetId, fundAmount, fundMode)}
        fundMode={fundMode}
        activeBudget={activeBudget}
        fundAmount={fundAmount}
        setFundAmount={setFundAmount}
        fundNote={fundNote}
        setFundNote={setFundNote}
        isFundNoteOpen={isFundNoteOpen}
        setIsFundNoteOpen={setIsFundNoteOpen}
      />
    </main>
  )
}
