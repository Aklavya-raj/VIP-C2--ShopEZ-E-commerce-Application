import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: '#111827',
      borderBottom: '1px solid #1e293b',
      padding: '0 24px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, color: '#fff', fontSize: 16
        }}>S</div>
        <span style={{ fontWeight: 800, fontSize: 20, color: '#e2e8f0' }}>Shop<span style={{ color: '#6c63ff' }}>EZ</span></span>
      </Link>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {[{ path: '/', label: '🏪 Store' }, { path: '/cart', label: '🛒 Cart' }, { path: '/orders', label: '📦 Orders' }, { path: '/profile', label: '👤 Profile' }].map(({ path, label }) => (
          <Link key={path} to={path} style={{
            padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
            fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
            background: isActive(path) ? 'rgba(108,99,255,0.15)' : 'transparent',
            color: isActive(path) ? '#6c63ff' : '#94a3b8'
          }}>{label}</Link>
        ))}
        {user?.role === 'admin' && (
          <Link to="/admin" style={{
            padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
            fontSize: 14, fontWeight: 500,
            background: isActive('/admin') ? 'rgba(245,158,11,0.15)' : 'transparent',
            color: isActive('/admin') ? '#f59e0b' : '#94a3b8'
          }}>⚙️ Admin</Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, color: '#fff', fontSize: 14
        }}>{user?.name?.[0]?.toUpperCase()}</div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
