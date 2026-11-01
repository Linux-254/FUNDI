import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  FileText, 
  Scale, 
  HardHat, 
  Truck, 
  Layers, 
  Calculator, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ChevronRight,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import { api } from '../lib/api';
import { 
  KnowledgeBaseData, 
  SectorPack, 
  FeeScheduleItem, 
  CementItem, 
  AggregateWallingItem, 
  MachineryRateItem,
  DocumentChecklistItem,
  StatutoryAgency,
  NcaClassLimit
} from '../types';
import { IndicativeBadge } from '../components/common/IndicativeBadge';

export const KnowledgeBasePage: React.FC = () => {
  const [kb, setKb] = useState<KnowledgeBaseData | null>(null);
  const [activeTab, setActiveTab] = useState<'sectors' | 'nca' | 'materials' | 'machinery' | 'safety' | 'agencies'>('sectors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectorId, setSelectedSectorId] = useState<string>('sector-residential');
  const [checklistStageFilter, setChecklistStageFilter] = useState<'all' | 'before' | 'during' | 'after' | 'lifecycle'>('all');

  // Interactive Rebar Calculator State
  const [rebarDiameter, setRebarDiameter] = useState<number>(12);
  const [rebarLengthM, setRebarLengthM] = useState<number>(12);
  const [rebarQuantity, setRebarQuantity] = useState<number>(50);

  // Interactive NCA Levy Calculator State
  const [projectValueInput, setProjectValueInput] = useState<number>(18500000);

  useEffect(() => {
    api.getKnowledgeBase().then(setKb);
  }, []);

  if (!kb) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-xs font-mono text-[#0B1B2B]">
          <div className="w-4 h-4 border-2 border-[#1F6FEB] border-t-transparent rounded-full animate-spin" />
          <span>Loading FUNDI Regulatory & Technical Knowledge Base...</span>
        </div>
      </div>
    );
  }

  // Calculate Rebar values
  const rebarCalc = api.calculateSteelWeight(rebarDiameter, rebarLengthM);
  const totalRebarWeightKg = Number((rebarCalc.kgPerMetre * rebarLengthM * rebarQuantity).toFixed(2));
  const totalRebarTonnes = Number((totalRebarWeightKg / 1000).toFixed(3));
  const estRebarPriceMinKes = Math.round(totalRebarTonnes * kb.reinforcementSteel.bulkKesPerTonne.min);
  const estRebarPriceMaxKes = Math.round(totalRebarTonnes * kb.reinforcementSteel.bulkKesPerTonne.max);

  // Calculate NCA Levy
  const ncaLevyCalc = api.calculateNcaLevy(projectValueInput);
  const requiredNcaClass = kb.ncaClassLimits.slice().reverse().find(lim => {
    if (lim.contractValueLimitKes === 'Unlimited') return true;
    return projectValueInput <= lim.contractValueLimitKes;
  }) || kb.ncaClassLimits[0];

  // Selected Sector
  const currentSector = kb.sectorPacks.find(s => s.id === selectedSectorId) || kb.sectorPacks[0];

  // Filtered Checklist
  const filteredChecklist = kb.documentChecklist.filter(item => {
    const matchesStage = checklistStageFilter === 'all' || item.stage === checklistStageFilter;
    const matchesSearch = searchQuery === '' || 
      item.doc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.appliesTo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#0B1B2B] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-[#0B1B2B] text-white rounded-2xl p-6 sm:p-10 border border-[#2B4560]/30 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-mono font-medium text-[#C8A24A]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>FUNDI KENYA TECHNICAL & REGULATORY KNOWLEDGE BASE v1</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Sector Packs, Statutory Standards & Price Book
            </h1>
            <p className="text-sm sm:text-base text-[#D9DEE3]/80 leading-relaxed">
              Kenya-specific compliance engine, NCA contract limits, statutory fee calculators, OSHA safety signages, and material rate snapshots grounded in BORAQS, EBK, NCA, NEMA, and DOSHS standards.
            </p>
            
            {/* Quick Metrics */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white/60 block font-sans text-[11px]">Sector Packs</span>
                <span className="text-lg font-bold text-white">12 Sectors</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white/60 block font-sans text-[11px]">Statutory Agencies</span>
                <span className="text-lg font-bold text-[#C8A24A]">24 Regulators</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white/60 block font-sans text-[11px]">NCA Class Limits</span>
                <span className="text-lg font-bold text-[#1E9E6A]">NCA 1 to 8</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white/60 block font-sans text-[11px]">Safety Protocols</span>
                <span className="text-lg font-bold text-[#1F6FEB]">OSHA 2007</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strict Data Quality Warning Banner */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sm block">FUNDI Data Quality & Fiduciary Guarantee</span>
            <p className="text-amber-900/90 leading-relaxed">
              Every regulatory requirement, rate, and fee carries a verification pedigree. Records marked <strong className="font-mono bg-amber-200/60 px-1.5 py-0.5 rounded text-[10px]">Indicative · verify</strong> are benchmark snapshots from industry surveys and <strong className="underline">cannot be used in final binding contracts or statutory filings</strong> until verified against primary Kenya Gazette notices, county fee schedules, or supplier certificates.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 w-full max-w-full overflow-x-auto scrollbar-none pb-2 border-b border-[#2B4560]/15 text-xs font-semibold shrink-0">
          {[
            { id: 'sectors', label: '12 Sector Packs & Approvals', icon: Layers },
            { id: 'nca', label: 'NCA Class Limits & 0.5% Levy', icon: Scale },
            { id: 'materials', label: 'Price Book & Steel Calculator', icon: Calculator },
            { id: 'machinery', label: 'Machinery & Plant Hire', icon: Truck },
            { id: 'safety', label: 'OSHA & Bilingual Safety Signs', icon: HardHat },
            { id: 'agencies', label: '24 Statutory Agencies & Checklists', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0B1B2B] text-white shadow-sm font-bold'
                    : 'bg-white text-[#2B4560] hover:bg-[#F4F1EA] border border-[#2B4560]/10'
                }`}
              >
                <Icon className="w-4 h-4 text-[#C8A24A]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* TAB 1: 12 SECTOR PACKS */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'sectors' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sector Selector Sidebar */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B4560]/70 block px-1">
                Select Sector Blueprint
              </span>
              <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-2xs divide-y divide-[#2B4560]/10 max-h-[640px] overflow-y-auto">
                {kb.sectorPacks.map(sector => (
                  <div
                    key={sector.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedSectorId(sector.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedSectorId(sector.id);
                      }
                    }}
                    className={`w-full text-left p-3.5 flex items-start justify-between gap-2 transition-colors cursor-pointer select-none ${
                      selectedSectorId === sector.id 
                        ? 'bg-[#1F6FEB]/10 border-l-4 border-[#1F6FEB]' 
                        : 'hover:bg-[#F4F1EA]/60'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-bold block ${selectedSectorId === sector.id ? 'text-[#1F6FEB]' : 'text-[#0B1B2B]'}`}>
                        {sector.label}
                      </span>
                      <span className="text-[11px] text-[#2B4560]/70 line-clamp-1">
                        {sector.types.slice(0, 2).join(', ')}
                      </span>
                    </div>
                    <IndicativeBadge record={sector} size="xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sector Details Panel */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-[#2B4560]/15 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B4560]/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#0B1B2B] text-white font-mono text-[10px] rounded uppercase">
                      Sector Pack
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1B2B]">
                      {currentSector.label}
                    </h2>
                  </div>
                  <p className="text-xs text-[#2B4560]/80 mt-1">
                    {currentSector.types.join(' · ')}
                  </p>
                </div>
                <IndicativeBadge record={currentSector} size="sm" />
              </div>

              {/* Grid of Disciplines & Systems */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F4F1EA]/60 rounded-xl border border-[#2B4560]/10 space-y-2">
                  <span className="text-xs font-bold text-[#0B1B2B] block flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#1F6FEB]" />
                    Mandatory Disciplines Required
                  </span>
                  <ul className="text-xs text-[#2B4560] space-y-1">
                    {(currentSector.extraProfessionals && currentSector.extraProfessionals.length > 0
                      ? currentSector.extraProfessionals
                      : ['Principal Architect (BORAQS)', 'Structural Engineer (EBK)', 'Quantity Surveyor (BORAQS)', 'Site Supervisor (NCA)']
                    ).map((d: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1F6FEB]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#F4F1EA]/60 rounded-xl border border-[#2B4560]/10 space-y-2">
                  <span className="text-xs font-bold text-[#0B1B2B] block flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1E9E6A]" />
                    Special MEP & Functional Systems
                  </span>
                  <ul className="text-xs text-[#2B4560] space-y-1">
                    {currentSector.specialSystems.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E6A]" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Approvals */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
                <span className="text-xs font-bold text-[#0B1B2B] block">
                  Key Sector Regulators & Statutory Approvals
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentSector.keyApprovals.map((app, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-blue-200 rounded-md text-[11px] font-medium text-blue-900 shadow-2xs">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestone Template Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B4560]/70">
                    Standard Milestone Delivery Sequence
                  </span>
                  <span className="text-xs text-[#2B4560]/60">
                    {(currentSector.milestoneTemplate || []).length} Escrow Gates
                  </span>
                </div>

                <div className="border border-[#2B4560]/15 rounded-xl overflow-hidden divide-y divide-[#2B4560]/10 text-xs">
                  {(currentSector.milestoneTemplate || []).map((msTitle: string, i: number) => (
                    <div key={i} className="p-3.5 hover:bg-[#F4F1EA]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#0B1B2B] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="font-bold text-[#0B1B2B]">{msTitle}</span>
                        </div>
                        <p className="text-[11px] text-[#2B4560]/80 pl-7">
                          Verification Criteria: <span className="font-mono text-gray-800">Licensed consultant stage sign-off + geo-tagged site log</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-[#F4F1EA] text-[#2B4560] font-mono text-[10px] rounded border border-[#2B4560]/15 self-start sm:self-auto ml-7 sm:ml-0">
                        Gate {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* TAB 2: NCA CONTRACT VALUE LIMITS & LEVY */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'nca' && (
          <div className="space-y-6">
            {/* Regulatory Grounding Note */}
            <div className="bg-white rounded-xl p-6 border border-[#2B4560]/15 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#1F6FEB]" />
                <h2 className="font-display text-lg font-bold text-[#0B1B2B]">
                  National Construction Authority (NCA) Class Eligibility Standard
                </h2>
              </div>
              <p className="text-xs text-[#2B4560] leading-relaxed">
                <strong className="font-semibold text-red-700">Important Compliance Rule:</strong> Contrary to common misconceptions, Kenyan construction law does <strong className="underline">not</strong> tie NCA contractor registration classes directly to building types (e.g. bungalow vs apartment). NCA eligibility is strictly defined by <strong className="font-semibold">financial contract value limits</strong> and registered works categories published under the National Construction Authority Act (Cap 449A).
              </p>
            </div>

            {/* Interactive NCA Class & Statutory Levy Calculator */}
            <div className="bg-gradient-to-br from-[#0B1B2B] to-[#152B42] text-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/40 shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#C8A24A]" />
                <h3 className="font-display text-base font-bold">
                  Interactive NCA Contractor Class & 0.5% Construction Levy Calculator
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 space-y-3">
                  <label className="text-xs font-mono text-white/80 block">
                    Enter Total Contract Value (KES):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-mono text-xs text-white/50">KES</span>
                    <input
                      type="number"
                      step={500000}
                      value={projectValueInput}
                      onChange={(e) => setProjectValueInput(Number(e.target.value) || 0)}
                      className="w-full pl-12 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-base font-bold focus:outline-hidden focus:border-[#C8A24A]"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[3500000, 18500000, 45000000, 150000000].map(val => (
                      <button
                        key={val}
                        onClick={() => setProjectValueInput(val)}
                        className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-[10px] font-mono text-white/80 transition-colors"
                      >
                        {(val / 1000000).toFixed(1)}M
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 bg-white/10 rounded-xl border border-white/15 space-y-1">
                    <span className="text-white/60 font-sans block text-[11px]">Minimum Required Contractor:</span>
                    <span className="text-xl font-bold text-[#C8A24A] block">
                      {requiredNcaClass.ncaClass}
                    </span>
                    <span className="text-[11px] text-white/70 block font-sans">
                      Eligible up to {requiredNcaClass.displayLimit}
                    </span>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl border border-white/15 space-y-1">
                    <span className="text-white/60 font-sans block text-[11px]">NCA Statutory Levy (0.5% &gt; KES 5M):</span>
                    <span className="text-xl font-bold text-[#1E9E6A] block">
                      KES {ncaLevyCalc.levyKes.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-white/70 block font-sans">
                      {ncaLevyCalc.isApplicable ? 'Payable within 30 days of award' : 'Exempt (Value <= KES 5M)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-white/70 bg-white/5 p-3 rounded-lg border border-white/10 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#C8A24A] shrink-0 mt-0.5" />
                <span>
                  <strong>Statutory Reminder:</strong> The developer must register the project and pay the 0.5% NCA levy within 30 days of contract award. An NCA compliance certificate and official site signboard are mandatory prior to groundbreaking.
                </span>
              </div>
            </div>

            {/* NCA 1 to 8 Limits Table */}
            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs overflow-hidden">
              <div className="p-4 bg-[#F4F1EA]/80 border-b border-[#2B4560]/15 flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1B2B]">
                  NCA Contractor Registration Classes & Contract Value Limits
                </span>
                <span className="text-xs text-[#2B4560]/70 font-mono">Source: National Construction Authority Gazette</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2B4560]/10 bg-gray-50/50 font-mono text-[11px] text-[#2B4560]">
                      <th className="py-3 px-4 font-bold">Class</th>
                      <th className="py-3 px-4 font-bold">Category</th>
                      <th className="py-3 px-4 font-bold">Max Contract Value Limit (KES)</th>
                      <th className="py-3 px-4 font-bold">Typical Eligible Works Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B4560]/10">
                    {kb.ncaClassLimits.map(row => (
                      <tr 
                        key={row.ncaClass}
                        className={`hover:bg-[#F4F1EA]/40 transition-colors ${
                          requiredNcaClass.ncaClass === row.ncaClass ? 'bg-amber-500/10 font-medium' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#0B1B2B] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#1F6FEB]" />
                          <span>{row.ncaClass}</span>
                        </td>
                        <td className="py-3 px-4 text-[#2B4560]">{row.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#0B1B2B]">
                          {row.displayLimit}
                        </td>
                        <td className="py-3 px-4 text-[#2B4560]/80">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* TAB 3: MATERIALS PRICE BOOK & STEEL CALCULATOR */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'materials' && (
          <div className="space-y-8">
            
            {/* Interactive BS 4449 Steel Rebar Calculator */}
            <div className="bg-[#0B1B2B] text-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/40 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#C8A24A]" />
                    <h2 className="font-display text-lg sm:text-xl font-bold">
                      Interactive BS 4449 Steel Weight & Take-Off Calculator
                    </h2>
                  </div>
                  <p className="text-xs text-white/70 mt-1">
                    Grounded in the standard unit weight formula: <span className="font-mono text-[#C8A24A]">w = d² / 162 kg/m</span> (Kenya Bureau of Standards &amp; British Standard 4449 Grade 500).
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-white/60 block">Bulk Tone Baseline:</span>
                  <span className="text-xs font-mono font-bold text-[#1E9E6A]">
                    KES {kb.reinforcementSteel.bulkKesPerTonne.min.toLocaleString()} – {kb.reinforcementSteel.bulkKesPerTonne.max.toLocaleString()} / Tonne
                  </span>
                </div>
              </div>

              {/* Calculator Inputs & Output */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-6 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-mono text-white/70 block mb-1">Bar Diameter (d):</label>
                    <select
                      value={rebarDiameter}
                      onChange={(e) => setRebarDiameter(Number(e.target.value))}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white font-mono font-bold text-xs"
                    >
                      {[8, 10, 12, 16, 20, 25, 32].map(d => (
                        <option key={d} value={d} className="text-gray-900">D{d} ({d}mm)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-white/70 block mb-1">Bar Length (m):</label>
                    <input
                      type="number"
                      value={rebarLengthM}
                      onChange={(e) => setRebarLengthM(Number(e.target.value) || 12)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-white/70 block mb-1">No. of Bars:</label>
                    <input
                      type="number"
                      value={rebarQuantity}
                      onChange={(e) => setRebarQuantity(Number(e.target.value) || 1)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/15">
                    <span className="text-white/60 font-sans block text-[10px]">Unit Weight:</span>
                    <span className="text-base font-bold text-white block">{rebarCalc.kgPerMetre} kg/m</span>
                    <span className="text-[10px] text-white/60">Single bar: {(rebarCalc.kgPerMetre * rebarLengthM).toFixed(2)} kg</span>
                  </div>

                  <div className="p-3 bg-white/10 rounded-xl border border-white/15">
                    <span className="text-white/60 font-sans block text-[10px]">Batch Weight:</span>
                    <span className="text-base font-bold text-[#C8A24A] block">{totalRebarWeightKg} kg</span>
                    <span className="text-[10px] text-white/60 font-sans">({totalRebarTonnes} Tonnes)</span>
                  </div>

                  <div className="p-3 bg-white/10 rounded-xl border border-white/15 col-span-2 sm:col-span-1">
                    <span className="text-white/60 font-sans block text-[10px]">Estimated Cost:</span>
                    <span className="text-xs font-bold text-[#1E9E6A] block">
                      KES {estRebarPriceMinKes.toLocaleString()} - {estRebarPriceMaxKes.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-white/60 font-sans">excl. transport</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rebar Retail Sizes Table */}
            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs overflow-hidden space-y-2">
              <div className="p-4 bg-[#F4F1EA]/80 border-b border-[#2B4560]/15 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0B1B2B]">
                    Reinforcement Steel Bar Catalog (BS 4449 Standard 12-Metre Bars)
                  </h3>
                  <span className="text-xs text-[#2B4560]/70">
                    Verified mills: Devki, Apex Steel, Tononoka, Prime Steel, Jumbo
                  </span>
                </div>
                <IndicativeBadge record={kb.reinforcementSteel.bulkKesPerTonne} size="sm" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2B4560]/10 bg-gray-50/50 font-mono text-[11px] text-[#2B4560]">
                      <th className="py-2.5 px-4 font-bold">Bar Size</th>
                      <th className="py-2.5 px-4 font-bold">Structural Application</th>
                      <th className="py-2.5 px-4 font-bold">Weight (kg/m)</th>
                      <th className="py-2.5 px-4 font-bold text-right">Price per 12m Bar (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B4560]/10">
                    {kb.reinforcementSteel.retail12mBars.map(bar => (
                      <tr key={bar.size} className="hover:bg-[#F4F1EA]/40">
                        <td className="py-2.5 px-4 font-mono font-bold text-[#0B1B2B]">{bar.size}</td>
                        <td className="py-2.5 px-4 text-[#2B4560]">{bar.use}</td>
                        <td className="py-2.5 px-4 font-mono text-[#0B1B2B]">{bar.kgPerMetre} kg/m</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-right text-[#0B1B2B]">
                          KES {bar.kesMin.toLocaleString()} – {bar.kesMax.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cement Grades & Products */}
            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs overflow-hidden space-y-2">
              <div className="p-4 bg-[#F4F1EA]/80 border-b border-[#2B4560]/15 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0B1B2B]">
                    Kenya Cement Catalog: Grades 22.5, 32.5 &amp; 42.5
                  </h3>
                  <span className="text-xs text-[#2B4560]/70">
                    Strict grading discipline: Grade 22.5 for masonry; Grade 32.5 for general concrete; Grade 42.5 for high-strength suspended slabs.
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2B4560]/10 bg-gray-50/50 font-mono text-[11px] text-[#2B4560]">
                      <th className="py-2.5 px-4 font-bold">Brand &amp; Product</th>
                      <th className="py-2.5 px-4 font-bold">Grade</th>
                      <th className="py-2.5 px-4 font-bold">Recommended Application</th>
                      <th className="py-2.5 px-4 font-bold text-right">Unit Price (KES / 50kg)</th>
                      <th className="py-2.5 px-4 font-bold text-center">Quality Pedigree</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B4560]/10">
                    {kb.cement.map(c => (
                      <tr key={c.id} className="hover:bg-[#F4F1EA]/40">
                        <td className="py-2.5 px-4 font-semibold text-[#0B1B2B]">
                          {c.brand} {c.product}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            c.grade === '42.5' ? 'bg-purple-100 text-purple-900' :
                            c.grade === '32.5' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'
                          }`}>
                            Grade {c.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[#2B4560]">{c.use}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-right text-[#0B1B2B]">
                          KES {c.priceKesMin} – {c.priceKesMax}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <IndicativeBadge record={c} size="xs" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Aggregates & Walling Stones */}
            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs overflow-hidden space-y-2">
              <div className="p-4 bg-[#F4F1EA]/80 border-b border-[#2B4560]/15 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0B1B2B]">
                    Aggregates, Sand &amp; Machine-Cut Stone Rates
                  </h3>
                  <span className="text-xs text-[#2B4560]/70">
                    Quarry sources: Ndarugu, Thika, Makueni, Naivasha
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2B4560]/10 bg-gray-50/50 font-mono text-[11px] text-[#2B4560]">
                      <th className="py-2.5 px-4 font-bold">Item Description</th>
                      <th className="py-2.5 px-4 font-bold">Quarry / Origin</th>
                      <th className="py-2.5 px-4 font-bold">Unit</th>
                      <th className="py-2.5 px-4 font-bold text-right">Price Range (KES)</th>
                      <th className="py-2.5 px-4 font-bold text-center">Quality Pedigree</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B4560]/10">
                    {kb.aggregatesAndWalling.map(ag => (
                      <tr key={ag.id} className="hover:bg-[#F4F1EA]/40">
                        <td className="py-2.5 px-4 font-semibold text-[#0B1B2B]">{ag.item}</td>
                        <td className="py-2.5 px-4 text-[#2B4560]">{ag.origin || 'Regional Quarry'}</td>
                        <td className="py-2.5 px-4 font-mono text-[#2B4560]">{ag.unit}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-right text-[#0B1B2B]">
                          KES {ag.kesMin.toLocaleString()} – {ag.kesMax.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <IndicativeBadge record={ag} size="xs" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* TAB 4: MACHINERY & PLANT HIRE */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'machinery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-[#2B4560]/15 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#1F6FEB]" />
                <h2 className="font-display text-lg font-bold text-[#0B1B2B]">
                  Construction Plant &amp; Machinery Hire Catalog
                </h2>
              </div>
              <p className="text-xs text-[#2B4560] leading-relaxed">
                All equipment leased through the FUNDI marketplace requires a valid DOSHS statutory examination certificate (for lifting equipment, pressure vessels, and hoists) and vetted operator competence certification. Wet lease includes operator and fuel; dry lease requires fuel log verification.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2B4560]/10 bg-gray-50/50 font-mono text-[11px] text-[#2B4560]">
                      <th className="py-3 px-4 font-bold">Equipment &amp; Model</th>
                      <th className="py-3 px-4 font-bold">Tier</th>
                      <th className="py-3 px-4 font-bold">Application</th>
                      <th className="py-3 px-4 font-bold text-right">Standard Rate (KES)</th>
                      <th className="py-3 px-4 font-bold text-center">Data Quality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B4560]/10">
                    {kb.machinery.map(mach => (
                      <tr key={mach.id} className="hover:bg-[#F4F1EA]/40">
                        <td className="py-3 px-4 font-semibold text-[#0B1B2B]">
                          {mach.equipment}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded font-mono text-[10px]">
                            {mach.tier}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#2B4560]">{mach.use}</td>
                        <td className="py-3 px-4 font-mono font-bold text-right text-[#0B1B2B]">
                          KES {mach.rateKes} <span className="font-sans font-normal text-[10px] text-gray-500">/ {mach.unit}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <IndicativeBadge record={mach} size="xs" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* TAB 5: OSHA & BILINGUAL SAFETY SIGNAGE */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'safety' && (
          <div className="space-y-8">
            {/* Bilingual Site Demarcation Signage */}
            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2">
                <HardHat className="w-5 h-5 text-amber-600" />
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Bilingual Site Demarcation &amp; Safety Signage (English / Swahili)
                </h3>
              </div>
              <p className="text-xs text-[#2B4560]">
                Mandatory bilingual notice board requirements under OSHA 2007 for construction sites in Kenya:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {kb.safety.siteDemarcation.signage.map((sign, i) => (
                  <div key={i} className="p-3.5 bg-amber-500/10 border-l-4 border-amber-600 rounded-r-lg space-y-1">
                    <span className="font-mono font-bold text-xs text-amber-950 block">
                      {sign.en}
                    </span>
                    <span className="font-sans italic text-xs text-amber-800 block">
                      &ldquo;{sign.sw}&rdquo;
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory PPE Matrix */}
            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs overflow-hidden space-y-2">
              <div className="p-4 bg-[#F4F1EA]/80 border-b border-[#2B4560]/15">
                <h3 className="font-display font-bold text-sm text-[#0B1B2B]">
                  Mandatory PPE Matrix &amp; EN Compliance Standards
                </h3>
                <span className="text-xs text-[#2B4560]/70">
                  Compliant with Directorate of Occupational Safety &amp; Health Services (DOSHS)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2B4560]/10 bg-gray-50/50 font-mono text-[11px] text-[#2B4560]">
                      <th className="py-2.5 px-4 font-bold">Safety Gear / PPE</th>
                      <th className="py-2.5 px-4 font-bold">Required Standard</th>
                      <th className="py-2.5 px-4 font-bold">Mandatory Phase / Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B4560]/10">
                    {kb.safety.ppeMatrix.map((ppe, i) => (
                      <tr key={i} className="hover:bg-[#F4F1EA]/40">
                        <td className="py-2.5 px-4 font-semibold text-[#0B1B2B]">{ppe.item}</td>
                        <td className="py-2.5 px-4 font-mono text-[#1F6FEB] font-medium">{ppe.spec}</td>
                        <td className="py-2.5 px-4 text-[#2B4560]">{ppe.when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Critical Hazard Protocols */}
            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs p-6 space-y-4">
              <h3 className="font-display font-bold text-sm text-[#0B1B2B]">
                Critical Hazard Protocols &amp; Control Measures
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kb.safety.protocols.map((proto, i) => (
                  <div key={i} className="p-4 bg-[#F4F1EA]/70 rounded-xl border border-[#2B4560]/10 space-y-2">
                    <span className="font-bold text-xs text-[#0B1B2B] block flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      {proto.hazard}
                    </span>
                    <ul className="text-xs text-[#2B4560] space-y-1">
                      {proto.controls.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1F6FEB] mt-1.5 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Safety Workflows */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <span className="font-bold block flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                FUNDI Digital Safety Features
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {kb.safety.digitalSafetyFeatures.map((feat, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border border-emerald-200 text-[11px] font-medium text-emerald-900">
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* TAB 6: 24 STATUTORY AGENCIES & CHECKLISTS */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'agencies' && (
          <div className="space-y-8">
            
            {/* Statutory Fee Schedules Benchmark */}
            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs overflow-hidden space-y-2">
              <div className="p-4 bg-[#F4F1EA]/80 border-b border-[#2B4560]/15 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0B1B2B]">
                    Statutory &amp; Professional Fee Schedules (Kenya)
                  </h3>
                  <span className="text-xs text-[#2B4560]/70">
                    County planning, NCA, NEMA, DOSHS, BORAQS, EBK benchmark rates
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2B4560]/10 bg-gray-50/50 font-mono text-[11px] text-[#2B4560]">
                      <th className="py-2.5 px-4 font-bold">Fee Description</th>
                      <th className="py-2.5 px-4 font-bold">Regulating Agency</th>
                      <th className="py-2.5 px-4 font-bold">Formula / Statutory Rate</th>
                      <th className="py-2.5 px-4 font-bold">Notes &amp; Applicability</th>
                      <th className="py-2.5 px-4 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B4560]/10">
                    {kb.feeSeeds.map(f => (
                      <tr key={f.id} className="hover:bg-[#F4F1EA]/40">
                        <td className="py-2.5 px-4 font-semibold text-[#0B1B2B]">{f.item}</td>
                        <td className="py-2.5 px-4 text-[#2B4560]">{f.source}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-[#1F6FEB]">{f.indicative}</td>
                        <td className="py-2.5 px-4 text-[#2B4560]/80 text-[11px] max-w-xs">{f.verifyAt || 'Statutory Portal'}</td>
                        <td className="py-2.5 px-4 text-center">
                          <IndicativeBadge record={f} size="xs" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lifecycle Document Checklist */}
            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                    Construction Lifecycle Document Checklist
                  </h3>
                  <p className="text-xs text-[#2B4560]/70">
                    Required permits, certificates, and compliance items across project phases.
                  </p>
                </div>

                {/* Stage Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(['all', 'before', 'during', 'after', 'lifecycle'] as const).map(stage => (
                    <button
                      key={stage}
                      onClick={() => setChecklistStageFilter(stage)}
                      className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
                        checklistStageFilter === stage
                          ? 'bg-[#0B1B2B] text-white font-bold'
                          : 'bg-[#F4F1EA] text-[#2B4560] hover:bg-gray-200'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checklist Table */}
              <div className="border border-[#2B4560]/15 rounded-xl overflow-hidden divide-y divide-[#2B4560]/10 text-xs">
                {filteredChecklist.map((item) => (
                  <div key={item.id} className="p-3.5 hover:bg-[#F4F1EA]/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.blocking ? (
                          <span className="px-1.5 py-0.2 bg-red-100 text-red-800 border border-red-200 rounded text-[9px] font-mono font-bold uppercase">
                            Blocking
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 bg-gray-100 text-gray-700 rounded text-[9px] font-mono">
                            Supporting
                          </span>
                        )}
                        <span className="font-bold text-[#0B1B2B]">{item.doc}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#2B4560]/80">
                        <span>Agency: <strong>{item.agency}</strong></span>
                        <span>·</span>
                        <span>Applies: {item.appliesTo}</span>
                        {item.note && (
                          <>
                            <span>·</span>
                            <span className="italic text-amber-900">{item.note}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                      <span className="px-2 py-0.5 bg-[#F4F1EA] text-[#2B4560] font-mono text-[10px] rounded uppercase">
                        {item.stage}
                      </span>
                      <IndicativeBadge record={item} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 24 Statutory Agencies Directory */}
            <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                Directory of 24 Statutory Agencies in Kenyan Construction
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {kb.agencies.map(agency => (
                  <div key={agency.id} className="p-3.5 bg-[#F4F1EA]/60 rounded-xl border border-[#2B4560]/10 space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-xs text-[#0B1B2B] block">
                        {agency.name}
                      </span>
                      <span className="px-1.5 py-0.2 bg-[#0B1B2B] text-white rounded text-[9px] font-mono uppercase">
                        {agency.stage}
                      </span>
                    </div>
                    <ul className="text-[11px] text-[#2B4560] space-y-0.5">
                      {agency.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-[#1F6FEB] font-bold">›</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
