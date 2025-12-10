import React from 'react';

export default function ScreenTransition({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      animation: 'fadeSlideIn 0.4s',
      minHeight: '100%',
      width: '100%'
    }}>
      {children}
      <style>{`
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
