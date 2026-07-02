import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { FiExternalLink, FiRefreshCw, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';

const API_BASE = (process.env.REACT_APP_API_URL || 'https://nexvault-api.onrender.com/api').replace('/api', '');

const StatusBadge = ({ status }) => {
  const map = {
    pending: ['#ffb547','rgba(255,181,71,0.1)','rgba(255,181,71,0.3)'],
    approved: ['#00e6a8','rgba(0,230,168,0.1)','rgba(0,230,168,0.3)'],
    rejected: ['#ff5c72','rgba(255,92,114,0.1)','rgba(255,92,114,0.3)'],
    completed: ['#8b7cf6','rgba(139,124,246,0.1)','rgba(139,124,246,0.3)'],
  };
  const [color, bg, border] = map[status] || ['#94a3b8','rgba(148,163,184,0.1)','rgba(148,163,184,0.3)'];
  return <span style={{ padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color, background: bg, border: `1px solid ${border}` }}>{status}</span>;
};

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
      setTransactions(data.transactions);
      setTotal(data.total);
    } catch (err) { console.error(err.message); }
    setLoading(false);
  }, [typeFilter, statusFilter, page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const typeLabel = (t) => ({ deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Transfer In', transfer_out: 'Transfer Out', activation: 'Activation', gas_fee: 'Gas Fee' }[t] || t);
  const typeColor = (t) => ['deposit', 'transfer_in'].includes(t) ? '#00e6a8' : '#ff5c72';

  const selectStyle = { padding: '11px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 11, color: 'var(--text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer', fontFamily: 'inherit' };

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 4, letterSpacing: -0.5 }}>All Transactions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{total} total transactions</p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
          <FiFilter style={{ color: 'var(--text-muted)' }} />
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} style={selectStyle}>
            <option value="">All Types</option>
            {['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'activation', 'gas_fee'].map(t => <option key={t} value={t}>{typeLabel(t)}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={selectStyle}>
            <option value="">All Statuses</option>
            {['pending', 'approved', 'rejected', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={fetchTransactions} style={{ padding: '11px 14px', borderRadius: 11, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16, transition: 'var(--transition)' }}>
            <FiRefreshCw />
          </button>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-primary)' }}>
                  {['User', 'Type', 'Amount', 'Gas Fee', 'Status', 'Proof', 'Date'].map(h => (
                    <th key={h} style={{ padding: '13px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Loading...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 56, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No transactions found</td></tr>
                ) : transactions.map(tx => (
                  <tr key={tx._id}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    style={{ transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{tx.user?.fullName || '—'}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{tx.user?.email}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, color: typeColor(tx.type), fontWeight: 600 }}>{typeLabel(tx.type)}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 800, fontFamily: 'Space Grotesk', color: typeColor(tx.type), fontSize: 15, letterSpacing: -0.3 }}>${tx.amount?.toFixed(2)}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>{tx.gasFee > 0 ? `$${tx.gasFee.toFixed(2)}` : '—'}</td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}><StatusBadge status={tx.status} /></td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {tx.proofOfPayment && (
                          <a href={`${API_BASE}/uploads/${tx.proofOfPayment}`} target="_blank" rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, background: 'rgba(139,124,246,0.1)', border: '1px solid rgba(139,124,246,0.25)', color: '#8b7cf6', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                            <FiExternalLink size={11} /> Proof
                          </a>
                        )}
                        {tx.gasFeeProof && (
                          <a href={`${API_BASE}/uploads/${tx.gasFeeProof}`} target="_blank" rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, background: 'rgba(255,181,71,0.1)', border: '1px solid rgba(255,181,71,0.25)', color: '#ffb547', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                            <FiExternalLink size={11} /> Gas
                          </a>
                        )}
                        {!tx.proofOfPayment && !tx.gasFeeProof && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 12.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {format(new Date(tx.createdAt), 'MMM d, yyyy')}<br />
                      <span style={{ fontSize: 11 }}>{format(new Date(tx.createdAt), 'HH:mm')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {total > LIMIT && (
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'center', gap: 6, borderTop: '1px solid var(--border)' }}>
              {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${page === i + 1 ? 'rgba(0,230,168,0.4)' : 'var(--border)'}`, background: page === i + 1 ? 'rgba(0,230,168,0.12)' : 'transparent', color: page === i + 1 ? '#00e6a8' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'var(--transition)' }}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminTransactions;
                       
