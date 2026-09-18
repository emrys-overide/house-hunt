import React from 'react';
import { Mic, Heart, Plus, BarChart3, MapPin } from 'lucide-react';

export type AppTab = 'explore' | 'map' | 'dashboard' | 'scraper' | 'concierge' | 'caretaker' | 'saved';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  verifiedCount: number;
  scrapedCount: number;
  savedCount?: number;
  onOpenLiveVoice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  verifiedCount,
  scrapedCount,
  savedCount = 0,
  onOpenLiveVoice,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fafaf8]/90 backdrop-blur-md border-b border-[#eceae5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('explore')}
            className="cursor-pointer flex items-center gap-3 select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-editorial text-lg font-semibold tracking-tighter">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl font-medium tracking-tight text-stone-900">
                  SakaKeja
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-stone-600 px-1.5 py-0.5 rounded-sm bg-stone-100 border border-stone-200">
                  Nairobi
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Minimalist Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-tab-explore"
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all ${
                activeTab === 'explore'
                  ? 'text-stone-900 font-semibold bg-stone-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              Residences
              <span className="ml-1.5 text-[11px] text-stone-400 font-normal">({verifiedCount})</span>
            </button>

            <button
              id="nav-tab-map"
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'text-stone-900 font-semibold bg-stone-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Map View</span>
            </button>

            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'text-stone-900 font-semibold bg-stone-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-stone-500" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-tab-scraper"
              onClick={() => setActiveTab('scraper')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all ${
                activeTab === 'scraper'
                  ? 'text-stone-900 font-semibold bg-stone-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              Caretakers
              <span className="ml-1.5 text-[11px] text-stone-400 font-normal">({scrapedCount})</span>
            </button>

            <button
              id="nav-tab-concierge"
              onClick={() => setActiveTab('concierge')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all ${
                activeTab === 'concierge'
                  ? 'text-stone-900 font-semibold bg-stone-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              Advisory AI
            </button>

            <button
              id="nav-tab-saved"
              onClick={() => setActiveTab('saved')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'text-stone-900 font-semibold bg-stone-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  savedCount > 0 ? 'fill-stone-900 text-stone-900' : 'text-stone-400'
                }`}
              />
              <span>Shortlist</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-stone-900 text-white">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Secondary Actions */}
          <div className="flex items-center gap-2">
            {onOpenLiveVoice && (
              <button
                id="nav-btn-live-voice"
                onClick={onOpenLiveVoice}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 rounded-md border border-[#e8e7e1] bg-white hover:border-stone-400 transition-colors cursor-pointer"
                title="Voice Consultation"
              >
                <Mic className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">Voice Advisor</span>
              </button>
            )}

            <button
              id="nav-tab-caretaker"
              onClick={() => setActiveTab('caretaker')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'caretaker'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Direct Intake</span>
              <span className="sm:hidden">List</span>
            </button>

            {/* Mobile Tab Quick Selector */}
            <div className="flex items-center gap-1 md:hidden ml-1">
              <button
                onClick={() => setActiveTab('saved')}
                className={`p-1.5 rounded-md border ${
                  activeTab === 'saved'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-[#e8e7e1]'
                }`}
                title="Saved Shortlist"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden items-center justify-between border-t border-[#eceae5] py-2 overflow-x-auto scrollbar-none gap-2 text-xs">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'explore' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Residences ({verifiedCount})
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'map' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'dashboard' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('scraper')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'scraper' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Caretakers ({scrapedCount})
          </button>
          <button
            onClick={() => setActiveTab('concierge')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'concierge' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Advisory AI
          </button>
        </div>
      </div>
    </header>
  );
};
