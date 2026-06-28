import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiZap, FiGlobe, FiLock, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e2e8f0', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes glow-pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }
        .feature-card { transition: transform 0.3s, border-color 0.3s; }
        .feature-card:hover { transform: translateY(-8px); border-color: rgba(0,212,163,0.4) !important; }
        .cta-btn { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,212,163,0.4) !important; }
      `}</style>

      {/* Navbar */}
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', top: 0, width: '100%', zIndex: 100, background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#0d1117', fontFamily: 'Space Grotesk' }}>N</div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NexVault</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Sign In</Link>
          <Link to="/register" className="cta-btn" style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #00d4a3, #00b890)', color: '#0d1117', textDecoration: 'none', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 20px rgba(0,212,163,0.3)' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 40px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,163,0.08), transparent 70%)', animation: 'glow-pulse 4s ease infinite' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,110,247,0.08), transparent 70%)', animation: 'glow-pulse 4s ease infinite 2s' }} />
        <div style={{ maxWidth: 800, textAlign: 'center', position: 'relative' }}>
          <div className="fade-up delay-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, border: '1px solid rgba(0,212,163,0.3)', background: 'rgba(0,212,163,0.08)', fontSize: 13, color: '#00d4a3', marginBottom: 24, fontWeight: 500 }}>
            <FiShield size={12} /> Enterprise-Grade USDT Wallet
          </div>
          <h1 className="fade-up delay-2" style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
            Your Digital Assets,<br />
            <span style={{ background: 'linear-gradient(135deg, #00d4a3 0%, #7c6ef7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Secured & Smart</span>
          </h1>
          <p className="fade-up delay-3" style={{ fontSize: 18, color: '#8892a4', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
            NexVault is a premium USDT wallet platform built for security and simplicity. Send, receive, and manage your USDT with enterprise-level protection.
          </p>
          <div className="fade-up delay-4" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #00d4a3, #00b890)', color: '#0d1117', textDecoration: 'none', fontSize: 16, fontWeight: 700, boxShadow: '0 4px 28px rgba(0,212,163,0.35)' }}>
              Create Free Account <FiArrowRight />
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}>
              Sign In
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
            {[['$2M+', 'Total Volume'], ['10K+', 'Active Users'], ['99.9%', 'Uptime']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 700, color: '#00d4a3' }}>{val}</div>
                <div style={{ fontSize: 13, color: '#8892a4', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, marginBottom: 16 }}>Everything you need to manage USDT</h2>
          <p style={{ color: '#8892a4', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>A complete financial platform designed for security and ease of use.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { icon: <FiShield size={24} />, color: '#00d4a3', rgb: '0,212,163', title: 'Bank-Level Security', desc: 'JWT authentication, PIN protection, rate limiting, and enterprise-grade encryption on every transaction.' },
            { icon: <FiZap size={24} />, color: '#7c6ef7', rgb: '124,110,247', title: 'Instant Transfers', desc: 'Send USDT to any NexVault user instantly, or to any external USDT wallet address worldwide.' },
            { icon: <FiGlobe size={24} />, color: '#ffa502', rgb: '255,165,2', title: 'Global Deposits', desc: 'Deposit USDT from anywhere in the world with QR code and wallet address support.' },
            { icon: <FiLock size={24} />, color: '#ff4757', rgb: '255,71,87', title: 'Withdrawal PIN', desc: 'Every withdrawal requires a secure 4-digit PIN to prevent unauthorized transactions.' },
            { icon: <FiTrendingUp size={24} />, color: '#00d4a3', rgb: '0,212,163', title: 'Transaction History', desc: 'Complete transaction history with timestamps, IDs, amounts, and status tracking.' },
            { icon: <FiCheckCircle size={24} />, color: '#7c6ef7', rgb: '124,110,247', title: 'Admin Verified', desc: 'All deposits and withdrawals are manually verified by admins for maximum security.' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={{ padding: 28, borderRadius: 16, background: '#161b27', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(${f.rgb},0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 16 }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#8892a4', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 48, borderRadius: 24, background: 'linear-gradient(135deg, rgba(0,212,163,0.08), rgba(124,110,247,0.08))', border: '1px solid rgba(0,212,163,0.2)' }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Start managing your USDT today</h2>
          <p style={{ color: '#8892a4', marginBottom: 32, fontSize: 16 }}>Join thousands of users who trust NexVault for secure USDT management.</p>
          <Link to="/register" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 40px', borderRadius: 12, background: 'linear-gradient(135deg, #00d4a3, #00b890)', color: '#0d1117', textDecoration: 'none', fontSize: 16, fontWeight: 700, boxShadow: '0 4px 28px rgba(0,212,163,0.35)' }}>
            Create Your Wallet <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 40px', textAlign: 'center', color: '#4a5568', fontSize: 13 }}>
        <span>© 2024 NexVault. All rights reserved. </span>
        <span style={{ color: '#8892a4' }}>Secure USDT Wallet Platform.</span>
      </footer>
    </div>
  );
};

export default LandingPage;
        
