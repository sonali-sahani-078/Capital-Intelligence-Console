import { formatCurrency } from '../utils/formatters'

function formatRunway(months) {
  if (!Number.isFinite(months) || months <= 0) return 'At risk'
  if (months >= 24) return '24+ months'
  return `${months.toFixed(1)} months`
}

export function PlanningSection({ forecastMetrics, recurringTransactions, dataQuality }) {
  return (
    <section className="panel planning-panel">
      <div className="section-head">
        <h3>Planning & Data Quality</h3>
      </div>

      <div className="planning-grid">
        <article>
          <p>Average Monthly Expense</p>
          <strong>{formatCurrency(forecastMetrics.avgMonthlyExpense)}</strong>
        </article>
        <article>
          <p>Projected Next Month Spend</p>
          <strong>{formatCurrency(forecastMetrics.projectedNextMonthExpense)}</strong>
        </article>
        <article>
          <p>Cash Runway</p>
          <strong>{formatRunway(forecastMetrics.runwayMonths)}</strong>
        </article>
        <article>
          <p>Data Quality Score</p>
          <strong>{dataQuality.score}/100</strong>
        </article>
      </div>

      <div className="planning-lists">
        <article>
          <p className="list-head">Recurring Expense Signals</p>
          {!recurringTransactions.length ? (
            <small className="empty">No recurring expense patterns yet.</small>
          ) : (
            <ul>
              {recurringTransactions.slice(0, 4).map((item) => (
                <li key={item.category}>
                  <span>{item.category}</span>
                  <strong>
                    {item.count}x | Avg {formatCurrency(item.averageAmount)}
                  </strong>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article>
          <p className="list-head">Data Quality Exceptions</p>
          <ul>
            <li>
              <span>Missing notes</span>
              <strong>{dataQuality.missingNote}</strong>
            </li>
            <li>
              <span>Uncategorized records</span>
              <strong>{dataQuality.uncategorized}</strong>
            </li>
            <li>
              <span>Invalid amounts</span>
              <strong>{dataQuality.invalidAmount}</strong>
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}
