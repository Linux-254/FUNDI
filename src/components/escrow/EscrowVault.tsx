import React, { useState } from 'react';
import { Project, Milestone, EscrowTransaction, UserRole } from '../../types';
import { api } from '../../lib/api';
import confetti from 'canvas-confetti';
import { 
  Vault, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Building2,
  FileText,
  RotateCcw
} from 'lucide-react';

interface EscrowVaultProps {
  project: Project;
  currency: 'KES' | 'USD';
  currentUserRole: UserRole;
  onProjectUpdated: () => void;
}

export const EscrowVault: React.FC<EscrowVaultProps> = ({
  project,
  currency,
  currentUserRole,
  onProjectUpdated
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(project.milestones[2]?.id || project.milestones[0]?.id);
  const [fundingModalOpen, setFundingModalOpen] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('0712345678');
  const [fundingLoading, setFundingLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const selectedMilestone = project.milestones.find(m => m.id === selectedMilestoneId) || project.milestones[0];

  // Milestone action handlers
  const handleFundMpesa = async () => {
    setFundingLoading(true);
    try {
      const res = await api.fundMilestoneViaMpesa(project.id, selectedMilestone.id, mpesaPhone);
      setActionMessage(res.message);
      setFundingModalOpen(false);
      onProjectUpdated();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setFundingLoading(false);
    }
  };

  const handleApproveAndRelease = async () => {
    if (!window.confirm(`Confirm release of ${api.formatMoney(selectedMilestone.amountMinor, currency)} for ${selectedMilestone.title}? Retention holdback and contractor payout splits will execute.`)) {
      return;
    }
    try {
      const res = await api.approveAndReleaseMilestone(project.id, selectedMilestone.id);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setActionMessage(res.message);
      onProjectUpdated();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRaiseDispute = async () => {
    if (!disputeReason.trim()) return;
    try {
      await api.raiseDispute(project.id, selectedMilestone.id, disputeReason);
      setDisputeModalOpen(false);
      setActionMessage(`Dispute logged. ${api.formatMoney(selectedMilestone.amountMinor, currency)} frozen under verified ADR mediation.`);
      setDisputeReason('');
      onProjectUpdated();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Custody Vault Overview */}
      <div className="bg-[#0B1B2B] text-white rounded-2xl p-6 sm:p-8 border border-[#C8A24A]/40 relative overflow-hidden shadow-xl">
        {/* Subtle gold glow & watermark */}
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-[#C8A24A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8A24A] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#C8A24A]">
                IRONCLAD ESCROW VAULT (NCBA / M-PESA TRUST)
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#D9DEE3]/70 mt-1 max-w-2xl">
              Funds are held under statutory custody with Stanbic / NCBA Trust. Money only moves when milestones satisfy photographic and licensed engineer sign-offs.
            </p>
          </div>

          {/* Locked vs Released Metrics */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 bg-white/5 rounded-xl border border-[#C8A24A]/30">
              <span className="text-[10px] text-[#C8A24A] font-semibold uppercase tracking-wider block">
                Currently Locked in Escrow
              </span>
              <span className="font-display font-bold text-xl sm:text-2xl text-white">
                {api.formatMoney(project.escrowHeldMinor, currency)}
              </span>
              <span className="text-[10px] text-[#D9DEE3]/60 font-mono block mt-0.5">
                Protected against dispute
              </span>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-[#1E9E6A]/30">
              <span className="text-[10px] text-[#1E9E6A] font-semibold uppercase tracking-wider block">
                Released Against Evidence
              </span>
              <span className="font-display font-bold text-xl sm:text-2xl text-white">
                {api.formatMoney(project.escrowReleasedMinor, currency)}
              </span>
              <span className="text-[10px] text-[#D9DEE3]/60 font-mono block mt-0.5">
                Paid to contractors & fundis
              </span>
            </div>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-4 p-3 bg-[#1F6FEB]/20 border border-[#1F6FEB]/40 rounded-lg text-xs text-blue-200 flex items-center justify-between">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage(null)} className="text-white hover:text-white/80">✕</button>
          </div>
        )}
      </div>

      {/* Main Grid: Milestone Locks on Left, Milestone Detail & Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Milestone Lock List */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 shadow-xs border border-[#2B4560]/15 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#2B4560]/10">
            <h3 className="font-display font-bold text-sm text-[#0B1B2B]">
              Contract Milestone Escrow Locks
            </h3>
            <span className="text-xs text-[#2B4560]/60 font-mono">
              {project.milestones.length} Phased Tranches
            </span>
          </div>

          <div className="space-y-2.5">
            {project.milestones.map((m) => {
              const isSelected = selectedMilestone.id === m.id;
              const isReleased = m.state === 'Released';
              const isFunded = m.state === 'Funded';
              const isEvidenceSubmitted = m.state === 'EvidenceSubmitted';
              const isDisputed = m.state === 'Disputed';
              const isAwaiting = m.state === 'AwaitingFunding' || m.state === 'Draft';

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMilestoneId(m.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#C8A24A] bg-[#C8A24A]/5 shadow-xs'
                      : 'border-[#2B4560]/15 hover:bg-[#F4F1EA]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Lock Icon Indicator */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isReleased 
                          ? 'bg-[#1E9E6A]/15 text-[#1E9E6A]' 
                          : isFunded || isEvidenceSubmitted
                          ? 'bg-[#C8A24A]/20 text-[#C8A24A]'
                          : isDisputed
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-black/5 text-[#2B4560]/60'
                      }`}>
                        {isReleased ? (
                          <Unlock className="w-4 h-4" />
                        ) : isDisputed ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-[#0B1B2B] truncate">
                          {m.title}
                        </div>
                        <div className="text-[11px] text-[#2B4560]/70 flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-bold text-[#0B1B2B]">
                            {api.formatMoney(m.amountMinor, currency)}
                          </span>
                          <span>·</span>
                          <span>Due: {m.dueDate}</span>
                          <span>·</span>
                          <span>Retention: {m.retentionPct}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0 text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isReleased
                          ? 'bg-emerald-100 text-emerald-800'
                          : isEvidenceSubmitted
                          ? 'bg-blue-100 text-blue-800'
                          : isFunded
                          ? 'bg-amber-100 text-amber-800'
                          : isDisputed
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.state}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Milestone Detail, Payout Split, and Release Controls */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 shadow-xs border border-[#2B4560]/15 space-y-4">
          <div className="border-b border-[#2B4560]/10 pb-3">
            <span className="text-[10px] font-mono uppercase font-bold text-[#C8A24A] block">
              VAULT TRANCHE INSPECTION
            </span>
            <h4 className="font-display font-bold text-sm text-[#0B1B2B] mt-0.5">
              {selectedMilestone.title}
            </h4>
            <div className="text-xl font-display font-bold text-[#0B1B2B] mt-1">
              {api.formatMoney(selectedMilestone.amountMinor, currency)}
            </div>
          </div>

          <p className="text-xs text-[#2B4560] leading-relaxed">
            {selectedMilestone.description}
          </p>

          {/* Required Criteria & Submitted Evidence */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#0B1B2B] block">Acceptance Criteria:</span>
            <ul className="space-y-1.5 text-[11px] text-[#2B4560]/80">
              {selectedMilestone.criteria.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E6A] shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submitted Site Evidence Photo (if available) */}
          {selectedMilestone.submittedEvidence && selectedMilestone.submittedEvidence.length > 0 && (
            <div className="p-3 bg-[#F4F1EA] rounded-lg border border-[#2B4560]/10 space-y-2">
              <span className="text-xs font-semibold text-[#0B1B2B] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1F6FEB]" />
                <span>Submitted Photographic & Lab Evidence:</span>
              </span>
              <img 
                src={selectedMilestone.submittedEvidence[0].photoUrl} 
                alt="Site Inspection Proof" 
                className="w-full h-36 object-cover rounded-md border border-[#2B4560]/20"
                referrerPolicy="no-referrer"
              />
              <div className="text-[11px] text-[#2B4560] leading-tight">
                <p className="font-medium">{selectedMilestone.submittedEvidence[0].description}</p>
                <p className="text-[10px] text-[#2B4560]/70 font-mono mt-0.5">
                  GPS: {selectedMilestone.submittedEvidence[0].geoCoordinates} · {selectedMilestone.submittedEvidence[0].timestamp}
                </p>
              </div>
            </div>
          )}

          {/* Authoritative Payout Split Breakdown */}
          <div className="p-3 rounded-lg bg-[#0B1B2B] text-white space-y-2 text-xs">
            <span className="text-[10px] font-mono text-[#C8A24A] uppercase font-bold tracking-wider block">
              PRE-CONFIGURED DISBURSEMENT SPLIT
            </span>
            <div className="flex justify-between text-[#D9DEE3]/80">
              <span>Main Contractor (85%):</span>
              <span className="font-mono text-white">
                {api.formatMoney(Math.round(selectedMilestone.amountMinor * 0.85), currency)}
              </span>
            </div>
            <div className="flex justify-between text-[#D9DEE3]/80">
              <span>Daily Labour Wages Pool (10%):</span>
              <span className="font-mono text-white">
                {api.formatMoney(Math.round(selectedMilestone.amountMinor * 0.10), currency)}
              </span>
            </div>
            <div className="flex justify-between text-[#D9DEE3]/80">
              <span>Defects Retention Holdback (5%):</span>
              <span className="font-mono text-[#C8A24A]">
                {api.formatMoney(Math.round(selectedMilestone.amountMinor * 0.05), currency)}
              </span>
            </div>
          </div>

          {/* Action Buttons based on state */}
          <div className="pt-2 space-y-2">
            {selectedMilestone.state === 'AwaitingFunding' && (
              <button
                onClick={() => setFundingModalOpen(true)}
                className="w-full py-2.5 px-4 bg-[#C8A24A] hover:bg-[#b08e3e] text-[#0B1B2B] font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Fund via M-Pesa STK Push / Bank</span>
              </button>
            )}

            {selectedMilestone.state === 'EvidenceSubmitted' && (
              <div className="space-y-2">
                <button
                  onClick={handleApproveAndRelease}
                  className="w-full py-2.5 px-4 bg-[#1E9E6A] hover:bg-[#1E9E6A]/90 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4 text-[#C8A24A]" />
                  <span>Approve Evidence & Release Escrow</span>
                </button>
                <button
                  onClick={() => setDisputeModalOpen(true)}
                  className="w-full py-2 px-3 bg-white border border-[#D64545] text-[#D64545] hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Raise Dispute (Freeze Tranche)
                </button>
              </div>
            )}

            {selectedMilestone.state === 'Funded' && (
              <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-800 border border-amber-200">
                <span>Funds safely locked in vault. Awaiting contractor to complete work and upload certified site evidence.</span>
              </div>
            )}

            {selectedMilestone.state === 'Released' && (
              <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-800 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                <span>Tranche successfully released and disbursed to contractor and labour M-Pesa accounts.</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* M-Pesa STK Push Simulation Modal */}
      {fundingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#2B4560]/20 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#1E9E6A]" />
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Lipa na M-Pesa Escrow Funding
                </h3>
              </div>
              <button onClick={() => setFundingModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <p className="text-xs text-[#2B4560]">
              An instantaneous M-Pesa STK Push will be sent to your phone to lock{' '}
              <strong className="text-[#0B1B2B]">{api.formatMoney(selectedMilestone.amountMinor, currency)}</strong> into the project escrow trust account.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                M-Pesa Registered Mobile Number
              </label>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="0712345678"
                className="w-full text-sm font-mono p-2.5 rounded-lg border border-[#2B4560]/20 focus:outline-[#1F6FEB]"
              />
            </div>

            <div className="p-3 bg-[#F4F1EA] rounded-lg text-[11px] text-[#2B4560]/80 space-y-1">
              <p>• Trust Custodian: NCBA / Stanbic Nominees</p>
              <p>• Paybill: 408012 (FUNDI Escrow Settlement)</p>
              <p>• Money is held in trust; contractor cannot access without verification.</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setFundingModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-[#2B4560] border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFundMpesa}
                disabled={fundingLoading}
                className="flex-1 py-2 text-xs font-bold text-[#0B1B2B] bg-[#C8A24A] hover:bg-[#b5923f] rounded-lg shadow-sm"
              >
                {fundingLoading ? 'Sending STK Push...' : 'Authorize STK Push'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-[#D64545]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-display font-bold text-base">
                  Raise Milestone Dispute
                </h3>
              </div>
              <button onClick={() => setDisputeModalOpen(false)}>✕</button>
            </div>

            <p className="text-xs text-[#2B4560]">
              This will freeze this tranche of {api.formatMoney(selectedMilestone.amountMinor, currency)}. The independent verifier (QS Brian Mwangi) will inspect on-site within 48 hours under structured ADR.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                Reason for Quality / Progress Dispute
              </label>
              <textarea
                rows={3}
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="e.g. Concrete cube test report missing or slab levels off by 15mm..."
                className="w-full text-xs p-2.5 rounded-lg border border-[#2B4560]/20 focus:outline-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDisputeModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-[#2B4560] border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRaiseDispute}
                className="flex-1 py-2 text-xs font-bold text-white bg-[#D64545] hover:bg-rose-700 rounded-lg shadow-sm"
              >
                Freeze & Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
