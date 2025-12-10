import React, { useState } from 'react';
import { payAccess, checkCUSDBalance } from '../lib/reownAppKit';

interface PaywallProps {
  onUnlock: () => void;
  walletAddress?: string;
}

export default function Paywall({ onUnlock, walletAddress }: PaywallProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  React.useEffect(() => {
    if (walletAddress) {
      checkCUSDBalance(walletAddress).then(setBalance).catch(() => setBalance(null));
    }
  }, [walletAddress]);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await payAccess();
      if (success) {
        onUnlock();
      } else {
        setError('Payment was not completed. Please try again.');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
      <h3 style={{ marginBottom: 8 }}>🔒 Premium Access Required</h3>
      <p style={{ marginBottom: 16, color: 'var(--metal-silver)' }}>
        Pay 1 cUSD to unlock full access to the Talent Discovery platform.
      </p>
      
      {balance !== null && (
        <p style={{ fontSize: '0.9rem', color: 'var(--metal-accent)', marginBottom: 16 }}>
          Your cUSD Balance: {parseFloat(balance).toFixed(2)} cUSD
        </p>
      )}
      
      {error && (
        <p style={{ color: '#ff6b6b', marginBottom: 16, fontSize: '0.9rem' }}>
          ⚠️ {error}
        </p>
      )}
      
      <button 
        onClick={handlePay} 
        disabled={loading}
        style={{ 
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'wait' : 'pointer',
          minWidth: 180
        }}
      >
        {loading ? 'Processing...' : 'Pay 1 cUSD'}
      </button>
      
      <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--metal-accent)' }}>
        Powered by Celo blockchain
      </p>
    </div>
  );
}
