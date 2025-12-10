import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden', minHeight: 120 }}>
      <div className="skeleton-avatar" />
      <div className="skeleton-line" style={{ width: '60%', marginTop: 12 }} />
      <div className="skeleton-line" style={{ width: '40%', marginTop: 8 }} />
      <div className="skeleton-line" style={{ width: '80%', marginTop: 8 }} />
    </div>
  );
}
