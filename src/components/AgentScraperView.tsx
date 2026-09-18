import React, { useState } from 'react';
import {
  Building2,
  Search,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Droplets,
  Zap,
} from 'lucide-react';
import { ScrapedAgentInsight } from '../types';

interface AgentScraperViewProps {
  scrapedAgents: ScrapedAgentInsight[];
  onScrapeNewEstate: (query: string) => Promise<void>;
  isScraping: boolean;
  onExploreHouse: (estateName: string) => void;
  onOpenLiveVoice?: () => void;
}

export const AgentScraperView: React.FC<AgentScraperViewProps> = ({
  scrapedAgents,
  onScrapeNewEstate,
  isScraping,
  onExploreHouse,
}) => {
  const [searchQuery, setSearchQuery] = useState('Utawala');
  const [selectedAgent, setSelectedAgent] = useState<ScrapedAgentInsight | null>(
    scrapedAgents[0] || null
  );

  const handleTriggerScrape = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onScrapeNewEstate(searchQuery.trim());
  };

  const quickEstates = [
    'Complex Utawala',
    'Junction/Benedicta',
    'Airways & Mihango',
    'Githunguri Area',
    'Roysambu',
    'Kahawa Wendani',
    'Ruaka',
    'Kilimani',
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header Section */}
      <div className="bg-white rounded-xl border border-[#e8e7e1] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-stone-400 block mb-1">
              Field Directory &amp; Reconnaissance
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
              Verified Building Caretakers &amp; Custodians
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Direct physical key-holders, on-site caretakers, and authorized building managers.
              Every contact has been audited for a strict 0 KES viewing fee policy.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Audited Desks</span>
            <span className="font-editorial text-2xl text-stone-900 font-medium">
              {scrapedAgents.length} Custodians
            </span>
          </div>
        </div>

        {/* Minimal Search & Query Strip */}
        <form onSubmit={handleTriggerScrape} className="pt-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="agent-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan estate (e.g. Complex Utawala, Benedicta, Ruaka, Roysambu)..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-[#e8e7e1] rounded-lg text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-500 focus:bg-white transition-colors"
              />
            </div>

            <button
              id="agent-scrape-btn"
              type="submit"
              disabled={isScraping}
              className="px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-stone-100 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              {isScraping ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning Field Records...</span>
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Scan Caretakers</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Locality Jump Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 text-xs scrollbar-none">
            <span className="text-stone-400 text-[11px] shrink-0 font-medium">Quick Scan:</span>
            {quickEstates.map((est) => (
              <button
                key={est}
                type="button"
                onClick={() => {
                  setSearchQuery(est);
                  onScrapeNewEstate(est);
                }}
                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer"
              >
                {est}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Directory & Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Custodian List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#eceae5]">
            <h3 className="font-editorial text-lg text-stone-900 font-medium">
              Registered Caretakers
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              {scrapedAgents.length} records
            </span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {scrapedAgents.map((agent) => {
              const isSelected = selectedAgent?.id === agent.id;

              return (
                <div
                  key={agent.id}
                  id={`agent-item-${agent.id}`}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-stone-800 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-stone-800'
                      : 'bg-white border-[#e8e7e1] hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-editorial text-lg text-stone-900 font-medium leading-snug">
                        {agent.agentName}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {agent.agencyOrEstate} • <strong className="text-stone-700 font-medium">{agent.estateFocus}</strong>
                      </p>
                    </div>

                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm bg-stone-100 text-stone-700 border border-stone-200">
                      Direct Custodian
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#f0eee9] text-stone-500">
                    <span>{agent.housesAssigned.length} Properties Cataloged</span>
                    <span className="text-emerald-800 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Free Viewing
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Custodian Dossier */}
        <div className="lg:col-span-7">
          {selectedAgent ? (
            <div className="bg-white rounded-xl border border-[#e8e7e1] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eceae5]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                      Verified Direct Caretaker
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-500">{selectedAgent.lastActivity}</span>
                  </div>
                  <h3 className="font-editorial text-2xl font-medium text-stone-900">
                    {selectedAgent.agentName}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {selectedAgent.agencyOrEstate} ({selectedAgent.estateFocus})
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedAgent.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Habari ${selectedAgent.agentName}, I saw the residences under your care on SakaKeja. I would like to inquire about upcoming vacancies.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Caretaker</span>
                  </a>

                  <a
                    href={`tel:${selectedAgent.phoneNumber}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e8e7e1] hover:border-stone-400 text-stone-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>{selectedAgent.phoneNumber}</span>
                  </a>
                </div>
              </div>

              {/* Ground Notes & Verification Assessment */}
              <div className="p-3.5 rounded-lg bg-stone-50 border border-[#eceae5] text-xs text-stone-700 space-y-1">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400 block">
                  Ground Verification Assessment
                </span>
                <p className="leading-relaxed text-stone-800">{selectedAgent.notes}</p>
              </div>

              {/* Assigned Buildings & Current Vacancies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Assigned Buildings &amp; Infrastructure ({selectedAgent.housesAssigned.length})
                  </h4>
                  <button
                    onClick={() => onExploreHouse(selectedAgent.estateFocus)}
                    className="text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore in {selectedAgent.estateFocus}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedAgent.housesAssigned.map((house, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[#eceae5] bg-[#fafaf8] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-editorial text-lg text-stone-900 font-medium">
                            {house.building}
                          </h5>
                          <p className="text-xs text-stone-500">{house.location}</p>
                        </div>
                        <span className="font-mono text-xs font-medium text-stone-900 px-2 py-0.5 rounded-sm bg-stone-200/60">
                          {house.rentRangeKes}
                        </span>
                      </div>

                      {/* 3-Column Ground Intel */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-[#f0eee9]">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
                            Vacancies
                          </span>
                          <p className="text-[11px] font-medium text-stone-800">{house.vacancies}</p>
                        </div>

                        <div className="space-y-0.5 sm:border-l sm:border-[#e8e7e1] sm:pl-2.5">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-stone-500" />
                            Water
                          </span>
                          <p className="text-[11px] font-medium text-stone-800">{house.waterIntel}</p>
                        </div>

                        <div className="space-y-0.5 sm:border-l sm:border-[#e8e7e1] sm:pl-2.5">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-stone-500" />
                            Power
                          </span>
                          <p className="text-[11px] font-medium text-stone-800">{house.powerIntel}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center p-8 bg-white rounded-xl border border-dashed border-[#e8e7e1] text-center">
              <p className="text-xs text-stone-400">Select a caretaker to view assigned buildings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
