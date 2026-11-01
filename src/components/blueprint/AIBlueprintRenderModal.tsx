import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Download, 
  Layers, 
  Sliders, 
  Sun, 
  Moon, 
  Camera, 
  Eye, 
  Check, 
  Copy, 
  Share2, 
  RefreshCw, 
  ShieldCheck, 
  FileCheck, 
  Maximize2, 
  Compass, 
  Info,
  ChevronRight,
  SplitSquareVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type AestheticStyleId = 
  | 'modern-minimalist'
  | 'old-money-georgian'
  | 'italian-tuscan'
  | 'contemporary-tropical'
  | 'brutalist-industrial'
  | 'scandinavian-barnhouse';

interface AestheticPreset {
  id: AestheticStyleId;
  name: string;
  subtitle: string;
  description: string;
  keyMaterials: string[];
  exteriorImage: string;
  interiorImage: string;
  paletteColors: string[];
  recommendedLandscape: string;
  architecturalPrompt: string;
}

const AESTHETIC_PRESETS: AestheticPreset[] = [
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    subtitle: 'Cantilevers, curtain glass & fair-face concrete',
    description: 'Post-tensioned cantilevered overhangs, floor-to-ceiling slimline structural glazing, board-marked architectural concrete, floating steel stairs, and seamless indoor-outdoor lanai flow.',
    keyMaterials: ['Fair-face RC Concrete', 'Low-Iron Structural Glass', 'Charcoal Anodized Aluminum', 'Nairobi Grey Mazeras Stone'],
    exteriorImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    interiorImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
    paletteColors: ['#1A1E24', '#7D8694', '#D8DDE3', '#C8A24A'],
    recommendedLandscape: 'Manicured drought-tolerant zoysia lawn with minimalist linear reflecting pool',
    architecturalPrompt: 'Photorealistic architectural 3D exterior rendering of a luxury modern minimalist residence based on CAD floor plan, cantilevered reinforced concrete roof slab, double-height curtain wall glazing, board-marked fair-face concrete walls, floating hardwood stairs, warm 3000K recessed architectural lighting, pristine Kenya flora, dusk blue hour lighting, 8k resolution, architectural digest style, volumetric lighting, Octane render.'
  },
  {
    id: 'old-money-georgian',
    name: 'Old Money / Classic Georgian',
    subtitle: 'Hand-dressed ashlar stone & classical portico',
    description: 'Authentic dressed Ndarugu ashlar stone masonry, classical Corinthian columns, arched dormer windows, hand-cut grey slate hipped roof, copper downpipes, and formal estate symmetry.',
    keyMaterials: ['Hand-Chiseled Ashlar Stone', 'Natural Slate Roof Shingles', 'Solid Cast Brass Hardware', 'Mvuli Hardwood Entrance Door'],
    exteriorImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop',
    interiorImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1600&auto=format&fit=crop',
    paletteColors: ['#2F3E33', '#C2B69D', '#8C6D46', '#212529'],
    recommendedLandscape: 'Formal English gravel driveway, mature jacaranda and cypress borders, manicured boxwood hedges',
    architecturalPrompt: 'Stately classic Georgian country estate in Karen Nairobi, hand-dressed local ashlar stone masonry with deep mortar reveals, symmetrical facade with Tuscan stone portico, authentic Welsh slate roof tiles, heritage multi-pane sash windows, copper gutters with green patina, warm evening carriage lanterns, lush manicured grounds, ultra-realistic architectural photography.'
  },
  {
    id: 'italian-tuscan',
    name: 'Italian Villa / Tuscan Renaissance',
    subtitle: 'Terracotta pantiles, lime stucco & arched loggias',
    description: 'Curved Tuscan terracotta barrel roof tiles, warm ochre limestone plaster, triple-arched colonnaded loggias, wrought iron balconies, rustic stone courtyard, and romantic sun-drenched verandas.',
    keyMaterials: ['Kiln-Fired Terracotta Tiles', 'Ochre Lime-Stucco Render', 'Wrought-Iron Balustrades', 'Travertine Paved Terraces'],
    exteriorImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
    interiorImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop',
    paletteColors: ['#C66B3D', '#E5D4B8', '#5E6B52', '#3D312A'],
    recommendedLandscape: 'Italian cypress avenue, olive grove planters, terracotta urns, stone water fountain courtyard',
    architecturalPrompt: 'Authentic Tuscan Italian renaissance villa architecture, weathered clay barrel roof tiles, textured warm ochre lime plaster stucco, arched colonnaded ground floor loggia opening onto travertine courtyard, wrought iron pergolas with bougainvillea vines, golden hour 3200K Mediterranean sunlight, cinematic photorealism, detailed brick vaults.'
  },
  {
    id: 'contemporary-tropical',
    name: 'Contemporary Tropical / Swahili Fusion',
    subtitle: 'Deep eaves, Lamu teak louvers & breezeway courtyards',
    description: 'Deep protective timber-lined eaves for tropical sun shading, coral ragstone masonry accents, hand-carved Lamu teak shutters, central open-air palm lightwell, and natural cross-ventilation corridors.',
    keyMaterials: ['Kilifi Coral Ragstone', 'Reclaimed Lamu Teak', 'Breeze-Block Screen Walls', 'Off-White Lime Wash'],
    exteriorImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop',
    interiorImage: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=1600&auto=format&fit=crop',
    paletteColors: ['#F2EDE4', '#7C5C3B', '#264653', '#E76F51'],
    recommendedLandscape: 'Tropical coast palms, frangipani blossoms, raised timber pool deck, breeze-block privacy courtyard',
    architecturalPrompt: 'Tropical coastal modern villa with Swahili architectural heritage, deep overhanging timber eaves, carved Lamu teak shutter louvers, natural coral ragstone feature walls, integrated open-air water court with water lilies, breezy shaded veranda, soft coastal twilight lighting, architectural documentary photography.'
  },
  {
    id: 'brutalist-industrial',
    name: 'Brutalist Industrial',
    subtitle: 'Off-shutter board-marked concrete & crittall steel',
    description: 'Celebration of raw structural honesty with off-shutter board-marked concrete beams, black crittall steel multi-pane glazing, double-height ceiling voids, exposed copper conduits, and dramatic architectural shadows.',
    keyMaterials: ['Board-Marked Concrete', 'Black Crittall Steel', 'Exposed Structural I-Beams', 'Polished Concrete Screed'],
    exteriorImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
    interiorImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop',
    paletteColors: ['#3A3D40', '#6C757D', '#1B1C1D', '#E9ECEF'],
    recommendedLandscape: 'Sculptural concrete planters, coarse basalt gravel, architectural architectural lighting up-lighting raw surfaces',
    architecturalPrompt: 'Refined modern brutalist architecture dwelling, board-marked off-shutter structural concrete walls with visible tie-rod holes, black crittall steel floor-to-ceiling window grid, cantilevered concrete balcony, dramatic shadow casting from high-altitude sun, architectural design monograph photography.'
  },
  {
    id: 'scandinavian-barnhouse',
    name: 'Scandinavian Barnhouse',
    subtitle: 'Steep pitch zinc standing-seam & charred timber',
    description: 'Clean Scandinavian gable roofline, graphite zinc standing-seam roofing, Shou Sugi Ban charred timber rainscreen cladding, triple-glazed minimalist glass gables, and serene timber decking.',
    keyMaterials: ['Charred Shou Sugi Ban Wood', 'Zinc Standing Seam Metal', 'Blonde Ash Millwork', 'Basalt Stone Pavers'],
    exteriorImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
    interiorImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop',
    paletteColors: ['#1E1E1E', '#9E9486', '#E4DCD3', '#5A6B7C'],
    recommendedLandscape: 'Wild indigenous savanna grasses, dark timber boardwalk, minimal boulder clusters',
    architecturalPrompt: 'Modern Scandinavian barnhouse villa, 45-degree steep pitch zinc standing-seam roof, charred black timber Shou Sugi Ban vertical siding, massive glass triangular gable window, warm interior fire glow visible, misty morning atmosphere, hyper-realistic architectural visualization.'
  }
];

interface AIBlueprintRenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string;
  projectLocation?: string;
  currentFloorPlanLayer?: string;
}

export const AIBlueprintRenderModal: React.FC<AIBlueprintRenderModalProps> = ({
  isOpen,
  onClose,
  projectTitle = 'Karen 4-Bed Residential Eco-Villa',
  projectLocation = 'Karen, Nairobi County (L.R. 11914/8)',
  currentFloorPlanLayer = 'Ground Floor Structural Framing'
}) => {
  const [selectedStyleId, setSelectedStyleId] = useState<AestheticStyleId>('modern-minimalist');
  const [targetView, setTargetView] = useState<'exterior-front' | 'exterior-aerial' | 'interior-living' | 'structural-cutaway'>('exterior-front');
  const [lightingMode, setLightingMode] = useState<'golden-hour' | 'overcast' | 'blue-hour' | 'midday'>('golden-hour');
  const [customPromptNote, setCustomPromptNote] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [comparisonPosition, setComparisonPosition] = useState<number>(50); // 0-100% split slider
  const [viewMode, setViewMode] = useState<'split-slider' | 'full-render' | 'blueprint-only'>('split-slider');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [savedToEscrow, setSavedToEscrow] = useState(false);
  const [activeTab, setActiveTab] = useState<'style' | 'camera' | 'materials'>('style');

  const selectedPreset = AESTHETIC_PRESETS.find(p => p.id === selectedStyleId) || AESTHETIC_PRESETS[0];

  // Steps for simulated progressive generation
  const generationSteps = [
    'Parsing 2D CAD floor plan vectors & structural column grid [A]-[E]...',
    'Extruding 3D wall volumes & ceiling height (2,800mm clear)...',
    `Applying ${selectedPreset.name} material textures & reflectance...`,
    'Calculating 3,200K photometric ray-tracing & global illumination...',
    'Rendering LOD 400 photorealistic architectural preview (4K)...'
  ];

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(0);
    setSavedToEscrow(false);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < generationSteps.length) {
        setGenerationStep(step);
      } else {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 600);
  };

  const handleCopyPrompt = () => {
    const fullPrompt = `${selectedPreset.architecturalPrompt} Atmosphere: ${lightingMode}. Target: ${targetView}. Custom refinement: ${customPromptNote || 'None'}. Reference Drawing: ${projectTitle}.`;
    navigator.clipboard.writeText(fullPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleSaveToEscrow = () => {
    setSavedToEscrow(true);
    setTimeout(() => setSavedToEscrow(false), 4000);
  };

  const handleDownloadImage = () => {
    // Trigger download of the active render
    const link = document.createElement('a');
    link.href = targetView.startsWith('interior') ? selectedPreset.interiorImage : selectedPreset.exteriorImage;
    link.download = `${projectTitle.replace(/\s+/g, '_')}_${selectedPreset.id}_render.jpg`;
    link.target = '_blank';
    link.click();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentDisplayImage = targetView.startsWith('interior')
    ? selectedPreset.interiorImage
    : selectedPreset.exteriorImage;

  return (
    <div className="fixed inset-0 z-50 bg-[#07131F]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div 
        className="bg-[#0B1B2B] text-white rounded-3xl border border-[#2B4560]/60 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header Bar */}
        <div className="bg-[#07131F] border-b border-[#2B4560]/60 px-5 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1F6FEB] to-[#C8A24A] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C8A24A] font-bold">
                  AI ARCHITECTURAL SYNTHESIS · LOD 400
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-[#1F6FEB]/20 text-[#1F6FEB] font-mono font-semibold">
                  CAD VECTOR TO 3D RENDER
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-display text-white">
                Generate Aesthetic Renders from Floor Plan
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs font-mono text-gray-400">
              Active: <strong className="text-white">{currentFloorPlanLayer}</strong>
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Controls (5 cols) & Right Canvas Preview (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto min-h-0 w-full min-w-0">
          
          {/* ========================================================
              LEFT COLUMN: AESTHETIC CONTROLS & ARCHITECTURAL PRESETS
             ======================================================== */}
          <div className="lg:col-span-5 min-w-0 bg-[#0A1827] border-b lg:border-b-0 lg:border-r border-[#2B4560]/50 p-5 space-y-5 overflow-y-auto max-h-[80vh]">
            
            {/* Project Context Reminder */}
            <div className="bg-[#07131F] rounded-2xl p-3.5 border border-[#2B4560]/40 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#1F6FEB] font-bold uppercase block">
                  Reference Floor Plan
                </span>
                <h4 className="font-bold text-white text-xs mt-0.5">{projectTitle}</h4>
                <p className="text-[11px] text-gray-400">{projectLocation}</p>
              </div>
              <div className="p-2 rounded-lg bg-[#1F6FEB]/15 text-[#1F6FEB] shrink-0">
                <Compass className="w-4 h-4 text-[#C8A24A]" />
              </div>
            </div>

            {/* Step Tabs */}
            <div className="flex items-center bg-[#07131F] p-1 rounded-xl border border-[#2B4560]/50 text-xs">
              <button
                onClick={() => setActiveTab('style')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'style' ? 'bg-[#1F6FEB] text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                1. Architectural Style
              </button>
              <button
                onClick={() => setActiveTab('camera')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'camera' ? 'bg-[#1F6FEB] text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                2. Lighting & View
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'materials' ? 'bg-[#1F6FEB] text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                3. Material Finishes
              </button>
            </div>

            {/* Tab 1: Aesthetic Style Grid */}
            {activeTab === 'style' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-[#C8A24A]">
                    Select Architectural Aesthetic
                  </label>
                  <span className="text-[10px] font-mono text-gray-400">
                    {AESTHETIC_PRESETS.length} Curated Styles
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AESTHETIC_PRESETS.map((preset) => {
                    const isSelected = selectedStyleId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedStyleId(preset.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#1F6FEB]/15 border-[#1F6FEB] ring-2 ring-[#1F6FEB]/50 text-white shadow-md'
                            : 'bg-[#07131F] border-[#2B4560]/40 text-gray-300 hover:border-[#1F6FEB]/50 hover:bg-[#0c1e30]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-display font-bold text-xs text-white">
                              {preset.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#C8A24A] shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 line-clamp-2">
                            {preset.subtitle}
                          </p>
                        </div>

                        {/* Color swatches */}
                        <div className="flex items-center gap-1.5 pt-1">
                          {preset.paletteColors.map((color, idx) => (
                            <span 
                              key={idx} 
                              className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs" 
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Style Detail Card */}
                <div className="p-3.5 rounded-2xl bg-[#07131F] border border-[#2B4560]/40 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#C8A24A] uppercase">
                      STYLE SPECIFICATION
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="font-bold text-white text-xs">{selectedPreset.name}</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    {selectedPreset.description}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {selectedPreset.keyMaterials.map((mat, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-mono">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Lighting & Camera Viewpoint */}
            {activeTab === 'camera' && (
              <div className="space-y-4 text-xs">
                {/* Camera Perspective */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-[#C8A24A]">
                    Camera Angle & Perspective
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'exterior-front', label: 'Eye-Level 35mm Exterior', desc: 'Front elevation perspective with entry portico' },
                      { id: 'exterior-aerial', label: 'Aerial 45° Drone View', desc: 'Roof landscape, plot boundaries and solar layout' },
                      { id: 'interior-living', label: 'Interior Wide 24mm', desc: 'Double-height living lounge, dining & lanai' },
                      { id: 'structural-cutaway', label: 'Architectural Axonometric', desc: '3D sectional cutaway showing internal floor slabs' }
                    ].map(v => (
                      <button
                        key={v.id}
                        onClick={() => setTargetView(v.id as any)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          targetView === v.id
                            ? 'bg-[#1F6FEB]/20 border-[#1F6FEB] text-white font-bold'
                            : 'bg-[#07131F] border-[#2B4560]/40 text-gray-300 hover:bg-[#0c1e30]'
                        }`}
                      >
                        <span className="block font-bold text-xs">{v.label}</span>
                        <span className="text-[10px] text-gray-400 line-clamp-1">{v.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lighting Atmosphere */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-[#C8A24A]">
                    Photometric Sun & Atmosphere
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'golden-hour', label: 'Golden Hour (3,200K)', icon: Sun, desc: 'Warm sunset radiance with warm interior glow' },
                      { id: 'blue-hour', label: 'Architectural Dusk (Blue Hour)', icon: Moon, desc: 'Deep indigo sky, illuminated pool & accent downlights' },
                      { id: 'overcast', label: 'Overcast Diffused', icon: Sun, desc: 'Soft architectural shadowless diffuse daylight' },
                      { id: 'midday', label: 'Nairobi Equatorial Midday', icon: Sun, desc: 'Crisp high-contrast tropical shadows & vibrant greens' }
                    ].map(l => {
                      const Icon = l.icon;
                      return (
                        <button
                          key={l.id}
                          onClick={() => setLightingMode(l.id as any)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2 ${
                            lightingMode === l.id
                              ? 'bg-[#1F6FEB]/20 border-[#1F6FEB] text-white font-bold'
                              : 'bg-[#07131F] border-[#2B4560]/40 text-gray-300 hover:bg-[#0c1e30]'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-[#C8A24A] shrink-0 mt-0.5" />
                          <div>
                            <span className="block font-bold text-xs">{l.label}</span>
                            <span className="text-[10px] text-gray-400 line-clamp-1">{l.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Landscaping Context */}
                <div className="p-3 bg-[#07131F] rounded-xl border border-[#2B4560]/40 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#1F6FEB] uppercase block">
                    Synthesized Landscape Context
                  </span>
                  <p className="text-[11px] text-gray-300">
                    {selectedPreset.recommendedLandscape}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Material Finishes & Custom Modifiers */}
            {activeTab === 'materials' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-[#C8A24A]">
                    Specified Exterior Finishes (BORAQS Standard)
                  </label>
                  <div className="space-y-1.5">
                    {selectedPreset.keyMaterials.map((mat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#07131F] border border-[#2B4560]/40">
                        <span className="text-xs text-white">{mat}</span>
                        <span className="text-[10px] font-mono text-[#1E9E6A] font-semibold">Active in Prompt</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Architectural Additions */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-[#C8A24A]">
                    Optional Architectural Refinements / Additions
                  </label>
                  <textarea
                    value={customPromptNote}
                    onChange={(e) => setCustomPromptNote(e.target.value)}
                    placeholder="e.g. Add 12m lap pool with Mazeras coping, rooftop solar pergola, or floor-to-ceiling glass pivot door..."
                    className="w-full bg-[#07131F] border border-[#2B4560]/60 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#1F6FEB] resize-none h-20"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      '+ Infinity Pool',
                      '+ Solar Glass Pergola',
                      '+ Ndarugu Stone Accents',
                      '+ Teak Privacy Louvers'
                    ].map((snippet, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCustomPromptNote(prev => prev ? `${prev}, ${snippet.replace('+', '').trim()}` : snippet.replace('+', '').trim())}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 font-mono border border-white/10 cursor-pointer"
                      >
                        {snippet}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button: Trigger Generation */}
            <div className="pt-2">
              <button
                onClick={handleStartGeneration}
                disabled={isGenerating}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#1F6FEB] to-[#1250b8] hover:from-[#2b7bf5] hover:to-[#175cd4] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C8A24A]" />
                    <span>Synthesizing Architectural Render...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C8A24A]" />
                    <span>Generate {selectedPreset.name} 4K Render</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: COMPARISON SLIDER & 4K RENDER CANVAS
             ======================================================== */}
          <div className="lg:col-span-7 min-w-0 bg-[#06121E] p-5 flex flex-col justify-between space-y-4">
            
            {/* Canvas Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#07131F] p-2.5 rounded-2xl border border-[#2B4560]/40 text-xs">
              
              {/* View Mode Switcher */}
              <div className="flex items-center bg-[#0B1B2B] p-1 rounded-xl border border-[#2B4560]/50">
                <button
                  onClick={() => setViewMode('split-slider')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                    viewMode === 'split-slider' ? 'bg-[#1F6FEB] text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Interactive CAD vs 3D Render Comparison Slider"
                >
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                  <span>CAD vs 3D Split</span>
                </button>
                <button
                  onClick={() => setViewMode('full-render')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                    viewMode === 'full-render' ? 'bg-[#1F6FEB] text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full 3D Render</span>
                </button>
                <button
                  onClick={() => setViewMode('blueprint-only')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                    viewMode === 'blueprint-only' ? 'bg-[#1F6FEB] text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>CAD Blueprint</span>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#1E9E6A] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#1E9E6A] animate-pulse" />
                  <span>3840 × 2160 UHD</span>
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-[10px] font-mono text-[#C8A24A]">
                  LOD 400
                </span>
              </div>
            </div>

            {/* Main Interactive Canvas Area */}
            <div className="relative rounded-2xl overflow-hidden border border-[#2B4560]/60 bg-[#040C15] shadow-2xl min-h-[400px] flex items-center justify-center group select-none">
              
              {/* Generation Progress Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 z-30 bg-[#07131F]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1F6FEB] to-[#C8A24A] animate-spin flex items-center justify-center p-0.5">
                      <div className="w-full h-full bg-[#0B1B2B] rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-[#C8A24A] animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-md">
                    <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase tracking-wider block">
                      SYNTHESIZING ARCHITECTURAL SCENE ({generationStep + 1} OF {generationSteps.length})
                    </span>
                    <h3 className="font-display font-bold text-base text-white">
                      Generating {selectedPreset.name}
                    </h3>
                    <p className="text-xs font-mono text-gray-300">
                      {generationSteps[generationStep]}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1F6FEB] to-[#C8A24A] transition-all duration-300"
                      style={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* VIEW MODE 1: SPLIT SLIDER (CAD BLUEPRINT ON LEFT, AI RENDER ON RIGHT) */}
              {viewMode === 'split-slider' && (
                <div className="relative w-full h-full min-h-[420px] overflow-hidden flex items-center justify-center">
                  
                  {/* Layer 1: Right Side (Photorealistic AI Render) */}
                  <img
                    src={currentDisplayImage}
                    alt={`${selectedPreset.name} Architectural Render`}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />

                  {/* Layer 2: Left Side (CAD Blueprint Drawing Overlay) clipped by comparisonPosition */}
                  <div 
                    className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-[#00E5FF] shadow-2xl"
                    style={{ width: `${comparisonPosition}%` }}
                  >
                    <div className="absolute inset-0 w-full h-full bg-[#06121E]">
                      {/* Technical CAD Blueprint Grid & Vectors SVG */}
                      <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
                        <defs>
                          <pattern id="modalGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1F6FEB" strokeWidth="0.5" strokeOpacity="0.25" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#modalGrid)" />

                        {/* Outer Perimeter Footprint */}
                        <rect x="80" y="80" width="640" height="340" fill="none" stroke="#1F6FEB" strokeWidth="2.5" />
                        
                        {/* Structural Columns (200x200mm at Grid Intersections) */}
                        {[80, 240, 400, 560, 720].map((x, xi) => (
                          [80, 250, 420].map((y, yi) => (
                            <g key={`${xi}-${yi}`}>
                              <rect x={x - 8} y={y - 8} width="16" height="16" fill="#C8A24A" stroke="#0B1B2B" strokeWidth="1" />
                              <text x={x + 10} y={y - 10} fill="#C8A24A" fontSize="9" fontFamily="monospace">
                                {`C${xi+1}-${yi+1}`}
                              </text>
                            </g>
                          ))
                        ))}

                        {/* Internal Partitions & Rooms */}
                        <line x1="80" y1="250" x2="560" y2="250" stroke="#00E5FF" strokeWidth="2" strokeDasharray="4 2" />
                        <line x1="400" y1="80" x2="400" y2="420" stroke="#00E5FF" strokeWidth="2" strokeDasharray="4 2" />

                        {/* Room Annotation Texts */}
                        <text x="140" y="160" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                          GREAT LIVING ROOM & LANAI
                        </text>
                        <text x="140" y="178" fill="#1F6FEB" fontSize="10" fontFamily="monospace">
                          AREA: 64.0 m² · FINISH: {selectedPreset.keyMaterials[0]}
                        </text>

                        <text x="460" y="160" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                          CHEF'S KITCHEN & PANTRY
                        </text>
                        <text x="460" y="178" fill="#1F6FEB" fontSize="10" fontFamily="monospace">
                          AREA: 32.5 m² · ISLAND SPEC: CALACATTA
                        </text>

                        <text x="140" y="340" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                          MASTER SUITE & WALK-IN
                        </text>
                        <text x="140" y="358" fill="#1F6FEB" fontSize="10" fontFamily="monospace">
                          AREA: 48.0 m² · MVULI TIMBER FLOORS
                        </text>

                        <text x="460" y="340" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                          GUEST BEDROOM 2 & ENSUITE
                        </text>

                        {/* Dimension Chains */}
                        <line x1="80" y1="50" x2="720" y2="50" stroke="#C8A24A" strokeWidth="1.2" markerEnd="url(#arrow)" />
                        <text x="400" y="42" fill="#C8A24A" fontSize="11" textAnchor="middle" fontFamily="monospace">
                          ◄ 18,200 mm OVERALL PLINTH LENGTH ►
                        </text>

                        <line x1="50" y1="80" x2="50" y2="420" stroke="#C8A24A" strokeWidth="1.2" />
                        <text x="40" y="250" fill="#C8A24A" fontSize="11" textAnchor="middle" fontFamily="monospace" transform="rotate(-90 40 250)">
                          ◄ 11,400 mm WIDTH ►
                        </text>
                      </svg>
                    </div>

                    {/* Left Blueprint Label Tag */}
                    <div className="absolute top-4 left-4 bg-[#0B1B2B]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#1F6FEB]/60 text-[10px] font-mono text-[#00E5FF] font-bold">
                      CAD BLUEPRINT VECTORS
                    </div>
                  </div>

                  {/* Right Render Label Tag */}
                  <div className="absolute top-4 right-4 bg-[#0B1B2B]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#C8A24A]/60 text-[10px] font-mono text-[#C8A24A] font-bold">
                    AI 4K RENDER: {selectedPreset.name.toUpperCase()}
                  </div>

                  {/* Interactive Draggable Slider Handle */}
                  <div 
                    className="absolute top-0 bottom-0 z-20 flex flex-col items-center justify-center cursor-ew-resize"
                    style={{ left: `calc(${comparisonPosition}% - 14px)` }}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#0B1B2B] border-2 border-[#00E5FF] shadow-xl flex items-center justify-center text-[#00E5FF]">
                      <SplitSquareVertical className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Native Range Slider for smooth drag on all devices */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={comparisonPosition}
                    onChange={(e) => setComparisonPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-25"
                    aria-label="Drag slider to compare CAD blueprint with AI architectural render"
                  />
                </div>
              )}

              {/* VIEW MODE 2: FULL 3D RENDER */}
              {viewMode === 'full-render' && (
                <div className="relative w-full h-full min-h-[420px]">
                  <img
                    src={currentDisplayImage}
                    alt={`${selectedPreset.name} Architectural Render`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[#07131F]/90 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{selectedPreset.name}</span>
                      <span className="text-[11px] text-gray-400">{lightingMode.replace('-', ' ')} · {targetView.replace('-', ' ')}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E9E6A]/20 text-[#1E9E6A] font-bold">
                      VERIFIED PROPORTIONS
                    </span>
                  </div>
                </div>
              )}

              {/* VIEW MODE 3: BLUEPRINT ONLY */}
              {viewMode === 'blueprint-only' && (
                <div className="relative w-full h-full min-h-[420px] bg-[#06121E] p-4 flex items-center justify-center">
                  <svg viewBox="0 0 800 500" className="w-full h-full">
                    <defs>
                      <pattern id="modalGridFull" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1F6FEB" strokeWidth="0.5" strokeOpacity="0.3" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#modalGridFull)" />
                    <rect x="80" y="80" width="640" height="340" fill="none" stroke="#1F6FEB" strokeWidth="2.5" />
                    {[80, 240, 400, 560, 720].map((x, xi) => (
                      [80, 250, 420].map((y, yi) => (
                        <g key={`${xi}-${yi}`}>
                          <rect x={x - 8} y={y - 8} width="16" height="16" fill="#C8A24A" stroke="#0B1B2B" strokeWidth="1" />
                          <text x={x + 10} y={y - 10} fill="#C8A24A" fontSize="9" fontFamily="monospace">
                            {`C${xi+1}-${yi+1}`}
                          </text>
                        </g>
                      ))
                    ))}
                    <text x="400" y="240" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle">
                      {projectTitle.toUpperCase()} · CAD FOUNDATION & FRAMING PLAN
                    </text>
                    <text x="400" y="265" fill="#1F6FEB" fontSize="12" textAnchor="middle" fontFamily="monospace">
                      BS 8110 STRUCTURAL AXIS REINFORCEMENT
                    </text>
                  </svg>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1E9E6A]" />
                <span>Dimensions calibrated to BORAQS certified bill of quantities.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyPrompt}
                  className="flex-1 sm:flex-initial px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-gray-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Copy Engineering Prompt for Midjourney / Stable Diffusion"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-[#1E9E6A]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Prompt Copied' : 'Copy Prompt'}</span>
                </button>

                <button
                  onClick={handleDownloadImage}
                  className="flex-1 sm:flex-initial px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-gray-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Download 4K Architectural Render"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 4K</span>
                </button>

                <button
                  onClick={handleSaveToEscrow}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#C8A24A] hover:bg-[#b08c3a] text-[#0B1B2B] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Attach this render to project escrow contract"
                >
                  {savedToEscrow ? <Check className="w-3.5 h-3.5 text-[#0B1B2B]" /> : <FileCheck className="w-3.5 h-3.5 text-[#0B1B2B]" />}
                  <span>{savedToEscrow ? 'Locked in Escrow Pack!' : 'Attach to Escrow Pack'}</span>
                </button>
              </div>
            </div>

            {/* Saved Notification Toast */}
            {savedToEscrow && (
              <div className="p-3 bg-[#1E9E6A]/20 border border-[#1E9E6A] rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                <span>
                  <strong>Success:</strong> {selectedPreset.name} architectural render successfully tagged to Milestone 3 (Superstructure) escrow release documentation.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
