
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, Ship, Info } from 'lucide-react';

interface IntroductionPageProps {
  onContinue: () => void;
}

const IntroductionPage: React.FC<IntroductionPageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 p-6 bg-white/10 rounded-full w-24 h-24 flex items-center justify-center">
            <Globe className="w-12 h-12 text-blue-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Maritime Chokepoints Intelligence</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
           <span className='font-bold'> Navigate Geopolitical Risk. Build Resilience. </span> <br/>Explore critical maritime chokepoints that control global shipping routes and international trade flows. 
            Analyze strategic locations, understand geopolitical implications, and assess economic impacts through 
            an interactive 3D globe visualization.
          </p>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">What You'll Discover</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-white/10 rounded-full w-16 h-16 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">9 Critical Chokepoints</h3>
              <p className="text-blue-200 text-sm">
                From the Strait of Hormuz to the Panama Canal, explore the world's most strategic maritime passages.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-white/10 rounded-full w-16 h-16 flex items-center justify-center">
                <Ship className="w-8 h-8 text-teal-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Role-Based Analysis</h3>
              <p className="text-blue-200 text-sm">
                View insights from the perspective of cargo owners, shipping agencies, or naval actors.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-white/10 rounded-full w-16 h-16 flex items-center justify-center">
                <Info className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Intelligent Insights</h3>
              <p className="text-blue-200 text-sm">
                Access AI-powered analysis and contextual information for each strategic location.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            onClick={onContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            Begin Exploration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;
