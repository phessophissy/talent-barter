import React from 'react';

export default function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(35,39,42,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
      animation: 'fadeIn 0.3s'
    }}>
      <div style={{ background: 'var(--metal-glass)', borderRadius: 20, boxShadow: '0 8px 32px var(--metal-gold)', padding: 32, minWidth: 320, maxWidth: 420, position: 'relative', animation: 'slideUp 0.3s' }}>
        <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--metal-gold)', fontSize: 24, cursor: 'pointer' }} onClick={onClose}>&times;</button>
        {children}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
