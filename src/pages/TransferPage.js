import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiMail, FiDollarSign, FiLock, FiCheckCircle } from 'react-icons/fi';

const TransferPage = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ recipientEmail: '', amount: '', pin: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.recipientEmail) return toast.error('Enter recipient email.');
    if (!form.amount || parseFloat(form.amount) <= 0) return toast.error('Enter a valid amount.');
    if (parseFloat(form.amount) > user?.balance) return toast.error('Insufficient balance.');
    if (!form.pin || form.pin.length !== 4) return toast.error('Enter your 4-digit withdrawal PIN.');
    setLoading(true);
    try {
      await api.post('/transactions/transfer', form);
      await refreshUser();
      setSuccess(true);
      setForm({ recipientEmail: '', amount: '', pin: '', note: '' });
      toast.success('Transfer completed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div style={{ padding: '28px 24px', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginTop: 60 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,212,163,0.1)', border: '2px solid rgba(0,212,163,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
              <FiCheckCircle style={{ color: '#00d4a3' }} />
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Transfer Successful!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>Your USDT has been transferred successfully.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setSuccess(false)} style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #00d4a3, #00b890)', color: '#0d1117', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                New Transfer
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Transfer USDT</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Send USDT instantly to another NexVault user</p>

        {/* Balance */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,212,163,0.08), rgba(124,110,247,0.06))', border: '1px solid rgba(0,212,163,0.2)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Available Balance</span>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: '#00d4a3' }}>${user?.balance?.toFixed(2) || '0.00'}</span>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { key: 'recipientEmail', label: 'Recipient Email', icon: <FiMail />, type: 'email', placeholder: "recipient@example.com" },
              { key: 'amount', label: 'Amount (USDT)', icon: <FiDollarSign />, type: 'number', placeholder: 'e.g. 50' },
              { key: 'note', label: 'Note (Optional)', type: 'text', placeholder: 'What is this for?' },
            ].map(({ key, label, icon, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }}>{icon}</span>}
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} required={key !== 'note'} min={key === 'amount' ? 0.01 : undefined} step={key === 'amount' ? '0.01' : undefined}
                    style={{ width: '100%', padding: `12px 16px 12px ${icon ? '42px' : '16px'}`, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#00d4a3'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>
            ))}

            {/* Amount preview */}
            {form.amount && parseFloat(form.amount) > 0 && (
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(0,212,163,0.05)', border: '1px solid rgba(0,212,163,0.15)', fontSize: 13, color: '#00d4a3', display: 'flex', justifyContent: 'space-between' }}>
                <span>You will send:</span>
                <strong>${parseFloat(form.amount).toFixed(2)} USDT</strong>
              </div>
            )}

            {/* PIN */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                <FiLock /> Withdrawal PIN
              </label>
              <input type="password" maxLength={4} value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value.replace(/\D/, '') })} placeholder="••••" required
                style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 24, letterSpacing: 12, outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
                onFocus={e => e.target.style.borderColor = '#00d4a3'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #00d4a3, #00b890)',
              color: loading ? 'var(--text-muted)' : '#0d1117',
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: loading ? 'none' : '0 4px 16px rgba(0,212,163,0.3)'
            }}>
              <FiSend /> {loading ? 'Transferring...' : 'Send Transfer'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: 14, borderRadius: 10, background: 'rgba(124,110,247,0.05)', border: '1px solid rgba(124,110,247,0.15)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            💡 Transfers are instant and irreversible. Make sure the recipient email is correct. The recipient must have an active NexVault account.
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransferPage;
