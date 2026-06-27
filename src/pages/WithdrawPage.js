import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiCopy, FiCheck, FiUpload, FiAlertTriangle, FiLock } from 'react-icons/fi';

const WithdrawPage = () => {
  const { user } = useAuth();
  const [walletInfo, setWalletInfo] = useState(null);
  const [form, setForm] = useState({ amount: '', walletAddress: '', pin: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);
  const [gasFee, setGasFee] = useState(0);

  useEffect(() => {
    api.get('/transactions/wallet-info').then(({ data }) => setWalletInfo(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.amount && parseFloat(form.amount) > 0) {
      setGasFee((parseFloat(form.amount) * (walletInfo?.gasFeePct || 10)) / 100);
    } else {
      setGasFee(0);
    }
  }, [form.amount, walletInfo]);

  const copyGasFeeAddress = () => {
    navigator.clipboard.writeText(walletInfo?.gasFeeAddress || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Address copied!');
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) return toast.error('Enter a valid amount.');
    if (parseFloat(form.amount) > user?.balance) return toast.error('Insufficient balance.');
    if (!form.walletAddress) return toast.error('Enter your withdrawal wallet address.');
    if (!form.pin || form.pin.length !== 4) return toast.error('Enter your 4-digit PIN.');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please upload gas fee payment proof.');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('amount', form.amount);
      fd.append('walletAddress', form.walletAddress);
      fd.append('pin', form.pin);
      fd.append('gasFeeProof', file);
      await api.post('/transactions/withdrawal', fd);
      toast.success('Withdrawal request submitted! Awaiting admin approval.');
      setForm({ amount: '', walletAddress: '', pin: '' });
      setFile(null); setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Withdraw USDT</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Withdraw USDT to your external wallet</p>

        {/* Balance */}
        <div style={{ background: 'linear-gradient(135deg, rgba(124,110,247,0.1), rgba(0,212,163,0.06))', border: '1px solid rgba(124,110,247,0.2)', borderRadius: 14, padding: '18px 24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Available Balance</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 700, color: '#7c6ef7', marginTop: 2 }}>${user?.balance?.toFixed(2) || '0.00'}</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'right' }}>
            <div>Gas Fee: {walletInfo?.gasFeePct || 10}%</div>
            {gasFee > 0 && <div style={{ color: '#ffa502', fontWeight: 600, marginTop: 4 }}>≈ ${gasFee.toFixed(2)}</div>}
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {['1. Withdrawal Details', '2. Pay Gas Fee'].map((label, i) => (
            <div key={i} style={{ flex: 1, padding: '10px', borderRadius: 10, background: step === i + 1 ? 'rgba(124,110,247,0.1)' : 'var(--bg-card)', border: `1px solid ${step === i + 1 ? 'rgba(124,110,247,0.4)' : 'var(--border)'}`, textAlign: 'center', fontSize: 13, fontWeight: 600, color: step === i + 1 ? '#7c6ef7' : 'var(--text-secondary)' }}>
              {label}
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
          {step === 1 ? (
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Withdrawal Amount (USDT)</label>
                <input type="number" min="1" step="0.01" max={user?.balance} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Enter amount" required
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#7c6ef7'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                {gasFee > 0 && (
                  <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,165,2,0.08)', border: '1px solid rgba(255,165,2,0.2)', fontSize: 13, color: '#ffa502' }}>
                    Gas fee required: <strong>${gasFee.toFixed(2)} USDT</strong> (paid separately — not deducted from balance)
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Your Receiving Wallet Address</label>
                <input type="text" value={form.walletAddress} onChange={e => setForm({ ...form, walletAddress: e.target.value })} placeholder="Enter your USDT wallet address" required
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                  onFocus={e => e.target.style.borderColor = '#7c6ef7'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiLock /> Withdrawal PIN</span>
                </label>
                <input type="password" maxLength={4} value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value.replace(/\D/, '') })} placeholder="4-digit PIN" required
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 20, letterSpacing: 8, outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
                  onFocus={e => e.target.style.borderColor = '#7c6ef7'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #7c6ef7, #6358d4)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,110,247,0.3)' }}>
                Continue to Gas Fee Payment →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Summary */}
              <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['Withdrawal Amount', `$${parseFloat(form.amount).toFixed(2)} USDT`], ['Gas Fee (10%)', `$${gasFee.toFixed(2)} USDT`], ['Recipient Address', form.walletAddress]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                    <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all', fontFamily: k === 'Recipient Address' ? 'monospace' : 'inherit', fontSize: k === 'Recipient Address' ? 11 : 14 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: 16, borderRadius: 10, background: 'rgba(255,71,87,0.05)', border: '1px solid rgba(255,71,87,0.2)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#ff4757' }}>
                  <FiAlertTriangle style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>Pay the gas fee of <strong>${gasFee.toFixed(2)} USDT</strong> to the address below before submitting. The gas fee is NOT deducted from your wallet.</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Gas Fee Payment Address</label>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <code style={{ flex: 1, fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                    {walletInfo?.gasFeeAddress || 'Loading...'}
                  </code>
                  <button type="button" onClick={copyGasFeeAddress} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 8, background: copied ? 'rgba(0,212,163,0.2)' : 'rgba(0,212,163,0.1)', border: '1px solid rgba(0,212,163,0.3)', color: '#00d4a3', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {walletInfo?.gasFeeQR && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>Scan to pay gas fee</div>
                  <img src={walletInfo.gasFeeQR} alt="Gas QR" style={{ width: 130, height: 130, borderRadius: 10, border: '4px solid var(--border)', background: 'white', padding: 4 }} />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Upload Gas Fee Payment Proof</label>
                <label htmlFor="gas-proof" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 24, borderRadius: 12, border: `2px dashed ${file ? '#00d4a3' : 'var(--border)'}`, cursor: 'pointer', background: file ? 'rgba(0,212,163,0.04)' : 'transparent', transition: 'all 0.2s' }}>
                  <FiUpload size={22} style={{ color: file ? '#00d4a3' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 13, color: file ? '#00d4a3' : 'var(--text-secondary)', fontWeight: 500 }}>{file ? file.name : 'Upload gas fee receipt/screenshot'}</span>
                  <input id="gas-proof" type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '13px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '13px', borderRadius: 10, border: 'none', background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #7c6ef7, #6358d4)', color: loading ? 'var(--text-muted)' : 'white', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WithdrawPage;
