import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'https://nexvault-api.onrender.com/api';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { isAdmin } = await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.message === 'Network Error' ? 'Cannot reach server. Check your API URL in Render environment variables.' : 'Login failed. Please try again.');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #0d1117 inset !important; -webkit-text-fill-color: #e2e8f0 !important; }
      `}</style>

      <div style={{ position: 'fixed', top: '15%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,163,0.06), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,110,247,0.06), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.5s ease forwards' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#0d1117', fontFamily: 'Space Grotesk' }}>N</div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 24, background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NexVault</span>
          </Link>
          <p style={{ color: '#8892a4', marginTop: 12, fontSize: 15 }}>Sign in to your wallet</p>
        </div>

        {/* Card */}
        <div style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 36 }}>

          {/* Error banner */}
          {error && (
            <div style={{ marginBottom: 20, padding: '14px 16px', borderRadius: 10, background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.25)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <FiAlertCircle style={{ color: '#ff4757', marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#ff4757', lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8892a4', marginBottom: 8 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a5568', fontSize: 16, zIndex: 1 }} />
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setError(''); }}
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '12px 16px 12px 42px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#00d4a3'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8892a4', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a5568', fontSize: 16, zIndex: 1 }} />
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                  placeholder="Enter your password"
                  style={{ width: '100%', padding: '12px 44px 12px 42px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#00d4a3'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', fontSize: 16 }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#1a2035' : 'linear-gradient(135deg, #00d4a3, #00b890)',
              color: loading ? '#8892a4' : '#0d1117', fontSize: 15, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 20px rgba(0,212,163,0.3)'
            }}>
              {loading ? 'Signing in...' : <><span>Sign In</span><FiArrowRight /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#8892a4' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#00d4a3', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
          </p>

          {/* Debug info - shows API being used */}
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 10, color: '#2d3748', wordBreak: 'break-all' }}>
            API: {API_URL}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
      
