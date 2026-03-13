import AppShell from '@/components/AppShell'
import { BudgetsProvider } from '@/context/BudgetsContext'
import { TransactionsProvider } from '@/context/TransactionsContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { OnboardingProvider } from '@/context/OnboardingContext'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TransactionsProvider>
        <BudgetsProvider>
          <OnboardingProvider>
            <AppShell>{children}</AppShell>
            <OnboardingTour />
          </OnboardingProvider>
        </BudgetsProvider>
      </TransactionsProvider>
    </ThemeProvider>
  )
}
