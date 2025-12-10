import React from 'react';

const icons: Record<string, string> = {
  github: '🐙',
  onchain: '🔗',
  content: '📝',
  skills: '💡',
  location: '📍',
};

export default function IconCategory({ type }: { type: string }) {
  return (
    <span style={{ fontSize: 22, marginRight: 8 }}>{icons[type] || '✨'}</span>
  );
}
