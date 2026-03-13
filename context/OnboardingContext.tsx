'use client'

import { createContext, useCallback, useContext, useState } from 'react'

export const TOUR_DONE_KEY = 'budgetly:tour:done'

interface OnboardingContextValue {
  isActive: boolean
  startTour: () => void
  endTour: () => void
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false)

  const startTour = useCallback(() => setIsActive(true), [])
  const endTour = useCallback(() => setIsActive(false), [])

  return (
    <OnboardingContext.Provider value={{ isActive, startTour, endTour }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('OnboardingContext missing')
  return ctx
}
