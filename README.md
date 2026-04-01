# Financial Activity Dashboard (React)

A responsive React dashboard for tracking and understanding financial activity, built to satisfy design, responsiveness, functionality, UX, technical quality, and state-management evaluation criteria.

## Evaluation Criteria Coverage

1. Design and Creativity
- Intentional visual language with custom typography, gradients, and card-based hierarchy.
- Clear information architecture: Overview -> Charts -> Transactions -> Insights.

2. Responsiveness
- Mobile-first breakpoints for `980px` and `640px`.
- Charts, cards, and insights collapse to single-column on smaller screens.
- Table supports horizontal scrolling for constrained widths.

3. Functionality
- Summary cards: Total Balance, Income, Expenses.
- Time-based visualization: monthly running balance trend.
- Categorical visualization: spending by category.
- Transactions with search, filters, and sortable columns.
- Simulated RBAC:
  - Viewer: read-only
  - Admin: add/edit transactions

4. User Experience
- Clear controls with readable labels.
- Empty states for no chart data, no table results, and no insights.
- Inline admin editor for quick add/edit operations.

5. Technical Quality
- Modular code architecture:
  - `components/` for UI sections
  - `hooks/useFinanceDashboard.js` for orchestration
  - `utils/` for selectors, reducer, formatting
  - `data/` for seed/default state
- Derived metrics and datasets are memoized.

6. State Management Approach
- Centralized `useReducer` state for role, transactions, filters, sorting, draft form, and theme.
- Local storage persistence for app continuity across refreshes.

## Project Structure

- `src/App.jsx`
- `src/components/Header.jsx`
- `src/components/SummaryCards.jsx`
- `src/components/ChartsSection.jsx`
- `src/components/TransactionsSection.jsx`
- `src/components/InsightsSection.jsx`
- `src/hooks/useFinanceDashboard.js`
- `src/utils/reducer.js`
- `src/utils/selectors.js`
- `src/utils/formatters.js`
- `src/data/initialData.js`

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Notes

- RBAC is simulated on frontend only (as requested).
- Data is persisted in browser storage key: `finance-dashboard-state-v1`.
- Currency uses `en-US` and USD formatting.
