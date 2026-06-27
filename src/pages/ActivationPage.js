import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiUpload, FiCopy, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

const ActivationPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.status === 'active') navigate('/dashboard');
    fetchWalletInfo();
  }, [user]);

  const fetchWalletInfo = async () => {
    try {
      const { data } = await api.get('/transactions/wallet-info');
      setWalletInfo(data);
    } catch {}
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletInfo?.activationAddress || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Address copied!');
  };

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
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,165,2,0.1)', border: '2px solid rgba(255,165,2,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
            <FiClock style={{ color: '#ffa502' }} />
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Pending Approval</h2>
          <p style={{ color: '#8892a4', lineHeight: 1.6 }}>Your activation payment is under review. You'll be notified once approved.</p>
        </div>
      </div>
    );
  }

  if (user?.activationStatus === 'rejected') {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,71,87,0.1)', border: '2px solid rgba(255,71,87,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
            <FiAlertCircle style={{ color: '#ff4757' }} />
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Payment Rejected</h2>
          <p style={{ color: '#8892a4', lineHeight: 1.6, marginBottom: 24 }}>Your activation payment was rejected. Please try again with a valid payment proof.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #00d4a3, #00b890)', border: 'none', color: '#0d1117', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap'); @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ width: '100%', maxWidth: 520, animation: 'fadeUp 0.5s ease forwards' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#0d1117', margin: '0 auto 12px', fontFamily: 'Space Grotesk' }}>N</div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Activate Your Account</h1>
          <p style={{ color: '#8892a4', fontSize: 15 }}>Pay the one-time activation fee to access your wallet</p>
        </div>

        <div style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 36 }}>
          {/* Fee info */}
          <div style={{ background: 'linear-gradient(135deg, rgba(0,212,163,0.08), rgba(124,110,247,0.08))', border: '1px solid rgba(0,212,163,0.2)', borderRadius: 14, padding: 20, marginBottom: 28, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#8892a4', marginBottom: 6 }}>Activation Fee</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 40, fontWeight: 700, color: '#00d4a3' }}>${walletInfo?.activationFee || 50}</div>
            <div style={{ fontSize: 13, color: '#8892a4', marginTop: 4 }}>USDT (TRC20 / ERC20)</div>
          </div>

          {/* Wallet address */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8892a4', marginBottom: 10 }}>Send payment to this address:</label>
            <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, wordBreak: 'break-all' }}>
              <code style={{ flex: 1, fontSize: 12, color: '#e2e8f0', fontFamily: 'monospace', lineHeight: 1.5 }}>
                {walletInfo?.activationAddress || 'Loading...'}
              </code>
              <button onClick={copyAddress} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 8, background: copied ? 'rgba(0,212,163,0.2)' : 'rgba(0,212,163,0.1)', border: '1px solid rgba(0,212,163,0.3)', color: '#00d4a3', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* QR Code */}
          {walletInfo?.activationQR && (
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: '#8892a4', marginBottom: 12 }}>Or scan QR code:</div>
              <img src={walletInfo.activationQR} alt="QR Code" style={{ width: 140, height: 140, borderRadius: 10, border: '4px solid rgba(255,255,255,0.08)', background: 'white', padding: 4 }} />
            </div>
          )}

          {/* Upload proof */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8892a4', marginBottom: 10 }}>Upload Payment Proof:</label>
              <label htmlFor="proof-upload" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                padding: 24, borderRadius: 12, border: `2px dashed ${file ? '#00d4a3' : 'rgba(255,255,255,0.12)'}`,
                cursor: 'pointer', background: file ? 'rgba(0,212,163,0.05)' : 'transparent', transition: 'all 0.2s'
              }}>
                <FiUpload size={24} style={{ color: file ? '#00d4a3' : '#4a5568' }} />
                <span style={{ fontSize: 13, color: file ? '#00d4a3' : '#8892a4', fontWeight: 500 }}>
                  {file ? file.name : 'Click to upload screenshot/receipt'}
                </span>
                <span style={{ fontSize: 11, color: '#4a5568' }}>JPG, PNG, PDF up to 10MB</span>
                <input id="proof-upload" type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
              </label>
            </div>

            <button type="submit" disabled={loading || !file} style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              cursor: loading || !file ? 'not-allowed' : 'pointer',
              background: loading || !file ? '#1a2035' : 'linear-gradient(135deg, #00d4a3, #00b890)',
              color: loading || !file ? '#8892a4' : '#0d1117', fontSize: 15, fontWeight: 700, transition: 'all 0.2s'
            }}>
              {loading ? 'Submitting...' : 'Submit Payment Proof'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: 16, borderRadius: 10, background: 'rgba(255,165,2,0.05)', border: '1px solid rgba(255,165,2,0.15)', fontSize: 13, color: '#ffa502', lineHeight: 1.5 }}>
            ⚠️ The activation fee cannot be deducted from your wallet. Please make a direct payment.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
