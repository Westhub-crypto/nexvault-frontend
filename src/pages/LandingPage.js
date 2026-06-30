import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiZap, FiGlobe, FiLock, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0e14', color: '#f1f5f9', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
        @keyframes glow-pulse { 0%,100%{opacity:0.35} 50%{opacity:0.7} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .delay-1 { animation-delay: 0.08s; opacity: 0; }
        .delay-2 { animation-delay: 0.16s; opacity: 0; }
        .delay-3 { animation-delay: 0.24s; opacity: 0; }
        .delay-4 { animation-delay: 0.32s; opacity: 0; }
        .feature-card { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, background 0.35s; }
        .feature-card:hover { transform: translateY(-6px); border-color: rgba(0,230,168,0.35) !important; background: #161d29 !important; }
        .cta-btn { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(0,230,168,0.45) !important; }
        .float-card { animation: float 5s ease-in-out infinite; }
      `}</style>

      {/* Navbar */}
      <nav style={{ padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', top: 0, width: '100%', zIndex: 100, background: 'rgba(10,14,20,0.85)', backdropFilter: 'blur(20px) saturate(160%)', borderBottom: '1px solid rgba(255,255,255,0.06)', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, #00e6a8, #8b7cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#04140f', fontFamily: 'Space Grotesk', boxShadow: '0 4px 16px rgba(0,230,168,0.3)' }}>N</div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 19, letterSpacing: -0.4 }}>NexVault</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/login" style={{ padding: '9px 18px', borderRadius: 10, color: '#cbd5e1', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Sign In</Link>
          <Link to="/register" className="cta-btn" style={{ padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #00e6a8, #00c794)', color: '#04140f', textDecoration: 'none', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 18px rgba(0,230,168,0.3)' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 40px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '18%', left: '8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,168,0.1), transparent 70%)', animation: 'glow-pulse 4s ease infinite', filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '8%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,124,246,0.1), transparent 70%)', animation: 'glow-pulse 4s ease infinite 2s', filter: 'blur(20px)' }} />

        <div style={{ maxWidth: 820, textAlign: 'center', position: 'relative' }}>
          <div className="fade-up delay-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, border: '1px solid rgba(0,230,168,0.28)', background: 'rgba(0,230,168,0.07)', fontSize: 13, color: '#00e6a8', marginBottom: 28, fontWeight: 600 }}>
            <FiShield size={13} /> Enterprise-Grade USDT Wallet
          </div>
          <h1 className="fade-up delay-2" style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(40px, 6.6vw, 76px)', fontWeight: 700, lineHeight: 1.08, marginBottom: 26, letterSpacing: -1.5 }}>
            Your Digital Assets,<br />
            <span style={{ background: 'linear-gradient(135deg, #00e6a8 0%, #8b7cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Secured & Smart</span>
          </h1>
          <p className="fade-up delay-3" style={{ fontSize: 17.5, color: '#94a3b8', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 42px' }}>
            NexVault is a premium USDT wallet platform built for security and simplicity. Send, receive, and manage your USDT with enterprise-level protection across the TON network.
          </p>
          <div className="fade-up delay-4" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 34px', borderRadius: 14, background: 'linear-gradient(135deg, #00e6a8, #00c794)', color: '#04140f', textDecoration: 'none', fontSize: 15.5, fontWeight: 700, boxShadow: '0 6px 30px rgba(0,230,168,0.35)' }}>
              Create Free Account <FiArrowRight />
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 34px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.12)', color: '#f1f5f9', textDecoration: 'none', fontSize: 15.5, fontWeight: 600 }}>
              Sign In
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 70, flexWrap: 'wrap' }}>
            {[['$2M+', 'Total Volume'], ['10K+', 'Active Users'], ['99.9%', 'Uptime']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 30, fontWeight: 800, color: '#00e6a8', letterSpacing: -0.8 }}>{val}</div>
                <div style={{ fontSize: 12.5, color: '#5a6478', marginTop: 5, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '90px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, marginBottom: 16, letterSpacing: -0.8 }}>Everything you need to manage USDT</h2>
          <p style={{ color: '#94a3b8', fontSize: 16.5, maxWidth: 500, margin: '0 auto' }}>A complete financial platform designed for security and ease of use.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
          {[
            { icon: <FiShield size={22} />, color: '#00e6a8', rgb: '0,230,168', title: 'Bank-Level Security', desc: 'JWT authentication, PIN protection, rate limiting, and enterprise-grade encryption on every transaction.' },
            { icon: <FiZap size={22} />, color: '#8b7cf6', rgb: '139,124,246', title: 'Instant Transfers', desc: 'Send USDT to any NexVault user instantly, or to any external USDT wallet address worldwide.' },
            { icon: <FiGlobe size={22} />, color: '#ffb547', rgb: '255,181,71', title: 'Global Deposits', desc: 'Deposit USDT from anywhere in the world with QR code and wallet address support.' },
            { icon: <FiLock size={22} />, color: '#ff5c72', rgb: '255,92,114', title: 'Withdrawal PIN', desc: 'Every withdrawal requires a secure 4-digit PIN to prevent unauthorized transactions.' },
            { icon: <FiTrendingUp size={22} />, color: '#00e6a8', rgb: '0,230,168', title: 'Transaction History', desc: 'Complete transaction history with timestamps, IDs, amounts, and status tracking.' },
            { icon: <FiCheckCircle size={22} />, color: '#8b7cf6', rgb: '139,124,246', title: 'Admin Verified', desc: 'All deposits and withdrawals are manually verified by admins for maximum security.' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={{ padding: 30, borderRadius: 18, background: '#11161f', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: `rgba(${f.rgb},0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 18 }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 18.5, marginBottom: 11, letterSpacing: -0.3 }}>{f.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ padding: '0 40px 90px', maxWidth: 1000, margin: '0 auto' }}>
        <div className="float-card" style={{ background: 'linear-gradient(135deg, #11161f, #151b26)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, padding: '32px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00e6a8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>Powered by TON Network</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 19, fontWeight: 600, color: '#f1f5f9' }}>Fast, low-fee USDT transfers worldwide</div>
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            {['Audited', 'Encrypted', 'Verified'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: '#94a3b8', fontWeight: 500 }}>
                <FiCheckCircle style={{ color: '#00e6a8' }} /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 40px 90px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', padding: 52, borderRadius: 26, background: 'linear-gradient(135deg, rgba(0,230,168,0.08), rgba(139,124,246,0.08))', border: '1px solid rgba(0,230,168,0.2)' }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 34, fontWeight: 700, marginBottom: 16, letterSpacing: -0.8 }}>Start managing your USDT today</h2>
          <p style={{ color: '#94a3b8', marginBottom: 34, fontSize: 16 }}>Join thousands of users who trust NexVault for secure USDT management.</p>
          <Link to="/register" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 42px', borderRadius: 14, background: 'linear-gradient(135deg, #00e6a8, #00c794)', color: '#04140f', textDecoration: 'none', fontSize: 15.5, fontWeight: 700, boxShadow: '0 6px 30px rgba(0,230,168,0.35)' }}>
            Create Your Wallet <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '26px 40px', textAlign: 'center', color: '#5a6478', fontSize: 13 }}>
        <span>© 2024 NexVault. All rights reserved. </span>
        <span style={{ color: '#94a3b8' }}>Secure USDT Wallet Platform.</span>
      </footer>
    </div>
  );
};

export default LandingPage;
  
