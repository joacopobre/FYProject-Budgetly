'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  value: string // YYYY-MM-DD
  onChange: (value: string) => void
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatDisplay(value: string): string {
  if (!value) return 'Select date'
  const [y, m, d] = value.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

function todayStr(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function DatePicker({ value, onChange }: Props) {
  const today = todayStr()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const initialYear = value ? Number(value.split('-')[0]) : new Date().getFullYear()
  const initialMonth = value ? Number(value.split('-')[1]) - 1 : new Date().getMonth()
  const [viewYear, setViewYear] = useState(initialYear)
  const [viewMonth, setViewMonth] = useState(initialMonth)

  // Update view when value changes externally
  useEffect(() => {
    if (value) {
      setViewYear(Number(value.split('-')[0]))
      setViewMonth(Number(value.split('-')[1]) - 1)
    }
  }, [value])

  useEffect(() => {
    if (!isOpen) return
    const onClickAway = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('touchstart', onClickAway)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('touchstart', onClickAway)
    }
  }, [isOpen])

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  function nextMonth() {
    const nextMonthFirst = viewMonth === 11
      ? toDateStr(viewYear + 1, 0, 1)
      : toDateStr(viewYear, viewMonth + 1, 1)
    if (nextMonthFirst > today) return
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  const totalDays = daysInMonth(viewYear, viewMonth)
  const startDay = firstDayOfWeek(viewYear, viewMonth)

  // Check if next month navigation should be disabled
  const nextMonthFirst = viewMonth === 11
    ? toDateStr(viewYear + 1, 0, 1)
    : toDateStr(viewYear, viewMonth + 1, 1)
  const canGoNext = nextMonthFirst <= today

  // Build calendar cells (nulls for padding before day 1)
  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-left text-gray-800 shadow-sm transition outline-none',
          'focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100',
          'dark:border-white/10 dark:bg-white/8 dark:text-slate-200',
          isOpen && 'border-emerald-400 ring-2 ring-emerald-100 dark:border-emerald-500/50 dark:ring-emerald-500/20',
        )}
      >
        <span className={cn('text-sm', !value && 'text-gray-400 dark:text-slate-500')}>
          {formatDisplay(value)}
        </span>
        <svg
          className={cn('h-4 w-4 text-gray-400 transition-transform dark:text-slate-500', isOpen && 'rotate-180')}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-lg ring-1 ring-black/5 dark:border-white/10 dark:bg-[#0e2318] dark:ring-white/5">
          {/* Month navigation */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200"
              aria-label="Previous month"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              disabled={!canGoNext}
              className={cn(
                'rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200',
                !canGoNext && 'cursor-not-allowed opacity-30 hover:bg-transparent dark:hover:bg-transparent',
              )}
              aria-label="Next month"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="mb-1 grid grid-cols-7 gap-0.5">
            {DAYS.map(d => (
              <div
                key={d}
                className="text-center text-xs font-medium text-gray-400 dark:text-slate-500"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (day === null) return <div key={`pad-${i}`} />
              const dateStr = toDateStr(viewYear, viewMonth, day)
              const isSelected = dateStr === value
              const isToday = dateStr === today
              const isFuture = dateStr > today
              return (
                <button
                  key={day}
                  type="button"
                  disabled={isFuture}
                  onClick={() => {
                    onChange(dateStr)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'flex h-8 w-full items-center justify-center rounded-lg text-sm transition',
                    isFuture
                      ? 'cursor-not-allowed text-gray-300 dark:text-slate-700'
                      : 'cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300',
                    isSelected &&
                      'bg-emerald-600 font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700',
                    isToday && !isSelected &&
                      'font-semibold text-emerald-600 dark:text-emerald-400',
                    !isSelected && !isToday && !isFuture &&
                      'text-gray-700 dark:text-slate-300',
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Today shortcut */}
          <div className="mt-3 border-t border-gray-100 pt-2 dark:border-white/5">
            <button
              type="button"
              onClick={() => {
                onChange(today)
                setIsOpen(false)
              }}
              className="w-full rounded-lg py-1.5 text-center text-xs font-medium text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
