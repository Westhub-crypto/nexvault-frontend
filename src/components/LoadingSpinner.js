import React from 'react';

const LoadingSpinner = ({ size = 40, fullPage = true }) => {
  const spinner = (
    <div style={{
      width: size, height: size,
      border: `3px solid rgba(0, 212, 163, 0.15)`,
      borderTop: `3px solid #00d4a3`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  );

  if (!fullPage) return spinner;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg-primary)', flexDirection: 'column', gap: 16
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#0d1117'
        }}>N</div>
        <span style={{ background: 'linear-gradient(135deg, #00d4a3, #7c6ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NexVault</span>
      </div>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
