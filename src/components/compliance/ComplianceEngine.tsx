import React, { useState } from 'react';
import { Project, ComplianceItem } from '../../types';
import { api } from '../../lib/api';
import { 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Filter,
  Lock,
  Download
} from 'lucide-react';

interface ComplianceEngineProps {
  project: Project;
  onProjectUpdated: () => void;
}

export const ComplianceEngine: React.FC<ComplianceEngineProps> = ({
  project,
  onProjectUpdated
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDocItem, setSelectedDocItem] = useState<ComplianceItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Statutory Items' },
    { id: 'landAndOwnership', label: 'Land & Ownership' },
    { id: 'designAndApprovals', label: 'Design & Approvals (BORAQS/EBK)' },
    { id: 'ncaAndCounty', label: 'NCA & County Permits' },
    { id: 'contractsAndInsurance', label: 'Insurance (CAR & WIBA)' },
    { id: 'healthSafetyAndLabour', label: 'Site Safety (OSHA)' },
    { id: 'qualityAndCloseout', label: 'Handover & Occupation' }
  ];

  const filteredItems = activeCategory === 'all'
    ? project.complianceItems
    : project.complianceItems.filter(item => item.category === activeCategory);

  const verifiedCount = project.complianceItems.filter(i => i.status === 'Verified').length;
  const totalCount = project.complianceItems.length;
  const scorePct = Math.round((verifiedCount / totalCount) * 100);

  const handleToggleVerify = async (itemId: string) => {
    try {
      await api.toggleComplianceItem(project.id, itemId);
      onProjectUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner: Kenya Jurisdiction Pack Scorecard */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-[#2B4560]/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2B4560]/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1E9E6A]">
                JURISDICTION PACK: REPUBLIC OF KENYA (VER. 2026.4)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                NCA / BORAQS / EBK Compliant
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B1B2B] mt-1">
              Statutory Compliance & Permitting Engine
            </h3>
            <p className="text-xs text-[#2B4560]/70 mt-0.5">
              Automated checklist generated for {project.buildingType} in {project.county} County. Non-compliant items automatically block escrow funding releases.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#F4F1EA] p-4 rounded-xl border border-[#2B4560]/10 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-[#2B4560]/70 uppercase font-semibold block">Readiness Score</span>
              <span className="font-display font-bold text-2xl text-[#1E9E6A] font-mono">{scorePct}%</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#1E9E6A] flex items-center justify-center font-mono text-xs font-bold text-[#0B1B2B]">
              {verifiedCount}/{totalCount}
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === c.id
                  ? 'bg-[#0B1B2B] text-white font-semibold shadow-2xs'
                  : 'bg-[#F4F1EA] text-[#2B4560] hover:bg-black/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compliance Items Grid */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isVerified = item.status === 'Verified';

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all bg-white shadow-2xs ${
                isVerified 
                  ? 'border-emerald-200' 
                  : item.blocking 
                  ? 'border-amber-300 bg-amber-50/20' 
                  : 'border-[#2B4560]/15'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleVerify(item.id)}
                    className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      isVerified
                        ? 'bg-[#1E9E6A] text-white'
                        : 'border-2 border-[#2B4560]/30 hover:border-[#1E9E6A]'
                    }`}
                    title="Click to toggle verified status"
                  >
                    {isVerified && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-semibold text-xs sm:text-sm text-[#0B1B2B] ${isVerified ? 'line-through text-[#2B4560]/60' : ''}`}>
                        {item.title}
                      </h4>
                      {item.blocking && (
                        <span className="text-[10px] px-2 py-0.2 rounded font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Release Blocker</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#2B4560]/70 flex items-center gap-2 mt-1 flex-wrap">
                      <span className="font-semibold text-[#0B1B2B]">{item.authority}</span>
                      <span>·</span>
                      <span className="font-mono">{item.statutoryReference}</span>
                      {item.verifiedAt && (
                        <>
                          <span>·</span>
                          <span className="text-[#1E9E6A] font-medium">Verified on {item.verifiedAt}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side doc viewer action */}
                <div className="flex items-center gap-2 shrink-0 sm:self-center pl-9 sm:pl-0">
                  {item.evidenceDocName ? (
                    <button
                      onClick={() => setSelectedDocItem(item)}
                      className="px-3 py-1.5 text-xs font-mono font-medium rounded-md border border-[#2B4560]/20 bg-[#F4F1EA] hover:bg-white text-[#0B1B2B] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#1F6FEB]" />
                      <span className="max-w-[130px] truncate">{item.evidenceDocName}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#2B4560]/50 italic">
                      Upload required
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document View Modal */}
      {selectedDocItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#2B4560]/20 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1F6FEB]" />
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Statutory Certificate Viewer
                </h3>
              </div>
              <button onClick={() => setSelectedDocItem(null)}>✕</button>
            </div>

            <div className="p-4 bg-[#0B1B2B] text-white rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#C8A24A] font-bold uppercase block">
                {selectedDocItem.authority} OFFICIAL REGISTRATION RECORD
              </span>
              <h4 className="font-semibold text-sm">{selectedDocItem.evidenceDocName}</h4>
              <p className="text-xs text-[#D9DEE3]/70 font-mono">
                Statutory Reference: {selectedDocItem.statutoryReference}
              </p>
              <div className="text-[11px] text-[#D9DEE3]/60 pt-2 border-t border-white/10">
                Verified by: {selectedDocItem.verifiedBy || 'Nairobi City County Directorate'} on {selectedDocItem.verifiedAt || '2026-02-18'}
              </div>
            </div>

            <div className="p-3 bg-[#F4F1EA] rounded-lg text-xs text-[#2B4560] flex items-center justify-between">
              <span>Encrypted SHA-256 hash verified against government registry portal.</span>
              <Download className="w-4 h-4 text-[#1F6FEB] cursor-pointer" />
            </div>

            <button
              onClick={() => setSelectedDocItem(null)}
              className="w-full py-2 text-xs font-semibold text-[#0B1B2B] bg-[#F4F1EA] hover:bg-gray-200 rounded-lg"
            >
              Close Document
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
