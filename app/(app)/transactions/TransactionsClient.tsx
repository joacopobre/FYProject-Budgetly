'use client'

import { useCallback, useMemo, useState, useContext, useEffect } from 'react'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { TransactionsFilters } from '@/components/transactions/TransactionsFilters'
import { TransactionsHeader } from '@/components/transactions/TransactionsHeader'
import { TransactionsMobileList } from '@/components/transactions/TransactionsMobileList'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'
import { filterTransactions } from '@/lib/transactions/filterTransactions'
import { formatMoney } from '@/lib/transactions/formatMoney'
import type {
  MonthFilter,
  RecurrenceFrequency,
  Transaction,
  TypeFilter,
  TxSource,
  TxType,
} from '@/types/transactions'
import { TransactionsContext } from '@/context/TransactionsContext'
import { BudgetsContext } from '@/context/BudgetsContext'

const monthOptions = ['All time', 'This month', 'Last month', 'This year'] as const
const typeOptions = ['All types', 'Income', 'Expense', 'Transfer'] as const

// Calculate nextDue from transaction date and recurrence
function computeNextDue(fromDate: string, recurrence: RecurrenceFrequency): string {
  const d = new Date(fromDate)
  switch (recurrence) {
    case 'DAILY':
      d.setDate(d.getDate() + 1)
      break
    case 'WEEKLY':
      d.setDate(d.getDate() + 7)
      break
    case 'MONTHLY':
      d.setMonth(d.getMonth() + 1)
      break
    case 'YEARLY':
      d.setFullYear(d.getFullYear() + 1)
      break
    default:
      break
  }
  return d.toISOString().slice(0, 10)
}

type Props = {
  initialTransactions: Transaction[]
}
export default function TransactionsClient({ initialTransactions }: Props) {
  const context = useContext(TransactionsContext)
  if (!context) throw new Error('TransactionsContext missing')
  const { transactions, setTransactions } = context
  const budgetsContext = useContext(BudgetsContext)
  if (!budgetsContext) throw new Error('BudgetsContext missing')
  const { budgets } = budgetsContext

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<TxType>('Expense')
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState<TxSource>('ACCOUNT')
  const [budgetId, setBudgetId] = useState<string | null>(null)
  const [recurrence, setRecurrence] = useState<RecurrenceFrequency>('NONE')
  const [filterMonth, setFilterMonth] = useState<MonthFilter>('All time')
  const [filterType, setFilterType] = useState<TypeFilter>('All types')
  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false)
  const [isFilterTypeMenuOpen, setIsFilterTypeMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRecurring, setFilterRecurring] = useState(false)

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions, setTransactions])

  const usedCategories = useMemo(
    () =>
      Array.from(new Set(transactions.map(tx => tx.category).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [transactions],
  )

  const filteredTransactions = useMemo(() => {
    let result = filterTransactions({
      transactions,
      searchTerm,
      filterType,
      filterMonth,
    })
    if (filterRecurring) {
      result = result.filter(tx => tx.recurrence !== 'NONE')
    }
    return result.sort((a, b) => {
      const aTime = new Date(a.date).getTime()
      const bTime = new Date(b.date).getTime()
      const byDate =
        (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime)
      if (byDate !== 0) return byDate
      return b.id - a.id
    })
  }, [transactions, searchTerm, filterType, filterMonth, filterRecurring])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setDate('')
    setDescription('')
    setCategory('')
    setType('Expense')
    setAmount('')
    setSource('ACCOUNT')
    setBudgetId(null)
    setRecurrence('NONE')
    setEditingId(null)
  }, [])

  const openModal = (tx?: Transaction) => {
    if (tx) {
      setEditingId(tx.id)
      setDate(tx.date)
      setDescription(tx.description)
      setCategory(tx.category)
      setType(tx.type)
      setAmount(String(Math.abs(tx.amount)))
      setSource(tx.source ?? 'ACCOUNT')
      setBudgetId(tx.budgetId ?? null)
      setRecurrence(tx.recurrence ?? 'NONE')
    } else {
      setEditingId(null)
      setDate('')
      setDescription('')
      setCategory('')
      setType('Expense')
      setAmount('')
      setSource('ACCOUNT')
      setBudgetId(null)
      setRecurrence('NONE')
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    const validatedDate = date.trim()
    const validatedDescription = description.trim()
    const validatedCategory = category.trim()
    const numericAmount = Number(amount)

    if (
      !validatedDate ||
      !validatedDescription ||
      !validatedCategory ||
      isNaN(numericAmount) ||
      numericAmount <= 0
    )
      return

    const signedAmount =
      type === 'Income' ? Math.abs(numericAmount) : -Math.abs(numericAmount)

    const nextDue =
      recurrence !== 'NONE' ? computeNextDue(validatedDate, recurrence) : null

    if (editingId !== null) {
      const res = await fetch(`/api/transactions/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: validatedDate,
          description: validatedDescription,
          category: validatedCategory,
          type,
          amount: signedAmount,
          source,
          budgetId: source === 'BUDGET' ? budgetId : null,
          recurrence,
          nextDue,
        }),
      })

      if (!res.ok) return

      const updated = await res.json()

      setTransactions(prev =>
        prev.map(tx =>
          tx.id === updated.id
            ? {
                ...updated,
                date: new Date(updated.date).toISOString(),
                nextDue: updated.nextDue ? new Date(updated.nextDue).toISOString() : null,
              }
            : tx,
        ),
      )

      closeModal()
      return
    } else {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: validatedDate,
          description: validatedDescription,
          category: validatedCategory,
          type,
          amount: signedAmount,
          source,
          budgetId: source === 'BUDGET' ? budgetId : null,
          recurrence,
          nextDue,
        }),
      })

      if (!res.ok) return

      const created = await res.json()

      setTransactions(prev => [
        {
          ...created,
          date: new Date(created.date).toISOString(),
          nextDue: created.nextDue ? new Date(created.nextDue).toISOString() : null,
        },
        ...prev,
      ])
    }
    closeModal()
  }

  const handleDeleteTransaction = async (id: number) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) return

    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }

  const getSourceLabel = (tx: Transaction) => {
    if (tx.source === 'ACCOUNT') return 'Account'
    const match = budgets.find(b => b.id === tx.budgetId)
    return match?.name ?? 'Budget'
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-8 px-5 py-10 md:px-8 lg:px-12">
      <TransactionsHeader onAdd={() => openModal()} />

      <TransactionsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        isMonthMenuOpen={isMonthMenuOpen}
        setIsMonthMenuOpen={setIsMonthMenuOpen}
        filterType={filterType}
        setFilterType={setFilterType}
        isFilterTypeMenuOpen={isFilterTypeMenuOpen}
        setIsFilterTypeMenuOpen={setIsFilterTypeMenuOpen}
        monthOptions={monthOptions}
        typeOptions={typeOptions}
        filterRecurring={filterRecurring}
        setFilterRecurring={setFilterRecurring}
      />

      <TransactionsTable
        transactions={filteredTransactions}
        onEdit={openModal}
        onDelete={handleDeleteTransaction}
        formatMoney={formatMoney}
        getSourceLabel={getSourceLabel}
      />

      <TransactionsMobileList
        transactions={filteredTransactions}
        onEdit={openModal}
        onDelete={handleDeleteTransaction}
        formatMoney={formatMoney}
        getSourceLabel={getSourceLabel}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingId={editingId}
        date={date}
        setDate={setDate}
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
        categories={usedCategories}
        type={type}
        setType={setType}
        amount={amount}
        setAmount={setAmount}
        source={source}
        setSource={setSource}
        budgetId={budgetId}
        setBudgetId={setBudgetId}
        recurrence={recurrence}
        setRecurrence={setRecurrence}
      />
    </main>
  )
}
