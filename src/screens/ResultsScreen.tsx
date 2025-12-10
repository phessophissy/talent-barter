import React from 'react';
import BuilderCard from '../components/BuilderCard';

export default function ResultsScreen({ builders, onSelectBuilder }: any) {
  return (
    <div>
      {builders.map((b: any, i: number) => <BuilderCard key={i} builder={b} onSelect={() => onSelectBuilder(b)} />)}
    </div>
  );
}
