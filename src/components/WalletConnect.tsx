import React, { useState } from 'react';
import { connectWallet } from '../lib/reownAppKit';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const address = await connectWallet();
      if (address && typeof address === 'string' && address.length > 0) {
        onConnect(address);
      } else {
        setError('No wallet address returned. Please try again.');
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
      <h3 style={{ marginBottom: 8 }}>🔗 Connect Your Wallet</h3>
      <p style={{ marginBottom: 16, color: 'var(--metal-silver)' }}>
        Connect your wallet to access the Talent Discovery platform.
      </p>
      
      {error && (
        <p style={{ color: '#ff6b6b', marginBottom: 16, fontSize: '0.9rem' }}>
          ⚠️ {error}
        </p>
      )}
      
      <button 
        onClick={handleConnect}
        disabled={loading}
        style={{ 
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'wait' : 'pointer',
          minWidth: 180
        }}
      >
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
      
      <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--metal-accent)' }}>
        Supports MetaMask, WalletConnect, and other Web3 wallets
      </p>
    </div>
  );
}
