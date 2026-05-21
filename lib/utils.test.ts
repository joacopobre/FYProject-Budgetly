import { cn } from './utils'

describe('cn', () => {
  it('Always picks the later class', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('Ignores falsy values', () => {
    expect(cn('p-2', false, 'mb-2', null)).toBe('p-2 mb-2')
  })

  it('Returns an empty string if there is no class', () => {
    expect(cn()).toBe('')
  })
})
