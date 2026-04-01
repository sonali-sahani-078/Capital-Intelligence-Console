export const STORAGE_KEY = 'finance-dashboard-state-v1'

export const defaultTransactions = [
  { id: 't1', date: '2026-01-03', amount: 5300, category: 'Salary', type: 'income', note: 'January payroll' },
  { id: 't2', date: '2026-01-06', amount: 72, category: 'Food', type: 'expense', note: 'Groceries' },
  { id: 't3', date: '2026-01-10', amount: 45, category: 'Transport', type: 'expense', note: 'Metro card' },
  { id: 't4', date: '2026-02-03', amount: 5300, category: 'Salary', type: 'income', note: 'February payroll' },
  { id: 't5', date: '2026-02-09', amount: 215, category: 'Utilities', type: 'expense', note: 'Electric bill' },
  { id: 't6', date: '2026-02-12', amount: 110, category: 'Entertainment', type: 'expense', note: 'Movies' },
  { id: 't7', date: '2026-03-03', amount: 5400, category: 'Salary', type: 'income', note: 'March payroll' },
  { id: 't8', date: '2026-03-07', amount: 430, category: 'Shopping', type: 'expense', note: 'Clothing' },
  { id: 't9', date: '2026-03-14', amount: 190, category: 'Food', type: 'expense', note: 'Dining out' },
  { id: 't10', date: '2026-03-16', amount: 90, category: 'Transport', type: 'expense', note: 'Ride sharing' },
  { id: 't11', date: '2026-03-21', amount: 125, category: 'Utilities', type: 'expense', note: 'Water bill' },
]

export const defaultState = {
  role: 'viewer',
  darkMode: false,
  transactions: defaultTransactions,
  filters: {
    type: 'all',
    category: 'all',
    search: '',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: '',
    groupBy: 'none',
  },
  sort: { key: 'date', direction: 'desc' },
  draft: { date: '', amount: '', category: '', type: 'expense', note: '' },
  editingId: null,
}
