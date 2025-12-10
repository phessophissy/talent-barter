import React, { useState } from 'react';
import ConnectScreen from '../screens/ConnectScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Layout from '../components/Layout';
import ScreenTransition from '../components/ScreenTransition';
import { Builder } from '../lib/talentApi';

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);

  // Celo TalentAccessGate contract address
  const contractAddress = '0xC910EEFE0E1b1B25fD413ACf2b23AE04386fE69e';
  const providerUrl = 'https://forno.celo.org';

  const handleBack = () => {
    setSelectedBuilder(null);
  };

  if (!unlocked) {
    return (
      <Layout>
        <ScreenTransition>
          <ConnectScreen contractAddress={contractAddress} providerUrl={providerUrl} onUnlock={() => setUnlocked(true)} />
        </ScreenTransition>
      </Layout>
    );
  }
  if (selectedBuilder) {
    return (
      <Layout>
        <ScreenTransition>
          <ProfileScreen builder={selectedBuilder} onBack={handleBack} />
        </ScreenTransition>
      </Layout>
    );
  }
  return (
    <Layout>
      <ScreenTransition>
        <SearchScreen onSelectBuilder={setSelectedBuilder} />
      </ScreenTransition>
    </Layout>
  );
}
