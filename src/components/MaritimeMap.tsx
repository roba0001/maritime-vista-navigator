
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Ship, DollarSign, AlertTriangle } from 'lucide-react';

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
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstance = useRef<any>(null);

  // Gibraltar chokepoint with lat/lng format for globe.gl
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
    if (!globeRef.current) return;

    // Import Globe dynamically to avoid SSR issues
    import('globe.gl').then(({ default: Globe }) => {
      console.log('Initializing globe');
      
      const globe = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .labelsData(chokepoints)
        .labelLat(d => d.lat)
        .labelLng(d => d.lng)
        .labelText(d => d.name)
        .labelSize(2)
        .labelDotRadius(0.5)
        .labelColor(() => '#ff4444')
        .labelResolution(3)
        .onLabelClick((label) => {
          console.log('Label clicked:', label);
          const chokepoint = chokepoints.find(cp => cp.id === label.id);
          if (chokepoint) {
            handleChokepointClick(chokepoint);
          }
        })
        .width(globeRef.current.clientWidth)
        .height(globeRef.current.clientHeight);

      globeInstance.current = globe;
      globe(globeRef.current);

      // Handle window resize
      const handleResize = () => {
        if (globe && globeRef.current) {
          globe
            .width(globeRef.current.clientWidth)
            .height(globeRef.current.clientHeight);
        }
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }).catch(error => {
      console.error('Failed to load Globe:', error);
    });

    return () => {
      if (globeInstance.current) {
        // Cleanup globe instance
        globeInstance.current = null;
      }
    };
  }, []);

  const handleChokepointClick = (chokepoint: Chokepoint) => {
    console.log('Chokepoint clicked:', chokepoint.name);
    setSelectedChokepoint(chokepoint);
    
    // Zoom to chokepoint location
    if (globeInstance.current) {
      globeInstance.current.pointOfView({
        lat: chokepoint.lat,
        lng: chokepoint.lng,
        altitude: 1.5
      }, 1000);
    }
  };

  const handleZoomOut = () => {
    console.log('Zooming out');
    setSelectedChokepoint(null);
    
    // Reset to world view
    if (globeInstance.current) {
      globeInstance.current.pointOfView({
        lat: 0,
        lng: 0,
        altitude: 2.5
      }, 1000);
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

        {/* Globe Container */}
        <div ref={globeRef} className="absolute inset-0" />

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
