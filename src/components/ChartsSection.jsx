import { formatCurrency } from '../utils/formatters'

function SimpleBarChart({ data, valueKey, labelKey, className }) {
  const maxValue = Math.max(...data.map((item) => item[valueKey]), 1)

  return (
    <div className="chart-bars">
      {data.map((item) => (
        <div key={item[labelKey]} className="bar-wrap" title={`${item[labelKey]}: ${formatCurrency(item[valueKey])}`}>
          <div className={`bar ${className}`} style={{ height: `${(item[valueKey] / maxValue) * 100}%` }} />
          <span>{item[labelKey]}</span>
        </div>
      ))}
    </div>
  )
}

export function ChartsSection({ monthlyTrend, categorySpend }) {
  return (
    <section className="charts-grid">
      <article className="panel">
        <h3>Balance Trend</h3>
        {monthlyTrend.length ? (
          <SimpleBarChart data={monthlyTrend} valueKey="balance" labelKey="label" className="trend" />
        ) : (
          <p className="empty">No data available for trend chart.</p>
        )}
      </article>

      <article className="panel">
        <h3>Spending Breakdown</h3>
        {categorySpend.length ? (
          <SimpleBarChart data={categorySpend} valueKey="amount" labelKey="category" className="category" />
        ) : (
          <p className="empty">No expenses yet. Add an expense to view breakdown.</p>
        )}
      </article>
    </section>
  )
}
