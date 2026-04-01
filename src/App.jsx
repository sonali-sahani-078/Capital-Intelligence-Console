import './App.css'
import { ChartsSection } from './components/ChartsSection'
import { Header } from './components/Header'
import { InsightsSection } from './components/InsightsSection'
import { SummaryCards } from './components/SummaryCards'
import { TransactionsSection } from './components/TransactionsSection'
import { useFinanceDashboard } from './hooks/useFinanceDashboard'

function App() {
  const {
    state,
    dispatch,
    categories,
    summary,
    filteredTransactions,
    groupedTransactions,
    monthlyTrend,
    categorySpend,
    insights,
    isLoading,
    syncStatus,
  } = useFinanceDashboard()

  return (
    <div className="app-shell">
      <Header
        role={state.role}
        darkMode={state.darkMode}
        onRoleChange={(role) => dispatch({ type: 'setRole', role })}
        onThemeToggle={() => dispatch({ type: 'toggleDark' })}
      />
      <SummaryCards summary={summary} />
      <ChartsSection monthlyTrend={monthlyTrend} categorySpend={categorySpend} />
      <TransactionsSection
        state={state}
        categories={categories}
        transactions={filteredTransactions}
        groupedTransactions={groupedTransactions}
        dispatch={dispatch}
        isLoading={isLoading}
        syncStatus={syncStatus}
      />
      <InsightsSection insights={insights} />
    </div>
  )
}

export default App
