
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Ship, DollarSign, AlertTriangle } from 'lucide-react';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedChokepoint, setSelectedChokepoint] = useState<Chokepoint | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  const chokepoints: Chokepoint[] = [
    {
      id: 'strait_of_gibraltar',
      name: 'Strait of Gibraltar',
      coordinates: [-5.3603, 35.9375],
      nearbyPorts: ['Algeciras', 'Tangier', 'Ceuta'],
      tradeVolume: '~100,000 vessels/year',
      geopoliticalNotes: 'Key gateway between Atlantic and Mediterranean, controlled by Spain and Morocco',
      strategicImportance: 'Critical'
    },
    {
      id: 'suez_canal',
      name: 'Suez Canal',
      coordinates: [32.3078, 30.5728],
      nearbyPorts: ['Port Said', 'Suez', 'Alexandria'],
      tradeVolume: '~19,000 vessels/year',
      geopoliticalNotes: 'Vital route connecting Europe and Asia, controlled by Egypt',
      strategicImportance: 'Critical'
    },
    {
      id: 'strait_of_hormuz',
      name: 'Strait of Hormuz',
      coordinates: [56.2500, 26.5333],
      nearbyPorts: ['Dubai', 'Bandar Abbas', 'Fujairah'],
      tradeVolume: '~21% of global petroleum liquids',
      geopoliticalNotes: 'Critical oil chokepoint, potential for Iran to disrupt traffic',
      strategicImportance: 'Critical'
    },
    {
      id: 'strait_of_malacca',
      name: 'Strait of Malacca',
      coordinates: [100.3517, 2.5104],
      nearbyPorts: ['Singapore', 'Port Klang', 'Johor'],
      tradeVolume: '~25% of traded goods globally',
      geopoliticalNotes: 'Major trade route between Indian and Pacific Oceans',
      strategicImportance: 'Critical'
    },
    {
      id: 'panama_canal',
      name: 'Panama Canal',
      coordinates: [-79.9081, 9.0781],
      nearbyPorts: ['Balboa', 'Cristóbal', 'Manzanillo'],
      tradeVolume: '~14,000 vessels/year',
      geopoliticalNotes: 'Key connection between Atlantic and Pacific, operated by Panama',
      strategicImportance: 'High'
    },
    {
      id: 'bab_el_mandeb',
      name: 'Bab el-Mandeb Strait',
      coordinates: [43.3333, 12.5833],
      nearbyPorts: ['Aden', 'Djibouti', 'Assab'],
      tradeVolume: '~4.8 million barrels/day',
      geopoliticalNotes: 'Strategic route to Suez Canal, affected by regional conflicts',
      strategicImportance: 'High'
    }
  ];

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 2,
      center: [0, 20],
      projection: 'globe' as any
    });

    map.current.on('style.load', () => {
      if (!map.current) return;
      
      map.current.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02
      });

      // Add chokepoint markers
      chokepoints.forEach((chokepoint) => {
        const el = document.createElement('div');
        el.className = 'chokepoint-marker';
        el.style.cssText = `
          background-color: #ef4444;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        `;
        
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
          el.style.backgroundColor = '#dc2626';
        });
        
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.backgroundColor = '#ef4444';
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat(chokepoint.coordinates)
          .addTo(map.current!);

        el.addEventListener('click', () => {
          setSelectedChokepoint(chokepoint);
          map.current?.flyTo({
            center: chokepoint.coordinates,
            zoom: 8,
            duration: 2000
          });
        });
      });
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
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

  if (!isTokenSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">Enter Mapbox Token</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-blue-200 text-sm">
              Please enter your Mapbox public token to continue. You can get one at{' '}
              <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                mapbox.com
              </a>
            </p>
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button onClick={handleTokenSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
              Continue to Map
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              Back to Role Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-slate-900">
      {/* Map Area */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        
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
