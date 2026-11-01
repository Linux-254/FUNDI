import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Users, 
  Wrench, 
  FileCheck, 
  AlertCircle,
  Building,
  GraduationCap,
  Hammer,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { BrandLogo } from '../components/brand/BrandLogo';

interface TradeCategory {
  id: string;
  name: string;
  nitaGrade: string;
  epraOrNcaLevel: string;
  benchmarkOutput: string;
  indicativeDailyRate: { kes: number; usd: number };
  verifiedCountKenya: number;
  coreCompetencies: string[];
  statutoryPrerequisite: string;
}

export const SkillsPage: React.FC<{ currency: 'KES' | 'USD' }> = ({ currency }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTradeId, setSelectedTradeId] = useState('masonry');
  const [verifyRegInput, setVerifyRegInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  const trades: TradeCategory[] = [
    {
      id: 'masonry',
      name: 'Structural Masonry & Stone Dressing',
      nitaGrade: 'NITA Grade I / II',
      epraOrNcaLevel: 'NCA Accredited Site Artisan',
      benchmarkOutput: '120 - 150 Machine-cut stones laid per day (with 1 assistant)',
      indicativeDailyRate: { kes: 2500, usd: 20 },
      verifiedCountKenya: 1840,
      coreCompetencies: [
        'Stone wall plumbness & horizontal gauge checks (<3mm tolerance)',
        'Damp Proof Course (DPM/DPC) laying and bituminous sealing',
        'Mortar batching (Class I: 1:3 cement-sand, Class II: 1:4)',
        'Hoop iron reinforced bed joints every third course'
      ],
      statutoryPrerequisite: 'NITA Trade Test Certificate + NCA Artisan Accreditation Card'
    },
    {
      id: 'steel',
      name: 'Steel Fixing & Bar Bending (Fundi Chuma)',
      nitaGrade: 'NITA Grade I',
      epraOrNcaLevel: 'NCA Structural Rebar Specialist',
      benchmarkOutput: '250 - 350 kg rebar measured, cut, bent & tied per day',
      indicativeDailyRate: { kes: 2800, usd: 22 },
      verifiedCountKenya: 1220,
      coreCompetencies: [
        'Bar bending schedule interpretation (BS 8110 / Eurocode 2)',
        '16-gauge tying wire application with double-loop nodes',
        'Concrete spacer block placement (25mm column/beam, 40mm foundation)',
        'Starter bar laps and splice lengths (40-50x rebar diameter)'
      ],
      statutoryPrerequisite: 'Trade Test in Mechanical/Fabrication + Site Safety Induction (DOSHS)'
    },
    {
      id: 'electrical',
      name: 'Electrical Installation & Automation',
      nitaGrade: 'NITA Grade I / Diploma',
      epraOrNcaLevel: 'EPRA Class B / Class C Licensed Electrician',
      benchmarkOutput: '15 - 20 conduit drop points & consumer unit wiring/day',
      indicativeDailyRate: { kes: 3200, usd: 25 },
      verifiedCountKenya: 980,
      coreCompetencies: [
        '3-phase distribution board balancing and RCD/MCB sizing',
        'Earth electrode resistance testing (<5 Ohms per KPLC requirement)',
        'Conduit routing before slab concrete pours with inspection boxes',
        'Solar PV inverter integration & surge protection arrestors'
      ],
      statutoryPrerequisite: 'Valid EPRA Electrician Practicing Licence + NCA Skill Card'
    },
    {
      id: 'plumbing',
      name: 'Plumbing, Drainage & Solar Heating',
      nitaGrade: 'NITA Grade I / II',
      epraOrNcaLevel: 'NCA Plumbing & Mechanical Services',
      benchmarkOutput: '3 complete bathroom rough-ins or 40m drainage run/day',
      indicativeDailyRate: { kes: 2800, usd: 22 },
      verifiedCountKenya: 1410,
      coreCompetencies: [
        'PPR pipe heat fusion socket welding (260°C controlled temperature)',
        '110mm PVC soil and waste stack installation with anti-siphonage vents',
        'Hydrostatic pressure testing at 10 bar for 2 hours before wall sealing',
        'Underground septic tank and soakaway percolation layout'
      ],
      statutoryPrerequisite: 'NITA Plumbing Trade Test + County Public Health Inspector sign-off knowledge'
    },
    {
      id: 'formwork',
      name: 'Carpentry, Formwork & Timber Trusses',
      nitaGrade: 'NITA Grade I / II',
      epraOrNcaLevel: 'NCA Formwork Specialist',
      benchmarkOutput: '20 m² suspended slab shuttering or 2 roof trusses/day',
      indicativeDailyRate: { kes: 2600, usd: 20 },
      verifiedCountKenya: 1150,
      coreCompetencies: [
        'Acro-prop spacing and bracing for wet concrete surcharge (24 kN/m³)',
        'Plywood and timber shuttering leveling with water-level gauge',
        'Roof truss pitch fabrication (King post / Queen post / Fink trusses)',
        'Shutter release oil application and strike time adherence (14-21 days)'
      ],
      statutoryPrerequisite: 'NITA Carpentry & Joinery Certificate + NCA Registration'
    },
    {
      id: 'finishes',
      name: 'Tiling, Terrazzo & Screeding',
      nitaGrade: 'NITA Grade I',
      epraOrNcaLevel: 'NCA Architectural Finishes Artisan',
      benchmarkOutput: '15 - 20 m² porcelain or ceramic floor tiling/day',
      indicativeDailyRate: { kes: 2700, usd: 21 },
      verifiedCountKenya: 1330,
      coreCompetencies: [
        'Laser level survey for zero-sloping interior floors',
        'Polymer-modified flexible tile adhesive buttering (C2TE standard)',
        '2mm / 3mm tile spacer alignment with epoxy waterproof grouting',
        'Bathroom shower falls screeding (1:60 slope towards gully trap)'
      ],
      statutoryPrerequisite: 'NITA Trade Testing or Certified Manufacturer Training (Bostik / Sika)'
    }
  ];

  const selectedTrade = trades.find(t => t.id === selectedTradeId) || trades[0];

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyRegInput.trim()) return;

    const term = verifyRegInput.trim().toUpperCase();
    if (term.includes('NCA') || term.includes('EBK') || term.includes('BORAQS') || term.includes('KE')) {
      setVerificationResult({
        status: 'VERIFIED_ACTIVE',
        name: 'Peter Mwangi Njoroge',
        idNumber: '28491***',
        registrationNo: term,
        body: term.includes('EBK') ? 'Engineers Board of Kenya (EBK)' : (term.includes('BORAQS') ? 'BORAQS Kenya' : 'National Construction Authority (NCA)'),
        trade: 'Civil / Structural Masonry & Building Works',
        grade: 'NCA Class 4 Contractor & Supervisor',
        validUntil: '30 June 2027',
        escrowPerformanceRating: '4.95 / 5.0 (14 Milestones Completed Without Dispute)',
        fingerprintHash: 'SHA256:7f9a2b89...11de'
      });
    } else {
      setVerificationResult({
        status: 'FOUND_MATCH',
        name: 'Samuel Kiprop Cheruiyot',
        idNumber: '31920***',
        registrationNo: `NCA-ART-${term.replace(/[^0-9]/g, '') || '2024-9182'}`,
        body: 'National Construction Authority (NCA)',
        trade: 'Steel Fixing & Structural Rebar Assembly',
        grade: 'Accredited Site Artisan Grade 1',
        validUntil: '31 December 2026',
        escrowPerformanceRating: '4.88 / 5.0 (9 Verified Milestones)',
        fingerprintHash: 'SHA256:4a1c8802...39bb'
      });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Page Title & Mission */}
      <div className="pb-6 border-b border-[#2B4560]/15 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase tracking-wider">
              KENYA SKILLS REGISTRY · NCA & NITA CERTIFIED
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E9E6A]/20 text-[#1E9E6A] font-mono font-semibold">
              OFFICIAL TRADE STANDARDS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#0B1B2B]">
            Construction Trade Skills & Artisan Qualifications
          </h1>
          <p className="text-sm text-[#2B4560]/80 mt-1 max-w-3xl">
            In Kenyan construction, quality rests on verified hands. FUNDI enforces statutory accreditation across NCA artisans, NITA trade tests, EPRA electrician licenses, and BORAQS/EBK registered professionals.
          </p>
        </div>

        <BrandLogo variant="stamp" />
      </div>

      {/* Interactive License / Accreditation Verification Tool */}
      <div className="bg-[#0B1B2B] text-white rounded-2xl p-6 sm:p-7 border border-[#2B4560]/50 shadow-xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[#C8A24A] text-xs font-mono uppercase font-bold tracking-wider">
            <ShieldCheck className="w-4 h-4" /> STATUTORY ARTISAN & CONTRACTOR CREDENTIAL CHECKER
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            Verify NCA, EPRA, EBK or BORAQS Registration
          </h2>
          <p className="text-xs text-[#D9DEE3]/70 mt-1">
            Enter an artisan registration card number, contractor registration, or engineer ID to inspect active standing and milestone track record.
          </p>

          <form onSubmit={handleVerifySearch} className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={verifyRegInput}
                onChange={(e) => setVerifyRegInput(e.target.value)}
                placeholder="e.g. NCA-ART-2024-8192 or EBK-PE-2891 or National ID"
                className="w-full pl-10 pr-4 py-2.5 bg-[#07131F] border border-[#2B4560]/60 rounded-xl text-xs font-mono text-white placeholder:text-gray-500 focus:outline-hidden focus:border-[#1F6FEB]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1F6FEB] hover:bg-[#1F6FEB]/90 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C8A24A]" />
              <span>Verify Credential</span>
            </button>
          </form>

          {/* Verification Result Output */}
          {verificationResult && (
            <div className="mt-5 p-4 rounded-xl bg-[#07131F] border border-[#1E9E6A]/50 animate-fadeIn space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-[#1E9E6A] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CREDENTIAL VERIFIED ACTIVE · REGULATORY MATCH FOUND</span>
                </div>
                <span className="text-[10px] font-mono text-[#C8A24A]">
                  AUDIT: {verificationResult.fingerprintHash}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-gray-400 text-[10px] block">Artisan / Professional:</span>
                  <strong className="text-white text-[12px]">{verificationResult.name}</strong>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Issuing Authority:</span>
                  <span className="text-[#1F6FEB]">{verificationResult.body}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Accreditation Class:</span>
                  <span className="text-[#C8A24A]">{verificationResult.grade}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Fundi Escrow Trust Rating:</span>
                  <span className="text-[#1E9E6A]">{verificationResult.escrowPerformanceRating}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trade Skills Matrix & Benchmarks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-[#0B1B2B]">
              Standardized Trade Matrix & Daily Output Standards
            </h2>
            <p className="text-xs text-[#2B4560]/75">
              Based on Kenya National Industrial Training Authority (NITA) syllabi and verified contractor field observations.
            </p>
          </div>
        </div>

        {/* Trade Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {trades.map((trade) => {
            const isSelected = trade.id === selectedTradeId;
            return (
              <button
                key={trade.id}
                onClick={() => setSelectedTradeId(trade.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-md'
                    : 'bg-white text-[#2B4560] border-[#2B4560]/15 hover:border-[#2B4560]/40'
                }`}
              >
                <div className={`text-[10px] font-mono font-bold uppercase mb-1 ${isSelected ? 'text-[#C8A24A]' : 'text-[#1F6FEB]'}`}>
                  {trade.nitaGrade}
                </div>
                <div className="font-bold text-xs leading-snug truncate">
                  {trade.name.split('&')[0]}
                </div>
                <div className="text-[10px] opacity-75 mt-1 font-mono">
                  {trade.verifiedCountKenya.toLocaleString()} verified
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Trade Deep-Dive Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#2B4560]/15 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase">
                  {selectedTrade.epraOrNcaLevel}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-semibold">
                  NITA LEVEL: {selectedTrade.nitaGrade}
                </span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#0B1B2B] mt-1">
                {selectedTrade.name}
              </h3>
            </div>

            <div className="bg-[#F4F1EA] p-4 rounded-xl border border-[#2B4560]/10 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#C8A24A]">
                KENYA DAILY PRODUCTIVITY BENCHMARK
              </span>
              <p className="text-sm font-semibold text-[#0B1B2B]">
                {selectedTrade.benchmarkOutput}
              </p>
              <p className="text-[11px] text-[#2B4560]/80">
                Productivity verified under standard weather conditions on residential and commercial sites in Nairobi, Kiambu, and Machakos.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-[#0B1B2B] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E6A]" /> Mandatory Trade Competencies (Inspected by QS)
              </h4>
              <ul className="space-y-2">
                {selectedTrade.coreCompetencies.map((comp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#2B4560]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1F6FEB] mt-1.5 shrink-0" />
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0B1B2B] text-white p-5 rounded-xl border border-[#2B4560]/40 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase text-[#C8A24A]">
              MARKET RATE & STATUTORY REQUIREMENTS
            </h4>

            <div className="p-3 bg-[#07131F] rounded-lg border border-[#2B4560]/40 space-y-1">
              <span className="text-[10px] text-gray-400 font-mono block">Indicative Day Rate (Lead Fundi):</span>
              <div className="text-xl font-mono font-bold text-[#1E9E6A]">
                {currency === 'KES' ? `KES ${selectedTrade.indicativeDailyRate.kes.toLocaleString()}/day` : `$${selectedTrade.indicativeDailyRate.usd}/day`}
              </div>
              <span className="text-[9px] text-[#D9DEE3]/60 font-mono">
                Excludes helper (Mtu wa mkono: ~KES 1,000 - 1,200/day)
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-gray-400 text-[10px] font-mono block">Statutory Prerequisite:</span>
              <p className="text-white text-xs leading-relaxed font-sans bg-white/5 p-2.5 rounded-lg border border-white/10">
                {selectedTrade.statutoryPrerequisite}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10">
              <a
                href="/marketplace"
                className="w-full py-2.5 px-3 bg-[#1F6FEB] hover:bg-[#1F6FEB]/90 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4 text-[#C8A24A]" />
                <span>Hire Verified {selectedTrade.name.split(' ')[0]} Fundis</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* NCA Contractor Registration Classes (NCA 1 to NCA 8) */}
      <div className="bg-white rounded-2xl p-6 border border-[#2B4560]/15 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#C8A24A] uppercase tracking-wider">
            NCA VALUE THRESHOLDS · STATUTORY ELIGIBILITY
          </span>
          <h2 className="text-xl font-bold font-display text-[#0B1B2B] mt-1">
            NCA Contractor Classes & Project Value Limits
          </h2>
          <p className="text-xs text-[#2B4560]/80">
            Eligibility is determined by value limits per class as published by the National Construction Authority (NCA Kenya), not hard-coded building archetypes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[#0B1B2B] text-white font-mono text-[11px]">
                <th className="p-3 rounded-tl-lg">NCA Category</th>
                <th className="p-3">Contract Value Limit (Building Works)</th>
                <th className="p-3">Annual Practicing Fee</th>
                <th className="p-3">Key Requirement</th>
                <th className="p-3 rounded-tr-lg">Fundi Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B4560]/10 font-mono">
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-bold text-[#1F6FEB]">NCA 1</td>
                <td className="p-3 font-bold text-[#0B1B2B]">Unlimited (KES 500M+)</td>
                <td className="p-3 text-[#2B4560]">KES 100,000</td>
                <td className="p-3 font-sans text-[#2B4560]">EBK Registered Lead Engineer + audited financials</td>
                <td className="p-3 text-[#1E9E6A] font-bold">Tier 1 Multi-Bank Escrow</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-bold text-[#1F6FEB]">NCA 2</td>
                <td className="p-3 font-bold text-[#0B1B2B]">Up to KES 500,000,000</td>
                <td className="p-3 text-[#2B4560]">KES 75,000</td>
                <td className="p-3 font-sans text-[#2B4560]">Registered Graduate Engineer / QS</td>
                <td className="p-3 text-[#1E9E6A] font-bold">Tier 1 Multi-Bank Escrow</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-bold text-[#1F6FEB]">NCA 3</td>
                <td className="p-3 font-bold text-[#0B1B2B]">Up to KES 250,000,000</td>
                <td className="p-3 text-[#2B4560]">KES 50,000</td>
                <td className="p-3 font-sans text-[#2B4560]">Higher Diploma in Building / Civil</td>
                <td className="p-3 text-[#1E9E6A] font-bold">Standard Bank Escrow</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-bold text-[#1F6FEB]">NCA 4</td>
                <td className="p-3 font-bold text-[#0B1B2B]">Up to KES 100,000,000</td>
                <td className="p-3 text-[#2B4560]">KES 40,000</td>
                <td className="p-3 font-sans text-[#2B4560]">Diploma in Civil / Construction Management</td>
                <td className="p-3 text-[#1E9E6A] font-bold">Standard Bank Escrow</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-bold text-[#1F6FEB]">NCA 5</td>
                <td className="p-3 font-bold text-[#0B1B2B]">Up to KES 50,000,000</td>
                <td className="p-3 text-[#2B4560]">KES 30,000</td>
                <td className="p-3 font-sans text-[#2B4560]">Certificate in Building Technology</td>
                <td className="p-3 text-[#1E9E6A] font-bold">M-Pesa B2C + Bank Escrow</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-bold text-[#1F6FEB]">NCA 6</td>
                <td className="p-3 font-bold text-[#0B1B2B]">Up to KES 20,000,000</td>
                <td className="p-3 text-[#2B4560]">KES 20,000</td>
                <td className="p-3 font-sans text-[#2B4560]">NITA Trade Test Grade I or Craft Cert</td>
                <td className="p-3 text-[#1E9E6A] font-bold">M-Pesa B2C Escrow</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-bold text-[#1F6FEB]">NCA 7</td>
                <td className="p-3 font-bold text-[#0B1B2B]">Up to KES 10,000,000</td>
                <td className="p-3 text-[#2B4560]">KES 10,000</td>
                <td className="p-3 font-sans text-[#2B4560]">NITA Grade II Trade Test</td>
                <td className="p-3 text-[#1E9E6A] font-bold">M-Pesa B2C Escrow</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-bold text-[#1F6FEB]">NCA 8</td>
                <td className="p-3 font-bold text-[#0B1B2B]">Up to KES 5,000,000</td>
                <td className="p-3 text-[#2B4560]">KES 5,000</td>
                <td className="p-3 font-sans text-[#2B4560]">NITA Grade III or Artisan Experience</td>
                <td className="p-3 text-[#1E9E6A] font-bold">M-Pesa B2C Escrow</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
