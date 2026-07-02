import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiArrowDownCircle, FiArrowUpCircle, FiRepeat, FiTrendingUp, FiClock, FiCheckCircle, FiXCircle, FiArrowUpRight } from 'react-icons/fi';
import { format } from 'date-fns';

const StatCard = ({ label, value, icon, color, sub, trend }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '22px 24px', position: 'relative', overflow: 'hidden', transition: 'var(--transition-slow)' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
  >
    <div style={{ position: 'absolute', top: -30, right: -30, width: 90, height: 90, borderRadius: '50%', background: `${color}14` }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: 0.1 }}>{label}</span>
      <div style={{ width: 36, height: 36, borderRadius: 11, background: `${color}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 17 }}>{icon}</div>
    </div>
    <div style={{ fontFamily: 'Space Grotesk', fontSize: 27, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: -0.5, marginBottom: sub ? 6 : 0 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>}
    {trend && <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 12, color: '#00e6a8', fontWeight: 600 }}><FiArrowUpRight size={12} />{trend}</div>}
  </div>
);

const txTypeLabel = (type) => ({ deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Received', transfer_out: 'Sent', activation: 'Activation', gas_fee: 'Gas Fee' }[type] || type);
const txColor = (type) => ['deposit', 'transfer_in'].includes(type) ? '#00e6a8' : '#ff5c72';

const StatusIcon = ({ status }) => {
  if (status === 'approved' || status === 'completed') return <FiCheckCircle style={{ color: '#00e6a8' }} />;
  if (status === 'rejected') return <FiXCircle style={{ color: '#ff5c72' }} />;
  return <FiClock style={{ color: '#ffb547' }} />;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 12, padding: '12px 16px', fontSize: 13 }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.stroke, fontWeight: 600 }}>{p.name}: ${p.value.toFixed(2)}</div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/transactions?limit=10');
        setTransactions(data.transactions);
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          const label = format(d, 'MMM d');
          const dayTxs = data.transactions.filter(t => new Date(t.createdAt).toDateString() === d.toDateString() && t.status === 'approved');
          days.push({
            date: label,
            Deposits: dayTxs.filter(t => t.type === 'deposit').reduce((a, t) => a + t.amount, 0),
            Withdrawals: dayTxs.filter(t => t.type === 'withdrawal').reduce((a, t) => a + t.amount, 0),
          });
        }
        setChartData(days);
      } catch (err) { console.error('Dashboard fetch error:', err.message); }
    };
    fetchData();
  }, []);

  if (user?.status !== 'active') {
    return (
      <Layout>
        <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center', maxWidth: 420, padding: 40, background: 'var(--bg-card)', borderRadius: 22, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 52, marginBottom: 20 }}>🔒</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Account Not Active</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.65, fontSize: 14.5 }}>
              {user?.activationStatus === 'pending' ? 'Your activation payment is under review. You\'ll be notified once approved.' : 'Complete the one-time $50 activation fee to unlock your wallet.'}
            </p>
            {user?.activationStatus !== 'pending' && (
              <Link to="/activate" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 13, background: 'linear-gradient(135deg, #00e6a8, #00c794)', color: '#04140f', textDecoration: 'none', fontWeight: 700, fontSize: 14.5, boxShadow: '0 4px 20px rgba(0,230,168,0.3)' }}>
                Complete Activation
              </Link>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  const actions = [
    { to: '/deposit', icon: <FiArrowDownCircle />, label: 'Deposit', color: '#00e6a8', bg: 'rgba(0,230,168,0.1)', border: 'rgba(0,230,168,0.25)' },
    { to: '/withdraw', icon: <FiArrowUpCircle />, label: 'Withdraw', color: '#8b7cf6', bg: 'rgba(139,124,246,0.1)', border: 'rgba(139,124,246,0.25)' },
    { to: '/transfer', icon: <FiRepeat />, label: 'Transfer', color: '#ffb547', bg: 'rgba(255,181,71,0.1)', border: 'rgba(255,181,71,0.25)' },
    { to: '/transactions', icon: <FiTrendingUp />, label: 'History', color: '#ff5c72', bg: 'rgba(255,92,114,0.1)', border: 'rgba(255,92,114,0.25)' },
  ];

  const totalDeposited = transactions.filter(t => t.type === 'deposit' && t.status === 'approved').reduce((a, t) => a + t.amount, 0);
  const totalWithdrawn = transactions.filter(t => t.type === 'withdrawal' && t.status === 'approved').reduce((a, t) => a + t.amount, 0);
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 25, fontWeight: 700, marginBottom: 4, letterSpacing: -0.5 }}>
            Welcome back, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Here's what's happening with your wallet</p>
        </div>

        {/* Balance hero card */}
        <div style={{ background: 'linear-gradient(135deg, #151b26 0%, #1c2330 100%)', border: '1px solid rgba(0,230,168,0.18)', borderRadius: 22, padding: '32px 34px', marginBottom: 22, position: 'relative', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,168,0.1), transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,124,246,0.1), transparent 70%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 10 }}>Total Balance</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 52, fontWeight: 800, color: '#00e6a8', marginBottom: 4, letterSpacing: -1.5, lineHeight: 1 }}>
              ${user?.balance?.toFixed(2) || '0.00'}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 28 }}>USDT · TON Network · Available for transfer & withdrawal</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {actions.map(a => (
                <Link key={a.to} to={a.to} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 12,
                  background: a.bg, color: a.color, textDecoration: 'none', fontSize: 14, fontWeight: 600,
                  border: `1px solid ${a.border}`, transition: 'var(--transition)',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 22 }}>
          <StatCard label="Total Deposited" value={`$${totalDeposited.toFixed(2)}`} icon={<FiArrowDownCircle />} color="#00e6a8" />
          <StatCard label="Total Withdrawn" value={`$${totalWithdrawn.toFixed(2)}`} icon={<FiArrowUpCircle />} color="#8b7cf6" />
          <StatCard label="Pending" value={pendingCount} icon={<FiClock />} color="#ffb547" sub="Awaiting approval" />
        </div>

        {/* Chart */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '22px 24px', marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3 }}>Activity — Last 7 Days</h3>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#00e6a8', display: 'inline-block' }} /> Deposits</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#8b7cf6', display: 'inline-block' }} /> Withdrawals</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e6a8" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#00e6a8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b7cf6" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#8b7cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="var(--text-faint)" tick={{ fontSize: 11.5, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--text-faint)" tick={{ fontSize: 11.5, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Deposits" stroke="#00e6a8" fill="url(#dGrad)" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="Withdrawals" stroke="#8b7cf6" fill="url(#wGrad)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent transactions */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3 }}>Recent Transactions</h3>
            <Link to="/transactions" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <FiArrowUpRight size={13} />
            </Link>
          </div>
          {transactions.length === 0 ? (
            <div style={{ padding: 56, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>📋</div>
              No transactions yet
            </div>
          ) : (
            transactions.slice(0, 8).map(tx => (
              <div key={tx._id} style={{ padding: '15px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 42, height: 42, borderRadius: 13, background: `${txColor(tx.type)}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: txColor(tx.type), fontSize: 19, flexShrink: 0 }}>
                  {['deposit', 'transfer_in'].includes(tx.type) ? <FiArrowDownCircle /> : <FiArrowUpCircle />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{txTypeLabel(tx.type)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{format(new Date(tx.createdAt), 'MMM d, yyyy · HH:mm')}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, color: txColor(tx.type), fontSize: 15, fontFamily: 'Space Grotesk', letterSpacing: -0.3 }}>
                    {['deposit', 'transfer_in'].includes(tx.type) ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                  <div style={{ marginTop: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <StatusIcon status={tx.status} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
      
