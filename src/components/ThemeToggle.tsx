import React, { useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);
  React.useEffect(() => {
    document.body.style.background = dark ? 'linear-gradient(135deg, #23272a 0%, #3a3f44 100%)' : 'linear-gradient(135deg, #f5f5fa 0%, #e0e0e0 100%)';
    document.body.style.color = dark ? '#e0e0e0' : '#23272a';
  }, [dark]);
  return (
    <button
      style={{
        position: 'fixed', top: 18, right: 18, zIndex: 1100, background: dark ? 'var(--metal-surface)' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 2px 8px var(--metal-gold)', color: dark ? 'var(--metal-gold)' : '#b87333', fontSize: 22, width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
      }}
      aria-label="Toggle theme"
      onClick={() => setDark(d => !d)}
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
