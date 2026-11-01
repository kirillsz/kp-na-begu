export type Item = {
  id: string
  name: string
  unit: string
  quantity: number
  price: number
  leadDays: string
}

export type Proposal = {
  id: string
  number: string
  date: string
  client: string
  requestReference: string
  delivery: string
  payment: string
  items: Item[]
  createdAt: string
  updatedAt: string
}

export const uid = () => crypto.randomUUID()

export function newProposal(): Proposal {
  const current = new Date()
  const now = current.toISOString()
  const localDate = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
  return {
    id: uid(), number: '', date: localDate, client: '', requestReference: '',
    delivery: 'Самовывоз', payment: '100% предоплата', items: [], createdAt: now, updatedAt: now,
  }
}

export function lineTotal(item: Item): number {
  return Math.round(item.quantity * item.price * 100) / 100
}

export function proposalTotal(items: Item[]): number {
  return Math.round(items.reduce((sum, item) => sum + lineTotal(item), 0) * 100) / 100
}

export const rub = (value: number) => new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: value % 1 ? 2 : 0,
  maximumFractionDigits: 2,
}).format(value)

export function formatDate(date: string): string {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}
