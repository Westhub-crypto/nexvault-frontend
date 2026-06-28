import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { FiExternalLink, FiRefreshCw, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const map = { pending: ['#ffa502', 'rgba(255,165,2,0.1)'], approved: ['#00d4a3', 'rgba(0,212,163,0.1)'], rejected: ['#ff4757', 'rgba(255,71,87,0.1)'], completed: ['#7c6ef7', 'rgba(124,110,247,0.1)'] };
  const [color, bg] = map[status] || ['#8892a4', 'rgba(136,146,164,0.1)'];
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color, background: bg, border: `1px solid ${color}40` }}>{status}</span>;
};

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);
      const { data } = await api.get(`/admin/transactions?${params}`);
      setTransactions(data.transactions); setTotal(data.total);
    } catch (err) {
      console.error('Fetch transactions error:', err.message);
    }
    setLoading(false);
  }, [typeFilter, statusFilter, page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const typeLabel = (t) => ({ deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Transfer In', transfer_out: 'Transfer Out', activation: 'Activation', gas_fee: 'Gas Fee' }[t] || t);
  const typeColor = (t) => ['deposit', 'transfer_in'].includes(t) ? '#00d4a3' : '#ff4757';

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>All Transactions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{total} total transactions</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
          <FiFilter style={{ color: 'var(--text-muted)' }} />
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} style={{ padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
            <option value="">All Types</option>
            {['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'activation', 'gas_fee'].map(t => <option key={t} value={t}>{typeLabel(t)}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
            <option value="">All Statuses</option>
            {['pending', 'approved', 'rejected', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={fetchTransactions} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16 }}><FiRefreshCw /></button>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['User', 'Type', 'Amount', 'Gas Fee', 'Status', 'Proof', 'Date'].map(h => (
                    <th key={h} style={{ padding: '13px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found</td></tr>
                ) : transactions.map(tx => (
                  <tr key={tx._id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} style={{ transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{tx.user?.fullName || '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tx.user?.email}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, color: typeColor(tx.type), fontWeight: 600 }}>{typeLabel(tx.type)}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontFamily: 'Space Grotesk', color: typeColor(tx.type) }}>${tx.amount?.toFixed(2)}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>{tx.gasFee > 0 ? `$${tx.gasFee.toFixed(2)}` : '—'}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}><StatusBadge status={tx.status} /></td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                      {tx.proofOfPayment && (
                        <a href={`${API_BASE.replace('/api', '')}/uploads/${tx.proofOfPayment}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#7c6ef7', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
                          <FiExternalLink /> View
                        </a>
                      )}
                      {tx.gasFeeProof && (
                        <a href={`${API_BASE.replace('/api', '')}/uploads/${tx.gasFeeProof}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#ffa502', fontSize: 12, fontWeight: 500, textDecoration: 'none', marginLeft: 8 }}>
                          <FiExternalLink /> Gas
                        </a>
                      )}
                      {!tx.proofOfPayment && !tx.gasFeeProof && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {format(new Date(tx.createdAt), 'MMM d, yyyy')}<br />
                      <span style={{ fontSize: 10 }}>{format(new Date(tx.createdAt), 'HH:mm')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {total > LIMIT && (
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'center', gap: 6, borderTop: '1px solid var(--border)' }}>
              {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${page === i + 1 ? 'rgba(0,212,163,0.4)' : 'var(--border)'}`, background: page === i + 1 ? 'rgba(0,212,163,0.1)' : 'transparent', color: page === i + 1 ? '#00d4a3' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminTransactions;
    
