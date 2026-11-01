import { describe, expect, it } from 'vitest'
import { lineTotal, proposalTotal, type Item } from './model'

const item = (quantity: number, price: number): Item => ({ id: '1', name: 'Товар', unit: 'шт.', quantity, price, leadDays: '7' })

describe('proposal totals', () => {
  it('recalculates line and proposal totals with fractional quantities', () => {
    expect(lineTotal(item(1.5, 32.8))).toBe(49.2)
    expect(proposalTotal([item(1.5, 32.8), item(2, 10)])).toBe(69.2)
  })

  it('returns zero for an empty proposal', () => {
    expect(proposalTotal([])).toBe(0)
  })
})
