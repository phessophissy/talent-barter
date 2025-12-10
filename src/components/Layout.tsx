import React from 'react';
import NavDrawer from './NavDrawer';
import FABContact from './FABContact';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--metal-bg)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <NavDrawer items={[{ label: 'Home', onClick: () => window.location.href = '/' }]} />
      <ThemeToggle />
      <header style={{ background: 'var(--metal-surface)', padding: '16px 0', textAlign: 'center', boxShadow: '0 2px 8px var(--metal-accent)' }}>
        <h1 style={{ color: 'var(--metal-gold)', letterSpacing: '2px', fontWeight: 700 }}>Talent-Barter</h1>
      </header>
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {children}
        </div>
      </main>
      <FABContact onClick={() => window.open('mailto:contact@talentbarter.com')} />
    </div>
  );
}
