import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import WalletPaymentCard from '../components/WalletPaymentCard';
import { FiSend, FiLock, FiCheckCircle, FiUsers, FiGlobe, FiUpload, FiAlertTriangle, FiRepeat } from 'react-icons/fi';

const TransferPage = () => {
  const { user, refreshUser } = useAuth();
  const [transferType, setTransferType] = useState('internal');
  const [form, setForm] = useState({ recipientEmail: '', walletAddress: '', amount: '', pin: '', note: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [step, setStep] = useState(1);
  const [gasFee, setGasFee] = useState(0);

  const loadWalletInfo = async () => {
    try {
      const { data } = await api.get('/transactions/wallet-info');
      setWalletInfo(data);
    } catch (err) { console.error(err.message); }
  };

  const handleAmountChange = (val) => {
    setForm(f => ({ ...f, amount: val }));
    setGasFee(val && parseFloat(val) > 0 ? (parseFloat(val) * 10) / 100 : 0);
  };

  const handleInternalSubmit = async (e) => {
    e.preventDefault();
    if (!form.recipientEmail) return toast.error('Enter recipient email.');
    if (!form.amount || parseFloat(form.amount) <= 0) return toast.error('Enter a valid amount.');
    if (parseFloat(form.amount) > user?.balance) return toast.error('Insufficient balance.');
    if (!form.pin || form.pin.length !== 4) return toast.error('Enter your 4-digit withdrawal PIN.');
    setLoading(true);
    try {
      await api.post('/transactions/transfer', { recipientEmail: form.recipientEmail, amount: form.amount, pin: form.pin, note: form.note });
      await refreshUser();
      setSuccess(true);
      setForm({ recipientEmail: '', walletAddress: '', amount: '', pin: '', note: '' });
      toast.success('Transfer completed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed.');
    } finally { setLoading(false); }
  };

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
      setStep(1); setFile(null);
      setForm({ recipientEmail: '', walletAddress: '', amount: '', pin: '', note: '' });
      toast.success('External transfer submitted! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <Layout>
        <div style={{ padding: '28px 24px', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginTop: 60 }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--accent-glow)', border: '2px solid rgba(0,230,168,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
              <FiCheckCircle style={{ color: 'var(--accent)' }} />
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 23, fontWeight: 700, marginBottom: 12 }}>
              {transferType === 'internal' ? 'Transfer Successful!' : 'Request Submitted!'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 30, lineHeight: 1.6 }}>
              {transferType === 'internal' ? 'USDT has been sent instantly to the recipient.' : 'Your external transfer is pending admin approval.'}
            </p>
            <button onClick={() => setSuccess(false)} className="btn btn-primary">New Transfer</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: 18 }}>
            <FiRepeat />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 23, fontWeight: 700, letterSpacing: -0.4 }}>Send USDT</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 22 }}>Transfer to a NexVault user or any external wallet</p>

        <div style={{ background: 'linear-gradient(135deg, var(--accent-glow), var(--accent2-glow))', border: '1px solid rgba(0,230,168,0.22)', borderRadius: 16, padding: '16px 22px', marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Available Balance</span>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 800, color: 'var(--accent)', letterSpacing: -0.5 }}>${user?.balance?.toFixed(2) || '0.00'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
          <button onClick={() => { setTransferType('internal'); setStep(1); }} style={{
            padding: '15px', borderRadius: 14, border: `1.5px solid ${transferType === 'internal' ? 'rgba(0,230,168,0.5)' : 'var(--border)'}`,
            background: transferType === 'internal' ? 'var(--accent-glow)' : 'var(--bg-card)',
            color: transferType === 'internal' ? 'var(--accent)' : 'var(--text-secondary)',
            cursor: 'pointer', transition: 'var(--transition)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <FiUsers size={19} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>NexVault User</span>
            <span style={{ fontSize: 10.5, opacity: 0.75 }}>Instant · No gas fee</span>
          </button>
          <button onClick={() => { setTransferType('external'); setStep(1); }} style={{
            padding: '15px', borderRadius: 14, border: `1.5px solid ${transferType === 'external' ? 'rgba(139,124,246,0.5)' : 'var(--border)'}`,
            background: transferType === 'external' ? 'var(--accent2-glow)' : 'var(--bg-card)',
            color: transferType === 'external' ? 'var(--accent2)' : 'var(--text-secondary)',
            cursor: 'pointer', transition: 'var(--transition)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <FiGlobe size={19} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>External Wallet</span>
            <span style={{ fontSize: 10.5, opacity: 0.75 }}>Any USDT address · Gas fee</span>
          </button>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 22, padding: 26 }}>

          {transferType === 'internal' && (
            <form onSubmit={handleInternalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--accent-glow)', border: '1px solid rgba(0,230,168,0.2)', fontSize: 13, color: 'var(--accent)' }}>
                ⚡ Instant transfer to any registered NexVault user — no fees, no delays.
              </div>
              {[
                { key: 'recipientEmail', label: "Recipient's NexVault Email", type: 'email', placeholder: 'recipient@example.com' },
                { key: 'amount', label: 'Amount (USDT)', type: 'number', placeholder: 'e.g. 100', min: '0.01', step: '0.01' },
                { key: 'note', label: 'Note (Optional)', type: 'text', placeholder: 'What is this for?' },
              ].map(({ key, label, type, placeholder, ...rest }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} required={key !== 'note'} {...rest} className="input-field" />
                </div>
              ))}
              {form.amount && parseFloat(form.amount) > 0 && (
                <div style={{ padding: 14, borderRadius: 12, background: 'var(--accent-glow)', border: '1px solid rgba(0,230,168,0.18)', fontSize: 13, color: 'var(--accent)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>You send:</span><strong>${parseFloat(form.amount).toFixed(2)} USDT</strong>
                </div>
              )}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <FiLock /> Withdrawal PIN
                </label>
                <input type="password" maxLength={4} value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/, '') }))} placeholder="••••" required className="input-field" style={{ fontSize: 24, letterSpacing: 12, textAlign: 'center' }} />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
                <FiSend /> {loading ? 'Sending...' : 'Send Instantly'}
              </button>
            </form>
          )}

          {transferType === 'external' && step === 1 && (
            <form onSubmit={handleExternalNext} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--accent2-glow)', border: '1px solid rgba(139,124,246,0.22)', fontSize: 13, color: 'var(--accent2)' }}>
                🌐 Send USDT to any external wallet address. A 10% gas fee is required (paid separately).
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Recipient USDT Wallet Address</label>
                <input type="text" value={form.walletAddress} onChange={e => setForm(f => ({ ...f, walletAddress: e.target.value }))} placeholder="Recipient address" required className="input-field" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Amount (USDT)</label>
                <input type="number" min="1" step="0.01" max={user?.balance} value={form.amount} onChange={e => handleAmountChange(e.target.value)} placeholder="Enter amount" required className="input-field" />
                {gasFee > 0 && (
                  <div style={{ marginTop: 10, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,181,71,0.08)', border: '1px solid rgba(255,181,71,0.22)', fontSize: 13, color: 'var(--warning)' }}>
                    Gas fee required: <strong>${gasFee.toFixed(2)} USDT</strong> — paid separately, not deducted from balance
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Note (Optional)</label>
                <input type="text" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Purpose of transfer" className="input-field" />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <FiLock /> Withdrawal PIN
                </label>
                <input type="password" maxLength={4} value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/, '') }))} placeholder="••••" required className="input-field" style={{ fontSize: 24, letterSpacing: 12, textAlign: 'center' }} />
              </div>
              <button type="submit" className="btn" style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #8b7cf6, #7160e8)', color: 'white', boxShadow: '0 4px 20px rgba(139,124,246,0.3)' }}>
                Continue to Gas Fee Payment →
              </button>
            </form>
          )}

          {transferType === 'external' && step === 2 && (
            <form onSubmit={handleExternalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: 'var(--bg-primary)', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid var(--border)' }}>
                <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Transfer Summary</h4>
                {[['Send Amount', `$${parseFloat(form.amount).toFixed(2)} USDT`], ['Gas Fee (10%)', `$${gasFee.toFixed(2)} USDT`], ['To Address', form.walletAddress]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                    <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all', fontFamily: k === 'To Address' ? 'var(--font-mono)' : 'inherit', fontSize: k === 'To Address' ? 11 : 13 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="network-warning" style={{ background: 'rgba(255,92,114,0.07)', border: '1px solid rgba(255,92,114,0.2)', color: 'var(--danger)' }}>
                <FiAlertTriangle style={{ marginTop: 1, flexShrink: 0 }} />
                <span>Send <strong>${gasFee.toFixed(2)} USDT</strong> gas fee to the address below, then upload the proof.</span>
              </div>

              <WalletPaymentCard
                address={walletInfo?.gasFeeAddress}
                qrCode={walletInfo?.gasFeeQR}
                network={walletInfo?.network}
                networkFull={walletInfo?.networkFull}
                tokenSymbol={walletInfo?.tokenSymbol}
              />

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Upload Gas Fee Payment Proof</label>
                <label htmlFor="ext-gas-proof" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 24, borderRadius: 14,
                  border: `1.5px dashed ${file ? 'var(--accent)' : 'var(--border-strong)'}`, cursor: 'pointer',
                  background: file ? 'var(--accent-glow)' : 'var(--bg-primary)', transition: 'var(--transition)',
                }}>
                  <FiUpload size={20} style={{ color: file ? 'var(--accent)' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 13, color: file ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 500 }}>{file ? file.name : 'Upload screenshot or receipt'}</span>
                  <input id="ext-gas-proof" type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>← Back</button>
                <button type="submit" disabled={loading} className="btn" style={{ flex: 2, background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #8b7cf6, #7160e8)', color: loading ? 'var(--text-muted)' : 'white' }}>
                  {loading ? 'Submitting...' : 'Submit Transfer Request'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-secondary)' }}>NexVault User:</strong> Instant, free transfer to any registered user by email.<br />
          <strong style={{ color: 'var(--text-secondary)' }}>External Wallet:</strong> Send to any USDT address worldwide. A 10% gas fee is required and must be paid separately before your transfer is processed.
        </div>
      </div>
    </Layout>
  );
};

export default TransferPage;
