import React, { useState, useEffect } from 'react';
import SearchFilter from '../components/SearchFilter';
import { searchBuilders, Builder, SearchParams } from '../lib/talentApi';
import BuilderCard from '../components/BuilderCard';
import SkeletonCard from '../components/SkeletonCard';
import Modal from '../components/Modal';
import ProfileView from '../components/ProfileView';

interface SearchScreenProps {
  onSelectBuilder: (builder: Builder) => void;
}

export default function SearchScreen({ onSelectBuilder }: SearchScreenProps) {
  const [results, setResults] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBuilder, setModalBuilder] = useState<Builder | null>(null);

  // Load top builders on mount
  useEffect(() => {
    loadInitialBuilders();
  }, []);

  const loadInitialBuilders = async () => {
    setLoading(true);
    try {
      const builders = await searchBuilders({});
      setResults(builders);
    } catch (err: any) {
      console.error('Initial load error:', err);
      setError('Failed to load builders. Please try searching.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: SearchParams) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const builders = await searchBuilders(filters);
      setResults(builders);
      if (builders.length === 0) {
        // Build descriptive error message based on filters used
        const filterParts: string[] = [];
        if (filters.location) filterParts.push(`location "${filters.location}"`);
        if (filters.min_score) filterParts.push(`score ≥ ${filters.min_score}`);
        if (filters.skills) filterParts.push(`skills "${filters.skills}"`);
        if (filters.activity) filterParts.push(`activity "${filters.activity}"`);
        
        if (filterParts.length > 0) {
          setError(`No builders found with ${filterParts.join(' + ')}. Try removing some filters.`);
        } else {
          setError('No builders found. Try different search criteria.');
        }
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search builders. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreview = (builder: Builder) => {
    setModalBuilder(builder);
    setModalOpen(true);
  };

  const handleFullProfile = (builder: Builder) => {
    setModalOpen(false);
    onSelectBuilder(builder);
  };

  return (
    <div>
      <SearchFilter onSearch={handleSearch} />
      
      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '16px', marginTop: 16 }}>
          <p style={{ color: results.length === 0 && searched ? 'var(--metal-silver)' : '#ff6b6b' }}>
            {error}
          </p>
        </div>
      )}
      
      <div>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : results.length > 0 ? (
          results.map((b, i) => (
            <BuilderCard 
              key={b.id || i} 
              builder={b} 
              onSelect={() => handleQuickPreview(b)} 
            />
          ))
        ) : searched && !error ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <p style={{ color: 'var(--metal-silver)' }}>No results found</p>
          </div>
        ) : !searched ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <p style={{ color: 'var(--metal-silver)' }}>
              🔍 Search for builders using the filters above
            </p>
          </div>
        ) : null}
      </div>
      
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalBuilder && (
          <div>
            <ProfileView builder={modalBuilder} />
            <button 
              onClick={() => handleFullProfile(modalBuilder)}
              style={{ width: '100%', marginTop: 16 }}
            >
              View Full Profile →
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
