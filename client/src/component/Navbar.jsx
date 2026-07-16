import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const links = [
    { path: '/',       label: 'Store',   icon: '🏪' },
    { path: '/cart',   label: 'Cart',    icon: '🛒' },
    { path: '/orders', label: 'Orders',  icon: '📦' },
    { path: '/profile',label: 'Profile', icon: '👤' },
  ];

  return (
    <nav style={{
      background: 'hsla(240, 13%, 8%, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid hsla(248, 50%, 70%, 0.1)',
      padding: '0 28px',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '12px',
          background: 'linear-gradient(135deg, hsl(248,89%,66%), hsl(270,80%,68%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 900, color: '#fff', fontSize: 20,
          boxShadow: '0 4px 14px hsla(248,89%,66%,0.4)',
        }}>S</div>
        <span style={{
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 800, fontSize: 22,
          color: 'hsl(220,25%,94%)',
          letterSpacing: '-0.02em',
        }}>
          Shop<span style={{ color: 'hsl(248,89%,70%)' }}>EZ</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {links.map(({ path, label, icon }) => (
          <Link key={path} to={path} style={{
            padding: '8px 18px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.2s',
            background: isActive(path) ? 'hsla(248,89%,66%,0.12)' : 'transparent',
            color: isActive(path) ? 'hsl(248,89%,72%)' : 'hsl(220,15%,58%)',
            borderBottom: isActive(path) ? '2px solid hsl(248,89%,66%)' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 15 }}>{icon}</span> {label}
          </Link>
        ))}
        {user?.role === 'admin' && (
          <Link to="/admin" style={{
            padding: '8px 18px', borderRadius: '10px', textDecoration: 'none',
            fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
            background: isActive('/admin') ? 'hsla(38,95%,55%,0.12)' : 'transparent',
            color: isActive('/admin') ? 'hsl(38,95%,60%)' : 'hsl(220,15%,58%)',
            borderBottom: isActive('/admin') ? '2px solid hsl(38,95%,55%)' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>⚙️</span> Admin
          </Link>
        )}
      </div>

      {/* User + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, hsl(248,89%,66%), hsl(270,80%,68%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 700, color: '#fff', fontSize: 15,
          border: '2px solid hsla(248,89%,70%,0.3)',
        }}>{user?.name?.[0]?.toUpperCase()}</div>
        <span style={{ fontSize: 14, color: 'hsl(220,25%,80%)', fontWeight: 500 }}>
          {user?.name?.split(' ')[0]}
        </span>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
