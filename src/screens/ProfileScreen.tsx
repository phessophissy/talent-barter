import React from 'react';
import ProfileView from '../components/ProfileView';
import { Builder } from '../lib/talentApi';

interface ProfileScreenProps {
  builder: Builder;
  onBack: () => void;
}

export default function ProfileScreen({ builder, onBack }: ProfileScreenProps) {
  return (
    <div>
      <button 
        onClick={onBack}
        style={{ 
          marginBottom: 16, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          background: 'transparent',
          border: '1px solid var(--metal-border)',
          color: 'var(--metal-gold)'
        }}
      >
        ← Back to Search
      </button>
      <ProfileView builder={builder} />
    </div>
  );
}
