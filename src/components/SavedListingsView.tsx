import React, { useState } from 'react';
import {
  Heart,
  Share2,
  Trash2,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Check,
  Table,
  LayoutGrid,
} from 'lucide-react';
import { Listing } from '../types';
import { ListingCard } from './ListingCard';

interface SavedListingsViewProps {
  savedListings: Listing[];
  onToggleSave: (listingId: string) => void;
  onClearAll: () => void;
  onOpenTco: (listing: Listing) => void;
  onVerifyPing: (listingId: string) => Promise<void>;
  onExploreMore: () => void;
}

export const SavedListingsView: React.FC<SavedListingsViewProps> = ({
  savedListings,
  onToggleSave,
  onClearAll,
  onOpenTco,
  onVerifyPing,
  onExploreMore,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
  const [copiedShare, setCopiedShare] = useState(false);

  const totalSaved = savedListings.length;
  const totalRent = savedListings.reduce((sum, item) => sum + item.monthlyRent, 0);
  const avgRent = totalSaved > 0 ? Math.round(totalRent / totalSaved) : 0;
  const minTco = totalSaved > 0 ? Math.min(...savedListings.map((l) => l.tco.totalMoveInCost)) : 0;
  const maxTco = totalSaved > 0 ? Math.max(...savedListings.map((l) => l.tco.totalMoveInCost)) : 0;

  const handleShareShortlist = () => {
    if (savedListings.length === 0) return;
    const textLines = [
      `My Nairobi Residential Shortlist (${totalSaved} Residences)`,
      `Audited with 0 KES viewing fees on SakaKeja:\n`,
      ...savedListings.map(
        (l, i) =>
          `${i + 1}. ${l.buildingName} (${l.estate}) - ${l.unitType}\n   • Monthly Rent: KES ${l.monthlyRent.toLocaleString()}\n   • Move-In TCO: KES ${l.tco.totalMoveInCost.toLocaleString()}\n   • Water: ${l.waterInfrastructure.source}\n   • Caretaker: ${l.assignedAgentOrCaretaker.name} (${l.assignedAgentOrCaretaker.phone})`
      ),
      `\nView on SakaKeja: ${window.location.href}`,
    ];
    const fullText = textLines.join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      });
    }
  };

  if (totalSaved === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <Heart className="w-6 h-6 stroke-[1.5]" />
        </div>

        <div className="space-y-1.5">
          <h2 className="font-editorial text-3xl font-medium text-stone-900 tracking-tight">
            No Shortlisted Residences
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Select the bookmark icon on any residence to curate your comparative shortlist.
          </p>
        </div>

        <div className="pt-3">
          <button
            onClick={onExploreMore}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-medium transition-colors cursor-pointer"
          >
            <span>Explore Residences</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Editorial Header */}
      <div className="bg-white rounded-xl border border-[#e8e7e1] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">
            Curated Shortlist • {totalSaved} Properties
          </span>
          <h2 className="font-editorial text-3xl font-medium text-stone-900 tracking-tight">
            Residence Comparison Portfolio
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Compare monthly rent, move-in liquidity requirements, and verified caretaker contacts.
          </p>
        </div>

        {/* Financial Metrics & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 px-3.5 py-2 bg-stone-50 border border-[#eceae5] rounded-lg text-xs">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-medium block">Average Rent</span>
              <span className="font-mono font-medium text-stone-900">KES {avgRent.toLocaleString()}</span>
            </div>
            <div className="w-px h-6 bg-stone-200" />
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-medium block">Move-in Cash Span</span>
              <span className="font-mono font-medium text-stone-900">
                KES {minTco.toLocaleString()} - {maxTco.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-[#e8e7e1]">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'compare'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleShareShortlist}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Export / Share</span>
              </>
            )}
          </button>

          <button
            onClick={onClearAll}
            className="p-2 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
            title="Clear all shortlisted properties"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Display Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSaved={true}
              onToggleSave={onToggleSave}
              onOpenTco={onOpenTco}
              onVerifyPing={onVerifyPing}
            />
          ))}
        </div>
      )}

      {/* Table Display Mode */}
      {viewMode === 'compare' && (
        <div className="bg-white rounded-xl border border-[#e8e7e1] overflow-x-auto shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#eceae5] bg-stone-50 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-4">Residence</th>
                <th className="py-3 px-4">Typology</th>
                <th className="py-3 px-4">Monthly Rent</th>
                <th className="py-3 px-4">Move-in Cash (TCO)</th>
                <th className="py-3 px-4">Water Infrastructure</th>
                <th className="py-3 px-4">Electricity Meter</th>
                <th className="py-3 px-4">Caretaker</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eee9] text-stone-700">
              {savedListings.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4 font-medium text-stone-900">
                    <div className="font-editorial text-base font-medium">{item.buildingName}</div>
                    <div className="text-[11px] text-stone-400">{item.estate}</div>
                  </td>
                  <td className="py-3 px-4 capitalize">{item.unitType.replace('-', ' ')}</td>
                  <td className="py-3 px-4 font-mono font-medium text-stone-900">
                    KES {item.monthlyRent.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-stone-900">
                    KES {item.tco.totalMoveInCost.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[11px]">{item.waterInfrastructure.source}</td>
                  <td className="py-3 px-4 text-[11px]">{item.electricity.type}</td>
                  <td className="py-3 px-4 text-[11px]">{item.assignedAgentOrCaretaker.name}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenTco(item)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-medium cursor-pointer mr-2"
                    >
                      TCO
                    </button>
                    <button
                      onClick={() => onToggleSave(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
