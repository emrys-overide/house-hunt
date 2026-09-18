export interface TcoBreakdown {
  rent: number;
  securityDeposit: number;
  waterDeposit: number;
  electricityDeposit: number;
  garbageFeeMonthly: number;
  serviceChargeMonthly: number;
  totalMoveInCost: number;
}

export interface WaterInfrastructure {
  source: '24/7 Borehole' | 'Kanjo + Borehole Backup' | 'Kanjo Scheduled' | 'Water Tanker Only';
  scheduleNotes: string;
  metering: 'Included in rent' | 'Individual metered' | 'Flat monthly fee';
  monthlyEstimateKes: number;
}

export interface ElectricityInfrastructure {
  type: 'Individual KPLC Token' | 'Shared Sub-meter' | 'Fixed Monthly';
  tokenStatus: string;
}

export interface CommuteAndStage {
  nearestStage: string;
  walkMinutes: number;
  roadCondition: 'Tarmac direct' | 'Cabro paved' | 'All-weather murram' | 'Rough road (muddy when rainy)';
  peakFareKes: number;
  offPeakFareKes: number;
  safetyRating: 'High (well lit, active 24/7)' | 'Moderate (busy till 10pm)' | 'Caution after dark';
}

export interface AssignedAgentOrCaretaker {
  name: string;
  role: 'Caretaker' | 'Direct Landlord' | 'Assigned Property Manager' | 'Listing Agent';
  phone: string;
  whatsapp: string;
  viewingPolicy: 'Free viewing with Caretaker' | 'No viewing fee' | 'Registered Agent Viewing';
  viewingFeeKes: number;
  trustScore: number;
  verificationMethod: 'GPS Ground Match + Caretaker Live Ping' | 'ID & Title Deed Verified' | 'Physical Inspection';
}

export interface VacancyStatus {
  isVacant: boolean;
  unitsAvailableCount: number;
  floorNumber?: string;
  lastVerifiedAt: string;
  lastPingResponse: string;
  verifiedCadenceDays: number;
}

export interface FinishesAndAmenities {
  tiled: boolean;
  ceilingBoard: boolean;
  balcony: boolean;
  hotShowerInstalled: boolean;
  wifiProviders: string[];
  cctvOrSecurity: boolean;
  rooftopAccess: boolean;
  boreholeWater: boolean;
  parkingAvailable: boolean;
}

export interface Listing {
  id: string;
  title: string;
  buildingName: string;
  estate: string;
  specificLocation: string;
  unitType: 'bedsitter' | '1-bedroom' | '2-bedroom' | '3-bedroom' | '4-bedroom' | '5-bedroom' | 'single-room' | string;
  propertyType?: string;
  bedrooms?: number;
  furnishing?: string;
  monthlyRent: number;
  tco: TcoBreakdown;
  waterInfrastructure: WaterInfrastructure;
  electricity: ElectricityInfrastructure;
  commuteAndStage: CommuteAndStage;
  assignedAgentOrCaretaker: AssignedAgentOrCaretaker;
  vacancyStatus: VacancyStatus;
  finishesAndAmenities: FinishesAndAmenities;
  tenantPreferences: string;
  photos: string[];
  scrapedSource?: {
    sourceName: string;
    rawExcerpt?: string;
    sourceUrl?: string;
    evidenceLevel?: string;
    dataQualityFlags?: string[];
  };
}

export interface AssignedHouseSummary {
  building: string;
  location: string;
  vacancies: string;
  rentRangeKes: string;
  waterIntel: string;
  powerIntel: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ScrapedAgentInsight {
  id: string;
  agentName: string;
  agencyOrEstate: string;
  estateFocus: string;
  phoneNumber: string;
  activeListingsCount: number;
  lastActivity: string;
  viewingFeeReported: string;
  reputation: 'Verified Direct Caretaker' | 'Vetted Agent' | 'Warning: Broker Fee Claimed';
  housesAssigned: AssignedHouseSummary[];
  scrapedAt: string;
  notes: string;
  groundingSources?: GroundingSource[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedListingIds?: string[];
  tcoComparison?: {
    title: string;
    rentKes: number;
    moveInCostKes: number;
    waterSchedule: string;
    tokenType: string;
  }[];
  groundingSources?: GroundingSource[];
  webSearchQueries?: string[];
  modelUsed?: string;
}

export interface FilterCriteria {
  estate: string;
  unitType: string;
  maxRent: number;
  waterSource: string;
  tokenType: string;
  maxWalkMinutes: number;
  freeViewingOnly: boolean;
  savedOnly?: boolean;
}
