
import { Chokepoint } from '@/types/chokepoint';

export const chokepoints: Chokepoint[] = [
  {
    id: 'english_channel',
    name: 'English Channel',
    lat: 50.2,
    lng: 1.0,
    connects: 'North Sea ↔ Atlantic Ocean',
    whyItMatters: 'Busiest maritime route in the world; vital for EU–UK trade and North Sea traffic.',
    strategicImportance: 'Critical'
  },
  {
    id: 'danish_straits',
    name: 'Danish Straits',
    lat: 55.8,
    lng: 12.6,
    connects: 'Baltic Sea ↔ North Sea',
    whyItMatters: 'Only access for Baltic states and Russia to open ocean; NATO strategic interest.',
    strategicImportance: 'High'
  },
  {
    id: 'bosphorus_strait',
    name: 'Bosphorus Strait',
    lat: 41.1,
    lng: 29.0,
    connects: 'Black Sea ↔ Mediterranean Sea',
    whyItMatters: 'Key outlet for Russian, Ukrainian, and Romanian exports; very narrow and busy.',
    strategicImportance: 'Critical'
  },
  {
    id: 'panama_canal',
    name: 'Panama Canal',
    lat: 9.0,
    lng: -79.5,
    connects: 'Atlantic ↔ Pacific Ocean',
    whyItMatters: 'Major shortcut for East-West trade; saves 13,000 km around South America.',
    strategicImportance: 'Critical'
  },
  {
    id: 'strait_of_gibraltar',
    name: 'Strait of Gibraltar',
    lat: 36.1,
    lng: -5.4,
    connects: 'Atlantic Ocean ↔ Mediterranean Sea',
    whyItMatters: '1/3 of global shipping passes nearby; critical for Mediterranean access.',
    strategicImportance: 'Critical',
    tradePercentage: '33% of global shipping'
  },
  {
    id: 'suez_canal',
    name: 'Suez Canal',
    lat: 30.5,
    lng: 32.3,
    connects: 'Red Sea ↔ Mediterranean Sea',
    whyItMatters: 'Key for Europe–Asia trade; handles ~12% of global trade. Vulnerable to blockage.',
    strategicImportance: 'Critical',
    tradePercentage: '12% of global trade'
  },
  {
    id: 'bab_el_mandeb',
    name: 'Bab el-Mandeb Strait',
    lat: 12.6,
    lng: 43.3,
    connects: 'Red Sea ↔ Gulf of Aden (Indian Ocean)',
    whyItMatters: 'Gateway between Suez Canal and Indian Ocean; risk from regional instability.',
    strategicImportance: 'Critical'
  },
  {
    id: 'strait_of_hormuz',
    name: 'Strait of Hormuz',
    lat: 26.6,
    lng: 56.3,
    connects: 'Persian Gulf ↔ Arabian Sea',
    whyItMatters: "World's most important oil chokepoint (~20% of oil passes through).",
    strategicImportance: 'Critical',
    tradePercentage: '20% of global oil'
  },
  {
    id: 'strait_of_malacca',
    name: 'Strait of Malacca',
    lat: 4.2,
    lng: 100.0,
    connects: 'Indian Ocean ↔ South China Sea (Pacific)',
    whyItMatters: 'Shortest Asia–Europe route; handles ~30% of global trade. Piracy, congestion risks.',
    strategicImportance: 'Critical',
    tradePercentage: '30% of global trade'
  }
];
