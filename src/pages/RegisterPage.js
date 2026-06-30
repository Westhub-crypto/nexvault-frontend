import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiGlobe, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

const COUNTRIES = ['United States','United Kingdom','Nigeria','Canada','Australia','Germany','France','India','Brazil','South Africa','Ghana','Kenya','UAE','Singapore','Philippines','Indonesia','Malaysia','Other'];

const fieldStyle = { width: '100%', padding: '13px 16px 13px 44px', background: '#0a0e14', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9', fontSize: 14.5, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' };

const Field = ({ icon, label, type = 'text', value, onChange, placeholder, ...rest }) => (
  <div>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 9 }}>{label}</label>
    <div style={{ position: 'relative' }}>
      {icon && <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#5a6478', fontSize: 16, zIndex: 1 }}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} {...rest}
        style={fieldStyle}
        onFocus={e => e.target.style.borderColor = '#00e6a8'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
      />
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
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap'); @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ position: 'fixed', top: '8%', right: '5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,124,246,0.08), transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }} />
      <div style={{ position: 'fixed', bottom: '8%', left: '5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,168,0.08), transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }} />

      <div style={{ width: '100%', maxWidth: 460, animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, #00e6a8, #8b7cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#04140f', fontFamily: 'Space Grotesk', boxShadow: '0 8px 24px rgba(0,230,168,0.3)' }}>N</div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 25, color: '#f1f5f9', letterSpacing: -0.5 }}>NexVault</span>
          </Link>
          <p style={{ color: '#94a3b8', marginTop: 14, fontSize: 15 }}>Create your free wallet account</p>
        </div>

        <div style={{ background: '#151b26', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 38, boxShadow: '0 16px 64px rgba(0,0,0,0.4)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field icon={<FiUser />} label="Full Name" value={form.fullName} onChange={set('fullName')} placeholder="John Doe" required />
            <Field icon={<FiMail />} label="Email Address" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
            <Field icon={<FiPhone />} label="Phone Number" value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" required />

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 9 }}>Country</label>
              <div style={{ position: 'relative' }}>
                <FiGlobe style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#5a6478', fontSize: 16, zIndex: 1 }} />
                <select value={form.country} onChange={set('country')} required
                  style={{ ...fieldStyle, color: form.country ? '#f1f5f9' : '#5a6478', cursor: 'pointer', appearance: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#00e6a8'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 9 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#5a6478', fontSize: 16, zIndex: 1 }} />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters" required minLength={8}
                  style={{ ...fieldStyle, padding: '13px 46px 13px 44px' }}
                  onFocus={e => e.target.style.borderColor = '#00e6a8'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a6478', cursor: 'pointer', fontSize: 16 }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <Field icon={<FiLock />} label="Confirm Password" type={showPass ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Confirm password" required />

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px', borderRadius: 12, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#1c2330' : 'linear-gradient(135deg, #00e6a8, #00c794)',
              color: loading ? '#5a6478' : '#04140f', fontSize: 15.5, fontWeight: 700,
              transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 22px rgba(0,230,168,0.32)',
              marginTop: 4,
            }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 26, fontSize: 14, color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00e6a8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, fontSize: 12, color: '#3a4253' }}>
          <FiShield size={12} /> Secured with enterprise-grade encryption
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
  
