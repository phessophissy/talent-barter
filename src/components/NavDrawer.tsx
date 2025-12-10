import React, { useState } from 'react';

export default function NavDrawer({ items }: { items: Array<{ label: string, onClick: () => void }> }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        style={{
          position: 'fixed', top: 18, left: 18, zIndex: 1100, background: 'var(--metal-surface)', border: 'none', borderRadius: 12, boxShadow: '0 2px 8px var(--metal-gold)', color: 'var(--metal-gold)', fontSize: 28, width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        &#9776;
      </button>
      {open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(35,39,42,0.85)', zIndex: 1200, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s'
        }}>
          <div style={{ background: 'var(--metal-glass)', borderRadius: 0, boxShadow: '0 8px 32px var(--metal-gold)', padding: '32px 0', minWidth: 220, maxWidth: 320, margin: 'auto', animation: 'slideRight 0.3s' }}>
            <button style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'var(--metal-gold)', fontSize: 32, cursor: 'pointer' }} onClick={() => setOpen(false)}>&times;</button>
            <nav>
              {items.map((item, i) => (
                <div key={i} style={{ padding: '18px 32px', fontSize: 20, color: 'var(--metal-gold)', cursor: 'pointer', borderBottom: '1px solid var(--metal-border)' }} onClick={() => { item.onClick(); setOpen(false); }}>
                  {item.label}
                </div>
              ))}
            </nav>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideRight { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          `}</style>
        </div>
      )}
    </>
  );
}
