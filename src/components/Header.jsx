export function Header({ role, darkMode, onRoleChange, onThemeToggle }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Financial Activity Dashboard</p>
        <h1>Capital Intelligence Console</h1>
        <p className="topbar-sub">A clean, decision-ready view of cash flow, spending behavior, and monthly momentum.</p>
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
