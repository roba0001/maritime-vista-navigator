
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomOut } from 'lucide-react';

interface ZoomOutButtonProps {
  onZoomOut: () => void;
}

const ZoomOutButton: React.FC<ZoomOutButtonProps> = ({ onZoomOut }) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        onClick={onZoomOut}
        className="bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center space-x-2"
      >
        <ZoomOut className="w-4 h-4" />
        <span>Zoom Out</span>
      </Button>
    </div>
  );
};

export default ZoomOutButton;
