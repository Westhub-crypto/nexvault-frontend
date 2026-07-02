import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSearch, FiUserX, FiUserCheck, FiTrash2, FiPlus, FiMinus, FiRefreshCw } from 'react-icons/fi';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const map = { active: ['#00e6a8','rgba(0,230,168,0.1)','rgba(0,230,168,0.3)'], pending: ['#ffb547','rgba(255,181,71,0.1)','rgba(255,181,71,0.3)'], suspended: ['#ff5c72','rgba(255,92,114,0.1)','rgba(255,92,114,0.3)'] };
  const [color, bg, border] = map[status] || ['#94a3b8','rgba(148,163,184,0.1)','rgba(148,163,184,0.3)'];
  return <span style={{ padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color, background: bg, border: `1px solid ${border}` }}>{status}</span>;
};

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 20, backdropFilter: 'blur(4px)' }}>
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-strong)', borderRadius: 22, padding: 30, width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-lg)' }}>
      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, marginBottom: 20, letterSpacing: -0.3 }}>{title}</h3>
      {children}
      <button onClick={onClose} style={{ marginTop: 12, width: '100%', padding: '12px', borderRadius: 11, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Cancel</button>
    </div>
  </div>
);

const iconBtn = (icon, color, bg, border, onClick, title) => (
  <button onClick={onClick} title={title} style={{ padding: '7px 11px', borderRadius: 9, border: `1px solid ${border}`, background: bg, color, cursor: 'pointer', fontSize: 14, transition: 'var(--transition)' }}>{icon}</button>
);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(null);
  const [balanceInput, setBalanceInput] = useState({ amount: '', note: '' });
  const LIMIT = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users); setTotal(data.total);
    } catch (err) { console.error(err.message); }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const action = async (type, userId, extra = {}) => {
    try {
      if (type === 'suspend') await api.put(`/admin/users/${userId}/suspend`);
      else if (type === 'activate') await api.put(`/admin/users/${userId}/activate`);
      else if (type === 'delete') await api.delete(`/admin/users/${userId}`);
      else if (type === 'topup') await api.put(`/admin/users/${userId}/topup`, extra);
      else if (type === 'deduct') await api.put(`/admin/users/${userId}/deduct`, extra);
      toast.success('Action completed!');
      setModal(null);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
  };

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 4, letterSpacing: -0.5 }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{total} total users</p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..."
              style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          {['', 'active', 'pending', 'suspended'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{ padding: '11px 18px', borderRadius: 11, border: `1px solid ${statusFilter === s ? 'rgba(0,230,168,0.4)' : 'var(--border)'}`, background: statusFilter === s ? 'rgba(0,230,168,0.1)' : 'var(--bg-card)', color: statusFilter === s ? '#00e6a8' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 500, textTransform: 'capitalize', transition: 'var(--transition)' }}>
              {s || 'All'}
            </button>
          ))}
          <button onClick={fetchUsers} style={{ padding: '11px 14px', borderRadius: 11, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16 }}><FiRefreshCw /></button>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-primary)' }}>
                  {['User', 'Phone', 'Country', 'Balance', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '13px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 56, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u._id}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    style={{ transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #00e6a8, #8b7cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#04140f', flexShrink: 0 }}>
                          {u.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{u.fullName}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>{u.phone}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>{u.country}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 800, fontFamily: 'Space Grotesk', color: '#00e6a8', fontSize: 15, letterSpacing: -0.3 }}>${u.balance?.toFixed(2)}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}><StatusBadge status={u.status} /></td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 12.5, color: 'var(--text-muted)' }}>{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {u.status !== 'active' && iconBtn(<FiUserCheck />, '#00e6a8', 'rgba(0,230,168,0.1)', 'rgba(0,230,168,0.3)', () => action('activate', u._id), 'Activate')}
                        {u.status !== 'suspended' && iconBtn(<FiUserX />, '#ffb547', 'rgba(255,181,71,0.1)', 'rgba(255,181,71,0.3)', () => action('suspend', u._id), 'Suspend')}
                        {iconBtn(<FiPlus />, '#8b7cf6', 'rgba(139,124,246,0.1)', 'rgba(139,124,246,0.3)', () => { setModal({ type: 'topup', user: u }); setBalanceInput({ amount: '', note: '' }); }, 'Top Up')}
                        {iconBtn(<FiMinus />, '#ffb547', 'rgba(255,181,71,0.1)', 'rgba(255,181,71,0.3)', () => { setModal({ type: 'deduct', user: u }); setBalanceInput({ amount: '', note: '' }); }, 'Deduct')}
                        {iconBtn(<FiTrash2 />, '#ff5c72', 'rgba(255,92,114,0.1)', 'rgba(255,92,114,0.3)', () => setModal({ type: 'delete', user: u }), 'Delete')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {total > LIMIT && (
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'center', gap: 6, borderTop: '1px solid var(--border)' }}>
              {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${page === i + 1 ? 'rgba(0,230,168,0.4)' : 'var(--border)'}`, background: page === i + 1 ? 'rgba(0,230,168,0.12)' : 'transparent', color: page === i + 1 ? '#00e6a8' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal?.type === 'delete' && (
        <Modal title="Delete User" onClose={() => setModal(null)}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20, lineHeight: 1.65 }}>Permanently delete <strong style={{ color: 'var(--text-primary)' }}>{modal.user.fullName}</strong>? This action cannot be undone.</p>
          <button onClick={() => action('delete', modal.user._id)} style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #ff5c72, #e63950)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Delete User</button>
        </Modal>
      )}
      {(modal?.type === 'topup' || modal?.type === 'deduct') && (
        <Modal title={modal.type === 'topup' ? `Top Up — ${modal.user.fullName}` : `Deduct — ${modal.user.fullName}`} onClose={() => setModal(null)}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>Current: <strong style={{ color: '#00e6a8' }}>${modal.user.balance?.toFixed(2)}</strong></p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['amount', 'number', 'Amount (USDT)'], ['note', 'text', 'Note (optional)']].map(([key, type, ph]) => (
              <input key={key} type={type} min={key === 'amount' ? '0.01' : undefined} step={key === 'amount' ? '0.01' : undefined}
                value={balanceInput[key]} onChange={e => setBalanceInput(s => ({ ...s, [key]: e.target.value }))} placeholder={ph}
                style={{ padding: '12px 16px', background: 'var(--bg-primary)', border: '1.5px solid var(--border)', borderRadius: 11, color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            ))}
            <button onClick={() => action(modal.type, modal.user._id, balanceInput)} style={{ padding: '13px', borderRadius: 12, border: 'none', background: modal.type === 'topup' ? 'linear-gradient(135deg, #00e6a8, #00c794)' : 'linear-gradient(135deg, #ff5c72, #e63950)', color: modal.type === 'topup' ? '#04140f' : 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              {modal.type === 'topup' ? 'Credit Balance' : 'Deduct Balance'}
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default AdminUsers;
  
