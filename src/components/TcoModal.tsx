import React from 'react';
import { X, Calculator, ShieldCheck, Key, Droplets, Zap, Trash2, Heart, CheckCircle2 } from 'lucide-react';
import { Listing } from '../types';

interface TcoModalProps {
  listing: Listing | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (listingId: string) => void;
}

export const TcoModal: React.FC<TcoModalProps> = ({
  listing,
  onClose,
  isSaved = false,
  onToggleSave,
}) => {
  if (!listing) return null;

  const { tco, waterInfrastructure, electricity, monthlyRent } = listing;

  const estimatedMonthlyLiving =
    monthlyRent +
    tco.garbageFeeMonthly +
    tco.serviceChargeMonthly +
    waterInfrastructure.monthlyEstimateKes +
    1200; // Average prepaid token expenditure

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="tco-modal-card"
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#eceae5] flex flex-col justify-between"
      >
        {/* Editorial Statement Header */}
        <div className="p-6 border-b border-[#eceae5] flex items-start justify-between bg-[#fafaf8]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block mb-1">
              Financial Closing Statement • TCO Ledger
            </span>
            <h2 className="font-editorial text-2xl font-medium text-stone-900 tracking-tight">
              {listing.title}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {listing.buildingName} • {listing.estate} ({listing.specificLocation})
            </p>
          </div>

          <div className="flex items-center gap-1">
            {onToggleSave && (
              <button
                id={`tco-save-btn-${listing.id}`}
                onClick={() => onToggleSave(listing.id)}
                className="p-2 text-stone-400 hover:text-stone-900 rounded-md transition-colors cursor-pointer"
                title={isSaved ? 'Remove from shortlist' : 'Add to shortlist'}
              >
                <Heart
                  className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'stroke-current'}`}
                />
              </button>
            )}
            <button
              id="tco-modal-close-btn"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Financial Content */}
        <div className="p-6 space-y-6 text-stone-800">
          {/* Total Upfront Cash Block */}
          <div className="p-5 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium tracking-wider uppercase text-stone-400 block mb-0.5">
                Total Upfront Move-in Cash
              </span>
              <div className="font-editorial text-3xl sm:text-4xl font-medium text-white tracking-tight">
                KES {tco.totalMoveInCost.toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                First month rent + all audited refundable utility deposits
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full bg-stone-800 border border-stone-700 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Zero Broker Fee
              </span>
            </div>
          </div>

          {/* Itemized Upfront Ledger */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Itemized Move-In Deductions
            </h4>
            <div className="divide-y divide-[#f0eee9] border border-[#eceae5] rounded-xl overflow-hidden text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-stone-700">Advance First Month Rent</span>
                <span className="font-mono font-medium text-stone-900">KES {tco.rent.toLocaleString()}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-stone-700 block">House Security Deposit</span>
                  <span className="text-[10px] text-stone-400">Refundable upon lease completion</span>
                </div>
                <span className="font-mono font-medium text-stone-900">KES {tco.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-stone-700 block">Water Meter Deposit</span>
                  <span className="text-[10px] text-stone-400">Refundable to building management</span>
                </div>
                <span className="font-mono font-medium text-stone-900">KES {tco.waterDeposit.toLocaleString()}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-stone-700 block">KPLC Electricity Token Deposit</span>
                  <span className="text-[10px] text-stone-400">Meter initialization &amp; pre-load</span>
                </div>
                <span className="font-mono font-medium text-stone-900">KES {tco.electricityDeposit.toLocaleString()}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-stone-700">Initial Month Waste Collection</span>
                <span className="font-mono font-medium text-stone-900">KES {tco.garbageFeeMonthly.toLocaleString()}</span>
              </div>
              {tco.serviceChargeMonthly > 0 && (
                <div className="p-3 flex items-center justify-between">
                  <span className="text-stone-700">Monthly Compound Service &amp; Guard</span>
                  <span className="font-mono font-medium text-stone-900">KES {tco.serviceChargeMonthly.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ongoing Monthly Run Rate */}
          <div className="p-4 rounded-xl bg-stone-50 border border-[#eceae5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-600">Estimated Monthly Ongoing Run-Rate:</span>
              <span className="font-mono font-semibold text-stone-900 text-sm">
                ~ KES {estimatedMonthlyLiving.toLocaleString()} / mo
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Calculated from monthly rent (KES {monthlyRent.toLocaleString()}), typical borehole water draw (~KES {waterInfrastructure.monthlyEstimateKes}), individual KPLC tokens (~KES 1,200), and compound sanitation (KES {tco.garbageFeeMonthly + tco.serviceChargeMonthly}).
            </p>
          </div>

          {/* Policy Commitment */}
          <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              All viewings are directly conducted by caretaker <strong>{listing.assignedAgentOrCaretaker.name}</strong> without middleman facilitation fees.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eceae5] bg-[#fafaf8] flex items-center justify-end">
          <button
            id="tco-close-bottom-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-[#e8e7e1] rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
