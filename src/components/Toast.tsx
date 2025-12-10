import React, { useEffect } from 'react';

export default function Toast({ message, show, onClose }: { message: string, show: boolean, onClose: () => void }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2000,
      background: 'linear-gradient(90deg, var(--metal-gold) 0%, var(--metal-silver) 100%)',
      color: '#23272a', padding: '14px 32px', borderRadius: 16, boxShadow: '0 2px 16px var(--metal-gold)', fontWeight: 600,
      fontSize: 18, animation: 'toastIn 0.3s'
    }}>
      {message}
      <style>{`
        @keyframes toastIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
