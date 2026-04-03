# Capital Intelligence Console

A React + Vite financial operations dashboard for tracking transactions, governance metrics, planning signals, and executive insights in one place.

## Highlights

- Executive summary cards for balance, income, and expenses.
- Monthly trend and category spend visualizations.
- Governance panel with KPI snapshots, budget overview, and risk alerts.
- Planning panel with forecast metrics, recurring transaction patterns, and data quality checks.
- Transactions workspace with:
  - Search and advanced filters (type, category, date range, amount range).
  - Grouping (category, month, type) and sortable columns.
  - CSV and JSON export.
  - Quick search shortcut using `/`.
- Simulated role-based access:
  - `viewer`: read-only dashboard access.
  - `admin`: add/edit transactions inline.
- Light/dark theme toggle and local persistence.
- Mock API sync status indicators (`idle`, `syncing`, `synced`, `error`).

## Tech Stack

- React 19
- Vite 8
- ESLint 9

## Getting Started

```bash
npm install
npm run dev
```

App runs locally with Vite's development server.

## Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build in `dist/`
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint checks

## Project Structure

- `src/App.jsx` - page composition and section orchestration.
- `src/hooks/useFinanceDashboard.js` - reducer-driven state, derived data, local storage, and mock API sync.
- `src/components/` - UI sections:
  - `Header.jsx`
  - `SummaryCards.jsx`
  - `ChartsSection.jsx`
  - `GovernanceSection.jsx`
  - `PlanningSection.jsx`
  - `TransactionsSection.jsx`
  - `InsightsSection.jsx`
- `src/utils/` - reducer, selectors, formatters, exporters.
- `src/api/mockApi.js` - mocked fetch/save behavior.
- `src/data/initialData.js` - seeded transactions and default app state.

## Data and Persistence

- Default seeded transactions are loaded from `src/data/initialData.js`.
- Dashboard state is persisted in local storage under:
  - `finance-dashboard-state-v1`
- Currency formatting currently uses `en-US` locale and USD style.
