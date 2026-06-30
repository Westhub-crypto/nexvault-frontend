import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle, FiShield } from 'react-icons/fi';

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
      let msg = 'Login failed. Please try again.';
      if (err.response?.data?.message) msg = err.response.data.message;
      else if (err.message === 'Network Error') msg = `Cannot reach server. Check connection and try again.`;
      else if (err.code === 'ECONNABORTED') msg = 'Request timed out. Try again in a moment.';
      setError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #0a0e14 inset !important; -webkit-text-fill-color: #f1f5f9 !important; }
      `}</style>

      <div style={{ position: 'fixed', top: '15%', left: '5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,168,0.08), transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,124,246,0.08), transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }} />

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, #00e6a8, #8b7cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#04140f', fontFamily: 'Space Grotesk', boxShadow: '0 8px 24px rgba(0,230,168,0.3)' }}>N</div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 25, color: '#f1f5f9', letterSpacing: -0.5 }}>NexVault</span>
          </Link>
          <p style={{ color: '#94a3b8', marginTop: 14, fontSize: 15 }}>Sign in to your wallet</p>
        </div>

        <div style={{ background: '#151b26', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 38, boxShadow: '0 16px 64px rgba(0,0,0,0.4)' }}>
          {error && (
            <div style={{ marginBottom: 20, padding: '14px 16px', borderRadius: 12, background: 'rgba(255,92,114,0.08)', border: '1px solid rgba(255,92,114,0.22)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <FiAlertCircle style={{ color: '#ff5c72', marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#ff5c72', lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 9 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#5a6478', fontSize: 16, zIndex: 1 }} />
                <input type="email" required value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setError(''); }}
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '13px 16px 13px 44px', background: '#0a0e14', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9', fontSize: 14.5, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#00e6a8'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 9 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#5a6478', fontSize: 16, zIndex: 1 }} />
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                  placeholder="Enter your password"
                  style={{ width: '100%', padding: '13px 46px 13px 44px', background: '#0a0e14', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9', fontSize: 14.5, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#00e6a8'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a6478', cursor: 'pointer', fontSize: 16 }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px', borderRadius: 12, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#1c2330' : 'linear-gradient(135deg, #00e6a8, #00c794)',
              color: loading ? '#5a6478' : '#04140f', fontSize: 15.5, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 22px rgba(0,230,168,0.32)',
            }}>
              {loading ? 'Signing in...' : <><span>Sign In</span><FiArrowRight /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 26, fontSize: 14, color: '#94a3b8' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#00e6a8', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, fontSize: 12, color: '#3a4253' }}>
          <FiShield size={12} /> Secured with enterprise-grade encryption
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
    
