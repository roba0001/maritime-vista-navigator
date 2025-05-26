
import React, { useState } from 'react';
import CharacterSelection from '@/components/CharacterSelection';
import MaritimeMap from '@/components/MaritimeMap';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'cargo_owner' | 'shipping_agency' | 'naval_actor' | null>(null);

  const handleRoleSelect = (role: 'cargo_owner' | 'shipping_agency' | 'naval_actor') => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  if (selectedRole) {
    return <MaritimeMap selectedRole={selectedRole} onBack={handleBack} />;
  }

  return <CharacterSelection onRoleSelect={handleRoleSelect} />;
};

export default Index;
