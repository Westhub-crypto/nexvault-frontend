import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import WalletPaymentCard from '../components/WalletPaymentCard';
import { FiUpload, FiAlertTriangle, FiLock, FiArrowUpCircle } from 'react-icons/fi';

const WithdrawPage = () => {
  const { user } = useAuth();
  const [walletInfo, setWalletInfo] = useState(null);
  const [form, setForm] = useState({ amount: '', walletAddress: '', pin: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
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
      <div style={{ padding: '28px 24px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--accent2-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent2)', fontSize: 18 }}>
            <FiArrowUpCircle />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 23, fontWeight: 700, letterSpacing: -0.4 }}>Withdraw USDT</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 22 }}>Withdraw USDT to your external wallet</p>

        {/* Balance */}
        <div style={{ background: 'linear-gradient(135deg, var(--accent2-glow), var(--accent-glow))', border: '1px solid rgba(139,124,246,0.22)', borderRadius: 16, padding: '18px 22px', marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Available Balance</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 800, color: 'var(--accent2)', marginTop: 2, letterSpacing: -0.5 }}>${user?.balance?.toFixed(2) || '0.00'}</div>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', textAlign: 'right' }}>
            <div>Gas Fee: {walletInfo?.gasFeePct || 10}%</div>
            {gasFee > 0 && <div style={{ color: 'var(--warning)', fontWeight: 700, marginTop: 4 }}>≈ ${gasFee.toFixed(2)}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['1 · Withdrawal Details', '2 · Pay Gas Fee'].map((label, i) => (
            <div key={i} style={{
              flex: 1, padding: '11px', borderRadius: 12, textAlign: 'center', fontSize: 13, fontWeight: 600,
              background: step === i + 1 ? 'var(--accent2-glow)' : 'var(--bg-card)',
              border: `1.5px solid ${step === i + 1 ? 'rgba(139,124,246,0.4)' : 'var(--border)'}`,
              color: step === i + 1 ? 'var(--accent2)' : 'var(--text-secondary)',
            }}>{label}</div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 22, padding: 26 }}>
          {step === 1 ? (
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Withdrawal Amount (USDT)</label>
                <input type="number" min="1" step="0.01" max={user?.balance} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Enter amount" required className="input-field" />
                {gasFee > 0 && (
                  <div style={{ marginTop: 10, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,181,71,0.08)', border: '1px solid rgba(255,181,71,0.22)', fontSize: 13, color: 'var(--warning)' }}>
                    Gas fee required: <strong>${gasFee.toFixed(2)} USDT</strong> (paid separately — not deducted from balance)
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Your Receiving Wallet Address</label>
                <input type="text" value={form.walletAddress} onChange={e => setForm({ ...form, walletAddress: e.target.value })} placeholder="Enter your USDT wallet address" required className="input-field" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <FiLock /> Withdrawal PIN
                </label>
                <input type="password" maxLength={4} value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value.replace(/\D/, '') })} placeholder="••••" required className="input-field" style={{ fontSize: 22, letterSpacing: 10, textAlign: 'center' }} />
              </div>
              <button type="submit" className="btn" style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #8b7cf6, #7160e8)', color: 'white', boxShadow: '0 4px 20px rgba(139,124,246,0.3)' }}>
                Continue to Gas Fee Payment →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Summary */}
              <div style={{ background: 'var(--bg-primary)', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid var(--border)' }}>
                {[['Withdrawal Amount', `$${parseFloat(form.amount).toFixed(2)} USDT`], ['Gas Fee (10%)', `$${gasFee.toFixed(2)} USDT`], ['Recipient Address', form.walletAddress]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13.5 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                    <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all', fontFamily: k === 'Recipient Address' ? 'var(--font-mono)' : 'inherit', fontSize: k === 'Recipient Address' ? 11 : 13.5 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="network-warning" style={{ background: 'rgba(255,92,114,0.07)', border: '1px solid rgba(255,92,114,0.2)', color: 'var(--danger)' }}>
                <FiAlertTriangle style={{ marginTop: 1, flexShrink: 0 }} />
                <span>Pay the gas fee of <strong>${gasFee.toFixed(2)} USDT</strong> to the address below before submitting. This is required to process your withdrawal.</span>
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
                <label htmlFor="gas-proof" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 24, borderRadius: 14,
                  border: `1.5px dashed ${file ? 'var(--accent)' : 'var(--border-strong)'}`, cursor: 'pointer',
                  background: file ? 'var(--accent-glow)' : 'var(--bg-primary)', transition: 'var(--transition)',
                }}>
                  <FiUpload size={22} style={{ color: file ? 'var(--accent)' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 13, color: file ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 500 }}>{file ? file.name : 'Upload gas fee receipt/screenshot'}</span>
                  <input id="gas-proof" type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>← Back</button>
                <button type="submit" disabled={loading} className="btn" style={{ flex: 2, background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #8b7cf6, #7160e8)', color: loading ? 'var(--text-muted)' : 'white' }}>
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
