import React, { useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import Paywall from '../components/Paywall';
import { checkAccessStatus } from '../lib/reownAppKit';
import Toast from '../components/Toast';

interface ConnectScreenProps {
  contractAddress: string;
  providerUrl: string;
  onUnlock: () => void;
}

export default function ConnectScreen({ contractAddress, providerUrl, onUnlock }: ConnectScreenProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (addr: string) => {
    if (!addr) {
      setError('No wallet address provided');
      return;
    }
    
    setAddress(addr);
    setToastMessage(`Wallet connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`);
    setShowToast(true);
    setChecking(true);
    setError(null);
    
    try {
      // Check access directly from the contract using the wallet address
      const access = await checkAccessStatus(addr);
      console.log('Access check result for', addr, ':', access);
      setHasAccess(access);
      if (access) {
        setToastMessage('Access verified! Welcome back.');
        setShowToast(true);
        setTimeout(onUnlock, 1000);
      }
    } catch (err: any) {
      console.error('Access check error:', err);
      // If contract check fails, assume no access (user needs to pay)
      setHasAccess(false);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      {!address ? (
        <WalletConnect onConnect={handleConnect} />
      ) : checking ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <p>Checking access status...</p>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: '3px solid var(--metal-border)', 
            borderTopColor: 'var(--metal-gold)',
            borderRadius: '50%',
            margin: '16px auto',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      ) : hasAccess ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <h3 style={{ color: 'var(--metal-gold)' }}>✓ Access Granted</h3>
          <p>Redirecting to dashboard...</p>
        </div>
      ) : (
        <Paywall onUnlock={onUnlock} walletAddress={address} />
      )}
      
      {error && (
        <p style={{ color: '#ff6b6b', textAlign: 'center', marginTop: 16 }}>
          ⚠️ {error}
        </p>
      )}
      
      <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
