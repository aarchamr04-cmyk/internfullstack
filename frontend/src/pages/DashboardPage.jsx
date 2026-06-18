import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const stats = [
    { label: 'Total Tasks', value: '—', icon: 'list' },
    { label: 'Completed',   value: '—', icon: 'check' },
    { label: 'Pending',     value: '—', icon: 'clock' },
    { label: 'High Priority', value: '—', icon: 'alert' },
  ];

  return (
    <div className="dash-page">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <div className="dash-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span>TaskFlow</span>
        </div>

        <nav className="dash-nav">
          <Link to="/dashboard" className="dash-nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </Link>
          <Link to="/tasks" className="dash-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            My Tasks
          </Link>
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user">
            <Link to="/profile" className="dash-avatar" style={{ textDecoration: 'none' }}>{user?.name?.[0]?.toUpperCase() || '?'}</Link>
            <div className="dash-user-info">
              <div className="dash-user-name">{user?.name || 'User'}</div>
              <div className="dash-user-email">{user?.email || ''}</div>
            </div>
          </div>
          <button className="dash-logout" onClick={handleLogout} title="Sign out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <header className="dash-header">
          <div>
            <h1 className="dash-greeting">Good morning, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
            <p className="dash-subtitle">Here&apos;s what&apos;s on your plate today.</p>
          </div>
          <Link to="/tasks" className="dash-cta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Task
          </Link>
        </header>

        {/* Stats grid */}
        <div className="dash-stats">
          {stats.map((s) => (
            <div key={s.label} className="dash-stat-card">
              <div className="dash-stat-icon">
                {s.icon === 'list'  && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
                {s.icon === 'check' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                {s.icon === 'clock' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                {s.icon === 'alert' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
              </div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick link */}
        <div className="dash-quick-link">
          <div className="dash-quick-link-text">
            <h3>Ready to get things done?</h3>
            <p>Head to your task board to manage, edit, and track all your tasks.</p>
          </div>
          <Link to="/tasks" className="dash-cta">Go to Tasks →</Link>
        </div>
      </main>
    </div>
  );
}
