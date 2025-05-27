
export interface Chokepoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  connects: string;
  whyItMatters: string;
  strategicImportance: 'High' | 'Medium' | 'Critical';
  tradePercentage?: string;
}
