import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSearch, FiUserX, FiUserCheck, FiTrash2, FiPlus, FiMinus, FiRefreshCw } from 'react-icons/fi';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const map = { active: ['#00d4a3', 'rgba(0,212,163,0.1)'], pending: ['#ffa502', 'rgba(255,165,2,0.1)'], suspended: ['#ff4757', 'rgba(255,71,87,0.1)'] };
  const [color, bg] = map[status] || ['#8892a4', 'rgba(136,146,164,0.1)'];
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color, background: bg, border: `1px solid ${color}40` }}>{status}</span>;
};

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 20 }}>
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 440 }}>
      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{title}</h3>
      {children}
      <button onClick={onClose} style={{ marginTop: 12, width: '100%', padding: '11px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Cancel</button>
    </div>
  </div>
);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(null); // { type, user }
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
    } catch (err) {
      console.error('Fetch users error:', err.message);
    }
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const action = async (type, userId, extra = {}) => {
    try {
      if (type === 'suspend') await api.put(`/admin/users/${userId}/suspend`);
      else if (type === 'activate') await api.put(`/admin/users/${userId}/activate`);
      else if (type === 'delete') { await api.delete(`/admin/users/${userId}`); }
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
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{total} total users</p>
        </div>

        {/* Search & filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." style={{ width: '100%', padding: '11px 16px 11px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          </div>
          {['', 'active', 'pending', 'suspended'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{ padding: '11px 18px', borderRadius: 10, border: `1px solid ${statusFilter === s ? 'rgba(0,212,163,0.4)' : 'var(--border)'}`, background: statusFilter === s ? 'rgba(0,212,163,0.1)' : 'var(--bg-card)', color: statusFilter === s ? '#00d4a3' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>
              {s || 'All'}
            </button>
          ))}
          <button onClick={fetch} style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16 }}><FiRefreshCw /></button>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['User', 'Phone', 'Country', 'Balance', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '13px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u._id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} style={{ transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#0d1117', flexShrink: 0 }}>
                          {u.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{u.fullName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>{u.phone}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>{u.country}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontFamily: 'Space Grotesk', color: '#00d4a3' }}>${u.balance?.toFixed(2)}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}><StatusBadge status={u.status} /></td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {u.status !== 'active' && <button onClick={() => action('activate', u._id)} title="Activate" style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(0,212,163,0.3)', background: 'rgba(0,212,163,0.08)', color: '#00d4a3', cursor: 'pointer', fontSize: 14 }}><FiUserCheck /></button>}
                        {u.status !== 'suspended' && <button onClick={() => action('suspend', u._id)} title="Suspend" style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(255,165,2,0.3)', background: 'rgba(255,165,2,0.08)', color: '#ffa502', cursor: 'pointer', fontSize: 14 }}><FiUserX /></button>}
                        <button onClick={() => { setModal({ type: 'topup', user: u }); setBalanceInput({ amount: '', note: '' }); }} title="Top Up" style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(124,110,247,0.3)', background: 'rgba(124,110,247,0.08)', color: '#7c6ef7', cursor: 'pointer', fontSize: 14 }}><FiPlus /></button>
                        <button onClick={() => { setModal({ type: 'deduct', user: u }); setBalanceInput({ amount: '', note: '' }); }} title="Deduct" style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(255,165,2,0.3)', background: 'rgba(255,165,2,0.08)', color: '#ffa502', cursor: 'pointer', fontSize: 14 }}><FiMinus /></button>
                        <button onClick={() => setModal({ type: 'delete', user: u })} title="Delete" style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(255,71,87,0.3)', background: 'rgba(255,71,87,0.08)', color: '#ff4757', cursor: 'pointer', fontSize: 14 }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'center', gap: 6, borderTop: '1px solid var(--border)' }}>
              {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${page === i + 1 ? 'rgba(0,212,163,0.4)' : 'var(--border)'}`, background: page === i + 1 ? 'rgba(0,212,163,0.1)' : 'transparent', color: page === i + 1 ? '#00d4a3' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal?.type === 'delete' && (
        <Modal title="Delete User" onClose={() => setModal(null)}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Are you sure you want to permanently delete <strong>{modal.user.fullName}</strong>? This action cannot be undone.
          </p>
          <button onClick={() => action('delete', modal.user._id)} style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #ff4757, #c0392b)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            Delete User
          </button>
        </Modal>
      )}

      {(modal?.type === 'topup' || modal?.type === 'deduct') && (
        <Modal title={modal.type === 'topup' ? `Top Up Balance — ${modal.user.fullName}` : `Deduct Balance — ${modal.user.fullName}`} onClose={() => setModal(null)}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>Current balance: <strong style={{ color: '#00d4a3' }}>${modal.user.balance?.toFixed(2)}</strong></p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input type="number" min="0.01" step="0.01" value={balanceInput.amount} onChange={e => setBalanceInput(s => ({ ...s, amount: e.target.value }))} placeholder="Amount (USDT)" style={{ padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            <input type="text" value={balanceInput.note} onChange={e => setBalanceInput(s => ({ ...s, note: e.target.value }))} placeholder="Note (optional)" style={{ padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={() => action(modal.type, modal.user._id, balanceInput)} style={{ padding: '13px', borderRadius: 10, border: 'none', background: modal.type === 'topup' ? 'linear-gradient(135deg, #00d4a3, #00b890)' : 'linear-gradient(135deg, #ff4757, #c0392b)', color: modal.type === 'topup' ? '#0d1117' : 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              {modal.type === 'topup' ? 'Credit Balance' : 'Deduct Balance'}
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default AdminUsers;
  
