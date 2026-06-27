import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiArrowDownCircle, FiArrowUpCircle, FiRepeat, FiTrendingUp, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${color}22, transparent 70%)` }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 18 }}>{icon}</div>
    </div>
    <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>}
  </div>
);

const statusIcon = (status) => {
  if (status === 'approved' || status === 'completed') return <FiCheckCircle style={{ color: '#00d4a3' }} />;
  if (status === 'rejected') return <FiXCircle style={{ color: '#ff4757' }} />;
  return <FiClock style={{ color: '#ffa502' }} />;
};

const txTypeLabel = (type) => ({
  deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Received', transfer_out: 'Sent', activation: 'Activation', gas_fee: 'Gas Fee'
}[type] || type);

const txColor = (type) => (['deposit', 'transfer_in'].includes(type) ? '#00d4a3' : '#ff4757');

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/transactions?limit=10');
        setTransactions(data.transactions);
        // Build chart from last 7 days
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          const label = format(d, 'MMM d');
          const dayTxs = data.transactions.filter(t => {
            const td = new Date(t.createdAt); return td.toDateString() === d.toDateString() && t.status === 'approved';
          });
          days.push({ date: label, deposits: dayTxs.filter(t => t.type === 'deposit').reduce((a, t) => a + t.amount, 0), withdrawals: dayTxs.filter(t => t.type === 'withdrawal').reduce((a, t) => a + t.amount, 0) });
        }
        setChartData(days);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  if (user?.status !== 'active') {
    return (
      <Layout>
        <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Account Not Active</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
              {user?.activationStatus === 'pending'
                ? 'Your activation payment is pending admin review.'
                : 'Please complete the $50 activation payment to access your wallet.'}
            </p>
            {user?.activationStatus !== 'pending' && (
              <Link to="/activate" style={{ padding: '12px 28px', borderRadius: 10, background: 'linear-gradient(135deg, #00d4a3, #00b890)', color: '#0d1117', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                Complete Activation
              </Link>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  const actions = [
    { to: '/deposit', icon: <FiArrowDownCircle />, label: 'Deposit', color: '#00d4a3', bg: 'rgba(0,212,163,0.1)' },
    { to: '/withdraw', icon: <FiArrowUpCircle />, label: 'Withdraw', color: '#7c6ef7', bg: 'rgba(124,110,247,0.1)' },
    { to: '/transfer', icon: <FiRepeat />, label: 'Transfer', color: '#ffa502', bg: 'rgba(255,165,2,0.1)' },
    { to: '/transactions', icon: <FiTrendingUp />, label: 'History', color: '#ff4757', bg: 'rgba(255,71,87,0.1)' },
  ];

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
            Welcome back, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage your USDT wallet</p>
        </div>

        {/* Balance card */}
        <div style={{ background: 'linear-gradient(135deg, #161b27 0%, #1a2035 100%)', border: '1px solid rgba(0,212,163,0.15)', borderRadius: 20, padding: '32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,163,0.08), transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,110,247,0.08), transparent 70%)' }} />
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>Total Balance</div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 48, fontWeight: 700, color: '#00d4a3', marginBottom: 4 }}>
            ${user?.balance?.toFixed(2) || '0.00'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>USDT • Available for transfer & withdrawal</div>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            {actions.map(a => (
              <Link key={a.to} to={a.to} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10,
                background: a.bg, color: a.color,
                textDecoration: 'none', fontSize: 14, fontWeight: 600,
                border: `1px solid ${a.color}30`, transition: 'all 0.2s'
              }}>
                {a.icon} {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <StatCard label="Total Deposited" value={`$${transactions.filter(t => t.type === 'deposit' && t.status === 'approved').reduce((a, t) => a + t.amount, 0).toFixed(2)}`} icon={<FiArrowDownCircle />} color="#00d4a3" />
          <StatCard label="Total Withdrawn" value={`$${transactions.filter(t => t.type === 'withdrawal' && t.status === 'approved').reduce((a, t) => a + t.amount, 0).toFixed(2)}`} icon={<FiArrowUpCircle />} color="#7c6ef7" />
          <StatCard label="Pending" value={transactions.filter(t => t.status === 'pending').length} icon={<FiClock />} color="#ffa502" sub="Transactions awaiting approval" />
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Activity — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="dGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4a3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4a3" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c6ef7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c6ef7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 13 }} />
                <Area type="monotone" dataKey="deposits" stroke="#00d4a3" fill="url(#dGrad)" strokeWidth={2} name="Deposits" />
                <Area type="monotone" dataKey="withdrawals" stroke="#7c6ef7" fill="url(#wGrad)" strokeWidth={2} name="Withdrawals" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent transactions */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600 }}>Recent Transactions</h3>
            <Link to="/transactions" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
          </div>
          {transactions.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No transactions yet</div>
          ) : (
            <div>
              {transactions.slice(0, 8).map(tx => (
                <div key={tx._id} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${txColor(tx.type)}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: txColor(tx.type), fontSize: 18, flexShrink: 0 }}>
                    {['deposit', 'transfer_in'].includes(tx.type) ? <FiArrowDownCircle /> : <FiArrowUpCircle />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{txTypeLabel(tx.type)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{format(new Date(tx.createdAt), 'MMM d, yyyy HH:mm')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: txColor(tx.type), fontSize: 15 }}>
                      {['deposit', 'transfer_in'].includes(tx.type) ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: tx.status === 'approved' || tx.status === 'completed' ? 'rgba(0,212,163,0.12)' : tx.status === 'rejected' ? 'rgba(255,71,87,0.12)' : 'rgba(255,165,2,0.12)', color: tx.status === 'approved' || tx.status === 'completed' ? '#00d4a3' : tx.status === 'rejected' ? '#ff4757' : '#ffa502' }}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
