import { formatCurrency } from '../utils/formatters'

function UtilizationBar({ value }) {
  const safeValue = Math.max(0, Math.min(value, 140))
  return (
    <div className="util-bar">
      <span
        className={`util-fill ${value > 100 ? 'over' : value > 80 ? 'warn' : 'good'}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
}

export function GovernanceSection({ budgetOverview, riskAlerts, executiveKpis }) {
  return (
    <section className="panel governance-panel">
      <div className="section-head">
        <h3>Governance & Risk</h3>
        <p className="governance-note">Budget cycle: {budgetOverview.monthLabel}</p>
      </div>

      <div className="kpi-grid">
        <article>
          <p>Transactions</p>
          <strong>{executiveKpis.transactionCount}</strong>
        </article>
        <article>
          <p>Avg Transaction</p>
          <strong>{formatCurrency(executiveKpis.avgTransactionValue)}</strong>
        </article>
        <article>
          <p>Active Categories</p>
          <strong>{executiveKpis.activeCategories}</strong>
        </article>
        <article>
          <p>Monthly Burn</p>
          <strong>{formatCurrency(executiveKpis.monthlyBurnRate)}</strong>
        </article>
      </div>

      <div className="budget-table-wrap">
        <table className="budget-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget vs Actual</th>
              <th>Utilization</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {budgetOverview.rows.map((row) => (
              <tr key={row.category}>
                <td>{row.category}</td>
                <td>{row.label}</td>
                <td>
                  <div className="util-cell">
                    <UtilizationBar value={row.utilization} />
                    <small>{Math.round(row.utilization)}%</small>
                  </div>
                </td>
                <td className={row.remaining < 0 ? 'negative' : 'positive'}>{formatCurrency(row.remaining)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="risk-list">
        {riskAlerts.map((alert) => (
          <article key={alert.title} className={`risk-item ${alert.level}`}>
            <p>{alert.title}</p>
            <strong>{alert.detail}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
