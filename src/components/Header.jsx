export function Header({ role, darkMode, onRoleChange, onThemeToggle }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Financial Activity Dashboard</p>
        <h1>Money Flow Monitor</h1>
      </div>
      <div className="topbar-actions">
        <label>
          Role
          <select value={role} onChange={(e) => onRoleChange(e.target.value)}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button className="ghost" onClick={onThemeToggle}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </header>
  )
}
