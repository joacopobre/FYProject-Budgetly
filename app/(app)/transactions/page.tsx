'use client'

import { useCallback, useMemo, useState, useContext } from 'react'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { TransactionsFilters } from '@/components/transactions/TransactionsFilters'
import { TransactionsHeader } from '@/components/transactions/TransactionsHeader'
import { TransactionsMobileList } from '@/components/transactions/TransactionsMobileList'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'
import { filterTransactions } from '@/lib/transactions/filterTransactions'
import { formatMoney } from '@/lib/transactions/formatMoney'
import type {
  MonthFilter,
  Transaction,
  TypeFilter,
  TxSource,
  TxType,
} from '@/types/transactions'
import { TransactionsContext } from '@/context/TransactionsContext'
import { BudgetsContext } from '@/context/BudgetsContext'

const monthOptions = ['All time', 'This month', 'Last month', 'This year'] as const
const typeOptions = ['All types', 'Income', 'Expense'] as const

export default function Transactions() {
  //constext for transactions
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
  const [filterMonth, setFilterMonth] = useState<MonthFilter>('All time')
  const [filterType, setFilterType] = useState<TypeFilter>('All types')
  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false)
  const [isFilterTypeMenuOpen, setIsFilterTypeMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTransactions = useMemo(
    () =>
      filterTransactions({
        transactions,
        searchTerm,
        filterType,
        filterMonth,
      }).sort((a, b) => {
        const aTime = new Date(a.date).getTime()
        const bTime = new Date(b.date).getTime()
        const byDate = (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime)
        if (byDate !== 0) return byDate
        return b.id - a.id
      }),
    [transactions, searchTerm, filterType, filterMonth],
  )

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setDate('')
    setDescription('')
    setCategory('')
    setType('Expense')
    setAmount('')
    setSource('ACCOUNT')
    setBudgetId(null)
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
    } else {
      setEditingId(null)
      setDate('')
      setDescription('')
      setCategory('')
      setType('Expense')
      setAmount('')
      setSource('ACCOUNT')
      setBudgetId(null)
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
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

    if (editingId !== null) {
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === editingId
            ? {
                ...tx,
                date: validatedDate,
                description: validatedDescription,
                category: validatedCategory,
                type,
                amount: signedAmount,
                source,
                budgetId: source === 'BUDGET' ? budgetId : null,
              }
            : tx,
        ),
      )
    } else {
      setTransactions(prev => [
        ...prev,
        {
          id: Date.now(),
          date: validatedDate,
          description: validatedDescription,
          category: validatedCategory,
          type,
          amount: signedAmount,
          source,
          budgetId: source === 'BUDGET' ? budgetId : null,
        },
      ])
    }
    closeModal()
  }

  const handleDeleteTransaction = (id: number) => {
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
        type={type}
        setType={setType}
        amount={amount}
        setAmount={setAmount}
        source={source}
        setSource={setSource}
        budgetId={budgetId}
        setBudgetId={setBudgetId}
      />
    </main>
  )
}
