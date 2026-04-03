import { createContext, useContext } from 'react'
import { useFinanceDashboard } from '../hooks/useFinanceDashboard'

const FinanceDashboardContext = createContext(null)

export function FinanceDashboardProvider({ children }) {
  const dashboard = useFinanceDashboard()

  return <FinanceDashboardContext.Provider value={dashboard}>{children}</FinanceDashboardContext.Provider>
}

export function useFinanceDashboardContext() {
  const context = useContext(FinanceDashboardContext)
  if (!context) {
    throw new Error('useFinanceDashboardContext must be used within FinanceDashboardProvider')
  }
  return context
}
