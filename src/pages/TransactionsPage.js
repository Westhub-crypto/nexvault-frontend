import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { format } from 'date-fns';
import { FiArrowDownCircle, FiArrowUpCircle, FiRepeat, FiFilter } from 'react-icons/fi';

const typeLabel = (type) => ({ deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Received', transfer_out: 'Sent', activation: 'Activation', gas_fee: 'Gas Fee' }[type] || type);
const typeColor = (type) => ['deposit', 'transfer_in'].includes(type) ? '#00d4a3' : '#ff4757';
const typeIcon = (type) => ['deposit', 'transfer_in'].includes(type) ? <FiArrowDownCircle /> : ['withdrawal', 'gas_fee'].includes(type) ? <FiArrowUpCircle /> : <FiRepeat />;

const StatusBadge = ({ status }) => {
  const colors = { pending: ['#ffa502', 'rgba(255,165,2,0.1)'], approved: ['#00d4a3', 'rgba(0,212,163,0.1)'], rejected: ['#ff4757', 'rgba(255,71,87,0.1)'], completed: ['#7c6ef7', 'rgba(124,110,247,0.1)'] };
  const [color, bg] = colors[status] || ['#8892a4', 'rgba(136,146,164,0.1)'];
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color, background: bg, border: `1px solid ${color}40` }}>{status}</span>;
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  const fetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filter) params.append('type', filter);
      const { data } = await api.get(`/transactions?${params}`);
      setTransactions(data.transactions);
      setTotal(data.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [filter, page]);

  const filters = [
    { label: 'All', value: '' },
    { label: 'Deposits', value: 'deposit' },
    { label: 'Withdrawals', value: 'withdrawal' },
    { label: 'Transfers', value: 'transfer_out' },
    { label: 'Received', value: 'transfer_in' },
  ];

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Transaction History</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>{total} total transactions</p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <FiFilter style={{ color: 'var(--text-muted)', marginTop: 10, marginRight: 4 }} />
          {filters.map(f => (
            <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }} style={{
              padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
              background: filter === f.value ? 'rgba(0,212,163,0.15)' : 'var(--bg-card)',
              color: filter === f.value ? '#00d4a3' : 'var(--text-secondary)',
              border: `1px solid ${filter === f.value ? 'rgba(0,212,163,0.4)' : 'var(--border)'}`,
              transition: 'all 0.2s'
            }}>{f.label}</button>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div>No transactions found</div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Type', 'Transaction ID', 'Amount', 'Status', 'Date'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx._id} style={{ transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${typeColor(tx.type)}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: typeColor(tx.type), fontSize: 16, flexShrink: 0 }}>
                              {typeIcon(tx.type)}
                            </div>
                            <span style={{ fontWeight: 500, fontSize: 14 }}>{typeLabel(tx.type)}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{tx.transactionId}</td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, color: typeColor(tx.type), fontFamily: 'Space Grotesk', fontSize: 15 }}>
                          {['deposit', 'transfer_in'].includes(tx.type) ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}><StatusBadge status={tx.status} /></td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {format(new Date(tx.createdAt), 'MMM d, yyyy')}<br />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(new Date(tx.createdAt), 'HH:mm:ss')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {total > LIMIT && (
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center', gap: 8, borderTop: '1px solid var(--border)' }}>
                  {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${page === i + 1 ? 'rgba(0,212,163,0.4)' : 'var(--border)'}`, background: page === i + 1 ? 'rgba(0,212,163,0.1)' : 'transparent', color: page === i + 1 ? '#00d4a3' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                      {i + 1}
                    </button>
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
