import React from 'react';

export default function FABContact({ onClick }: { onClick: () => void }) {
  return (
    <button
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 1100,
        background: 'linear-gradient(135deg, var(--metal-gold) 0%, var(--metal-copper) 100%)',
        color: '#23272a', border: 'none', borderRadius: '50%', width: 64, height: 64,
        boxShadow: '0 4px 24px var(--metal-gold)', fontSize: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.2s'
      }}
      aria-label="Contact"
      onClick={onClick}
    >
      &#9993;
    </button>
  );
}
