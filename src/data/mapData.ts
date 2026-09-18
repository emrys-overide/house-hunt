export interface Coordinates {
  x: number;
  y: number;
}

export interface TransportHub {
  id: string;
  name: string;
  type: 'matatu-stage' | 'express-junction' | 'train-station' | 'major-terminus';
  estate: string;
  x: number;
  y: number;
  routes: string[];
  peakFareKes: number;
  offPeakFareKes: number;
  safetyRating: 'High' | 'Moderate' | 'Fair';
  description: string;
}

export interface Amenity {
  id: string;
  name: string;
  category: 'shopping' | 'hospital' | 'education' | 'nature' | 'civic';
  estate: string;
  x: number;
  y: number;
  tag: string;
  iconType: 'mall' | 'supermarket' | 'hospital' | 'clinic' | 'park' | 'school' | 'landmark';
  description: string;
}

export interface MapZone {
  id: string;
  label: string;
  tag: string;
  center: Coordinates;
  zoom: number; // 1 = default, 2 = focused
  panOffset: Coordinates;
  description: string;
}

export interface RoadSpine {
  id: string;
  name: string;
  path: string;
  color: string;
  width: number;
  dashed?: boolean;
  labelPos?: { x: number; y: number; angle?: number };
}

// Coordinate canvas scale: 1000 x 800
export const MAP_DIMENSIONS = {
  width: 1000,
  height: 800,
};

// Base neighborhood centers
export const ESTATE_COORDINATES: Record<string, Coordinates> = {
  'Complex Utawala': { x: 855, y: 465 },
  'Utawala': { x: 870, y: 520 },
  'Junction/Benedicta': { x: 815, y: 485 },
  'Githunguri Area': { x: 890, y: 420 },
  'Roysambu': { x: 610, y: 250 },
  'Kahawa Wendani': { x: 720, y: 180 },
  'Kilimani': { x: 370, y: 480 },
  'Zimmerman': { x: 645, y: 220 },
  'Ruaka': { x: 320, y: 200 },
  'Kasarani': { x: 675, y: 270 },
  'South B': { x: 530, y: 520 },
};

// Major Transport Hubs across Nairobi & Eastern Bypass
export const NAIROBI_TRANSPORT_HUBS: TransportHub[] = [
  {
    id: 'hub-utawala-stage',
    name: 'Utawala Stage (Eastern Bypass)',
    type: 'matatu-stage',
    estate: 'Utawala',
    x: 845,
    y: 495,
    routes: ['Route 68 (CBD via Express)', 'Route 33 (Embakasi - Bypass)', 'Boda Boda Central'],
    peakFareKes: 80,
    offPeakFareKes: 50,
    safetyRating: 'High',
    description: 'High-frequency matatu terminus connecting direct to CBD and Mombasa Road junction.',
  },
  {
    id: 'hub-benedicta-stage',
    name: 'Benedicta Junction Stage',
    type: 'matatu-stage',
    estate: 'Junction/Benedicta',
    x: 810,
    y: 485,
    routes: ['Route 68 Benedicta Shuttle', 'Inner Utawala Feeder Boda'],
    peakFareKes: 70,
    offPeakFareKes: 40,
    safetyRating: 'High',
    description: 'Bustling junction connecting Eastern Bypass to Benedicta, Airways and Githunguri.',
  },
  {
    id: 'hub-complex-utawala',
    name: 'Complex Shoppers Stage',
    type: 'matatu-stage',
    estate: 'Complex Utawala',
    x: 860,
    y: 450,
    routes: ['Route 68 (Shoppers Express)', 'Mihango Link Matatus'],
    peakFareKes: 80,
    offPeakFareKes: 50,
    safetyRating: 'High',
    description: 'Active 24/7 boarding stage adjacent to Astrol Complex and commercial banks.',
  },
  {
    id: 'hub-githunguri-stage',
    name: 'Githunguri Turnoff Stage',
    type: 'matatu-stage',
    estate: 'Githunguri Area',
    x: 895,
    y: 410,
    routes: ['Githunguri - Bypass Link', 'Kamakis Express Connect'],
    peakFareKes: 70,
    offPeakFareKes: 40,
    safetyRating: 'Moderate',
    description: 'Fast link northwards towards Ruiru Kamakis and southern Utawala loop.',
  },
  {
    id: 'hub-roysambu-roundabout',
    name: 'Roysambu Roundabout (TRM)',
    type: 'major-terminus',
    estate: 'Roysambu',
    x: 605,
    y: 250,
    routes: ['Route 44 (TRM - CBD)', 'Super Metro Thika Rd', 'Route 17B'],
    peakFareKes: 80,
    offPeakFareKes: 40,
    safetyRating: 'High',
    description: 'Major transit nexus along Thika Superhighway with non-stop Super Metro buses.',
  },
  {
    id: 'hub-kasarani-hunters',
    name: 'Kasarani Hunters Stage',
    type: 'matatu-stage',
    estate: 'Kasarani',
    x: 670,
    y: 275,
    routes: ['Route 17B (Hunters - CBD)', 'Mwiki Forward Travellers'],
    peakFareKes: 70,
    offPeakFareKes: 40,
    safetyRating: 'Moderate',
    description: 'Busy residential stage behind Kasarani Police and Equity Bank.',
  },
  {
    id: 'hub-zimmerman-base',
    name: 'Zimmerman Base Stage',
    type: 'matatu-stage',
    estate: 'Zimmerman',
    x: 640,
    y: 225,
    routes: ['Route 44 Zimmerman', 'Mirema Drive Feeder'],
    peakFareKes: 70,
    offPeakFareKes: 40,
    safetyRating: 'Moderate',
    description: 'Pedestrian-friendly crossing with rapid matatus to Allsopps and Ngara.',
  },
  {
    id: 'hub-kahawa-wendani',
    name: 'Kahawa Wendani Footbridge',
    type: 'matatu-stage',
    estate: 'Kahawa Wendani',
    x: 715,
    y: 185,
    routes: ['Route 45 (Wendani - CBD)', 'Kenyatta Univ Shuttles'],
    peakFareKes: 80,
    offPeakFareKes: 50,
    safetyRating: 'High',
    description: 'Lit pedestrian overpass and stage next to CleanShelf and Magunas.',
  },
  {
    id: 'hub-ruaka-quickmart',
    name: 'Ruaka Joyland / Quickmart Stage',
    type: 'major-terminus',
    estate: 'Ruaka',
    x: 315,
    y: 205,
    routes: ['Route 106 (Ruaka - Westlands - CBD)', 'Northern Bypass Shuttle'],
    peakFareKes: 80,
    offPeakFareKes: 50,
    safetyRating: 'High',
    description: 'Direct Limuru Road express connection to Westlands and Northern Bypass.',
  },
  {
    id: 'hub-kilimani-yaya',
    name: 'Yaya Centre Transit Stage',
    type: 'matatu-stage',
    estate: 'Kilimani',
    x: 365,
    y: 475,
    routes: ['Route 46 (Yaya - CBD)', 'Route 5 (Lavington - Hurlingham)'],
    peakFareKes: 70,
    offPeakFareKes: 40,
    safetyRating: 'High',
    description: 'Central Kilimani hub connecting Argwings Kodhek and Ring Road Kilimani.',
  },
  {
    id: 'hub-southb-mariakani',
    name: 'Mariakani Stage (South B)',
    type: 'matatu-stage',
    estate: 'South B',
    x: 525,
    y: 520,
    routes: ['Route 11 (South B - CBD Railways)', 'Expressway Bellevue Feeder'],
    peakFareKes: 60,
    offPeakFareKes: 30,
    safetyRating: 'High',
    description: 'Quick 10-minute commute to Nairobi CBD Railways terminal.',
  },
  {
    id: 'hub-cbd-railways',
    name: 'Nairobi Central Railway Terminus & Kencom',
    type: 'major-terminus',
    estate: 'CBD',
    x: 460,
    y: 440,
    routes: ['All Inter-Suburban Routes', 'Commuter Rail Lines', 'Nairobi Expressway Entry'],
    peakFareKes: 100,
    offPeakFareKes: 50,
    safetyRating: 'High',
    description: 'Metropolitan core connecting all commuter routes and railway lines.',
  },
  {
    id: 'hub-cabanas-expressway',
    name: 'Cabanas / GM Interchange',
    type: 'express-junction',
    estate: 'Mombasa Road',
    x: 690,
    y: 620,
    routes: ['Eastern Bypass Interconnect', 'Nairobi Expressway Toll Plaza'],
    peakFareKes: 80,
    offPeakFareKes: 50,
    safetyRating: 'High',
    description: 'Key southern junction connecting Eastern Bypass directly into Mombasa Road.',
  },
];

// Major Amenities (Malls, Supermarkets, Hospitals, Parks)
export const NAIROBI_AMENITIES: Amenity[] = [
  // Shopping / Markets
  {
    id: 'amenity-astrol-complex',
    name: 'Astrol Commercial Complex & Naivas',
    category: 'shopping',
    estate: 'Complex Utawala',
    x: 855,
    y: 460,
    tag: 'Hypermarket & Banking',
    iconType: 'mall',
    description: 'Anchor retail centre with 24hr supermarket, ATMs, pharmacy, and bakeries.',
  },
  {
    id: 'amenity-benedicta-shoppers',
    name: 'Shoppers Centre Utawala',
    category: 'shopping',
    estate: 'Junction/Benedicta',
    x: 825,
    y: 480,
    tag: 'Fresh Market & Retail',
    iconType: 'supermarket',
    description: 'Daily fresh produce market, butcheries, hardware stores and courier services.',
  },
  {
    id: 'amenity-trm-mall',
    name: 'TRM - Thika Road Mall',
    category: 'shopping',
    estate: 'Roysambu',
    x: 610,
    y: 235,
    tag: 'Mega Mall & Cinema',
    iconType: 'mall',
    description: 'Massive shopping centre with Carrefour, banking halls, and food courts.',
  },
  {
    id: 'amenity-two-rivers',
    name: 'Two Rivers Mall & Rosslyn',
    category: 'shopping',
    estate: 'Ruaka',
    x: 335,
    y: 185,
    tag: 'Premier Retail Hub',
    iconType: 'mall',
    description: 'East Africa’s largest shopping mall with international retail, parks, and dining.',
  },
  {
    id: 'amenity-quickmart-ruaka',
    name: 'Quickmart Supermarket Ruaka',
    category: 'shopping',
    estate: 'Ruaka',
    x: 315,
    y: 200,
    tag: '24/7 Supermarket',
    iconType: 'supermarket',
    description: 'Fresh bakery, hot deli, household supplies and chemist.',
  },
  {
    id: 'amenity-yaya-centre',
    name: 'Yaya Centre Mall',
    category: 'shopping',
    estate: 'Kilimani',
    x: 360,
    y: 470,
    tag: 'Luxury Retail & Cafes',
    iconType: 'mall',
    description: 'Upmarket shopping centre with Chandarana, coffee houses, and specialty stores.',
  },
  {
    id: 'amenity-capital-centre',
    name: 'Capital Centre Mombasa Road',
    category: 'shopping',
    estate: 'South B',
    x: 520,
    y: 510,
    tag: 'Mall & Groceries',
    iconType: 'mall',
    description: 'Features Quickmart, health club, dry cleaners and financial service centres.',
  },
  {
    id: 'amenity-garden-city',
    name: 'Garden City Mall',
    category: 'shopping',
    estate: 'Ruaraka / Thika Rd',
    x: 560,
    y: 300,
    tag: 'Open-Air Mall & Park',
    iconType: 'mall',
    description: 'Carrefour, iMax cinema, green open park, and waterfront cafes.',
  },

  // Healthcare / Hospitals
  {
    id: 'amenity-meridian-utawala',
    name: 'Meridian Health Centre Utawala',
    category: 'hospital',
    estate: 'Utawala',
    x: 835,
    y: 470,
    tag: 'Level 4 Medical Outpatient',
    iconType: 'clinic',
    description: '24/7 emergency clinic, maternity, dental, optical and pharmacy.',
  },
  {
    id: 'amenity-equity-afia-utawala',
    name: 'Equity Afia Clinic Utawala',
    category: 'hospital',
    estate: 'Complex Utawala',
    x: 865,
    y: 475,
    tag: 'Outpatient & Diagnostic',
    iconType: 'clinic',
    description: 'Quality NHIF/SHIF accredited diagnostic outpatient clinic.',
  },
  {
    id: 'amenity-nairobi-hospital-outpatient',
    name: 'The Nairobi Hospital Outpatient (Galleria/South B)',
    category: 'hospital',
    estate: 'South B / Capital',
    x: 515,
    y: 525,
    tag: 'Tertiary Care Outpatient',
    iconType: 'hospital',
    description: 'High standard diagnostic care, pathology and emergency triage.',
  },
  {
    id: 'amenity-aar-roysambu',
    name: 'AAR Healthcare Roysambu',
    category: 'hospital',
    estate: 'Roysambu',
    x: 620,
    y: 245,
    tag: '24hr Medical Centre',
    iconType: 'clinic',
    description: 'Comprehensive lab, pharmacy and doctor consultations.',
  },
  {
    id: 'amenity-aga-khan-ruaka',
    name: 'Aga Khan Medical Centre Ruaka',
    category: 'hospital',
    estate: 'Ruaka',
    x: 310,
    y: 215,
    tag: 'Specialist Medical Clinic',
    iconType: 'clinic',
    description: 'Paediatric, internal medicine, and emergency ambulance access.',
  },
  {
    id: 'amenity-nairobi-hospital-main',
    name: 'The Nairobi Hospital Main',
    category: 'hospital',
    estate: 'Upperhill / Kilimani',
    x: 405,
    y: 465,
    tag: 'Premier Hospital',
    iconType: 'hospital',
    description: 'East Africa’s premier private hospital with comprehensive ICU and specialized wings.',
  },

  // Nature, Landmarks & Recreation
  {
    id: 'amenity-karura-forest',
    name: 'Karura Forest Gate',
    category: 'nature',
    estate: 'Gigiri / Muthaiga',
    x: 390,
    y: 270,
    tag: 'Indigenous Urban Forest',
    iconType: 'park',
    description: 'Over 1,000 hectares of walking trails, waterfalls, and outdoor recreation.',
  },
  {
    id: 'amenity-nairobi-park',
    name: 'Nairobi National Park Safari Walk',
    category: 'nature',
    estate: 'Lang’ata / South C',
    x: 490,
    y: 650,
    tag: 'Wildlife Sanctuary',
    iconType: 'park',
    description: 'The world’s only wildlife capital national park directly bordering the city.',
  },
  {
    id: 'amenity-uhuru-park',
    name: 'Uhuru Park & Central Park',
    category: 'nature',
    estate: 'CBD / Upper Hill',
    x: 435,
    y: 445,
    tag: 'Recreational Green Space',
    iconType: 'park',
    description: 'Restored city-centre botanical promenade, boating lake, and event lawn.',
  },
  {
    id: 'amenity-jkia-airport',
    name: 'JKIA International Airport',
    category: 'civic',
    estate: 'Embakasi',
    x: 770,
    y: 660,
    tag: 'International Aviation Hub',
    iconType: 'landmark',
    description: 'Kenya’s primary international gateway, 15 minutes from Utawala Eastern Bypass.',
  },
];

// Arterial transit spines & highways on the map
export const NAIROBI_ROAD_SPINES: RoadSpine[] = [
  // Thika Superhighway (CBD to North-East)
  {
    id: 'road-thika-superhighway',
    name: 'Thika Superhighway (A2)',
    path: 'M 460 440 L 505 380 L 555 310 L 605 245 L 650 215 L 720 175 L 780 135',
    color: '#3b82f6',
    width: 5,
    labelPos: { x: 580, y: 265, angle: -38 },
  },
  // Eastern Bypass (Ruiru/Kamakis -> Githunguri -> Complex Utawala -> Benedicta -> Cabanas)
  {
    id: 'road-eastern-bypass',
    name: 'Eastern Bypass Corridor',
    path: 'M 790 140 L 840 250 L 890 380 L 875 440 L 850 475 L 815 500 L 760 560 L 690 620',
    color: '#059669',
    width: 5,
    labelPos: { x: 845, y: 395, angle: 78 },
  },
  // Mombasa Road & Nairobi Expressway (CBD -> South B -> Cabanas -> JKIA)
  {
    id: 'road-mombasa-road',
    name: 'Mombasa Rd & Expressway',
    path: 'M 460 440 L 490 480 L 530 520 L 590 565 L 690 620 L 770 660',
    color: '#d97706',
    width: 4.5,
    labelPos: { x: 575, y: 535, angle: 32 },
  },
  // Waiyaki Way (CBD -> Westlands -> ABC)
  {
    id: 'road-waiyaki-way',
    name: 'Waiyaki Way (A104)',
    path: 'M 460 440 L 410 395 L 365 360 L 290 330',
    color: '#6366f1',
    width: 4,
    labelPos: { x: 385, y: 365, angle: -32 },
  },
  // Limuru Road (Westlands/Parklands -> Two Rivers -> Ruaka)
  {
    id: 'road-limuru-road',
    name: 'Limuru Road (to Ruaka)',
    path: 'M 410 395 L 380 320 L 350 250 L 320 200 L 300 170',
    color: '#0284c7',
    width: 3.5,
    labelPos: { x: 335, y: 260, angle: -65 },
  },
  // Outering Road (Thika Rd Allsopps -> Donholm -> Taj Mall/Cabanas)
  {
    id: 'road-outering-road',
    name: 'Outering Road',
    path: 'M 555 310 L 610 380 L 660 460 L 710 540 L 760 560',
    color: '#78716c',
    width: 3,
    dashed: true,
    labelPos: { x: 645, y: 440, angle: 55 },
  },
  // Argwings Kodhek / Ngong Road (CBD -> Kilimani)
  {
    id: 'road-ngong-kilimani',
    name: 'Argwings Kodhek / Ngong Rd',
    path: 'M 460 440 L 410 465 L 360 480 L 300 510',
    color: '#8b5cf6',
    width: 3.5,
    labelPos: { x: 380, y: 465, angle: 18 },
  },
  // Jogoo Road (CBD -> Eastlands)
  {
    id: 'road-jogoo-road',
    name: 'Jogoo Road',
    path: 'M 460 440 L 520 455 L 590 465 L 660 460',
    color: '#78716c',
    width: 2.5,
    dashed: true,
  },
];

// Presets for quick zone focus
export const MAP_ZONES: MapZone[] = [
  {
    id: 'all',
    label: 'All Nairobi',
    tag: 'Greater Metro',
    center: { x: 550, y: 420 },
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    description: 'Full metropolitan area spanning Eastern Bypass, Thika Road, Ruaka, and Central.',
  },
  {
    id: 'utawala',
    label: 'Utawala & Eastern Bypass',
    tag: 'High Inventory',
    center: { x: 845, y: 470 },
    zoom: 2.1,
    panOffset: { x: -620, y: -300 },
    description: 'Complex Utawala, Benedicta Junction, Shoppers stage & Githunguri corridor.',
  },
  {
    id: 'thika-road',
    label: 'Thika Road Corridor',
    tag: 'Roysambu & Kasarani',
    center: { x: 640, y: 240 },
    zoom: 2.0,
    panOffset: { x: -350, y: 50 },
    description: 'Roysambu (TRM), Zimmerman, Kasarani Hunters, and Kahawa Wendani.',
  },
  {
    id: 'ruaka',
    label: 'Ruaka & Northern Bypass',
    tag: 'Limuru Road',
    center: { x: 325, y: 200 },
    zoom: 2.2,
    panOffset: { x: 100, y: 120 },
    description: 'Ruaka commercial centre, Two Rivers Mall, and Quickmart Stage.',
  },
  {
    id: 'central-south',
    label: 'South B, Kilimani & CBD',
    tag: 'Central Commute',
    center: { x: 440, y: 480 },
    zoom: 2.0,
    panOffset: { x: -50, y: -260 },
    description: 'South B Plainsview, Kilimani (Yaya), and Central Railways Terminus.',
  },
];

/**
 * Deterministic coordinate resolver:
 * Places each listing into its genuine estate cluster with natural sub-street scatter.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getListingCoordinates(listing: {
  id: string;
  estate: string;
  buildingName: string;
  specificLocation?: string;
}): Coordinates {
  const base = ESTATE_COORDINATES[listing.estate] || { x: 500, y: 400 };
  const combinedKey = `${listing.id}-${listing.buildingName}-${listing.specificLocation || ''}`;
  const h1 = hashString(combinedKey);
  const h2 = hashString(`${listing.buildingName}-${listing.id}`);

  // In Utawala clusters, spread realistically along the Eastern Bypass corridor
  let spreadX = 40;
  let spreadY = 40;

  if (listing.estate.includes('Utawala') || listing.estate.includes('Benedicta') || listing.estate.includes('Githunguri')) {
    spreadX = 45;
    spreadY = 45;
  } else if (listing.estate === 'Roysambu' || listing.estate === 'Zimmerman') {
    spreadX = 35;
    spreadY = 30;
  }

  const offsetX = ((h1 % 100) / 100 - 0.5) * spreadX * 2;
  const offsetY = ((h2 % 100) / 100 - 0.5) * spreadY * 2;

  return {
    x: Math.round(base.x + offsetX),
    y: Math.round(base.y + offsetY),
  };
}

/**
 * Calculate Euclidean distance in canvas units
 */
export function calculateDistance(p1: Coordinates, p2: Coordinates): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Converts canvas distance units to approximate meters & walking minutes
 * In our scale: 10 canvas units ≈ 150 meters ≈ 2 minutes walk
 */
export function canvasDistToRealWorld(canvasUnits: number): { meters: number; walkMin: number } {
  const meters = Math.round(canvasUnits * 15);
  // Average human walking speed is ~75 meters per minute
  const walkMin = Math.max(1, Math.round(meters / 75));
  return { meters, walkMin };
}

/**
 * Find the nearest transport hub to a given coordinate
 */
export function getNearestTransportHub(
  listingCoord: Coordinates,
  preferredEstate?: string
): { hub: TransportHub; distancePx: number; approxMeters: number; walkMin: number } {
  let closestHub = NAIROBI_TRANSPORT_HUBS[0];
  let minDistance = Infinity;

  for (const hub of NAIROBI_TRANSPORT_HUBS) {
    let dist = calculateDistance(listingCoord, { x: hub.x, y: hub.y });
    // Slight affinity for hub in the same estate
    if (preferredEstate && hub.estate.toLowerCase().includes(preferredEstate.toLowerCase())) {
      dist *= 0.85;
    }
    if (dist < minDistance) {
      minDistance = dist;
      closestHub = hub;
    }
  }

  const { meters, walkMin } = canvasDistToRealWorld(minDistance);
  return {
    hub: closestHub,
    distancePx: minDistance,
    approxMeters: meters,
    walkMin,
  };
}

/**
 * Get closest amenities sorted by distance
 */
export function getNearbyAmenities(
  listingCoord: Coordinates,
  categoryFilter?: 'shopping' | 'hospital' | 'all',
  limit: number = 3
): Array<{ amenity: Amenity; distancePx: number; approxMeters: number; walkMin: number }> {
  const filtered = categoryFilter && categoryFilter !== 'all'
    ? NAIROBI_AMENITIES.filter((a) => a.category === categoryFilter)
    : NAIROBI_AMENITIES;

  const withDist = filtered.map((amenity) => {
    const dist = calculateDistance(listingCoord, { x: amenity.x, y: amenity.y });
    const { meters, walkMin } = canvasDistToRealWorld(dist);
    return {
      amenity,
      distancePx: dist,
      approxMeters: meters,
      walkMin,
    };
  });

  withDist.sort((a, b) => a.distancePx - b.distancePx);
  return withDist.slice(0, limit);
}
