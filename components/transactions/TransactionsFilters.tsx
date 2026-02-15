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
                  {option === filterMonth && <span className="text-emerald-600">✓</span>}
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
  )
}
