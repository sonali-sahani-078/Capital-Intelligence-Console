export function InsightsSection({ insights }) {
  return (
    <section className="panel insights">
      <h3>Insights</h3>
      {!insights ? (
        <p className="empty">Add transactions to unlock insights.</p>
      ) : (
        <div className="insight-grid">
          <article>
            <p>Highest Spending Category</p>
            <strong>{insights.topCategory}</strong>
          </article>
          <article>
            <p>Monthly Comparison</p>
            <strong>{insights.comparison}</strong>
          </article>
          <article>
            <p>Observation</p>
            <strong>{insights.observation}</strong>
          </article>
        </div>
      )}
    </section>
  )
}
