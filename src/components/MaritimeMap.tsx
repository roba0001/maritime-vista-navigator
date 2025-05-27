
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Ship, ZoomOut } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { chokepoints } from '@/data/chokepoints';
import { Chokepoint } from '@/types/chokepoint';
import ChokepointInfoPanel from './ChokepointInfoPanel';
import MapHeader from './MapHeader';

interface MaritimeMapProps {
  selectedRole: 'cargo_owner' | 'shipping_agency' | 'naval_actor';
  onBack: () => void;
}

const MaritimeMap: React.FC<MaritimeMapProps> = ({ selectedRole, onBack }) => {
  const [selectedChokepoint, setSelectedChokepoint] = useState<Chokepoint | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    console.log('Initializing MapLibre map with globe projection');

    // Initialize MapLibre map with globe projection
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
      console.log('Map style loaded, adding fog and chokepoint markers');
      
      // Add atmospheric effect
      (map as any).setFog({});
      
      // Add chokepoint markers
      chokepoints.forEach(chokepoint => {
        // Create a more visible marker button element
        const markerElement = document.createElement('button');
        markerElement.className = 'chokepoint-marker-button';
        markerElement.innerHTML = `
          <div style="
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: #DC2626;
            border: 3px solid #FFFFFF;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <div style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: #FFFFFF;
            "></div>
          </div>
          <div style="
            position: absolute;
            top: -35px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1000;
          ">${chokepoint.name}</div>
        `;

        // Add hover effect
        markerElement.addEventListener('mouseenter', () => {
          const dot = markerElement.querySelector('div > div') as HTMLElement;
          if (dot) {
            markerElement.style.transform = 'scale(1.2)';
            dot.style.backgroundColor = '#FEE2E2';
          }
        });

        markerElement.addEventListener('mouseleave', () => {
          const dot = markerElement.querySelector('div > div') as HTMLElement;
          if (dot) {
            markerElement.style.transform = 'scale(1)';
            dot.style.backgroundColor = '#FFFFFF';
          }
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
      });
    });

    map.on('load', () => {
      console.log('MapLibre map loaded successfully with globe projection');
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
    console.log('Handling chokepoint click and zoom:', chokepoint.name);
    setSelectedChokepoint(chokepoint);
    
    // Fly to chokepoint location with appropriate zoom level
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [chokepoint.lng, chokepoint.lat],
        zoom: 6,
        pitch: 30,
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

  return (
    <div className="h-screen flex bg-slate-900">
      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Header */}
        <MapHeader selectedRole={selectedRole} onBack={onBack} />

        {/* Zoom out button */}
        {selectedChokepoint && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={handleZoomOut}
              className="bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center space-x-2"
            >
              <ZoomOut className="w-4 h-4" />
              <span>Zoom Out</span>
            </Button>
          </div>
        )}

        {/* MapLibre Container */}
        <div ref={mapContainerRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

        {/* Chokepoint Info Panel */}
        {selectedChokepoint && (
          <ChokepointInfoPanel chokepoint={selectedChokepoint} />
        )}
      </div>

      {/* Right Sidebar - LLM Placeholder */}
      <div className="w-96 bg-slate-800 border-l border-slate-700">
        <div className="p-6">
          <div className="bg-slate-700 border-slate-600 rounded-lg border p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Maritime Intelligence Assistant</h3>
            <div className="text-slate-300 text-center py-8">
              <div className="w-16 h-16 bg-slate-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Ship className="w-8 h-8 text-slate-400" />
              </div>
              <p className="mb-2">LLM Integration Coming Soon</p>
              <p className="text-sm text-slate-400">
                This panel will host an interactive AI assistant for maritime analysis and insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaritimeMap;
