import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FinanceDashboardProvider } from './context/FinanceDashboardContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FinanceDashboardProvider>
      <App />
    </FinanceDashboardProvider>
  </StrictMode>,
)
