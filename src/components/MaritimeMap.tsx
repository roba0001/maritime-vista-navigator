
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Ship, DollarSign, AlertTriangle } from 'lucide-react';

interface Chokepoint {
  id: string;
  name: string;
  coordinates: { x: number; y: number }; // Percentage positions on the map
  nearbyPorts: string[];
  tradeVolume: string;
  geopoliticalNotes: string;
  strategicImportance: 'High' | 'Medium' | 'Critical';
}

interface MaritimeMapProps {
  selectedRole: 'cargo_owner' | 'shipping_agency' | 'naval_actor';
  onBack: () => void;
}

const MaritimeMap: React.FC<MaritimeMapProps> = ({ selectedRole, onBack }) => {
  const [selectedChokepoint, setSelectedChokepoint] = useState<Chokepoint | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Only Gibraltar chokepoint
  const chokepoints: Chokepoint[] = [
    {
      id: 'strait_of_gibraltar',
      name: 'Strait of Gibraltar',
      coordinates: { x: 47, y: 45 }, // Approximate position on world map
      nearbyPorts: ['Algeciras', 'Tangier', 'Ceuta'],
      tradeVolume: '~100,000 vessels/year',
      geopoliticalNotes: 'Key gateway between Atlantic and Mediterranean, controlled by Spain and Morocco',
      strategicImportance: 'Critical'
    }
  ];

  const handleChokepointClick = (chokepoint: Chokepoint) => {
    setSelectedChokepoint(chokepoint);
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setIsZoomed(false);
    setSelectedChokepoint(null);
  };

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
    <div className="h-screen flex bg-slate-900">
      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Map Container */}
        <div className="absolute inset-0">
          {!isZoomed ? (
            // World Map View
            <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900">
              {/* Ocean background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-900" />
              
              {/* Simple continent shapes using CSS */}
              <div className="absolute inset-0">
                {/* North America */}
                <div className="absolute bg-green-700 rounded-3xl" 
                     style={{ left: '8%', top: '20%', width: '20%', height: '25%', transform: 'rotate(-10deg)' }} />
                
                {/* South America */}
                <div className="absolute bg-green-600 rounded-2xl" 
                     style={{ left: '22%', top: '45%', width: '12%', height: '30%', transform: 'rotate(10deg)' }} />
                
                {/* Europe */}
                <div className="absolute bg-green-800 rounded-xl" 
                     style={{ left: '45%', top: '25%', width: '8%', height: '15%' }} />
                
                {/* Africa */}
                <div className="absolute bg-yellow-700 rounded-2xl" 
                     style={{ left: '48%', top: '40%', width: '12%', height: '35%' }} />
                
                {/* Asia */}
                <div className="absolute bg-green-700 rounded-3xl" 
                     style={{ left: '58%', top: '20%', width: '25%', height: '30%', transform: 'rotate(-5deg)' }} />
                
                {/* Australia */}
                <div className="absolute bg-orange-600 rounded-xl" 
                     style={{ left: '75%', top: '65%', width: '10%', height: '8%' }} />
              </div>

              {/* Chokepoint markers */}
              {chokepoints.map((chokepoint) => (
                <button
                  key={chokepoint.id}
                  className="absolute w-6 h-6 bg-red-500 border-4 border-white rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-300 z-20 animate-pulse"
                  style={{
                    left: `${chokepoint.coordinates.x}%`,
                    top: `${chokepoint.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleChokepointClick(chokepoint)}
                />
              ))}
            </div>
          ) : (
            // Zoomed Gibraltar View
            <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900">
              {/* Zoomed view background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
              
              {/* Gibraltar region representation */}
              <div className="absolute inset-0">
                {/* Spain (top) */}
                <div className="absolute bg-green-700 rounded-lg" 
                     style={{ left: '20%', top: '10%', width: '60%', height: '30%' }} />
                
                {/* Morocco (bottom) */}
                <div className="absolute bg-yellow-600 rounded-lg" 
                     style={{ left: '25%', top: '60%', width: '50%', height: '30%' }} />
                
                {/* Strait (water between) */}
                <div className="absolute bg-blue-400 rounded-sm" 
                     style={{ left: '30%', top: '40%', width: '40%', height: '20%' }} />
                
                {/* Gibraltar marker */}
                <div className="absolute w-8 h-8 bg-red-500 border-4 border-white rounded-full shadow-lg z-20" 
                     style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
              </div>
              
              {/* Zoom out button */}
              <button
                onClick={handleZoomOut}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 z-30"
              >
                Zoom Out
              </button>
            </div>
          )}
        </div>
        
        {/* Header */}
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

        {/* Chokepoint Info Panel - Only show when zoomed */}
        {selectedChokepoint && isZoomed && (
          <div className="absolute bottom-4 left-4 z-10 w-80">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>{selectedChokepoint.name}</span>
                </CardTitle>
                <Badge variant={selectedChokepoint.strategicImportance === 'Critical' ? 'destructive' : 'secondary'}>
                  {selectedChokepoint.strategicImportance} Importance
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold flex items-center space-x-1 mb-2">
                    <Ship className="w-4 h-4" />
                    <span>Nearby Ports</span>
                  </h4>
                  <p className="text-sm text-gray-600">{selectedChokepoint.nearbyPorts.join(', ')}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold flex items-center space-x-1 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Trade Volume</span>
                  </h4>
                  <p className="text-sm text-gray-600">{selectedChokepoint.tradeVolume}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold flex items-center space-x-1 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Geopolitical Notes</span>
                  </h4>
                  <p className="text-sm text-gray-600">{selectedChokepoint.geopoliticalNotes}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Right Sidebar - LLM Placeholder */}
      <div className="w-96 bg-slate-800 border-l border-slate-700">
        <div className="p-6">
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Maritime Intelligence Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-300 text-center py-8">
                <div className="w-16 h-16 bg-slate-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Ship className="w-8 h-8 text-slate-400" />
                </div>
                <p className="mb-2">LLM Integration Coming Soon</p>
                <p className="text-sm text-slate-400">
                  This panel will host an interactive AI assistant for maritime analysis and insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaritimeMap;
