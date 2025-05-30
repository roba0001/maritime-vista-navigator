
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { chokepoints, Chokepoint } from '@/data/chokepoints';
import ChokepointInfoPanel from './ChokepointInfoPanel';
import Globe from 'globe.gl';

interface MaritimeMapProps {
  selectedRole: 'cargo_owner' | 'shipping_agency' | 'naval_actor';
  onBack: () => void;
}

const MaritimeMap: React.FC<MaritimeMapProps> = ({ selectedRole, onBack }) => {
  const [selectedChokepoint, setSelectedChokepoint] = useState<Chokepoint | null>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (!globeContainerRef.current) return;

    console.log('Initializing Globe.gl');

    // Initialize Globe.gl
    const globe = Globe()(globeContainerRef.current)
      .globeTileEngineUrl((x, y, l) => `https://tile.openstreetmap.org/${l}/${x}/${y}.png`)
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereAltitude(0.1)
      .width(globeContainerRef.current.clientWidth)
      .height(globeContainerRef.current.clientHeight);

    globeRef.current = globe;

    // Set initial camera position
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2 });

    // Add shipping routes
    addShippingRoutes(globe);

    // Add chokepoints
    addChokepoints(globe);

    console.log('Globe.gl initialized successfully');

    // Handle window resize
    const handleResize = () => {
      if (globeRef.current && globeContainerRef.current) {
        globeRef.current
          .width(globeContainerRef.current.clientWidth)
          .height(globeContainerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) {
        // Clean up globe instance
        try {
          globeRef.current._destructor && globeRef.current._destructor();
        } catch (error) {
          console.error('Error cleaning up globe:', error);
        }
        globeRef.current = null;
      }
    };
  }, []);

  const addShippingRoutes = (globe: any) => {
    // Define major shipping routes connecting chokepoints
    const shippingRoutes = [
      // Europe-Asia route via Suez
      { from: 'english_channel', to: 'strait_of_gibraltar' },
      { from: 'strait_of_gibraltar', to: 'suez_canal' },
      { from: 'suez_canal', to: 'bab_el_mandeb' },
      { from: 'bab_el_mandeb', to: 'strait_of_hormuz' },
      { from: 'strait_of_hormuz', to: 'strait_of_malacca' },
      
      // Trans-Atlantic routes
      { from: 'english_channel', to: 'panama_canal' },
      { from: 'strait_of_gibraltar', to: 'panama_canal' },
      
      // Pacific routes
      { from: 'panama_canal', to: 'strait_of_malacca' },
      
      // Black Sea connections
      { from: 'bosporus_strait', to: 'suez_canal' },
      { from: 'bosporus_strait', to: 'strait_of_gibraltar' },
      
      // Baltic connections
      { from: 'danish_straits', to: 'english_channel' },
      { from: 'danish_straits', to: 'bosporus_strait' },
    ];

    const routeData = shippingRoutes.map(route => {
      const fromChokepoint = chokepoints.find(c => c.id === route.from);
      const toChokepoint = chokepoints.find(c => c.id === route.to);
      
      if (fromChokepoint && toChokepoint) {
        return {
          startLat: fromChokepoint.lat,
          startLng: fromChokepoint.lng,
          endLat: toChokepoint.lat,
          endLng: toChokepoint.lng,
          color: '#00FFFF',
          strokeWidth: 2
        };
      }
      return null;
    }).filter(Boolean);

    globe.arcsData(routeData)
      .arcColor('color')
      .arcStroke('strokeWidth')
      .arcAltitude(0.1)
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(3000);
  };

  const addChokepoints = (globe: any) => {
    const chokepointData = chokepoints.map(chokepoint => ({
      lat: chokepoint.lat,
      lng: chokepoint.lng,
      size: 12,
      color: '#FFFF00',
      label: chokepoint.name,
      chokepoint: chokepoint
    }));

    globe.pointsData(chokepointData)
      .pointColor('color')
      .pointRadius('size')
      .pointAltitude(0.02)
      .pointLabel(d => d.label)
      .onPointClick((point: any) => {
        console.log('Chokepoint clicked:', point.chokepoint.name);
        handleChokepointClick(point.chokepoint);
      });
  };

  const handleChokepointClick = (chokepoint: Chokepoint) => {
    console.log('Chokepoint clicked:', chokepoint.name);
    setSelectedChokepoint(chokepoint);
    
    if (globeRef.current) {
      // Zoom to chokepoint location
      globeRef.current.pointOfView({
        lat: chokepoint.lat,
        lng: chokepoint.lng,
        altitude: 0.5
      }, 2000);
    }
  };

  const handleZoomOut = () => {
    console.log('Zooming out');
    setSelectedChokepoint(null);
    
    if (globeRef.current) {
      // Zoom out to world view
      globeRef.current.pointOfView({
        lat: 20,
        lng: 0,
        altitude: 2
      }, 2000);
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
        <div ref={globeContainerRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

        {/* Chokepoint Info Panel */}
        {selectedChokepoint && (
          <ChokepointInfoPanel chokepoint={selectedChokepoint} />
        )}
      </div>

      {/* Right Sidebar - LLM Placeholder */}
      <div className="w-96 bg-slate-800 border-l border-slate-700">
        <div className="p-6">
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="p-6">
              <div className="text-slate-300 text-center py-8">
                <div className="w-16 h-16 bg-slate-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 text-slate-400">🌐</div>
                </div>
                <p className="mb-2 font-semibold">Global Maritime Intelligence</p>
                <p className="text-sm text-slate-400">
                  Advanced AI analysis for maritime chokepoints and shipping intelligence coming soon.
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
