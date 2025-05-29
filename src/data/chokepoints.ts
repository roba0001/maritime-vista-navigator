
export interface Chokepoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  connects: string;
  importance: string;
  tradeVolume: string;
  keyRisks: string;
  strategicNotes: string;
}

export const chokepoints: Chokepoint[] = [
  {
    id: 'english_channel',
    name: 'English Channel',
    lat: 50.0755,
    lng: -1.8059,
    connects: 'North Sea ↔ Atlantic Ocean',
    importance: 'Busiest maritime route in the world',
    tradeVolume: '~500 vessels/day',
    keyRisks: 'Weather, congestion, Brexit implications',
    strategicNotes: 'Vital for EU–UK trade and North Sea traffic. Critical chokepoint for European commerce.'
  },
  {
    id: 'danish_straits',
    name: 'Danish Straits',
    lat: 55.6761,
    lng: 12.5683,
    connects: 'Baltic Sea ↔ North Sea',
    importance: 'Only access for Baltic states to open ocean',
    tradeVolume: '~50,000 vessels/year',
    keyRisks: 'Ice conditions, NATO tensions, Russian access',
    strategicNotes: 'Critical for Baltic states and Russia access to open ocean. Key NATO strategic interest.'
  },
  {
    id: 'bosporus_strait',
    name: 'Bosporus Strait',
    lat: 41.1211,
    lng: 29.0497,
    connects: 'Black Sea ↔ Mediterranean Sea',
    importance: 'Key outlet for Russian and Ukrainian exports',
    tradeVolume: '~45,000 vessels/year',
    keyRisks: 'Very narrow passage, political tensions, heavy traffic',
    strategicNotes: 'Critical for Black Sea grain and energy exports. Controlled by Turkey under Montreux Convention.'
  },
  {
    id: 'panama_canal',
    name: 'Panama Canal',
    lat: 9.0819,
    lng: -79.8068,
    connects: 'Atlantic ↔ Pacific Ocean',
    importance: 'Major shortcut for East-West trade',
    tradeVolume: '~14,000 transits/year',
    keyRisks: 'Water shortages, capacity constraints, climate change',
    strategicNotes: 'Saves 13,000 km around South America. Handles 40% of US container traffic.'
  },
  {
    id: 'strait_of_gibraltar',
    name: 'Strait of Gibraltar',
    lat: 36.1408,
    lng: -5.3536,
    connects: 'Atlantic Ocean ↔ Mediterranean Sea',
    importance: '1/3 of global shipping passes nearby',
    tradeVolume: '~100,000 vessels/year',
    keyRisks: 'Heavy traffic, terrorism threats, migration issues',
    strategicNotes: 'Critical gateway between Atlantic and Mediterranean. Joint Spanish-Moroccan control.'
  },
  {
    id: 'suez_canal',
    name: 'Suez Canal',
    lat: 30.5234,
    lng: 32.3426,
    connects: 'Red Sea ↔ Mediterranean Sea',
    importance: 'Handles ~12% of global trade',
    tradeVolume: '~20,000 vessels/year',
    keyRisks: 'Blockage risk, political instability, terrorism',
    strategicNotes: 'Key Europe-Asia trade route. Ever Given blockage in 2021 showed vulnerability.'
  },
  {
    id: 'bab_el_mandeb',
    name: 'Bab el-Mandeb Strait',
    lat: 12.5840,
    lng: 43.3183,
    connects: 'Red Sea ↔ Gulf of Aden',
    importance: 'Gateway between Suez Canal and Indian Ocean',
    tradeVolume: '~21,000 vessels/year',
    keyRisks: 'Piracy, Houthi attacks, regional conflicts',
    strategicNotes: 'Critical link in Europe-Asia trade route. Recent attacks on commercial shipping.'
  },
  {
    id: 'strait_of_hormuz',
    name: 'Strait of Hormuz',
    lat: 26.5669,
    lng: 56.2788,
    connects: 'Persian Gulf ↔ Arabian Sea',
    importance: 'World\'s most important oil chokepoint',
    tradeVolume: '~20% of global oil transit',
    keyRisks: 'Iranian tensions, military conflicts, terrorism',
    strategicNotes: 'Critical for global energy security. Any disruption causes immediate oil price spikes.'
  },
  {
    id: 'strait_of_malacca',
    name: 'Strait of Malacca',
    lat: 4.1815,
    lng: 100.1002,
    connects: 'Indian Ocean ↔ South China Sea',
    importance: 'Shortest Asia-Europe route',
    tradeVolume: '~30% of global trade',
    keyRisks: 'Piracy, congestion, territorial disputes',
    strategicNotes: 'Most critical chokepoint for Asian trade. Alternative routes add weeks to shipping.'
  }
];
