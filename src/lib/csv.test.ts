import { describe, expect, it } from 'vitest'
import { csvTemplate, parseItemsCsv } from './csv'

describe('CSV import', () => {
  it('imports the downloadable semicolon-separated template', () => {
    const result = parseItemsCsv(csvTemplate)
    expect(result.errors).toEqual([])
    expect(result.items).toMatchObject([{ name: 'Шлем тактический', quantity: 7, price: 32800, leadDays: '7' }])
  })

  it('reports invalid rows while retaining valid rows', () => {
    const result = parseItemsCsv(csvTemplate + 'Ошибочная позиция;шт.;0;100;7\n')
    expect(result.items).toHaveLength(1)
    expect(result.errors).toHaveLength(1)
  })
})
