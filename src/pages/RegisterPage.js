import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiGlobe, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const COUNTRIES = ['United States','United Kingdom','Nigeria','Canada','Australia','Germany','France','India','Brazil','South Africa','Ghana','Kenya','UAE','Singapore','Philippines','Indonesia','Malaysia','Other'];

const Field = ({ icon, label, type = 'text', value, onChange, placeholder, children, ...rest }) => (
  <div>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8892a4', marginBottom: 8 }}>{label}</label>
    <div style={{ position: 'relative' }}>
      {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a5568', fontSize: 16 }}>{icon}</span>}
      {children || (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} {...rest}
          style={{ width: '100%', padding: `12px 16px 12px ${icon ? '42px' : '16px'}`, background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = '#00d4a3'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
      )}
    </div>
  </div>
);

const RegisterPage = () => {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', country: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match.');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters.');
    setLoading(true);
    try {
      await register({ fullName: form.fullName, email: form.email, phone: form.phone, country: form.country, password: form.password });
      toast.success('Account created! Please complete activation.');
      navigate('/activate');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap'); @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ position: 'fixed', top: '10%', right: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,110,247,0.07), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,163,0.07), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, animation: 'fadeUp 0.5s ease forwards' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#0d1117', fontFamily: 'Space Grotesk' }}>N</div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 24, background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NexVault</span>
          </Link>
          <p style={{ color: '#8892a4', marginTop: 12, fontSize: 15 }}>Create your free wallet account</p>
        </div>

        <div style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 36 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field icon={<FiUser />} label="Full Name" value={form.fullName} onChange={set('fullName')} placeholder="John Doe" required />
            <Field icon={<FiMail />} label="Email Address" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
            <Field icon={<FiPhone />} label="Phone Number" value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" required />

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8892a4', marginBottom: 8 }}>Country</label>
              <div style={{ position: 'relative' }}>
                <FiGlobe style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a5568', fontSize: 16 }} />
                <select value={form.country} onChange={set('country')} required
                  style={{ width: '100%', padding: '12px 16px 12px 42px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: form.country ? '#e2e8f0' : '#4a5568', fontSize: 14, outline: 'none', boxSizing: 'border-box', cursor: 'pointer', appearance: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#00d4a3'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8892a4', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a5568', fontSize: 16 }} />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters" required minLength={8}
                  style={{ width: '100%', padding: '12px 44px 12px 42px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#00d4a3'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', fontSize: 16 }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#8892a4', marginBottom: 8 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a5568', fontSize: 16 }} />
                <input type={showPass ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Confirm password" required
                  style={{ width: '100%', padding: '12px 16px 12px 42px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#00d4a3'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#1a2035' : 'linear-gradient(135deg, #00d4a3, #00b890)',
              color: loading ? '#8892a4' : '#0d1117', fontSize: 15, fontWeight: 700,
              transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 20px rgba(0,212,163,0.3)',
              marginTop: 4
            }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#8892a4' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00d4a3', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
