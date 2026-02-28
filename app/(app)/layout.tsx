import AppNav from '@/components/AppNav'
import { BudgetsProvider } from '@/context/BudgetsContext'
import { TransactionsProvider } from '@/context/TransactionsContext'
import { Providers } from '../providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <TransactionsProvider>
        <BudgetsProvider>
          <div id="wrapper" className="bg-gray-200 text-black">
            <AppNav />
            <main className="bg-gray-200 pt-24">{children}</main>
          </div>
        </BudgetsProvider>
      </TransactionsProvider>
    </Providers>
  )
}
