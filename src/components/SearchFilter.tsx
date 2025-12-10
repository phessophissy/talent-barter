import React, { useState } from 'react';
import { SearchParams } from '../lib/talentApi';

interface SearchFilterProps {
  onSearch: (filters: SearchParams) => void;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [minScore, setMinScore] = useState<number>(0);
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('');

  const handleSearch = () => {
    onSearch({ 
      min_score: minScore > 0 ? minScore : undefined, 
      skills: skills.trim() || undefined, 
      location: location.trim() || undefined, 
      activity: activity.trim() || undefined 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ marginBottom: 16 }}>🔍 Find Builders</h3>
      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--metal-silver)', display: 'block', marginBottom: 4 }}>
            Minimum Builder Score
          </label>
          <input 
            type="number" 
            placeholder="e.g., 50" 
            value={minScore || ''} 
            onChange={e => setMinScore(Number(e.target.value) || 0)} 
            onKeyPress={handleKeyPress}
            min={0}
            max={100}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--metal-silver)', display: 'block', marginBottom: 4 }}>
            Skills (comma separated)
          </label>
          <input 
            type="text" 
            placeholder="e.g., React, Solidity, TypeScript" 
            value={skills} 
            onChange={e => setSkills(e.target.value)} 
            onKeyPress={handleKeyPress}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--metal-silver)', display: 'block', marginBottom: 4 }}>
            Location
          </label>
          <input 
            type="text" 
            placeholder="e.g., San Francisco, Remote" 
            value={location} 
            onChange={e => setLocation(e.target.value)} 
            onKeyPress={handleKeyPress}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--metal-silver)', display: 'block', marginBottom: 4 }}>
            Activity Type
          </label>
          <input 
            type="text" 
            placeholder="e.g., DeFi, NFT, DAO" 
            value={activity} 
            onChange={e => setActivity(e.target.value)} 
            onKeyPress={handleKeyPress}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <button onClick={handleSearch} style={{ marginTop: 8 }}>
          Search Builders
        </button>
      </div>
    </div>
  );
}
