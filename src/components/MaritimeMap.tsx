
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { chokepoints, Chokepoint } from '@/data/chokepoints';
import ChokepointInfoPanel from './ChokepointInfoPanel';
import Globe from 'globe.gl';

interface MaritimeMapProps {
  selectedRole: 'cargo_owner' | 'shipping_agency' | 'naval_actor';
  onBack: () => void;
  onBackToStart: () => void;
}

const MaritimeMap: React.FC<MaritimeMapProps> = ({ selectedRole, onBack, onBackToStart }) => {
  const [selectedChokepoint, setSelectedChokepoint] = useState<Chokepoint | null>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (!globeContainerRef.current) return;

    console.log('Initializing Globe.gl');

    // Initialize Globe.gl with OpenStreetMap tiles
    const globe = new Globe(globeContainerRef.current)
      .globeTileEngineUrl((x, y, l) => `https://tile.openstreetmap.org/${l}/${x}/${y}.png`)
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereAltitude(0.1)
      .width(globeContainerRef.current.clientWidth)
      .height(globeContainerRef.current.clientHeight);

    globeRef.current = globe;

    // Set initial camera position
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2 });

    // Add continuous slow rotation
    const rotationSpeed = 0.02; // 90% slower (was 0.2, now 0.02)
    const animate = () => {
      if (globeRef.current && !selectedChokepoint) { // Only rotate when no chokepoint is selected
        const currentView = globeRef.current.pointOfView();
        globeRef.current.pointOfView({
          lat: currentView.lat,
          lng: currentView.lng + rotationSpeed,
          altitude: currentView.altitude
        });
      }
      requestAnimationFrame(animate);
    };
    animate();

    // Add shipping routes with realistic ocean paths
    addRealisticShippingRoutes(globe);

    // Add tactical chokepoint markers
    addTacticalChokepointMarkers(globe);

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
        try {
          globeRef.current._destructor && globeRef.current._destructor();
        } catch (error) {
          console.error('Error cleaning up globe:', error);
        }
        globeRef.current = null;
      }
    };
  }, [selectedChokepoint]); // Add selectedChokepoint as dependency to restart animation when changed

  const addRealisticShippingRoutes = (globe: any) => {
    // Define realistic shipping routes that follow ocean paths
    const oceanRoutes = [
      // Trans-Atlantic routes
      { from: 'english_channel', to: 'panama_canal', waypoints: [
        [50.0755, -1.8059], [45.0, -10.0], [35.0, -25.0], [20.0, -40.0], [15.0, -60.0], [9.0819, -79.8068]
      ]},
      { from: 'strait_of_gibraltar', to: 'panama_canal', waypoints: [
        [36.1408, -5.3536], [30.0, -15.0], [25.0, -30.0], [15.0, -50.0], [12.0, -70.0], [9.0819, -79.8068]
      ]},
      
      // Europe to Asia via Suez
      { from: 'english_channel', to: 'strait_of_gibraltar', waypoints: [
        [50.0755, -1.8059], [45.0, -5.0], [40.0, -7.0], [36.1408, -5.3536]
      ]},
      { from: 'strait_of_gibraltar', to: 'suez_canal', waypoints: [
        [36.1408, -5.3536], [35.0, 5.0], [34.0, 15.0], [32.0, 25.0], [30.5234, 32.3426]
      ]},
      { from: 'suez_canal', to: 'bab_el_mandeb', waypoints: [
        [30.5234, 32.3426], [25.0, 35.0], [20.0, 40.0], [15.0, 42.0], [12.5840, 43.3183]
      ]},
      { from: 'bab_el_mandeb', to: 'strait_of_hormuz', waypoints: [
        [12.5840, 43.3183], [15.0, 50.0], [20.0, 55.0], [25.0, 56.0], [26.5669, 56.2788]
      ]},
      { from: 'strait_of_hormuz', to: 'strait_of_malacca', waypoints: [
        [26.5669, 56.2788], [20.0, 65.0], [10.0, 75.0], [5.0, 85.0], [2.0, 95.0], [4.1815, 100.1002]
      ]},
      
      // Pacific routes
      { from: 'panama_canal', to: 'strait_of_malacca', waypoints: [
        [9.0819, -79.8068], [0.0, -100.0], [-10.0, -120.0], [-5.0, -140.0], [0.0, -160.0], [10.0, 180.0], [5.0, 120.0], [4.1815, 100.1002]
      ]},
      
      // Black Sea connections
      { from: 'bosporus_strait', to: 'suez_canal', waypoints: [
        [41.1211, 29.0497], [38.0, 30.0], [35.0, 31.0], [32.0, 32.0], [30.5234, 32.3426]
      ]},
      
      // Baltic connections
      { from: 'danish_straits', to: 'english_channel', waypoints: [
        [55.6761, 12.5683], [54.0, 8.0], [52.0, 4.0], [51.0, 0.0], [50.0755, -1.8059]
      ]},
    ];

    const routeData = [];

    oceanRoutes.forEach(route => {
      const fromChokepoint = chokepoints.find(c => c.id === route.from);
      const toChokepoint = chokepoints.find(c => c.id === route.to);
      
      if (fromChokepoint && toChokepoint && route.waypoints) {
        // Create smooth path through waypoints
        for (let i = 0; i < route.waypoints.length - 1; i++) {
          routeData.push({
            startLat: route.waypoints[i][0],
            startLng: route.waypoints[i][1],
            endLat: route.waypoints[i + 1][0],
            endLng: route.waypoints[i + 1][1],
            color: 'rgba(220, 20, 20, 0.4)', // Red, semi-transparent
            strokeWidth: 0.8 // Thinner lines
          });
        }
      }
    });

    globe.arcsData(routeData)
      .arcColor('color')
      .arcStroke('strokeWidth')
      .arcAltitude(0.03)
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(4000); // Slower, gentler animation
  };

  const addTacticalChokepointMarkers = (globe: any) => {
    // Add tactical markers using HTML elements for precise control
    const chokepointData = chokepoints.map(chokepoint => ({
      lat: chokepoint.lat,
      lng: chokepoint.lng,
      chokepoint: chokepoint
    }));

    globe.htmlElementsData(chokepointData)
      .htmlElement(d => {
        const el = document.createElement('div');
        el.style.cssText = `
          position: relative;
          width: 20px;
          height: 20px;
          cursor: pointer;
        `;

        // Create yellow targeting reticle (hollow circle)
        const reticle = document.createElement('div');
        reticle.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          border: 2px solid #FFD700;
          border-radius: 50%;
          background: transparent;
          pointer-events: none;
        `;

        // Create red center pin
        const pin = document.createElement('div');
        pin.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background-color: #DC2626;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        `;

        el.appendChild(reticle);
        el.appendChild(pin);

        // Add click handler
        el.addEventListener('click', () => {
          handleChokepointClick(d.chokepoint);
        });

        return el;
      })
      .htmlAltitude(0.02);
  };

  const handleChokepointClick = (chokepoint: Chokepoint) => {
    console.log('Chokepoint clicked:', chokepoint.name);
    setSelectedChokepoint(chokepoint);
    
    if (globeRef.current) {
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
        {/* Header with Back to Start button */}
        <div className="absolute top-4 left-4 z-10 flex space-x-3">
          <Button
            onClick={onBackToStart}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 shadow-lg px-4 py-2 rounded-full flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Start</span>
          </Button>
          
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
