
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { chokepoints, Chokepoint } from '@/data/chokepoints';
import ChokepointInfoPanel from './ChokepointInfoPanel';

interface MaritimeMapProps {
  selectedRole: 'cargo_owner' | 'shipping_agency' | 'naval_actor';
  onBack: () => void;
}

const MaritimeMap: React.FC<MaritimeMapProps> = ({ selectedRole, onBack }) => {
  const [selectedChokepoint, setSelectedChokepoint] = useState<Chokepoint | null>(null);
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!cesiumContainerRef.current || typeof window === 'undefined') return;

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
          vrButton: false,
          // Use Natural Earth II imagery for clear continent visibility
          imageryProvider: new window.Cesium.createWorldImagery({
            style: window.Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS_ON_DEMAND
          })
        });

        viewerRef.current = viewer;

        // Set initial camera position for better globe view
        viewer.camera.setView({
          destination: window.Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
          orientation: {
            heading: 0.0,
            pitch: -window.Cesium.Math.PI_OVER_TWO,
            roll: 0.0
          }
        });

        // Add shipping routes connecting chokepoints
        addShippingRoutes(viewer);

        // Add chokepoint entities
        chokepoints.forEach(chokepoint => {
          const entity = viewer.entities.add({
            position: window.Cesium.Cartesian3.fromDegrees(chokepoint.lng, chokepoint.lat),
            point: {
              pixelSize: 12,
              color: window.Cesium.Color.YELLOW,
              outlineColor: window.Cesium.Color.BLACK,
              outlineWidth: 2,
              heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
              scaleByDistance: new window.Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5)
            },
            label: {
              text: chokepoint.name,
              font: '12pt sans-serif',
              style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new window.Cesium.Cartesian2(0, -15),
              fillColor: window.Cesium.Color.WHITE,
              outlineColor: window.Cesium.Color.BLACK,
              scaleByDistance: new window.Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5)
            }
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

    const addShippingRoutes = (viewer: any) => {
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

      shippingRoutes.forEach(route => {
        const fromChokepoint = chokepoints.find(c => c.id === route.from);
        const toChokepoint = chokepoints.find(c => c.id === route.to);
        
        if (fromChokepoint && toChokepoint) {
          viewer.entities.add({
            polyline: {
              positions: [
                window.Cesium.Cartesian3.fromDegrees(fromChokepoint.lng, fromChokepoint.lat),
                window.Cesium.Cartesian3.fromDegrees(toChokepoint.lng, toChokepoint.lat)
              ],
              width: 3,
              material: window.Cesium.Color.CYAN.withAlpha(0.6),
              clampToGround: false,
              followSurface: true
            }
          });
        }
      });
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
    
    if (viewerRef.current && window.Cesium) {
      // Add green square marker at the location
      const greenSquare = viewerRef.current.entities.add({
        position: window.Cesium.Cartesian3.fromDegrees(chokepoint.lng, chokepoint.lat),
        rectangle: {
          coordinates: window.Cesium.Rectangle.fromDegrees(
            chokepoint.lng - 0.5,
            chokepoint.lat - 0.5,
            chokepoint.lng + 0.5,
            chokepoint.lat + 0.5
          ),
          material: window.Cesium.Color.LIME.withAlpha(0.8),
          outline: true,
          outlineColor: window.Cesium.Color.GREEN,
          height: 10000
        }
      });

      // Store reference to remove later
      greenSquare.isGreenMarker = true;

      // Fly to chokepoint location with closer zoom
      viewerRef.current.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(chokepoint.lng, chokepoint.lat, 2000000),
        duration: 2.0
      });
    }
  };

  const handleZoomOut = () => {
    console.log('Zooming out');
    setSelectedChokepoint(null);
    
    if (viewerRef.current && window.Cesium) {
      // Remove green markers
      const entitiesToRemove = [];
      for (let i = 0; i < viewerRef.current.entities.values.length; i++) {
        const entity = viewerRef.current.entities.values[i];
        if (entity.isGreenMarker) {
          entitiesToRemove.push(entity);
        }
      }
      entitiesToRemove.forEach(entity => viewerRef.current.entities.remove(entity));

      // Fly to world view
      viewerRef.current.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
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

// Add Cesium types to window
declare global {
  interface Window {
    Cesium: any;
  }
}

export default MaritimeMap;
