import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('formats a positive amount in GBP', () => {
    expect(formatCurrency(1234.56)).toBe('£1,234.56')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('£0.00')
  })

  it('handles a different currency', () => {
    expect(formatCurrency(100, 'USD')).toBe('US$100.00')
  })
})
