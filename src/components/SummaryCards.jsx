import { formatCurrency } from '../utils/formatters'

function formatPercent(value) {
  return `${Math.round(value)}%`
}

export function SummaryCards({ summary }) {
  const savingsRate = summary.income > 0 ? (summary.balance / summary.income) * 100 : 0
  const spendLoad = summary.income > 0 ? (summary.expenses / summary.income) * 100 : 0
  const healthLabel = summary.balance >= 0 ? 'Healthy cash flow' : 'Negative cash flow'

  return (
    <section className="summary-grid">
      <article className="card metric-card">
        <p>Total Balance</p>
        <h2>{formatCurrency(summary.balance)}</h2>
        <small className={`metric-chip ${summary.balance >= 0 ? 'good' : 'risk'}`}>{healthLabel}</small>
      </article>
      <article className="card metric-card">
        <p>Income</p>
        <h2>{formatCurrency(summary.income)}</h2>
        <small className="metric-chip neutral">Savings Rate: {formatPercent(savingsRate)}</small>
      </article>
      <article className="card metric-card">
        <p>Expenses</p>
        <h2>{formatCurrency(summary.expenses)}</h2>
        <small className="metric-chip neutral">Expense Load: {formatPercent(spendLoad)}</small>
      </article>
    </section>
  )
}
