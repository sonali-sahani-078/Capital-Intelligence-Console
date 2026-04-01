import { formatCurrency } from '../utils/formatters'

export function SummaryCards({ summary }) {
  return (
    <section className="summary-grid">
      <article className="card">
        <p>Total Balance</p>
        <h2>{formatCurrency(summary.balance)}</h2>
      </article>
      <article className="card">
        <p>Income</p>
        <h2>{formatCurrency(summary.income)}</h2>
      </article>
      <article className="card">
        <p>Expenses</p>
        <h2>{formatCurrency(summary.expenses)}</h2>
      </article>
    </section>
  )
}
