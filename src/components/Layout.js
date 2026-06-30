import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiArrowDownCircle, FiArrowUpCircle, FiRepeat,
  FiList, FiUser, FiBell, FiLogOut, FiMenu, FiX, FiMoon, FiSun,
  FiShield, FiUsers, FiAlertCircle, FiRadio, FiChevronRight,
} from 'react-icons/fi';

const NavItem = ({ to, icon, label, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px', borderRadius: 12,
      textDecoration: 'none', position: 'relative',
      background: active ? 'linear-gradient(135deg, rgba(0,230,168,0.14), rgba(139,124,246,0.07))' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      transition: 'var(--transition)', fontSize: 14, fontWeight: active ? 600 : 500,
    }}>
      {active && <span style={{ position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)', width: 3, height: 18, borderRadius: 3, background: 'var(--accent)' }} />}
      <span style={{ fontSize: 18, display: 'flex' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {active && <FiChevronRight size={14} style={{ opacity: 0.6 }} />}
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
    { to: '/admin/announce', icon: <FiRadio />, label: 'Announcements' },
  ];
  const navItems = isAdmin ? adminNav : userNav;

  const Sidebar = ({ mobile }) => (
    <aside style={{
      width: 264, height: '100vh', background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      position: mobile ? 'fixed' : 'sticky', top: 0, left: 0, zIndex: mobile ? 200 : 1,
      padding: '26px 14px',
    }}>
      <div style={{ padding: '0 8px 28px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: 'linear-gradient(135deg, #00e6a8, #8b7cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: '#04140f', flexShrink: 0,
          boxShadow: '0 4px 16px rgba(0,230,168,0.3)',
        }}>N</div>
        <div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', letterSpacing: -0.3 }}>NexVault</div>
          <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: -2, fontWeight: 500, letterSpacing: 0.2 }}>{isAdmin ? 'ADMIN CONSOLE' : 'USDT WALLET'}</div>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 20 }}>
            <FiX />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, paddingLeft: 4 }}>
        {navItems.map(item => (
          <NavItem key={item.to} {...item} onClick={mobile ? () => setSidebarOpen(false) : undefined} />
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 12, background: 'var(--bg-card)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00e6a8, #8b7cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#04140f', flexShrink: 0,
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleTheme} style={{
            flex: 1, padding: '10px', borderRadius: 10, background: 'var(--bg-card)',
            border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'var(--transition)',
          }}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <button onClick={handleLogout} style={{
            flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,92,114,0.08)',
            border: '1px solid rgba(255,92,114,0.18)', color: 'var(--danger)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'var(--transition)',
          }}>
            <FiLogOut />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ display: 'none' }} className="desktop-sidebar"><Sidebar /></div>
      <style>{`
        @media (min-width: 768px) { .desktop-sidebar { display: block !important; } .mobile-header { display: none !important; } }
        @media (max-width: 767px) { .desktop-sidebar { display: none !important; } }
      `}</style>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 150, backdropFilter: 'blur(2px)' }} />}
      {sidebarOpen && <Sidebar mobile />}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header className="mobile-header" style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 22 }}>
            <FiMenu />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #00e6a8, #8b7cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#04140f' }}>N</div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>NexVault</span>
          </div>
          {!isAdmin && (
            <div style={{ marginLeft: 'auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 14px', fontSize: 13, fontWeight: 700, color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>
              ${user?.balance?.toFixed(2) || '0.00'}
            </div>
          )}
        </header>
        <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
