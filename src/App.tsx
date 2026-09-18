import React, { useState, useEffect } from 'react';
import { Header, AppTab } from './components/Header';
import { ListingCard } from './components/ListingCard';
import { ListingFilters } from './components/ListingFilters';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { TcoModal } from './components/TcoModal';
import { AgentScraperView } from './components/AgentScraperView';
import { TenantConciergeView } from './components/TenantConciergeView';
import { CaretakerIntakeView } from './components/CaretakerIntakeView';
import { LiveVoiceConversationModal } from './components/LiveVoiceConversationModal';
import { SavedListingsView } from './components/SavedListingsView';
import { InteractiveMapView } from './components/InteractiveMapView';
import { useSavedListings } from './hooks/useSavedListings';
import { Listing, ScrapedAgentInsight, FilterCriteria } from './types';
import { INITIAL_LISTINGS, INITIAL_SCRAPED_AGENTS } from './data/initialData';
import {
  AlertCircle,
  BarChart3,
  Building2,
  ShieldCheck,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('explore');
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [scrapedAgents, setScrapedAgents] = useState<ScrapedAgentInsight[]>(INITIAL_SCRAPED_AGENTS);
  const [selectedTcoListing, setSelectedTcoListing] = useState<Listing | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);

  // Saved Listings Local Storage Hook
  const { isSaved, toggleSave, clearAll, savedCount } = useSavedListings();

  // Filters State
  const [filters, setFilters] = useState<FilterCriteria>({
    estate: 'all',
    unitType: 'all',
    maxRent: 200000,
    waterSource: 'all',
    tokenType: 'all',
    maxWalkMinutes: 30,
    freeViewingOnly: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch from server on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [listingsRes, agentsRes] = await Promise.all([
          fetch('/api/listings'),
          fetch('/api/scraped-agents'),
        ]);

        if (listingsRes.ok) {
          const lData = await listingsRes.json();
          if (lData.listings && lData.listings.length > 0) {
            setListings(lData.listings);
          }
        }

        if (agentsRes.ok) {
          const aData = await agentsRes.json();
          if (aData.agents && aData.agents.length > 0) {
            setScrapedAgents(aData.agents);
          }
        }
      } catch (err) {
        console.warn('Using initial state, server connecting in background:', err);
      }
    }
    loadData();
  }, []);

  // Handler: Caretaker 1-Click Verification Ping ("Bado iko vacant?")
  const handleVerifyPing = async (listingId: string) => {
    try {
      const response = await fetch('/api/listings/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, status: 'vacant' }),
      });

      if (response.ok) {
        const data = await response.json();
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? data.listing : l))
        );
        showToast(`Caretaker pinged: "${data.listing.buildingName}" confirmed vacant.`);
      }
    } catch (err) {
      console.error('Verify ping failed:', err);
      showToast('Network error pinging caretaker.');
    }
  };

  // Handler: Live Scraper for an estate
  const handleScrapeEstate = async (estateQuery: string) => {
    setIsScraping(true);
    try {
      const response = await fetch('/api/scrape-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estateQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.scrapedAgents && data.scrapedAgents.length > 0) {
          setScrapedAgents((prev) => [...data.scrapedAgents, ...prev]);
        }
        if (data.newListings && data.newListings.length > 0) {
          setListings((prev) => [...data.newListings, ...prev]);
        }
        showToast(`Scraped ${data.scrapedAgents?.length || 0} agents & caretakers in ${estateQuery}`);
      }
    } catch (err) {
      console.error('Scraper error:', err);
      showToast('Scraper error. Try again shortly.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleToggleSave = (listingId: string) => {
    const alreadySaved = isSaved(listingId);
    toggleSave(listingId);
    showToast(alreadySaved ? 'Removed from shortlist' : 'Shortlisted to comparison portfolio');
  };

  // Filter listings based on current filter state
  const filteredListings = listings.filter((listing) => {
    if (filters.estate !== 'all' && listing.estate !== filters.estate) {
      return false;
    }
    if (filters.unitType !== 'all' && listing.unitType !== filters.unitType) {
      return false;
    }
    if (listing.monthlyRent > filters.maxRent) {
      return false;
    }
    if (filters.waterSource !== 'all') {
      const src = listing.waterInfrastructure.source.toLowerCase();
      if (filters.waterSource === 'borehole' && !src.includes('borehole')) return false;
      if (filters.waterSource === 'nairobi-water' && !src.includes('kanjo') && !src.includes('nairobi')) return false;
    }
    if (filters.tokenType !== 'all' && listing.electricity.type !== filters.tokenType) {
      return false;
    }
    if (listing.commuteAndStage.walkMinutes > filters.maxWalkMinutes) {
      return false;
    }
    if (filters.freeViewingOnly && listing.assignedAgentOrCaretaker.viewingFeeKes > 0) {
      return false;
    }
    if (filters.savedOnly && !isSaved(listing.id)) {
      return false;
    }
    return true;
  });

  const availableEstates = Array.from(new Set(listings.map((l) => l.estate)));

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900 font-sans-clean flex flex-col selection:bg-stone-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-stone-100 px-4 py-3 rounded-lg shadow-xl border border-stone-800 flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        verifiedCount={listings.filter((l) => l.vacancyStatus.isVacant).length}
        scrapedCount={scrapedAgents.length}
        savedCount={savedCount}
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TAB 1: EXPLORE RESIDENCES */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            {/* Top Editorial Banner */}
            <div className="bg-white rounded-xl border border-[#e8e7e1] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 font-medium">
                    100% Direct Caretaker Audit
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500 font-medium">
                    Utawala, Complex, Junction &amp; Eastern Bypass
                  </span>
                </div>
                <h1 className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
                  Curated Residences with True Cost of Occupancy
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Direct physical key-holders with audited move-in cash statements, verified borehole water schedules, and zero middleman viewing fees.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  id="header-trigger-map"
                  onClick={() => setActiveTab('map')}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-stone-600" />
                  <span>Map View</span>
                </button>
                <button
                  id="header-trigger-dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Market Analytics</span>
                </button>
                <button
                  id="header-trigger-scraper"
                  onClick={() => setActiveTab('scraper')}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Building2 className="w-3.5 h-3.5 text-stone-300" />
                  <span>Caretaker Directory</span>
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            <ListingFilters
              filters={filters}
              setFilters={setFilters}
              availableEstates={availableEstates}
              totalResultsCount={filteredListings.length}
              savedCount={savedCount}
              onViewOnMap={() => setActiveTab('map')}
            />

            {/* Listings Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    isSaved={isSaved(listing.id)}
                    onToggleSave={() => handleToggleSave(listing.id)}
                    onOpenTco={(l) => setSelectedTcoListing(l)}
                    onVerifyPing={handleVerifyPing}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-[#e8e7e1] p-12 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
                <h3 className="font-editorial text-xl text-stone-900 font-medium">
                  {filters.savedOnly
                    ? 'No shortlisted residences in this filter'
                    : 'No verified residences matched your exact criteria'}
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  {filters.savedOnly
                    ? 'Shortlist residences while exploring by selecting the heart bookmark icon.'
                    : 'Try broadening your budget parameters or resetting filters to review all cataloged units.'}
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      estate: 'all',
                      unitType: 'all',
                      maxRent: 200000,
                      waterSource: 'all',
                      tokenType: 'all',
                      maxWalkMinutes: 30,
                      freeViewingOnly: false,
                      savedOnly: false,
                    })
                  }
                  className="px-4 py-2 bg-stone-900 text-stone-100 text-xs font-medium rounded-lg cursor-pointer hover:bg-stone-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: INTERACTIVE NAIROBI SPATIAL MAP VIEW */}
        {activeTab === 'map' && (
          <InteractiveMapView
            listings={filteredListings}
            filters={filters}
            setFilters={setFilters}
            isSaved={isSaved}
            onToggleSave={handleToggleSave}
            onOpenTco={(l) => setSelectedTcoListing(l)}
            onVerifyPing={handleVerifyPing}
            onExploreList={() => setActiveTab('explore')}
          />
        )}

        {/* TAB 2: EXECUTIVE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <ExecutiveDashboard
              listings={listings}
              selectedEstate={filters.estate}
              onSelectEstate={(est) => {
                setFilters((prev) => ({ ...prev, estate: est }));
                setActiveTab('explore');
              }}
              selectedUnitType={filters.unitType}
              onSelectUnitType={(ut) => {
                setFilters((prev) => ({ ...prev, unitType: ut }));
                setActiveTab('explore');
              }}
              totalMatching={filteredListings.length}
            />

            {/* Quick Link into matching residences */}
            <div className="p-4 bg-white rounded-xl border border-[#e8e7e1] flex items-center justify-between">
              <div>
                <h4 className="font-editorial text-lg text-stone-900 font-medium">
                  Ready to browse verified vacancies?
                </h4>
                <p className="text-xs text-stone-500">
                  {filteredListings.length} residences ready for direct physical viewing.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-lg text-xs font-medium cursor-pointer transition-colors"
              >
                View Cataloged Units
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: AGENT & CARETAKER DIRECTORY */}
        {activeTab === 'scraper' && (
          <AgentScraperView
            scrapedAgents={scrapedAgents}
            onScrapeNewEstate={handleScrapeEstate}
            isScraping={isScraping}
            onExploreHouse={(estateName) => {
              setFilters((prev) => ({ ...prev, estate: estateName }));
              setActiveTab('explore');
            }}
            onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
          />
        )}

        {/* TAB 4: TENANT ADVISORY AI */}
        {activeTab === 'concierge' && (
          <TenantConciergeView
            listings={listings}
            isSaved={isSaved}
            onToggleSave={handleToggleSave}
            onSelectListing={(id) => {
              const matched = listings.find((l) => l.id === id);
              if (matched) {
                setSelectedTcoListing(matched);
              }
            }}
            onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
          />
        )}

        {/* TAB 5: DIRECT INTAKE ASSISTANT */}
        {activeTab === 'caretaker' && (
          <CaretakerIntakeView
            onListingCreated={(newListing) => {
              setListings((prev) => [newListing, ...prev]);
              showToast(`Unit at ${newListing.buildingName} onboarded and published!`);
              setActiveTab('explore');
            }}
          />
        )}

        {/* TAB 6: SAVED LISTINGS & SHORTLIST PORTFOLIO */}
        {activeTab === 'saved' && (
          <SavedListingsView
            savedListings={listings.filter((l) => isSaved(l.id))}
            onToggleSave={handleToggleSave}
            onClearAll={() => {
              clearAll();
              showToast('Cleared all saved residences from your shortlist.');
            }}
            onOpenTco={(l) => setSelectedTcoListing(l)}
            onVerifyPing={handleVerifyPing}
            onExploreMore={() => {
              setFilters((prev) => ({ ...prev, savedOnly: false }));
              setActiveTab('explore');
            }}
          />
        )}
      </main>

      {/* TCO Modal Dialog */}
      <TcoModal
        listing={selectedTcoListing}
        isSaved={selectedTcoListing ? isSaved(selectedTcoListing.id) : false}
        onToggleSave={(id) => handleToggleSave(id)}
        onClose={() => setSelectedTcoListing(null)}
      />

      {/* Live Voice Conversation Modal (gemini-3.8-live) */}
      <LiveVoiceConversationModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />

      {/* Editorial Footer */}
      <footer className="mt-16 border-t border-[#eceae5] bg-white py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-stone-900 text-stone-100 flex items-center justify-center font-editorial text-sm font-semibold">
              S
            </div>
            <div>
              <span className="font-medium text-stone-800">SakaKeja Nairobi</span> • Hyper-Local Rental Reconnaissance &amp; True Cost Index
            </div>
          </div>
          <div className="flex items-center gap-4 text-stone-400 font-mono text-[11px]">
            <span>Zero Brokerage Policy</span>
            <span>•</span>
            <span>KES Move-In Ledger</span>
            <span>•</span>
            <span>Nairobi, Kenya</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
