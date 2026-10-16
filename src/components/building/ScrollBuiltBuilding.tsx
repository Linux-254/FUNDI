import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Hammer, 
  CheckCircle, 
  Lock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ScrollBuiltBuilding: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(3); // Default to superstructure in progress

  const stages = [
    {
      id: 1,
      acronymLetter: 'F',
      title: 'Find & Survey',
      subtitle: 'Plot Perimeter & Geotechnical Baseline',
      description: 'Find licensed BORAQS architects, EBK structural engineers, and verified NCA contractors. Survey beacons are pinned and ground soil boreholes certified.',
      icon: <Compass className="w-4 h-4 text-[#C8A24A]" />
    },
    {
      id: 2,
      acronymLetter: 'U',
      title: 'Unite Team & Approvals',
      subtitle: 'NCA, County & NEMA Permits In Hand',
      description: 'All stakeholders united in a single workspace. Nairobi County building approvals, NEMA EIA licences, and 0.5% NCA levy clearance verified before a single shovel moves.',
      icon: <Layers className="w-4 h-4 text-[#1F6FEB]" />
    },
    {
      id: 3,
      acronymLetter: 'N',
      title: 'Negotiate & Substructure',
      subtitle: 'Load-Bearing Bedrock & DPC Concrete',
      description: 'Negotiate competitive BoQ bids in the open. Basalt bedrock excavation, high-tensile D16 rebar cage and certified Class 25 concrete cast.',
      icon: <Hammer className="w-4 h-4 text-[#FF6B2C]" />
    },
    {
      id: 4,
      acronymLetter: 'D',
      title: 'Deliver With Proof',
      subtitle: 'Superstructure Slabs & Engineered Roof',
      description: 'Deliver stage by stage with geotagged photographic proof, cube crushing strength reports, and independent QS sign-offs before review.',
      icon: <CheckCircle className="w-4 h-4 text-[#1E9E6A]" />
    },
    {
      id: 5,
      acronymLetter: 'I',
      title: 'Ironclad Escrow',
      subtitle: 'Completed Villa, Zero Overrun, Verified Payouts',
      description: 'Money moves only when work is proven. Contractor payouts, daily fundi M-Pesa wages, and 5% retention holdback executed smoothly without dispute.',
      icon: <Lock className="w-4 h-4 text-[#C8A24A]" />
    }
  ];

  return (
    <div className="bg-[#0B1B2B] text-white rounded-3xl p-6 sm:p-10 border border-[#2B4560]/50 shadow-2xl overflow-hidden relative">
      {/* Background blueprint grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#1F6FEB 1px, transparent 1px), linear-gradient(90deg, #1F6FEB 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: FUNDI Stage Navigator & Explainer */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6FEB]/20 border border-[#1F6FEB]/40 text-[#1F6FEB] text-xs font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24A]" />
              <span>THE FIVE FUNDI PROMISES</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mt-3">
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
        <div className="lg:col-span-7 bg-[#07131F] rounded-2xl p-6 sm:p-8 border border-[#2B4560]/70 flex flex-col items-center justify-center relative min-h-[380px]">
          
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#D9DEE3]/50 mb-2">
            <span>ELEVATION DRAWING: STAGE {activeStage} OF 5</span>
            <span className="text-[#C8A24A]">SCALE 1:100</span>
          </div>

          {/* Architectural SVG Drawing */}
          <div className="w-full max-w-lg aspect-4/3 relative flex items-center justify-center">
            <svg 
              viewBox="0 0 600 450" 
              className="w-full h-full drop-shadow-md select-none"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid backdrop */}
              <defs>
                <pattern id="svgGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(31, 111, 235, 0.15)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="600" height="450" fill="url(#svgGrid)" />

              {/* Ground & Datum Line (Always visible) */}
              <line x1="40" y1="360" x2="560" y2="360" stroke="#C8A24A" strokeWidth="2.5" strokeDasharray="6 3" />
              <text x="50" y="380" fill="#C8A24A" fontSize="10" fontFamily="IBM Plex Mono">GROUND DATUM ±0.00m</text>
              <text x="440" y="380" fill="#2B4560" fontSize="10" fontFamily="IBM Plex Mono">KAREN PLOT LR 330/512</text>

              {/* STAGE 1: Ground Beacons, Excavation Trenches, Soil Test Pit */}
              {activeStage >= 1 && (
                <g className="transition-opacity duration-500">
                  {/* Excavation Pit */}
                  <rect x="80" y="360" width="440" height="40" fill="rgba(43, 69, 96, 0.3)" stroke="#1F6FEB" strokeWidth="1.5" />
                  <line x1="80" y1="400" x2="520" y2="400" stroke="#1F6FEB" strokeWidth="2" />
                  <text x="210" y="385" fill="#1F6FEB" fontSize="10" fontFamily="IBM Plex Mono">BEDROCK LEVEL -2.20m</text>
                  
                  {/* Land survey beacons */}
                  <circle cx="70" cy="360" r="5" fill="#FF6B2C" />
                  <line x1="70" y1="330" x2="70" y2="360" stroke="#FF6B2C" strokeWidth="1.5" />
                  <circle cx="530" cy="360" r="5" fill="#FF6B2C" />
                  <line x1="530" y1="330" x2="530" y2="360" stroke="#FF6B2C" strokeWidth="1.5" />
                  <text x="55" y="325" fill="#FF6B2C" fontSize="9" fontFamily="IBM Plex Mono">BEACON A</text>
                  <text x="515" y="325" fill="#FF6B2C" fontSize="9" fontFamily="IBM Plex Mono">BEACON B</text>
                </g>
              )}

              {/* STAGE 2: Concrete Strip Footing & Ground Plinth Beam */}
              {activeStage >= 2 && (
                <g className="transition-opacity duration-500">
                  {/* Foundation Footing Pads */}
                  <rect x="100" y="375" width="80" height="20" fill="rgba(30, 158, 106, 0.25)" stroke="#1E9E6A" strokeWidth="1.5" />
                  <rect x="260" y="375" width="80" height="20" fill="rgba(30, 158, 106, 0.25)" stroke="#1E9E6A" strokeWidth="1.5" />
                  <rect x="420" y="375" width="80" height="20" fill="rgba(30, 158, 106, 0.25)" stroke="#1E9E6A" strokeWidth="1.5" />

                  {/* Ground Plinth Beam */}
                  <rect x="90" y="345" width="420" height="15" fill="rgba(31, 111, 235, 0.4)" stroke="#1F6FEB" strokeWidth="1.5" />
                  <text x="230" y="356" fill="#FFFFFF" fontSize="9" fontFamily="IBM Plex Mono">PLINTH BEAM DPC +0.30m</text>
                </g>
              )}

              {/* STAGE 3: Columns, Suspended Slab & First Floor Frame */}
              {activeStage >= 3 && (
                <g className="transition-opacity duration-500">
                  {/* Columns */}
                  <rect x="130" y="240" width="20" height="105" fill="rgba(255, 255, 255, 0.15)" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="290" y="240" width="20" height="105" fill="rgba(255, 255, 255, 0.15)" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="450" y="240" width="20" height="105" fill="rgba(255, 255, 255, 0.15)" stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* First Floor Suspended Slab */}
                  <rect x="110" y="225" width="380" height="15" fill="rgba(200, 162, 74, 0.3)" stroke="#C8A24A" strokeWidth="1.5" />
                  <text x="240" y="236" fill="#C8A24A" fontSize="9" fontFamily="IBM Plex Mono">SUSPENDED SLAB +3.40m</text>
                </g>
              )}

              {/* STAGE 4: Level 2 Columns, Walling & Roof Trusses */}
              {activeStage >= 4 && (
                <g className="transition-opacity duration-500">
                  {/* Upper columns & walls */}
                  <rect x="130" y="140" width="20" height="85" fill="rgba(255, 255, 255, 0.15)" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="290" y="140" width="20" height="85" fill="rgba(255, 255, 255, 0.15)" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect x="450" y="140" width="20" height="85" fill="rgba(255, 255, 255, 0.15)" stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Stone Walling Hatching */}
                  <rect x="150" y="240" width="140" height="105" fill="rgba(43, 69, 96, 0.2)" stroke="#2B4560" strokeWidth="1" />
                  <rect x="310" y="240" width="140" height="105" fill="rgba(43, 69, 96, 0.2)" stroke="#2B4560" strokeWidth="1" />
                  <rect x="150" y="140" width="140" height="85" fill="rgba(43, 69, 96, 0.2)" stroke="#2B4560" strokeWidth="1" />
                  <rect x="310" y="140" width="140" height="85" fill="rgba(43, 69, 96, 0.2)" stroke="#2B4560" strokeWidth="1" />

                  {/* Roof Trusses (Triangular Gable / Modern Pitched) */}
                  <polygon points="100,140 300,50 500,140" fill="rgba(31, 111, 235, 0.2)" stroke="#1F6FEB" strokeWidth="2" />
                  <line x1="300" y1="50" x2="300" y2="140" stroke="#1F6FEB" strokeWidth="1.5" />
                  <line x1="200" y1="95" x2="200" y2="140" stroke="#1F6FEB" strokeWidth="1" />
                  <line x1="400" y1="95" x2="400" y2="140" stroke="#1F6FEB" strokeWidth="1" />
                  <text x="250" y="40" fill="#1F6FEB" fontSize="10" fontFamily="IBM Plex Mono">ROOF RIDGE +7.20m</text>
                </g>
              )}

              {/* STAGE 5: Completed Luxury Tropical Villa Finishes, Solar, Windows */}
              {activeStage >= 5 && (
                <g className="transition-opacity duration-500">
                  {/* Large Glazed Veranda Windows */}
                  <rect x="170" y="260" width="100" height="75" fill="rgba(31, 111, 235, 0.4)" stroke="#FFFFFF" strokeWidth="1.5" />
                  <line x1="220" y1="260" x2="220" y2="335" stroke="#FFFFFF" strokeWidth="1" />
                  <rect x="330" y="260" width="100" height="75" fill="rgba(31, 111, 235, 0.4)" stroke="#FFFFFF" strokeWidth="1.5" />
                  <line x1="380" y1="260" x2="380" y2="335" stroke="#FFFFFF" strokeWidth="1" />

                  {/* Upper Windows & Balcony Railing */}
                  <rect x="170" y="155" width="90" height="60" fill="rgba(31, 111, 235, 0.3)" stroke="#FFFFFF" strokeWidth="1" />
                  <rect x="330" y="155" width="90" height="60" fill="rgba(31, 111, 235, 0.3)" stroke="#FFFFFF" strokeWidth="1" />
                  <line x1="110" y1="210" x2="490" y2="210" stroke="#C8A24A" strokeWidth="1.5" />

                  {/* Rooftop Solar PV Panels */}
                  <polygon points="210,95 290,60 310,65 230,100" fill="#FF6B2C" opacity="0.8" />
                  <polygon points="310,60 390,95 370,100 290,65" fill="#FF6B2C" opacity="0.8" />
                  <text x="250" y="115" fill="#FF6B2C" fontSize="9" fontFamily="IBM Plex Mono">SOLAR PV & HOT WATER</text>

                  {/* Entrance canopy */}
                  <rect x="270" y="325" width="60" height="35" fill="rgba(200, 162, 74, 0.3)" stroke="#C8A24A" strokeWidth="1.5" />
                  <circle cx="300" cy="342" r="3" fill="#C8A24A" />
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Scrub Slider */}
          <div className="w-full mt-4 pt-4 border-t border-[#2B4560]/40 flex items-center justify-between gap-4">
            <span className="text-xs text-[#D9DEE3]/70 font-mono">Stage Progress:</span>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={activeStage} 
              onChange={(e) => setActiveStage(Number(e.target.value))}
              className="flex-1 accent-[#C8A24A] cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-[#C8A24A] shrink-0">
              {activeStage}/5 Complete
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
