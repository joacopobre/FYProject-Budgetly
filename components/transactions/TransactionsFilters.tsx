'use client'

import { useEffect, useRef } from 'react'
import type { MonthFilter, TypeFilter } from '@/types/transactions'
import type { Dispatch, SetStateAction } from 'react'

type Props = {
  searchTerm: string
  setSearchTerm: (value: string) => void
  filterMonth: MonthFilter
  setFilterMonth: (value: MonthFilter) => void
  isMonthMenuOpen: boolean
  setIsMonthMenuOpen: Dispatch<SetStateAction<boolean>>
  setIsFilterTypeMenuOpen: Dispatch<SetStateAction<boolean>>
  filterType: TypeFilter
  setFilterType: (value: TypeFilter) => void
  isFilterTypeMenuOpen: boolean
  monthOptions: readonly MonthFilter[]
  typeOptions: readonly TypeFilter[]
}

export function TransactionsFilters({
  searchTerm,
  setSearchTerm,
  filterMonth,
  setFilterMonth,
  isMonthMenuOpen,
  setIsMonthMenuOpen,
  filterType,
  setFilterType,
  isFilterTypeMenuOpen,
  setIsFilterTypeMenuOpen,
  monthOptions,
  typeOptions,
}: Props) {
  const monthMenuRef = useRef<HTMLDivElement>(null)
  const filterTypeMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isMonthMenuOpen && !isFilterTypeMenuOpen) return
    const onClickAway = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (monthMenuRef.current && monthMenuRef.current.contains(target)) return
      if (filterTypeMenuRef.current && filterTypeMenuRef.current.contains(target)) return
      setIsMonthMenuOpen(false)
      setIsFilterTypeMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('touchstart', onClickAway)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('touchstart', onClickAway)
    }
  }, [isMonthMenuOpen, isFilterTypeMenuOpen, setIsFilterTypeMenuOpen, setIsMonthMenuOpen])

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)] dark:border-white/8 dark:bg-white/6 dark:backdrop-blur-md md:flex-row md:items-center md:gap-3">
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.currentTarget.value)}
        placeholder="Search transactions..."
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 transition outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-white/12"
      />
      <div className="relative w-full md:w-44" ref={monthMenuRef}>
        <button
          type="button"
          onClick={() => setIsMonthMenuOpen(prev => !prev)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white/12"
        >
          {filterMonth}
          <span className="text-slate-400">▾</span>
        </button>
        {isMonthMenuOpen && (
          <div className="absolute top-full right-0 left-0 z-20 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-[#0d2418]">
            {monthOptions.map(option => (
              <button
                key={option}
                type="button"
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-white/8 ${
                  option === filterMonth ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                }`}
                onClick={() => { setFilterMonth(option); setIsMonthMenuOpen(false) }}
              >
                {option}
                {option === filterMonth && <span className="text-emerald-500">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative w-full md:w-36" ref={filterTypeMenuRef}>
        <button
          type="button"
          onClick={() => setIsFilterTypeMenuOpen(prev => !prev)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white/12"
        >
          {filterType}
          <span className="text-slate-400">▾</span>
        </button>
        {isFilterTypeMenuOpen && (
          <div className="absolute top-full right-0 left-0 z-20 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-[#0d2418]">
            {typeOptions.map(option => (
              <button
                key={option}
                type="button"
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 ${
                  option === filterType ? 'font-semibold text-emerald-600' : 'text-slate-700'
                }`}
                onClick={() => { setFilterType(option); setIsFilterTypeMenuOpen(false) }}
              >
                {option}
                {option === filterType && <span className="text-emerald-500">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
