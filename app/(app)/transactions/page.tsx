'use client'

import { useCallback, useMemo, useState } from 'react'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { TransactionsFilters } from '@/components/transactions/TransactionsFilters'
import { TransactionsHeader } from '@/components/transactions/TransactionsHeader'
import { TransactionsMobileList } from '@/components/transactions/TransactionsMobileList'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'
import { filterTransactions } from '@/lib/transactions/filterTransactions'
import { formatMoney } from '@/lib/transactions/formatMoney'
import { transactionsData } from '@/staticData/transactions'
import type { MonthFilter, Transaction, TypeFilter, TxType } from '@/types/transactions'

const monthOptions = ['All time', 'This month', 'Last month', 'This year'] as const
const typeOptions = ['All types', 'Income', 'Expense'] as const

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<TxType>('Expense')
  const [amount, setAmount] = useState('')
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
    } else {
      setEditingId(null)
      setDate('')
      setDescription('')
      setCategory('')
      setType('Expense')
      setAmount('')
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
        },
      ])
    }
    closeModal()
  }

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
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
      />

      <TransactionsMobileList
        transactions={filteredTransactions}
        onEdit={openModal}
        onDelete={handleDeleteTransaction}
        formatMoney={formatMoney}
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
      />
    </main>
  )
}
