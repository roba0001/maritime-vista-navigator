
import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { chokepoints } from '@/data/chokepoints';
import { Chokepoint } from '@/types/chokepoint';

interface MapContainerProps {
  selectedChokepoint: Chokepoint | null;
  onChokepointSelect: (chokepoint: Chokepoint) => void;
  onZoomOut: () => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  selectedChokepoint, 
  onChokepointSelect, 
  onZoomOut 
}) => {
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

  // Handle zoom to chokepoint when selectedChokepoint changes
  useEffect(() => {
    if (mapRef.current && selectedChokepoint) {
      mapRef.current.flyTo({
        center: [selectedChokepoint.lng, selectedChokepoint.lat],
        zoom: 6,
        pitch: 30,
        bearing: 0,
        essential: true,
        duration: 2000
      });
    } else if (mapRef.current && !selectedChokepoint) {
      mapRef.current.flyTo({
        center: [0, 20],
        zoom: 1,
        pitch: 60,
        bearing: 0,
        essential: true,
        duration: 2000
      });
    }
  }, [selectedChokepoint]);

  const handleChokepointClick = (chokepoint: Chokepoint) => {
    console.log('Handling chokepoint click and zoom:', chokepoint.name);
    onChokepointSelect(chokepoint);
  };

  return (
    <div ref={mapContainerRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  );
};

export default MapContainer;
