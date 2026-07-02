import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { format } from 'date-fns';
import { FiArrowDownCircle, FiArrowUpCircle, FiRepeat, FiFilter } from 'react-icons/fi';

const typeLabel = (type) => ({ deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Received', transfer_out: 'Sent', activation: 'Activation', gas_fee: 'Gas Fee' }[type] || type);
const typeColor = (type) => ['deposit', 'transfer_in'].includes(type) ? '#00e6a8' : '#ff5c72';
const typeIcon = (type) => ['deposit', 'transfer_in'].includes(type) ? <FiArrowDownCircle /> : ['withdrawal', 'gas_fee'].includes(type) ? <FiArrowUpCircle /> : <FiRepeat />;

const StatusBadge = ({ status }) => {
  const map = {
    pending: ['#ffb547', 'rgba(255,181,71,0.1)', 'rgba(255,181,71,0.3)'],
    approved: ['#00e6a8', 'rgba(0,230,168,0.1)', 'rgba(0,230,168,0.3)'],
    rejected: ['#ff5c72', 'rgba(255,92,114,0.1)', 'rgba(255,92,114,0.3)'],
    completed: ['#8b7cf6', 'rgba(139,124,246,0.1)', 'rgba(139,124,246,0.3)'],
  };
  const [color, bg, border] = map[status] || ['#94a3b8', 'rgba(148,163,184,0.1)', 'rgba(148,163,184,0.3)'];
  return <span style={{ padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color, background: bg, border: `1px solid ${border}` }}>{status}</span>;
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filter) params.append('type', filter);
      const { data } = await api.get(`/transactions?${params}`);
      setTransactions(data.transactions);
      setTotal(data.total);
    } catch (err) { console.error(err.message); }
    setLoading(false);
  }, [filter, page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const filters = [
    { label: 'All', value: '' }, { label: 'Deposits', value: 'deposit' },
    { label: 'Withdrawals', value: 'withdrawal' }, { label: 'Sent', value: 'transfer_out' },
    { label: 'Received', value: 'transfer_in' },
  ];

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 4, letterSpacing: -0.5 }}>Transaction History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{total} total transactions</p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
          <FiFilter style={{ color: 'var(--text-muted)', marginRight: 2 }} />
          {filters.map(f => (
            <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }} style={{
              padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: filter === f.value ? 'rgba(0,230,168,0.12)' : 'var(--bg-card)',
              color: filter === f.value ? '#00e6a8' : 'var(--text-secondary)',
              border: `1px solid ${filter === f.value ? 'rgba(0,230,168,0.35)' : 'var(--border)'}`,
              transition: 'var(--transition)',
            }}>{f.label}</button>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 56, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: 72, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.35 }}>📋</div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>No transactions found</div>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-primary)' }}>
                      {['Type', 'Transaction ID', 'Amount', 'Status', 'Date & Time'].map(h => (
                        <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx._id}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        style={{ transition: 'background 0.15s' }}>
                        <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 11, background: `${typeColor(tx.type)}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: typeColor(tx.type), fontSize: 16, flexShrink: 0 }}>
                              {typeIcon(tx.type)}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{typeLabel(tx.type)}</span>
                          </div>
                        </td>
                        <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-secondary)' }}>{tx.transactionId}</td>
                        <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', fontWeight: 800, color: typeColor(tx.type), fontFamily: 'Space Grotesk', fontSize: 15.5, letterSpacing: -0.3 }}>
                          {['deposit', 'transfer_in'].includes(tx.type) ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                        <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)' }}><StatusBadge status={tx.status} /></td>
                        <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {format(new Date(tx.createdAt), 'MMM d, yyyy')}<br />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(new Date(tx.createdAt), 'HH:mm:ss')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {total > LIMIT && (
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center', gap: 6, borderTop: '1px solid var(--border)' }}>
                  {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${page === i + 1 ? 'rgba(0,230,168,0.4)' : 'var(--border)'}`, background: page === i + 1 ? 'rgba(0,230,168,0.12)' : 'transparent', color: page === i + 1 ? '#00e6a8' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'var(--transition)' }}>{i + 1}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TransactionsPage;
  
