import { TitleWordmark } from './TitleWordmark'

function getSyncMeta(syncStatus) {
  if (syncStatus === 'synced') return { label: 'Synced', tone: 'good' }
  if (syncStatus === 'syncing') return { label: 'Syncing', tone: 'warn' }
  if (syncStatus === 'error') return { label: 'Sync error', tone: 'risk' }
  return { label: 'Idle', tone: 'neutral' }
}

export function Header({ role, darkMode, syncStatus, totalTransactions, onRoleChange, onThemeToggle }) {
  const syncMeta = getSyncMeta(syncStatus)
  const refreshLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Financial Activity Dashboard</p>
        <div className="title-wordmark">
          <TitleWordmark />
        </div>
        <p className="topbar-sub">A clean, decision-ready view of cash flow, spending behavior, and monthly momentum.</p>
        <div className="topbar-meta">
          <span className={`status-pill ${syncMeta.tone}`}>System: {syncMeta.label}</span>
          <span className="status-pill neutral">Records: {totalTransactions}</span>
          <span className="status-pill neutral">Refreshed: {refreshLabel}</span>
        </div>
      </div>
      <div className="topbar-actions">
        <label>
          Role
          <select value={role} onChange={(e) => onRoleChange(e.target.value)}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="theme-toggle-wrap" htmlFor="theme-toggle">
          Theme
          <button
            id="theme-toggle"
            type="button"
            className={`theme-toggle ${darkMode ? 'on' : 'off'}`}
            onClick={onThemeToggle}
            role="switch"
            aria-checked={darkMode}
            aria-label="Toggle dark mode"
          >
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
            <span className="toggle-text">{darkMode ? 'Dark' : 'Light'}</span>
          </button>
        </label>
      </div>
    </header>
  )
}
