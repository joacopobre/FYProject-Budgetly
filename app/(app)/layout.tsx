import type { Metadata } from 'next'

import AppNav from '@/components/AppNav'
import { TransactionsProvider } from '@/context/TransactionsContext'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <TransactionsProvider>
      <div id="wrapper" className="bg-gray-200 text-black">
        <AppNav />
        <main className="bg-gray-200 pt-24">{children}</main>
      </div>
    </TransactionsProvider>
  )
}
