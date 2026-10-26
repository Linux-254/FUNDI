import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Upload, 
  ExternalLink, 
  Filter, 
  Search, 
  Layers, 
  ChevronDown, 
  ChevronRight,
  Lock,
  Building2,
  Check,
  X,
  FileCheck,
  Info,
  Activity
} from 'lucide-react';
import { api } from '../../lib/api';
import { KnowledgeBaseData, DocumentChecklistItem, Project, ComplianceItem } from '../../types';
import { IndicativeBadge } from '../common/IndicativeBadge';

export type StatutoryComplianceStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Verified';

interface ComplianceChecklistProps {
  project?: Project;
  onProjectUpdated?: () => void;
  className?: string;
}

// Statutory Milestone Phases in Kenyan Construction
export interface StatutoryMilestonePhase {
  id: string;
  gateNumber: number;
  title: string;
  subtitle: string;
  stageKey: 'before' | 'during' | 'after' | 'lifecycle';
  associatedAgencyIds: string[];
}

export const STATUTORY_MILESTONES: StatutoryMilestonePhase[] = [
  {
    id: 'sm-gate-1',
    gateNumber: 1,
    title: 'Milestone 1: Land Tenure & Physical Planning Approvals',
    subtitle: 'Ardhisasa land search, beacon re-establishment, and County zoning compliance',
    stageKey: 'before',
    associatedAgencyIds: ['lands', 'county-planning']
  },
  {
    id: 'sm-gate-2',
    gateNumber: 2,
    title: 'Milestone 2: Professional Design & County Building Permit',
    subtitle: 'BORAQS architectural set, EBK structural calculations & County Building Permit',
    stageKey: 'before',
    associatedAgencyIds: ['boraqs', 'ebk', 'county-works', 'county-fire']
  },
  {
    id: 'sm-gate-3',
    gateNumber: 3,
    title: 'Milestone 3: NEMA Environmental License & NCA 0.5% Levy',
    subtitle: 'NEMA EIA approval, NCA project registration, 0.5% levy clearance & site signboard',
    stageKey: 'before',
    associatedAgencyIds: ['nema', 'nca']
  },
  {
    id: 'sm-gate-4',
    gateNumber: 4,
    title: 'Milestone 4: DOSHS Workplace Safety & Contractor Licensing',
    subtitle: 'OSHA 2007 workplace registration, Contractor NCA annual license, CAR & WIBA insurance',
    stageKey: 'before',
    associatedAgencyIds: ['doshs', 'wra']
  },
  {
    id: 'sm-gate-5',
    gateNumber: 5,
    title: 'Milestone 5: Stage Inspections, Utility Energization & Occupation',
    subtitle: 'County stage inspections, KPLC electrical energization, and County Occupation Certificate',
    stageKey: 'after',
    associatedAgencyIds: ['county-planning', 'county-works', 'kplc', 'utilities', 'county-health', 'epra']
  }
];

export const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({
  project: propProject,
  onProjectUpdated,
  className = ''
}) => {
  const [kb, setKb] = useState<KnowledgeBaseData | null>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('all');
  const [selectedAgencyFilter, setSelectedAgencyFilter] = useState<string>('all');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StatutoryComplianceStatus | 'blocking'>('all');
  
  // Local requirement tracking state { [docId]: { status: StatutoryComplianceStatus, evidenceName?: string, date?: string } }
  const [itemStatuses, setItemStatuses] = useState<Record<string, {
    status: StatutoryComplianceStatus;
    evidenceDocName?: string;
    verifiedAt?: string;
    refNo?: string;
  }>>({});

  // Upload modal state
  const [uploadModalItem, setUploadModalItem] = useState<DocumentChecklistItem | null>(null);
  const [docNameInput, setDocNameInput] = useState('');
  const [refNoInput, setRefNoInput] = useState('');

  useEffect(() => {
    api.getKnowledgeBase().then((data) => {
      setKb(data);

      // Prepopulate statuses from knowledgeBase and project if available
      const initial: Record<string, { status: StatutoryComplianceStatus; evidenceDocName?: string; verifiedAt?: string }> = {};
      data.documentChecklist.forEach((item) => {
        // If propProject has a matching complianceItem, map its status
        const projItem = propProject?.complianceItems.find(
          c => c.title.toLowerCase().includes(item.doc.toLowerCase()) || item.doc.toLowerCase().includes(c.title.toLowerCase())
        );

        if (projItem) {
          let mappedStatus: StatutoryComplianceStatus = 'Not Started';
          if (projItem.status === 'Verified') mappedStatus = 'Verified';
          else if (projItem.status === 'Uploaded') mappedStatus = 'Submitted';
          else mappedStatus = 'In Progress';

          initial[item.id] = {
            status: mappedStatus,
            evidenceDocName: projItem.evidenceDocName,
            verifiedAt: projItem.verifiedAt
          };
        } else {
          // Default baseline simulation for demo
          const isPreVerified = item.lastVerifiedAt !== null && item.stage === 'before' && (item.id === 'doc-b-1' || item.id === 'doc-b-4' || item.id === 'doc-b-5');
          const isSubmitted = item.id === 'doc-b-2' || item.id === 'doc-b-3';
          const isInProgress = item.id === 'doc-b-6' || item.id === 'doc-d-1';

          let defaultStat: StatutoryComplianceStatus = 'Not Started';
          if (isPreVerified) defaultStat = 'Verified';
          else if (isSubmitted) defaultStat = 'Submitted';
          else if (isInProgress) defaultStat = 'In Progress';

          initial[item.id] = {
            status: defaultStat,
            evidenceDocName: isPreVerified ? `${item.agency.replace(/[^a-zA-Z]/g, '_')}_Permit.pdf` : isSubmitted ? `${item.agency.replace(/[^a-zA-Z]/g, '_')}_Application.pdf` : undefined,
            verifiedAt: isPreVerified ? item.lastVerifiedAt || '2026-02-15' : undefined
          };
        }
      });
      setItemStatuses(initial);
    });
  }, [propProject]);

  if (!kb) {
    return (
      <div className="p-8 text-center text-xs font-mono text-[#0B1B2B]">
        <div className="w-5 h-5 border-2 border-[#1F6FEB] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading Statutory Compliance Requirements from Knowledge Base...</span>
      </div>
    );
  }

  // Handle status cycle: Not Started -> In Progress -> Submitted -> Verified -> Not Started
  const handleToggleStatus = (id: string, current: StatutoryComplianceStatus) => {
    let nextStatus: StatutoryComplianceStatus = 'Not Started';
    if (current === 'Not Started') nextStatus = 'In Progress';
    else if (current === 'In Progress') nextStatus = 'Submitted';
    else if (current === 'Submitted') nextStatus = 'Verified';
    else if (current === 'Verified') nextStatus = 'Not Started';

    setItemStatuses(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: nextStatus,
        verifiedAt: nextStatus === 'Verified' ? new Date().toISOString().split('T')[0] : prev[id]?.verifiedAt
      }
    }));

    if (onProjectUpdated) {
      onProjectUpdated();
    }
  };

  // Submit manual document upload
  const handleSaveUpload = () => {
    if (!uploadModalItem) return;
    setItemStatuses(prev => ({
      ...prev,
      [uploadModalItem.id]: {
        status: 'Submitted',
        evidenceDocName: docNameInput || `${uploadModalItem.agency}_Document.pdf`,
        refNo: refNoInput,
        verifiedAt: undefined
      }
    }));
    setUploadModalItem(null);
    setDocNameInput('');
    setRefNoInput('');
  };

  // Filter items
  const allChecklistItems = kb.documentChecklist;

  const filteredItems = allChecklistItems.filter(item => {
    const currentStatus = itemStatuses[item.id]?.status || 'Not Started';

    // Milestone phase filter
    if (selectedMilestoneId !== 'all') {
      const activeMilestone = STATUTORY_MILESTONES.find(m => m.id === selectedMilestoneId);
      if (activeMilestone) {
        const matchesStage = item.stage === activeMilestone.stageKey || (activeMilestone.stageKey === 'after' && (item.stage === 'after' || item.stage === 'lifecycle'));
        const matchesAgency = activeMilestone.associatedAgencyIds.some(agId => {
          const agencyObj = kb.agencies.find(a => a.id === agId);
          return agencyObj && item.agency.toLowerCase().includes(agencyObj.name.toLowerCase().slice(0, 10));
        });
        if (!matchesStage && !matchesAgency) return false;
      }
    }

    // Stage filter
    if (selectedStageFilter !== 'all' && item.stage !== selectedStageFilter) {
      return false;
    }

    // Agency filter
    if (selectedAgencyFilter !== 'all') {
      const agencyObj = kb.agencies.find(a => a.id === selectedAgencyFilter);
      if (agencyObj && !item.agency.toLowerCase().includes(agencyObj.name.toLowerCase().slice(0, 8))) {
        return false;
      }
    }

    // Status filter
    if (statusFilter === 'blocking' && !item.blocking) return false;
    if (statusFilter !== 'all' && statusFilter !== 'blocking' && currentStatus !== statusFilter) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.doc.toLowerCase().includes(q) ||
        item.agency.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        (item.note && item.note.toLowerCase().includes(q))
      );
    }

    return true;
  });

  // Calculate dynamic stats
  const totalItemsCount = allChecklistItems.length;
  const verifiedCount = Object.values(itemStatuses).filter(s => s.status === 'Verified').length;
  const submittedCount = Object.values(itemStatuses).filter(s => s.status === 'Submitted').length;
  const inProgressCount = Object.values(itemStatuses).filter(s => s.status === 'In Progress').length;
  const notStartedCount = totalItemsCount - verifiedCount - submittedCount - inProgressCount;
  const overallCompliancePct = Math.round((verifiedCount / totalItemsCount) * 100);

  // Unverified blocking items count
  const unverifiedBlockingCount = allChecklistItems.filter(
    item => item.blocking && (itemStatuses[item.id]?.status !== 'Verified')
  ).length;

  const getStatusBadge = (status: StatutoryComplianceStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#1E9E6A] text-white flex items-center gap-1 shadow-2xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Verified</span>
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-500 text-white flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Submitted</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#1F6FEB] text-white flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </span>
        );
      case 'Not Started':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-gray-200 text-[#0B1B2B]">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Statutory Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#2B4560]/15 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2B4560]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#0B1B2B] text-white uppercase">
                Statutory Compliance Engine
              </span>
              <span className="text-xs font-mono text-[#1F6FEB] font-semibold">
                KENYA JURISDICTION PACK (24 AGENCIES)
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1B2B]">
              Statutory Project Milestone Compliance Checklist
            </h2>
            <p className="text-xs text-[#2B4560]/80 mt-1 max-w-2xl leading-relaxed">
              Dynamically derived from the National Construction Authority (NCA), County Governments, NEMA, DOSHS, EPRA, and BORAQS statutory schedules. Milestone disbursements are gated against mandatory evidence.
            </p>
          </div>

          {/* Compliance Progress Gauge */}
          <div className="flex items-center gap-4 shrink-0 bg-[#F4F1EA] p-3.5 rounded-xl border border-[#2B4560]/10">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#2B4560]/70 block font-semibold">
                Statutory Index
              </span>
              <span className="font-display font-extrabold text-2xl text-[#1E9E6A]">
                {overallCompliancePct}%
              </span>
              <span className="text-[10px] text-[#2B4560]/60 block font-mono">
                {verifiedCount} of {totalItemsCount} Verified
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 flex items-center justify-center font-bold font-mono text-xs text-[#0B1B2B]">
              <ShieldCheck className="w-6 h-6 text-[#1E9E6A]" />
            </div>
          </div>
        </div>

        {/* Blocking Alert Warning if unverified blocking items exist */}
        {unverifiedBlockingCount > 0 ? (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-amber-900 block">
                {unverifiedBlockingCount} Mandatory Blocking Clearances Outstanding
              </span>
              <p className="text-amber-900/80 text-[11px] leading-relaxed">
                Per the FUNDI Ironclad Escrow Deed, subsequent milestone releases are locked until registered professionals upload official government stamps for these blocking items.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">All mandatory blocking clearances satisfied for active milestone phase.</span>
          </div>
        )}

        {/* Status Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] text-emerald-800 font-sans block">Verified</span>
            <span className="text-base font-bold text-emerald-800">{verifiedCount} Items</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[10px] text-amber-800 font-sans block">Submitted</span>
            <span className="text-base font-bold text-amber-800">{submittedCount} Items</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <span className="text-[10px] text-blue-800 font-sans block">In Progress</span>
            <span className="text-base font-bold text-blue-800">{inProgressCount} Items</span>
          </div>
          <div className="p-3 bg-[#F4F1EA] rounded-xl border border-[#2B4560]/10">
            <span className="text-[10px] text-[#2B4560]/70 font-sans block">Not Started</span>
            <span className="text-base font-bold text-[#0B1B2B]">{notStartedCount} Items</span>
          </div>
        </div>
      </div>

      {/* Statutory Milestones Phase Selector */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B4560]/70 block px-1">
          Select Statutory Project Milestone Gate
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          <button
            onClick={() => setSelectedMilestoneId('all')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedMilestoneId === 'all'
                ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-sm font-bold'
                : 'bg-white border-[#2B4560]/15 hover:bg-[#F4F1EA] text-[#0B1B2B]'
            }`}
          >
            <span className="text-[10px] font-mono block opacity-70">Full Project</span>
            <span className="text-xs font-bold block mt-0.5">All 5 Milestone Gates</span>
          </button>

          {STATUTORY_MILESTONES.map(sm => (
            <button
              key={sm.id}
              onClick={() => setSelectedMilestoneId(sm.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMilestoneId === sm.id
                  ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-sm font-bold'
                  : 'bg-white border-[#2B4560]/15 hover:bg-[#F4F1EA] text-[#0B1B2B]'
              }`}
            >
              <span className="text-[10px] font-mono block opacity-70">Gate {sm.gateNumber}</span>
              <span className="text-xs font-bold block truncate mt-0.5" title={sm.title}>
                {sm.title.split(':')[1]?.trim() || sm.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-[#2B4560]/15 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#2B4560]/50" />
          <input
            type="text"
            placeholder="Search statutory clearance or agency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-[#2B4560]/20 rounded-lg text-xs focus:outline-hidden focus:border-[#1F6FEB]"
          />
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#2B4560]/70 font-mono text-[11px]">Stage:</span>
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="p-1.5 bg-[#F4F1EA] border border-[#2B4560]/20 rounded-lg text-xs font-medium text-[#0B1B2B] focus:outline-hidden"
          >
            <option value="all">All Stages</option>
            <option value="before">Before Works (Pre-construction)</option>
            <option value="during">During Works (Site Execution)</option>
            <option value="after">After Works (Closeout &amp; Occupation)</option>
            <option value="lifecycle">Lifecycle (Ongoing Maintenance)</option>
          </select>
        </div>

        {/* Agency Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#2B4560]/70 font-mono text-[11px]">Authority:</span>
          <select
            value={selectedAgencyFilter}
            onChange={(e) => setSelectedAgencyFilter(e.target.value)}
            className="p-1.5 bg-[#F4F1EA] border border-[#2B4560]/20 rounded-lg text-xs font-medium text-[#0B1B2B] focus:outline-hidden"
          >
            <option value="all">All Statutory Agencies</option>
            {kb.agencies.slice(0, 15).map(ag => (
              <option key={ag.id} value={ag.id}>{ag.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['all', 'Not Started', 'In Progress', 'Submitted', 'Verified', 'blocking'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#1F6FEB] text-white font-bold'
                  : 'bg-[#F4F1EA] text-[#2B4560] hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Requirements Checklist Table */}
      <div className="bg-white rounded-xl border border-[#2B4560]/15 shadow-xs overflow-hidden divide-y divide-[#2B4560]/10 text-xs">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-mono text-xs">
            No compliance items match your current filter parameters.
          </div>
        ) : (
          filteredItems.map(item => {
            const statusInfo = itemStatuses[item.id] || { status: 'Not Started' };
            const currentStatus = statusInfo.status;

            return (
              <div 
                key={item.id}
                className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  currentStatus === 'Verified' ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-[#F4F1EA]/40'
                }`}
              >
                {/* Left Column: Details */}
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Checkbox / Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id, currentStatus)}
                      className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        currentStatus === 'Verified' 
                          ? 'bg-[#1E9E6A] text-white shadow-2xs' 
                          : currentStatus === 'Submitted'
                          ? 'bg-amber-500 text-white'
                          : currentStatus === 'In Progress'
                          ? 'bg-[#1F6FEB] text-white'
                          : 'border-2 border-[#2B4560]/30 hover:border-[#1F6FEB]'
                      }`}
                      title="Click to cycle status: Not Started -> In Progress -> Submitted -> Verified"
                    >
                      {currentStatus === 'Verified' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      {currentStatus === 'Submitted' && <Clock className="w-3 h-3 text-white" />}
                      {currentStatus === 'In Progress' && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    </button>

                    {item.blocking ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-red-100 text-red-900 border border-red-200 uppercase flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-red-700" />
                        <span>Blocking Milestone Gate</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-gray-100 text-gray-700 border border-gray-200 uppercase">
                        Supporting Audit
                      </span>
                    )}

                    <span className="font-bold text-sm text-[#0B1B2B]">
                      {item.doc}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#2B4560]/80 flex flex-wrap items-center gap-2">
                    <span>Regulating Agency: <strong className="text-gray-900">{item.agency}</strong></span>
                    <span>·</span>
                    <span>Applies to: <span className="font-mono text-gray-700">{item.appliesTo}</span></span>
                    <span>·</span>
                    <span>Stage: <span className="font-mono font-bold uppercase text-[10px]">{item.stage}</span></span>
                  </div>

                  {item.note && (
                    <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-md border border-amber-200/80">
                      <strong>Statutory Condition:</strong> {item.note}
                    </p>
                  )}

                  {/* Uploaded Evidence Metadata */}
                  {statusInfo.evidenceDocName && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-[#1F6FEB]">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span className="font-mono font-semibold underline cursor-pointer">
                        {statusInfo.evidenceDocName}
                      </span>
                      {statusInfo.verifiedAt && (
                        <span className="text-[10px] text-emerald-800 font-mono">
                          (Verified {statusInfo.verifiedAt})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Legal Citation Footnote */}
                  <div className="text-[10px] font-mono text-gray-500 pt-0.5">
                    Statutory Source: <span>{item.source}</span> · Verify: <span className="text-[#1F6FEB]">{item.verifyAt}</span>
                  </div>
                </div>

                {/* Right Column: Actions & Quality Badge */}
                <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
                  <IndicativeBadge record={item} size="xs" />

                  {/* Upload Evidence Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setUploadModalItem(item);
                      setDocNameInput(statusInfo.evidenceDocName || `${item.agency.replace(/[^a-zA-Z]/g, '_')}_Permit.pdf`);
                    }}
                    className="px-2.5 py-1 border border-[#2B4560]/20 hover:bg-[#F4F1EA] text-[#0B1B2B] text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-[#1F6FEB]" />
                    <span>{statusInfo.evidenceDocName ? 'Replace Evidence' : 'Upload Evidence'}</span>
                  </button>

                  {/* Quick Status Pill Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item.id, currentStatus)}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    title="Click to advance status"
                  >
                    {getStatusBadge(currentStatus)}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Upload Evidence Modal */}
      {uploadModalItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setUploadModalItem(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-[#2B4560]/20 max-w-lg w-full p-6 space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#2B4560]/10 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Upload Statutory Evidence &amp; Permit Record
                </h3>
                <p className="text-xs text-[#2B4560]/70 mt-0.5">
                  Authority: {uploadModalItem.agency}
                </p>
              </div>
              <button 
                onClick={() => setUploadModalItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#2B4560] block mb-1">
                  Document / Licence Title:
                </label>
                <input
                  type="text"
                  value={uploadModalItem.doc}
                  disabled
                  className="w-full p-2 bg-[#F4F1EA] border border-[#2B4560]/15 rounded-lg text-xs font-medium text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#2B4560] block mb-1">
                  File Attachment Name:
                </label>
                <input
                  type="text"
                  value={docNameInput}
                  onChange={(e) => setDocNameInput(e.target.value)}
                  placeholder="e.g. NCA_Compliance_Cert_2026.pdf"
                  className="w-full p-2 bg-white border border-[#2B4560]/20 rounded-lg text-xs font-mono focus:outline-hidden focus:border-[#1F6FEB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#2B4560] block mb-1">
                  Official Gazette / Permit Reference No:
                </label>
                <input
                  type="text"
                  value={refNoInput}
                  onChange={(e) => setRefNoInput(e.target.value)}
                  placeholder="e.g. NCC/PL/2026/0491 or NCA/PR/9921"
                  className="w-full p-2 bg-white border border-[#2B4560]/20 rounded-lg text-xs font-mono focus:outline-hidden focus:border-[#1F6FEB]"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 leading-relaxed">
                <strong>Audit Trail Integrity:</strong> Uploaded evidence is cryptographically recorded in the FUNDI project ledger and submitted to the assigned independent verifier (BORAQS QS) for inspection clearance.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUploadModalItem(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#0B1B2B] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUpload}
                className="px-4 py-1.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Confirm &amp; Record Upload
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
