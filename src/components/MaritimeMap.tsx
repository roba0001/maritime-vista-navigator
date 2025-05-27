
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Ship, DollarSign, AlertTriangle } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Chokepoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Gibraltar chokepoint data
  const chokepoints: Chokepoint[] = [
    {
      id: 'strait_of_gibraltar',
      name: 'Strait of Gibraltar',
      lat: 36.1408,
      lng: -5.3536,
      nearbyPorts: ['Algeciras', 'Tangier', 'Ceuta'],
      tradeVolume: '~100,000 vessels/year',
      geopoliticalNotes: 'Key gateway between Atlantic and Mediterranean, controlled by Spain and Morocco',
      strategicImportance: 'Critical'
    }
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    console.log('Initializing MapLibre map');

    // Initialize MapLibre map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 20],
      zoom: 1,
      pitch: 60,
      bearing: 0,
      projection: 'globe' as any
    });

    mapRef.current = map;

    map.on('style.load', () => {
      console.log('Map style loaded, adding fog effect');
      map.setFog({}); // add atmospheric effect
      
      // Add chokepoint markers
      chokepoints.forEach(chokepoint => {
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'chokepoint-marker';
        markerElement.style.width = '20px';
        markerElement.style.height = '20px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = '#FFD700';
        markerElement.style.border = '3px solid #000';
        markerElement.style.cursor = 'pointer';
        markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';

        // Create marker
        const marker = new maplibregl.Marker(markerElement)
          .setLngLat([chokepoint.lng, chokepoint.lat])
          .addTo(map);

        markersRef.current.push(marker);

        // Add click event
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('Chokepoint clicked:', chokepoint.name);
          handleChokepointClick(chokepoint);
        });

        // Add label
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false
        })
          .setLngLat([chokepoint.lng, chokepoint.lat])
          .setHTML(`<div style="background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${chokepoint.name}</div>`)
          .addTo(map);
      });
    });

    map.on('load', () => {
      console.log('MapLibre map loaded successfully');
    });

    return () => {
      console.log('Cleaning up MapLibre map');
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleChokepointClick = (chokepoint: Chokepoint) => {
    console.log('Handling chokepoint click:', chokepoint.name);
    setSelectedChokepoint(chokepoint);
    
    // Fly to chokepoint location
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [chokepoint.lng, chokepoint.lat],
        zoom: 8,
        pitch: 45,
        bearing: 0,
        essential: true,
        duration: 2000
      });
    }
  };

  const handleZoomOut = () => {
    console.log('Zooming out to world view');
    setSelectedChokepoint(null);
    
    // Fly back to world view
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [0, 20],
        zoom: 1,
        pitch: 60,
        bearing: 0,
        essential: true,
        duration: 2000
      });
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

        {/* MapLibre Container */}
        <div ref={mapContainerRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

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
