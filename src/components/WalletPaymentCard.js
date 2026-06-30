import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiCopy, FiCheck, FiAlertTriangle } from 'react-icons/fi';

/**
 * WalletPaymentCard — mimics the visual language of a real crypto wallet's
 * "receive" screen: white QR card, network badge, monospace address, copy button,
 * and a prominent network-mismatch warning.
 */
const WalletPaymentCard = ({
  address,
  qrCode,
  network = 'TON',
  networkFull = 'TON (The Open Network)',
  tokenSymbol = 'USDT',
  amountLabel,
  amountValue,
}) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(address || '');
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Amount banner (optional) */}
      {amountLabel && (
        <div style={{
          textAlign: 'center', padding: '18px 20px', borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(0,230,168,0.1), rgba(139,124,246,0.06))',
          border: '1px solid rgba(0,230,168,0.22)',
        }}>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: 0.2 }}>{amountLabel}</div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 800, color: 'var(--accent)', marginTop: 4, letterSpacing: -0.5 }}>
            {amountValue}
          </div>
        </div>
      )}

      {/* Network warning — styled exactly like real wallets */}
      <div className="network-warning">
        <FiAlertTriangle style={{ marginTop: 1, flexShrink: 0 }} />
        <span>
          Send only <strong>{tokenSymbol}</strong> on the <strong>{networkFull}</strong>. Sending any other token or using a different network may result in <strong>permanent loss of funds</strong>.
        </span>
      </div>

      {/* White QR card — matches the uploaded screenshot's wallet style */}
      <div className="wallet-qr-frame">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px',
          borderRadius: 999, background: '#f0f4ff', color: '#3b5bdb', fontSize: 12, fontWeight: 700,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b5bdb' }} />
          {network} Network
        </div>

        {qrCode ? (
          <img src={qrCode} alt="Wallet address QR code" style={{ width: 220, height: 220, borderRadius: 12 }} />
        ) : (
          <div style={{ width: 220, height: 220, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
            Loading QR...
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
          Scan QR with your wallet app to send {tokenSymbol} to this address.
        </div>

        <div style={{ width: '100%', borderTop: '1px solid #e2e8f0', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Your {network} Address
          </div>
          <div style={{
            fontFamily: 'SF Mono, monospace', fontSize: 13, color: '#1e293b', textAlign: 'center',
            lineHeight: 1.6, wordBreak: 'break-all', padding: '0 8px',
          }}>
            {address || 'Loading address...'}
          </div>
          <button onClick={copy} style={{
            width: '100%', marginTop: 4, padding: '13px', borderRadius: 12, border: 'none',
            background: copied ? '#16a34a' : '#2563eb', color: 'white', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.2s',
          }}>
            {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPaymentCard;
