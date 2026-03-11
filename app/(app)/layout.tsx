import AppShell from '@/components/AppShell'
import { BudgetsProvider } from '@/context/BudgetsContext'
import { TransactionsProvider } from '@/context/TransactionsContext'
import { ThemeProvider } from '@/context/ThemeContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TransactionsProvider>
        <BudgetsProvider>
          <AppShell>{children}</AppShell>
        </BudgetsProvider>
      </TransactionsProvider>
    </ThemeProvider>
  )
}
