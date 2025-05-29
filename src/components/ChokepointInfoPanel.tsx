
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Ship, DollarSign, AlertTriangle, Bot } from 'lucide-react';
import { Chokepoint } from '@/data/chokepoints';

interface ChokepointInfoPanelProps {
  chokepoint: Chokepoint;
}

const ChokepointInfoPanel: React.FC<ChokepointInfoPanelProps> = ({ chokepoint }) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex space-x-4">
      {/* Main Info Panel */}
      <Card className="bg-white/95 backdrop-blur-sm w-80">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <span>{chokepoint.name}</span>
          </CardTitle>
          <Badge variant="destructive">
            Critical Chokepoint
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <Ship className="w-4 h-4" />
              <span>Connection</span>
            </h4>
            <p className="text-sm text-gray-600">{chokepoint.connects}</p>
          </div>
          
          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <DollarSign className="w-4 h-4" />
              <span>Trade Volume</span>
            </h4>
            <p className="text-sm text-gray-600">{chokepoint.tradeVolume}</p>
          </div>
          
          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Strategic Importance</span>
            </h4>
            <p className="text-sm text-gray-600">{chokepoint.importance}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Key Risks</h4>
            <p className="text-sm text-gray-600">{chokepoint.keyRisks}</p>
          </div>
        </CardContent>
      </Card>

      {/* LLM Integration Panel */}
      <Card className="bg-slate-700/95 backdrop-blur-sm w-64 text-white border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Bot className="w-4 h-4 text-blue-400" />
            <span>AI Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-slate-600 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Bot className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-300 mb-2">AI Insights Coming Soon</p>
            <p className="text-xs text-slate-400">
              Location-specific analysis and real-time intelligence will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChokepointInfoPanel;
