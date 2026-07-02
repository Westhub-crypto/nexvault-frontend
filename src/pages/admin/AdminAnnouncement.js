import React, { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiRadio, FiSend, FiUsers, FiCheckCircle } from 'react-icons/fi';

const AdminAnnouncement = () => {
  const [form, setForm] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return toast.error('Title and message are required.');
    setLoading(true);
    try {
      const { data } = await api.post('/admin/announce', form);
      // Extract count from message like "Announcement sent to 12 users."
      const match = data.message?.match(/(\d+)/);
      setSentCount(match ? parseInt(match[1]) : 0);
      setSent(true);
      setForm({ title: '', message: '' });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send announcement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ padding: '28px 24px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(255,92,114,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff5c72', fontSize: 20 }}>
            <FiRadio />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 23, fontWeight: 700, letterSpacing: -0.4 }}>Send Announcement</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Broadcast a notification to all active users on the platform</p>

        {/* Success state */}
        {sent && (
          <div style={{ marginBottom: 24, padding: '20px 24px', borderRadius: 16, background: 'rgba(0,230,168,0.07)', border: '1px solid rgba(0,230,168,0.25)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(0,230,168,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiCheckCircle size={22} style={{ color: '#00e6a8' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, color: '#00e6a8', marginBottom: 3 }}>Announcement Sent!</div>
              <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                Successfully delivered to <strong style={{ color: 'var(--text-primary)' }}>{sentCount} active users</strong>.
              </div>
            </div>
            <button onClick={() => setSent(false)} style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(0,230,168,0.3)', background: 'transparent', color: '#00e6a8', cursor: 'pointer', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
              Send Another
            </button>
          </div>
        )}

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 22, padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 9 }}>Announcement Title</label>
              <input type="text" value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} placeholder="e.g. Scheduled Maintenance Notice" required maxLength={100}
                style={{ width: '100%', padding: '13px 16px', background: 'var(--bg-primary)', border: '1.5px solid var(--border)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 14.5, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 9 }}>Message</label>
              <textarea value={form.message} onChange={e => setForm(s => ({ ...s, message: e.target.value }))} placeholder="Write your announcement here..." required rows={6} maxLength={1000}
                style={{ width: '100%', padding: '13px 16px', background: 'var(--bg-primary)', border: '1.5px solid var(--border)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 14.5, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.65, transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right', marginTop: 6 }}>{form.message.length}/1000</div>
            </div>

            {/* Preview */}
            {(form.title || form.message) && (
              <div style={{ padding: 18, borderRadius: 14, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>Preview</div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(255,92,114,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff5c72', fontSize: 19, flexShrink: 0 }}>
                    <FiRadio />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 5, color: 'var(--text-primary)' }}>{form.title || 'Announcement title...'}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{form.message || 'Message will appear here...'}</div>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '15px', borderRadius: 13, border: 'none',
              background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #00e6a8, #00c794)',
              color: loading ? 'var(--text-muted)' : '#04140f',
              fontSize: 15.5, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(0,230,168,0.3)',
              transition: 'var(--transition)',
            }}>
              <FiSend size={15} /> {loading ? 'Sending...' : 'Send to All Active Users'}
            </button>
          </form>
        </div>

        {/* Info card */}
        <div style={{ marginTop: 18, padding: '16px 20px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,124,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b7cf6', fontSize: 17, flexShrink: 0 }}>
            <FiUsers />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)', marginBottom: 4 }}>Who receives announcements?</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Announcements are delivered as notifications to all users with <strong style={{ color: '#00e6a8' }}>active</strong> accounts. Users will see them in their Notifications panel in real time.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAnnouncement;
