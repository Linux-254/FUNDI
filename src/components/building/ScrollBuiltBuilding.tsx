import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Hammer, 
  CheckCircle, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Eye,
  EyeOff,
  Ruler
} from 'lucide-react';

export const ScrollBuiltBuilding: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(3); // Default to superstructure
  const [showDimensions, setShowDimensions] = useState(true);
  const [showGridlines, setShowGridlines] = useState(true);
  const [showHatching, setShowHatching] = useState(true);
  const [cursorCoord, setCursorCoord] = useState<{ x: string; y: string } | null>(null);

  const stages = [
    {
      id: 1,
      acronymLetter: 'F',
      title: 'Find & Survey',
      subtitle: 'Plot Perimeter & Geotechnical Baseline',
      description: 'Geotechnical soil boreholes certified, topographical beacons verified by licensed BORAQS surveyor, and bedrock strata mapped at -2.20m.',
      icon: <Compass className="w-4 h-4 text-[#C8A24A]" />
    },
    {
      id: 2,
      acronymLetter: 'U',
      title: 'Unite Team & Approvals',
      subtitle: 'NCA, County & NEMA Permits In Hand',
      description: 'Unified project workspace with Nairobi County architectural approvals, NEMA EIA licensing, and NCA 0.5% statutory construction levy certified.',
      icon: <Layers className="w-4 h-4 text-[#1F6FEB]" />
    },
    {
      id: 3,
      acronymLetter: 'N',
      title: 'Negotiate & Substructure',
      subtitle: 'Load-Bearing Bedrock & DPC Concrete',
      description: 'Basalt bedrock excavation, reinforced pad footings, high-tensile D16 rebar cages, and certified Class 25/20 concrete plinth beam cast with 25mm cover.',
      icon: <Hammer className="w-4 h-4 text-[#FF6B2C]" />
    },
    {
      id: 4,
      acronymLetter: 'D',
      title: 'Deliver With Proof',
      subtitle: 'Superstructure Slabs & Engineered Roof',
      description: 'First floor suspended slab, coursed ashlar stone masonry, lintel ring beams, and light-gauge steel trusses verified by independent Clerk of Works.',
      icon: <CheckCircle className="w-4 h-4 text-[#1E9E6A]" />
    },
    {
      id: 5,
      acronymLetter: 'I',
      title: 'Ironclad Escrow',
      subtitle: 'Completed Villa, Zero Overrun, Verified Payouts',
      description: 'Turnkey architectural finishes, thermal double glazing, 10kW hybrid solar PV array, and 5% defect retention custody executed smoothly without dispute.',
      icon: <Lock className="w-4 h-4 text-[#C8A24A]" />
    }
  ];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;
    // Map to architectural meters (width 16m, height 12m)
    const meterX = (xRatio * 16).toFixed(1);
    const meterY = ((1 - yRatio) * 11 - 2.5).toFixed(1);
    setCursorCoord({ x: meterX, y: meterY });
  };

  return (
    <div className="bg-[#0B1B2B] text-white rounded-3xl p-6 sm:p-10 border border-[#2B4560]/50 shadow-2xl overflow-hidden relative">
      {/* Background CAD grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#1F6FEB 1px, transparent 1px), linear-gradient(90deg, #1F6FEB 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full min-w-0">
        
        {/* Left Side: FUNDI Stage Navigator & Explainer */}
        <div className="lg:col-span-5 min-w-0 space-y-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              How a project assembles from ground to key handover.
            </h2>
            <p className="text-sm text-[#D9DEE3]/70 mt-2">
              Step through each building phase to see how ironclad escrow, evidence verification, and team alignment guarantee certainty.
            </p>
          </div>

          {/* Stepper buttons */}
          <div className="space-y-2">
            {stages.map((stage) => {
              const isSelected = activeStage === stage.id;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2B4560]/40 border-[#C8A24A] shadow-md'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-extrabold text-xs ${
                        isSelected ? 'bg-[#C8A24A] text-[#0B1B2B]' : 'bg-white/10 text-white'
                      }`}>
                        {stage.acronymLetter}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-white">
                          {stage.id}. {stage.title}
                        </div>
                        <div className="text-[11px] text-[#D9DEE3]/60 truncate">
                          {stage.subtitle}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#C8A24A] translate-x-1' : 'text-white/30'}`} />
                  </div>

                  {isSelected && (
                    <p className="mt-2 text-xs text-[#D9DEE3]/90 leading-relaxed pl-10 border-l border-[#C8A24A]/40">
                      {stage.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Architectural SVG Line Drawing Elevation */}
        <div className="lg:col-span-7 min-w-0 w-full bg-[#07131F] rounded-2xl p-4 sm:p-6 border border-[#2B4560]/70 flex flex-col items-center justify-center relative min-h-[420px]">
          
          {/* CAD Control Strip */}
          <div className="w-full flex flex-wrap items-center justify-between text-[11px] font-mono text-[#D9DEE3]/60 mb-2 gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[#C8A24A] font-bold">ARCH ELEVATION A-102</span>
              <span className="text-white/40">·</span>
              <span>STAGE {activeStage}/5</span>
            </div>

            {/* Quick Layer Toggles */}
            <div className="flex items-center gap-3 text-[10px]">
              <button 
                onClick={() => setShowGridlines(!showGridlines)}
                className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${showGridlines ? 'text-[#1F6FEB]' : 'text-gray-500'}`}
              >
                <Layers className="w-3 h-3" />
                <span>Grid</span>
              </button>
              <button 
                onClick={() => setShowDimensions(!showDimensions)}
                className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${showDimensions ? 'text-[#C8A24A]' : 'text-gray-500'}`}
              >
                <Ruler className="w-3 h-3" />
                <span>Dims</span>
              </button>
              <button 
                onClick={() => setShowHatching(!showHatching)}
                className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${showHatching ? 'text-[#1E9E6A]' : 'text-gray-500'}`}
              >
                {showHatching ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>Hatch</span>
              </button>
            </div>
          </div>

          {/* Architectural SVG Drawing */}
          <div className="w-full max-w-xl aspect-4/3 relative flex items-center justify-center bg-[#081729] rounded-xl border border-[#1F6FEB]/30 overflow-hidden shadow-inner">
            <svg 
              viewBox="0 0 640 460" 
              className="w-full h-full select-none cursor-crosshair"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setCursorCoord(null)}
            >
              {/* Grid & Hatching Defs */}
              <defs>
                <pattern id="svgGridMajor" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(31, 111, 235, 0.18)" strokeWidth="0.75"/>
                  <path d="M 20 0 L 20 40 M 0 20 L 40 20" fill="none" stroke="rgba(31, 111, 235, 0.08)" strokeWidth="0.5"/>
                </pattern>
                
                {/* Concrete Hatching Pattern */}
                <pattern id="concreteHatch" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="1" fill="#758B9E" opacity="0.6"/>
                  <circle cx="11" cy="9" r="1.2" fill="#758B9E" opacity="0.6"/>
                  <path d="M 1 14 L 3 12 L 5 15 Z" fill="#758B9E" opacity="0.4"/>
                  <path d="M 12 2 L 14 4 L 10 5 Z" fill="#758B9E" opacity="0.4"/>
                </pattern>

                {/* Stone Masonry Hatching */}
                <pattern id="masonryHatch" width="28" height="14" patternUnits="userSpaceOnUse">
                  <rect width="28" height="14" fill="none" stroke="#2B4560" strokeWidth="0.7"/>
                  <line x1="14" y1="0" x2="14" y2="7" stroke="#2B4560" strokeWidth="0.7"/>
                  <line x1="0" y1="7" x2="28" y2="7" stroke="#2B4560" strokeWidth="0.7"/>
                  <line x1="0" y1="14" x2="28" y2="14" stroke="#2B4560" strokeWidth="0.7"/>
                </pattern>
              </defs>

              {/* Blueprint Grid Canvas */}
              <rect width="640" height="460" fill="url(#svgGridMajor)" />

              {/* Structural Centerlines & Bubbles */}
              {showGridlines && (
                <g className="opacity-70">
                  {/* Grid A */}
                  <line x1="100" y1="30" x2="100" y2="410" stroke="#1F6FEB" strokeWidth="0.8" strokeDasharray="6 3 1 3" />
                  <circle cx="100" cy="22" r="9" fill="#081729" stroke="#1F6FEB" strokeWidth="1" />
                  <text x="100" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">A</text>

                  {/* Grid B */}
                  <line x1="220" y1="30" x2="220" y2="410" stroke="#1F6FEB" strokeWidth="0.8" strokeDasharray="6 3 1 3" />
                  <circle cx="220" cy="22" r="9" fill="#081729" stroke="#1F6FEB" strokeWidth="1" />
                  <text x="220" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">B</text>

                  {/* Grid C */}
                  <line x1="340" y1="30" x2="340" y2="410" stroke="#1F6FEB" strokeWidth="0.8" strokeDasharray="6 3 1 3" />
                  <circle cx="340" cy="22" r="9" fill="#081729" stroke="#1F6FEB" strokeWidth="1" />
                  <text x="340" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">C</text>

                  {/* Grid D */}
                  <line x1="460" y1="30" x2="460" y2="410" stroke="#1F6FEB" strokeWidth="0.8" strokeDasharray="6 3 1 3" />
                  <circle cx="460" cy="22" r="9" fill="#081729" stroke="#1F6FEB" strokeWidth="1" />
                  <text x="460" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">D</text>

                  {/* Grid E */}
                  <line x1="550" y1="30" x2="550" y2="410" stroke="#1F6FEB" strokeWidth="0.8" strokeDasharray="6 3 1 3" />
                  <circle cx="550" cy="22" r="9" fill="#081729" stroke="#1F6FEB" strokeWidth="1" />
                  <text x="550" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">E</text>
                </g>
              )}

              {/* Ground & Datum Line (Always visible) */}
              <line x1="20" y1="360" x2="620" y2="360" stroke="#C8A24A" strokeWidth="2" strokeDasharray="8 4" />
              <text x="28" y="352" fill="#C8A24A" fontSize="9" fontWeight="bold" fontFamily="monospace">GROUND DATUM ±0.00m</text>
              <text x="490" y="352" fill="#758B9E" fontSize="9" fontFamily="monospace">NATURAL GROUND LEVEL</text>

              {/* STAGE 1: Geotechnical Soil Stratum, Beacons, Excavation */}
              {activeStage >= 1 && (
                <g className="transition-opacity duration-300">
                  {/* Excavation Pit & Strata */}
                  <rect x="70" y="360" width="510" height="45" fill="rgba(43, 69, 96, 0.35)" stroke="#1F6FEB" strokeWidth="1.2" />
                  <line x1="70" y1="405" x2="580" y2="405" stroke="#1F6FEB" strokeWidth="1.8" strokeDasharray="4 2" />
                  <text x="75" y="420" fill="#1F6FEB" fontSize="9" fontFamily="monospace">BEDROCK FORMATION LEVEL -2.20m</text>
                  
                  {/* Land survey beacons */}
                  <g>
                    <line x1="60" y1="325" x2="60" y2="360" stroke="#FF6B2C" strokeWidth="1.5" />
                    <circle cx="60" cy="360" r="4.5" fill="#FF6B2C" />
                    <text x="45" y="320" fill="#FF6B2C" fontSize="8" fontWeight="bold" fontFamily="monospace">BEACON B1</text>

                    <line x1="590" y1="325" x2="590" y2="360" stroke="#FF6B2C" strokeWidth="1.5" />
                    <circle cx="590" cy="360" r="4.5" fill="#FF6B2C" />
                    <text x="565" y="320" fill="#FF6B2C" fontSize="8" fontWeight="bold" fontFamily="monospace">BEACON B2</text>
                  </g>
                </g>
              )}

              {/* STAGE 2: Reinforced Strip Footing & Ground Plinth Beam */}
              {activeStage >= 2 && (
                <g className="transition-opacity duration-300">
                  {/* Footing Pads with Concrete Hatching */}
                  <rect x="80" y="385" width="40" height="20" fill={showHatching ? "url(#concreteHatch)" : "rgba(30,158,106,0.2)"} stroke="#1E9E6A" strokeWidth="1.5" />
                  <rect x="200" y="385" width="40" height="20" fill={showHatching ? "url(#concreteHatch)" : "rgba(30,158,106,0.2)"} stroke="#1E9E6A" strokeWidth="1.5" />
                  <rect x="320" y="385" width="40" height="20" fill={showHatching ? "url(#concreteHatch)" : "rgba(30,158,106,0.2)"} stroke="#1E9E6A" strokeWidth="1.5" />
                  <rect x="440" y="385" width="40" height="20" fill={showHatching ? "url(#concreteHatch)" : "rgba(30,158,106,0.2)"} stroke="#1E9E6A" strokeWidth="1.5" />
                  <rect x="530" y="385" width="40" height="20" fill={showHatching ? "url(#concreteHatch)" : "rgba(30,158,106,0.2)"} stroke="#1E9E6A" strokeWidth="1.5" />

                  {/* Ground Plinth Beam DPC */}
                  <rect x="75" y="345" width="500" height="15" fill={showHatching ? "url(#concreteHatch)" : "rgba(31,111,235,0.4)"} stroke="#1F6FEB" strokeWidth="1.5" />
                  <line x1="75" y1="345" x2="575" y2="345" stroke="#C8A24A" strokeWidth="1.5" />
                  <text x="210" y="356" fill="#C8A24A" fontSize="8" fontWeight="bold" fontFamily="monospace">DPC PLINTH BEAM +0.30m (CLASS 25)</text>
                </g>
              )}

              {/* STAGE 3: Structural RC Columns & First Floor Suspended Slab */}
              {activeStage >= 3 && (
                <g className="transition-opacity duration-300">
                  {/* Structural Columns Ground Floor */}
                  <rect x="92" y="240" width="16" height="105" fill="#132B45" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="212" y="240" width="16" height="105" fill="#132B45" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="332" y="240" width="16" height="105" fill="#132B45" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="452" y="240" width="16" height="105" fill="#132B45" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="542" y="240" width="16" height="105" fill="#132B45" stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Rebar cross tie markers */}
                  <circle cx="100" cy="290" r="2" fill="#FF6B2C" />
                  <circle cx="220" cy="290" r="2" fill="#FF6B2C" />
                  <circle cx="340" cy="290" r="2" fill="#FF6B2C" />
                  <circle cx="460" cy="290" r="2" fill="#FF6B2C" />

                  {/* First Floor Suspended Slab 150mm */}
                  <rect x="75" y="225" width="500" height="15" fill={showHatching ? "url(#concreteHatch)" : "rgba(200,162,74,0.3)"} stroke="#C8A24A" strokeWidth="1.5" />
                  <text x="220" y="236" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">SUSPENDED RC SLAB +3.40m (BS 8110)</text>
                </g>
              )}

              {/* STAGE 4: Level 2 Columns, Walling & Roof Structure */}
              {activeStage >= 4 && (
                <g className="transition-opacity duration-300">
                  {/* Upper columns */}
                  <rect x="92" y="135" width="16" height="90" fill="#132B45" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="212" y="135" width="16" height="90" fill="#132B45" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="332" y="135" width="16" height="90" fill="#132B45" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="452" y="135" width="16" height="90" fill="#132B45" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="542" y="135" width="16" height="90" fill="#132B45" stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Stone Masonry Infill with Hatching */}
                  {showHatching && (
                    <>
                      <rect x="108" y="240" width="104" height="105" fill="url(#masonryHatch)" />
                      <rect x="228" y="240" width="104" height="105" fill="url(#masonryHatch)" />
                      <rect x="348" y="240" width="104" height="105" fill="url(#masonryHatch)" />
                      <rect x="468" y="240" width="74" height="105" fill="url(#masonryHatch)" />
                      
                      {/* Upper walls */}
                      <rect x="108" y="135" width="104" height="90" fill="url(#masonryHatch)" />
                      <rect x="228" y="135" width="104" height="90" fill="url(#masonryHatch)" />
                      <rect x="348" y="135" width="104" height="90" fill="url(#masonryHatch)" />
                      <rect x="468" y="135" width="74" height="90" fill="url(#masonryHatch)" />
                    </>
                  )}

                  {/* Roof Trusses (Engineered Modern Pitched & Overhang) */}
                  <polygon points="60,135 340,45 590,135" fill="rgba(31, 111, 235, 0.18)" stroke="#1F6FEB" strokeWidth="2" />
                  <line x1="340" y1="45" x2="340" y2="135" stroke="#1F6FEB" strokeWidth="1.5" />
                  <line x1="200" y1="90" x2="200" y2="135" stroke="#1F6FEB" strokeWidth="1.2" />
                  <line x1="460" y1="90" x2="460" y2="135" stroke="#1F6FEB" strokeWidth="1.2" />
                  
                  {/* Roof pitch callout */}
                  <text x="350" y="42" fill="#1F6FEB" fontSize="9" fontWeight="bold" fontFamily="monospace">ROOF APEX +8.20m (PITCH 22°)</text>
                </g>
              )}

              {/* STAGE 5: Complete Architectural Finishes, Balcony, Windows, Solar PV */}
              {activeStage >= 5 && (
                <g className="transition-opacity duration-300">
                  {/* Ground Glazed Veranda Curtain Wall */}
                  <rect x="120" y="255" width="80" height="90" fill="rgba(31, 111, 235, 0.35)" stroke="#FFFFFF" strokeWidth="1.5" />
                  <line x1="160" y1="255" x2="160" y2="345" stroke="#FFFFFF" strokeWidth="1" />
                  <rect x="360" y="255" width="80" height="90" fill="rgba(31, 111, 235, 0.35)" stroke="#FFFFFF" strokeWidth="1.5" />
                  <line x1="400" y1="255" x2="400" y2="345" stroke="#FFFFFF" strokeWidth="1" />

                  {/* Level 1 Balcony & Modern Glass Railing */}
                  <rect x="120" y="150" width="80" height="75" fill="rgba(31, 111, 235, 0.3)" stroke="#FFFFFF" strokeWidth="1.2" />
                  <rect x="360" y="150" width="80" height="75" fill="rgba(31, 111, 235, 0.3)" stroke="#FFFFFF" strokeWidth="1.2" />
                  <line x1="75" y1="210" x2="575" y2="210" stroke="#C8A24A" strokeWidth="1.8" />
                  <line x1="75" y1="225" x2="75" y2="210" stroke="#C8A24A" strokeWidth="1.5" />
                  <line x1="575" y1="225" x2="575" y2="210" stroke="#C8A24A" strokeWidth="1.5" />

                  {/* Rooftop Solar PV System */}
                  <polygon points="210,95 320,55 350,62 240,102" fill="#FF6B2C" opacity="0.85" stroke="#FFA372" strokeWidth="0.8" />
                  <polygon points="350,62 460,95 430,102 320,70" fill="#FF6B2C" opacity="0.85" stroke="#FFA372" strokeWidth="0.8" />
                  <text x="250" y="118" fill="#FF6B2C" fontSize="8" fontWeight="bold" fontFamily="monospace">10kW HYBRID SOLAR PV ARRAY</text>

                  {/* Grand Entrance Portico Pivot Door */}
                  <rect x="235" y="270" width="70" height="75" fill="rgba(200, 162, 74, 0.25)" stroke="#C8A24A" strokeWidth="1.8" />
                  <circle cx="295" cy="308" r="3" fill="#C8A24A" />
                  <text x="240" y="360" fill="#C8A24A" fontSize="7" fontWeight="bold" fontFamily="monospace">2.4m PIVOT DOOR</text>
                </g>
              )}

              {/* Dimension Chains on Left & Bottom */}
              {showDimensions && (
                <g className="text-[#C8A24A] font-mono text-[8px]">
                  {/* Left elevation level marks */}
                  <line x1="45" y1="360" x2="35" y2="360" stroke="#C8A24A" strokeWidth="1" />
                  <text x="5" y="363" fill="#C8A24A">±0.00</text>

                  <line x1="45" y1="225" x2="35" y2="225" stroke="#C8A24A" strokeWidth="1" />
                  <text x="5" y="228" fill="#C8A24A">+3.40</text>

                  <line x1="45" y1="135" x2="35" y2="135" stroke="#C8A24A" strokeWidth="1" />
                  <text x="5" y="138" fill="#C8A24A">+6.80</text>

                  <line x1="45" y1="45" x2="35" y2="45" stroke="#C8A24A" strokeWidth="1" />
                  <text x="5" y="48" fill="#C8A24A">+8.20</text>

                  <line x1="40" y1="45" x2="40" y2="360" stroke="#C8A24A" strokeWidth="0.8" />

                  {/* Bottom Width Dimensions */}
                  <line x1="75" y1="440" x2="575" y2="440" stroke="#C8A24A" strokeWidth="0.8" />
                  <line x1="75" y1="435" x2="75" y2="445" stroke="#C8A24A" strokeWidth="1" />
                  <line x1="575" y1="435" x2="575" y2="445" stroke="#C8A24A" strokeWidth="1" />
                  <text x="310" y="452" textAnchor="middle" fill="#C8A24A">TOTAL WIDTH: 14,800 mm</text>
                </g>
              )}

              {/* Title Block (Bottom-Right) */}
              <g transform="translate(430, 390)">
                <rect width="195" height="55" fill="#07131F" stroke="#1F6FEB" strokeWidth="1" />
                <line x1="0" y1="18" x2="195" y2="18" stroke="#1F6FEB" strokeWidth="0.5" />
                <line x1="0" y1="36" x2="195" y2="36" stroke="#1F6FEB" strokeWidth="0.5" />
                <line x1="100" y1="18" x2="100" y2="55" stroke="#1F6FEB" strokeWidth="0.5" />

                <text x="8" y="13" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">FUNDI CAD ENGINE · A102</text>
                <text x="8" y="29" fill="#C8A24A" fontSize="7" fontFamily="monospace">SCALE: 1:100 @ A1</text>
                <text x="108" y="29" fill="#1E9E6A" fontSize="7" fontFamily="monospace">REV: D (APPROVED)</text>
                <text x="8" y="48" fill="#758B9E" fontSize="7" fontFamily="monospace">KAREN PLOT LR 330/512</text>
                <text x="108" y="48" fill="#FFFFFF" fontSize="7" fontFamily="monospace">NCA REGISTERED</text>
              </g>

              {/* Live Cursor Coordinate Tag */}
              {cursorCoord && (
                <g transform="translate(15, 25)">
                  <rect width="115" height="20" rx="4" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="1" opacity="0.9" />
                  <text x="6" y="14" fill="#00E5FF" fontSize="9" fontFamily="monospace">
                    X: {cursorCoord.x}m · Y: {cursorCoord.y}m
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Scrub Slider */}
          <div className="w-full mt-4 pt-4 border-t border-[#2B4560]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#D9DEE3]/70 font-mono">Stage Progress:</span>
              <span className="text-xs font-mono font-bold text-[#C8A24A]">
                {activeStage} of 5 Completed
              </span>
            </div>

            <input 
              type="range" 
              min="1" 
              max="5" 
              value={activeStage} 
              onChange={(e) => setActiveStage(Number(e.target.value))}
              className="w-full sm:w-64 accent-[#C8A24A] cursor-pointer"
            />

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveStage(s)}
                  className={`w-6 h-6 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeStage === s
                      ? 'bg-[#C8A24A] text-[#0B1B2B]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
