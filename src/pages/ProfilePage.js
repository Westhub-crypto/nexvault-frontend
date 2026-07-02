import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiGlobe, FiLock, FiShield, FiSave, FiEdit3 } from 'react-icons/fi';

const inputStyle = { width: '100%', padding: '13px 16px', background: 'var(--bg-primary)', border: '1.5px solid var(--border)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 14.5, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' };

const Section = ({ title, icon, children }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>
    <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: 16 }}>{icon}</div>
      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3 }}>{title}</h3>
    </div>
    <div style={{ padding: 24 }}>{children}</div>
  </div>
);

const Field = ({ label, icon, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
      {icon && <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{icon}</span>} {label}
    </label>
    <input {...props} style={inputStyle}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
    />
  </div>
);

const SubmitBtn = ({ loading, label }) => (
  <button type="submit" disabled={loading} style={{
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: 'none',
    background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #00e6a8, #00c794)',
    color: loading ? 'var(--text-muted)' : '#04140f', fontSize: 14, fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer',
    boxShadow: loading ? 'none' : '0 4px 18px rgba(0,230,168,0.28)',
    transition: 'var(--transition)',
  }}>
    <FiSave size={15} /> {loading ? 'Saving...' : label}
  </button>
);

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({ fullName: user?.fullName || '', phone: user?.phone || '', country: user?.country || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pin, setPin] = useState({ currentPin: '', newPin: '', confirmPin: '' });
  const [saving, setSaving] = useState({ profile: false, password: false, pin: false });

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(s => ({ ...s, profile: true }));
    try {
      await api.put('/auth/profile', profile);
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed.'); }
    finally { setSaving(s => ({ ...s, profile: false })); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match.');
    if (passwords.newPassword.length < 8) return toast.error('Password must be at least 8 characters.');
    setSaving(s => ({ ...s, password: true }));
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password.'); }
    finally { setSaving(s => ({ ...s, password: false })); }
  };

  const savePin = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin.newPin)) return toast.error('PIN must be exactly 4 digits.');
    if (pin.newPin !== pin.confirmPin) return toast.error('PINs do not match.');
    setSaving(s => ({ ...s, pin: true }));
    try {
      await api.put('/auth/withdrawal-pin', { pin: pin.newPin, currentPin: pin.currentPin || undefined });
      toast.success('Withdrawal PIN updated!');
      setPin({ currentPin: '', newPin: '', confirmPin: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update PIN.'); }
    finally { setSaving(s => ({ ...s, pin: false })); }
  };

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 700, margin: '0 auto' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, padding: '24px 28px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #00e6a8, #8b7cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#04140f', flexShrink: 0, boxShadow: '0 8px 24px rgba(0,230,168,0.3)' }}>
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 21, fontWeight: 700, marginBottom: 4, letterSpacing: -0.4 }}>{user?.fullName}</h1>
            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 8 }}>{user?.email}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', background: 'rgba(0,230,168,0.1)', color: '#00e6a8', border: '1px solid rgba(0,230,168,0.3)' }}>
                {user?.status}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', background: 'rgba(139,124,246,0.1)', color: '#8b7cf6', border: '1px solid rgba(139,124,246,0.3)' }}>
                {user?.country}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Balance</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: '#00e6a8', letterSpacing: -0.5 }}>${user?.balance?.toFixed(2) || '0.00'}</div>
          </div>
        </div>

        {/* Personal Info */}
        <Section title="Personal Information" icon={<FiEdit3 />}>
          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <Field label="Full Name" icon={<FiUser />} value={profile.fullName} onChange={e => setProfile(s => ({ ...s, fullName: e.target.value }))} required />
              <Field label="Phone Number" icon={<FiPhone />} value={profile.phone} onChange={e => setProfile(s => ({ ...s, phone: e.target.value }))} required />
              <Field label="Country" icon={<FiGlobe />} value={profile.country} onChange={e => setProfile(s => ({ ...s, country: e.target.value }))} required />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiMail style={{ fontSize: 14, color: 'var(--text-muted)' }} /> Email (read-only)
                </label>
                <input value={user?.email || ''} readOnly style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
              </div>
            </div>
            <div><SubmitBtn loading={saving.profile} label="Save Profile" /></div>
          </form>
        </Section>

        {/* Change Password */}
        <Section title="Change Password" icon={<FiLock />}>
          <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Current Password" type="password" value={passwords.currentPassword} onChange={e => setPasswords(s => ({ ...s, currentPassword: e.target.value }))} placeholder="Enter current password" required />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <Field label="New Password" type="password" value={passwords.newPassword} onChange={e => setPasswords(s => ({ ...s, newPassword: e.target.value }))} placeholder="Min. 8 characters" required minLength={8} />
              <Field label="Confirm New Password" type="password" value={passwords.confirmPassword} onChange={e => setPasswords(s => ({ ...s, confirmPassword: e.target.value }))} placeholder="Repeat new password" required />
            </div>
            <div><SubmitBtn loading={saving.password} label="Change Password" /></div>
          </form>
        </Section>

        {/* Withdrawal PIN */}
        <Section title="Withdrawal PIN" icon={<FiShield />}>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            Your 4-digit PIN is required for all withdrawals and transfers. Never share it with anyone.
          </p>
          <form onSubmit={savePin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Current PIN (if already set)" type="password" maxLength={4} value={pin.currentPin} onChange={e => setPin(s => ({ ...s, currentPin: e.target.value.replace(/\D/, '') }))} placeholder="Enter current PIN" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {[['newPin', 'New PIN'], ['confirmPin', 'Confirm PIN']].map(([key, label]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 7 }}>{label}</label>
                  <input type="password" maxLength={4} value={pin[key]} onChange={e => setPin(s => ({ ...s, [key]: e.target.value.replace(/\D/, '') }))} placeholder="••••" required
                    style={{ ...inputStyle, fontSize: 26, letterSpacing: 12, textAlign: 'center' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}
            </div>
            <div><SubmitBtn loading={saving.pin} label="Save PIN" /></div>
          </form>
        </Section>
      </div>
    </Layout>
  );
};

export default ProfilePage;
