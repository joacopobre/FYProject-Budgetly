'use client'

import { MoreHorizontal, X } from 'lucide-react'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { BudgetsContext } from '@/context/BudgetsContext'
import type { Budget, BudgetKind } from '@/types/budgets'
import { BudgetLineChart } from '@/components/budgets/BudgetLineChart'
import { BudgetModal } from '@/components/budgets/BudgetModal'
import { FundModal } from '@/components/budgets/FundModal'
import { SpendingLimits } from '@/components/budgets/SpendingLimits'
import { buildBudgetBalanceSeries } from '@/lib/budgets/buildBudgetBalanceSeries'
import { Transaction } from '@/types/transactions'
import { TransactionsContext } from '@/context/TransactionsContext'
import type { CategoryLimit } from '@/types/categoryLimits'

type Props = {
  initialBudgets: Budget[]
  initialLimits: CategoryLimit[]
}

const formatAmount = (value: number): string => {
  if (value === 0) return '£0'
  const abs = Math.abs(value)
  const hasDecimals = Math.round(abs * 100) % 100 !== 0
  const fixed = abs.toFixed(hasDecimals ? 2 : 0)
  const withCommas = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${value < 0 ? '-' : ''}£${withCommas}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric'
  return d.toLocaleDateString('en-GB', opts)
}

export default function BudgetsClient({ initialBudgets, initialLimits }: Props) {
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

  // Three-dot menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuContainerRef = useRef<HTMLDivElement>(null)

  // Expanded chart state
  const [expandedBudgetId, setExpandedBudgetId] = useState<string | null>(null)

  const context = useContext(BudgetsContext)
  if (!context) throw new Error('BudgetsContext missing')
  const { budgets, setBudgets } = context

  useEffect(() => {
    setBudgets(initialBudgets)
  }, [initialBudgets, setBudgets])

  const txContext = useContext(TransactionsContext)
  if (!txContext) throw new Error('TransactionsContext missing')
  const { transactions, setTransactions } = txContext

  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Close three-dot menu on outside click
  useEffect(() => {
    if (!openMenuId) return
    const handler = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openMenuId])

  const handleDelete = async (id: string) => {
    setDeleteError(null)
    const res = await fetch(`/api/budgets/${id}`, { method: 'DELETE' })
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
      body: JSON.stringify({ mode, amount, note: fundNote.trim() || undefined }),
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

    if (editingBudgetId !== null) {
      const isSave = budgetKind === 'SAVE'
      const target = isSave ? validatedLimit : undefined
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
    }

    const isSave = budgetKind === 'SAVE'
    const validatedTarget = Number(limit)
    const hasStartingAmount = startingAmount.trim() !== ''
    const validatedStartingAmount = Number(startingAmount)
    if (isSave && (isNaN(validatedTarget) || validatedTarget <= 0)) return
    if (hasStartingAmount && (isNaN(validatedStartingAmount) || validatedStartingAmount < 0)) return

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

  // Insights calculations
  const availableLiquidity = useMemo(
    () => budgets.filter(b => b.kind === 'SPEND').reduce((sum, b) => sum + b.balance, 0),
    [budgets],
  )

  const avgDailyBurn = useMemo(() => {
    const now = new Date()
    const dayOfMonth = now.getDate()
    const monthExpenses = transactions
      .filter(tx => {
        if (tx.type !== 'Expense') return false
        const d = new Date(tx.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
    return dayOfMonth > 0 ? monthExpenses / dayOfMonth : 0
  }, [transactions])

  // Recent adjustments — last 10 events across all budgets
  const recentAdjustments = useMemo(
    () =>
      budgets
        .flatMap(b =>
          (b.events ?? []).map(e => ({
            budgetName: b.name,
            action: e.delta > 0 ? 'Add' : 'Withdraw',
            amount: Math.abs(e.delta),
            date: e.date,
          })),
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10),
    [budgets],
  )

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 lg:px-12">
      {/* Click-outside overlay for three-dot menus */}
      {openMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">Budgets</h1>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_4px_18px_rgba(16,185,129,0.5)]"
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

      {/* Two-column layout: main + sidebar */}
      <div className="grid gap-6 xl:grid-cols-[1fr_288px]" ref={menuContainerRef}>
        {/* Main area */}
        <div className="flex flex-col gap-8">
          {/* Budget cards grid */}
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
            {budgets.map(budget => {
              const chartData = buildBudgetBalanceSeries(budget.events ?? [], 30)
              const isSave = budget.kind === 'SAVE'
              const current = budget.balance
              const target = budget.target ?? 0
              const saveProgress =
                isSave && target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
              const spendProgress =
                !isSave && target > 0
                  ? Math.min(100, Math.round(((target - current) / target) * 100))
                  : 0
              const barPercent = isSave ? saveProgress : spendProgress
              const isOverspent = !isSave && spendProgress > 80
              const progressBarClass = isSave
                ? 'bg-emerald-500'
                : isOverspent
                  ? 'bg-[#dc2626]'
                  : 'bg-slate-400 dark:bg-slate-500'
              const isExpanded = expandedBudgetId === budget.id
              const isMenuOpen = openMenuId === budget.id

              return (
                <div
                  key={budget.id}
                  className="group relative flex flex-col gap-3 rounded-2xl border border-[#0d2118]/8 bg-white px-5 py-5 shadow-sm dark:border-white/8 dark:bg-white/8 dark:backdrop-blur-md"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-base font-semibold text-slate-800 dark:text-slate-100">
                          {budget.name}
                        </h2>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            isSave
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-500 dark:bg-white/8 dark:text-slate-400'
                          }`}
                        >
                          {isSave ? 'Save' : 'Spend'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                          {formatAmount(current)}
                        </span>
                        {isSave && target > 0 && (
                          <>
                            <span className="text-sm text-slate-400 dark:text-slate-500">
                              / {formatAmount(target)}
                            </span>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                              · {saveProgress}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Three-dot menu */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        title="Actions"
                        className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-white/8 dark:hover:text-slate-300"
                        onClick={e => {
                          e.stopPropagation()
                          setOpenMenuId(isMenuOpen ? null : budget.id)
                        }}
                      >
                        <MoreHorizontal className="size-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-[#0d2418]">
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/8"
                            onClick={() => {
                              setFundMode('ADD')
                              setActiveBudgetId(budget.id)
                              setFundAmount('')
                              setFundNote('')
                              setIsFundModalOpen(true)
                              setIsFundNoteOpen(false)
                              setOpenMenuId(null)
                            }}
                          >
                            Add funds
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/8"
                            onClick={() => {
                              setFundMode('WITHDRAW')
                              setActiveBudgetId(budget.id)
                              setFundAmount('')
                              setFundNote('')
                              setIsFundModalOpen(true)
                              setIsFundNoteOpen(false)
                              setOpenMenuId(null)
                            }}
                          >
                            Withdraw
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/8"
                            onClick={() => {
                              setEditingBudgetId(budget.id)
                              setName(budget.name)
                              setLimit(String(budget.target ?? ''))
                              setBudgetKind(budget.kind)
                              setRollover(budget.rollover)
                              setIsModalOpen(true)
                              setOpenMenuId(null)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/8"
                            onClick={() => {
                              setExpandedBudgetId(prev =>
                                prev === budget.id ? null : budget.id,
                              )
                              setOpenMenuId(null)
                            }}
                          >
                            {isExpanded ? 'Hide history' : 'Show history'}
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 border-t border-slate-100 px-3 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:border-white/8 dark:text-rose-400 dark:hover:bg-rose-500/10"
                            onClick={() => {
                              handleDelete(budget.id)
                              setOpenMenuId(null)
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar or chart */}
                  {isExpanded ? (
                    chartData.length === 0 ? (
                      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
                        No activity yet — add or withdraw funds to see the trend.
                      </div>
                    ) : (
                      <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/5">
                        <BudgetLineChart data={chartData} />
                      </div>
                    )
                  ) : (
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${progressBarClass}`}
                        style={{ width: `${barPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Recent Adjustments */}
          {recentAdjustments.length > 0 && (
            <section className="flex flex-col gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Recent Adjustments
              </p>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/8 dark:bg-white/6 dark:backdrop-blur-md">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase dark:border-white/8 dark:bg-white/5 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 text-left">Budget</th>
                      <th className="px-4 py-3 text-left">Action</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAdjustments.map((adj, i) => (
                      <tr
                        key={i}
                        className="border-t border-slate-100 transition hover:bg-slate-50/60 dark:border-white/6 dark:hover:bg-white/4"
                      >
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                          {adj.budgetName}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                              adj.action === 'Add'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-white/8 dark:text-slate-400'
                            }`}
                          >
                            {adj.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">
                          {formatAmount(adj.amount)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">
                          {formatDate(adj.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <SpendingLimits initialLimits={initialLimits} compact />

          {/* Insights */}
          <div className="rounded-2xl border border-[#0d2118]/8 bg-white px-4 py-4 shadow-sm dark:border-white/8 dark:bg-white/8 dark:backdrop-blur-md">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Insights
            </p>
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-white/8">
              <div className="flex items-center justify-between py-3 first:pt-0">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Available Liquidity
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatAmount(availableLiquidity)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 last:pb-0">
                <span className="text-sm text-slate-600 dark:text-slate-400">Avg. Daily Burn</span>
                <span className="text-sm font-semibold text-[#dc2626] dark:text-[#f87171]">
                  {formatAmount(avgDailyBurn)}/day
                </span>
              </div>
            </div>
          </div>
        </aside>
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
