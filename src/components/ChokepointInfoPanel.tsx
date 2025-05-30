import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Ship, Earth, Anchor, Wrench, CircleDollarSign, Scale } from "lucide-react";
import { Chokepoint } from "@/data/chokepoints";

interface ChokepointInfoPanelProps {
  chokepoint: Chokepoint;
}

const ChokepointInfoPanel: React.FC<ChokepointInfoPanelProps> = ({ chokepoint }) => {
  return (
    // absolute bottom-4 left-4
    <div className=" z-10 flex space-x-4">
      {/* Main Info Panel */}
      <Card className="bg-white/95 backdrop-blur-sm w-80">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <span>{chokepoint.name}</span>
          </CardTitle>
          <Badge variant="destructive">Critical Chokepoint</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <Earth className="w-4 h-4" />
              <span>Geography</span>
            </h4>
            <p>
              13 km passage between Spain & Morocco; connects Atlantic ↔ Mediterranean. ~120,000
              ships/year (~300/day).
            </p>
          </div>

          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <Anchor className="w-4 h-4" />
              <span>Ports</span>
            </h4>
            <ul>
              <li className="list-disc">Algeciras (Spain): EU logistics hub.</li>
              <li className="list-disc">Tangier-Med (Morocco): Major regional port.</li>
              <li className="list-disc">Gibraltar (UK): Military logistics & bunkering hub.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <Ship className="w-4 h-4" />
              <span>Military Presence</span>
            </h4>
            <p>Spain, UK, Morocco, US, NATO/EU.</p>
          </div>

          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <Wrench className="w-4 h-4" />
              <span>Infrastructure</span>
            </h4>
            <p>
              Rail/highway networks, airfields, radar systems, undersea monitoring; proposed
              Morocco-Spain tunnel.
            </p>
          </div>

          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <CircleDollarSign className="w-4 h-4" />
              <span>Trade</span>
            </h4>
            <p>
              30% global container, 15% oil shipments; total ~226M tons/year. High vessel
              congestion.
            </p>
          </div>

          <div>
            <h4 className="font-semibold flex items-center space-x-1 mb-2">
              <Scale className="w-4 h-4" />
              <span>Jurisdiction</span>
            </h4>
            <p>
              Fragmented between Spain/UK (OECD) & Morocco (non-OECD); complicated by post-Brexit
              tensions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChokepointInfoPanel;
