import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, ArrowRight, Building2, Users, Briefcase } from 'lucide-react';

export const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F4F1EA] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F6FEB]">
            TRANSPARENT REVENUE MODEL
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0B1B2B] tracking-tight">
            Free for Owners. Performance-based for builders.
          </h1>
          <p className="text-sm sm:text-base text-[#2B4560]/80">
            Owners and developers post projects, run the budget guard, and track compliance at zero software fee. Fees are deducted transparently upon milestone release.
          </p>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tier 1: Owners */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1F6FEB]/10 text-[#1F6FEB] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                  Zero Platform Fee
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-[#0B1B2B]">
                Owners & Diaspora
              </h3>
              <p className="text-xs text-[#2B4560]/70 mt-1 mb-6">
                For individuals and diaspora building homes or rental units in Kenya.
              </p>

              <div className="mb-6">
                <span className="font-display font-bold text-3xl text-[#0B1B2B]">KES 0</span>
                <span className="text-xs text-[#2B4560]/60 block font-mono mt-0.5">Free forever to plan, hire and manage</span>
              </div>

              <ul className="space-y-3 text-xs text-[#2B4560]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                  <span>Unlimited projects & Smart Brief generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                  <span>Live Project Blueprint & liquid budget gauge</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                  <span>Kenya Statutory Compliance checklist engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                  <span>Escrow protection under CBK partner trust</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-[#2B4560]/10">
              <Link
                to="/app/projects/new"
                className="w-full py-2.5 px-4 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Post Your Project Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tier 2: Contractors & Crews */}
          <div className="bg-[#0B1B2B] text-white rounded-2xl p-6 sm:p-8 border border-[#C8A24A]/40 shadow-xl flex flex-col justify-between relative">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C8A24A] text-[#0B1B2B] font-bold uppercase">
                Most Popular
              </span>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-[#C8A24A]/20 text-[#C8A24A] flex items-center justify-center font-bold mb-4">
                <Users className="w-5 h-5" />
              </div>

              <h3 className="font-display font-bold text-xl text-white">
                Contractors & Crews
              </h3>
              <p className="text-xs text-[#D9DEE3]/70 mt-1 mb-6">
                NCA registered building firms, gang leads, and craftspersons.
              </p>

              <div className="mb-6">
                <span className="font-display font-bold text-3xl text-white">2.0% - 3.5%</span>
                <span className="text-xs text-[#D9DEE3]/60 block font-mono mt-0.5">Success fee only upon released milestone</span>
              </div>

              <ul className="space-y-3 text-xs text-[#D9DEE3]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C8A24A] shrink-0" />
                  <span>Guaranteed payment locked in escrow before site work</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C8A24A] shrink-0" />
                  <span>Automated weekly M-Pesa payroll for site fundis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C8A24A] shrink-0" />
                  <span>Builds verified construction credit track record</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C8A24A] shrink-0" />
                  <span>Protection against client non-payment or bad faith</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-white/10">
              <Link
                to="/marketplace"
                className="w-full py-2.5 px-4 bg-[#C8A24A] hover:bg-[#b5923f] text-[#0B1B2B] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Register as Builder / Contractor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tier 3: Enterprise Developers */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#2B4560]/10 text-[#2B4560] flex items-center justify-center font-bold mb-4">
                <Briefcase className="w-5 h-5" />
              </div>

              <h3 className="font-display font-bold text-xl text-[#0B1B2B]">
                Enterprise & Commercial
              </h3>
              <p className="text-xs text-[#2B4560]/70 mt-1 mb-6">
                Property developers, REITs, institutions and SACCO housing projects.
              </p>

              <div className="mb-6">
                <span className="font-display font-bold text-3xl text-[#0B1B2B]">Custom</span>
                <span className="text-xs text-[#2B4560]/60 block font-mono mt-0.5">Annual SLA & dedicated escrow trust</span>
              </div>

              <ul className="space-y-3 text-xs text-[#2B4560]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                  <span>Multi-site Portfolio Command Centre dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                  <span>One-click board report PDF & ERP API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                  <span>Dedicated clerk of works on-site verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                  <span>Custom escrow disbursement approval hierarchies</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-[#2B4560]/10">
              <Link
                to="/investors"
                className="w-full py-2.5 px-4 bg-white border border-[#2B4560]/20 hover:bg-[#F4F1EA] text-[#0B1B2B] font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Inquire for Corporate License</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
