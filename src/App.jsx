import './App.css'
import { ChartsSection } from './components/ChartsSection'
import { GovernanceSection } from './components/GovernanceSection'
import { Header } from './components/Header'
import { InsightsSection } from './components/InsightsSection'
import { PlanningSection } from './components/PlanningSection'
import { SummaryCards } from './components/SummaryCards'
import { TransactionsSection } from './components/TransactionsSection'
import { useFinanceDashboardContext } from './context/FinanceDashboardContext'

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
    executiveKpis,
    budgetOverview,
    riskAlerts,
    forecastMetrics,
    recurringTransactions,
    dataQuality,
    insights,
    isLoading,
    syncStatus,
  } = useFinanceDashboardContext()

  return (
    <div className="app-shell">
      <Header
        role={state.role}
        darkMode={state.darkMode}
        syncStatus={syncStatus}
        totalTransactions={state.transactions.length}
        onRoleChange={(role) => dispatch({ type: 'setRole', role })}
        onThemeToggle={() => dispatch({ type: 'toggleDark' })}
      />
      <SummaryCards summary={summary} />
      <ChartsSection monthlyTrend={monthlyTrend} categorySpend={categorySpend} />
      <GovernanceSection budgetOverview={budgetOverview} riskAlerts={riskAlerts} executiveKpis={executiveKpis} />
      <PlanningSection
        forecastMetrics={forecastMetrics}
        recurringTransactions={recurringTransactions}
        dataQuality={dataQuality}
      />
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
