import { formatCurrency } from '../utils/formatters'

export function TransactionsSection({ state, categories, transactions, dispatch }) {
  return (
    <section className="panel">
      <div className="section-head">
        <h3>Transactions</h3>
        <div className="controls">
          <input
            type="search"
            placeholder="Search by category, note, amount"
            value={state.filters.search}
            onChange={(e) => dispatch({ type: 'setFilter', key: 'search', value: e.target.value })}
          />
          <select value={state.filters.type} onChange={(e) => dispatch({ type: 'setFilter', key: 'type', value: e.target.value })}>
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={state.filters.category}
            onChange={(e) => dispatch({ type: 'setFilter', key: 'category', value: e.target.value })}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.role === 'admin' && (
        <div className="editor">
          <input type="date" value={state.draft.date} onChange={(e) => dispatch({ type: 'setDraft', key: 'date', value: e.target.value })} />
          <input
            type="number"
            min="1"
            placeholder="Amount"
            value={state.draft.amount}
            onChange={(e) => dispatch({ type: 'setDraft', key: 'amount', value: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            value={state.draft.category}
            onChange={(e) => dispatch({ type: 'setDraft', key: 'category', value: e.target.value })}
          />
          <select value={state.draft.type} onChange={(e) => dispatch({ type: 'setDraft', key: 'type', value: e.target.value })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="text"
            placeholder="Optional note"
            value={state.draft.note}
            onChange={(e) => dispatch({ type: 'setDraft', key: 'note', value: e.target.value })}
          />
          <button onClick={() => dispatch({ type: 'saveDraft' })}>{state.editingId ? 'Save Edit' : 'Add Transaction'}</button>
          {state.editingId && (
            <button className="ghost" onClick={() => dispatch({ type: 'cancelEdit' })}>
              Cancel
            </button>
          )}
        </div>
      )}

      {!transactions.length ? (
        <p className="empty">No transactions match your filters.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th><button className="sort" onClick={() => dispatch({ type: 'setSort', key: 'date' })}>Date</button></th>
                <th><button className="sort" onClick={() => dispatch({ type: 'setSort', key: 'amount' })}>Amount</button></th>
                <th><button className="sort" onClick={() => dispatch({ type: 'setSort', key: 'category' })}>Category</button></th>
                <th><button className="sort" onClick={() => dispatch({ type: 'setSort', key: 'type' })}>Type</button></th>
                <th>Note</th>
                {state.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td className={tx.type === 'expense' ? 'negative' : 'positive'}>
                    {tx.type === 'expense' ? '-' : '+'}
                    {formatCurrency(tx.amount)}
                  </td>
                  <td>{tx.category}</td>
                  <td><span className={`pill ${tx.type}`}>{tx.type}</span></td>
                  <td>{tx.note || '-'}</td>
                  {state.role === 'admin' && (
                    <td>
                      <button className="ghost" onClick={() => dispatch({ type: 'startEdit', id: tx.id })}>Edit</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
