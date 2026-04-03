import { useEffect, useMemo, useRef } from 'react'
import { formatCurrency } from '../utils/formatters'
import { exportTransactionsAsCsv, exportTransactionsAsJson } from '../utils/exporters'

export function TransactionsSection({ state, categories, transactions, groupedTransactions, dispatch, isLoading, syncStatus }) {
  const searchRef = useRef(null)
  const activeFilters = useMemo(() => {
    const items = []
    if (state.filters.search) items.push(`Search: ${state.filters.search}`)
    if (state.filters.type !== 'all') items.push(`Type: ${state.filters.type}`)
    if (state.filters.category !== 'all') items.push(`Category: ${state.filters.category}`)
    if (state.filters.fromDate) items.push(`From: ${state.filters.fromDate}`)
    if (state.filters.toDate) items.push(`To: ${state.filters.toDate}`)
    if (state.filters.minAmount) items.push(`Min: ${state.filters.minAmount}`)
    if (state.filters.maxAmount) items.push(`Max: ${state.filters.maxAmount}`)
    if (state.filters.groupBy !== 'none') items.push(`Group: ${state.filters.groupBy}`)
    return items
  }, [state.filters])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target
        const tag = target?.tagName?.toLowerCase()
        if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
          event.preventDefault()
          searchRef.current?.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const sortArrow = state.sort.direction === 'asc' ? '↑' : '↓'

  return (
    <section className="panel">
      <div className="section-head">
        <h3>Transactions</h3>
        <div className="controls">
          <input
            ref={searchRef}
            type="search"
            placeholder="Search by category, note, amount (/)"
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
          <input
            type="date"
            value={state.filters.fromDate}
            onChange={(e) => dispatch({ type: 'setFilter', key: 'fromDate', value: e.target.value })}
            aria-label="From date"
          />
          <input
            type="date"
            value={state.filters.toDate}
            onChange={(e) => dispatch({ type: 'setFilter', key: 'toDate', value: e.target.value })}
            aria-label="To date"
          />
          <input
            type="number"
            min="0"
            placeholder="Min amount"
            value={state.filters.minAmount}
            onChange={(e) => dispatch({ type: 'setFilter', key: 'minAmount', value: e.target.value })}
          />
          <input
            type="number"
            min="0"
            placeholder="Max amount"
            value={state.filters.maxAmount}
            onChange={(e) => dispatch({ type: 'setFilter', key: 'maxAmount', value: e.target.value })}
          />
          <select
            value={state.filters.groupBy}
            onChange={(e) => dispatch({ type: 'setFilter', key: 'groupBy', value: e.target.value })}
            aria-label="Group by"
          >
            <option value="none">No grouping</option>
            <option value="category">Group by category</option>
            <option value="month">Group by month</option>
            <option value="type">Group by type</option>
          </select>
          <button className="ghost" onClick={() => dispatch({ type: 'resetFilters' })} disabled={!activeFilters.length}>
            Clear Filters
          </button>
          <button className="ghost" onClick={() => exportTransactionsAsCsv(transactions)}>Export CSV</button>
          <button className="ghost" onClick={() => exportTransactionsAsJson(transactions)}>Export JSON</button>
        </div>
      </div>

      <p className="status-line">
        {isLoading ? 'Loading mock API data...' : `API sync: ${syncStatus}`}
      </p>
      <div className="result-meta">
        <strong>{transactions.length}</strong> matching records
      </div>
      {!!activeFilters.length && (
        <div className="active-filters">
          {activeFilters.map((label) => (
            <span key={label} className="filter-chip">
              {label}
            </span>
          ))}
        </div>
      )}

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

      {!!groupedTransactions.length && (
        <div className="group-panel">
          {groupedTransactions.map((group) => (
            <article key={group.key}>
              <p>{group.label}</p>
              <strong>{group.count} txn</strong>
              <span>Income {formatCurrency(group.income)}</span>
              <span>Expenses {formatCurrency(group.expenses)}</span>
              <span>Net {formatCurrency(group.net)}</span>
            </article>
          ))}
        </div>
      )}

      {!transactions.length ? (
        <p className="empty">No transactions match your filters.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th><button className="sort" onClick={() => dispatch({ type: 'setSort', key: 'date' })}>Date {state.sort.key === 'date' ? sortArrow : ''}</button></th>
                <th><button className="sort" onClick={() => dispatch({ type: 'setSort', key: 'amount' })}>Amount {state.sort.key === 'amount' ? sortArrow : ''}</button></th>
                <th><button className="sort" onClick={() => dispatch({ type: 'setSort', key: 'category' })}>Category {state.sort.key === 'category' ? sortArrow : ''}</button></th>
                <th><button className="sort" onClick={() => dispatch({ type: 'setSort', key: 'type' })}>Type {state.sort.key === 'type' ? sortArrow : ''}</button></th>
                <th>Note</th>
                <th>Risk Flag</th>
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
                  <td>
                    {tx.type === 'expense' && tx.amount >= 1000 ? (
                      <span className="pill expense">High</span>
                    ) : (
                      <span className="pill income">Normal</span>
                    )}
                  </td>
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
