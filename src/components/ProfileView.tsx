import React from 'react';
import IconCategory from './IconCategory';
import { Builder } from '../lib/talentApi';

interface ProfileViewProps {
  builder: Builder;
}

export default function ProfileView({ builder }: ProfileViewProps) {
  const tags = builder.tags || [];
  const scoreBreakdown = builder.scoreBreakdown || {};
  
  const handleOpenUrl = (url: string | undefined) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="card" style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        {builder.avatar && (
          <img 
            src={builder.avatar} 
            alt={`${builder.display_name}'s avatar`} 
            width={72} 
            height={72} 
            style={{ 
              borderRadius: '50%', 
              border: '3px solid var(--metal-gold)', 
              marginRight: 16,
              objectFit: 'cover'
            }} 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div>
          <h2 style={{ marginBottom: 4 }}>{builder.display_name || builder.name}</h2>
          <p style={{ margin: 0, color: 'var(--metal-gold)', fontWeight: 700, fontSize: '1.2rem' }}>
            Builder Score: {builder.score || 0}
            {builder.verified && <span style={{ marginLeft: 8 }}>✓ Verified</span>}
          </p>
        </div>
      </div>
      
      {builder.bio && (
        <p style={{ marginBottom: 16, lineHeight: 1.6 }}>{builder.bio}</p>
      )}
      
      <div style={{ marginBottom: 16 }}>
        {Object.keys(scoreBreakdown).length > 0 && (
          <p style={{ color: 'var(--metal-gold)', fontWeight: 600 }}>
            Score breakdown: Activity {scoreBreakdown.activity_score || 0} | Identity {scoreBreakdown.identity_score || 0} | Skills {scoreBreakdown.skills_score || 0}
          </p>
        )}
        {builder.location && (
          <p style={{ color: 'var(--metal-silver)' }}>
            <IconCategory type="location" />Location: {builder.location}
          </p>
        )}
        {tags.length > 0 && (
          <p style={{ color: 'var(--metal-copper)' }}>
            <IconCategory type="skills" />Tags: {tags.join(', ')}
          </p>
        )}
        {builder.main_wallet && (
          <p style={{ color: 'var(--metal-accent)' }}>
            <IconCategory type="onchain" />Wallet: {builder.main_wallet.slice(0, 6)}...{builder.main_wallet.slice(-4)}
          </p>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: 12 }}>
        <button 
          style={{ flex: 1 }} 
          onClick={() => handleOpenUrl(builder.farcasterUrl)}
          disabled={!builder.farcasterUrl}
        >
          View on Farcaster
        </button>
        <button 
          style={{ flex: 1 }} 
          onClick={() => handleOpenUrl(builder.contactUrl)}
          disabled={!builder.contactUrl}
        >
          View on Explorer
        </button>
      </div>
    </div>
  );
}
