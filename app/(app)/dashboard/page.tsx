'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useContext } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { filterByDateRange, type TrendRange } from '@/lib/transactions/filterByDateRange'
import { calculateDashboardStats } from '@/lib/transactions/calculateDashboardStats'
import { formatMoney } from '@/lib/transactions/formatMoney'
import { buildTrendSeries } from '@/lib/transactions/buildTrendSeries'
import { TransactionsContext } from '@/context/TransactionsContext'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { buildBalanceSeries } from '@/lib/transactions/buildBalanceSeries'
import { BalanceSparkline } from '@/components/dashboard/BalanceSparkline'

export default function Dashboard() {
  const [trendFilter, setTrendFilter] = useState<TrendRange>('This Month')

  const [isOpen, setIsOpen] = useState(false)
  const trendMenuRef = useRef<HTMLDivElement>(null)

  const context = useContext(TransactionsContext)
  if (!context) throw new Error('TransactionsContext missing')
  const { transactions } = context

  const filtered = filterByDateRange(transactions, trendFilter)
  const trendSeries = buildTrendSeries(filtered)
  const stats = calculateDashboardStats(filtered)

  const glanceStats = calculateDashboardStats(transactions)
  const balanceSeries = buildBalanceSeries(transactions)

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
    <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-5 pt-6 pb-10 md:px-8 lg:px-12">
      <h1 className="text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">
        Dashboard
      </h1>
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-semibold text-gray-700 md:text-4xl">Glance</h2>
          <span className="text-sm text-gray-400">Overview</span>
        </div>

        {/* Balance */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-5">
          <div className="align-center flex flex-col rounded-2xl border border-gray-200 bg-white px-4 py-6 md:h-full md:px-6 md:py-8">
            <div className="flex justify-between">
              <p className="my-auto text-lg font-medium text-gray-600 md:text-xl">
                Balance
              </p>
              <span className="text-3xl font-semibold text-gray-800 md:text-4xl">
                {formatMoney(glanceStats.balance)}
              </span>
            </div>
            <div className="mt-4">
              <BalanceSparkline data={balanceSeries} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="align-center flex justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4">
              <p className="text-base font-medium text-gray-600">Income</p>
              <span className="text-xl font-semibold text-emerald-600">
                {formatMoney(stats.totalIncome)}
              </span>
            </div>

            <div className="align-center flex justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4">
              <p className="text-base font-medium text-gray-600">Spent</p>
              <span className="text-xl font-semibold text-rose-600">
                {formatMoney(stats.totalExpenses)}
              </span>
            </div>

            <div className="align-center flex justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4">
              <p className="text-base font-medium text-gray-600">Net</p>
              <span className="text-xl font-semibold text-gray-800">
                {formatMoney(stats.balance)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-gray-700 md:text-4xl">Trend</h2>
            <div className="relative" ref={trendMenuRef}>
              <button
                type="button"
                onClick={handleClick}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                aria-expanded={isOpen}
                aria-controls="trend-filter-menu"
              >
                {trendFilter}
                {isOpen ? <X className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
              {isOpen && (
                <div
                  id="trend-filter-menu"
                  className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg"
                >
                  <ul className="flex flex-col text-sm font-medium text-gray-700">
                    <li className="border-b border-gray-200 last:border-b-0">
                      <button
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left transition hover:bg-gray-100 focus-visible:bg-gray-100 active:bg-gray-200"
                        onClick={() => applyFilter('This Month')}
                      >
                        This Month
                      </button>
                    </li>
                    <li className="border-b border-gray-200 last:border-b-0">
                      <button
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left transition hover:bg-gray-100 focus-visible:bg-gray-100 active:bg-gray-200"
                        onClick={() => applyFilter('Last 3 Months')}
                      >
                        Last 3 Months
                      </button>
                    </li>
                    <li className="border-b border-gray-200 last:border-b-0">
                      <button
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left transition hover:bg-gray-100 focus-visible:bg-gray-100 active:bg-gray-200"
                        onClick={() => applyFilter('This Year')}
                      >
                        This Year
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-6 md:px-6 md:py-7 lg:px-8 lg:py-8">
            <div className="space-y-6 md:grid md:grid-cols-[1.2fr_0.8fr] md:items-start md:gap-6 md:space-y-0 lg:gap-8">
              <TrendChart data={trendSeries} />
              <RecentTransactions transactions={transactions} />
            </div>
          </div>
        </section>

        {/* budgets compact */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-gray-700 md:text-4xl">Budgets</h2>
            <Link
              href="/budgets"
              className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800">Budget {i}</h3>
                  <span className="text-sm text-gray-500">$500 / $700</span>
                </div>
                <div className="h-2 w-full rounded-full bg-emerald-50">
                  <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
