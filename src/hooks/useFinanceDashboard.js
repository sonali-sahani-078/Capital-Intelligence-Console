import { useEffect, useMemo, useReducer, useState } from 'react'
import { STORAGE_KEY, defaultState } from '../data/initialData'
import { fetchTransactions, saveTransactions } from '../api/mockApi'
import { financeReducer } from '../utils/reducer'
import {
  getCategorySpend,
  getFilteredTransactions,
  getGroupedTransactions,
  getInsights,
  getMonthlyTrend,
  getExecutiveKpis,
  getBudgetOverview,
  getRiskAlerts,
  getForecastMetrics,
  getRecurringTransactions,
  getDataQuality,
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
  const [isLoading, setIsLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState('idle')

  useEffect(() => {
    document.body.dataset.theme = state.darkMode ? 'dark' : 'light'
  }, [state.darkMode])

  useEffect(() => {
    setIsLoading(true)
    fetchTransactions()
      .then((transactions) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          dispatch({ type: 'setTransactions', transactions })
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
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

    setSyncStatus('syncing')
    const timer = setTimeout(() => {
      saveTransactions(state.transactions)
        .then(() => setSyncStatus('synced'))
        .catch(() => setSyncStatus('error'))
    }, 280)

    return () => clearTimeout(timer)
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
  const groupedTransactions = useMemo(
    () => getGroupedTransactions(filteredTransactions, state.filters.groupBy),
    [filteredTransactions, state.filters.groupBy],
  )
  const monthlyTrend = useMemo(() => getMonthlyTrend(state.transactions), [state.transactions])
  const categorySpend = useMemo(() => getCategorySpend(state.transactions), [state.transactions])
  const executiveKpis = useMemo(() => getExecutiveKpis(state.transactions), [state.transactions])
  const budgetOverview = useMemo(() => getBudgetOverview(state.transactions, formatCurrency), [state.transactions])
  const insights = useMemo(
    () => getInsights(state.transactions, categorySpend, formatCurrency),
    [state.transactions, categorySpend],
  )
  const riskAlerts = useMemo(
    () => getRiskAlerts(state.transactions, summary, budgetOverview, formatCurrency),
    [state.transactions, summary, budgetOverview],
  )
  const forecastMetrics = useMemo(() => getForecastMetrics(state.transactions), [state.transactions])
  const recurringTransactions = useMemo(() => getRecurringTransactions(state.transactions), [state.transactions])
  const dataQuality = useMemo(() => getDataQuality(state.transactions), [state.transactions])

  return {
    state,
    dispatch,
    categories,
    summary,
    filteredTransactions,
    groupedTransactions,
    monthlyTrend,
    categorySpend,
    executiveKpis,
    budgetOverview,
    riskAlerts,
    forecastMetrics,
    recurringTransactions,
    dataQuality,
    insights,
    isLoading,
    syncStatus,
  }
}
