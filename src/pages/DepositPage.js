import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiCopy, FiCheck, FiUpload, FiInfo } from 'react-icons/fi';

const DepositPage = () => {
  const [walletInfo, setWalletInfo] = useState(null);
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1); // 1=info, 2=upload

  useEffect(() => {
    api.get('/transactions/wallet-info').then(({ data }) => setWalletInfo(data)).catch(() => {});
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletInfo?.depositAddress || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Address copied!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return toast.error('Enter a valid amount.');
    if (!file) return toast.error('Please upload proof of payment.');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('amount', amount);
      fd.append('proof', file);
      await api.post('/transactions/deposit', fd);
      toast.success('Deposit submitted! Awaiting admin approval.');
      setAmount(''); setFile(null); setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Deposit USDT</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Send USDT to the address below and upload your proof of payment</p>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[1, 2].map(s => (
            <div key={s} onClick={() => setStep(s)} style={{ flex: 1, padding: '10px 16px', borderRadius: 10, background: step === s ? 'rgba(0,212,163,0.1)' : 'var(--bg-card)', border: `1px solid ${step === s ? 'rgba(0,212,163,0.4)' : 'var(--border)'}`, cursor: 'pointer', textAlign: 'center', fontSize: 13, fontWeight: 600, color: step === s ? '#00d4a3' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
              {s === 1 ? '1. Wallet Address' : '2. Submit Proof'}
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(0,212,163,0.08), rgba(124,110,247,0.08))', border: '1px solid rgba(0,212,163,0.2)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Minimum Deposit</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 700, color: '#00d4a3', marginTop: 4 }}>$10 USDT</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Deposit Wallet Address (TRC20/ERC20)</label>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <code style={{ flex: 1, fontSize: 12, color: 'var(--text-primary)', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.5 }}>
                    {walletInfo?.depositAddress || 'Loading...'}
                  </code>
                  <button onClick={copyAddress} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 8, background: copied ? 'rgba(0,212,163,0.2)' : 'rgba(0,212,163,0.1)', border: '1px solid rgba(0,212,163,0.3)', color: '#00d4a3', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                    {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {walletInfo?.depositQR && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Scan QR Code</div>
                  <img src={walletInfo.depositQR} alt="QR" style={{ width: 150, height: 150, borderRadius: 12, border: '4px solid var(--border)', background: 'white', padding: 4 }} />
                </div>
              )}

              <div style={{ padding: 16, borderRadius: 10, background: 'rgba(255,165,2,0.05)', border: '1px solid rgba(255,165,2,0.15)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <FiInfo style={{ color: '#ffa502', marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#ffa502', lineHeight: 1.6, margin: 0 }}>
                  After sending, click "Submit Proof" to upload your payment screenshot. Your balance will be credited after admin verification.
                </p>
              </div>

              <button onClick={() => setStep(2)} style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #00d4a3, #00b890)', color: '#0d1117', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,212,163,0.3)' }}>
                I've Sent Payment →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Amount Sent (USDT)</label>
                <input
                  type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 100" required
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#00d4a3'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Upload Payment Proof</label>
                <label htmlFor="dep-proof" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 28, borderRadius: 12, border: `2px dashed ${file ? '#00d4a3' : 'var(--border)'}`, cursor: 'pointer', background: file ? 'rgba(0,212,163,0.04)' : 'transparent', transition: 'all 0.2s' }}>
                  <FiUpload size={24} style={{ color: file ? '#00d4a3' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 13, color: file ? '#00d4a3' : 'var(--text-secondary)', fontWeight: 500 }}>{file ? file.name : 'Click to upload screenshot or receipt'}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>JPG, PNG, PDF up to 10MB</span>
                  <input id="dep-proof" type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '13px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  ← Back
                </button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '13px', borderRadius: 10, border: 'none', background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #00d4a3, #00b890)', color: loading ? 'var(--text-muted)' : '#0d1117', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Submitting...' : 'Submit Deposit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DepositPage;
