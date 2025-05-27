
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Ship, DollarSign, AlertTriangle } from 'lucide-react';
import { Chokepoint } from '@/types/chokepoint';

interface ChokepointInfoPanelProps {
  chokepoint: Chokepoint;
}

const ChokepointInfoPanel: React.FC<ChokepointInfoPanelProps> = ({ chokepoint }) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 w-96">
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <span>{chokepoint.name}</span>
          </CardTitle>
          <Badge variant={chokepoint.strategicImportance === 'Critical' ? 'destructive' : 'secondary'}>
            {chokepoint.strategicImportance} Importance
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <Ship className="w-4 h-4" />
              <span>Connects</span>
            </h4>
            <p className="text-sm text-gray-600">{chokepoint.connects}</p>
          </div>
          
          {chokepoint.tradePercentage && (
            <div>
              <h4 className="font-semibold flex items-center space-x-1 mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Trade Volume</span>
              </h4>
              <p className="text-sm text-gray-600">{chokepoint.tradePercentage}</p>
            </div>
          )}
          
          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Strategic Importance</span>
            </h4>
            <p className="text-sm text-gray-600">{chokepoint.whyItMatters}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChokepointInfoPanel;
