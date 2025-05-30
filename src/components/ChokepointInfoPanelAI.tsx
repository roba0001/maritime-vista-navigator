import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Ship, DollarSign, AlertTriangle, Bot } from "lucide-react";
import { Chokepoint } from "@/data/chokepoints";

interface ChokepointInfoPanelProps {
  chokepoint: Chokepoint;
}

const ChokepointInfoPanelAI: React.FC<ChokepointInfoPanelProps> = ({ chokepoint }) => {
  return (
    //
    <div className="absolute bottom-6 left-4 z-10 flex space-x-4">
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

export default ChokepointInfoPanelAI;
