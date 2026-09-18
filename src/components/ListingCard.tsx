import React, { useState } from 'react';
import {
  MapPin,
  Droplets,
  Zap,
  Bus,
  Calculator,
  ExternalLink,
  Heart,
  MessageCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onOpenTco: (listing: Listing) => void;
  onVerifyPing: (listingId: string) => Promise<void>;
  isSaved?: boolean;
  onToggleSave?: (listingId: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onOpenTco,
  onVerifyPing,
  isSaved = false,
  onToggleSave,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [justVerified, setJustVerified] = useState(false);

  const {
    id,
    title,
    buildingName,
    estate,
    specificLocation,
    unitType,
    monthlyRent,
    tco,
    waterInfrastructure,
    electricity,
    commuteAndStage,
    assignedAgentOrCaretaker,
    vacancyStatus,
    photos,
  } = listing;

  const handleVerify = async () => {
    setIsVerifying(true);
    await onVerifyPing(id);
    setIsVerifying(false);
    setJustVerified(true);
    setTimeout(() => setJustVerified(false), 3500);
  };

  const whatsappMessage = encodeURIComponent(
    `Habari ${assignedAgentOrCaretaker.name}, I am inquiring about the ${unitType} at ${buildingName} (${estate}) on SakaKeja. Is the unit still vacant for a viewing today?`
  );

  return (
    <article
      id={`listing-card-${id}`}
      className="group bg-white rounded-xl border border-[#e8e7e1] overflow-hidden transition-all duration-300 hover:border-stone-400 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col justify-between"
    >
      <div>
        {/* Editorial Photo Frame */}
        <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
          <img
            src={
              photos[0] ||
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
            }
            alt={title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Frosted Dark Header Tag */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider rounded-md bg-stone-900/85 text-stone-100 backdrop-blur-md">
              {listing.bedrooms ? `${listing.bedrooms} Bed` : ''} {listing.propertyType || unitType.replace('-', ' ')}
            </span>
            {vacancyStatus.isVacant && (
              <span className="px-2 py-1 text-[10px] font-medium tracking-wide uppercase rounded-md bg-stone-100/90 text-stone-800 backdrop-blur-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Vacant
              </span>
            )}
          </div>

          {/* Floating Bookmark Action */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {vacancyStatus.floorNumber && (
              <span className="px-2 py-1 text-[10px] font-mono rounded-md bg-stone-900/70 text-white backdrop-blur-md">
                {vacancyStatus.floorNumber}
              </span>
            )}

            {onToggleSave && (
              <button
                id={`save-listing-btn-${id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(id);
                }}
                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-sm ${
                  isSaved
                    ? 'bg-stone-900 text-rose-400'
                    : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900'
                }`}
                aria-label={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
                title={isSaved ? 'Shortlisted (Click to remove)' : 'Add to Shortlist'}
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-transform ${
                    isSaved ? 'fill-rose-500 text-rose-500' : 'stroke-current'
                  }`}
                />
              </button>
            )}
          </div>

          {/* Zero Viewing Fee Micro-Tag */}
          <div className="absolute bottom-2.5 left-3">
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-sm bg-stone-900/80 text-stone-200 backdrop-blur-sm">
              0 KES Viewing Fee • Direct Caretaker
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Building Title & Location */}
          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-medium text-stone-900 leading-snug tracking-tight line-clamp-1">
              {title}
            </h3>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="text-stone-700 font-medium">{buildingName}</span>
              <span>•</span>
              <span className="text-stone-500 truncate">{estate} ({specificLocation})</span>
            </p>
          </div>

          {/* Pricing & Financial Ledger Strip */}
          <div className="pt-3 border-t border-[#f0eee9] flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400 block mb-0.5">
                Monthly Rent
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-editorial text-2xl font-medium text-stone-900">
                  KES {monthlyRent.toLocaleString()}
                </span>
                <span className="text-xs text-stone-500 font-sans-clean">/ mo</span>
              </div>
            </div>

            <button
              id={`tco-calc-btn-${id}`}
              onClick={() => onOpenTco(listing)}
              className="text-right group cursor-pointer"
              title="Inspect line-item True Cost of Occupancy statement"
            >
              <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-500 block group-hover:text-stone-900">
                Move-in TCO Cash
              </span>
              <span className="text-xs font-mono font-medium text-stone-900 group-hover:underline flex items-center justify-end gap-1">
                KES {tco.totalMoveInCost.toLocaleString()}
                <Calculator className="w-3 h-3 text-stone-400 group-hover:text-stone-900" />
              </span>
            </button>
          </div>

          {/* Minimalist 3-Column Architectural Spec Strip */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-stone-50/80 border border-[#eceae5] text-xs">
            {/* Water */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-stone-400 text-[10px] uppercase tracking-wider font-semibold">
                <Droplets className="w-3 h-3 text-stone-500" />
                <span>Water</span>
              </div>
              <p className="text-[11px] font-medium text-stone-800 line-clamp-1" title={waterInfrastructure.source}>
                {waterInfrastructure.source.replace('24/7 ', '')}
              </p>
            </div>

            {/* Power */}
            <div className="space-y-0.5 border-l border-[#e4e2db] pl-2.5">
              <div className="flex items-center gap-1 text-stone-400 text-[10px] uppercase tracking-wider font-semibold">
                <Zap className="w-3 h-3 text-stone-500" />
                <span>Meter</span>
              </div>
              <p className="text-[11px] font-medium text-stone-800 line-clamp-1" title={electricity.type}>
                {electricity.type.includes('Individual') ? 'Own Token' : 'Sub-meter'}
              </p>
            </div>

            {/* Stage */}
            <div className="space-y-0.5 border-l border-[#e4e2db] pl-2.5">
              <div className="flex items-center gap-1 text-stone-400 text-[10px] uppercase tracking-wider font-semibold">
                <Bus className="w-3 h-3 text-stone-500" />
                <span>Stage</span>
              </div>
              <p className="text-[11px] font-medium text-stone-800 line-clamp-1">
                {commuteAndStage.walkMinutes} min walk
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Caretaker Contact & Verification Footer */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 space-y-2">
        {/* Caretaker & WhatsApp Action */}
        <div className="flex items-center gap-2">
          <a
            id={`whatsapp-caretaker-${id}`}
            href={`https://wa.me/${assignedAgentOrCaretaker.phone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Inquire via WhatsApp</span>
          </a>

          <button
            id={`verify-vacancy-${id}`}
            onClick={handleVerify}
            disabled={isVerifying}
            className="px-2.5 py-2 rounded-lg border border-[#e8e7e1] hover:border-stone-400 bg-white text-stone-600 hover:text-stone-900 text-xs font-medium transition-colors cursor-pointer"
            title="Trigger Caretaker Status Check"
          >
            {isVerifying ? (
              <Clock className="w-3.5 h-3.5 animate-spin text-stone-500" />
            ) : justVerified ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <span className="text-[11px]">Verify</span>
            )}
          </button>
        </div>

        {/* Quiet Meta Line */}
        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
          <span className="truncate">
            Caretaker: <strong className="text-stone-700 font-medium">{assignedAgentOrCaretaker.name}</strong>
          </span>
          {listing.scrapedSource?.sourceUrl && (
            <a
              href={listing.scrapedSource.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-stone-700 flex items-center gap-0.5 shrink-0"
              title="Verified Source Advert"
            >
              <span>Source</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
