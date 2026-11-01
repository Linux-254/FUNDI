import React, { useState, useEffect } from 'react';
import { MarketplaceEntity } from '../types';
import { api } from '../lib/api';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Briefcase, 
  Hammer, 
  Package, 
  Truck,
  ArrowRight,
  Plus,
  Minus,
  ShoppingCart,
  Calendar,
  Fuel,
  UserCheck,
  Building2,
  FileCheck,
  Check,
  X,
  Phone,
  Clock,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarketplacePageProps {
  currency: 'KES' | 'USD';
}

interface EquipmentItem {
  id: string;
  name: string;
  category: 'Earthmoving' | 'Concrete & Mixing' | 'Lifting' | 'Compaction' | 'Access & Scaffolding' | 'Haulage';
  dailyRateKes: number;
  weeklyRateKes: number;
  availableCount: number;
  operatorIncluded: boolean;
  fuelPolicy: 'Dry Hire (Client Fuel)' | 'Wet Hire (Fuel Included)';
  locationHub: string;
  specs: string[];
  imageUrl: string;
  minimumRentalDays: number;
}

interface MaterialProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Cement & Binders' | 'Reinforcement Steel' | 'Stones & Aggregates' | 'Timber & Boards' | 'Finishes & Roofing';
  unit: string;
  pricePerUnitKes: number;
  minOrder: number;
  kebsStandard: string;
  deliveryTimeDays: string;
  sourceHub: string;
  description: string;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ currency }) => {
  const [activeMarketplaceTab, setActiveMarketplaceTab] = useState<'freelancers' | 'machinery' | 'materials'>('freelancers');
  const [entities, setEntities] = useState<MarketplaceEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');

  // Modals
  const [hireModalEntity, setHireModalEntity] = useState<MarketplaceEntity | null>(null);
  const [equipmentBookModal, setEquipmentBookModal] = useState<EquipmentItem | null>(null);
  const [bookingDays, setBookingDays] = useState(3);
  const [equipmentBookSuccess, setEquipmentBookSuccess] = useState(false);

  // Materials Cart State
  const [materialQuantities, setMaterialQuantities] = useState<Record<string, number>>({
    'mat-bamburi-425': 50,
    'mat-tmt-d16': 25,
    'mat-ndarugo-9x9': 500
  });
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [materialOrderSuccess, setMaterialOrderSuccess] = useState(false);

  useEffect(() => {
    api.getMarketplaceEntities().then(res => {
      let filtered = res;
      if (selectedCounty !== 'all') {
        filtered = filtered.filter(e => e.county.toLowerCase().includes(selectedCounty.toLowerCase()));
      }
      if (selectedRoleFilter !== 'all') {
        filtered = filtered.filter(e => e.category === selectedRoleFilter);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(e => 
          e.title.toLowerCase().includes(q) || 
          e.subtitle.toLowerCase().includes(q) ||
          e.skills.some(s => s.toLowerCase().includes(q))
        );
      }
      setEntities(filtered);
    });
  }, [searchQuery, selectedCounty, selectedRoleFilter]);

  // Heavy Equipment Inventory
  const equipmentInventory: EquipmentItem[] = [
    {
      id: 'eq-cat-320',
      name: 'Caterpillar 320D 20-Ton Tracked Excavator',
      category: 'Earthmoving',
      dailyRateKes: 28000,
      weeklyRateKes: 168000,
      availableCount: 4,
      operatorIncluded: true,
      fuelPolicy: 'Dry Hire (Client Fuel)',
      locationHub: 'Mombasa Road & Embakasi Depot',
      specs: ['1.0m³ heavy rock bucket', 'Certified licensed plant operator', 'Max digging depth 6.72m', 'Daily fuel consumption approx 18-22L/hr'],
      imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=800&auto=format&fit=crop',
      minimumRentalDays: 2
    },
    {
      id: 'eq-mixer-400',
      name: 'Winget 400L Diesel Concrete Drum Mixer',
      category: 'Concrete & Mixing',
      dailyRateKes: 4500,
      weeklyRateKes: 27000,
      availableCount: 9,
      operatorIncluded: true,
      fuelPolicy: 'Dry Hire (Client Fuel)',
      locationHub: 'Ruiru, Kiambu & Karen Yards',
      specs: ['Yanmar 10HP electric-start diesel engine', 'Yield 280L mixed concrete per batch', 'Towable pneumatic site tyres', 'Batch cycle 3 minutes'],
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
      minimumRentalDays: 1
    },
    {
      id: 'eq-scaff-100',
      name: 'Modular Cuplock Heavy-Duty Scaffolding (100-Frame Set)',
      category: 'Access & Scaffolding',
      dailyRateKes: 3800,
      weeklyRateKes: 22800,
      availableCount: 14,
      operatorIncluded: false,
      fuelPolicy: 'Dry Hire (Client Fuel)',
      locationHub: 'Industrial Area & Thika Depot',
      specs: ['Hot-dip galvanized EN 12810 certified', 'Includes base jacks, ledgers, tie bars & safety planks', 'Covers up to 350m² facade area', 'Certified load class 4 (300 kg/m²)'],
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=800&auto=format&fit=crop',
      minimumRentalDays: 7
    },
    {
      id: 'eq-compactor-90',
      name: 'Bomag 90kg Heavy Reversible Vibratory Plate Compactor',
      category: 'Compaction',
      dailyRateKes: 3500,
      weeklyRateKes: 21000,
      availableCount: 6,
      operatorIncluded: true,
      fuelPolicy: 'Dry Hire (Client Fuel)',
      locationHub: 'Westlands & Athi River Yards',
      specs: ['Honda GX160 engine (5.5HP)', 'Compaction force 20kN', 'Ideal for foundation trenches, plinth backfill & cabro pavers', 'Forward & reverse speed 24 m/min'],
      imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=800&auto=format&fit=crop',
      minimumRentalDays: 1
    },
    {
      id: 'eq-crane-25t',
      name: 'Sany 25-Ton Telescopic Mobile Hydraulic Truck Crane',
      category: 'Lifting',
      dailyRateKes: 48000,
      weeklyRateKes: 288000,
      availableCount: 2,
      operatorIncluded: true,
      fuelPolicy: 'Wet Hire (Fuel Included)',
      locationHub: 'Nairobi Central Fleet Depot',
      specs: ['34m four-section octagonal boom', 'NCA Certified Crane Operator & Rigger team included', 'Max lifting moment 960 kN.m', 'Outrigger span 6.0m x 5.2m'],
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      minimumRentalDays: 1
    },
    {
      id: 'eq-tipper-15t',
      name: 'Isuzu FVR 15-Ton Heavy Tipper Dump Truck',
      category: 'Haulage',
      dailyRateKes: 16000,
      weeklyRateKes: 96000,
      availableCount: 8,
      operatorIncluded: true,
      fuelPolicy: 'Dry Hire (Client Fuel)',
      locationHub: 'Naivasha Quarry / Nairobi Transfer Depot',
      specs: ['12m³ steel rock body with heavy tipping rams', 'Licensed commercial driver included', 'Ideal for quarry stone, ballast and excavated spoil cart-away', 'GPS tracked for real-time delivery proof'],
      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop',
      minimumRentalDays: 1
    }
  ];

  // Construction Materials Catalog
  const materialsCatalog: MaterialProduct[] = [
    {
      id: 'mat-bamburi-425',
      name: 'Bamburi Powerplus CEM I 42.5N Structural Cement',
      brand: 'Bamburi Cement PLC',
      category: 'Cement & Binders',
      unit: '50kg Bag',
      pricePerUnitKes: 890,
      minOrder: 20,
      kebsStandard: 'KS EAS 18-1: 2001 Standard Grade',
      deliveryTimeDays: 'Same Day / 24 Hours',
      sourceHub: 'Athi River Works & Nairobi Depots',
      description: 'High early-strength portland cement engineered for heavy structural foundations, columns, beams, suspended slabs, and precast concrete.'
    },
    {
      id: 'mat-bamburi-325',
      name: 'Bamburi Nguvu CEM II 32.5R Masonry & Plastering Cement',
      brand: 'Bamburi Cement PLC',
      category: 'Cement & Binders',
      unit: '50kg Bag',
      pricePerUnitKes: 790,
      minOrder: 20,
      kebsStandard: 'KS EAS 18-1: 2001',
      deliveryTimeDays: 'Same Day / 24 Hours',
      sourceHub: 'Athi River & Coast Hub',
      description: 'Optimized hydration heat for mortar bed joints, exterior plastering, internal skimming, and concrete paving.'
    },
    {
      id: 'mat-tmt-d16',
      name: 'High-Yield TMT Deformed Rebar D16 (12m Bar)',
      brand: 'Apex Steel / Devki TMT 500D',
      category: 'Reinforcement Steel',
      unit: '12-Metre Length',
      pricePerUnitKes: 2450,
      minOrder: 10,
      kebsStandard: 'BS 4449 / KS 573 Grade 500D',
      deliveryTimeDays: '1 Business Day',
      sourceHub: 'Nairobi Industrial Area & Ruiru Hub',
      description: 'Thermo-mechanically treated high-tensile rebar with 500 MPa yield strength, superior ductility, and earthquake resistance for main structural columns and beams.'
    },
    {
      id: 'mat-tmt-d12',
      name: 'High-Yield TMT Deformed Rebar D12 (12m Bar)',
      brand: 'Apex Steel / Devki TMT 500D',
      category: 'Reinforcement Steel',
      unit: '12-Metre Length',
      pricePerUnitKes: 1380,
      minOrder: 15,
      kebsStandard: 'BS 4449 / KS 573 Grade 500D',
      deliveryTimeDays: '1 Business Day',
      sourceHub: 'Industrial Area Yards',
      description: 'Primary reinforcement for suspended floor slabs, staircase waist slabs, and retaining wall reinforcement mats.'
    },
    {
      id: 'mat-ndarugo-9x9',
      name: 'Machine-Cut Ndarugo Blue/Grey Building Stones (9" × 9")',
      brand: 'Ndarugo Quarries Direct',
      category: 'Stones & Aggregates',
      unit: 'Running Foot (Per Piece)',
      pricePerUnitKes: 48,
      minOrder: 500,
      kebsStandard: 'KS 02-95 Quality Code',
      deliveryTimeDays: '24 - 48 Hours',
      sourceHub: 'Thika / Ndarugo Pit 4',
      description: 'Precision diamond-sawn basalt building stone with sharp right angles, reducing mortar joint consumption by 40% and accelerating masonry laying speed.'
    },
    {
      id: 'mat-sand-20t',
      name: 'Clean Naivasha / Machakos Coarse River Sand (20-Ton Tipper)',
      brand: 'Certified River Sand Co-op',
      category: 'Stones & Aggregates',
      unit: '20-Ton Full Truckload',
      pricePerUnitKes: 34000,
      minOrder: 1,
      kebsStandard: 'BS 882 Zone 2 Grading (<3% Silt Content)',
      deliveryTimeDays: 'Next Morning Delivery',
      sourceHub: 'Naivasha Riverbed & Athi Depot',
      description: 'Washed, organic-free silica sand engineered for maximum concrete compressive strength without shrinkage cracking.'
    },
    {
      id: 'mat-ballast-20t',
      name: 'Machine-Crushed Basalt Ballast 20mm (20-Ton Tipper)',
      brand: 'Athi River Quarry Works',
      category: 'Stones & Aggregates',
      unit: '20-Ton Full Truckload',
      pricePerUnitKes: 36000,
      minOrder: 1,
      kebsStandard: 'BS 882 Coarse Aggregate Standards',
      deliveryTimeDays: 'Next Day Delivery',
      sourceHub: 'Athi River Basalt Crater',
      description: 'Clean, angular volcanic basalt aggregate with optimal particle interlock for Class 20, Class 25, and Class 30 structural concrete.'
    },
    {
      id: 'mat-timber-2x4',
      name: 'Treated Cypress Formwork Timber 2" × 4" (12ft Length)',
      brand: 'TimSales / Kericho Sawmills',
      category: 'Timber & Boards',
      unit: '12ft Piece',
      pricePerUnitKes: 520,
      minOrder: 20,
      kebsStandard: 'KS 02-194 Structural Timber',
      deliveryTimeDays: '24 Hours',
      sourceHub: 'Ngara & Dagoretti Timber Yards',
      description: 'Straight seasoned cypress props and joists for supporting suspended slab formwork and roof purlin framing.'
    },
    {
      id: 'mat-roof-it5',
      name: 'IT5 Box Profile Matte Wrinkle Pre-Painted Roofing Sheets (Gauge 28)',
      brand: 'Mabati Rolling Mills (MRM)',
      category: 'Finishes & Roofing',
      unit: 'Linear Metre (Charcoal Grey)',
      pricePerUnitKes: 890,
      minOrder: 30,
      kebsStandard: 'KS EAS 414:2018 Zinc-Aluminium Coat',
      deliveryTimeDays: '2 Business Days',
      sourceHub: 'Mombasa Road MRM Service Center',
      description: 'Alu-Zinc coated with 20-year anti-fade warranty, anti-drip underlay, and heavy hail impact resistance.'
    }
  ];

  const handleUpdateQuantity = (id: string, delta: number) => {
    setMaterialQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Cart total calculations
  const cartItems = materialsCatalog
    .filter(m => (materialQuantities[m.id] || 0) > 0)
    .map(m => ({
      ...m,
      quantity: materialQuantities[m.id] || 0,
      totalCostKes: (materialQuantities[m.id] || 0) * m.pricePerUnitKes
    }));

  const cartSubtotalKes = cartItems.reduce((acc, item) => acc + item.totalCostKes, 0);
  const estimatedFreightKes = cartItems.length > 0 ? 8500 : 0;
  const grandTotalKes = cartSubtotalKes + estimatedFreightKes;

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-8 sm:py-12 w-full max-w-full overflow-x-hidden min-w-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Flagship Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#2B4560]/15 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#2B4560]/10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6FEB]/10 text-[#1F6FEB] text-xs font-mono font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24A]" />
                <span>VERIFIED KENYAN CONSTRUCTION MARKETPLACE</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0B1B2B] tracking-tight">
                Hire Talent, Rent Machinery & Order Materials.
              </h1>
              <p className="text-xs sm:text-sm text-[#2B4560]/80 mt-1.5 leading-relaxed">
                Connect with BORAQS architects, EBK structural engineers, vetted NCA contractors, reserve heavy excavation equipment, and procure direct-from-depot cement, rebar, and building stone under ironclad escrow protection.
              </p>
            </div>

            {/* Cart Trigger Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="px-4 py-2.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2.5 cursor-pointer text-xs font-semibold"
              >
                <ShoppingCart className="w-4 h-4 text-[#C8A24A]" />
                <span>Materials Depot Cart</span>
                <span className="w-5 h-5 rounded-full bg-[#C8A24A] text-[#0B1B2B] text-[10px] font-mono font-bold flex items-center justify-center">
                  {cartItems.length}
                </span>
              </button>
            </div>
          </div>

          {/* Three Flagship Marketplace Sector Navigation Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveMarketplaceTab('freelancers')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                activeMarketplaceTab === 'freelancers'
                  ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-md ring-2 ring-[#C8A24A]/40'
                  : 'bg-[#F4F1EA]/60 border-[#2B4560]/15 text-[#0B1B2B] hover:bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeMarketplaceTab === 'freelancers' ? 'bg-[#1F6FEB] text-white' : 'bg-white text-[#1F6FEB]'
              }`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider block opacity-75">
                  Sector 1
                </span>
                <h3 className="font-bold text-sm">Freelance Experts & Fundis</h3>
                <span className="text-[11px] opacity-70">Architects, Engineers, Masons, Electricians</span>
              </div>
            </button>

            <button
              onClick={() => setActiveMarketplaceTab('machinery')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                activeMarketplaceTab === 'machinery'
                  ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-md ring-2 ring-[#C8A24A]/40'
                  : 'bg-[#F4F1EA]/60 border-[#2B4560]/15 text-[#0B1B2B] hover:bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeMarketplaceTab === 'machinery' ? 'bg-[#FF6B2C] text-white' : 'bg-white text-[#FF6B2C]'
              }`}>
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider block opacity-75">
                  Sector 2
                </span>
                <h3 className="font-bold text-sm">Machinery & Plant Hire</h3>
                <span className="text-[11px] opacity-70">Excavators, Mixers, Cranes, Scaffolding</span>
              </div>
            </button>

            <button
              onClick={() => setActiveMarketplaceTab('materials')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                activeMarketplaceTab === 'materials'
                  ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-md ring-2 ring-[#C8A24A]/40'
                  : 'bg-[#F4F1EA]/60 border-[#2B4560]/15 text-[#0B1B2B] hover:bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeMarketplaceTab === 'materials' ? 'bg-[#1E9E6A] text-white' : 'bg-white text-[#1E9E6A]'
              }`}>
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider block opacity-75">
                  Sector 3
                </span>
                <h3 className="font-bold text-sm">Building Materials Depot</h3>
                <span className="text-[11px] opacity-70">Cement, TMT Rebar, Ndarugo Stone, Sand</span>
              </div>
            </button>
          </div>
        </div>

        {/* Anti-Circumvention Trust Banner */}
        <div className="p-4 bg-[#0B1B2B] text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-[#C8A24A]/30 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#C8A24A] shrink-0" />
            <p className="text-[#D9DEE3]/85">
              <strong className="text-white">Escrow Payment Protection:</strong> All fees, equipment hire deposits, and material order funds are held in custody. Payments only disburse once delivery receipts or verified milestones are certified.
            </p>
          </div>
          <span className="font-mono text-[#C8A24A] text-xs font-bold shrink-0">
            NPS Act · Custody Vault
          </span>
        </div>

        {/* ========================================================
            TAB 1: FREELANCER & EXPERT TALENT MARKETPLACE
           ======================================================== */}
        {activeMarketplaceTab === 'freelancers' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#2B4560]/15 flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, trade or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50 focus:bg-white focus:outline-[#1F6FEB]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="text-xs p-2 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50"
                >
                  <option value="all">All Disciplines</option>
                  <option value="expert">Registered Experts (BORAQS / EBK)</option>
                  <option value="contractor">NCA General Contractors</option>
                  <option value="labour">Master Masons & Fundis</option>
                </select>

                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="text-xs p-2 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50"
                >
                  <option value="all">Nationwide (All Counties)</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Kiambu">Kiambu</option>
                  <option value="Machakos">Machakos</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Nakuru">Nakuru</option>
                </select>
              </div>
            </div>

            {/* Talent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className="bg-white rounded-2xl border border-[#2B4560]/15 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3.5 mb-3">
                      <img
                        src={entity.photo}
                        alt={entity.title}
                        className="w-14 h-14 rounded-xl object-cover border border-[#2B4560]/20 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-[#0B1B2B] truncate">{entity.title}</h3>
                          <ShieldCheck className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#1F6FEB] block truncate">
                          {entity.registrationBadge}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-[#2B4560]/70 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#FF6B2C]" />
                            <span>{entity.county}</span>
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Star className="w-3 h-3 text-[#C8A24A] fill-[#C8A24A]" />
                            <span className="font-bold text-[#0B1B2B]">{entity.rating}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#2B4560] line-clamp-2 mb-3 leading-relaxed">
                      {entity.subtitle}
                    </p>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {entity.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#F4F1EA] text-[#2B4560] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Rates & CTA */}
                  <div className="pt-3 border-t border-[#2B4560]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#2B4560]/60 font-semibold block uppercase">Indicative Rate</span>
                      <span className="text-xs font-mono font-bold text-[#0B1B2B]">
                        {entity.rateDisplay}
                      </span>
                    </div>

                    <button
                      onClick={() => setHireModalEntity(entity)}
                      className="py-1.5 px-3 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      Engage & Request Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: HEAVY MACHINERY & EQUIPMENT RENTAL MARKETPLACE
           ======================================================== */}
        {activeMarketplaceTab === 'machinery' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#2B4560]/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-lg text-[#0B1B2B]">
                  Certified Plant & Heavy Machinery Hire
                </h2>
                <p className="text-xs text-[#2B4560]/80 mt-1">
                  All equipment is dispatched with calibrated safety certificates, inspected hydraulic systems, and verified licensed plant operators.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-lg bg-[#1E9E6A]/10 text-[#1E9E6A] font-bold border border-[#1E9E6A]/20">
                  43 Machines Active in Nairobi & Kiambu
                </span>
              </div>
            </div>

            {/* Machinery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipmentInventory.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#2B4560]/15 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 w-full relative overflow-hidden bg-gray-100">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#0B1B2B]/90 text-white text-[10px] font-mono font-bold">
                        {item.category}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#1E9E6A] text-white text-[10px] font-mono font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{item.availableCount} Available</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-sm text-[#0B1B2B] line-clamp-1">{item.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-[#2B4560]/70 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#FF6B2C]" />
                          <span>{item.locationHub}</span>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="space-y-1">
                        {item.specs.map((spec, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#2B4560]/80">
                            <span className="text-[#1F6FEB] font-bold">•</span>
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#F4F1EA] text-[#0B1B2B] flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-[#1E9E6A]" />
                          <span>{item.operatorIncluded ? 'Operator Included' : 'No Operator'}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#F4F1EA] text-[#0B1B2B] flex items-center gap-1">
                          <Fuel className="w-3 h-3 text-[#C8A24A]" />
                          <span>{item.fuelPolicy}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="p-5 pt-3 border-t border-[#2B4560]/10 flex items-center justify-between bg-gray-50/50">
                    <div>
                      <span className="text-[10px] text-[#2B4560]/60 font-semibold block uppercase">Daily Hire Rate</span>
                      <span className="text-xs font-mono font-bold text-[#0B1B2B]">
                        {api.formatMoney(item.dailyRateKes * 100, currency)} / day
                      </span>
                    </div>

                    <button
                      onClick={() => setEquipmentBookModal(item)}
                      className="py-1.5 px-3 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C8A24A]" />
                      <span>Reserve Plant</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: BUILDING MATERIALS MARKETPLACE & BOQ DEPOT
           ======================================================== */}
        {activeMarketplaceTab === 'materials' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#2B4560]/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-lg text-[#0B1B2B]">
                  Direct Manufacturer & Quarry Materials Depot
                </h2>
                <p className="text-xs text-[#2B4560]/80 mt-1">
                  Guaranteed genuine Bamburi/Savannah cement batches, certified Devki/Apex BS 4449 Grade 500D rebar, and machine-cut stone delivered directly with weighbridge dockets.
                </p>
              </div>

              <button
                onClick={() => setCartDrawerOpen(true)}
                className="px-4 py-2 bg-[#1E9E6A] hover:bg-[#188055] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>View Depot Cart ({cartItems.length} items)</span>
              </button>
            </div>

            {/* Materials Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materialsCatalog.map((prod) => {
                const qty = materialQuantities[prod.id] || 0;
                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-[#2B4560]/15 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold text-[#1F6FEB] uppercase bg-[#1F6FEB]/10 px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#2B4560]/70 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C8A24A]" />
                          <span>{prod.deliveryTimeDays}</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-[#0B1B2B]">{prod.name}</h3>
                      <p className="text-xs text-[#C8A24A] font-semibold">{prod.brand}</p>

                      <p className="text-xs text-[#2B4560]/80 mt-2 leading-relaxed">
                        {prod.description}
                      </p>

                      <div className="mt-3 p-2.5 rounded-xl bg-[#F4F1EA]/60 border border-[#2B4560]/10 text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#2B4560]/70">Standard:</span>
                          <span className="font-mono font-semibold text-[#0B1B2B]">{prod.kebsStandard}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#2B4560]/70">Dispatch Hub:</span>
                          <span className="text-[#0B1B2B]">{prod.sourceHub}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Cart Stepper */}
                    <div className="mt-4 pt-3 border-t border-[#2B4560]/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#2B4560]/60 font-semibold uppercase block">
                          Unit Price ({prod.unit})
                        </span>
                        <span className="text-sm font-mono font-bold text-[#0B1B2B]">
                          {api.formatMoney(prod.pricePerUnitKes * 100, currency)}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 bg-[#F4F1EA] p-1 rounded-xl border border-[#2B4560]/20">
                        <button
                          onClick={() => handleUpdateQuantity(prod.id, -10)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 text-[#0B1B2B] flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
                          title="Reduce quantity by 10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold min-w-8 text-center text-[#0B1B2B]">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(prod.id, 10)}
                          className="w-7 h-7 rounded-lg bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
                          title="Add 10 units"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          MODAL: FREELANCER ENGAGEMENT
         ======================================================== */}
      {hireModalEntity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#2B4560]/20 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#1F6FEB] font-bold uppercase">
                  INITIALIZE PLATFORM ENGAGEMENT
                </span>
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Engage {hireModalEntity.title}
                </h3>
              </div>
              <button 
                onClick={() => setHireModalEntity(null)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#F4F1EA] rounded-xl text-xs space-y-1 text-[#2B4560]">
              <p>• Board Registration: <strong className="text-[#0B1B2B]">{hireModalEntity.registrationBadge}</strong></p>
              <p>• Operating County: <strong className="text-[#0B1B2B]">{hireModalEntity.county}</strong></p>
              <p>• Indicative Rate: <strong className="text-[#0B1B2B]">{hireModalEntity.rateDisplay}</strong></p>
            </div>

            <p className="text-xs text-[#2B4560] leading-relaxed">
              Initiating this engagement links this professional to your project workspace. Direct unmasked communication and digital contract drafting will unlock under FUNDI milestone escrow protection.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setHireModalEntity(null)}
                className="flex-1 py-2 text-xs font-semibold text-[#2B4560] border rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <Link
                to="/app/projects/proj-karen-villa"
                onClick={() => setHireModalEntity(null)}
                className="flex-1 py-2 text-xs font-bold text-center text-white bg-[#0B1B2B] hover:bg-[#1F6FEB] rounded-lg shadow-sm transition-colors"
              >
                Assign to Project
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EQUIPMENT HIRE RESERVATION
         ======================================================== */}
      {equipmentBookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#2B4560]/20 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#FF6B2C] font-bold uppercase">
                  PLANT & MACHINERY RESERVATION
                </span>
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Reserve {equipmentBookModal.name}
                </h3>
              </div>
              <button 
                onClick={() => { setEquipmentBookModal(null); setEquipmentBookSuccess(false); }}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            {equipmentBookSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1E9E6A]/20 text-[#1E9E6A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#0B1B2B]">Equipment Reserved & Locked in Escrow!</h4>
                <p className="text-xs text-[#2B4560]/80">
                  The plant mobilization team will contact you for GPS coordinates. Payment of {api.formatMoney(equipmentBookModal.dailyRateKes * bookingDays * 100, currency)} is securely held in the escrow custody vault until the equipment clocks in on site.
                </p>
                <button
                  onClick={() => { setEquipmentBookModal(null); setEquipmentBookSuccess(false); }}
                  className="px-6 py-2 bg-[#0B1B2B] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="p-3 bg-[#F4F1EA] rounded-xl text-xs space-y-1.5 text-[#2B4560]">
                  <div className="flex justify-between">
                    <span>Daily Rental Rate:</span>
                    <strong className="font-mono text-[#0B1B2B]">{api.formatMoney(equipmentBookModal.dailyRateKes * 100, currency)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Plant Operator:</span>
                    <strong className="text-[#0B1B2B]">{equipmentBookModal.operatorIncluded ? 'Licensed Operator Included' : 'Client Operator'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Policy:</span>
                    <strong className="text-[#0B1B2B]">{equipmentBookModal.fuelPolicy}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B1B2B] block">
                    Rental Duration (Days):
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 3, 7, 14, 30].map(d => (
                      <button
                        key={d}
                        onClick={() => setBookingDays(d)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                          bookingDays === d 
                            ? 'bg-[#0B1B2B] text-white border-[#0B1B2B]' 
                            : 'bg-white text-[#2B4560] border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {d} {d === 1 ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B1B2B] block">
                    Site Delivery Location / Landmark:
                  </label>
                  <input
                    type="text"
                    defaultValue="Karen Plot LR 330/512, Nairobi"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50"
                  />
                </div>

                <div className="pt-3 border-t border-[#2B4560]/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#2B4560]/60 uppercase font-semibold block">Total Escrow Deposit</span>
                    <span className="text-sm font-mono font-extrabold text-[#0B1B2B]">
                      {api.formatMoney(equipmentBookModal.dailyRateKes * bookingDays * 100, currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => setEquipmentBookSuccess(true)}
                    className="py-2 px-5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#C8A24A]" />
                    <span>Lock Funds in Escrow</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          DRAWER: MATERIALS DEPOT CART & CHECKOUT
         ======================================================== */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white max-w-md w-full h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#1E9E6A]" />
                  <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                    Depot Materials Requisition
                  </h3>
                </div>
                <button 
                  onClick={() => { setCartDrawerOpen(false); setMaterialOrderSuccess(false); }}
                  className="text-gray-400 hover:text-black cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {materialOrderSuccess ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#1E9E6A]/20 text-[#1E9E6A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#0B1B2B]">Requisition Locked in Escrow!</h4>
                  <p className="text-xs text-[#2B4560]/80">
                    Depot dispatch has received order for your project site. Delivery dockets with digital weighbridge certificates will be generated. Payout is released upon Clerk of Works delivery verification.
                  </p>
                  <button
                    onClick={() => { setCartDrawerOpen(false); setMaterialOrderSuccess(false); }}
                    className="px-6 py-2 bg-[#0B1B2B] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-xs">
                      No materials selected yet. Use the + buttons in the depot to add materials.
                    </div>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="p-3 rounded-xl bg-[#F4F1EA]/60 border border-[#2B4560]/10 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <h4 className="font-bold text-xs text-[#0B1B2B] truncate">{item.name}</h4>
                          <span className="text-[11px] font-mono text-[#2B4560]/70">
                            {item.quantity} {item.unit} @ {api.formatMoney(item.pricePerUnitKes * 100, currency)}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-xs text-[#0B1B2B] shrink-0">
                          {api.formatMoney(item.totalCostKes * 100, currency)}
                        </span>
                      </div>
                    ))
                  )}

                  {cartItems.length > 0 && (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5 font-mono">
                      <div className="flex justify-between text-[#2B4560]">
                        <span>Materials Subtotal:</span>
                        <span>{api.formatMoney(cartSubtotalKes * 100, currency)}</span>
                      </div>
                      <div className="flex justify-between text-[#2B4560]">
                        <span>Delivery Freight (Tipper/Flatbed):</span>
                        <span>{api.formatMoney(estimatedFreightKes * 100, currency)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-[#0B1B2B] text-sm pt-2 border-t">
                        <span>Total Escrow Lock:</span>
                        <span className="text-[#1E9E6A]">{api.formatMoney(grandTotalKes * 100, currency)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!materialOrderSuccess && cartItems.length > 0 && (
              <div className="pt-4 border-t space-y-2">
                <button
                  onClick={() => setMaterialOrderSuccess(true)}
                  className="w-full py-3 bg-[#0B1B2B] hover:bg-[#1E9E6A] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#C8A24A]" />
                  <span>Lock Requisition in Escrow</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
