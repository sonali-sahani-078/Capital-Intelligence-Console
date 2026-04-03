import { defaultState } from '../data/initialData'

export function financeReducer(state, action) {
  switch (action.type) {
    case 'setRole':
      return { ...state, role: action.role }
    case 'toggleDark':
      return { ...state, darkMode: !state.darkMode }
    case 'setFilter':
      return { ...state, filters: { ...state.filters, [action.key]: action.value } }
    case 'resetFilters':
      return { ...state, filters: defaultState.filters }
    case 'setSort': {
      if (state.sort.key === action.key) {
        return {
          ...state,
          sort: { key: action.key, direction: state.sort.direction === 'asc' ? 'desc' : 'asc' },
        }
      }
      return { ...state, sort: { key: action.key, direction: 'asc' } }
    }
    case 'setDraft':
      return { ...state, draft: { ...state.draft, [action.key]: action.value } }
    case 'startEdit': {
      const tx = state.transactions.find((item) => item.id === action.id)
      if (!tx) return state
      return {
        ...state,
        editingId: action.id,
        draft: {
          date: tx.date,
          amount: String(tx.amount),
          category: tx.category,
          type: tx.type,
          note: tx.note || '',
        },
      }
    }
    case 'cancelEdit':
      return { ...state, editingId: null, draft: defaultState.draft }
    case 'saveDraft': {
      const amount = Number(state.draft.amount)
      if (!state.draft.date || !state.draft.category || Number.isNaN(amount) || amount <= 0) {
        return state
      }

      if (state.editingId) {
        return {
          ...state,
          editingId: null,
          draft: defaultState.draft,
          transactions: state.transactions.map((tx) =>
            tx.id === state.editingId
              ? {
                  ...tx,
                  date: state.draft.date,
                  amount,
                  category: state.draft.category,
                  type: state.draft.type,
                  note: state.draft.note,
                }
              : tx,
          ),
        }
      }

      const next = {
        id: `t-${Date.now()}`,
        date: state.draft.date,
        amount,
        category: state.draft.category,
        type: state.draft.type,
        note: state.draft.note,
      }
      return { ...state, transactions: [next, ...state.transactions], draft: defaultState.draft }
    }
    case 'setTransactions':
      return { ...state, transactions: action.transactions }
    default:
      return state
  }
}
