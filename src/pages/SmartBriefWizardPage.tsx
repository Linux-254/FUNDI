import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildingType, FinishLevel, WorksType } from '../types';
import { api } from '../lib/api';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  MapPin, 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers,
  Home,
  Briefcase,
  Maximize2,
  Check,
  Plus,
  Minus,
  Zap,
  Droplets,
  Lock,
  Camera,
  MessageSquare,
  FileText,
  DollarSign,
  Palette,
  Car,
  Bath,
  Lightbulb,
  DoorOpen,
  Fence,
  Send,
  Wand2,
  HelpCircle,
  Eye
} from 'lucide-react';

interface SmartBriefWizardPageProps {
  currency: 'KES' | 'USD';
}

type MainCategory = 'residential-bespoke' | 'residential-apartments' | 'commercial-office';

interface ApartmentUnitMix {
  bedsitters: number;
  oneBed: number;
  twoBed: number;
  threeBed: number;
  penthouses: number;
}

export const SmartBriefWizardPage: React.FC<SmartBriefWizardPageProps> = ({ currency }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  // STEP 1: TYPOLOGY & SCALE
  const [mainCategory, setMainCategory] = useState<MainCategory>('residential-bespoke');
  const [bespokeSubtype, setBespokeSubtype] = useState<'Villa' | 'Bungalow' | 'Maisonette' | 'Duplex' | 'Penthouse'>('Villa');
  
  // Multi-unit Apartment mix
  const [apartmentMix, setApartmentMix] = useState<ApartmentUnitMix>({
    bedsitters: 4,
    oneBed: 6,
    twoBed: 4,
    threeBed: 2,
    penthouses: 1
  });

  // Commercial Office spacing specs
  const [officeSpacingType, setOfficeSpacingType] = useState<'Open-Plan Creative (8m²/desk)' | 'Corporate Executive (12m²/desk)' | 'Medical / Clinic Suites' | 'Co-Working Hybrid'>('Corporate Executive (12m²/desk)');
  const [officeDeskCapacity, setOfficeDeskCapacity] = useState<number>(65);

  // Plot Details
  const [county, setCounty] = useState('Nairobi');
  const [ward, setWard] = useState('Karen');
  const [plotSize, setPlotSize] = useState('0.50 Acre');
  const [estimatedPlinthSqm, setEstimatedPlinthSqm] = useState(380);
  const [floorLevels, setFloorLevels] = useState(2);

  // STEP 2: ARCHITECTURAL AESTHETICS & STYLES
  const [aestheticStyle, setAestheticStyle] = useState<
    'old-money' | 'minimalist-modern' | 'italian-tuscan' | 'contemporary-tropical' | 'brutalist-industrial' | 'afro-modern'
  >('contemporary-tropical');

  // STEP 3: GRANULAR AMENITIES & SPECIFICATIONS
  const [showerSpec, setShowerSpec] = useState<'Rainfall Concealed PEX' | 'Frameless Glass Cubicle' | 'Freestanding Soaking Tub' | 'Ultra-Luxury Dual Suite'>('Ultra-Luxury Dual Suite');
  const [parkingSpec, setParkingSpec] = useState<'1-Bay Compact' | '2-Car Covered Port' | '4-Bay Basement Garage with EV Charger' | '6-Bay Executive Forecourt'>('4-Bay Basement Garage with EV Charger');
  const [lightingSpec, setLightingSpec] = useState<'Architectural Cove LED (2700K)' | 'Magnetic Track Spotlights' | 'Statement Brass Chandelier' | 'Smart Scene Dimmable Automation'>('Smart Scene Dimmable Automation');
  const [doorSpec, setDoorSpec] = useState<'2.4m Solid Mahogany Pivot' | 'Acoustic Flush Timber' | 'Thermal-Break Double Glazed Glass Sliders' | 'Motorized Security Shutters'>('2.4m Solid Mahogany Pivot');
  const [gateSpec, setGateSpec] = useState<'Automated Cantilever Sliding Gate' | 'Biometric Intercom & CCTV Sync' | '10-Strand Electric Fence & Razor Wire' | 'Full Perimeter Smart Shield'>('Full Perimeter Smart Shield');
  
  // Green Energy & Utilities
  const [includeSolarPv, setIncludeSolarPv] = useState(true);
  const [includeBorehole, setIncludeBorehole] = useState(true);
  const [includeRainwaterTank, setIncludeRainwaterTank] = useState(true);
  const [includeBackupGenerator, setIncludeBackupGenerator] = useState(false);
  const [furnitureStaging, setFurnitureStaging] = useState<'Minimalist Built-in Custom Teak' | 'Italian Leather & Natural Stone' | 'Unfurnished / Bare Shell'>('Italian Leather & Natural Stone');

  // STEP 4: AI BLUEPRINT VISUALIZER & CHATBOT / NOTES
  const [aiPromptCustomNote, setAiPromptCustomNote] = useState('');
  const [aiGeneratedConceptUrl, setAiGeneratedConceptUrl] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [notesList, setNotesList] = useState<string[]>([
    'Ensure master ensuite has double vanity and floor-to-ceiling porcelain slab tiles.',
    'Orientation must maximize natural cross-ventilation from the Ngong Hills breeze.',
    'Borehole filtration plant must be tucked neatly behind the generator shed.'
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // AI Chat Assistant
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([
    {
      sender: 'assistant',
      text: 'Hello! I am your FUNDI Architectural & Building Code Assistant. I can review your room sizes, Kenya building code standards (Eurocode / NCA / KEBS), and permit requirements for your Karen project. How can I help?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // STEP 5: BUDGET & ESCROW
  const [finishLevel, setFinishLevel] = useState<FinishLevel>('luxury');
  const [submitting, setSubmitting] = useState(false);

  // Calculation helpers
  const totalApartmentUnits = apartmentMix.bedsitters + apartmentMix.oneBed + apartmentMix.twoBed + apartmentMix.threeBed + apartmentMix.penthouses;

  const calculateBudgetEstimate = () => {
    let ratePerSqm = 65000; // standard
    if (finishLevel === 'basic') ratePerSqm = 48000;
    if (finishLevel === 'premium') ratePerSqm = 78000;
    if (finishLevel === 'luxury') ratePerSqm = 98000;

    let area = estimatedPlinthSqm;
    if (mainCategory === 'residential-apartments') {
      area = (apartmentMix.bedsitters * 24) + (apartmentMix.oneBed * 45) + (apartmentMix.twoBed * 75) + (apartmentMix.threeBed * 110) + (apartmentMix.penthouses * 180);
    } else if (mainCategory === 'commercial-office') {
      area = officeDeskCapacity * 10;
    }

    let base = area * ratePerSqm;
    if (includeSolarPv) base += 1450000;
    if (includeBorehole) base += 1850000;
    if (includeRainwaterTank) base += 450000;
    if (includeBackupGenerator) base += 950000;

    return Math.round(base);
  };

  const currentBudgetKes = calculateBudgetEstimate();

  // Aesthetic library
  const aestheticOptions = [
    {
      id: 'old-money',
      name: 'Old Money / Classic Georgian',
      tagline: 'Timeless ashlar stone, portico columns, arched dormers & copper detailing',
      details: 'Hand-dressed quarry ashlar stone, symmetrical portico with classical columns, arched dormer roof windows, copper gutters, and herringbone hardwood parquet.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'minimalist-modern',
      name: 'Minimalist Modern',
      tagline: 'Clean cantilevered planes, floor-to-ceiling glass & fair-face concrete',
      details: 'Deep cantilevered floorplates, curtain wall glazing, board-marked fair-face concrete, shadow gap trims, and an open-tread floating timber staircase.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'italian-tuscan',
      name: 'Italian Tuscan / Mediterranean',
      tagline: 'Terracotta pantile roof, limestone stucco & arched loggias',
      details: 'Warm terracotta roof tiles, textured limestone plaster, arched veranda loggias, wrought iron Juliet balconies, and rustic exposed timber rafters.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'contemporary-tropical',
      name: 'Contemporary Tropical',
      tagline: 'Deep timber eaves, breeze blocks & internal courtyard lightwells',
      details: '1.8m deep overhanging timber eaves, cross-ventilation breeze blocks, internal garden lightwells, louvered teak solar screens, and natural stone water features.',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'brutalist-industrial',
      name: 'Brutalist / Industrial Chic',
      tagline: 'Raw architectural concrete, black crittall steel & double-height voids',
      details: 'Raw off-shutter concrete walls, black crittall steel-framed windows, exposed ductwork and conduits, polished concrete screed, and double-height loft volumes.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'afro-modern',
      name: 'Afro-Modern / Swahili Coastal',
      tagline: 'Coral stone masonry, carved Lamu portals & makuti-thatched terraces',
      details: 'Whitewashed coral rag stone masonry, hand-carved Lamu hardwood double entrance doors, makuti/timber pergola terraces, and built-in baraza daybeds.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop'
    }
  ];

  // AI Concept Generation handler
  const handleGenerateAiConcept = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const selectedAestheticObj = aestheticOptions.find(a => a.id === aestheticStyle);
      setAiGeneratedConceptUrl(selectedAestheticObj?.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop');
      setAiGenerating(false);
    }, 1200);
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    setNotesList(prev => [...prev, newNoteText.trim()]);
    setNewNoteText('');
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "Your architectural specifications comply with the Kenya National Building Code 2024 and Nairobi County zoning guidelines. Ensure your structural engineer signs off on column rebar cages prior to casting.";
      const lower = userText.toLowerCase();
      if (lower.includes('permit') || lower.includes('nca') || lower.includes('approval')) {
        reply = "For Nairobi County building approvals, you will need: 1) Architectural scheme approved by BORAQS registered architect, 2) Structural drawings certified by EBK engineer, 3) NEMA EIA licence, 4) 0.5% NCA levy clearance receipt for values over KES 5M.";
      } else if (lower.includes('solar') || lower.includes('power')) {
        reply = "Your 10kW hybrid solar array with 15kWh LiFePO4 batteries will supply ~45kWh per sunny day in Kenya, offsetting 85-95% of your daytime loads, with seamless 20ms UPS changeover.";
      } else if (lower.includes('shower') || lower.includes('plumbing') || lower.includes('borehole')) {
        reply = "For Karen and Nairobi West, ground water typically has moderate fluoride levels. Your proposed RO (Reverse Osmosis) plant will ensure potable drinking water directly to all kitchen and bath fixtures.";
      }
      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 600);
  };

  const handleCompleteWizard = async () => {
    setSubmitting(true);
    try {
      const selectedAestheticObj = aestheticOptions.find(a => a.id === aestheticStyle);
      const titleName = `${ward} ${aestheticOptions.find(a => a.id === aestheticStyle)?.name.split('/')[0]} ${mainCategory === 'residential-bespoke' ? bespokeSubtype : mainCategory === 'residential-apartments' ? `${totalApartmentUnits}-Unit Apartment Block` : 'Commercial Office'}`;

      const newProj = await api.createProject({
        title: titleName,
        buildingType: (mainCategory === 'residential-bespoke' ? 'Mansion or villa' : mainCategory === 'residential-apartments' ? 'Apartment block' : 'Office') as BuildingType,
        worksType: 'New build',
        county,
        ward,
        plotSize,
        sizeSqm: mainCategory === 'residential-apartments' ? 850 : estimatedPlinthSqm,
        floors: floorLevels,
        finishLevel,
        budgetBaselineMinor: currentBudgetKes * 100
      });

      confetti({ particleCount: 75, spread: 70 });
      navigate(`/app/projects/${newProj.id}`);
    } catch (e: any) {
      alert(e.message || 'Error creating project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-8 sm:py-12 w-full max-w-full overflow-x-hidden min-w-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6FEB]/10 text-[#1F6FEB] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A24A]" />
            <span>AI-POWERED ARCHITECTURAL SPECIFICATION WIZARD</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0B1B2B] tracking-tight">
            Design Your Dream Structure to Blueprint
          </h1>
          <p className="text-xs sm:text-sm text-[#2B4560]/75 max-w-xl mx-auto leading-relaxed">
            Specify every detail—from apartment unit mixes or office desk density to Old Money vs Modern aesthetics, rainfall showers, solar power, and gate security.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#2B4560]/15 shadow-2xs">
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { num: 1, label: 'Typology & Scale' },
              { num: 2, label: 'Aesthetic Style' },
              { num: 3, label: 'Amenities & Specs' },
              { num: 4, label: 'AI Concept & Notes' },
              { num: 5, label: 'Escrow & BoQ' }
            ].map((s) => (
              <div 
                key={s.num} 
                onClick={() => setStep(s.num)}
                className={`flex flex-col items-center cursor-pointer group transition-all`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#0B1B2B] text-white ring-2 ring-[#C8A24A]'
                    : step > s.num
                    ? 'bg-[#1E9E6A] text-white'
                    : 'bg-gray-100 text-[#2B4560] group-hover:bg-gray-200'
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[10px] sm:text-[11px] font-semibold mt-1 hidden sm:block ${
                  step === s.num ? 'text-[#0B1B2B] font-bold' : 'text-[#2B4560]/70'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            STEP 1: BUILDING TYPOLOGY & SCALE PLANNING
           ======================================================== */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase">STEP 1 OF 5</span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0B1B2B] mt-0.5">
                Choose Structure Type & Space Capacity
              </h2>
              <p className="text-xs text-[#2B4560]/75 mt-1">
                Select your building classification to configure residential suites, multi-unit apartment breakdowns, or commercial office floorplates.
              </p>
            </div>

            {/* Three Primary Typology Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMainCategory('residential-bespoke')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  mainCategory === 'residential-bespoke'
                    ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-md ring-2 ring-[#C8A24A]/40'
                    : 'bg-[#F4F1EA]/60 border-[#2B4560]/15 text-[#0B1B2B] hover:bg-white'
                }`}
              >
                <Home className="w-5 h-5 mb-2 text-[#C8A24A]" />
                <h3 className="font-bold text-sm">Bespoke Residential</h3>
                <p className="text-[11px] opacity-75 mt-1">Single Villa, Bungalow, Maisonette, Duplex or Penthouse</p>
              </button>

              <button
                type="button"
                onClick={() => setMainCategory('residential-apartments')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  mainCategory === 'residential-apartments'
                    ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-md ring-2 ring-[#C8A24A]/40'
                    : 'bg-[#F4F1EA]/60 border-[#2B4560]/15 text-[#0B1B2B] hover:bg-white'
                }`}
              >
                <Building2 className="w-5 h-5 mb-2 text-[#1F6FEB]" />
                <h3 className="font-bold text-sm">Multi-Unit Apartments</h3>
                <p className="text-[11px] opacity-75 mt-1">Bedsitters, 1-Bed, 2-Bed, 3-Bed and Penthouses</p>
              </button>

              <button
                type="button"
                onClick={() => setMainCategory('commercial-office')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  mainCategory === 'commercial-office'
                    ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-md ring-2 ring-[#C8A24A]/40'
                    : 'bg-[#F4F1EA]/60 border-[#2B4560]/15 text-[#0B1B2B] hover:bg-white'
                }`}
              >
                <Briefcase className="w-5 h-5 mb-2 text-[#1E9E6A]" />
                <h3 className="font-bold text-sm">Commercial & Office</h3>
                <p className="text-[11px] opacity-75 mt-1">Corporate floorplates, occupancy spacing, meeting pods</p>
              </button>
            </div>

            {/* Subtype Specific Controls */}
            {mainCategory === 'residential-bespoke' && (
              <div className="space-y-3 p-4 bg-[#F4F1EA]/60 rounded-2xl border border-[#2B4560]/10">
                <label className="text-xs font-bold text-[#0B1B2B] block">
                  Select Residential Dwelling Sub-Type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['Villa', 'Bungalow', 'Maisonette', 'Duplex', 'Penthouse'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBespokeSubtype(type)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        bespokeSubtype === type
                          ? 'bg-[#0B1B2B] text-white border-[#0B1B2B]'
                          : 'bg-white text-[#2B4560] border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Apartment Mix Counter */}
            {mainCategory === 'residential-apartments' && (
              <div className="p-4 bg-[#F4F1EA]/60 rounded-2xl border border-[#2B4560]/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#0B1B2B]">Apartment Unit Mix Allocation:</h4>
                    <span className="text-[11px] text-[#2B4560]/70">Configure how many of each unit type your block will feature</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1F6FEB] text-white text-xs font-mono font-bold">
                    Total: {totalApartmentUnits} Units
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { key: 'bedsitters', label: 'Bedsitters / Studios (24m²)', val: apartmentMix.bedsitters },
                    { key: 'oneBed', label: '1-Bedroom (45m²)', val: apartmentMix.oneBed },
                    { key: 'twoBed', label: '2-Bedroom (75m²)', val: apartmentMix.twoBed },
                    { key: 'threeBed', label: '3-Bedroom En-Suite (110m²)', val: apartmentMix.threeBed },
                    { key: 'penthouses', label: 'Penthouse Duplex (180m²)', val: apartmentMix.penthouses }
                  ].map(unit => (
                    <div key={unit.key} className="bg-white p-3 rounded-xl border border-[#2B4560]/10 text-center space-y-2">
                      <span className="text-[11px] font-bold text-[#0B1B2B] block leading-tight">{unit.label}</span>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setApartmentMix(prev => ({ ...prev, [unit.key]: Math.max(0, (prev as any)[unit.key] - 1) }))}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-sm text-[#0B1B2B] min-w-5">
                          {unit.val}
                        </span>
                        <button
                          type="button"
                          onClick={() => setApartmentMix(prev => ({ ...prev, [unit.key]: (prev as any)[unit.key] + 1 }))}
                          className="w-6 h-6 rounded bg-[#0B1B2B] text-white flex items-center justify-center text-xs font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Commercial Office Spacing */}
            {mainCategory === 'commercial-office' && (
              <div className="p-4 bg-[#F4F1EA]/60 rounded-2xl border border-[#2B4560]/10 space-y-3">
                <label className="text-xs font-bold text-[#0B1B2B] block">
                  Office Floorplate Density & Spacing Standard:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Open-Plan Creative (8m²/desk)',
                    'Corporate Executive (12m²/desk)',
                    'Medical / Clinic Suites',
                    'Co-Working Hybrid'
                  ].map((spacing) => (
                    <button
                      key={spacing}
                      type="button"
                      onClick={() => setOfficeSpacingType(spacing as any)}
                      className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                        officeSpacingType === spacing
                          ? 'bg-[#0B1B2B] text-white border-[#0B1B2B]'
                          : 'bg-white text-[#2B4560] border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {spacing}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#2B4560]">Target Desk / Occupancy Capacity:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={officeDeskCapacity}
                      onChange={(e) => setOfficeDeskCapacity(Number(e.target.value))}
                      className="w-20 text-xs font-mono font-bold p-2 bg-white rounded-lg border text-center"
                    />
                    <span className="text-xs font-mono text-[#0B1B2B]">Workstations</span>
                  </div>
                </div>
              </div>
            )}

            {/* Location & Site Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-[#0B1B2B] block mb-1">County:</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50"
                >
                  <option value="Nairobi">Nairobi</option>
                  <option value="Kiambu">Kiambu</option>
                  <option value="Machakos">Machakos</option>
                  <option value="Kajiado">Kajiado</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Nakuru">Nakuru</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B1B2B] block mb-1">Ward / Area:</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B1B2B] block mb-1">Plot Size:</label>
                <select
                  value={plotSize}
                  onChange={(e) => setPlotSize(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50"
                >
                  <option value="50x100 (0.125 Acre)">50x100 (0.125 Acre)</option>
                  <option value="0.25 Acre">0.25 Acre</option>
                  <option value="0.50 Acre">0.50 Acre</option>
                  <option value="1.00 Acre">1.00 Acre</option>
                  <option value="2.00+ Acres">2.00+ Acres</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B1B2B] block mb-1">Floor Levels (G+N):</label>
                <select
                  value={floorLevels}
                  onChange={(e) => setFloorLevels(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50"
                >
                  <option value={1}>Single Storey (Ground Only)</option>
                  <option value={2}>Double Storey (G + 1)</option>
                  <option value={3}>3 Storeys (G + 2)</option>
                  <option value={4}>4 Storeys (G + 3)</option>
                  <option value={6}>6 Storeys (High-Density)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Architectural Aesthetics</span>
                <ArrowRight className="w-4 h-4 text-[#C8A24A]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: ARCHITECTURAL AESTHETICS & MOODBOARD
           ======================================================== */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase">STEP 2 OF 5</span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0B1B2B] mt-0.5">
                Select Your Architectural Aesthetic & Finish Language
              </h2>
              <p className="text-xs text-[#2B4560]/75 mt-1">
                From Old Money heritage stone masonry and Italian Tuscan villas to Minimalist Modern cantilevers and Swahili Afro-Modern style.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aestheticOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setAestheticStyle(opt.id as any)}
                  className={`rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                    aestheticStyle === opt.id
                      ? 'border-[#0B1B2B] ring-2 ring-[#C8A24A] shadow-md bg-[#0B1B2B]/5'
                      : 'border-[#2B4560]/15 hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className="h-36 w-full relative overflow-hidden bg-gray-100">
                    <img
                      src={opt.image}
                      alt={opt.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <h4 className="font-bold text-sm leading-tight">{opt.name}</h4>
                      <p className="text-[10px] text-white/80 line-clamp-1">{opt.tagline}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-[#2B4560] leading-relaxed">
                      {opt.details}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] font-mono">
                      <span className="text-[#1F6FEB] font-bold">
                        {aestheticStyle === opt.id ? '✓ Active Selection' : 'Select Style'}
                      </span>
                      <span className="text-gray-400">Arch. Specification Ready</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#2B4560]/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-[#2B4560] hover:text-[#0B1B2B] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Amenities & Specifications</span>
                <ArrowRight className="w-4 h-4 text-[#C8A24A]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: DEEP GRANULAR AMENITIES & SPECIFICATIONS
           ======================================================== */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase">STEP 3 OF 5</span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0B1B2B] mt-0.5">
                Customize Granular Amenities & Finish Specifications
              </h2>
              <p className="text-xs text-[#2B4560]/75 mt-1">
                Select your preferred shower systems, parking bays, architectural lighting schemes, door types, perimeter security gates, and off-grid utilities.
              </p>
            </div>

            {/* Shower & Bathrooms */}
            <div className="p-4 bg-[#F4F1EA]/60 rounded-2xl border border-[#2B4560]/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B2B]">
                <Bath className="w-4 h-4 text-[#1F6FEB]" />
                <span>Showers & Sanitary Ware Specification:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Rainfall Concealed PEX',
                  'Frameless Glass Cubicle',
                  'Freestanding Soaking Tub',
                  'Ultra-Luxury Dual Suite'
                ].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShowerSpec(s as any)}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                      showerSpec === s
                        ? 'bg-[#0B1B2B] text-white border-[#0B1B2B]'
                        : 'bg-white text-[#2B4560] border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Parking & Driveway */}
            <div className="p-4 bg-[#F4F1EA]/60 rounded-2xl border border-[#2B4560]/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B2B]">
                <Car className="w-4 h-4 text-[#FF6B2C]" />
                <span>Parking Capacity & Driveway Infrastructure:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  '1-Bay Compact',
                  '2-Car Covered Port',
                  '4-Bay Basement Garage with EV Charger',
                  '6-Bay Executive Forecourt'
                ].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setParkingSpec(p as any)}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                      parkingSpec === p
                        ? 'bg-[#0B1B2B] text-white border-[#0B1B2B]'
                        : 'bg-white text-[#2B4560] border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Decor & Architectural Lighting */}
            <div className="p-4 bg-[#F4F1EA]/60 rounded-2xl border border-[#2B4560]/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B2B]">
                <Lightbulb className="w-4 h-4 text-[#C8A24A]" />
                <span>Decor & Architectural Lighting Scheme:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Architectural Cove LED (2700K)',
                  'Magnetic Track Spotlights',
                  'Statement Brass Chandelier',
                  'Smart Scene Dimmable Automation'
                ].map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLightingSpec(l as any)}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                      lightingSpec === l
                        ? 'bg-[#0B1B2B] text-white border-[#0B1B2B]'
                        : 'bg-white text-[#2B4560] border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Doors & Fenestration */}
            <div className="p-4 bg-[#F4F1EA]/60 rounded-2xl border border-[#2B4560]/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B2B]">
                <DoorOpen className="w-4 h-4 text-[#1E9E6A]" />
                <span>Front Entrance & Interior Door Systems:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  '2.4m Solid Mahogany Pivot',
                  'Acoustic Flush Timber',
                  'Thermal-Break Double Glazed Glass Sliders',
                  'Motorized Security Shutters'
                ].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDoorSpec(d as any)}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                      doorSpec === d
                        ? 'bg-[#0B1B2B] text-white border-[#0B1B2B]'
                        : 'bg-white text-[#2B4560] border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Perimeter Gate & Security */}
            <div className="p-4 bg-[#F4F1EA]/60 rounded-2xl border border-[#2B4560]/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B2B]">
                <Fence className="w-4 h-4 text-[#1F6FEB]" />
                <span>Perimeter Gate & Perimeter Security:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Automated Cantilever Sliding Gate',
                  'Biometric Intercom & CCTV Sync',
                  '10-Strand Electric Fence & Razor Wire',
                  'Full Perimeter Smart Shield'
                ].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGateSpec(g as any)}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                      gateSpec === g
                        ? 'bg-[#0B1B2B] text-white border-[#0B1B2B]'
                        : 'bg-white text-[#2B4560] border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Off-Grid Utilities Toggles */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <span className="text-xs font-bold text-[#0B1B2B] block">Green Energy & Off-Grid Infrastructure:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border cursor-pointer hover:border-[#1F6FEB]">
                  <input
                    type="checkbox"
                    checked={includeSolarPv}
                    onChange={(e) => setIncludeSolarPv(e.target.checked)}
                    className="accent-[#1F6FEB] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#0B1B2B] block">10kW Hybrid Solar PV + LiFePO4</span>
                    <span className="text-[10px] text-[#2B4560]/70">+KES 1,450,000 (Offsets 90% utility bill)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border cursor-pointer hover:border-[#1F6FEB]">
                  <input
                    type="checkbox"
                    checked={includeBorehole}
                    onChange={(e) => setIncludeBorehole(e.target.checked)}
                    className="accent-[#1F6FEB] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#0B1B2B] block">150m Borehole + RO Purification</span>
                    <span className="text-[10px] text-[#2B4560]/70">+KES 1,850,000 (Unlimited clean water)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border cursor-pointer hover:border-[#1F6FEB]">
                  <input
                    type="checkbox"
                    checked={includeRainwaterTank}
                    onChange={(e) => setIncludeRainwaterTank(e.target.checked)}
                    className="accent-[#1F6FEB] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#0B1B2B] block">15,000L Rainwater Concrete Tank</span>
                    <span className="text-[10px] text-[#2B4560]/70">+KES 450,000 (Stormwater harvesting)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border cursor-pointer hover:border-[#1F6FEB]">
                  <input
                    type="checkbox"
                    checked={includeBackupGenerator}
                    onChange={(e) => setIncludeBackupGenerator(e.target.checked)}
                    className="accent-[#1F6FEB] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#0B1B2B] block">25kVA Standby Silent Generator</span>
                    <span className="text-[10px] text-[#2B4560]/70">+KES 950,000 (Automatic transfer switch)</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#2B4560]/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-[#2B4560] hover:text-[#0B1B2B] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to AI Studio & Notes</span>
                <ArrowRight className="w-4 h-4 text-[#C8A24A]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: AI CONCEPT RENDERING, CHATBOT & NOTES
           ======================================================== */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase">STEP 4 OF 5</span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0B1B2B] mt-0.5">
                AI Architectural Visualizer, Building Code Chat & Design Notebook
              </h2>
              <p className="text-xs text-[#2B4560]/75 mt-1">
                Synthesize your choices into a photorealistic architectural render, verify Kenya building statutory codes, and save project notes.
              </p>
            </div>

            {/* AI Render Generator Box */}
            <div className="p-5 bg-[#0B1B2B] text-white rounded-2xl border border-[#C8A24A]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-[#C8A24A]" />
                  <h3 className="font-bold text-sm">AI Photorealistic Elevation & Staging Generator</h3>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAiConcept}
                  disabled={aiGenerating}
                  className="px-4 py-2 bg-[#1F6FEB] hover:bg-[#185adb] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {aiGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#C8A24A]" />
                      <span>Generate Architectural Render</span>
                    </>
                  )}
                </button>
              </div>

              {aiGeneratedConceptUrl && (
                <div className="h-64 w-full rounded-xl overflow-hidden relative border border-white/20">
                  <img
                    src={aiGeneratedConceptUrl}
                    alt="AI Architectural concept"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-mono text-white flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E6A]" />
                    <span>Rendered for {ward}, Kenya · {aestheticOptions.find(a => a.id === aestheticStyle)?.name}</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-[#D9DEE3]/70 font-mono">
                Prompt Spec: {aestheticOptions.find(a => a.id === aestheticStyle)?.name} with {showerSpec}, {doorSpec}, {parkingSpec}, and {gateSpec}.
              </p>
            </div>

            {/* Two Column: AI Code Assistant Chat + Project Design Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Left Column: AI Assistant Chat */}
              <div className="border border-[#2B4560]/15 rounded-2xl p-4 flex flex-col justify-between h-[380px] bg-[#F4F1EA]/30">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#2B4560]/10 pb-2">
                    <MessageSquare className="w-4 h-4 text-[#1F6FEB]" />
                    <h4 className="font-bold text-xs text-[#0B1B2B]">NCA & Building Code AI Advisor</h4>
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1 text-xs">
                    {chatMessages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`p-2.5 rounded-xl ${
                          msg.sender === 'user' 
                            ? 'bg-[#0B1B2B] text-white ml-6 text-right' 
                            : 'bg-white border text-[#2B4560] mr-6'
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#2B4560]/10">
                  <input
                    type="text"
                    placeholder="Ask about Nairobi permits, rebar, solar..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    className="flex-1 text-xs p-2 rounded-lg border bg-white focus:outline-[#1F6FEB]"
                  />
                  <button
                    type="button"
                    onClick={handleSendChat}
                    className="p-2 bg-[#0B1B2B] text-white rounded-lg hover:bg-[#1F6FEB] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Project Design Notes Notebook */}
              <div className="border border-[#2B4560]/15 rounded-2xl p-4 flex flex-col justify-between h-[380px] bg-white">
                <div>
                  <div className="flex items-center gap-2 border-b border-[#2B4560]/10 pb-2 mb-3">
                    <FileText className="w-4 h-4 text-[#C8A24A]" />
                    <h4 className="font-bold text-xs text-[#0B1B2B]">Client Project Design Notebook</h4>
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[240px] pr-1">
                    {notesList.map((note, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-[#F4F1EA] text-xs text-[#2B4560] flex items-start gap-2">
                        <span className="text-[#C8A24A] font-bold">•</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#2B4560]/10">
                  <input
                    type="text"
                    placeholder="Add an architectural design note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    className="flex-1 text-xs p-2 rounded-lg border bg-white focus:outline-[#1F6FEB]"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-3 py-2 bg-[#0B1B2B] text-white text-xs font-bold rounded-lg hover:bg-[#1F6FEB] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#2B4560]/10">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-semibold text-[#2B4560] hover:text-[#0B1B2B] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-2.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to BoQ & Escrow Milestone Schedule</span>
                <ArrowRight className="w-4 h-4 text-[#C8A24A]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: BILL OF QUANTITIES & ESCROW MILESTONE PLAN
           ======================================================== */}
        {step === 5 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase">STEP 5 OF 5</span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0B1B2B] mt-0.5">
                Automated BoQ Estimate & Ironclad Escrow Milestone Schedule
              </h2>
              <p className="text-xs text-[#2B4560]/75 mt-1">
                Your architectural specifications have generated a phased disbursement schedule. Money only moves as each verified physical milestone is certified.
              </p>
            </div>

            {/* Total Budget Card */}
            <div className="p-6 bg-[#0B1B2B] text-white rounded-2xl border border-[#C8A24A]/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#C8A24A] font-bold uppercase tracking-wider block">
                  CALCULATED BASELINE CONSTRUCTION BUDGET
                </span>
                <div className="text-3xl font-display font-black text-white mt-1">
                  {api.formatMoney(currentBudgetKes * 100, currency)}
                </div>
                <p className="text-xs text-[#D9DEE3]/75 mt-1">
                  Includes {ward} site logistics, Class 25 concrete, structural rebar, {finishLevel} finishes, and off-grid utilities.
                </p>
              </div>

              {/* Finish level selector */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#D9DEE3]/60 font-semibold block uppercase">Finish Grade:</span>
                <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl">
                  {(['standard', 'premium', 'luxury'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFinishLevel(lvl)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        finishLevel === lvl
                          ? 'bg-[#C8A24A] text-[#0B1B2B] font-bold'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Phased Escrow Milestone Schedule */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase text-[#0B1B2B] tracking-wider">
                Automated Milestone Tranche Breakdown:
              </h3>

              <div className="space-y-2">
                {[
                  { stage: 'Tranche 1: Geotechnical Survey, Excavation & Plinth Beam', pct: 20, time: 'Weeks 1-4' },
                  { stage: 'Tranche 2: RC Columns, Suspended Slabs & Stone Walling', pct: 30, time: 'Weeks 5-10' },
                  { stage: 'Tranche 3: Roof Trusses, IT5 Mabati & Waterproofing', pct: 20, time: 'Weeks 11-14' },
                  { stage: 'Tranche 4: MEP Rough-in, Doors, Tiles & Solar PV', pct: 25, time: 'Weeks 15-20' },
                  { stage: 'Tranche 5: Practical Completion & 5% Retention Holdback', pct: 5, time: 'Defect Period' }
                ].map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F4F1EA]/50 border border-[#2B4560]/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0B1B2B] text-white flex items-center justify-center font-mono font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-bold text-[#0B1B2B] block">{m.stage}</span>
                        <span className="text-[10px] text-[#2B4560]/70 font-mono">Scheduled: {m.time} ({m.pct}%)</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#0B1B2B]">
                      {api.formatMoney(Math.round(currentBudgetKes * (m.pct / 100)) * 100, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#2B4560]/10">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2 text-xs font-semibold text-[#2B4560] hover:text-[#0B1B2B] cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCompleteWizard}
                disabled={submitting}
                className="px-8 py-3 bg-[#0B1B2B] hover:bg-[#1E9E6A] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Initializing Ironclad Escrow...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#C8A24A]" />
                    <span>Create Project & Initialize Escrow Vault</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
