import React from 'react';

const LoadingSpinner = ({ size = 40, fullPage = true }) => {
  const spinner = (
    <div style={{
      width: size, height: size,
      border: `3px solid rgba(0,230,168,0.12)`,
      borderTop: `3px solid #00e6a8`,
      borderRadius: '50%',
      animation: 'spin 0.75s linear infinite',
    }} />
  );

  if (!fullPage) return spinner;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0a0e14',
      flexDirection: 'column', gap: 20,
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 11,
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: '#f1f5f9', letterSpacing: -0.4,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: 'linear-gradient(135deg, #00e6a8, #8b7cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 19, fontWeight: 800, color: '#04140f',
          boxShadow: '0 6px 20px rgba(0,230,168,0.3)',
        }}>N</div>
        NexVault
      </div>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
    
