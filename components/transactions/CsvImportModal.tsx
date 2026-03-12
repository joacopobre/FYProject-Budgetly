'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import type { TxType } from '@/types/transactions'

type Step = 1 | 2 | 3

type ColumnMap = {
  date: string
  description: string
  amount: string
  category: string
  type: string
}

type ParsedRow = {
  date: string
  description: string
  amount: number
  category: string
  type: TxType
  valid: boolean
  errors: string[]
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onImported: (count: number) => void
}

function parseAmount(value: string): number | null {
  const cleaned = value.replace(/[$€£,\s]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

function parseDate(value: string): string | null {
  if (!value?.trim()) return null
  const d = new Date(value)
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  return null
}

function isValidTxType(value: string): value is TxType {
  return ['Income', 'Expense', 'Transfer'].includes(value)
}

const REQUIRED_FIELDS = ['date', 'description', 'amount'] as const
const FIELD_LABELS: Record<keyof ColumnMap, string> = {
  date: 'Date',
  description: 'Description',
  amount: 'Amount',
  category: 'Category',
  type: 'Type',
}

export function CsvImportModal({ isOpen, onClose, onImported }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [isDragging, setIsDragging] = useState(false)
  const [headers, setHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([])
  const [columnMap, setColumnMap] = useState<ColumnMap>({
    date: '',
    description: '',
    amount: '',
    category: '',
    type: '',
  })
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importSummary, setImportSummary] = useState<{ imported: number; failed: number } | null>(
    null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setIsDragging(false)
      setHeaders([])
      setRawRows([])
      setColumnMap({ date: '', description: '', amount: '', category: '', type: '' })
      setParsedRows([])
      setImporting(false)
      setImportProgress(0)
      setImportSummary(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !importing) onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prev
    }
  }, [isOpen, onClose, importing])

  const handleFile = useCallback((file: File) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const hdrs = results.meta.fields ?? []
        setHeaders(hdrs)
        setRawRows(results.data)

        const lower = hdrs.map(h => h.toLowerCase())
        const find = (candidates: string[]) =>
          hdrs.find((_, i) => candidates.includes(lower[i])) ?? ''

        setColumnMap({
          date: find(['date', 'transaction date', 'txdate', 'trans date']),
          description: find(['description', 'desc', 'name', 'memo', 'narration', 'details']),
          amount: find(['amount', 'value', 'sum', 'credit', 'debit']),
          category: find(['category', 'cat', 'tag', 'group']),
          type: find(['type', 'transaction type', 'txtype', 'kind']),
        })

        setStep(2)
      },
    })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file?.name.endsWith('.csv')) handleFile(file)
    },
    [handleFile],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const buildParsedRows = useCallback((): ParsedRow[] => {
    return rawRows.map(raw => {
      const errors: string[] = []

      const rawDate = columnMap.date ? (raw[columnMap.date] ?? '') : ''
      const parsedDate = parseDate(rawDate)
      if (!parsedDate) errors.push('Invalid date')

      const description = columnMap.description
        ? (raw[columnMap.description] ?? '').trim()
        : ''
      if (!description) errors.push('Missing description')

      const rawAmount = columnMap.amount ? (raw[columnMap.amount] ?? '') : ''
      const amount = parseAmount(rawAmount)
      if (amount === null) errors.push('Invalid amount')

      const category =
        (columnMap.category ? (raw[columnMap.category] ?? '').trim() : '') || 'Uncategorized'

      const rawType = columnMap.type ? (raw[columnMap.type] ?? '').trim() : ''
      const type: TxType = isValidTxType(rawType) ? rawType : 'Expense'

      return {
        date: parsedDate ?? '',
        description,
        amount: amount ?? 0,
        category,
        type,
        valid: errors.length === 0,
        errors,
      }
    })
  }, [rawRows, columnMap])

  const handleGoToReview = () => {
    setParsedRows(buildParsedRows())
    setStep(3)
  }

  const handleImport = async () => {
    const validRows = parsedRows.filter(r => r.valid)
    setImporting(true)
    setImportProgress(0)

    let imported = 0
    let failed = 0

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      const signedAmount =
        row.type === 'Income' ? Math.abs(row.amount) : -Math.abs(row.amount)

      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: row.date,
            description: row.description,
            category: row.category,
            type: row.type === 'Transfer' ? 'Expense' : row.type,
            amount: signedAmount,
            source: 'ACCOUNT',
            recurrence: 'NONE',
          }),
        })
        if (res.ok) {
          imported++
        } else {
          failed++
        }
      } catch {
        failed++
      }

      setImportProgress(i + 1)
    }

    setImporting(false)
    setImportSummary({ imported, failed })
    onImported(imported)
  }

  if (!isOpen) return null

  const validCount = parsedRows.filter(r => r.valid).length
  const invalidCount = parsedRows.filter(r => !r.valid).length
  const canProceedFromStep2 =
    columnMap.date !== '' && columnMap.description !== '' && columnMap.amount !== ''

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={() => {
        if (!importing) onClose()
      }}
    >
      <div
        className={`flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#0e2318] ${
          step === 1 ? 'max-w-lg' : 'max-w-3xl'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Import CSV</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {step === 1 && 'Upload a CSV file to bulk-import transactions.'}
              {step === 2 && 'Map your CSV columns to transaction fields.'}
              {step === 3 && 'Review your data before confirming the import.'}
            </p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-300"
            onClick={onClose}
            disabled={importing}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {([1, 2, 3] as const).map((s, i) => (
            <div key={s} className="contents">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  step >= s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-gray-500'
                }`}
              >
                {s}
              </div>
              {i < 2 && (
                <div
                  className={`h-px flex-1 ${step > s ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-white/10'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div
            className={`flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed p-10 text-center transition ${
              isDragging
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10'
                : 'border-gray-200 hover:border-emerald-300 dark:border-white/10 dark:hover:border-emerald-700'
            }`}
            onDragOver={e => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <svg
                className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Drag & drop a CSV file, or click to browse
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Supports .csv files only</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        )}

        {/* Step 2: Map columns */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            {/* CSV preview */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Preview (first 3 rows)
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
                      {headers.map(h => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left font-semibold whitespace-nowrap text-gray-600 dark:text-gray-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rawRows.slice(0, 3).map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-100 last:border-0 dark:border-white/5"
                      >
                        {headers.map(h => (
                          <td
                            key={h}
                            className="px-3 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300"
                          >
                            {row[h] ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Column mapping */}
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Map columns
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(
                  [
                    { key: 'date', required: true },
                    { key: 'description', required: true },
                    { key: 'amount', required: true },
                    { key: 'category', required: false },
                    { key: 'type', required: false },
                  ] as { key: keyof ColumnMap; required: boolean }[]
                ).map(field => (
                  <label
                    key={field.key}
                    className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <span>
                      {FIELD_LABELS[field.key]}
                      {field.required ? (
                        <span className="ml-1 text-red-400">*</span>
                      ) : (
                        <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
                      )}
                    </span>
                    <select
                      value={columnMap[field.key]}
                      onChange={e =>
                        setColumnMap(prev => ({ ...prev, [field.key]: e.target.value }))
                      }
                      className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
                    >
                      <option value="">— not mapped —</option>
                      {headers.map(h => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    {!field.required && field.key === 'category' && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Defaults to &quot;Uncategorized&quot;
                      </span>
                    )}
                    {!field.required && field.key === 'type' && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Defaults to &quot;Expense&quot;
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && !importSummary && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {validCount} valid
              </span>
              {invalidCount > 0 && (
                <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {invalidCount} invalid
                </span>
              )}
              <span className="text-gray-400 dark:text-gray-500">
                Only valid rows will be imported.
              </span>
            </div>

            {importing && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Importing...</span>
                  <span>
                    {importProgress} / {validCount}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-200"
                    style={{ width: `${(importProgress / validCount) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="max-h-72 overflow-y-auto rounded-xl border border-gray-200 dark:border-white/10">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-[#0a1c10]">
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Description
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Category
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Type
                    </th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600 dark:text-gray-400">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-100 last:border-0 dark:border-white/5 ${
                        row.valid ? '' : 'bg-red-50 dark:bg-red-900/10'
                      }`}
                    >
                      <td
                        className={`px-3 py-2 whitespace-nowrap ${row.valid ? 'text-gray-700 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {row.date || '—'}
                      </td>
                      <td
                        className={`px-3 py-2 max-w-[12rem] truncate ${row.valid ? 'text-gray-700 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {row.description || '—'}
                      </td>
                      <td
                        className={`px-3 py-2 whitespace-nowrap ${row.valid ? 'text-gray-700 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {row.category}
                      </td>
                      <td
                        className={`px-3 py-2 whitespace-nowrap ${row.valid ? 'text-gray-700 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {row.type}
                      </td>
                      <td
                        className={`px-3 py-2 text-right whitespace-nowrap ${row.valid ? 'text-gray-700 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {row.amount.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {row.valid ? (
                          <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                        ) : (
                          <span
                            title={row.errors.join(', ')}
                            className="cursor-help text-red-500 dark:text-red-400"
                          >
                            ✕ {row.errors.join(', ')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Import summary */}
        {importSummary && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <svg
                className="h-7 w-7 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Import complete</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {importSummary.imported} imported
                {importSummary.failed > 0 && `, ${importSummary.failed} failed`}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-2">
          {importSummary ? (
            <button
              type="button"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              onClick={onClose}
            >
              Done
            </button>
          ) : (
            <>
              {step === 2 && (
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              )}
              {step === 3 && !importing && (
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
              )}
              <button
                type="button"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                onClick={onClose}
                disabled={importing}
              >
                Cancel
              </button>
              {step === 2 && (
                <button
                  type="button"
                  disabled={!canProceedFromStep2}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleGoToReview}
                >
                  Review import
                </button>
              )}
              {step === 3 && !importing && (
                <button
                  type="button"
                  disabled={validCount === 0}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleImport}
                >
                  Import {validCount} transaction{validCount !== 1 ? 's' : ''}
                </button>
              )}
              {step === 3 && importing && (
                <button
                  type="button"
                  disabled
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white opacity-70"
                >
                  Importing...
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
