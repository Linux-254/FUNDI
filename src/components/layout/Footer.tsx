import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Scale, Lock, Landmark } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1B2B] text-[#D9DEE3] border-t border-[#2B4560]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Acronym Banner & Core Thesis */}
        <div className="bg-[#2B4560]/20 rounded-xl p-6 sm:p-8 border border-[#2B4560]/30 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C8A24A] font-semibold">The FUNDI Standard</span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                Build with certainty across East Africa.
              </h3>
              <p className="text-xs sm:text-sm text-[#D9DEE3]/70 mt-1 max-w-2xl">
                Every shilling held in licensed bank-backed escrow. Every milestone verified by licensed engineers before release.
              </p>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center shrink-0">
              <div className="p-2 bg-[#0B1B2B]/60 rounded border border-[#2B4560]/40">
                <span className="font-display font-bold text-lg text-[#C8A24A]">F</span>
                <p className="text-[10px] text-[#D9DEE3]/80 leading-tight mt-0.5">Find Experts</p>
              </div>
              <div className="p-2 bg-[#0B1B2B]/60 rounded border border-[#2B4560]/40">
                <span className="font-display font-bold text-lg text-[#1F6FEB]">U</span>
                <p className="text-[10px] text-[#D9DEE3]/80 leading-tight mt-0.5">Unite Team</p>
              </div>
              <div className="p-2 bg-[#0B1B2B]/60 rounded border border-[#2B4560]/40">
                <span className="font-display font-bold text-lg text-[#FF6B2C]">N</span>
                <p className="text-[10px] text-[#D9DEE3]/80 leading-tight mt-0.5">Negotiate Bids</p>
              </div>
              <div className="p-2 bg-[#0B1B2B]/60 rounded border border-[#2B4560]/40">
                <span className="font-display font-bold text-lg text-[#1E9E6A]">D</span>
                <p className="text-[10px] text-[#D9DEE3]/80 leading-tight mt-0.5">Deliver Proof</p>
              </div>
              <div className="p-2 bg-[#0B1B2B]/60 rounded border border-[#2B4560]/40">
                <span className="font-display font-bold text-lg text-[#C8A24A]">I</span>
                <p className="text-[10px] text-[#D9DEE3]/80 leading-tight mt-0.5">Ironclad Escrow</p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Workspace & Platform</h4>
            <ul className="space-y-2.5 text-xs text-[#D9DEE3]/80">
              <li><Link to="/dashboard" className="hover:text-white transition-colors font-medium">Projects Dashboard</Link></li>
              <li><Link to="/app/projects/proj-karen-villa" className="hover:text-white transition-colors">Karen Villa Workspace</Link></li>
              <li><Link to="/knowledge-base" className="hover:text-white transition-colors text-[#C8A24A] font-semibold">Sector Packs & Knowledge Base</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Contractors & Experts</Link></li>
              <li><Link to="/marketplace?tab=materials" className="hover:text-white transition-colors">Materials & Plant Hire</Link></li>
              <li><Link to="/trust" className="hover:text-white transition-colors">Escrow State Machine</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Transparent Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Regulatory & Compliance</h4>
            <ul className="space-y-2.5 text-xs text-[#D9DEE3]/80">
              <li><span className="text-white/60">BORAQS Regulated Architects & QS</span></li>
              <li><span className="text-white/60">Engineers Board of Kenya (EBK)</span></li>
              <li><span className="text-white/60">National Construction Authority (NCA)</span></li>
              <li><span className="text-white/60">NEMA Environmental Licences</span></li>
              <li><span className="text-white/60">ODPC Data Protection Act 2019</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Governance & Legal</h4>
            <ul className="space-y-2.5 text-xs text-[#D9DEE3]/80">
              <li><Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy & Data Notice</Link></li>
              <li><Link to="/legal/escrow-terms" className="hover:text-white transition-colors">Escrow Trust Framework</Link></li>
              <li><Link to="/legal/disputes" className="hover:text-white transition-colors">ADR & Dispute Resolution</Link></li>
              <li><Link to="/legal/safety" className="hover:text-white transition-colors">Site Safety & OSHA Compliance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Corporate & Investors</h4>
            <ul className="space-y-2.5 text-xs text-[#D9DEE3]/80">
              <li><Link to="/investors" className="text-[#C8A24A] hover:underline flex items-center gap-1 font-medium"><span>Investor Demo Dashboard</span></Link></li>
              <li><span className="text-white/60">Nairobi Headquarters, Westlands</span></li>
              <li><span className="text-white/60">Diaspora Liaison: London & New York</span></li>
              <li><span className="text-white/60">Support: support@fundi.build</span></li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer Notice (Essential for Trust & Legal Standards) */}
        <div className="pt-8 border-t border-[#2B4560]/30 text-[11px] text-[#D9DEE3]/60 leading-relaxed space-y-2">
          <p>
            <strong className="text-white/80">Custodial Regulatory Notice:</strong> FUNDI Technology Ltd is a construction project orchestration and evidence verification platform. FUNDI does not custody customer deposits directly. Escrow custody, payment rails, and settlement payouts (including M-Pesa B2C disbursements and RTGS transfers) are administered by Central Bank of Kenya (CBK) authorised banking and trust partners under the National Payment System Act.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-4 text-[#D9DEE3]/50">
            <p>© {new Date().getFullYear()} FUNDI Technology Ltd. All rights reserved. Registered in Kenya under the Companies Act 2015.</p>
            <div className="flex items-center gap-4">
              <span>Security audited</span>
              <span>·</span>
              <span>WCAG 2.2 AA compliant</span>
              <span>·</span>
              <span>Encrypted at rest</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
