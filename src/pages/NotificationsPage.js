import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { format } from 'date-fns';
import { FiBell, FiCheck, FiCheckCircle, FiArrowDownCircle, FiArrowUpCircle, FiRepeat, FiMegaphone, FiShield } from 'react-icons/fi';

const typeIcon = (type) => ({
  deposit: <FiArrowDownCircle />, withdrawal: <FiArrowUpCircle />, transfer: <FiRepeat />,
  activation: <FiCheckCircle />, announcement: <FiMegaphone />, security: <FiShield />, system: <FiBell />
}[type] || <FiBell />);

const typeColor = (type) => ({
  deposit: '#00d4a3', withdrawal: '#7c6ef7', transfer: '#ffa502',
  activation: '#00d4a3', announcement: '#ff4757', security: '#ffa502', system: '#8892a4'
}[type] || '#8892a4');

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const { data } = await api.get('/transactions/notifications');
      setNotifications(data.notifications);
      setUnread(data.unread);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

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
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
              Notifications
              {unread > 0 && <span style={{ padding: '2px 10px', borderRadius: 20, background: '#ff4757', color: 'white', fontSize: 13, fontWeight: 700 }}>{unread}</span>}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{notifications.length} total notifications</p>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(0,212,163,0.3)', background: 'rgba(0,212,163,0.08)', color: '#00d4a3', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              <FiCheck /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
            <FiBell size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <div style={{ fontSize: 16, fontWeight: 500 }}>No notifications yet</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>You'll be notified about deposits, withdrawals, and more</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.map(n => (
              <div key={n._id} onClick={() => !n.isRead && markRead(n._id)} style={{
                background: n.isRead ? 'var(--bg-card)' : 'rgba(0,212,163,0.04)',
                border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(0,212,163,0.15)'}`,
                borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start',
                cursor: n.isRead ? 'default' : 'pointer', transition: 'all 0.2s',
                position: 'relative'
              }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${typeColor(n.type)}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: typeColor(n.type), fontSize: 18, flexShrink: 0 }}>
                  {typeIcon(n.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {n.title}
                    {!n.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4a3', display: 'inline-block', flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                    {format(new Date(n.createdAt), 'MMM d, yyyy • HH:mm')}
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
