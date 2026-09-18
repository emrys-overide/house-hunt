import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  MapPin,
  Bus,
  ShoppingBag,
  Stethoscope,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Footprints,
  Heart,
  Calculator,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Droplets,
  Zap,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Listing, FilterCriteria } from '../types';
import {
  MAP_DIMENSIONS,
  MAP_ZONES,
  NAIROBI_TRANSPORT_HUBS,
  NAIROBI_AMENITIES,
  NAIROBI_ROAD_SPINES,
  ESTATE_COORDINATES,
  getListingCoordinates,
  getNearestTransportHub,
  getNearbyAmenities,
  TransportHub,
  Amenity,
  Coordinates,
} from '../data/mapData';

interface InteractiveMapViewProps {
  listings: Listing[];
  filters: FilterCriteria;
  setFilters: React.Dispatch<React.SetStateAction<FilterCriteria>>;
  isSaved: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onOpenTco: (listing: Listing) => void;
  onVerifyPing: (listingId: string) => Promise<void>;
  onExploreList: () => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  listings,
  filters,
  setFilters,
  isSaved,
  onToggleSave,
  onOpenTco,
  onVerifyPing,
  onExploreList,
}) => {
  // Map interaction state (pan & zoom)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<Coordinates>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Coordinates>({ x: 0, y: 0 });
  const [activeZoneId, setActiveZoneId] = useState<string>('all');

  // Layer toggles
  const [showHubs, setShowHubs] = useState(true);
  const [showShopping, setShowShopping] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showRoadLabels, setShowRoadLabels] = useState(true);
  const [pinStyle, setPinStyle] = useState<'price' | 'dot'>('price');

  // Selection & Hover state
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [hoveredHub, setHoveredHub] = useState<TransportHub | null>(null);
  const [hoveredAmenity, setHoveredAmenity] = useState<Amenity | null>(null);

  // SVG container ref for coordinate conversions
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Compute coordinates for all active listings
  const pinnedListings = useMemo(() => {
    return listings.map((listing) => {
      const coords = getListingCoordinates(listing);
      return {
        listing,
        coords,
      };
    });
  }, [listings]);

  // If a listing is selected, find its object
  const activeListing = useMemo(() => {
    if (!selectedListingId) return null;
    return pinnedListings.find((p) => p.listing.id === selectedListingId) || null;
  }, [selectedListingId, pinnedListings]);

  // Set initial selected listing if none selected
  useEffect(() => {
    if (!selectedListingId && pinnedListings.length > 0) {
      setSelectedListingId(pinnedListings[0].listing.id);
    }
  }, [pinnedListings, selectedListingId]);

  // Proximity calculations for the active listing
  const activeProximity = useMemo(() => {
    if (!activeListing) return null;
    const nearestHub = getNearestTransportHub(activeListing.coords, activeListing.listing.estate);
    const nearbyAmenities = getNearbyAmenities(activeListing.coords, 'all', 3);
    const nearbyShopping = getNearbyAmenities(activeListing.coords, 'shopping', 1);
    const nearbyHealth = getNearbyAmenities(activeListing.coords, 'hospital', 1);

    return {
      nearestHub,
      nearbyAmenities,
      closestShop: nearbyShopping[0] || null,
      closestHospital: nearbyHealth[0] || null,
    };
  }, [activeListing]);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(3.2, Number((z + 0.3).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.8, Number((z - 0.3).toFixed(2))));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveZoneId('all');
  };

  // Switch to specific map zone
  const handleSelectZone = (zoneId: string) => {
    const zone = MAP_ZONES.find((z) => z.id === zoneId);
    if (!zone) return;
    setActiveZoneId(zoneId);
    setZoom(zone.zoom);
    setPan(zone.panOffset);

    // If switching to Utawala zone, optionally adjust estate filter if user desires
    if (zoneId === 'utawala' && filters.estate !== 'Utawala' && filters.estate !== 'Complex Utawala') {
      // highlight first listing in this zone
      const firstInZone = pinnedListings.find((p) => p.listing.estate.includes('Utawala') || p.listing.estate.includes('Benedicta'));
      if (firstInZone) setSelectedListingId(firstInZone.listing.id);
    }
  };

  // Mouse pan event handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only start drag if clicking on the map background or generic elements, not buttons
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((z) => Math.min(3.2, Math.max(0.8, Number((z + delta).toFixed(2)))));
  };

  // Carousel navigation between pinned listings
  const handleNextListing = () => {
    if (!activeListing || pinnedListings.length === 0) return;
    const currentIndex = pinnedListings.findIndex((p) => p.listing.id === activeListing.listing.id);
    const nextIndex = (currentIndex + 1) % pinnedListings.length;
    setSelectedListingId(pinnedListings[nextIndex].listing.id);
  };

  const handlePrevListing = () => {
    if (!activeListing || pinnedListings.length === 0) return;
    const currentIndex = pinnedListings.findIndex((p) => p.listing.id === activeListing.listing.id);
    const prevIndex = (currentIndex - 1 + pinnedListings.length) % pinnedListings.length;
    setSelectedListingId(pinnedListings[prevIndex].listing.id);
  };

  // Focus on a specific listing on the map
  const focusListingOnMap = (coords: Coordinates, listingId: string) => {
    setSelectedListingId(listingId);
    // Smoothly centre pan towards this coordinate
    const targetPanX = -(coords.x * zoom - MAP_DIMENSIONS.width / 2);
    const targetPanY = -(coords.y * zoom - MAP_DIMENSIONS.height / 2);
    setPan({
      x: Math.round(targetPanX),
      y: Math.round(targetPanY),
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Map Header */}
      <div className="bg-white rounded-xl border border-[#e8e7e1] p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-stone-600 bg-stone-100 px-2 py-0.5 rounded-sm border border-stone-200 font-medium">
              Spatial Proximity Matrix
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">
              Simplified Nairobi Transit &amp; Infrastructure
            </span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900 font-medium tracking-tight">
            Nairobi Interactive Residence Map
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Pins all {pinnedListings.length} filtered residences to direct commuter corridors, measuring exact walking minutes to matatu stages, boreholes, and commercial hubs.
          </p>
        </div>

        {/* Action badges & toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Zone Selector */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            {MAP_ZONES.map((zone) => (
              <button
                key={zone.id}
                id={`map-zone-${zone.id}`}
                onClick={() => handleSelectZone(zone.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap text-xs ${
                  activeZoneId === zone.id
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title={zone.description}
              >
                {zone.label}
              </button>
            ))}
          </div>

          <button
            onClick={onExploreList}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-xs"
          >
            Back to Grid View
          </button>
        </div>
      </div>

      {/* Layer Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#e8e7e1] px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-stone-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-stone-500" />
            <span>Overlays:</span>
          </span>

          <button
            id="toggle-layer-hubs"
            onClick={() => setShowHubs(!showHubs)}
            className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showHubs
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
          >
            <Bus className="w-3.5 h-3.5 text-amber-600" />
            <span>Matatu Stages ({NAIROBI_TRANSPORT_HUBS.length})</span>
          </button>

          <button
            id="toggle-layer-shopping"
            onClick={() => setShowShopping(!showShopping)}
            className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showShopping
                ? 'bg-blue-50 border-blue-300 text-blue-900 font-medium'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
            <span>Malls &amp; Markets</span>
          </button>

          <button
            id="toggle-layer-hospitals"
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showHospitals
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hospitals &amp; Clinics</span>
          </button>

          <button
            id="toggle-layer-roads"
            onClick={() => setShowRoadLabels(!showRoadLabels)}
            className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showRoadLabels
                ? 'bg-stone-100 border-stone-300 text-stone-800 font-medium'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
          >
            <span>Road Labels</span>
          </button>
        </div>

        {/* Right side: Pin Style & Filter Count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-md border border-stone-200">
            <button
              onClick={() => setPinStyle('price')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                pinStyle === 'price' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Price Badges
            </button>
            <button
              onClick={() => setPinStyle('dot')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                pinStyle === 'dot' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Compact Dots
            </button>
          </div>

          <span className="text-stone-400 font-mono text-[11px]">
            Showing <strong className="text-stone-800 font-semibold">{pinnedListings.length}</strong> listings
          </span>
        </div>
      </div>

      {/* Main Map Interactive Work Area (Map + Side Inspector Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SVG Map Canvas Viewport (8 Columns on desktop) */}
        <div className="lg:col-span-8 bg-[#f5f4ef] rounded-xl border border-[#e8e7e1] overflow-hidden relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] h-[540px] sm:h-[620px] select-none">
          {/* Floating Zoom & Pan Control Widget */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-lg border border-[#e2e0d8] shadow-sm">
            <button
              id="map-zoom-in"
              onClick={handleZoomIn}
              className="p-2 hover:bg-stone-100 text-stone-700 hover:text-stone-900 rounded-md transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="map-zoom-out"
              onClick={handleZoomOut}
              className="p-2 hover:bg-stone-100 text-stone-700 hover:text-stone-900 rounded-md transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-px bg-stone-200 my-0.5" />
            <button
              id="map-zoom-reset"
              onClick={handleReset}
              className="p-2 hover:bg-stone-100 text-stone-700 hover:text-stone-900 rounded-md transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Map Compass & Water Legend Badge */}
          <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-[#e2e0d8] shadow-xs flex items-center gap-3 text-[11px] text-stone-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                <span className="font-medium">24/7 Borehole</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                <span className="font-medium">Kanjo Scheduled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bus className="w-3 h-3 text-amber-700" />
                <span className="font-medium">Matatu Stage</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Nairobi Canvas */}
          <svg
            ref={svgRef}
            id="nairobi-interactive-svg-map"
            className="w-full h-full cursor-grab active:cursor-grabbing"
            viewBox={`0 0 ${MAP_DIMENSIONS.width} ${MAP_DIMENSIONS.height}`}
            preserveAspectRatio="xMidYMid meet"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Global Transform Layer for Pan & Zoom */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Topographic Background & Natural Reserve Polygons */}
              <defs>
                <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ebe8de" strokeWidth="0.5" />
                </pattern>
                {/* Subtle Radial Gradient for Selected Listing Proximity Ring */}
                <radialGradient id="walk-radius-gradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="60%" stopColor="#10b981" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                </radialGradient>
              </defs>

              {/* Grid Wash */}
              <rect x="0" y="0" width={MAP_DIMENSIONS.width} height={MAP_DIMENSIONS.height} fill="url(#map-grid)" />

              {/* Karura Forest Nature Reserve (North West) */}
              <path
                d="M 360 250 Q 400 230 430 260 T 420 310 T 360 300 Z"
                fill="#e2ece3"
                stroke="#cde0cf"
                strokeWidth="1.5"
              />
              <text x="390" y="280" fill="#3f6212" fontSize="11" fontWeight="600" fontStyle="italic" opacity="0.8">
                Karura Forest
              </text>

              {/* Nairobi National Park (South Expanse) */}
              <path
                d="M 430 630 Q 560 610 680 635 L 750 780 L 400 780 Z"
                fill="#ecebe0"
                stroke="#dedccf"
                strokeWidth="1.5"
              />
              <text x="520" y="690" fill="#854d0e" fontSize="13" fontWeight="600" fontStyle="italic" opacity="0.7">
                Nairobi National Park Wildlife Corridor
              </text>

              {/* JKIA Airport Zone */}
              <rect
                x="730"
                y="630"
                width="110"
                height="60"
                rx="6"
                fill="#edebe3"
                stroke="#ded9cc"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <text x="740" y="665" fill="#78716c" fontSize="10" fontWeight="600" opacity="0.8">
                JKIA Airport
              </text>

              {/* Major Arterial Road Corridors */}
              {NAIROBI_ROAD_SPINES.map((road) => (
                <g key={road.id} className="road-path-group">
                  {/* Road Casing / Shadow */}
                  <path
                    d={road.path}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={road.width + 3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                  />
                  {/* Road Core Line */}
                  <path
                    d={road.path}
                    fill="none"
                    stroke={road.color}
                    strokeWidth={road.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={road.dashed ? '6 4' : undefined}
                    opacity="0.85"
                  />
                  {/* Road Label */}
                  {showRoadLabels && road.labelPos && (
                    <text
                      x={road.labelPos.x}
                      y={road.labelPos.y}
                      fill="#44403c"
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                      transform={
                        road.labelPos.angle
                          ? `rotate(${road.labelPos.angle}, ${road.labelPos.x}, ${road.labelPos.y})`
                          : undefined
                      }
                      className="pointer-events-none select-none font-mono"
                    >
                      {road.name}
                    </text>
                  )}
                </g>
              ))}

              {/* Estate Neighborhood Text Anchors */}
              {Object.entries(ESTATE_COORDINATES).map(([estateName, coord]) => (
                <g key={`estate-label-${estateName}`} transform={`translate(${coord.x}, ${coord.y - 32})`}>
                  <rect
                    x={-42}
                    y={-12}
                    width={84}
                    height={18}
                    rx={3}
                    fill="#ffffff"
                    fillOpacity="0.85"
                    stroke="#e2e0d8"
                    strokeWidth="0.75"
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    fill="#1c1917"
                    fontSize="9.5"
                    fontWeight="700"
                    letterSpacing="0.05em"
                    className="font-mono uppercase select-none pointer-events-none"
                  >
                    {estateName}
                  </text>
                </g>
              ))}

              {/* ACTIVE LISTING: Proximity Walking Radius and Transit Line */}
              {activeListing && activeProximity && (
                <g id="active-listing-proximity-layer">
                  {/* 10-Minute Walking Radius Circle (approx 45 canvas units) */}
                  <circle
                    cx={activeListing.coords.x}
                    cy={activeListing.coords.y}
                    r="55"
                    fill="url(#walk-radius-gradient)"
                    stroke="#10b981"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                    opacity="0.8"
                  />

                  {/* 5-Minute Walking Inner Circle */}
                  <circle
                    cx={activeListing.coords.x}
                    cy={activeListing.coords.y}
                    r="30"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                    opacity="0.7"
                  />

                  {/* Walking Proximity Trajectory Line to Nearest Transport Hub */}
                  <line
                    x1={activeListing.coords.x}
                    y1={activeListing.coords.y}
                    x2={activeProximity.nearestHub.hub.x}
                    y2={activeProximity.nearestHub.hub.y}
                    stroke="#d97706"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                    strokeLinecap="round"
                  />

                  {/* Midpoint Walking Badge */}
                  <g
                    transform={`translate(${
                      (activeListing.coords.x + activeProximity.nearestHub.hub.x) / 2
                    }, ${(activeListing.coords.y + activeProximity.nearestHub.hub.y) / 2})`}
                  >
                    <rect
                      x="-38"
                      y="-11"
                      width="76"
                      height="20"
                      rx="10"
                      fill="#ffffff"
                      stroke="#d97706"
                      strokeWidth="1.2"
                      className="shadow-sm"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill="#b45309"
                      fontSize="9.5"
                      fontWeight="700"
                      className="font-mono select-none"
                    >
                      {activeProximity.nearestHub.walkMin} min walk
                    </text>
                  </g>
                </g>
              )}

              {/* LAYER 1: Transport Hubs (Matatu Stages, Rail Terminus) */}
              {showHubs &&
                NAIROBI_TRANSPORT_HUBS.map((hub) => {
                  const isHovered = hoveredHub?.id === hub.id;
                  const isConnectedToActive =
                    activeProximity?.nearestHub.hub.id === hub.id;

                  return (
                    <g
                      key={hub.id}
                      transform={`translate(${hub.x}, ${hub.y})`}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredHub(hub)}
                      onMouseLeave={() => setHoveredHub(null)}
                    >
                      {/* Outer Pulse if connected to selected listing */}
                      {isConnectedToActive && (
                        <circle
                          r="14"
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="2"
                          className="animate-ping opacity-60"
                        />
                      )}

                      {/* Hub Badge Marker */}
                      <circle
                        r={isConnectedToActive || isHovered ? '9' : '7.5'}
                        fill="#fef3c7"
                        stroke="#d97706"
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <circle r="3" fill="#b45309" />

                      {/* Hub Label Pill */}
                      <g transform="translate(10, -4)">
                        <rect
                          x="-2"
                          y="-8"
                          width={hub.name.length * 5.6 + 14}
                          height="16"
                          rx="3"
                          fill="#ffffff"
                          fillOpacity="0.9"
                          stroke="#e5e7eb"
                          strokeWidth="0.75"
                        />
                        <text
                          x="5"
                          y="4"
                          fill="#78350f"
                          fontSize="8.5"
                          fontWeight="700"
                          className="font-sans select-none"
                        >
                          {hub.name}
                        </text>
                      </g>
                    </g>
                  );
                })}

              {/* LAYER 2: Shopping & Markets */}
              {showShopping &&
                NAIROBI_AMENITIES.filter((a) => a.category === 'shopping').map((amenity) => {
                  const isHovered = hoveredAmenity?.id === amenity.id;
                  return (
                    <g
                      key={amenity.id}
                      transform={`translate(${amenity.x}, ${amenity.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredAmenity(amenity)}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <circle
                        r={isHovered ? '8' : '6.5'}
                        fill="#dbeafe"
                        stroke="#2563eb"
                        strokeWidth="1.5"
                      />
                      <circle r="2.5" fill="#1d4ed8" />
                      <g transform="translate(8, -4)">
                        <rect
                          x="-1"
                          y="-7"
                          width={amenity.name.length * 5.2 + 8}
                          height="14"
                          rx="2"
                          fill="#ffffff"
                          fillOpacity="0.9"
                          stroke="#e2e8f0"
                          strokeWidth="0.5"
                        />
                        <text
                          x="3"
                          y="4"
                          fill="#1e40af"
                          fontSize="8"
                          fontWeight="600"
                          className="select-none"
                        >
                          {amenity.name}
                        </text>
                      </g>
                    </g>
                  );
                })}

              {/* LAYER 3: Hospitals & Clinics */}
              {showHospitals &&
                NAIROBI_AMENITIES.filter((a) => a.category === 'hospital').map((hospital) => {
                  const isHovered = hoveredAmenity?.id === hospital.id;
                  return (
                    <g
                      key={hospital.id}
                      transform={`translate(${hospital.x}, ${hospital.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredAmenity(hospital)}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <circle
                        r={isHovered ? '8' : '6.5'}
                        fill="#d1fae5"
                        stroke="#059669"
                        strokeWidth="1.5"
                      />
                      {/* Medical Cross */}
                      <path
                        d="M -3 0 L 3 0 M 0 -3 L 0 3"
                        stroke="#047857"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <g transform="translate(8, -4)">
                        <rect
                          x="-1"
                          y="-7"
                          width={hospital.name.length * 5.2 + 8}
                          height="14"
                          rx="2"
                          fill="#ffffff"
                          fillOpacity="0.9"
                          stroke="#e2e8f0"
                          strokeWidth="0.5"
                        />
                        <text
                          x="3"
                          y="4"
                          fill="#065f46"
                          fontSize="8"
                          fontWeight="600"
                          className="select-none"
                        >
                          {hospital.name}
                        </text>
                      </g>
                    </g>
                  );
                })}

              {/* LAYER 4: Pinned Residences */}
              {pinnedListings.map(({ listing, coords }) => {
                const isSelected = selectedListingId === listing.id;
                const isHovered = hoveredListingId === listing.id;
                const rentFormatted = (listing.monthlyRent / 1000).toFixed(listing.monthlyRent % 1000 === 0 ? 0 : 1);
                const hasBorehole = listing.waterInfrastructure.source.includes('Borehole');

                return (
                  <g
                    key={`pin-${listing.id}`}
                    id={`listing-pin-${listing.id}`}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      focusListingOnMap(coords, listing.id);
                    }}
                    onMouseEnter={() => setHoveredListingId(listing.id)}
                    onMouseLeave={() => setHoveredListingId(null)}
                  >
                    {/* Selected Highlight Ring */}
                    {isSelected && (
                      <>
                        <circle
                          r="20"
                          fill="none"
                          stroke="#1c1917"
                          strokeWidth="2.5"
                          className="animate-pulse"
                        />
                        <circle
                          r="25"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                      </>
                    )}

                    {/* PIN STYLE 1: Price Badge */}
                    {pinStyle === 'price' ? (
                      <g transform="translate(-24, -13)">
                        {/* Drop Shadow Pill */}
                        <rect
                          x="0"
                          y="0"
                          width="48"
                          height="24"
                          rx="12"
                          fill={isSelected ? '#1c1917' : isHovered ? '#292524' : '#ffffff'}
                          stroke={isSelected ? '#1c1917' : hasBorehole ? '#10b981' : '#e7e5e4'}
                          strokeWidth={isSelected ? '2' : '1.5'}
                          className="filter drop-shadow-xs transition-colors"
                        />

                        {/* Borehole Tiny Water Dot */}
                        {hasBorehole && (
                          <circle
                            cx="7"
                            cy="12"
                            r="3"
                            fill="#10b981"
                          />
                        )}

                        {/* Price Text */}
                        <text
                          x={hasBorehole ? '28' : '24'}
                          y="15.5"
                          textAnchor="middle"
                          fill={isSelected || isHovered ? '#ffffff' : '#1c1917'}
                          fontSize="9.5"
                          fontWeight="700"
                          className="font-mono select-none"
                        >
                          {rentFormatted}k
                        </text>
                      </g>
                    ) : (
                      /* PIN STYLE 2: Compact Property Dot */
                      <g>
                        <circle
                          r={isSelected ? '9' : isHovered ? '7.5' : '6'}
                          fill={isSelected ? '#1c1917' : hasBorehole ? '#10b981' : '#3b82f6'}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="filter drop-shadow-xs"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Floating Hover Tooltip for Transit Hubs or Amenities */}
          {hoveredHub && (
            <div className="absolute top-4 left-4 z-30 bg-stone-900 text-stone-100 p-3 rounded-lg shadow-xl border border-stone-800 text-xs space-y-1.5 max-w-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Bus className="w-3.5 h-3.5" />
                <span>{hoveredHub.name}</span>
              </div>
              <p className="text-[11px] text-stone-300">{hoveredHub.description}</p>
              <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-800 font-mono">
                <span>Fare: KES {hoveredHub.offPeakFareKes} - {hoveredHub.peakFareKes}</span>
                <span>Safety: {hoveredHub.safetyRating}</span>
              </div>
            </div>
          )}

          {hoveredAmenity && (
            <div className="absolute top-4 left-4 z-30 bg-stone-900 text-stone-100 p-3 rounded-lg shadow-xl border border-stone-800 text-xs space-y-1.5 max-w-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                {hoveredAmenity.category === 'shopping' ? (
                  <ShoppingBag className="w-3.5 h-3.5" />
                ) : (
                  <Stethoscope className="w-3.5 h-3.5" />
                )}
                <span>{hoveredAmenity.name}</span>
              </div>
              <p className="text-[11px] text-stone-300">{hoveredAmenity.description}</p>
              <div className="text-[10px] text-stone-400 font-mono">
                Category: <span className="capitalize">{hoveredAmenity.category}</span> ({hoveredAmenity.tag})
              </div>
            </div>
          )}
        </div>

        {/* Selected Listing Side Inspection Drawer (4 Columns on desktop) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {activeListing ? (
            <div className="bg-white rounded-xl border border-[#e8e7e1] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              {/* Top Card Controls (Prev / Next & Shortlist) */}
              <div className="flex items-center justify-between border-b border-[#eceae5] pb-3">
                <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Selected Pin</span>
                  <span className="text-stone-300">•</span>
                  <span className="font-mono text-[11px]">
                    {pinnedListings.findIndex((p) => p.listing.id === activeListing.listing.id) + 1} of{' '}
                    {pinnedListings.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevListing}
                    className="p-1 hover:bg-stone-100 rounded text-stone-600 cursor-pointer"
                    title="Previous Pin"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextListing}
                    className="p-1 hover:bg-stone-100 rounded text-stone-600 cursor-pointer"
                    title="Next Pin"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    id="map-drawer-toggle-save"
                    onClick={() => onToggleSave(activeListing.listing.id)}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ml-1 ${
                      isSaved(activeListing.listing.id)
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'text-stone-400 hover:text-stone-800 hover:bg-stone-100'
                    }`}
                    title={isSaved(activeListing.listing.id) ? 'Saved to Shortlist' : 'Save to Shortlist'}
                  >
                    <Heart
                      className={`w-4 h-4 ${isSaved(activeListing.listing.id) ? 'fill-rose-500' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Photo & Identity */}
              <div className="space-y-2">
                <div className="relative rounded-lg overflow-hidden h-36 bg-stone-100 border border-stone-200">
                  <img
                    src={activeListing.listing.photos[0]}
                    alt={activeListing.listing.buildingName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-stone-900/90 backdrop-blur-md text-stone-100 text-[10px] font-mono px-2 py-0.5 rounded capitalize">
                    {activeListing.listing.unitType}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md text-stone-900 font-mono font-bold text-xs px-2.5 py-1 rounded shadow-xs">
                    KES {activeListing.listing.monthlyRent.toLocaleString()} / mo
                  </div>
                </div>

                <div>
                  <h3 className="font-editorial text-xl text-stone-900 font-semibold leading-snug">
                    {activeListing.listing.buildingName}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {activeListing.listing.specificLocation}
                  </p>
                </div>
              </div>

              {/* Transit & Commuter Proximity Breakdown */}
              {activeProximity && (
                <div className="space-y-2.5 bg-[#fafaf8] p-3 rounded-lg border border-[#e8e7e1]">
                  <div className="flex items-center justify-between text-xs text-stone-700 font-medium">
                    <span className="flex items-center gap-1.5 font-semibold text-stone-900">
                      <Footprints className="w-3.5 h-3.5 text-stone-600" />
                      <span>Transit &amp; Hub Proximity</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Direct Walk
                    </span>
                  </div>

                  {/* Nearest Stage */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                        <Bus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="line-clamp-1">{activeProximity.nearestHub.hub.name}</span>
                      </div>
                      <span className="font-mono font-bold text-stone-800 text-[11px] shrink-0">
                        {activeListing.listing.commuteAndStage.walkMinutes || activeProximity.nearestHub.walkMin} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono pl-5">
                      <span>Peak fare: KES {activeListing.listing.commuteAndStage.peakFareKes}</span>
                      <span>Off-peak: KES {activeListing.listing.commuteAndStage.offPeakFareKes}</span>
                    </div>
                  </div>

                  {/* Nearest Supermarket/Mall */}
                  {activeProximity.closestShop && (
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-stone-200/60">
                      <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="line-clamp-1">{activeProximity.closestShop.amenity.name}</span>
                      </div>
                      <span className="font-mono text-stone-600 text-[11px] shrink-0">
                        ~{activeProximity.closestShop.approxMeters}m ({activeProximity.closestShop.walkMin}m)
                      </span>
                    </div>
                  )}

                  {/* Nearest Hospital/Clinic */}
                  {activeProximity.closestHospital && (
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-stone-200/60">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{activeProximity.closestHospital.amenity.name}</span>
                      </div>
                      <span className="font-mono text-stone-600 text-[11px] shrink-0">
                        ~{activeProximity.closestHospital.approxMeters}m
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Water Assurance & Utilities Ledger */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border border-[#e8e7e1] bg-white space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-stone-400 font-semibold">
                    <Droplets className="w-3 h-3 text-cyan-600" />
                    <span>Water Source</span>
                  </div>
                  <p className="font-medium text-stone-800 text-[11px] line-clamp-1">
                    {activeListing.listing.waterInfrastructure.source}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-[#e8e7e1] bg-white space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-stone-400 font-semibold">
                    <Zap className="w-3 h-3 text-amber-600" />
                    <span>Power / Token</span>
                  </div>
                  <p className="font-medium text-stone-800 text-[11px] line-clamp-1">
                    {activeListing.listing.electricity.type.includes('Individual') ? 'Own Token Meter' : 'Sub-Meter'}
                  </p>
                </div>
              </div>

              {/* Financial TCO Move-in Snapshot */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase">
                    True Move-In Cash
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm">
                    KES {activeListing.listing.tco.totalMoveInCost.toLocaleString()}
                  </div>
                </div>
                <button
                  id="map-open-tco-modal"
                  onClick={() => onOpenTco(activeListing.listing)}
                  className="px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>View TCO Ledger</span>
                </button>
              </div>

              {/* Direct Caretaker Contact & WhatsApp CTA */}
              <div className="pt-1 space-y-2">
                <a
                  id="map-whatsapp-caretaker"
                  href={`https://wa.me/${activeListing.listing.assignedAgentOrCaretaker.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Habari ${activeListing.listing.assignedAgentOrCaretaker.name}, I am viewing ${activeListing.listing.buildingName} on the SakaKeja Nairobi map. Is this unit still vacant for a viewing?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Inquire with Caretaker ({activeListing.listing.assignedAgentOrCaretaker.name})</span>
                </a>

                <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>0 KES viewing fee policy</span>
                  </span>
                  <span className="font-mono">
                    Floor: {activeListing.listing.vacancyStatus.floorNumber || 'Vacant'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-[#e8e7e1] p-8 text-center space-y-3">
              <Compass className="w-8 h-8 text-stone-400 mx-auto" />
              <h4 className="font-editorial text-lg text-stone-800 font-medium">
                Select Any Pin on the Map
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Click any price badge or property dot to inspect its walking distance to stages, borehole status, and itemized move-in statement.
              </p>
            </div>
          )}

          {/* Quick Estate Distribution Info Card */}
          <div className="bg-white rounded-xl border border-[#e8e7e1] p-4 text-xs text-stone-600 space-y-2">
            <div className="flex items-center justify-between font-medium text-stone-800">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-500" />
                <span>Locality Navigation Tip</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Use the top zone buttons (e.g. <strong>Utawala &amp; Eastern Bypass</strong> or <strong>Thika Road</strong>) to zoom smoothly into high-density neighborhoods. Drag to pan and scroll to zoom.
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Reel of Pinned Residences along Bottom */}
      <div className="bg-white rounded-xl border border-[#e8e7e1] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-900">
              Pinned Residences Catalog
            </span>
            <span className="text-[11px] font-mono text-stone-400">
              ({pinnedListings.length} units mapped)
            </span>
          </div>
          <button
            onClick={onExploreList}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Grid View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable horizontal cards */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-stone-200">
          {pinnedListings.map(({ listing, coords }) => {
            const isSelected = selectedListingId === listing.id;

            return (
              <div
                key={`reel-${listing.id}`}
                id={`map-reel-item-${listing.id}`}
                onClick={() => focusListingOnMap(coords, listing.id)}
                className={`w-64 shrink-0 rounded-lg border p-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-stone-900 bg-stone-50/90 shadow-xs ring-1 ring-stone-900'
                    : 'border-[#e8e7e1] bg-white hover:border-stone-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={listing.photos[0]}
                    alt={listing.buildingName}
                    className="w-12 h-12 rounded-md object-cover shrink-0 bg-stone-100"
                    loading="lazy"
                  />
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h5 className="font-medium text-xs text-stone-900 truncate">
                      {listing.buildingName}
                    </h5>
                    <div className="flex items-center gap-1 text-[10px] text-stone-500 font-mono truncate">
                      <span>{listing.estate}</span>
                      <span>•</span>
                      <span className="capitalize">{listing.unitType}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono pt-0.5">
                      <span className="font-bold text-stone-900">
                        KES {listing.monthlyRent.toLocaleString()}
                      </span>
                      <span className="text-stone-500 text-[10px]">
                        {listing.commuteAndStage.walkMinutes}m to stage
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
