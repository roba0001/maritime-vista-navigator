
import React, { useState } from 'react';
import { Chokepoint } from '@/types/chokepoint';
import ChokepointInfoPanel from './ChokepointInfoPanel';
import MapHeader from './MapHeader';
import MapContainer from './MapContainer';
import ZoomOutButton from './ZoomOutButton';

interface MaritimeMapProps {
  selectedRole: 'cargo_owner' | 'shipping_agency' | 'naval_actor';
  onBack: () => void;
}

const MaritimeMap: React.FC<MaritimeMapProps> = ({ selectedRole, onBack }) => {
  const [selectedChokepoint, setSelectedChokepoint] = useState<Chokepoint | null>(null);

  const handleChokepointSelect = (chokepoint: Chokepoint) => {
    setSelectedChokepoint(chokepoint);
  };

  const handleZoomOut = () => {
    setSelectedChokepoint(null);
  };

  return (
    <div className="h-screen flex bg-slate-900">
      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Header */}
        <MapHeader selectedRole={selectedRole} onBack={onBack} />

        {/* Zoom out button */}
        {selectedChokepoint && (
          <ZoomOutButton onZoomOut={handleZoomOut} />
        )}

        {/* MapLibre Container */}
        <MapContainer 
          selectedChokepoint={selectedChokepoint}
          onChokepointSelect={handleChokepointSelect}
          onZoomOut={handleZoomOut}
        />

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
                <div className="w-8 h-8 text-slate-400">🚢</div>
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
