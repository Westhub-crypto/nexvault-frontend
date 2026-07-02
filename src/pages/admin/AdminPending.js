import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiExternalLink, FiRefreshCw, FiClock, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const API_BASE = (process.env.REACT_APP_API_URL || 'https://nexvault-api.onrender.com/api').replace('/api', '');

const Modal = ({ title, tx, type, onClose, onConfirm }) => {
  const [note, setNote] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 20, backdropFilter: 'blur(6px)' }}>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-strong)', borderRadius: 22, padding: 30, width: '100%', maxWidth: 500, boxShadow: 'var(--shadow-lg)' }}>
        <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 19, fontWeight: 700, marginBottom: 6, letterSpacing: -0.4 }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>{tx?.user?.fullName}</strong> · <strong style={{ color: '#00e6a8' }}>${tx?.amount?.toFixed(2)} USDT</strong>
          {tx?.gasFee > 0 && <span style={{ color: 'var(--text-muted)' }}> · Gas: ${tx.gasFee.toFixed(2)}</span>}
        </p>

        {/* Proof links */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          {tx?.proofOfPayment && (
            <a href={`${API_BASE}/uploads/${tx.proofOfPayment}`} target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'rgba(139,124,246,0.1)', border: '1px solid rgba(139,124,246,0.3)', color: '#8b7cf6', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              <FiExternalLink /> View Payment Proof
            </a>
          )}
          {tx?.gasFeeProof && (
            <a href={`${API_BASE}/uploads/${tx.gasFeeProof}`} target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'rgba(255,181,71,0.1)', border: '1px solid rgba(255,181,71,0.3)', color: '#ffb547', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              <FiExternalLink /> View Gas Fee Proof
            </a>
          )}
        </div>

        {type === 'reject' && (
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Reason for rejection (optional)" rows={3}
            style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-primary)', border: '1.5px solid var(--border)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: 16, lineHeight: 1.5 }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => onConfirm(note)} style={{
            flex: 1, padding: '13px', borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 14.5,
            background: type === 'approve' ? 'linear-gradient(135deg, #00e6a8, #00c794)' : 'linear-gradient(135deg, #ff5c72, #e63950)',
            color: type === 'approve' ? '#04140f' : 'white',
            boxShadow: type === 'approve' ? '0 4px 18px rgba(0,230,168,0.28)' : '0 4px 18px rgba(255,92,114,0.28)',
          }}>
            {type === 'approve' ? '✓ Confirm Approval' : '✗ Confirm Rejection'}
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const PendingSection = ({ title, color, items, onApprove, onReject }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
    <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3, flex: 1 }}>{title}</h3>
      <span style={{ padding: '4px 13px', borderRadius: 999, background: `${color}18`, color, fontSize: 12.5, fontWeight: 700, border: `1px solid ${color}40` }}>
        {items.length} pending
      </span>
    </div>

    {items.length === 0 ? (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        <FiClock size={30} style={{ opacity: 0.3, marginBottom: 10 }} />
        <div>No pending {title.toLowerCase()}</div>
      </div>
    ) : (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-primary)' }}>
              {['User', 'Amount', 'Submitted', 'Proofs', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(tx => (
              <tr key={tx._id}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                style={{ transition: 'background 0.15s' }}>
                <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{tx.user?.fullName}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{tx.user?.email}</div>
                </td>
                <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 800, fontFamily: 'Space Grotesk', fontSize: 15.5, color, letterSpacing: -0.3 }}>${tx.amount?.toFixed(2)}</div>
                  {tx.gasFee > 0 && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Gas: ${tx.gasFee?.toFixed(2)}</div>}
                  {tx.walletAddress && (
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 3 }}>
                      {tx.walletAddress}
                    </div>
                  )}
                </td>
                <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', fontSize: 12.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {format(new Date(tx.createdAt), 'MMM d, yyyy')}<br />
                  <span style={{ fontSize: 11 }}>{format(new Date(tx.createdAt), 'HH:mm')}</span>
                </td>
                <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {tx.proofOfPayment && (
                      <a href={`${API_BASE}/uploads/${tx.proofOfPayment}`} target="_blank" rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 11px', borderRadius: 8, background: 'rgba(139,124,246,0.1)', border: '1px solid rgba(139,124,246,0.25)', color: '#8b7cf6', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                        <FiExternalLink size={11} /> Payment
                      </a>
                    )}
                    {tx.gasFeeProof && (
                      <a href={`${API_BASE}/uploads/${tx.gasFeeProof}`} target="_blank" rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 11px', borderRadius: 8, background: 'rgba(255,181,71,0.1)', border: '1px solid rgba(255,181,71,0.25)', color: '#ffb547', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                        <FiExternalLink size={11} /> Gas Fee
                      </a>
                    )}
                    {!tx.proofOfPayment && !tx.gasFeeProof && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>No proof</span>}
                  </div>
                </td>
                <td style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => onApprove(tx)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: 'none',
                      background: 'linear-gradient(135deg, #00e6a8, #00c794)', color: '#04140f', fontWeight: 700, cursor: 'pointer', fontSize: 13.5,
                      boxShadow: '0 2px 10px rgba(0,230,168,0.25)',
                    }}>
                      <FiCheck size={14} /> Approve
                    </button>
                    <button onClick={() => onReject(tx)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: 'none',
                      background: 'linear-gradient(135deg, #ff5c72, #e63950)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13.5,
                      boxShadow: '0 2px 10px rgba(255,92,114,0.25)',
                    }}>
                      <FiX size={14} /> Reject
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
      setData({
        activations: act.data.transactions,
        deposits: dep.data.transactions,
        withdrawals: wit.data.transactions,
      });
    } catch (err) { console.error(err.message); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handle = async (note) => {
    const { txType, action, tx } = modal;
    const endpointMap = {
      'activation-approve': `/admin/transactions/${tx._id}/approve-activation`,
      'activation-reject': `/admin/transactions/${tx._id}/reject-activation`,
      'deposit-approve': `/admin/transactions/${tx._id}/approve-deposit`,
      'deposit-reject': `/admin/transactions/${tx._id}/reject-deposit`,
      'withdrawal-approve': `/admin/transactions/${tx._id}/approve-withdrawal`,
      'withdrawal-reject': `/admin/transactions/${tx._id}/reject-withdrawal`,
    };
    const endpoint = endpointMap[`${txType}-${action}`];
    try {
      await api.put(endpoint, { note });
      toast.success(`${txType} ${action}d successfully!`);
      setModal(null);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: 56, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Loading pending approvals...</div>
      </Layout>
    );
  }

  const total = data.activations.length + data.deposits.length + data.withdrawals.length;

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 4, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 12 }}>
              Pending Approvals
              {total > 0 && (
                <span style={{ padding: '4px 13px', borderRadius: 999, background: '#ff5c72', color: 'white', fontSize: 14, fontWeight: 700 }}>{total}</span>
              )}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Review and process user transaction requests</p>
          </div>
          <button onClick={fetch} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, transition: 'var(--transition)' }}>
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>

        {total === 0 && (
          <div style={{ textAlign: 'center', padding: '56px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, marginBottom: 24 }}>
            <FiAlertCircle size={48} style={{ color: 'var(--text-faint)', marginBottom: 16 }} />
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>All caught up!</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>No pending transactions require your attention right now.</div>
          </div>
        )}

        <PendingSection
          title="Activation Payments" color="#ffb547" items={data.activations}
          onApprove={(tx) => setModal({ txType: 'activation', action: 'approve', tx, title: 'Approve Activation Payment' })}
          onReject={(tx) => setModal({ txType: 'activation', action: 'reject', tx, title: 'Reject Activation Payment' })}
        />
        <PendingSection
          title="Deposit Requests" color="#00e6a8" items={data.deposits}
          onApprove={(tx) => setModal({ txType: 'deposit', action: 'approve', tx, title: 'Approve Deposit' })}
          onReject={(tx) => setModal({ txType: 'deposit', action: 'reject', tx, title: 'Reject Deposit' })}
        />
        <PendingSection
          title="Withdrawal Requests" color="#8b7cf6" items={data.withdrawals}
          onApprove={(tx) => setModal({ txType: 'withdrawal', action: 'approve', tx, title: 'Approve Withdrawal' })}
          onReject={(tx) => setModal({ txType: 'withdrawal', action: 'reject', tx, title: 'Reject Withdrawal' })}
        />
      </div>

      {modal && (
        <Modal
          title={modal.title}
          tx={modal.tx}
          type={modal.action}
          onClose={() => setModal(null)}
          onConfirm={handle}
        />
      )}
    </Layout>
  );
};

export default AdminPending;
          
