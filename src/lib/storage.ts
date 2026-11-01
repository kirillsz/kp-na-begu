import { openDB } from 'idb'
import type { Proposal } from './model'

const database = openDB('kp-na-begu', 1, {
  upgrade(db) {
    db.createObjectStore('proposals', { keyPath: 'id' })
  },
})

export async function listProposals(): Promise<Proposal[]> {
  const db = await database
  const proposals = await db.getAll('proposals') as Proposal[]
  return proposals.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function saveProposal(proposal: Proposal): Promise<void> {
  const db = await database
  await db.put('proposals', proposal)
}

export async function deleteProposal(id: string): Promise<void> {
  const db = await database
  await db.delete('proposals', id)
}
