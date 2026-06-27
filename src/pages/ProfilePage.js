import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiGlobe, FiLock, FiShield, FiSave } from 'react-icons/fi';

const Section = ({ title, icon, children }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
    <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ color: 'var(--accent)', fontSize: 18 }}>{icon}</span>
      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600 }}>{title}</h3>
    </div>
    <div style={{ padding: 24 }}>{children}</div>
  </div>
);

const Field = ({ label, icon, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }}>{icon}</span>}
      <input {...props} style={{ width: '100%', padding: `12px 16px 12px ${icon ? '42px' : '16px'}`, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
        onFocus={e => e.target.style.borderColor = '#00d4a3'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  </div>
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

  const SubmitBtn = ({ loading, label }) => (
    <button type="submit" disabled={loading} style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, border: 'none',
      background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #00d4a3, #00b890)',
      color: loading ? 'var(--text-muted)' : '#0d1117', fontSize: 14, fontWeight: 700,
      cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 16px rgba(0,212,163,0.25)'
    }}><FiSave />{loading ? 'Saving...' : label}</button>
  );

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#0d1117', flexShrink: 0 }}>
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{user?.fullName}</h1>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user?.email}</div>
            <span style={{ display: 'inline-block', marginTop: 6, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: 'rgba(0,212,163,0.1)', color: '#00d4a3', border: '1px solid rgba(0,212,163,0.3)' }}>
              {user?.status}
            </span>
          </div>
        </div>

        {/* Profile info */}
        <Section title="Personal Information" icon={<FiUser />}>
          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <Field label="Full Name" icon={<FiUser />} value={profile.fullName} onChange={e => setProfile(s => ({ ...s, fullName: e.target.value }))} required />
              <Field label="Phone Number" icon={<FiPhone />} value={profile.phone} onChange={e => setProfile(s => ({ ...s, phone: e.target.value }))} required />
              <Field label="Country" icon={<FiGlobe />} value={profile.country} onChange={e => setProfile(s => ({ ...s, country: e.target.value }))} required />
              <Field label="Email (read-only)" icon={<FiMail />} value={user?.email || ''} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div><SubmitBtn loading={saving.profile} label="Save Profile" /></div>
          </form>
        </Section>

        {/* Change password */}
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
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Your 4-digit PIN is required for all withdrawals and transfers. Keep it secret and secure.
          </p>
          <form onSubmit={savePin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {user?.withdrawalPin !== undefined && (
              <Field label="Current PIN (if set)" type="password" maxLength={4} value={pin.currentPin} onChange={e => setPin(s => ({ ...s, currentPin: e.target.value.replace(/\D/, '') }))} placeholder="Enter current PIN" />
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>New PIN</label>
                <input type="password" maxLength={4} value={pin.newPin} onChange={e => setPin(s => ({ ...s, newPin: e.target.value.replace(/\D/, '') }))} placeholder="••••" required
                  style={{ width: '100%', padding: '14px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 24, letterSpacing: 10, outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
                  onFocus={e => e.target.style.borderColor = '#00d4a3'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Confirm PIN</label>
                <input type="password" maxLength={4} value={pin.confirmPin} onChange={e => setPin(s => ({ ...s, confirmPin: e.target.value.replace(/\D/, '') }))} placeholder="••••" required
                  style={{ width: '100%', padding: '14px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 24, letterSpacing: 10, outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
                  onFocus={e => e.target.style.borderColor = '#00d4a3'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            <div><SubmitBtn loading={saving.pin} label="Save PIN" /></div>
          </form>
        </Section>
      </div>
    </Layout>
  );
};

export default ProfilePage;
