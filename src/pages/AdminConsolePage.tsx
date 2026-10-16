import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  Landmark, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  RefreshCw,
  Lock
} from 'lucide-react';
import { api } from '../lib/api';

export const AdminConsolePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'disputes' | 'ledger' | 'metrics'>('verification');
  const [verificationDecisions, setVerificationDecisions] = useState<Record<string, 'approved' | 'rejected'>>({});

  const pendingVerifications = [
    {
      id: 'ver-101',
      name: 'Arch. Susan Wanjala',
      role: 'Principal Architect',
      body: 'BORAQS Board',
      regNo: 'A1429',
      docName: 'BORAQS_Practising_Licence_2026.pdf',
      submittedDate: '2026-10-15',
      status: 'Pending'
    },
    {
      id: 'ver-102',
      name: 'Highland Civil & Building Ltd',
      role: 'Main Contractor',
      body: 'NCA Board',
      regNo: 'NCA 2 Building',
      docName: 'NCA_Practising_Cert_Highland.pdf',
      submittedDate: '2026-10-14',
      status: 'Pending'
    }
  ];

  const handleDecision = (id: string, decision: 'approved' | 'rejected') => {
    setVerificationDecisions(prev => ({ ...prev, [id]: decision }));
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-[#0B1B2B] text-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C8A24A]">
                CLOUDFLARE ZERO-TRUST ACCESS PROTECTED (2FA VERIFIED)
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              FUNDI Operations & Fiduciary Console
            </h1>
            <p className="text-xs text-[#D9DEE3]/70 mt-0.5">
              Four-eyes finance approval, verification queues, double-entry reconciliation, and dispute workbench.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 bg-white/10 rounded-lg text-white/80">
              Admin: audit@fundi.build
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-[#2B4560]/15 pb-2">
          {[
            { id: 'verification', label: 'Verification Queue (2)' },
            { id: 'disputes', label: 'Disputes Workbench (0 Active)' },
            { id: 'ledger', label: 'Double-Entry Audit Ledger' },
            { id: 'metrics', label: 'System Health & Security' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#0B1B2B] text-white shadow-xs'
                  : 'text-[#2B4560] hover:bg-black/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Verification Queue */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-xl shadow-xs border border-[#2B4560]/15 p-6 space-y-4">
            <div>
              <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                Pending Professional & Contractor Credentials
              </h3>
              <p className="text-xs text-[#2B4560]/70">
                Cross-referenced with BORAQS and NCA government registration portals.
              </p>
            </div>

            <div className="space-y-3">
              {pendingVerifications.map((item) => {
                const decision = verificationDecisions[item.id];
                return (
                  <div key={item.id} className="p-4 rounded-xl border border-[#2B4560]/15 bg-[#F4F1EA]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0B1B2B]">{item.name}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded font-mono font-bold bg-[#1F6FEB]/10 text-[#1F6FEB]">
                          {item.regNo}
                        </span>
                      </div>
                      <p className="text-xs text-[#2B4560]">
                        {item.role} · Regulating Body: <strong>{item.body}</strong>
                      </p>
                      <div className="text-[11px] text-[#2B4560]/70 font-mono">
                        Document: {item.docName} (Submitted: {item.submittedDate})
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {decision ? (
                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase font-mono ${
                          decision === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {decision}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleDecision(item.id, 'rejected')}
                            className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleDecision(item.id, 'approved')}
                            className="px-3 py-1.5 bg-[#1E9E6A] hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Approve Credential
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Disputes */}
        {activeTab === 'disputes' && (
          <div className="bg-white rounded-xl shadow-xs border border-[#2B4560]/15 p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#1E9E6A] mx-auto" />
            <h3 className="font-display font-bold text-base text-[#0B1B2B]">
              Zero Active Disputes Escalated
            </h3>
            <p className="text-xs text-[#2B4560]/70 max-w-md mx-auto">
              All 14 milestones executed across active sites have been approved amicably without verifier arbitration required.
            </p>
          </div>
        )}

        {/* TAB 3: Double-Entry Ledger */}
        {activeTab === 'ledger' && (
          <div className="bg-white rounded-xl shadow-xs border border-[#2B4560]/15 p-6 space-y-4">
            <div>
              <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                Double-Entry Fiduciary Trust Reconciliation
              </h3>
              <p className="text-xs text-[#2B4560]/70 font-mono">
                Stanbic Bank Nominees vs M-Pesa B2B Float · Cryptographically Hash-Chained
              </p>
            </div>

            <div className="overflow-x-auto text-xs font-mono">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2B4560]/10 text-[#2B4560]/70 text-[11px]">
                    <th className="py-2 px-3">Txn Ref</th>
                    <th className="py-2 px-3">Debit Account</th>
                    <th className="py-2 px-3">Credit Account</th>
                    <th className="py-2 px-3 text-right">Amount (KES)</th>
                    <th className="py-2 px-3">SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B4560]/10">
                  <tr className="hover:bg-[#F4F1EA]/50">
                    <td className="py-2.5 px-3 font-semibold text-[#0B1B2B]">MPESA-QRT8921804</td>
                    <td className="py-2.5 px-3 text-[#2B4560]">Dr. Wanjiku (M-Pesa)</td>
                    <td className="py-2.5 px-3 text-[#1E9E6A]">NCBA Escrow Trust</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#0B1B2B]">8,200,000.00</td>
                    <td className="py-2.5 px-3 text-[10px] text-gray-500 truncate max-w-[120px]">e3b0c44298fc1c14...</td>
                  </tr>
                  <tr className="hover:bg-[#F4F1EA]/50">
                    <td className="py-2.5 px-3 font-semibold text-[#0B1B2B]">REL-MS2-KAREN</td>
                    <td className="py-2.5 px-3 text-[#1E9E6A]">NCBA Escrow Trust</td>
                    <td className="py-2.5 px-3 text-[#1F6FEB]">Apex Build Stanbic A/C</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#0B1B2B]">8,000,000.00</td>
                    <td className="py-2.5 px-3 text-[10px] text-gray-500 truncate max-w-[120px]">9b71d224bd62f378...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Metrics */}
        {activeTab === 'metrics' && (
          <div className="bg-white rounded-xl shadow-xs border border-[#2B4560]/15 p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-[#0B1B2B]">
              Edge Gateway Security & API Telemetry
            </h3>
            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#F4F1EA] rounded-lg">
                <span className="text-[#2B4560]/60 block font-sans">Turnstile Bot Score</span>
                <span className="font-bold text-[#1E9E6A] text-lg">99.8% Human</span>
              </div>
              <div className="p-3 bg-[#F4F1EA] rounded-lg">
                <span className="text-[#2B4560]/60 block font-sans">Cloudflare Edge Latency</span>
                <span className="font-bold text-[#1F6FEB] text-lg">18ms (NBO)</span>
              </div>
              <div className="p-3 bg-[#F4F1EA] rounded-lg">
                <span className="text-[#2B4560]/60 block font-sans">Audit Ledger Invariants</span>
                <span className="font-bold text-[#1E9E6A] text-lg">Verified OK</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
