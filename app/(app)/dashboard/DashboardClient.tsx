'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useContext } from 'react'
import { ChevronDown, Plus, X } from 'lucide-react'
import { filterByDateRange, type TrendRange } from '@/lib/transactions/filterByDateRange'
import { calculateDashboardStats } from '@/lib/transactions/calculateDashboardStats'
import { formatMoney } from '@/lib/transactions/formatMoney'
import { buildTrendSeries } from '@/lib/transactions/buildTrendSeries'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { buildBalanceSeries } from '@/lib/transactions/buildBalanceSeries'
import { BalanceSparkline } from '@/components/dashboard/BalanceSparkline'
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

  useEffect(() => {
    setBudgets(initialBudgets)
  }, [initialBudgets, setBudgets])

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions, setTransactions])

  const filtered = filterByDateRange(initialTransactions, trendFilter)
  const trendSeries = buildTrendSeries(filtered)
  const stats = calculateDashboardStats(filtered)

  const glanceStats = calculateDashboardStats(initialTransactions)
  const balanceSeries = buildBalanceSeries(initialTransactions)

  const handleClick = () => setIsOpen(prev => !prev)

  const applyFilter = (filter: TrendRange): void => {
    setTrendFilter(filter)
    handleClick()
  }

  useEffect(() => {
    if (!isOpen) return
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (!trendMenuRef.current) return
      if (!trendMenuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [isOpen])

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-7 px-5 pt-6 pb-12 md:px-8 lg:px-12">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
        Dashboard
      </h1>
      <section className="flex flex-col gap-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 md:text-3xl">Glance</h2>
          <span className="text-sm text-slate-400 dark:text-slate-500">Overview</span>
        </div>

        {/* Balance */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-5">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-white/6 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:backdrop-blur-md md:h-full md:px-6 md:py-8">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 to-teal-400" />
            <div className="flex justify-between">
              <p className="my-auto text-lg font-medium text-slate-600 dark:text-slate-300 md:text-xl">
                Balance
              </p>
              <span className="text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl">
                {formatMoney(glanceStats.balance)}
              </span>
            </div>
            <div className="mt-4">
              <BalanceSparkline data={balanceSeries} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-4 dark:border-emerald-500/20 dark:bg-emerald-500/8 dark:backdrop-blur-md">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-400" />
              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-slate-700 dark:text-slate-300">Income</p>
                <span className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatMoney(stats.totalIncome)}
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/45 px-4 py-4 dark:border-rose-500/20 dark:bg-rose-500/8 dark:backdrop-blur-md">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-rose-400" />
              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-slate-700 dark:text-slate-300">Spent</p>
                <span className="text-xl font-semibold text-rose-600 dark:text-rose-400">
                  {formatMoney(stats.totalExpenses)}
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] dark:border-white/8 dark:bg-white/6 dark:shadow-none dark:backdrop-blur-md">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-teal-400" />
              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-slate-700 dark:text-slate-300">Net</p>
                <span className="text-xl font-semibold text-slate-900 dark:text-white">
                  {formatMoney(stats.balance)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 md:text-3xl">Trend</h2>
            <div className="relative" ref={trendMenuRef}>
              <button
                type="button"
                onClick={handleClick}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 dark:border-white/15 dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white/12"
                aria-expanded={isOpen}
                aria-controls="trend-filter-menu"
              >
                {trendFilter}
                {isOpen ? <X className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
              {isOpen && (
                <div
                  id="trend-filter-menu"
                  className="absolute right-0 z-10 mt-2 w-48 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.1)] overflow-hidden dark:border-white/10 dark:bg-[#0d2418]"
                >
                  <ul className="flex flex-col text-sm font-medium text-slate-700">
                    {(['This Month', 'Last 3 Months', 'This Year'] as const).map(opt => (
                      <li key={opt} className="border-b border-slate-100 last:border-b-0 dark:border-white/8">
                        <button
                          type="button"
                          className={`w-full px-4 py-2.5 text-left transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/8 ${trendFilter === opt ? 'text-emerald-600 font-semibold dark:text-emerald-400' : ''}`}
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
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-white/6 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:backdrop-blur-md md:px-6 md:py-7 lg:px-8 lg:py-8">
            <div className="space-y-6 md:grid md:grid-cols-[1.2fr_0.8fr] md:items-start md:gap-6 md:space-y-0 lg:gap-8">
              <TrendChart data={trendSeries} />
              <RecentTransactions transactions={initialTransactions} />
            </div>
          </div>
        </section>

        {/* budgets compact */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 md:text-3xl">Budgets</h2>
            <Link
              href="/budgets"
              className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {initialBudgets.length > 0 ? (
              initialBudgets.slice(0, 4).map(budget => {
                const isSave = budget.kind === 'SAVE'
                const current = budget.balance
                const target = budget.target ?? 0
                const progress =
                  isSave && target > 0
                    ? Math.min(100, Math.round((current / target) * 100))
                    : 0

                return (
                  <div
                    key={budget.id}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] dark:border-white/8 dark:bg-white/6 dark:shadow-none dark:backdrop-blur-md"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-[3px] ${isSave ? 'bg-emerald-500' : 'bg-teal-500'}`} />
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{budget.name}</h3>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {isSave
                          ? `$${current.toFixed(2)} / $${target.toFixed(2)}`
                          : `$${current.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full ${isSave ? 'bg-emerald-500' : 'bg-teal-500'}`}
                        style={{ width: isSave ? `${progress}%` : '100%' }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <Link
                href="/budgets"
                className="group rounded-xl border border-dashed border-slate-300 bg-white px-6 py-7 text-left shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition hover:border-emerald-300 hover:bg-emerald-50/30 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/8"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <Plus className="size-4" />
                </div>
                <p className="mt-3 text-base font-semibold text-gray-800 transition group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">
                  Create your first budget
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  Set a target and track your progress each month.
                </p>
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
