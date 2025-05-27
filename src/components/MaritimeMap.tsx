
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
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

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
    if (!cesiumContainerRef.current || typeof window === 'undefined') return;

    // Load Cesium dynamically
    const loadCesium = async () => {
      try {
        // Add Cesium CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.113/Build/Cesium/Widgets/widgets.css';
        document.head.appendChild(link);

        // Add Cesium script
        const script = document.createElement('script');
        script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.113/Build/Cesium/Cesium.js';
        script.onload = () => {
          console.log('Cesium loaded successfully');
          initializeCesium();
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Cesium:', error);
      }
    };

    const initializeCesium = () => {
      if (!window.Cesium || !cesiumContainerRef.current) return;

      try {
        console.log('Initializing Cesium viewer');
        
        const viewer = new window.Cesium.Viewer(cesiumContainerRef.current, {
          shouldAnimate: true,
          homeButton: false,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          vrButton: false
        });

        viewerRef.current = viewer;

        // Add chokepoint entities
        chokepoints.forEach(chokepoint => {
          const entity = viewer.entities.add({
            position: window.Cesium.Cartesian3.fromDegrees(chokepoint.lng, chokepoint.lat),
            point: {
              pixelSize: 15,
              color: window.Cesium.Color.YELLOW,
              outlineColor: window.Cesium.Color.BLACK,
              outlineWidth: 2,
              heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
            },
            label: {
              text: chokepoint.name,
              font: '14pt monospace',
              style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new window.Cesium.Cartesian2(0, -9),
              fillColor: window.Cesium.Color.YELLOW,
              outlineColor: window.Cesium.Color.BLACK
            },
            description: `
              <div>
                <h3>${chokepoint.name}</h3>
                <p><strong>Strategic Importance:</strong> ${chokepoint.strategicImportance}</p>
                <p><strong>Trade Volume:</strong> ${chokepoint.tradeVolume}</p>
                <p><strong>Nearby Ports:</strong> ${chokepoint.nearbyPorts.join(', ')}</p>
                <p><strong>Notes:</strong> ${chokepoint.geopoliticalNotes}</p>
              </div>
            `
          });

          // Store chokepoint data with entity
          entity.chokepoint = chokepoint;
        });

        // Handle entity selection
        viewer.selectedEntityChanged.addEventListener((selectedEntity: any) => {
          if (selectedEntity && selectedEntity.chokepoint) {
            console.log('Entity selected:', selectedEntity.chokepoint.name);
            handleChokepointClick(selectedEntity.chokepoint);
          }
        });

        console.log('Cesium viewer initialized successfully');
      } catch (error) {
        console.error('Error initializing Cesium viewer:', error);
      }
    };

    // Check if Cesium is already loaded
    if (window.Cesium) {
      initializeCesium();
    } else {
      loadCesium();
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
          viewerRef.current = null;
        } catch (error) {
          console.error('Error destroying Cesium viewer:', error);
        }
      }
    };
  }, []);

  const handleChokepointClick = (chokepoint: Chokepoint) => {
    console.log('Chokepoint clicked:', chokepoint.name);
    setSelectedChokepoint(chokepoint);
    
    // Fly to chokepoint location
    if (viewerRef.current && window.Cesium) {
      viewerRef.current.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(chokepoint.lng, chokepoint.lat, 1000000),
        duration: 2.0
      });
    }
  };

  const handleZoomOut = () => {
    console.log('Zooming out');
    setSelectedChokepoint(null);
    
    // Fly to world view
    if (viewerRef.current && window.Cesium) {
      viewerRef.current.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
        duration: 2.0
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

        {/* Cesium Container */}
        <div ref={cesiumContainerRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

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

// Add Cesium types to window
declare global {
  interface Window {
    Cesium: any;
  }
}

export default MaritimeMap;
