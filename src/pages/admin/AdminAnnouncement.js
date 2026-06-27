import React, { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiMegaphone, FiSend } from 'react-icons/fi';

const AdminAnnouncement = () => {
  const [form, setForm] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return toast.error('Title and message are required.');
    setLoading(true);
    try {
      const { data } = await api.post('/admin/announce', form);
      toast.success(data.message);
      setSent(true);
      setForm({ title: '', message: '' });
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send announcement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Send Announcement</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>Broadcast a notification to all active users</p>

        {sent && (
          <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(0,212,163,0.08)', border: '1px solid rgba(0,212,163,0.25)', color: '#00d4a3', fontSize: 14, fontWeight: 500, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            ✓ Announcement sent successfully to all active users!
          </div>
        )}

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Announcement Title</label>
              <input type="text" value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} placeholder="e.g. Scheduled Maintenance" required maxLength={100}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = '#00d4a3'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Message</label>
              <textarea value={form.message} onChange={e => setForm(s => ({ ...s, message: e.target.value }))} placeholder="Write your announcement here..." required rows={6} maxLength={1000}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = '#00d4a3'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right', marginTop: 6 }}>{form.message.length}/1000</div>
            </div>

            {/* Preview */}
            {(form.title || form.message) && (
              <div style={{ padding: 18, borderRadius: 12, background: 'rgba(124,110,247,0.05)', border: '1px solid rgba(124,110,247,0.15)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Preview</div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,71,87,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4757', fontSize: 18, flexShrink: 0 }}>
                    <FiMegaphone />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{form.title || 'Announcement title...'}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{form.message || 'Message will appear here...'}</div>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #00d4a3, #00b890)',
              color: loading ? 'var(--text-muted)' : '#0d1117',
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(0,212,163,0.3)'
            }}>
              <FiSend /> {loading ? 'Sending...' : 'Send to All Active Users'}
            </button>
          </form>
        </div>

        <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          💡 Announcements are sent as notifications to all active users. They will see it in their Notifications panel.
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnnouncement;
