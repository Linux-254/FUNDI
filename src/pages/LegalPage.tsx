import React, { useState } from 'react';
import { ShieldCheck, Scale, FileText, Lock, AlertCircle } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'escrow' | 'safety'>('terms');

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-[#1F6FEB]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F6FEB]">
              STATUTORY LEGAL & FIDUCIARY REPOSITORY
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B2B]">
            Legal Agreements & Governance Policies
          </h1>
          <p className="text-xs text-[#2B4560]/70 mt-1">
            Governed under the laws of the Republic of Kenya. Last revised: Q4 2026.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-6 border-t border-[#2B4560]/10 mt-6 overflow-x-auto pb-1">
            {[
              { id: 'terms', label: 'Terms of Service' },
              { id: 'privacy', label: 'Privacy & Data Notice (KDPA 2019)' },
              { id: 'escrow', label: 'Escrow Trust Terms' },
              { id: 'safety', label: 'Safety & OSHA Policies' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0B1B2B] text-white shadow-xs'
                    : 'bg-[#F4F1EA] text-[#2B4560] hover:bg-black/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Panel */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-xs prose prose-slate max-w-none text-xs leading-relaxed text-[#2B4560] space-y-4">
          
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-[#0B1B2B]">1. Terms of Service</h2>
              <p>
                Welcome to FUNDI ("Platform"), operated by FUNDI Technology Ltd (Kenya). By accessing or registering on the Platform as an Owner, Contractor, Expert, or Fundi, you agree to comply with and be bound by these Terms of Service.
              </p>
              <h3 className="font-bold text-sm text-[#0B1B2B]">2. Scope of Services & Non-Custodial Status</h3>
              <p>
                FUNDI provides construction project orchestration, milestone evidence tracking, statutory compliance checklists, and communication software. FUNDI is not a registered bank, contractor, or architectural firm. Fiduciary custody of milestone funds is conducted by our authorized banking partners under Central Bank of Kenya oversight.
              </p>
              <h3 className="font-bold text-sm text-[#0B1B2B]">3. Anti-Circumvention Rule</h3>
              <p>
                To maintain the integrity of project warranties, disputes mediation, and the construction credit history graph, all contracts and payments originating through the Platform must be executed through Platform escrow. Direct off-platform payment attempts void all platform warranties and result in suspension.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-[#0B1B2B]">Kenya Data Protection Act (2019) Compliance Notice</h2>
              <p>
                FUNDI Technology Ltd complies strictly with the Kenya Data Protection Act 2019 and guidelines issued by the Office of the Data Protection Commissioner (ODPC).
              </p>
              <h3 className="font-bold text-sm text-[#0B1B2B]">1. Collection of Project & Identity Information</h3>
              <p>
                We collect identity information (national ID/passport copies, KRA PIN certificates, board registration certificates from BORAQS, EBK, and NCA) solely for verification, fraud prevention, and statutory compliance verification.
              </p>
              <h3 className="font-bold text-sm text-[#0B1B2B]">2. Cryptographic Storage & Access Controls</h3>
              <p>
                National identification numbers and banking destination details are encrypted at rest using AES-256 field-level encryption. Document uploads are stored in private Cloudflare R2 object storage with time-limited signed access URLs.
              </p>
            </div>
          )}

          {activeTab === 'escrow' && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-[#0B1B2B]">Escrow Trust & Payment Settlement Framework</h2>
              <p>
                Milestone payments on FUNDI are held under statutory trust agreements with Central Bank of Kenya (CBK) authorised financial institutions (Stanbic Nominees / NCBA Trust).
              </p>
              <h3 className="font-bold text-sm text-[#0B1B2B]">1. Conditions of Release</h3>
              <p>
                Funds deposited for any milestone tranche cannot be drawn unilaterally by FUNDI or the Contractor. Releases require explicit authorization by the Project Owner following verification of required criteria, photographs, and consultant certificates.
              </p>
              <h3 className="font-bold text-sm text-[#0B1B2B]">2. Defects Liability Retention</h3>
              <p>
                Unless explicitly customized in the project contract, a standard five percent (5%) retention is withheld from each milestone payment and held in escrow until the end of the contractual defects liability period (typically 6 months post-handover).
              </p>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-[#0B1B2B]">Occupational Safety & Health (OSHA 2007) Policy</h2>
              <p>
                All construction sites managed through FUNDI must observe the Occupational Safety and Health Act 2007 (OSHA) enforced by the Directorate of Occupational Safety and Health Services (DOSHS).
              </p>
              <p>
                Mandatory site safety requirements include: personal protective equipment (PPE) for all workers and visitors, daily safety briefings, first-aid stations, and valid Contractors All Risk (CAR) and WIBA insurance policies in force before excavation commences.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
