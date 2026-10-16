import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  Scale, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const TrustEscrowPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F4F1EA] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A24A]/20 text-[#0B1B2B] text-xs font-mono font-bold">
            <Lock className="w-3.5 h-3.5 text-[#C8A24A]" />
            <span>STATUTORY CUSTODY & FIDUCIARY ESCROW ARCHITECTURE</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0B1B2B] tracking-tight">
            How FUNDI Escrow protects your money and builds trust.
          </h1>
          <p className="text-sm sm:text-base text-[#2B4560]/80">
            Construction is plagued by two fears: owners fear disappearing advances, and contractors fear completed work going unpaid. FUNDI solves both through programmatic milestone locks.
          </p>
        </div>

        {/* 4 Pillars of Protection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#2B4560]/15 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A24A]/20 text-[#C8A24A] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-display font-bold text-base text-[#0B1B2B]">
              CBK-Authorised Custody
            </h3>
            <p className="text-xs text-[#2B4560] leading-relaxed">
              FUNDI never touches customer deposits. Funds are held in independent trust accounts managed by licensed Kenyan banking partners under the National Payment System Act.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#2B4560]/15 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F6FEB]/20 text-[#1F6FEB] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-display font-bold text-base text-[#0B1B2B]">
              Evidence-First Releases
            </h3>
            <p className="text-xs text-[#2B4560] leading-relaxed">
              Tranches are unlocked only when the contractor submits geotagged site inspection photography, laboratory material tests, and consultant certificates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#2B4560]/15 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E9E6A]/20 text-[#1E9E6A] flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-display font-bold text-base text-[#0B1B2B]">
              Automatic Payout Splits
            </h3>
            <p className="text-xs text-[#2B4560] leading-relaxed">
              Upon approval, the vault automatically distributes the tranche: 85% to main contractor, 10% to direct fundi labour M-Pesa wage accounts, and 5% to defects retention.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#2B4560]/15 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/20 text-[#FF6B2C] flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-display font-bold text-base text-[#0B1B2B]">
              48-Hour ADR Mediation
            </h3>
            <p className="text-xs text-[#2B4560] leading-relaxed">
              Disputes freeze only the disputed tranche rather than halting the entire project. An independent registered QS conducts an on-site audit within 48 hours.
            </p>
          </div>
        </div>

        {/* State Machine Visualizer */}
        <div className="bg-[#0B1B2B] text-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/50 shadow-xl space-y-6">
          <div className="border-b border-[#2B4560]/40 pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8A24A]">
              PROGRAMMATIC STATE MACHINE SPECIFICATION
            </span>
            <h3 className="font-display font-bold text-xl text-white mt-1">
              Milestone Escrow Lifecycle
            </h3>
            <p className="text-xs text-[#D9DEE3]/70">
              Deterministic, auditable state machine with hash-chained ledger logging.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center text-xs font-mono">
            {[
              { state: 'Draft', desc: 'BoQ Created' },
              { state: 'AwaitingFunding', desc: 'STK Push Pending' },
              { state: 'Funded', desc: 'Vault Locked' },
              { state: 'InProgress', desc: 'Site Works' },
              { state: 'EvidenceSubmitted', desc: 'Photos & Tests' },
              { state: 'Released', desc: 'Payout Disbursed' }
            ].map((step, idx) => (
              <div key={step.state} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-[#C8A24A]">Step 0{idx + 1}</span>
                <div className="font-bold text-white text-xs">{step.state}</div>
                <div className="text-[10px] text-[#D9DEE3]/60">{step.desc}</div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-[#D9DEE3]/80 leading-relaxed">
            <strong className="text-white">Statutory Fiduciary Guarantee:</strong> In accordance with the Kenya Data Protection Act 2019 and Central Bank payment guidelines, transaction audit records are immutable and backed by double-entry ledger bookkeeping.
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Link
            to="/app/projects/proj-karen-villa"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
          >
            <span>Inspect Live Escrow Vault on Demo Project</span>
            <ArrowRight className="w-4 h-4 text-[#C8A24A]" />
          </Link>
        </div>

      </div>
    </div>
  );
};
