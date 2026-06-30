import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import WalletPaymentCard from '../components/WalletPaymentCard';
import { FiUpload, FiClock, FiAlertCircle, FiShield } from 'react-icons/fi';

const ActivationPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.status === 'active') navigate('/dashboard');
    api.get('/transactions/wallet-info').then(({ data }) => setWalletInfo(data)).catch(() => {});
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please upload proof of payment.');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('proof', file);
      await api.post('/transactions/activation', formData);
      await refreshUser();
      toast.success('Activation payment submitted! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.activationStatus === 'pending') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'rgba(255,181,71,0.1)', border: '2px solid rgba(255,181,71,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
            <FiClock style={{ color: 'var(--warning)' }} />
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Pending Approval</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Your activation payment is under review. You'll be notified once approved.</p>
        </div>
      </div>
    );
  }

  if (user?.activationStatus === 'rejected') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'rgba(255,92,114,0.1)', border: '2px solid rgba(255,92,114,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
            <FiAlertCircle style={{ color: 'var(--danger)' }} />
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Payment Rejected</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>Your activation payment was rejected. Please try again with a valid payment proof.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap'); @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ width: '100%', maxWidth: 460, animation: 'fadeUp 0.5s ease forwards' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: 'linear-gradient(135deg, #00e6a8, #8b7cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#04140f', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,230,168,0.3)' }}>
            <FiShield />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 25, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)', letterSpacing: -0.4 }}>Activate Your Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14.5 }}>One-time activation fee to unlock your wallet</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 22, padding: 26 }}>
          <WalletPaymentCard
            address={walletInfo?.activationAddress}
            qrCode={walletInfo?.activationQR}
            network={walletInfo?.network}
            networkFull={walletInfo?.networkFull}
            tokenSymbol={walletInfo?.tokenSymbol}
            amountLabel="Activation Fee"
            amountValue={`$${walletInfo?.activationFee || 50} ${walletInfo?.tokenSymbol || 'USDT'}`}
          />

          <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Upload Payment Proof</label>
              <label htmlFor="proof-upload" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                padding: 24, borderRadius: 14, border: `1.5px dashed ${file ? 'var(--accent)' : 'var(--border-strong)'}`,
                cursor: 'pointer', background: file ? 'var(--accent-glow)' : 'var(--bg-primary)', transition: 'var(--transition)',
              }}>
                <FiUpload size={22} style={{ color: file ? 'var(--accent)' : 'var(--text-muted)' }} />
                <span style={{ fontSize: 13, color: file ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 500 }}>
                  {file ? file.name : 'Click to upload screenshot or receipt'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>JPG, PNG, PDF up to 10MB</span>
                <input id="proof-upload" type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
              </label>
            </div>

            <button type="submit" disabled={loading || !file} className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
              {loading ? 'Submitting...' : 'Submit Payment Proof'}
            </button>
          </form>

          <div style={{ marginTop: 18, padding: 14, borderRadius: 12, background: 'rgba(255,181,71,0.06)', border: '1px solid rgba(255,181,71,0.18)', fontSize: 12.5, color: 'var(--warning)', lineHeight: 1.6 }}>
            The activation fee cannot be deducted from your wallet balance. A direct on-chain payment is required.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
