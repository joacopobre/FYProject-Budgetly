'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useContext } from 'react'
import { ChevronDown, Plus, X } from 'lucide-react'
import { useOnboarding, TOUR_DONE_KEY } from '@/context/OnboardingContext'
import { filterByDateRange, type TrendRange } from '@/lib/transactions/filterByDateRange'
import { calculateDashboardStats } from '@/lib/transactions/calculateDashboardStats'
import { formatMoney } from '@/lib/transactions/formatMoney'
import { buildTrendSeries } from '@/lib/transactions/buildTrendSeries'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { buildNetWorthSeries } from '@/lib/transactions/buildNetWorthSeries'
import { NetWorthChart } from '@/components/dashboard/NetWorthChart'
import { Transaction } from '@/types/transactions'
import { TransactionsContext } from '@/context/TransactionsContext'
import { Budget } from '@/types/budgets'
import { BudgetsContext } from '@/context/BudgetsContext'

type Props = {
  initialTransactions: Transaction[]
  initialBudgets: Budget[]
}

export default function DashboardClient({ initialTransactions, initialBudgets }: Props) {
  const [trendFilter, setTrendFilter] = useState<TrendRange>('This Month')
  const txContext = useContext(TransactionsContext)
  if (!txContext) throw new Error('TransactionsContext missing')
  const { setTransactions } = txContext

  const [isOpen, setIsOpen] = useState(false)
  const trendMenuRef = useRef<HTMLDivElement>(null)
  const budgetsContext = useContext(BudgetsContext)
  if (!budgetsContext) throw new Error('BudgetsContext missing')
  const { setBudgets } = budgetsContext

  const { startTour } = useOnboarding()

  useEffect(() => {
    setBudgets(initialBudgets)
  }, [initialBudgets, setBudgets])

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions, setTransactions])

  useEffect(() => {
    if (initialTransactions.length === 0 && initialBudgets.length === 0) {
      try {
        if (!localStorage.getItem(TOUR_DONE_KEY)) startTour()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // This-month stats (always fixed, independent of trendFilter)
  const thisMonthTx = filterByDateRange(initialTransactions, 'This Month')
  const thisMonthStats = calculateDashboardStats(thisMonthTx)

  // Last-month for comparison
  const lastMonthTx = initialTransactions.filter(tx => {
    const d = new Date(tx.date)
    const now = new Date()
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getFullYear() === lm.getFullYear() && d.getMonth() === lm.getMonth()
  })
  const lastMonthStats = calculateDashboardStats(lastMonthTx)

  // All-time balance
  const allTimeBalance = initialTransactions.reduce((sum, tx) => sum + tx.amount, 0)
  const inBudgets = initialBudgets.reduce((sum, b) => sum + b.balance, 0)
  const availableBalance = allTimeBalance - inBudgets

  // Trend chart & net-worth data (follow trendFilter)
  const filtered = filterByDateRange(initialTransactions, trendFilter)
  const trendSeries = buildTrendSeries(filtered)
  const netWorthSeries = buildNetWorthSeries(initialTransactions, trendFilter)

  // Secondary-line helpers
  const savingsRate =
    thisMonthStats.totalIncome > 0
      ? Math.round(
          ((thisMonthStats.totalIncome - thisMonthStats.totalExpenses) /
            thisMonthStats.totalIncome) *
            100,
        )
      : null

  const spentDelta =
    lastMonthStats.totalExpenses > 0
      ? ((thisMonthStats.totalExpenses - lastMonthStats.totalExpenses) /
          lastMonthStats.totalExpenses) *
        100
      : null

  const handleClick = () => setIsOpen(prev => !prev)
  const applyFilter = (filter: TrendRange) => {
    setTrendFilter(filter)
    handleClick()
  }

  useEffect(() => {
    if (!isOpen) return
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (!trendMenuRef.current) return
      if (!trendMenuRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [isOpen])

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-8 overflow-x-hidden px-5 pt-8 pb-14 md:px-8 lg:px-12">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
          Dashboard
        </h1>
        <Link
          href="/transactions"
          data-tour="add-transaction"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_4px_18px_rgba(16,185,129,0.5)]"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Add transaction</span>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <section data-tour="dashboard-stats" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Balance */}
        <div className="flex flex-col gap-1 overflow-hidden rounded-2xl border border-[#0d2118]/8 bg-white px-5 py-5 shadow-sm dark:border-white/8 dark:bg-white/8 dark:backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Total Balance
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl">
            {formatMoney(allTimeBalance)}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {formatMoney(availableBalance)} available &middot; {formatMoney(inBudgets)} in budgets
          </p>
        </div>

        {/* Monthly Income */}
        <div className="flex flex-col gap-1 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/50 px-5 py-5 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/8 dark:backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Monthly Income
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400 lg:text-3xl">
            {formatMoney(thisMonthStats.totalIncome)}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {savingsRate !== null
              ? savingsRate >= 0
                ? `Saving ${savingsRate}% of income`
                : `Overspending by ${Math.abs(savingsRate)}%`
              : 'No income this month'}
          </p>
        </div>

        {/* Monthly Spent */}
        <div className="flex flex-col gap-1 overflow-hidden rounded-2xl border border-[#dc2626]/15 bg-[#dc2626]/5 px-5 py-5 shadow-sm dark:border-[#dc2626]/20 dark:bg-[#dc2626]/8 dark:backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Monthly Spent
          </p>
          <p className="mt-1 text-2xl font-bold text-[#dc2626] dark:text-[#f87171] lg:text-3xl">
            {formatMoney(thisMonthStats.totalExpenses)}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {spentDelta !== null
              ? `${spentDelta > 0 ? '+' : ''}${spentDelta.toFixed(1)}% vs last month`
              : 'No data last month'}
          </p>
        </div>

        {/* Net Savings */}
        <div className="flex flex-col gap-1 overflow-hidden rounded-2xl border border-[#0d2118]/8 bg-white px-5 py-5 shadow-sm dark:border-white/8 dark:bg-white/8 dark:backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Net Savings
          </p>
          <p
            className={`mt-1 text-2xl font-bold lg:text-3xl ${
              thisMonthStats.balance >= 0
                ? 'text-slate-900 dark:text-white'
                : 'text-[#dc2626] dark:text-[#f87171]'
            }`}
          >
            {formatMoney(thisMonthStats.balance)}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {thisMonthStats.balance >= 0 ? 'Positive this month' : 'Negative this month'}
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <div data-tour="dashboard-trend" className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Left: trend filter + chart + recent transactions */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="relative" ref={trendMenuRef}>
            <button
              type="button"
              onClick={handleClick}
              className="flex items-center gap-2 rounded-full border border-[#0d2118]/10 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-[#0d2118]/20 hover:bg-slate-50 dark:border-white/15 dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white/12"
              aria-expanded={isOpen}
            >
              {trendFilter}
              {isOpen ? <X className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {isOpen && (
              <div className="absolute left-0 z-10 mt-2 w-48 overflow-hidden rounded-2xl border border-[#0d2118]/8 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#0d2418]">
                <ul className="flex flex-col text-sm font-medium text-slate-700">
                  {(['This Month', 'Last 3 Months', 'This Year'] as const).map(opt => (
                    <li key={opt} className="border-b border-slate-100 last:border-b-0 dark:border-white/8">
                      <button
                        type="button"
                        className={`w-full px-4 py-2.5 text-left transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/8 ${trendFilter === opt ? 'font-semibold text-emerald-600 dark:text-emerald-400' : ''}`}
                        onClick={() => applyFilter(opt)}
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#0d2118]/8 bg-white px-5 py-6 shadow-sm dark:border-white/8 dark:bg-white/8 dark:backdrop-blur-md">
            <TrendChart data={trendSeries} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Recent Transactions
              </span>
              <Link
                href="/transactions"
                className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                View all →
              </Link>
            </div>
            <RecentTransactions transactions={initialTransactions} />
          </div>
        </div>

        {/* Right: active budgets */}
        <section className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Active Budgets
            </p>
            <Link
              href="/budgets"
              className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View all →
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#0d2118]/8 bg-white px-4 pt-4 pb-4 shadow-sm dark:border-white/8 dark:bg-white/8 dark:backdrop-blur-md">
            {initialBudgets.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-white/8">
                {initialBudgets.slice(0, 5).map(budget => {
                  const isSave = budget.kind === 'SAVE'
                  const current = budget.balance
                  const target = budget.target ?? 0
                  const progress =
                    isSave && target > 0
                      ? Math.min(100, Math.round((current / target) * 100))
                      : 0

                  return (
                    <div key={budget.id} className="flex flex-col gap-2 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                            {budget.name}
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                              isSave
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-white/8 dark:text-slate-400'
                            }`}
                          >
                            {isSave ? 'Save' : 'Spend'}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                          {isSave
                            ? `${formatMoney(current)} / ${formatMoney(target)}`
                            : formatMoney(current)}
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-white/10">
                        <div
                          className={`h-full rounded-full ${isSave ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500'}`}
                          style={{ width: isSave ? `${progress}%` : '100%' }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <Link
                href="/budgets"
                className="group flex w-full flex-col items-center rounded-xl border border-dashed border-[#0d2118]/15 py-8 text-center transition hover:border-emerald-300 hover:bg-emerald-50/30 dark:border-white/10 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/8"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <Plus className="size-4" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-800 transition group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">
                  Create your first budget
                </p>
              </Link>
            )}
            <Link
              href="/budgets"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#0d2118]/12 px-3 py-2 text-xs font-medium text-slate-500 transition hover:border-emerald-300 hover:bg-emerald-50/30 hover:text-emerald-700 dark:border-white/10 dark:text-slate-400 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/8 dark:hover:text-emerald-400"
            >
              <Plus className="size-3" />
              Add budget
            </Link>
          </div>
        </section>
      </div>

      {/* Net Worth — full width */}
      <section>
        <div className="rounded-2xl border border-[#0d2118]/8 bg-white px-5 py-6 shadow-sm dark:border-white/8 dark:bg-white/8 dark:backdrop-blur-md md:px-6 md:py-7 lg:px-8 lg:py-8">
          <NetWorthChart data={netWorthSeries} />
        </div>
      </section>
    </div>
  )
}
