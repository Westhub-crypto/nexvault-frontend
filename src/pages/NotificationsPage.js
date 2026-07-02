import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { format } from 'date-fns';
import { FiBell, FiCheck, FiCheckCircle, FiArrowDownCircle, FiArrowUpCircle, FiRepeat, FiRadio, FiShield } from 'react-icons/fi';

const typeIcon = (type) => ({
  deposit: <FiArrowDownCircle />, withdrawal: <FiArrowUpCircle />, transfer: <FiRepeat />,
  activation: <FiCheckCircle />, announcement: <FiRadio />, security: <FiShield />, system: <FiBell />,
}[type] || <FiBell />);

const typeColor = (type) => ({
  deposit: '#00e6a8', withdrawal: '#8b7cf6', transfer: '#ffb547',
  activation: '#00e6a8', announcement: '#ff5c72', security: '#ffb547', system: '#94a3b8',
}[type] || '#94a3b8');

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const { data } = await api.get('/transactions/notifications');
      setNotifications(data.notifications);
      setUnread(data.unread);
    } catch (err) { console.error(err.message); }
    setLoading(false);
  };

  useEffect(() => { fetchNotifs(); }, []);

  const markRead = async (id) => {
    await api.put(`/transactions/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    setUnread(u => Math.max(0, u - 1));
  };

  const markAllRead = async () => {
    await api.put('/transactions/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnread(0);
  };

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 4, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 12 }}>
              Notifications
              {unread > 0 && <span style={{ padding: '3px 11px', borderRadius: 999, background: '#ff5c72', color: 'white', fontSize: 13, fontWeight: 700 }}>{unread}</span>}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{notifications.length} total notifications</p>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 11, border: '1px solid rgba(0,230,168,0.3)', background: 'rgba(0,230,168,0.08)', color: '#00e6a8', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'var(--transition)' }}>
              <FiCheck /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 56, color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
            <FiBell size={52} style={{ opacity: 0.25, marginBottom: 16 }} />
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No notifications yet</div>
            <div style={{ fontSize: 13 }}>You'll be notified about deposits, withdrawals, and more</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.map(n => (
              <div key={n._id} onClick={() => !n.isRead && markRead(n._id)} style={{
                background: n.isRead ? 'var(--bg-card)' : 'rgba(0,230,168,0.04)',
                border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(0,230,168,0.18)'}`,
                borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start',
                cursor: n.isRead ? 'default' : 'pointer', transition: 'var(--transition)',
              }}
                onMouseEnter={e => { if (!n.isRead) e.currentTarget.style.background = 'rgba(0,230,168,0.07)'; }}
                onMouseLeave={e => { if (!n.isRead) e.currentTarget.style.background = 'rgba(0,230,168,0.04)'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 13, background: `${typeColor(n.type)}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: typeColor(n.type), fontSize: 19, flexShrink: 0 }}>
                  {typeIcon(n.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {n.title}
                    {!n.isRead && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00e6a8', display: 'inline-block', flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{n.message}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 8 }}>
                    {format(new Date(n.createdAt), 'MMM d, yyyy · HH:mm')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
