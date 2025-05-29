
import React, { useState } from 'react';
import IntroductionPage from '@/components/IntroductionPage';
import CharacterSelection from '@/components/CharacterSelection';
import MaritimeMap from '@/components/MaritimeMap';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'intro' | 'role-selection' | 'map'>('intro');
  const [selectedRole, setSelectedRole] = useState<'cargo_owner' | 'shipping_agency' | 'naval_actor' | null>(null);

  const handleIntroComplete = () => {
    setCurrentPage('role-selection');
  };

  const handleRoleSelect = (role: 'cargo_owner' | 'shipping_agency' | 'naval_actor') => {
    setSelectedRole(role);
    setCurrentPage('map');
  };

  const handleBack = () => {
    setSelectedRole(null);
    setCurrentPage('role-selection');
  };

  if (currentPage === 'intro') {
    return <IntroductionPage onContinue={handleIntroComplete} />;
  }

  if (currentPage === 'role-selection') {
    return <CharacterSelection onRoleSelect={handleRoleSelect} />;
  }

  if (currentPage === 'map' && selectedRole) {
    return <MaritimeMap selectedRole={selectedRole} onBack={handleBack} />;
  }

  return <IntroductionPage onContinue={handleIntroComplete} />;
};

export default Index;
