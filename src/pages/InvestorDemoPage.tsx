import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  PieChart, 
  Download,
  AlertCircle
} from 'lucide-react';
import { api } from '../lib/api';

export const InvestorDemoPage: React.FC = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUnlock = (codeToTest?: string) => {
    const code = (codeToTest || inviteCode).trim().toUpperCase();
    if (code === 'FUNDI-2026' || code === 'DEMO' || code === 'INVESTOR') {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid invite code. Try sample demo code: FUNDI-2026');
    }
  };

  const handleDownloadOnePager = () => {
    alert('FUNDI Executive Investment Memorandum (PDF Summary) downloaded: KES 494M GMV, 14.2% Overrun Reduction, CBK-partnered escrow architecture.');
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl border border-[#2B4560]/20 space-y-5 text-center">
          <div className="w-14 h-14 bg-[#0B1B2B] text-[#C8A24A] rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1F6FEB]">
              INSTITUTIONAL INVESTOR PORTAL
            </span>
            <h1 className="font-display text-2xl font-bold text-[#0B1B2B] mt-1">
              FUNDI Investor Demo
            </h1>
            <p className="text-xs text-[#2B4560]/80 mt-1.5">
              Enter the partner invite code provided in your investor memorandum to view live financial metrics, escrow velocity, and unit economics.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <input
              type="text"
              placeholder="Enter code (e.g. FUNDI-2026)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full text-center font-mono text-sm tracking-wider uppercase p-3 rounded-xl border border-[#2B4560]/20 focus:outline-[#1F6FEB]"
            />

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
            )}

            <button
              onClick={() => handleUnlock()}
              className="w-full py-3 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Verify Access Code
            </button>

            <button
              onClick={() => handleUnlock('FUNDI-2026')}
              className="text-xs text-[#1F6FEB] hover:underline font-semibold block mx-auto pt-1 cursor-pointer"
            >
              Click here to unlock demo with code: FUNDI-2026
            </button>
          </div>

          <div className="pt-4 border-t border-[#2B4560]/10 text-[11px] text-[#2B4560]/60">
            For investor inquiries, contact: partners@fundi.build
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Disclaimer */}
        <div className="bg-[#0B1B2B] text-white rounded-2xl p-6 sm:p-8 border border-[#C8A24A]/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A24A]/20 text-[#C8A24A] text-xs font-mono font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CONFIDENTIAL INVESTOR OVERVIEW (ILLUSTRATIVE DEMO DATA)</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                FUNDI Traction, Escrow Float & Unit Economics
              </h1>
              <p className="text-xs sm:text-sm text-[#D9DEE3]/70 mt-1 max-w-2xl">
                Monetizing the African construction money trail. Milestone escrow fee + professional commission + materials margin.
              </p>
            </div>

            <button
              onClick={handleDownloadOnePager}
              className="px-4 py-2.5 bg-[#C8A24A] hover:bg-[#b08e3e] text-[#0B1B2B] font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download 1-Pager (PDF)</span>
            </button>
          </div>

          <div className="mt-4 p-2.5 bg-white/5 rounded-lg border border-white/10 text-[11px] text-[#D9DEE3]/60 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#C8A24A] shrink-0" />
            <span>Illustrative pilot figures for investor demonstration. To be updated with final audited metrics upon completion of Round A.</span>
          </div>
        </div>

        {/* Top 4 KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#2B4560]/15 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono text-[#2B4560]/70 font-semibold uppercase block">
              Cumulative Escrow GMV
            </span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#0B1B2B]">
              KES 494.0M
            </div>
            <span className="text-[11px] font-mono text-[#1E9E6A] font-semibold block">
              $3.80M USD equivalent
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#2B4560]/15 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono text-[#2B4560]/70 font-semibold uppercase block">
              Active Float in Escrow
            </span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#C8A24A]">
              KES 106.6M
            </div>
            <span className="text-[11px] font-mono text-[#2B4560]/70 block">
              $820,000 USD protected float
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#2B4560]/15 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono text-[#2B4560]/70 font-semibold uppercase block">
              Budget Overrun Reduction
            </span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#1E9E6A]">
              14.2% Saved
            </div>
            <span className="text-[11px] font-mono text-[#2B4560]/70 block">
              vs 32% East African benchmark
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#2B4560]/15 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono text-[#2B4560]/70 font-semibold uppercase block">
              Dispute Resolution Rate
            </span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#1F6FEB]">
              0.4% Rate
            </div>
            <span className="text-[11px] font-mono text-[#2B4560]/70 block">
              Avg 48hr mediation resolution
            </span>
          </div>
        </div>

        {/* Business Model & Take Rates Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Revenue Streams Table */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xs border border-[#2B4560]/15 space-y-4">
            <div className="border-b border-[#2B4560]/10 pb-3">
              <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                Monetization Streams & Take Rate Structure
              </h3>
              <p className="text-xs text-[#2B4560]/70">
                Owners post projects and track budget for free. Revenue is deducted at milestone release.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#2B4560]/10 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#0B1B2B]">Contractor Escrow Success Fee</h4>
                  <p className="text-[11px] text-[#2B4560]/70">Deducted on each milestone release to contractors</p>
                </div>
                <span className="font-mono font-bold text-sm text-[#0B1B2B]">2.0% - 4.0%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#2B4560]/10 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#0B1B2B]">Professional Fees Take Rate</h4>
                  <p className="text-[11px] text-[#2B4560]/70">Deducted on architectural, QS & engineering fees</p>
                </div>
                <span className="font-mono font-bold text-sm text-[#0B1B2B]">6.0% - 10.0%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#2B4560]/10 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#0B1B2B]">Materials & Plant Hire Commission</h4>
                  <p className="text-[11px] text-[#2B4560]/70">Margin on verified cement, rebar & equipment orders</p>
                </div>
                <span className="font-mono font-bold text-sm text-[#0B1B2B]">2.5% - 5.0%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#2B4560]/10 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#0B1B2B]">Fundi M-Pesa Payroll Processing</h4>
                  <p className="text-[11px] text-[#2B4560]/70">Low flat fee per weekly worker disbursement</p>
                </div>
                <span className="font-mono font-bold text-sm text-[#0B1B2B]">KES 30 / wage</span>
              </div>
            </div>
          </div>

          {/* Moats & Expansion Roadmap */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs border border-[#2B4560]/15 space-y-4">
            <div className="border-b border-[#2B4560]/10 pb-3">
              <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                Strategic Moats & Network Effects
              </h3>
              <p className="text-xs text-[#2B4560]/70">
                The Construction Credit Graph becomes insurmountable.
              </p>
            </div>

            <ul className="space-y-3 text-xs text-[#2B4560] leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6A] shrink-0 mt-0.5" />
                <span><strong>Verified Construction Credit Graph:</strong> Every completed milestone builds portable credit history for contractors, unlocking future bank financing and supplier credit.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6A] shrink-0 mt-0.5" />
                <span><strong>Regulatory Jurisdiction Packs:</strong> High switching costs for compliance checklists, local county permitting rules, and statutory NCA integrations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6A] shrink-0 mt-0.5" />
                <span><strong>Two-Sided Liquidity:</strong> Deep pool of vetted fundi gangs and heavy equipment owners creating high retention for residential & commercial developers.</span>
              </li>
            </ul>

            <div className="p-3 bg-[#0B1B2B] text-white rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-mono text-[#C8A24A] uppercase font-bold block">
                Regional Rollout Roadmap
              </span>
              <p className="text-[#D9DEE3]/80">
                Phase 1: Kenya (Nairobi, Kiambu, Nakuru, Mombasa) → Phase 2: Uganda (Kampala) & Tanzania (Dar es Salaam) → Phase 3: Rwanda (Kigali).
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
