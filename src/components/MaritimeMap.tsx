
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Ship, DollarSign, AlertTriangle } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red marker for chokepoints
const chokepointIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Chokepoint {
  id: string;
  name: string;
  coordinates: [number, number];
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
  const mapRef = useRef<L.Map | null>(null);

  // Gibraltar chokepoint
  const chokepoints: Chokepoint[] = [
    {
      id: 'strait_of_gibraltar',
      name: 'Strait of Gibraltar',
      coordinates: [36.1408, -5.3536],
      nearbyPorts: ['Algeciras', 'Tangier', 'Ceuta'],
      tradeVolume: '~100,000 vessels/year',
      geopoliticalNotes: 'Key gateway between Atlantic and Mediterranean, controlled by Spain and Morocco',
      strategicImportance: 'Critical'
    }
  ];

  const handleChokepointClick = (chokepoint: Chokepoint) => {
    console.log('Chokepoint clicked:', chokepoint.name);
    setSelectedChokepoint(chokepoint);
    
    // Zoom to chokepoint if map is available
    if (mapRef.current) {
      mapRef.current.setView(chokepoint.coordinates, 10);
    }
  };

  const handleZoomOut = () => {
    console.log('Zooming out');
    setSelectedChokepoint(null);
    
    // Reset to world view
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2);
    }
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

        {/* Zoom out button */}
        {selectedChokepoint && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={handleZoomOut}
              className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
            >
              Zoom Out
            </Button>
          </div>
        )}

        {/* Leaflet Map Container */}
        <div className="absolute inset-0">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {chokepoints.map((chokepoint) => (
              <Marker
                key={chokepoint.id}
                position={chokepoint.coordinates}
                icon={chokepointIcon}
                eventHandlers={{
                  click: () => handleChokepointClick(chokepoint),
                }}
              >
                <Popup>
                  <div className="font-semibold">{chokepoint.name}</div>
                  <div className="text-sm">Click to view details</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Chokepoint Info Panel */}
        {selectedChokepoint && (
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
