
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MapHeaderProps {
  selectedRole: 'cargo_owner' | 'shipping_agency' | 'naval_actor';
  onBack: () => void;
}

const MapHeader: React.FC<MapHeaderProps> = ({ selectedRole, onBack }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'cargo_owner': return 'bg-blue-600';
      case 'shipping_agency': return 'bg-teal-600';
      case 'naval_actor': return 'bg-slate-600';
      default: return 'bg-gray-600';
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'cargo_owner': return 'Cargo Owner';
      case 'shipping_agency': return 'Shipping Agency';
      case 'naval_actor': return 'Naval Actor';
      default: return 'Unknown Role';
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-white text-sm ${getRoleColor(selectedRole)}`}>
            {getRoleTitle(selectedRole)}
          </div>
          <Button onClick={onBack} variant="outline" size="sm">
            Change Role
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapHeader;
