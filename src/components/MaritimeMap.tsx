
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
  connects: string;
  whyItMatters: string;
  strategicImportance: 'High' | 'Medium' | 'Critical';
  tradePercentage?: string;
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

  const chokepoints: Chokepoint[] = [
    {
      id: 'english_channel',
      name: 'English Channel',
      lat: 50.2,
      lng: 1.0,
      connects: 'North Sea ↔ Atlantic Ocean',
      whyItMatters: 'Busiest maritime route in the world; vital for EU–UK trade and North Sea traffic.',
      strategicImportance: 'Critical'
    },
    {
      id: 'danish_straits',
      name: 'Danish Straits',
      lat: 55.8,
      lng: 12.6,
      connects: 'Baltic Sea ↔ North Sea',
      whyItMatters: 'Only access for Baltic states and Russia to open ocean; NATO strategic interest.',
      strategicImportance: 'High'
    },
    {
      id: 'bosphorus_strait',
      name: 'Bosphorus Strait',
      lat: 41.1,
      lng: 29.0,
      connects: 'Black Sea ↔ Mediterranean Sea',
      whyItMatters: 'Key outlet for Russian, Ukrainian, and Romanian exports; very narrow and busy.',
      strategicImportance: 'Critical'
    },
    {
      id: 'panama_canal',
      name: 'Panama Canal',
      lat: 9.0,
      lng: -79.5,
      connects: 'Atlantic ↔ Pacific Ocean',
      whyItMatters: 'Major shortcut for East-West trade; saves 13,000 km around South America.',
      strategicImportance: 'Critical'
    },
    {
      id: 'strait_of_gibraltar',
      name: 'Strait of Gibraltar',
      lat: 36.1,
      lng: -5.4,
      connects: 'Atlantic Ocean ↔ Mediterranean Sea',
      whyItMatters: '1/3 of global shipping passes nearby; critical for Mediterranean access.',
      strategicImportance: 'Critical',
      tradePercentage: '33% of global shipping'
    },
    {
      id: 'suez_canal',
      name: 'Suez Canal',
      lat: 30.5,
      lng: 32.3,
      connects: 'Red Sea ↔ Mediterranean Sea',
      whyItMatters: 'Key for Europe–Asia trade; handles ~12% of global trade. Vulnerable to blockage.',
      strategicImportance: 'Critical',
      tradePercentage: '12% of global trade'
    },
    {
      id: 'bab_el_mandeb',
      name: 'Bab el-Mandeb Strait',
      lat: 12.6,
      lng: 43.3,
      connects: 'Red Sea ↔ Gulf of Aden (Indian Ocean)',
      whyItMatters: 'Gateway between Suez Canal and Indian Ocean; risk from regional instability.',
      strategicImportance: 'Critical'
    },
    {
      id: 'strait_of_hormuz',
      name: 'Strait of Hormuz',
      lat: 26.6,
      lng: 56.3,
      connects: 'Persian Gulf ↔ Arabian Sea',
      whyItMatters: "World's most important oil chokepoint (~20% of oil passes through).",
      strategicImportance: 'Critical',
      tradePercentage: '20% of global oil'
    },
    {
      id: 'strait_of_malacca',
      name: 'Strait of Malacca',
      lat: 4.2,
      lng: 100.0,
      connects: 'Indian Ocean ↔ South China Sea (Pacific)',
      whyItMatters: 'Shortest Asia–Europe route; handles ~30% of global trade. Piracy, congestion risks.',
      strategicImportance: 'Critical',
      tradePercentage: '30% of global trade'
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
      bearing: 0
    });

    mapRef.current = map;

    map.on('style.load', () => {
      console.log('Map style loaded, adding chokepoint markers');
      
      // Add chokepoint markers
      chokepoints.forEach(chokepoint => {
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'chokepoint-marker';
        markerElement.style.width = '20px';
        markerElement.style.height = '20px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = '#FF4444';
        markerElement.style.border = '3px solid #FFFFFF';
        markerElement.style.cursor = 'pointer';
        markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
        markerElement.style.transition = 'all 0.3s ease';

        // Add hover effect
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.2)';
          markerElement.style.backgroundColor = '#FF6666';
        });

        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.backgroundColor = '#FF4444';
        });

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

        // Add label popup
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
    
    // Fly to chokepoint location with appropriate zoom level
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [chokepoint.lng, chokepoint.lat],
        zoom: 6,
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
          <div className="absolute bottom-4 left-4 z-10 w-96">
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
                    <span>Connects</span>
                  </h4>
                  <p className="text-sm text-gray-600">{selectedChokepoint.connects}</p>
                </div>
                
                {selectedChokepoint.tradePercentage && (
                  <div>
                    <h4 className="font-semibold flex items-center space-x-1 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Trade Volume</span>
                    </h4>
                    <p className="text-sm text-gray-600">{selectedChokepoint.tradePercentage}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold flex items-center space-x-1 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Strategic Importance</span>
                  </h4>
                  <p className="text-sm text-gray-600">{selectedChokepoint.whyItMatters}</p>
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
