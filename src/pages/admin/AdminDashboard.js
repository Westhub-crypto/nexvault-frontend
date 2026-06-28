import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

import { FiUsers, FiArrowDownCircle, FiArrowUpCircle, FiClock, FiDollarSign, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${color}18` }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 18 }}>{icon}</div>
    </div>
    <div style={{ fontFamily: 'Space Grotesk', fontSize: 30, fontWeight: 700 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>}
  </div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => {
      setAnalytics(data.analytics);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics...</div></Layout>;

  const a = analytics || {};

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Platform overview and analytics</p>
        </div>

        {/* Pending alerts */}
        {(a.pendingDeposits > 0 || a.pendingWithdrawals > 0 || a.pendingActivations > 0) && (
          <div style={{ background: 'rgba(255,165,2,0.06)', border: '1px solid rgba(255,165,2,0.25)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <FiAlertCircle style={{ color: '#ffa502', fontSize: 20, flexShrink: 0 }} />
            <div style={{ fontSize: 14, color: '#ffa502' }}>
              <strong>Pending actions: </strong>
              {[a.pendingActivations > 0 && `${a.pendingActivations} activation${a.pendingActivations > 1 ? 's' : ''}`, a.pendingDeposits > 0 && `${a.pendingDeposits} deposit${a.pendingDeposits > 1 ? 's' : ''}`, a.pendingWithdrawals > 0 && `${a.pendingWithdrawals} withdrawal${a.pendingWithdrawals > 1 ? 's' : ''}`].filter(Boolean).join(' • ')} require your review.
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <StatCard label="Total Users" value={a.totalUsers || 0} icon={<FiUsers />} color="#00d4a3" sub={`${a.activeUsers || 0} active`} />
          <StatCard label="Total Deposited" value={`$${(a.totalDeposited || 0).toFixed(2)}`} icon={<FiArrowDownCircle />} color="#7c6ef7" />
          <StatCard label="Total Withdrawn" value={`$${(a.totalWithdrawn || 0).toFixed(2)}`} icon={<FiArrowUpCircle />} color="#ffa502" />
          <StatCard label="Platform Balance" value={`$${(a.totalBalances || 0).toFixed(2)}`} icon={<FiDollarSign />} color="#00d4a3" sub="Combined user balances" />
          <StatCard label="Pending Deposits" value={a.pendingDeposits || 0} icon={<FiClock />} color="#ffa502" />
          <StatCard label="Pending Withdrawals" value={a.pendingWithdrawals || 0} icon={<FiClock />} color="#ff4757" />
          <StatCard label="Pending Activations" value={a.pendingActivations || 0} icon={<FiAlertCircle />} color="#ff4757" />
          <StatCard label="Suspended Users" value={a.suspendedUsers || 0} icon={<FiActivity />} color="#ff4757" />
        </div>

        {/* Recent transactions */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600 }}>Recent Transactions</h3>
          </div>
          {(a.recentTransactions || []).length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No transactions yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['User', 'Type', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(a.recentTransactions || []).map(tx => (
                    <tr key={tx._id}>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                        <div style={{ fontWeight: 500 }}>{tx.user?.fullName || 'Unknown'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tx.user?.email}</div>
                      </td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, textTransform: 'capitalize' }}>{tx.type?.replace('_', ' ')}</td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontFamily: 'Space Grotesk', color: ['deposit','transfer_in'].includes(tx.type) ? '#00d4a3' : '#ff4757' }}>
                        ${tx.amount?.toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: tx.status === 'approved' || tx.status === 'completed' ? '#00d4a3' : tx.status === 'rejected' ? '#ff4757' : '#ffa502', background: tx.status === 'approved' || tx.status === 'completed' ? 'rgba(0,212,163,0.1)' : tx.status === 'rejected' ? 'rgba(255,71,87,0.1)' : 'rgba(255,165,2,0.1)' }}>
                          {tx.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
                        {format(new Date(tx.createdAt), 'MMM d, HH:mm')}
                      </td>
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
              
