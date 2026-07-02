import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { FiUsers, FiArrowDownCircle, FiArrowUpCircle, FiClock, FiDollarSign, FiAlertCircle, FiActivity, FiArrowUpRight } from 'react-icons/fi';
import { format } from 'date-fns';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -28, right: -28, width: 84, height: 84, borderRadius: '50%', background: `${color}12` }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <div style={{ width: 36, height: 36, borderRadius: 11, background: `${color}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 17 }}>{icon}</div>
    </div>
    <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>}
  </div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => { setAnalytics(data.analytics); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div style={{ padding: 56, textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics...</div></Layout>;
  const a = analytics || {};

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 25, fontWeight: 700, marginBottom: 4, letterSpacing: -0.5 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Platform overview and analytics</p>
        </div>

        {(a.pendingDeposits > 0 || a.pendingWithdrawals > 0 || a.pendingActivations > 0) && (
          <div style={{ background: 'rgba(255,181,71,0.07)', border: '1px solid rgba(255,181,71,0.25)', borderRadius: 14, padding: '15px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <FiAlertCircle style={{ color: '#ffb547', fontSize: 20, flexShrink: 0 }} />
            <div style={{ fontSize: 13.5, color: '#ffb547' }}>
              <strong>Action required: </strong>
              {[a.pendingActivations > 0 && `${a.pendingActivations} activation${a.pendingActivations > 1 ? 's' : ''}`, a.pendingDeposits > 0 && `${a.pendingDeposits} deposit${a.pendingDeposits > 1 ? 's' : ''}`, a.pendingWithdrawals > 0 && `${a.pendingWithdrawals} withdrawal${a.pendingWithdrawals > 1 ? 's' : ''}`].filter(Boolean).join(' · ')} pending review.
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard label="Total Users" value={a.totalUsers || 0} icon={<FiUsers />} color="#00e6a8" sub={`${a.activeUsers || 0} active`} />
          <StatCard label="Total Deposited" value={`$${(a.totalDeposited || 0).toFixed(2)}`} icon={<FiArrowDownCircle />} color="#8b7cf6" />
          <StatCard label="Total Withdrawn" value={`$${(a.totalWithdrawn || 0).toFixed(2)}`} icon={<FiArrowUpCircle />} color="#ffb547" />
          <StatCard label="User Balances" value={`$${(a.totalBalances || 0).toFixed(2)}`} icon={<FiDollarSign />} color="#00e6a8" sub="Combined" />
          <StatCard label="Pending Deposits" value={a.pendingDeposits || 0} icon={<FiClock />} color="#ffb547" />
          <StatCard label="Pending Withdrawals" value={a.pendingWithdrawals || 0} icon={<FiClock />} color="#ff5c72" />
          <StatCard label="Pending Activations" value={a.pendingActivations || 0} icon={<FiAlertCircle />} color="#ff5c72" />
          <StatCard label="Suspended Users" value={a.suspendedUsers || 0} icon={<FiActivity />} color="#ff5c72" />
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3 }}>Recent Transactions</h3>
          </div>
          {!(a.recentTransactions?.length) ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No transactions yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-primary)' }}>
                    {['User', 'Type', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(a.recentTransactions || []).map(tx => (
                    <tr key={tx._id}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      style={{ transition: 'background 0.15s' }}>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{tx.user?.fullName || '—'}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{tx.user?.email}</div>
                      </td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, textTransform: 'capitalize', color: ['deposit','transfer_in'].includes(tx.type) ? '#00e6a8' : '#ff5c72', fontWeight: 600 }}>{tx.type?.replace('_', ' ')}</td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontWeight: 800, fontFamily: 'Space Grotesk', color: ['deposit','transfer_in'].includes(tx.type) ? '#00e6a8' : '#ff5c72', letterSpacing: -0.3 }}>${tx.amount?.toFixed(2)}</td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: tx.status === 'approved' || tx.status === 'completed' ? '#00e6a8' : tx.status === 'rejected' ? '#ff5c72' : '#ffb547', background: tx.status === 'approved' || tx.status === 'completed' ? 'rgba(0,230,168,0.1)' : tx.status === 'rejected' ? 'rgba(255,92,114,0.1)' : 'rgba(255,181,71,0.1)' }}>
                          {tx.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 12.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{format(new Date(tx.createdAt), 'MMM d, HH:mm')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
  
