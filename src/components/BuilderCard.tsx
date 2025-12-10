import React from 'react';
import IconCategory from './IconCategory';
import { Builder } from '../lib/talentApi';

interface BuilderCardProps {
  builder: Builder;
  onSelect: () => void;
}

export default function BuilderCard({ builder, onSelect }: BuilderCardProps) {
  const tags = builder.tags || [];
  const avatarSrc = builder.avatar || '/default-avatar.png';
  
  return (
    <div className="card" onClick={onSelect} style={{ cursor: 'pointer', transition: 'transform 0.15s' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <img 
          src={avatarSrc} 
          alt={`${builder.display_name}'s avatar`} 
          width={56} 
          height={56} 
          style={{ 
            borderRadius: '50%', 
            border: '3px solid var(--metal-gold)', 
            boxShadow: '0 2px 12px var(--metal-gold)', 
            marginRight: 16, 
            background: 'var(--metal-surface)',
            objectFit: 'cover'
          }} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect fill="%233a3f44" width="56" height="56"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffd700" font-size="24">?</text></svg>';
          }}
        />
        <div>
          <h3 style={{ margin: 0 }}>
            {builder.display_name || builder.name}
            {builder.verified && <span style={{ color: 'var(--metal-gold)', marginLeft: 6 }}>✓</span>}
          </h3>
          <p style={{ margin: 0, color: 'var(--metal-gold)', fontWeight: 600 }}>Score: {builder.score || 0}</p>
        </div>
      </div>
      {tags.length > 0 && (
        <p style={{ color: 'var(--metal-silver)', fontWeight: 500 }}>
          <IconCategory type="skills" />
          {tags.slice(0, 3).map((tag: string, idx: number) => (
            <span key={idx} style={{ 
              background: 'var(--metal-surface)', 
              padding: '2px 8px', 
              borderRadius: 8, 
              marginRight: 6,
              fontSize: '0.85rem'
            }}>
              {tag}
            </span>
          ))}
        </p>
      )}
      {builder.location && (
        <p style={{ fontSize: '0.9rem', color: 'var(--metal-accent)', margin: '8px 0 0' }}>
          <IconCategory type="location" />{builder.location}
        </p>
      )}
      {builder.bio && (
        <p style={{ marginTop: 8, fontSize: '0.98rem', color: 'var(--metal-text)' }}>
          {builder.bio.length > 100 ? `${builder.bio.substring(0, 100)}...` : builder.bio}
        </p>
      )}
    </div>
  );
}
