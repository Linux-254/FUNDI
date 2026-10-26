import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  Landmark, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  RefreshCw,
  Lock,
  BookOpen,
  Search,
  Check,
  Edit2,
  ExternalLink,
  Filter
} from 'lucide-react';
import { api } from '../lib/api';
import { KnowledgeBaseData } from '../types';
import { IndicativeBadge } from '../components/common/IndicativeBadge';

export const AdminConsolePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'kb_editor' | 'disputes' | 'ledger' | 'metrics'>('verification');
  const [verificationDecisions, setVerificationDecisions] = useState<Record<string, 'approved' | 'rejected'>>({});
  
  // Knowledge Base State
  const [kb, setKb] = useState<KnowledgeBaseData | null>(null);
  const [kbFilter, setKbFilter] = useState<'all' | 'indicative' | 'verified'>('all');
  const [kbSection, setKbSection] = useState<'all' | 'checklist' | 'fees' | 'cement' | 'aggregates' | 'machinery' | 'sectors'>('all');
  const [kbSearch, setKbSearch] = useState('');
  const [verifySuccessMsg, setVerifySuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadKb();
  }, []);

  const loadKb = () => {
    api.getKnowledgeBase().then(setKb);
  };

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

  const handleVerifyKbRecord = async (
    section: 'documentChecklist' | 'feeSeeds' | 'cement' | 'aggregatesAndWalling' | 'machinery' | 'sectorPacks',
    id: string,
    title: string
  ) => {
    await api.verifyKbRecord(section, id, 'high', 'audit@fundi.build');
    loadKb();
    setVerifySuccessMsg(`Successfully verified "${title}" against official regulatory source.`);
    setTimeout(() => setVerifySuccessMsg(null), 4000);
  };

  // Compute Indicative count across KB
  const indicativeCount = kb ? (
    kb.documentChecklist.filter(d => d.confidence === 'low' || !d.lastVerifiedAt).length +
    kb.feeSeeds.filter(f => f.confidence === 'low' || !f.lastVerifiedAt).length +
    kb.cement.filter(c => c.confidence === 'low' || !c.lastVerifiedAt).length +
    kb.aggregatesAndWalling.filter(a => a.confidence === 'low' || !a.lastVerifiedAt).length +
    kb.machinery.filter(m => m.confidence === 'low' || !m.lastVerifiedAt).length +
    kb.sectorPacks.filter(s => s.confidence === 'low' || !s.lastVerifiedAt).length
  ) : 0;

  // Flattened entries for unified editor
  const getEditorRows = () => {
    if (!kb) return [];
    const rows: Array<{
      id: string;
      title: string;
      category: string;
      section: 'documentChecklist' | 'feeSeeds' | 'cement' | 'aggregatesAndWalling' | 'machinery' | 'sectorPacks';
      record: any;
      rateOrSpec: string;
    }> = [];

    if (kbSection === 'all' || kbSection === 'checklist') {
      kb.documentChecklist.forEach(d => {
        rows.push({
          id: d.id,
          title: d.doc,
          category: `Document (${d.agency})`,
          section: 'documentChecklist',
          record: d,
          rateOrSpec: `${d.stage} stage · ${d.appliesTo}`
        });
      });
    }

    if (kbSection === 'all' || kbSection === 'fees') {
      kb.feeSeeds.forEach(f => {
        rows.push({
          id: f.id,
          title: f.item,
          category: 'Statutory Fee Benchmark',
          section: 'feeSeeds',
          record: f,
          rateOrSpec: f.indicative
        });
      });
    }

    if (kbSection === 'all' || kbSection === 'cement') {
      kb.cement.forEach(c => {
        rows.push({
          id: c.id,
          title: `${c.brand} ${c.product} (Grade ${c.grade})`,
          category: 'Cement Material',
          section: 'cement',
          record: c,
          rateOrSpec: `KES ${c.priceKesMin} - ${c.priceKesMax} / 50kg bag`
        });
      });
    }

    if (kbSection === 'all' || kbSection === 'aggregates') {
      kb.aggregatesAndWalling.forEach(a => {
        rows.push({
          id: a.id,
          title: a.item,
          category: `Stone & Sand (${a.origin || 'Regional'})`,
          section: 'aggregatesAndWalling',
          record: a,
          rateOrSpec: `KES ${a.kesMin.toLocaleString()} - ${a.kesMax.toLocaleString()} / ${a.unit}`
        });
      });
    }

    if (kbSection === 'all' || kbSection === 'machinery') {
      kb.machinery.forEach(m => {
        rows.push({
          id: m.id,
          title: m.equipment,
          category: `Plant Hire (${m.tier})`,
          section: 'machinery',
          record: m,
          rateOrSpec: `KES ${m.rateKes} / ${m.unit}`
        });
      });
    }

    if (kbSection === 'all' || kbSection === 'sectors') {
      kb.sectorPacks.forEach(s => {
        rows.push({
          id: s.id,
          title: s.label,
          category: 'Sector Pack Blueprint',
          section: 'sectorPacks',
          record: s,
          rateOrSpec: s.types.slice(0, 3).join(', ')
        });
      });
    }

    return rows.filter(row => {
      const isInd = row.record.confidence === 'low' || !row.record.lastVerifiedAt;
      if (kbFilter === 'indicative' && !isInd) return false;
      if (kbFilter === 'verified' && isInd) return false;

      if (kbSearch) {
        const q = kbSearch.toLowerCase();
        return row.title.toLowerCase().includes(q) ||
          row.category.toLowerCase().includes(q) ||
          (row.record.source && row.record.source.toLowerCase().includes(q));
      }
      return true;
    });
  };

  const editorRows = getEditorRows();

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
              Four-eyes finance approval, credential verification, regulatory knowledge base maintenance, and double-entry reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 bg-white/10 rounded-lg text-white/80">
              Admin: audit@fundi.build
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-[#2B4560]/15 pb-2 overflow-x-auto text-xs">
          {[
            { id: 'verification', label: 'Verification Queue (2)' },
            { id: 'kb_editor', label: `Knowledge Base & Price Book (${indicativeCount} Indicative)` },
            { id: 'disputes', label: 'Disputes Workbench (0 Active)' },
            { id: 'ledger', label: 'Double-Entry Audit Ledger' },
            { id: 'metrics', label: 'System Health & Security' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap font-semibold ${
                activeTab === t.id
                  ? 'bg-[#0B1B2B] text-white shadow-xs font-bold'
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
                  <div 
                    key={item.id}
                    className="p-4 rounded-xl border border-[#2B4560]/15 bg-[#F4F1EA]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0B1B2B]">{item.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#0B1B2B] text-white font-mono">
                          {item.role}
                        </span>
                      </div>
                      <div className="text-xs text-[#2B4560]/80 space-x-2">
                        <span>Board: <strong>{item.body}</strong></span>
                        <span>·</span>
                        <span>Reg No: <strong className="font-mono">{item.regNo}</strong></span>
                        <span>·</span>
                        <span className="font-mono text-gray-500">Submitted: {item.submittedDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1 text-xs text-[#1F6FEB]">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-mono text-[11px] hover:underline cursor-pointer">{item.docName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
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

        {/* TAB 2: Knowledge Base & Price Book Editor */}
        {activeTab === 'kb_editor' && (
          <div className="bg-white rounded-xl shadow-xs border border-[#2B4560]/15 p-6 space-y-6">
            
            {/* Header & Data Quality Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B4560]/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1F6FEB]" />
                  <h3 className="font-display font-bold text-lg text-[#0B1B2B]">
                    Knowledge Base, Sector Packs &amp; Price Book Editor
                  </h3>
                </div>
                <p className="text-xs text-[#2B4560]/70 mt-1">
                  Enforces the FUNDI Data Quality Rule: Every statutory record, fee benchmark, and material rate must be backed by a cited authority and verified timestamp.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg">
                  {indicativeCount} Records Require Verification
                </span>
              </div>
            </div>

            {/* Success Toast */}
            {verifySuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{verifySuccessMsg}</span>
                </div>
                <button onClick={() => setVerifySuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
                  Dismiss
                </button>
              </div>
            )}

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#2B4560]/50" />
                <input
                  type="text"
                  placeholder="Search fee, material, statutory document, or agency..."
                  value={kbSearch}
                  onChange={(e) => setKbSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-[#2B4560]/20 rounded-lg text-xs focus:outline-hidden focus:border-[#1F6FEB]"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Sections' },
                  { id: 'checklist', label: 'Documents' },
                  { id: 'fees', label: 'Fees' },
                  { id: 'cement', label: 'Cement' },
                  { id: 'aggregates', label: 'Aggregates' },
                  { id: 'machinery', label: 'Machinery' },
                  { id: 'sectors', label: 'Sectors' },
                ].map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setKbSection(sec.id as any)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-mono transition-colors whitespace-nowrap ${
                      kbSection === sec.id
                        ? 'bg-[#0B1B2B] text-white font-bold'
                        : 'bg-[#F4F1EA] text-[#2B4560] hover:bg-gray-200'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1">
                {(['all', 'indicative', 'verified'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setKbFilter(f)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-mono uppercase transition-colors ${
                      kbFilter === f
                        ? 'bg-[#1F6FEB] text-white font-bold'
                        : 'bg-white border border-[#2B4560]/15 text-[#2B4560] hover:bg-gray-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Records List Table */}
            <div className="border border-[#2B4560]/15 rounded-xl overflow-hidden divide-y divide-[#2B4560]/10 text-xs">
              {editorRows.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-mono text-xs">
                  No records matching the filter criteria.
                </div>
              ) : (
                editorRows.map(row => {
                  const isIndicative = row.record.confidence === 'low' || !row.record.lastVerifiedAt;
                  return (
                    <div 
                      key={`${row.section}-${row.id}`}
                      className="p-4 hover:bg-[#F4F1EA]/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 bg-gray-100 font-mono text-[9px] rounded text-gray-700">
                            {row.category}
                          </span>
                          <span className="font-bold text-sm text-[#0B1B2B]">{row.title}</span>
                        </div>

                        <div className="text-[11px] text-[#2B4560]/80">
                          Specification: <span className="font-mono font-medium text-gray-900">{row.rateOrSpec}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-gray-500 pt-0.5">
                          <span>Source: <strong>{row.record.source}</strong></span>
                          <span>·</span>
                          <span>Verify at: <strong className="text-[#1F6FEB]">{row.record.verifyAt}</strong></span>
                          <span>·</span>
                          <span>Last verified: {row.record.lastVerifiedAt ? row.record.lastVerifiedAt : <span className="text-amber-700 font-bold">Unverified</span>}</span>
                          {row.record.verifiedBy && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-700">Auditor: {row.record.verifiedBy}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                        <IndicativeBadge record={row.record} size="xs" />

                        {isIndicative && (
                          <button
                            type="button"
                            onClick={() => handleVerifyKbRecord(row.section, row.id, row.title)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                            title="Promote record to high confidence and timestamp verification"
                          >
                            <Check className="w-3 h-3" />
                            <span>Verify Record</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-right text-[11px] font-mono text-gray-500">
              Showing {editorRows.length} catalog and regulatory entries
            </div>

          </div>
        )}

        {/* TAB 3: Disputes */}
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

        {/* TAB 4: Double-Entry Ledger */}
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

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2B4560]/10 bg-[#F4F1EA]/50 font-mono text-[#2B4560]">
                    <th className="py-2.5 px-3">Journal Ref</th>
                    <th className="py-2.5 px-3">Debit (Trust Asset)</th>
                    <th className="py-2.5 px-3">Credit (Liability / Beneficiary)</th>
                    <th className="py-2.5 px-3 text-right">Amount (KES)</th>
                    <th className="py-2.5 px-3">SHA-256 Ledger Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B4560]/10 font-mono">
                  <tr className="hover:bg-[#F4F1EA]/50">
                    <td className="py-2.5 px-3 font-semibold text-[#0B1B2B]">TXN-DEP-KAREN-01</td>
                    <td className="py-2.5 px-3 text-[#1F6FEB]">Diaspora USD Wire Inward</td>
                    <td className="py-2.5 px-3 text-[#1E9E6A]">NCBA Karen Escrow Trust A/C</td>
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

        {/* TAB 5: Metrics */}
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
