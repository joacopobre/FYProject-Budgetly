import AppShell from '@/components/AppShell'
import { AppFontWrapper } from '@/components/AppFontWrapper'
import { BudgetsProvider } from '@/context/BudgetsContext'
import { TransactionsProvider } from '@/context/TransactionsContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { OnboardingProvider } from '@/context/OnboardingContext'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'
import {
  Geist,
  Plus_Jakarta_Sans,
  DM_Sans,
  Nunito,
  IBM_Plex_Sans,
} from 'next/font/google'

// A — Geist Sans
const fontA = Geist({
  subsets: ['latin'],
  variable: '--font-a',
})
// B — Plus Jakarta Sans
const fontB = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-b',
  display: 'swap',
})
// C — DM Sans
const fontC = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-c',
  display: 'swap',
})
// D — Nunito
const fontD = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-d',
  display: 'swap',
})
// E — IBM Plex Sans
const fontE = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-e',
  display: 'swap',
})

const fontVariables = [
  fontA.variable,
  fontB.variable,
  fontC.variable,
  fontD.variable,
  fontE.variable,
].join(' ')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TransactionsProvider>
        <BudgetsProvider>
          <OnboardingProvider>
            <AppFontWrapper fontVariables={fontVariables}>
              <AppShell>{children}</AppShell>
              <OnboardingTour />
            </AppFontWrapper>
          </OnboardingProvider>
        </BudgetsProvider>
      </TransactionsProvider>
    </ThemeProvider>
  )
}
