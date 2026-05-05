import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { merchant, logout } = useAuth();
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">⚡ AfriPayXLM</div>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/payments" className={({ isActive }) => isActive ? 'active' : ''}>Payments</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>Settings</NavLink>
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{merchant?.name}</div>
          <button className="btn btn-outline" style={{ width: '100%' }} onClick={logout}>Logout</button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
