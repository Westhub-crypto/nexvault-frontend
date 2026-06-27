import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiExternalLink, FiRefreshCw, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

const Modal = ({ title, onClose, onConfirm, type, tx }) => {
  const [note, setNote] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 20 }}>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 480 }}>
        <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
          {tx?.user?.fullName} — <strong>${tx?.amount?.toFixed(2)} USDT</strong>
          {tx?.gasFee > 0 && ` (Gas fee: $${tx.gasFee.toFixed(2)})`}
        </p>

        {/* Proof links */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {tx?.proofOfPayment && (
            <a href={`${API_BASE}/uploads/${tx.proofOfPayment}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(124,110,247,0.1)', border: '1px solid rgba(124,110,247,0.3)', color: '#7c6ef7', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
              <FiExternalLink /> View Payment Proof
            </a>
          )}
          {tx?.gasFeeProof && (
            <a href={`${API_BASE}/uploads/${tx.gasFeeProof}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(255,165,2,0.1)', border: '1px solid rgba(255,165,2,0.3)', color: '#ffa502', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
              <FiExternalLink /> View Gas Fee Proof
            </a>
          )}
        </div>

        {type === 'reject' && (
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Reason for rejection (optional)" rows={3} style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: 16 }} />
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => onConfirm(note)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: type === 'approve' ? 'linear-gradient(135deg, #00d4a3, #00b890)' : 'linear-gradient(135deg, #ff4757, #c0392b)', color: type === 'approve' ? '#0d1117' : 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            {type === 'approve' ? '✓ Approve' : '✗ Reject'}
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const PendingSection = ({ title, items, onApprove, onReject, color, txType }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
    <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600 }}>{title}</h3>
      <span style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 20, background: `${color}18`, color, fontSize: 12, fontWeight: 700 }}>{items.length} pending</span>
    </div>
    {items.length === 0 ? (
      <div style={{ padding: 36, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        <FiClock size={28} style={{ opacity: 0.3, marginBottom: 8 }} /><br />No pending {title.toLowerCase()}
      </div>
    ) : (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['User', 'Amount', 'Submitted', 'Proofs', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(tx => (
              <tr key={tx._id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} style={{ transition: 'background 0.15s' }}>
                <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{tx.user?.fullName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tx.user?.email}</div>
                </td>
                <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontFamily: 'Space Grotesk', color }}>
                  ${tx.amount?.toFixed(2)}
                  {tx.gasFee > 0 && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>Gas: ${tx.gasFee?.toFixed(2)}</div>}
                  {tx.walletAddress && <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 400, marginTop: 2 }}>{tx.walletAddress}</div>}
                </td>
                <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {format(new Date(tx.createdAt), 'MMM d, yyyy')}<br />
                  {format(new Date(tx.createdAt), 'HH:mm')}
                </td>
                <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {tx.proofOfPayment && (
                      <a href={`${API_BASE}/uploads/${tx.proofOfPayment}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, background: 'rgba(124,110,247,0.1)', border: '1px solid rgba(124,110,247,0.2)', color: '#7c6ef7', textDecoration: 'none', fontSize: 11, fontWeight: 500 }}>
                        <FiExternalLink size={11} /> Payment
                      </a>
                    )}
                    {tx.gasFeeProof && (
                      <a href={`${API_BASE}/uploads/${tx.gasFeeProof}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, background: 'rgba(255,165,2,0.1)', border: '1px solid rgba(255,165,2,0.2)', color: '#ffa502', textDecoration: 'none', fontSize: 11, fontWeight: 500 }}>
                        <FiExternalLink size={11} /> Gas Fee
                      </a>
                    )}
                  </div>
                </td>
                <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => onApprove(tx)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #00d4a3, #00b890)', color: '#0d1117', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                      <FiCheck /> Approve
                    </button>
                    <button onClick={() => onReject(tx)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #ff4757, #c0392b)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                      <FiX /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const AdminPending = () => {
  const [data, setData] = useState({ activations: [], deposits: [], withdrawals: [] });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const [act, dep, wit] = await Promise.all([
        api.get('/admin/transactions?type=activation&status=pending&limit=100'),
        api.get('/admin/transactions?type=deposit&status=pending&limit=100'),
        api.get('/admin/transactions?type=withdrawal&status=pending&limit=100'),
      ]);
      setData({ activations: act.data.transactions, deposits: dep.data.transactions, withdrawals: wit.data.transactions });
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handle = async (note) => {
    const { type, action, tx } = modal;
    const endpointMap = {
      'activation-approve': `/admin/transactions/${tx._id}/approve-activation`,
      'activation-reject': `/admin/transactions/${tx._id}/reject-activation`,
      'deposit-approve': `/admin/transactions/${tx._id}/approve-deposit`,
      'deposit-reject': `/admin/transactions/${tx._id}/reject-deposit`,
      'withdrawal-approve': `/admin/transactions/${tx._id}/approve-withdrawal`,
      'withdrawal-reject': `/admin/transactions/${tx._id}/reject-withdrawal`,
    };
    const endpoint = endpointMap[`${type}-${action}`];
    try {
      await api.put(endpoint, { note });
      toast.success(`${type} ${action}d successfully!`);
      setModal(null);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  if (loading) return <Layout><div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading pending approvals...</div></Layout>;

  const total = data.activations.length + data.deposits.length + data.withdrawals.length;

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
              Pending Approvals
              {total > 0 && <span style={{ padding: '3px 12px', borderRadius: 20, background: '#ff4757', color: 'white', fontSize: 14, fontWeight: 700 }}>{total}</span>}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Review and approve user transactions</p>
          </div>
          <button onClick={fetch} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }}>
            <FiRefreshCw /> Refresh
          </button>
        </div>

        <PendingSection title="Activation Payments" items={data.activations} color="#ffa502"
          onApprove={(tx) => setModal({ type: 'activation', action: 'approve', tx, title: 'Approve Activation' })}
          onReject={(tx) => setModal({ type: 'activation', action: 'reject', tx, title: 'Reject Activation' })}
        />
        <PendingSection title="Deposit Requests" items={data.deposits} color="#00d4a3"
          onApprove={(tx) => setModal({ type: 'deposit', action: 'approve', tx, title: 'Approve Deposit' })}
          onReject={(tx) => setModal({ type: 'deposit', action: 'reject', tx, title: 'Reject Deposit' })}
        />
        <PendingSection title="Withdrawal Requests" items={data.withdrawals} color="#7c6ef7"
          onApprove={(tx) => setModal({ type: 'withdrawal', action: 'approve', tx, title: 'Approve Withdrawal' })}
          onReject={(tx) => setModal({ type: 'withdrawal', action: 'reject', tx, title: 'Reject Withdrawal' })}
        />
      </div>

      {modal && (
        <Modal title={modal.title} tx={modal.tx} type={modal.action} onClose={() => setModal(null)} onConfirm={handle} />
      )}
    </Layout>
  );
};

export default AdminPending;
