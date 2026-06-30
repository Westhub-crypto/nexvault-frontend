import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import WalletPaymentCard from '../components/WalletPaymentCard';
import { FiUpload, FiArrowDownCircle } from 'react-icons/fi';

const DepositPage = () => {
  const [walletInfo, setWalletInfo] = useState(null);
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    api.get('/transactions/wallet-info').then(({ data }) => setWalletInfo(data)).catch(() => {});
  }, []);

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
      <div style={{ padding: '28px 24px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: 18 }}>
            <FiArrowDownCircle />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 23, fontWeight: 700, letterSpacing: -0.4 }}>Deposit USDT</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 26 }}>Fund your wallet by sending USDT to your deposit address</p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[1, 2].map(s => (
            <div key={s} onClick={() => setStep(s)} style={{
              flex: 1, padding: '11px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
              fontSize: 13, fontWeight: 600, transition: 'var(--transition)',
              background: step === s ? 'var(--accent-glow)' : 'var(--bg-card)',
              border: `1.5px solid ${step === s ? 'rgba(0,230,168,0.4)' : 'var(--border)'}`,
              color: step === s ? 'var(--accent)' : 'var(--text-secondary)',
            }}>
              {s === 1 ? '1 · Send Payment' : '2 · Submit Proof'}
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 22, padding: 26 }}>
          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <WalletPaymentCard
                address={walletInfo?.depositAddress}
                qrCode={walletInfo?.depositQR}
                network={walletInfo?.network}
                networkFull={walletInfo?.networkFull}
                tokenSymbol={walletInfo?.tokenSymbol}
                amountLabel="Minimum Deposit"
                amountValue={`$10 ${walletInfo?.tokenSymbol || 'USDT'}`}
              />
              <button onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
                I've Sent Payment →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Amount Sent ({walletInfo?.tokenSymbol || 'USDT'})</label>
                <input type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 100" required className="input-field" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Upload Payment Proof</label>
                <label htmlFor="dep-proof" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 28, borderRadius: 14,
                  border: `1.5px dashed ${file ? 'var(--accent)' : 'var(--border-strong)'}`, cursor: 'pointer',
                  background: file ? 'var(--accent-glow)' : 'var(--bg-primary)', transition: 'var(--transition)',
                }}>
                  <FiUpload size={22} style={{ color: file ? 'var(--accent)' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 13, color: file ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 500 }}>{file ? file.name : 'Click to upload screenshot or receipt'}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>JPG, PNG, PDF up to 10MB</span>
                  <input id="dep-proof" type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>← Back</button>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
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
