import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiArrowDownCircle, FiArrowUpCircle, FiRepeat,
  FiList, FiUser, FiBell, FiLogOut, FiMenu, FiX, FiMoon, FiSun,
  FiShield, FiUsers, FiAlertCircle, FiMessageSquare
} from 'react-icons/fi';

const NavItem = ({ to, icon, label, badge, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', borderRadius: 12, textDecoration: 'none',
      background: active ? 'linear-gradient(135deg, rgba(0,212,163,0.12), rgba(124,110,247,0.08))' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
      transition: 'var(--transition)', fontSize: 14, fontWeight: active ? 600 : 400,
      position: 'relative'
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span style={{
          background: 'var(--danger)', color: 'white', borderRadius: 10,
          padding: '1px 7px', fontSize: 11, fontWeight: 700
        }}>{badge}</span>
      )}
    </Link>
  );
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const userNav = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/deposit', icon: <FiArrowDownCircle />, label: 'Deposit' },
    { to: '/withdraw', icon: <FiArrowUpCircle />, label: 'Withdraw' },
    { to: '/transfer', icon: <FiRepeat />, label: 'Transfer' },
    { to: '/transactions', icon: <FiList />, label: 'Transactions' },
    { to: '/notifications', icon: <FiBell />, label: 'Notifications' },
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
  ];
  const adminNav = [
    { to: '/admin', icon: <FiShield />, label: 'Dashboard' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { to: '/admin/transactions', icon: <FiList />, label: 'Transactions' },
    { to: '/admin/pending', icon: <FiAlertCircle />, label: 'Pending Approvals' },
    { to: '/admin/announce', icon: <FiMessageSquare />, label: 'Announcements' },
  ];
  const navItems = isAdmin ? adminNav : userNav;

  const Sidebar = ({ mobile }) => (
    <aside style={{
      width: 260, height: '100vh', background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      position: mobile ? 'fixed' : 'sticky', top: 0, left: 0, zIndex: mobile ? 200 : 1,
      padding: '24px 12px', gap: 4
    }}>
      {/* Logo */}
      <div style={{ padding: '0 4px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 800, color: '#0d1117', flexShrink: 0
        }}>N</div>
        <div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>NexVault</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: -2 }}>{isAdmin ? 'Admin Panel' : 'USDT Wallet'}</div>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 20 }}>
            <FiX />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => (
          <NavItem key={item.to} {...item} onClick={mobile ? () => setSidebarOpen(false) : undefined} />
        ))}
      </nav>

      {/* User info */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#0d1117', flexShrink: 0
          }}>
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '0 4px' }}>
          <button onClick={toggleTheme} style={{
            flex: 1, padding: '8px', borderRadius: 8, background: 'var(--bg-card)',
            border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'var(--transition)'
          }}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <button onClick={handleLogout} style={{
            flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(255,71,87,0.1)',
            border: '1px solid rgba(255,71,87,0.2)', color: 'var(--danger)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'var(--transition)'
          }}>
            <FiLogOut />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <div style={{ display: 'none' }} className="desktop-sidebar">
        <Sidebar />
      </div>
      <style>{`
        @media (min-width: 768px) { .desktop-sidebar { display: block !important; } .mobile-header { display: none !important; } }
        @media (max-width: 767px) { .desktop-sidebar { display: none !important; } }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 150
        }} />
      )}
      {sidebarOpen && <Sidebar mobile />}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile header */}
        <header className="mobile-header" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{
            background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 22
          }}>
            <FiMenu />
          </button>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18 }}>
            <span style={{ background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NexVault</span>
          </div>
          {!isAdmin && (
            <div style={{ marginLeft: 'auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
              ${user?.balance?.toFixed(2) || '0.00'}
            </div>
          )}
        </header>
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
