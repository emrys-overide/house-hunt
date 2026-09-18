import React from 'react';
import { Building, Droplets, Zap, Shield, ArrowUpRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { Listing } from '../types';

interface ExecutiveDashboardProps {
  listings: Listing[];
  selectedEstate: string;
  onSelectEstate: (estate: string) => void;
  selectedUnitType: string;
  onSelectUnitType: (unitType: string) => void;
  totalMatching: number;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  listings,
  selectedEstate,
  onSelectEstate,
  selectedUnitType,
  onSelectUnitType,
  totalMatching,
}) => {
  // Aggregate market analytics
  const totalCount = listings.length;
  const vacantCount = listings.filter((l) => l.vacancyStatus.isVacant).length;
  
  // Median rent calculation
  const rents = listings.map((l) => l.monthlyRent).sort((a, b) => a - b);
  const medianRent = rents.length > 0 ? rents[Math.floor(rents.length / 2)] : 25000;

  // Borehole / water assurance ratio
  const reliableWaterCount = listings.filter(
    (l) =>
      l.waterInfrastructure.source.toLowerCase().includes('borehole') ||
      l.finishesAndAmenities?.boreholeWater
  ).length;
  const waterReliabilityPercent = Math.round((reliableWaterCount / (totalCount || 1)) * 100);

  // Group listings by major estate for the locality pills
  const estateCounts: Record<string, number> = {};
  listings.forEach((l) => {
    estateCounts[l.estate] = (estateCounts[l.estate] || 0) + 1;
  });

  const sortedEstates = Object.entries(estateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  return (
    <section className="border-b border-[#eceae5] bg-[#fafaf8] pt-6 pb-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Editorial Top Headline & Overview */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-stone-500">
                Nairobi Residential Intelligence
              </span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-[11px] font-medium text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Ground Reconnaissance
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
              Direct Caretaker Residences &amp; Vacancy Ledger
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Verified residential vacancies with guaranteed zero viewing fees, audited borehole infrastructure, 
              and line-item True Cost of Occupancy (TCO).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
                Cataloged Residences
              </span>
              <span className="font-editorial text-2xl font-medium text-stone-900">
                {totalMatching} of {totalCount} Active
              </span>
            </div>
          </div>
        </div>

        {/* Executive Metric Cards (Minimalist, Architectural) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Tile 1: Verified Vacancies */}
          <div className="bg-white rounded-xl border border-[#e8e7e1] p-4 transition-all hover:border-stone-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase">Active Vacancies</span>
              <Building className="w-4 h-4 text-stone-400 stroke-[1.5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900">
                {vacantCount}
              </span>
              <span className="text-[11px] text-stone-500">units available</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              100% Caretaker Direct
            </p>
          </div>

          {/* Tile 2: Median Benchmark Rent */}
          <div className="bg-white rounded-xl border border-[#e8e7e1] p-4 transition-all hover:border-stone-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase">Median Rent Index</span>
              <span className="text-[10px] font-mono text-stone-400">KES / mo</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900">
                {medianRent.toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-500">Eastern Bypass</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Range: KES 12.5k – 110k
            </p>
          </div>

          {/* Tile 3: Water Security Ratio */}
          <div className="bg-white rounded-xl border border-[#e8e7e1] p-4 transition-all hover:border-stone-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase">Water Security</span>
              <Droplets className="w-4 h-4 text-stone-400 stroke-[1.5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900">
                {waterReliabilityPercent}%
              </span>
              <span className="text-[11px] text-stone-500">Borehole piped</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              24/7 storage backed
            </p>
          </div>

          {/* Tile 4: Zero Broker Policy */}
          <div className="bg-white rounded-xl border border-[#e8e7e1] p-4 transition-all hover:border-stone-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase">Viewing Fee Standard</span>
              <Shield className="w-4 h-4 text-stone-400 stroke-[1.5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900">
                KES 0
              </span>
              <span className="text-[11px] text-stone-500">Strict policy</span>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium mt-1">
              Zero broker viewing extortion
            </p>
          </div>
        </div>

        {/* Interactive Locality Pill Strip (Minimalist & Functional) */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-stone-400 font-medium mr-1 text-[11px] uppercase tracking-wider shrink-0">
              Locality:
            </span>
            <button
              onClick={() => onSelectEstate('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedEstate === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-[#e8e7e1] text-stone-700 hover:border-stone-400'
              }`}
            >
              All Zones ({totalCount})
            </button>
            {sortedEstates.map(([estate, count]) => (
              <button
                key={estate}
                onClick={() => onSelectEstate(estate)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedEstate.toLowerCase() === estate.toLowerCase()
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-[#e8e7e1] text-stone-700 hover:border-stone-400'
                }`}
              >
                {estate} ({count})
              </button>
            ))}
          </div>

          {/* Quick Unit Categories */}
          <div className="hidden lg:flex items-center gap-1 shrink-0 text-xs">
            <button
              onClick={() => onSelectUnitType('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                selectedUnitType === 'all'
                  ? 'text-stone-900 font-semibold bg-stone-200/70'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Typologies
            </button>
            <span className="text-stone-300">/</span>
            <button
              onClick={() => onSelectUnitType('1-bedroom')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                selectedUnitType === '1-bedroom'
                  ? 'text-stone-900 font-semibold bg-stone-200/70'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              1-Bed
            </button>
            <span className="text-stone-300">/</span>
            <button
              onClick={() => onSelectUnitType('2-bedroom')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                selectedUnitType === '2-bedroom'
                  ? 'text-stone-900 font-semibold bg-stone-200/70'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              2-Bed
            </button>
            <span className="text-stone-300">/</span>
            <button
              onClick={() => onSelectUnitType('3-bedroom')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                selectedUnitType === '3-bedroom'
                  ? 'text-stone-900 font-semibold bg-stone-200/70'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              3-Bed+
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
