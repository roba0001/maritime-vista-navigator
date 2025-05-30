import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Ship, Anchor, Shield } from "lucide-react";

interface CharacterSelectionProps {
  onRoleSelect: (role: "cargo_owner" | "shipping_agency" | "user_role") => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onRoleSelect }) => {
  const roles = [
    {
      id: "cargo_owner" as const,
      title: "Cargo Owner",
      description:
        "Focus on trade routes, shipping costs, and cargo security through maritime chokepoints.",
      icon: Ship,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "shipping_agency" as const,
      title: "Shipping Agency",
      description:
        "Analyze vessel traffic, port operations, and logistics efficiency at strategic maritime locations.",
      icon: Anchor,
      color: "bg-teal-600 hover:bg-teal-700",
    },
    {
      id: "user_role" as const,
      title: "Unsure? ",
      description:
        "Start you personalized analysis by entering your occupation below. This will help us tailor the insights to your needs.",
      icon: Shield,
      color: "bg-slate-600 hover:bg-slate-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 shadow-lg px-4 py-2 rounded-full flex items-center space-x-2">
          <Home className="w-4 h-4" />
          <span>Back to Start</span>
        </Button>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Maritime Chokepoints Analysis</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Select your role to begin exploring global maritime chokepoints and their impact on
            international shipping routes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card
                key={role.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-white/10 rounded-full w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-blue-200 mb-6 leading-relaxed">{role.description}</p>

                  <Button
                    onClick={() => onRoleSelect(role.id)}
                    className={`w-full ${role.color} text-white transition-colors`}
                  >
                    Select Role
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CharacterSelection;
