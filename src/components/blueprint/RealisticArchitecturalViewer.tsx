import React, { useState } from 'react';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Eye, 
  EyeOff, 
  Download, 
  Printer, 
  ShieldCheck, 
  Ruler, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Compass,
  FileCheck,
  Building,
  Hammer,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';

export type BlueprintViewMode = 
  | 'foundation'
  | 'framing'
  | 'section'
  | 'mep'
  | 'rebar';

interface RealisticArchitecturalViewerProps {
  currency: 'KES' | 'USD';
  onLinkMilestone?: (milestoneId: string) => void;
  onOpenAiRenderModal?: () => void;
}

export const RealisticArchitecturalViewer: React.FC<RealisticArchitecturalViewerProps> = ({
  currency,
  onLinkMilestone,
  onOpenAiRenderModal
}) => {
  const [activeView, setActiveView] = useState<BlueprintViewMode>('framing');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<any | null>({
    id: 'C1-COL-B2',
    name: 'Reinforced Column C1 (Grid B-2)',
    category: 'Structural Concrete',
    dimensions: '200mm × 200mm × 2800mm',
    mix: 'Class 25/20 Concrete (1:1.5:3)',
    reinforcement: '4Y16 High Yield Main Bars, R8 Stirrups @ 150mm c/c',
    code: 'BS 8110-1:1997 / Eurocode 2 (EN 1992-1-1)',
    milestoneId: 'ms-frame',
    milestoneName: 'Milestone 3: Ground Floor Superstructure Frame',
    costKes: 185000,
    status: 'Verified by Structural Engineer',
    inspectionNotes: 'Formwork plumbness checked. Rebar cover blocks (25mm) confirmed in place prior to casting.'
  });

  // Layer Toggles
  const [layers, setLayers] = useState({
    gridlines: true,
    dimensions: true,
    rebarSpecs: true,
    concreteFills: true,
    mepRuns: true,
    escrowHeatmap: false,
    inspections: true
  });

  const [activeMeasurement, setActiveMeasurement] = useState<string | null>(null);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.7), 2.2));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  return (
    <div className="bg-[#0B1B2B] text-white rounded-2xl border border-[#2B4560]/40 shadow-2xl overflow-hidden flex flex-col">
      {/* Top Architectural Toolbar */}
      <div className="bg-[#07131F] border-b border-[#2B4560]/60 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1F6FEB]/20 border border-[#1F6FEB]/40 flex items-center justify-center text-[#1F6FEB]">
            <Compass className="w-5 h-5 text-[#C8A24A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C8A24A]">
                CAD / BIM STUDIO · LOD 350
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1E9E6A]/20 text-[#1E9E6A] font-mono font-semibold">
                NCA ARCHITECTURAL SPEC
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-display text-white">
              Karen Eco-Villa Structural Engineering Plans
            </h2>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#0B1B2B] p-1 rounded-xl border border-[#2B4560]/50 max-w-full overflow-x-auto scrollbar-none text-xs shrink-0">
          <button
            onClick={() => setActiveView('foundation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'foundation'
                ? 'bg-[#1F6FEB] text-white font-semibold shadow-xs'
                : 'text-[#D9DEE3]/70 hover:text-white'
            }`}
          >
            1. Foundation & Footings
          </button>
          <button
            onClick={() => setActiveView('framing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'framing'
                ? 'bg-[#1F6FEB] text-white font-semibold shadow-xs'
                : 'text-[#D9DEE3]/70 hover:text-white'
            }`}
          >
            2. Ground Framing (RC Beams)
          </button>
          <button
            onClick={() => setActiveView('section')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'section'
                ? 'bg-[#1F6FEB] text-white font-semibold shadow-xs'
                : 'text-[#D9DEE3]/70 hover:text-white'
            }`}
          >
            3. Elevation Section A-A
          </button>
          <button
            onClick={() => setActiveView('mep')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'mep'
                ? 'bg-[#1F6FEB] text-white font-semibold shadow-xs'
                : 'text-[#D9DEE3]/70 hover:text-white'
            }`}
          >
            4. MEP Plumbing & Conduits
          </button>
          <button
            onClick={() => setActiveView('rebar')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'rebar'
                ? 'bg-[#1F6FEB] text-white font-semibold shadow-xs'
                : 'text-[#D9DEE3]/70 hover:text-white'
            }`}
          >
            5. Bar Bending Schedule
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0B1B2B] rounded-lg border border-[#2B4560]/40 p-1">
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-2 text-[#C8A24A]">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.15)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {onOpenAiRenderModal && (
            <button
              onClick={onOpenAiRenderModal}
              className="px-3 py-1.5 text-xs bg-gradient-to-r from-[#1F6FEB] to-[#C8A24A] hover:opacity-95 text-white font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Generate AI-rendered 3D views for this floor plan"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>AI Render (3D)</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs bg-[#1F6FEB]/20 hover:bg-[#1F6FEB]/30 border border-[#1F6FEB]/40 text-[#1F6FEB] rounded-lg flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Drawing</span>
          </button>
        </div>
      </div>

      {/* Main Drawing Canvas & Inspector Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[580px] w-full min-w-0">
        
        {/* Architectural Canvas Area (8 Cols) */}
        <div className="xl:col-span-8 min-w-0 bg-[#06121E] p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between select-none">
          
          {/* Blueprint Grid Background Pattern */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(31, 111, 235, 0.12) 1px, transparent 1px),
                linear-gradient(90deg, rgba(31, 111, 235, 0.12) 1px, transparent 1px),
                linear-gradient(rgba(31, 111, 235, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(31, 111, 235, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px'
            }}
          />

          {/* Canvas Floating Layer Controls */}
          <div className="relative z-20 flex flex-wrap items-center gap-2 mb-3 bg-[#0B1B2B]/90 backdrop-blur-md p-2 rounded-xl border border-[#2B4560]/60 w-fit text-xs">
            <span className="text-[10px] font-mono uppercase text-[#C8A24A] font-bold px-1 flex items-center gap-1">
              <Layers className="w-3 h-3" /> LAYERS:
            </span>
            <button
              onClick={() => toggleLayer('gridlines')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                layers.gridlines ? 'bg-[#1F6FEB]/30 text-[#1F6FEB] border border-[#1F6FEB]/50' : 'text-gray-400 opacity-60'
              }`}
            >
              Grids A-D / 1-4
            </button>
            <button
              onClick={() => toggleLayer('dimensions')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                layers.dimensions ? 'bg-[#1F6FEB]/30 text-[#1F6FEB] border border-[#1F6FEB]/50' : 'text-gray-400 opacity-60'
              }`}
            >
              Dimensions (mm)
            </button>
            <button
              onClick={() => toggleLayer('rebarSpecs')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                layers.rebarSpecs ? 'bg-[#C8A24A]/30 text-[#C8A24A] border border-[#C8A24A]/50' : 'text-gray-400 opacity-60'
              }`}
            >
              Rebar Marks
            </button>
            <button
              onClick={() => toggleLayer('mepRuns')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                layers.mepRuns ? 'bg-[#1E9E6A]/30 text-[#1E9E6A] border border-[#1E9E6A]/50' : 'text-gray-400 opacity-60'
              }`}
            >
              MEP Conduits
            </button>
            <button
              onClick={() => toggleLayer('escrowHeatmap')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                layers.escrowHeatmap ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'text-gray-400 opacity-60'
              }`}
            >
              Escrow Funding Status
            </button>
          </div>

          {/* Interactive SVG CAD Blueprint Vector Drawing */}
          <div 
            className="relative z-10 w-full flex-1 flex items-center justify-center p-2 transition-transform duration-150"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              viewBox="0 0 850 560"
              className="w-full max-h-[460px] drop-shadow-md overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Concrete Hatch Pattern */}
                <pattern id="concreteHatch" width="12" height="12" patternUnits="userSpaceOnUse">
                  <path d="M0 12L12 0M3 15L15 3M-3 9L9 -3" stroke="#2B4560" strokeWidth="0.75" opacity="0.35" />
                  <circle cx="6" cy="6" r="0.75" fill="#1F6FEB" opacity="0.4" />
                </pattern>
                
                {/* Rebar Dashed Marker */}
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#C8A24A" />
                </marker>
                
                <marker id="cadTick" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                  <line x1="1" y1="9" x2="9" y2="1" stroke="#1F6FEB" strokeWidth="1.5" />
                </marker>
              </defs>

              {/* VIEW 1 & 2: GROUND FRAMING PLAN & COLUMNS */}
              {(activeView === 'framing' || activeView === 'foundation') && (
                <g id="structural-framing-plan">
                  {/* Outer Building Footprint Slab */}
                  <rect
                    x="120"
                    y="100"
                    width="600"
                    height="360"
                    fill="url(#concreteHatch)"
                    stroke="#1F6FEB"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:stroke-[#C8A24A] transition-colors"
                    onClick={() => setSelectedElement({
                      id: 'SLAB-GF-01',
                      name: 'Ground Floor Solid Slab (150mm)',
                      category: 'Suspended Concrete Slab',
                      dimensions: '18.0m × 10.8m × 150mm',
                      mix: 'Grade 25/20 Concrete with Sika 1 Waterproofing additive',
                      reinforcement: 'BRC A142 Fabric Mesh with bottom Y10 @ 200 c/c each way',
                      code: 'BS 8110 Cl. 3.5 & Kenya NBC 2024',
                      milestoneId: 'ms-frame',
                      milestoneName: 'Milestone 3: Ground Floor Superstructure Frame',
                      costKes: 890000,
                      status: 'Verified by Registered Engineer',
                      inspectionNotes: 'Slump test 75mm recorded. Compressive cube tests sampled at 7 and 28 days.'
                    })}
                  />

                  {/* Primary Ground Beams (TB-1, TB-2) */}
                  {/* Horizontal Primary Beams */}
                  <line x1="120" y1="100" x2="720" y2="100" stroke="#1F6FEB" strokeWidth="6" />
                  <line x1="120" y1="280" x2="720" y2="280" stroke="#1F6FEB" strokeWidth="6" />
                  <line x1="120" y1="460" x2="720" y2="460" stroke="#1F6FEB" strokeWidth="6" />

                  {/* Vertical Primary Beams */}
                  <line x1="120" y1="100" x2="120" y2="460" stroke="#1F6FEB" strokeWidth="6" />
                  <line x1="320" y1="100" x2="320" y2="460" stroke="#1F6FEB" strokeWidth="6" />
                  <line x1="520" y1="100" x2="520" y2="460" stroke="#1F6FEB" strokeWidth="6" />
                  <line x1="720" y1="100" x2="720" y2="460" stroke="#1F6FEB" strokeWidth="6" />

                  {/* Secondary Stiffener Beams */}
                  <line x1="320" y1="190" x2="520" y2="190" stroke="#1F6FEB" strokeWidth="3" strokeDasharray="4 2" />
                  <line x1="520" y1="370" x2="720" y2="370" stroke="#1F6FEB" strokeWidth="3" strokeDasharray="4 2" />

                  {/* Foundation Footing Pads (if in foundation mode) */}
                  {activeView === 'foundation' && (
                    <g id="footing-pads" opacity="0.85">
                      {[120, 320, 520, 720].flatMap(x => [100, 280, 460].map(y => (
                        <rect
                          key={`pad-${x}-${y}`}
                          x={x - 25}
                          y={y - 25}
                          width="50"
                          height="50"
                          fill="none"
                          stroke="#C8A24A"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )))}
                    </g>
                  )}

                  {/* RC Columns (C1 to C12) at Beam Intersections */}
                  {[
                    { id: 'C1', x: 120, y: 100, grid: 'A-1' },
                    { id: 'C2', x: 320, y: 100, grid: 'A-2' },
                    { id: 'C3', x: 520, y: 100, grid: 'A-3' },
                    { id: 'C4', x: 720, y: 100, grid: 'A-4' },
                    { id: 'C5', x: 120, y: 280, grid: 'B-1' },
                    { id: 'C6', x: 320, y: 280, grid: 'B-2', featured: true },
                    { id: 'C7', x: 520, y: 280, grid: 'B-3' },
                    { id: 'C8', x: 720, y: 280, grid: 'B-4' },
                    { id: 'C9', x: 120, y: 460, grid: 'C-1' },
                    { id: 'C10', x: 320, y: 460, grid: 'C-2' },
                    { id: 'C11', x: 520, y: 460, grid: 'C-3' },
                    { id: 'C12', x: 720, y: 460, grid: 'C-4' }
                  ].map(col => {
                    const isSelected = selectedElement?.id === `C1-COL-${col.grid}` || (col.featured && selectedElement?.id?.includes('B-2'));
                    const isHeatmapEscrowFunded = layers.escrowHeatmap;

                    return (
                      <g 
                        key={col.id} 
                        className="cursor-pointer group"
                        onClick={() => setSelectedElement({
                          id: `C1-COL-${col.grid}`,
                          name: `Reinforced Column ${col.id} (Grid ${col.grid})`,
                          category: 'Structural Concrete',
                          dimensions: '200mm × 200mm × 2800mm',
                          mix: 'Class 25/20 Concrete (1:1.5:3)',
                          reinforcement: '4Y16 High Yield Main Bars, R8 Stirrups @ 150mm c/c',
                          code: 'BS 8110-1:1997 / Eurocode 2',
                          milestoneId: 'ms-frame',
                          milestoneName: 'Milestone 3: Ground Floor Superstructure Frame',
                          costKes: 185000,
                          status: 'Verified by Structural Engineer',
                          inspectionNotes: `Column ${col.id} vertical plumbness tolerance: 2mm (within 5mm limit). Concrete cover 25mm verified.`
                        })}
                      >
                        {/* Column Box */}
                        <rect
                          x={col.x - 12}
                          y={col.y - 12}
                          width="24"
                          height="24"
                          fill={isHeatmapEscrowFunded ? '#1E9E6A' : (isSelected ? '#C8A24A' : '#0B1B2B')}
                          stroke={isSelected ? '#FFFFFF' : '#1F6FEB'}
                          strokeWidth="2"
                        />
                        {/* Cross Hatch in Column */}
                        <line x1={col.x - 12} y1={col.y - 12} x2={col.x + 12} y2={col.y + 12} stroke={isSelected ? '#0B1B2B' : '#1F6FEB'} strokeWidth="1" />
                        <line x1={col.x - 12} y1={col.y + 12} x2={col.x + 12} y2={col.y - 12} stroke={isSelected ? '#0B1B2B' : '#1F6FEB'} strokeWidth="1" />
                        
                        {/* Column Label */}
                        <text
                          x={col.x + 16}
                          y={col.y - 12}
                          fill={isSelected ? '#C8A24A' : '#D9DEE3'}
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {col.id} ({col.grid})
                        </text>
                      </g>
                    );
                  })}

                  {/* Room / Space Annotations */}
                  <text x="220" y="200" fill="#D9DEE3" opacity="0.6" fontSize="13" fontFamily="sans-serif" fontWeight="bold">
                    LIVING LOUNGE
                  </text>
                  <text x="220" y="216" fill="#1F6FEB" opacity="0.8" fontSize="10" fontFamily="monospace">
                    FFL ±0.000 · 6.0m × 5.4m
                  </text>

                  <text x="420" y="200" fill="#D9DEE3" opacity="0.6" fontSize="13" fontFamily="sans-serif" fontWeight="bold">
                    OPEN DINING
                  </text>
                  <text x="420" y="216" fill="#1F6FEB" opacity="0.8" fontSize="10" fontFamily="monospace">
                    FFL ±0.000 · 4.8m × 5.4m
                  </text>

                  <text x="620" y="200" fill="#D9DEE3" opacity="0.6" fontSize="13" fontFamily="sans-serif" fontWeight="bold">
                    CHEF KITCHEN
                  </text>
                  <text x="620" y="216" fill="#1F6FEB" opacity="0.8" fontSize="10" fontFamily="monospace">
                    FFL -0.050 · 3.6m × 5.4m
                  </text>

                  <text x="220" y="380" fill="#D9DEE3" opacity="0.6" fontSize="13" fontFamily="sans-serif" fontWeight="bold">
                    GUEST SUITE
                  </text>
                  <text x="220" y="396" fill="#1F6FEB" opacity="0.8" fontSize="10" fontFamily="monospace">
                    FFL ±0.000 · Ensuite
                  </text>

                  <text x="420" y="380" fill="#D9DEE3" opacity="0.6" fontSize="13" fontFamily="sans-serif" fontWeight="bold">
                    STUDY / LIBRARY
                  </text>

                  <text x="620" y="380" fill="#D9DEE3" opacity="0.6" fontSize="13" fontFamily="sans-serif" fontWeight="bold">
                    VERANDAH PATIO
                  </text>
                </g>
              )}

              {/* VIEW 3: ELEVATION SECTION CUT A-A */}
              {activeView === 'section' && (
                <g id="architectural-elevation-section">
                  {/* Natural Ground Level (NGL) */}
                  <line x1="80" y1="420" x2="760" y2="420" stroke="#758A99" strokeWidth="2" strokeDasharray="6 3" />
                  <text x="90" y="415" fill="#758A99" fontSize="10" fontFamily="monospace">
                    NGL -0.600m
                  </text>

                  {/* Strip & Pad Footings Level */}
                  <rect x="140" y="450" width="80" height="30" fill="url(#concreteHatch)" stroke="#C8A24A" strokeWidth="2" />
                  <rect x="360" y="450" width="80" height="30" fill="url(#concreteHatch)" stroke="#C8A24A" strokeWidth="2" />
                  <rect x="580" y="450" width="80" height="30" fill="url(#concreteHatch)" stroke="#C8A24A" strokeWidth="2" />
                  <line x1="80" y1="480" x2="760" y2="480" stroke="#C8A24A" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="90" y="475" fill="#C8A24A" fontSize="10" fontFamily="monospace">
                    FOUNDATION LEVEL -1.500m
                  </text>

                  {/* Substructure Plinth Columns & Walling */}
                  <rect x="170" y="340" width="20" height="110" fill="#1F6FEB" opacity="0.8" />
                  <rect x="390" y="340" width="20" height="110" fill="#1F6FEB" opacity="0.8" />
                  <rect x="610" y="340" width="20" height="110" fill="#1F6FEB" opacity="0.8" />

                  {/* Ground Oversite Slab */}
                  <rect x="130" y="330" width="540" height="18" fill="url(#concreteHatch)" stroke="#1F6FEB" strokeWidth="2" />
                  <text x="90" y="335" fill="#1E9E6A" fontSize="10" fontFamily="monospace">
                    FFL ±0.000m
                  </text>

                  {/* Superstructure Columns */}
                  <rect x="170" y="200" width="20" height="130" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="2" />
                  <rect x="390" y="200" width="20" height="130" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="2" />
                  <rect x="610" y="200" width="20" height="130" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="2" />

                  {/* Suspended First Floor Slab & Ring Beam */}
                  <rect x="130" y="190" width="540" height="20" fill="url(#concreteHatch)" stroke="#1F6FEB" strokeWidth="2" />
                  <text x="90" y="195" fill="#1F6FEB" fontSize="10" fontFamily="monospace">
                    FIRST FLOOR SLAB +2.850m
                  </text>

                  {/* Upper Superstructure Walling */}
                  <rect x="170" y="90" width="20" height="100" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="2" />
                  <rect x="390" y="90" width="20" height="100" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="2" />
                  <rect x="610" y="90" width="20" height="100" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="2" />

                  {/* Roof Ring Beam */}
                  <rect x="130" y="80" width="540" height="16" fill="url(#concreteHatch)" stroke="#C8A24A" strokeWidth="2" />
                  <text x="90" y="85" fill="#C8A24A" fontSize="10" fontFamily="monospace">
                    ROOF RING BEAM +5.650m
                  </text>

                  {/* Timber Truss & Pitched Box Profile Roof */}
                  <polygon points="120,80 400,15 680,80" fill="none" stroke="#C8A24A" strokeWidth="3" />
                  <line x1="400" y1="15" x2="400" y2="80" stroke="#C8A24A" strokeWidth="2" />
                  <line x1="260" y1="48" x2="260" y2="80" stroke="#C8A24A" strokeWidth="1.5" />
                  <line x1="540" y1="48" x2="540" y2="80" stroke="#C8A24A" strokeWidth="1.5" />
                  <line x1="260" y1="48" x2="400" y2="80" stroke="#C8A24A" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="540" y1="48" x2="400" y2="80" stroke="#C8A24A" strokeWidth="1" strokeDasharray="3 3" />
                  
                  <text x="410" y="25" fill="#C8A24A" fontSize="10" fontFamily="monospace">
                    ROOF APEX +7.800m (PITCH 22.5°)
                  </text>
                </g>
              )}

              {/* VIEW 4: MEP SERVICES OVERLAY */}
              {activeView === 'mep' && (
                <g id="mep-services">
                  {/* Building Ghost Frame */}
                  <rect x="120" y="100" width="600" height="360" fill="none" stroke="#2B4560" strokeWidth="1.5" strokeDasharray="4 4" />
                  
                  {/* Main Electrical Distribution Board (DB-1) */}
                  <rect x="125" y="140" width="24" height="30" fill="#1F6FEB" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="155" y="158" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    3-PHASE MAIN DB (415V 60A)
                  </text>

                  {/* Electrical Conduit Circuit Runs */}
                  <path d="M149 155 H300 V220 H450" fill="none" stroke="#1F6FEB" strokeWidth="2.5" strokeDasharray="6 3" />
                  <circle cx="300" cy="220" r="5" fill="#1F6FEB" />
                  <circle cx="450" cy="220" r="5" fill="#1F6FEB" />
                  <text x="310" y="215" fill="#1F6FEB" fontSize="9" fontFamily="monospace">Radial Ring Socket Line</text>

                  {/* Plumbing: Main Soil Stack & Grey Water Line */}
                  <path d="M680 100 V460" fill="none" stroke="#1E9E6A" strokeWidth="4" />
                  <text x="690" y="130" fill="#1E9E6A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    110mm PVC MAIN SOIL STACK
                  </text>
                  
                  {/* Plumbing: Water Inflow from Overhead 2000L Tank */}
                  <path d="M660 120 H500 V320" fill="none" stroke="#00B4D8" strokeWidth="2.5" />
                  <text x="510" y="315" fill="#00B4D8" fontSize="9" fontFamily="monospace">
                    32mm PPR Potable Cold Water Loop
                  </text>

                  {/* Solar Hot Water Heater Loop */}
                  <path d="M400 120 V250 H340" fill="none" stroke="#E63946" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="350" y="240" fill="#E63946" fontSize="9" fontFamily="monospace">
                    25mm Insulated Solar HW Return
                  </text>
                </g>
              )}

              {/* VIEW 5: BAR BENDING DETAILS (BS 8110 / EUROCODE 2) */}
              {activeView === 'rebar' && (
                <g id="rebar-bending-schedule">
                  {/* Beam Rebar Cross Section */}
                  <rect x="150" y="120" width="225" height="400" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="2" />
                  <text x="160" y="145" fill="#D9DEE3" fontSize="12" fontFamily="monospace" fontWeight="bold">
                    BEAM SECTION TB-1 (225 × 450mm)
                  </text>
                  
                  {/* Stirrup Hook Outline */}
                  <rect x="175" y="160" width="175" height="320" rx="8" fill="none" stroke="#C8A24A" strokeWidth="3" />
                  <text x="185" y="185" fill="#C8A24A" fontSize="10" fontFamily="monospace">
                    R8 Stirrups @ 150mm c/c (Shape Code 20)
                  </text>

                  {/* Top Reinforcement (2Y16) */}
                  <circle cx="195" cy="180" r="8" fill="#1F6FEB" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="330" cy="180" r="8" fill="#1F6FEB" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="215" y="185" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
                    2 × Y16 H.Y. Main Top Bars
                  </text>

                  {/* Bottom Reinforcement (3Y20) */}
                  <circle cx="195" cy="460" r="10" fill="#1E9E6A" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="262" cy="460" r="10" fill="#1E9E6A" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="330" cy="460" r="10" fill="#1E9E6A" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="200" y="445" fill="#1E9E6A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    3 × Y20 Tension Bottom Bars
                  </text>

                  {/* 25mm Concrete Cover Spacers Callout */}
                  <line x1="150" y1="300" x2="175" y2="300" stroke="#E63946" strokeWidth="2" markerEnd="url(#arrow)" />
                  <text x="400" y="305" fill="#E63946" fontSize="11" fontFamily="monospace">
                    ← 25mm Nominal Concrete Cover (Severe Exposure)
                  </text>

                  {/* Kenyan Rebar Standard Notation */}
                  <g transform="translate(420, 140)">
                    <rect x="0" y="0" width="360" height="130" rx="8" fill="#07131F" stroke="#2B4560" strokeWidth="1.5" />
                    <text x="15" y="25" fill="#C8A24A" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      KEBS / BS 4449 COMPLIANT SPECIFICATION
                    </text>
                    <text x="15" y="50" fill="#D9DEE3" fontSize="10" fontFamily="monospace">
                      Yield Strength (fy): 500 N/mm² High Yield Deformed
                    </text>
                    <text x="15" y="70" fill="#D9DEE3" fontSize="10" fontFamily="monospace">
                      Batch Supplier: Apex Steel / Devki KEBS Diamond Mark
                    </text>
                    <text x="15" y="90" fill="#D9DEE3" fontSize="10" fontFamily="monospace">
                      Tensile Test Cert: NCA-QA-2026-9811 (Slump: 75mm)
                    </text>
                    <text x="15" y="110" fill="#1E9E6A" fontSize="10" fontFamily="monospace">
                      Status: Certified by Structural Resident Engineer
                    </text>
                  </g>
                </g>
              )}

              {/* GRIDLINES (A-D, 1-4) OVERLAY */}
              {layers.gridlines && (activeView === 'framing' || activeView === 'foundation') && (
                <g id="structural-gridlines" opacity="0.9">
                  {/* Vertical Grids 1 to 4 */}
                  {[
                    { label: '1', x: 120 },
                    { label: '2', x: 320 },
                    { label: '3', x: 520 },
                    { label: '4', x: 720 }
                  ].map(g => (
                    <g key={`grid-v-${g.label}`}>
                      <line x1={g.x} y1="40" x2={g.x} y2="520" stroke="#1F6FEB" strokeWidth="1" strokeDasharray="6 3 2 3" />
                      {/* Grid Bubble Top */}
                      <circle cx={g.x} cy="30" r="14" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="1.5" />
                      <text x={g.x} y="34" fill="#1F6FEB" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        {g.label}
                      </text>
                      {/* Grid Bubble Bottom */}
                      <circle cx={g.x} cy="530" r="14" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="1.5" />
                      <text x={g.x} y="534" fill="#1F6FEB" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        {g.label}
                      </text>
                    </g>
                  ))}

                  {/* Horizontal Grids A to C */}
                  {[
                    { label: 'A', y: 100 },
                    { label: 'B', y: 280 },
                    { label: 'C', y: 460 }
                  ].map(g => (
                    <g key={`grid-h-${g.label}`}>
                      <line x1="60" y1={g.y} x2="780" y2={g.y} stroke="#1F6FEB" strokeWidth="1" strokeDasharray="6 3 2 3" />
                      {/* Grid Bubble Left */}
                      <circle cx="50" cy={g.y} r="14" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="1.5" />
                      <text x="50" y={g.y + 4} fill="#1F6FEB" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        {g.label}
                      </text>
                      {/* Grid Bubble Right */}
                      <circle cx="790" cy={g.y} r="14" fill="#0B1B2B" stroke="#1F6FEB" strokeWidth="1.5" />
                      <text x="790" y={g.y + 4} fill="#1F6FEB" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        {g.label}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* DIMENSION STRINGS OVERLAY */}
              {layers.dimensions && (activeView === 'framing' || activeView === 'foundation') && (
                <g id="dimension-strings">
                  {/* Top Bay Dimensions: 1-2 (6,000mm), 2-3 (6,000mm), 3-4 (6,000mm) */}
                  <g stroke="#1F6FEB" strokeWidth="1">
                    <line x1="120" y1="65" x2="320" y2="65" markerStart="url(#cadTick)" markerEnd="url(#cadTick)" />
                    <text x="220" y="60" fill="#1F6FEB" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      6,000 mm
                    </text>

                    <line x1="320" y1="65" x2="520" y2="65" markerStart="url(#cadTick)" markerEnd="url(#cadTick)" />
                    <text x="420" y="60" fill="#1F6FEB" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      6,000 mm
                    </text>

                    <line x1="520" y1="65" x2="720" y2="65" markerStart="url(#cadTick)" markerEnd="url(#cadTick)" />
                    <text x="620" y="60" fill="#1F6FEB" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      6,000 mm
                    </text>

                    {/* Overall Length */}
                    <line x1="120" y1="80" x2="720" y2="80" markerStart="url(#cadTick)" markerEnd="url(#cadTick)" stroke="#C8A24A" />
                    <text x="420" y="77" fill="#C8A24A" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      OVERALL LENGTH: 18,000 mm (18.00m)
                    </text>
                  </g>

                  {/* Left Height Dimensions: A-B (5,400mm), B-C (5,400mm) */}
                  <g stroke="#1F6FEB" strokeWidth="1">
                    <line x1="85" y1="100" x2="85" y2="280" markerStart="url(#cadTick)" markerEnd="url(#cadTick)" />
                    <text x="80" y="195" fill="#1F6FEB" fontSize="9" fontFamily="monospace" textAnchor="end">
                      5,400 mm
                    </text>

                    <line x1="85" y1="280" x2="85" y2="460" markerStart="url(#cadTick)" markerEnd="url(#cadTick)" />
                    <text x="80" y="375" fill="#1F6FEB" fontSize="9" fontFamily="monospace" textAnchor="end">
                      5,400 mm
                    </text>

                    {/* Overall Width */}
                    <line x1="70" y1="100" x2="70" y2="460" markerStart="url(#cadTick)" markerEnd="url(#cadTick)" stroke="#C8A24A" />
                    <text x="65" y="285" fill="#C8A24A" fontSize="9" fontFamily="monospace" textAnchor="end" fontWeight="bold">
                      10,800 mm
                    </text>
                  </g>
                </g>
              )}

              {/* ARCHITECTURAL NORTH ARROW & SCALE */}
              <g id="north-arrow" transform="translate(760, 40)">
                <circle cx="20" cy="20" r="18" fill="#0B1B2B" stroke="#C8A24A" strokeWidth="1.5" />
                <polygon points="20,6 25,24 20,20 15,24" fill="#C8A24A" />
                <polygon points="20,6 20,20 15,24" fill="#1F6FEB" />
                <text x="20" y="48" fill="#C8A24A" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  TRUE N
                </text>
              </g>
            </svg>
          </div>

          {/* Bottom CAD Title Block (Formal Kenyan Engineering Spec Sheet) */}
          <div className="relative z-20 mt-4 bg-[#07131F] rounded-xl border border-[#2B4560]/70 p-3 sm:p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono w-full min-w-0">
            <div className="border-b md:border-b-0 md:border-r border-[#2B4560]/40 pb-2.5 md:pb-0 pr-0 md:pr-3 min-w-0">
              <span className="text-[9px] uppercase text-[#C8A24A] font-bold block">
                PROJECT TITLE & LOCATION
              </span>
              <p className="font-bold text-white text-[11px] truncate">
                Karen 4-Bed Residential Eco-Villa
              </p>
              <p className="text-[10px] text-[#D9DEE3]/70 truncate">
                Plot L.R. No. 11914/8, Karen Road, Nairobi
              </p>
            </div>

            <div className="border-b md:border-b-0 md:border-r border-[#2B4560]/40 pb-2.5 md:pb-0 pr-0 md:pr-3 min-w-0">
              <span className="text-[9px] uppercase text-[#1F6FEB] font-bold block">
                STATUTORY REGISTRATIONS
              </span>
              <p className="text-[10px] text-white">
                NCA Reg: <span className="text-[#C8A24A]">NCA-PR/2026/0491</span>
              </p>
              <p className="text-[10px] text-white">
                County Approval: <span className="text-[#1E9E6A]">NCC/PL/2026/894</span>
              </p>
            </div>

            <div className="border-b md:border-b-0 md:border-r border-[#2B4560]/40 pb-2.5 md:pb-0 pr-0 md:pr-3 min-w-0">
              <span className="text-[9px] uppercase text-[#1E9E6A] font-bold block">
                DRAWING NUMBER & SCALE
              </span>
              <p className="text-[11px] font-bold text-white">
                DWG: STR-03-REV-C · 1:50 @ A1
              </p>
              <p className="text-[9px] text-[#D9DEE3]/70">
                BS 8110 / Kenya National Building Code 2024
              </p>
            </div>

            <div className="min-w-0">
              <span className="text-[9px] uppercase text-[#C8A24A] font-bold block">
                VERIFIED PROFESSIONAL STAMP
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-6 h-6 rounded-full border border-dashed border-[#C8A24A] flex items-center justify-center text-[7px] text-[#C8A24A] font-bold shrink-0">
                  EBK
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-white leading-tight truncate">
                    Eng. Kelvin Ochieng, PE
                  </p>
                  <p className="text-[8px] text-[#D9DEE3]/60 truncate">
                    EBK M.2891 · BORAQS QS/981
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail Inspector Panel (4 Cols) */}
        <div className="xl:col-span-4 min-w-0 bg-[#0B1B2B] p-5 sm:p-6 border-t xl:border-t-0 xl:border-l border-[#2B4560]/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#2B4560]/50">
              <span className="text-xs font-mono font-bold text-[#C8A24A] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> ELEMENT SPECIFICATION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F6FEB]/20 text-[#1F6FEB] font-semibold">
                LOD 350
              </span>
            </div>

            {selectedElement ? (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {selectedElement.name}
                  </h3>
                  <span className="text-xs font-mono text-[#C8A24A] font-medium">
                    ID: {selectedElement.id} · {selectedElement.category}
                  </span>
                </div>

                <div className="bg-[#07131F] rounded-xl p-3 border border-[#2B4560]/40 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#D9DEE3]/70">Dimensions:</span>
                    <span className="font-mono text-white font-medium">{selectedElement.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#D9DEE3]/70">Concrete Grade:</span>
                    <span className="font-mono text-[#1E9E6A] font-medium">{selectedElement.mix}</span>
                  </div>
                  <div className="py-1 border-b border-white/5">
                    <span className="text-[#D9DEE3]/70 block mb-0.5">Rebar Schedule:</span>
                    <span className="font-mono text-[#C8A24A] font-medium block">{selectedElement.reinforcement}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#D9DEE3]/70">Standard Code:</span>
                    <span className="font-mono text-white">{selectedElement.code}</span>
                  </div>
                </div>

                {/* Linked Escrow Milestone */}
                <div className="bg-[#1F6FEB]/10 border border-[#1F6FEB]/30 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#1F6FEB]">
                      LINKED ESCROW MILESTONE
                    </span>
                    <span className="text-[10px] font-bold text-[#1E9E6A] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> FUNDS SECURED
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">
                    {selectedElement.milestoneName}
                  </h4>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1F6FEB]/20">
                    <span className="text-[#D9DEE3]/70">Allocated Budget:</span>
                    <span className="font-mono font-bold text-[#C8A24A]">
                      {currency === 'KES' ? `KES ${(selectedElement.costKes).toLocaleString()}` : `$${Math.round(selectedElement.costKes / 130).toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Site Inspection & Verification Notes */}
                <div className="bg-[#07131F] rounded-xl p-3 border border-[#2B4560]/40 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-[#1E9E6A] font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resident QS & Engineer Verification:</span>
                  </div>
                  <p className="text-[11px] text-[#D9DEE3]/80 leading-relaxed font-sans">
                    {selectedElement.inspectionNotes}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                Click on any structural element (column, beam, or footing) to view architectural specifications and linked escrow custody status.
              </div>
            )}
          </div>

          {/* Quick Actions at bottom of Inspector */}
          <div className="mt-6 pt-4 border-t border-[#2B4560]/50 space-y-2">
            <button
              onClick={() => {
                if (onLinkMilestone && selectedElement) {
                  onLinkMilestone(selectedElement.milestoneId);
                }
              }}
              className="w-full py-2 px-3 bg-[#1F6FEB] hover:bg-[#1F6FEB]/90 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#C8A24A]" />
              <span>Inspect Milestone Escrow Conditions</span>
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-[#D9DEE3]/60 font-mono">
              <span>DRAWING ID: AR-STR-104</span>
              <span>·</span>
              <span>CERTIFIED BORAQS / EBK</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
