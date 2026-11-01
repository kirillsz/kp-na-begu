import Papa from 'papaparse'
import { uid, type Item } from './model'

export const csvTemplate = 'Наименование;Ед. изм.;Количество;Цена;Срок поставки, дней\nШлем тактический;шт.;7;32800;7\n'

type ImportResult = { items: Item[]; errors: string[] }

const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
const number = (value: unknown) => Number(String(value ?? '').replace(/\s/g, '').replace(',', '.'))

export function parseItemsCsv(text: string): ImportResult {
  const parsed = Papa.parse<string[]>(text.replace(/^\uFEFF/, ''), {
    delimiter: '', skipEmptyLines: 'greedy',
  })
  if (parsed.errors.length) {
    return { items: [], errors: parsed.errors.map(error => `CSV: ${error.message}${error.row !== undefined ? ` (строка ${error.row + 1})` : ''}`) }
  }
  const rows = parsed.data.map(row => row.map(cell => cell.trim()))
  if (!rows.length) return { items: [], errors: ['Файл пустой.'] }
  const headers = rows[0].map(normalize)
  const find = (...names: string[]) => headers.findIndex(h => names.includes(h))
  const columns = {
    name: find('наименование', 'товар', 'наименование товара'),
    unit: find('ед. изм.', 'ед. изм', 'единица измерения'),
    quantity: find('количество', 'кол-во'),
    price: find('цена', 'цена за единицу'),
    leadDays: find('срок поставки, дней', 'срок поставки', 'срок, дней'),
  }
  if (Object.values(columns).some(index => index < 0)) {
    return { items: [], errors: ['Не найдены обязательные колонки. Скачайте образец CSV и используйте его заголовки.'] }
  }
  const items: Item[] = []
  const errors: string[] = []
  rows.slice(1).forEach((row, index) => {
    const name = row[columns.name]?.trim() ?? ''
    const quantity = number(row[columns.quantity])
    const price = number(row[columns.price])
    if (!name || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(price) || price < 0) {
      errors.push(`Строка ${index + 2}: проверьте наименование, количество и цену.`)
      return
    }
    items.push({ id: uid(), name, unit: row[columns.unit] || 'шт.', quantity, price, leadDays: row[columns.leadDays] || '' })
  })
  return { items, errors }
}
