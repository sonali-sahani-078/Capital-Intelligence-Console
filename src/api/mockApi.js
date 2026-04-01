import { defaultTransactions } from '../data/initialData'

const NETWORK_DELAY_MS = 500

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchTransactions() {
  await delay(NETWORK_DELAY_MS)
  return structuredClone(defaultTransactions)
}

export async function saveTransactions(transactions) {
  await delay(NETWORK_DELAY_MS)
  return { ok: true, updatedAt: new Date().toISOString(), count: transactions.length }
}
