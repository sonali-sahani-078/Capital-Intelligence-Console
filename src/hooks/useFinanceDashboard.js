import { useEffect, useMemo, useReducer } from 'react'
import { STORAGE_KEY, defaultState } from '../data/initialData'
import { financeReducer } from '../utils/reducer'
import {
  getCategorySpend,
  getFilteredTransactions,
  getInsights,
  getMonthlyTrend,
  getSummary,
} from '../utils/selectors'
import { formatCurrency } from '../utils/formatters'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    return {
      ...defaultState,
      ...parsed,
      filters: { ...defaultState.filters, ...(parsed.filters || {}) },
      sort: { ...defaultState.sort, ...(parsed.sort || {}) },
      draft: defaultState.draft,
      editingId: null,
    }
  } catch {
    return defaultState
  }
}

export function useFinanceDashboard() {
  const [state, dispatch] = useReducer(financeReducer, defaultState, loadState)

  useEffect(() => {
    document.body.dataset.theme = state.darkMode ? 'dark' : 'light'
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        role: state.role,
        darkMode: state.darkMode,
        transactions: state.transactions,
        filters: state.filters,
        sort: state.sort,
      }),
    )
  }, [state])

  const categories = useMemo(
    () => ['all', ...new Set(state.transactions.map((item) => item.category))],
    [state.transactions],
  )
  const summary = useMemo(() => getSummary(state.transactions), [state.transactions])
  const filteredTransactions = useMemo(
    () => getFilteredTransactions(state.transactions, state.filters, state.sort),
    [state.transactions, state.filters, state.sort],
  )
  const monthlyTrend = useMemo(() => getMonthlyTrend(state.transactions), [state.transactions])
  const categorySpend = useMemo(() => getCategorySpend(state.transactions), [state.transactions])
  const insights = useMemo(
    () => getInsights(state.transactions, categorySpend, formatCurrency),
    [state.transactions, categorySpend],
  )

  return {
    state,
    dispatch,
    categories,
    summary,
    filteredTransactions,
    monthlyTrend,
    categorySpend,
    insights,
  }
}
