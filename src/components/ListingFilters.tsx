import React from 'react';
import { Search, Heart, X, SlidersHorizontal, Check, MapPin } from 'lucide-react';
import { FilterCriteria } from '../types';

interface ListingFiltersProps {
  filters: FilterCriteria;
  setFilters: React.Dispatch<React.SetStateAction<FilterCriteria>>;
  availableEstates: string[];
  totalResultsCount: number;
  savedCount?: number;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onViewOnMap?: () => void;
}

export const ListingFilters: React.FC<ListingFiltersProps> = ({
  filters,
  setFilters,
  availableEstates,
  totalResultsCount,
  savedCount = 0,
  searchQuery = '',
  setSearchQuery,
  onViewOnMap,
}) => {
  const isFiltered =
    filters.estate !== 'all' ||
    filters.unitType !== 'all' ||
    filters.maxRent < 200000 ||
    filters.waterSource !== 'all' ||
    filters.tokenType !== 'all' ||
    filters.freeViewingOnly ||
    filters.savedOnly ||
    searchQuery.trim().length > 0;

  const handleReset = () => {
    setFilters({
      estate: 'all',
      unitType: 'all',
      maxRent: 200000,
      waterSource: 'all',
      tokenType: 'all',
      maxWalkMinutes: 30,
      freeViewingOnly: false,
      savedOnly: false,
    });
    if (setSearchQuery) {
      setSearchQuery('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e8e7e1] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by building, estate, road, or caretaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-[#e8e7e1] rounded-lg text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery && setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Refinement Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Saved Shortlist Filter */}
          <button
            type="button"
            onClick={() =>
              setFilters((prev) => ({ ...prev, savedOnly: !prev.savedOnly }))
            }
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              filters.savedOnly
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-[#e8e7e1] hover:border-stone-400'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                filters.savedOnly ? 'fill-white text-white' : 'text-stone-400'
              }`}
            />
            <span>Shortlisted</span>
            {savedCount > 0 && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-medium ${
                  filters.savedOnly
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {savedCount}
              </span>
            )}
          </button>

          {/* View on Map Trigger */}
          {onViewOnMap && (
            <button
              type="button"
              id="filter-view-on-map-btn"
              onClick={onViewOnMap}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-[#e8e7e1] bg-stone-50 hover:bg-stone-100 text-stone-800 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-600" />
              <span>View on Map</span>
            </button>
          )}

          {/* Reset Filters Link */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="px-2.5 py-2 text-xs font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Refinement Dropdowns Row (Clean, Understated) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
        {/* Estate Dropdown */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Zone / Estate
          </label>
          <select
            id="filter-estate-select"
            value={filters.estate}
            onChange={(e) => setFilters((prev) => ({ ...prev, estate: e.target.value }))}
            className="w-full bg-stone-50 border border-[#e8e7e1] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium focus:outline-hidden focus:border-stone-500 focus:bg-white transition-colors"
          >
            <option value="all">All Nairobi Zones</option>
            {availableEstates.map((est) => (
              <option key={est} value={est}>
                {est}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Typology */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Typology
          </label>
          <select
            id="filter-unit-type-select"
            value={filters.unitType}
            onChange={(e) => setFilters((prev) => ({ ...prev, unitType: e.target.value }))}
            className="w-full bg-stone-50 border border-[#e8e7e1] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium focus:outline-hidden focus:border-stone-500 focus:bg-white transition-colors"
          >
            <option value="all">All Typologies</option>
            <option value="bedsitter">Bedsitter Studio</option>
            <option value="1-bedroom">1-Bedroom</option>
            <option value="2-bedroom">2-Bedroom</option>
            <option value="3-bedroom">3-Bedroom</option>
            <option value="4-bedroom">4-Bedroom</option>
            <option value="5-bedroom">5-Bedroom</option>
            <option value="single-room">Single Room</option>
          </select>
        </div>

        {/* Maximum Budget */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Budget Ceiling
          </label>
          <select
            id="filter-max-rent-select"
            value={filters.maxRent}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxRent: Number(e.target.value) }))
            }
            className="w-full bg-stone-50 border border-[#e8e7e1] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium focus:outline-hidden focus:border-stone-500 focus:bg-white transition-colors"
          >
            <option value={200000}>Any Budget (All)</option>
            <option value={15000}>Under KES 15,000</option>
            <option value={25000}>Under KES 25,000</option>
            <option value={35000}>Under KES 35,000</option>
            <option value={50000}>Under KES 50,000</option>
            <option value={75000}>Under KES 75,000</option>
            <option value={120000}>Under KES 120,000</option>
          </select>
        </div>

        {/* Water Assurance */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Water Infrastructure
          </label>
          <select
            id="filter-water-select"
            value={filters.waterSource}
            onChange={(e) => setFilters((prev) => ({ ...prev, waterSource: e.target.value }))}
            className="w-full bg-stone-50 border border-[#e8e7e1] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium focus:outline-hidden focus:border-stone-500 focus:bg-white transition-colors"
          >
            <option value="all">Any Water Supply</option>
            <option value="24/7 Borehole">24/7 Borehole Piped</option>
            <option value="Kanjo + Borehole Backup">Kanjo + Borehole</option>
          </select>
        </div>
      </div>

      {/* Matching Result Summary */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-[#f0eee9]">
        <span>
          Showing <strong className="text-stone-900 font-medium">{totalResultsCount}</strong> verified residences
        </span>
        <span className="text-[11px] text-stone-400">
          Direct Caretaker Access • No Viewing Fees
        </span>
      </div>
    </div>
  );
};
