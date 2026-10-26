import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  DollarSign, 
  ExternalLink, 
  Search, 
  Filter, 
  ChevronRight, 
  Briefcase, 
  Users, 
  FileText,
  Lock,
  ArrowRight,
  PlusCircle,
  Eye,
  Check,
  X
} from 'lucide-react';
import { api } from '../../lib/api';
import { Project, Milestone, MilestoneState, UserRole } from '../../types';
import { ComplianceChecklist } from '../compliance/ComplianceChecklist';
import { ProjectHealthChart } from './ProjectHealthChart';
import { ProjectStats } from './ProjectStats';
import { BudgetGuardAlert } from '../budget/BudgetGuardAlert';

interface ProjectDashboardProps {
  currency: 'KES' | 'USD';
  currentUserRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  currency,
  currentUserRole = 'owner',
  onSelectRole
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [countyFilter, setCountyFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedMilestoneProject, setSelectedMilestoneProject] = useState<string | null>(null);

  // Compliance modal state
  const [complianceModalProject, setComplianceModalProject] = useState<Project | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    const data = await api.getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8 bg-[#F4F1EA]">
        <div className="flex items-center gap-3 text-xs font-mono text-[#0B1B2B]">
          <div className="w-5 h-5 border-2 border-[#1F6FEB] border-t-transparent rounded-full animate-spin" />
          <span>Loading FUNDI Active Projects Portfolio...</span>
        </div>
      </div>
    );
  }

  // Portfolio Totals
  const totalProjectsCount = projects.length;
  const totalPortfolioBaselineMinor = projects.reduce((acc, p) => acc + p.budgetBaselineMinor, 0);
  const totalEscrowHeldMinor = projects.reduce((acc, p) => acc + p.escrowHeldMinor, 0);
  const totalEscrowReleasedMinor = projects.reduce((acc, p) => acc + p.escrowReleasedMinor, 0);
  const avgComplianceScore = Math.round(
    projects.reduce((acc, p) => acc + p.complianceScorePct, 0) / (totalProjectsCount || 1)
  );

  // Milestone Status Aggregations
  const allMilestones: Milestone[] = projects.flatMap(p => p.milestones);
  const milestonesReleasedCount = allMilestones.filter(m => m.state === 'Released').length;
  const milestonesInProgressCount = allMilestones.filter(m => m.state === 'InProgress').length;
  const milestonesUnderReviewCount = allMilestones.filter(m => m.state === 'UnderReview' || m.state === 'EvidenceSubmitted').length;
  const milestonesFundedCount = allMilestones.filter(m => m.state === 'Funded' || m.state === 'AwaitingFunding').length;

  // Filter projects
  const filteredProjects = projects.filter(p => {
    // County filter
    if (countyFilter !== 'all' && p.county !== countyFilter) return false;

    // Stage filter
    if (stageFilter !== 'all') {
      if (stageFilter === 'substructure' && !p.stage.toLowerCase().includes('substructure')) return false;
      if (stageFilter === 'superstructure' && !p.stage.toLowerCase().includes('superstructure')) return false;
      if (stageFilter === 'finishes' && !p.stage.toLowerCase().includes('roofing') && !p.stage.toLowerCase().includes('finishes')) return false;
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.activeContractorName.toLowerCase().includes(q) ||
        p.county.toLowerCase().includes(q) ||
        p.ward.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const getMilestoneStateBadge = (state: MilestoneState) => {
    switch (state) {
      case 'Released':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Released</span>;
      case 'InProgress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">In Progress</span>;
      case 'UnderReview':
      case 'EvidenceSubmitted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">Under Review</span>;
      case 'Funded':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">Funded in Escrow</span>;
      case 'AwaitingFunding':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200">Awaiting Funding</span>;
      case 'Disputed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">Disputed</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-700">Draft</span>;
    }
  };

  const getRoleBannerContent = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return {
          title: 'Project Owner & Diaspora Capital Control View',
          desc: 'Manage project capital vaults, authorize milestone escrow releases upon verified proof, and oversee statutory compliance.',
          pills: ['Escrow Dual Control', 'Live Progress Proof', 'Budget Contingency Guard']
        };
      case 'contractor':
        return {
          title: 'Main Contractor & Site Operations View',
          desc: 'Submit milestone evidence for inspector sign-off, request escrow releases, and disburse fundi daily wages directly.',
          pills: ['Milestone Claim Queue', 'M-Pesa Labour Disbursal', 'Price Book Material Bids']
        };
      case 'expert':
        return {
          title: 'Registered Expert & Architectural/Engineering Consultant View',
          desc: 'Review submitted milestone evidence, conduct independent site quality audits, and issue EBK/BORAQS structural approvals.',
          pills: ['Quality Audit Queue', 'Structural Sign-offs', 'Variation Reviews']
        };
      case 'labour':
        return {
          title: 'Fundi Craftsperson & Site Crew View',
          desc: 'Track daily site attendance, view guaranteed escrow wage reserves, and access DOSHS safety compliance guidelines.',
          pills: ['Guaranteed Daily Wage', 'Attendance Register', 'Safety Protocol']
        };
      case 'verifier':
        return {
          title: 'Independent Verifier & Bank Escrow Monitor View',
          desc: 'Audit capital liquidity across project escrow accounts, verify statutory agency permits, and review audit trails.',
          pills: ['Escrow Liquidity Audit', 'Statutory Permit Verification', 'CBK Compliance Trail']
        };
      case 'admin':
        return {
          title: 'FUNDI Platform Admin & Governance View',
          desc: 'Platform governance, statutory knowledge base verification, user role approvals, and system-wide escrow monitoring.',
          pills: ['System Governance', 'Knowledge Base Admin', 'Audit Logs']
        };
      default:
        return {
          title: 'Executive Construction Portfolio View',
          desc: 'Consolidated overview of construction projects, budget allocations, and escrow releases across Kenya.',
          pills: ['Multi-Project Tracking', 'Escrow Vaults', 'Compliance Engine']
        };
    }
  };

  const roleBanner = getRoleBannerContent(currentUserRole);

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Role Perspective Focus Banner */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#2B4560]/15 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B1B2B] text-[#C8A24A] flex items-center justify-center shrink-0 font-bold font-mono text-sm">
              {currentUserRole.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] font-bold text-[#1F6FEB] uppercase tracking-wider">
                  ACTIVE ROLE PERSPECTIVE: {currentUserRole.toUpperCase()}
                </span>
                <span className="text-[#2B4560]/30">·</span>
                {roleBanner.pills.map((pill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#F4F1EA] text-[#0B1B2B] rounded text-[10px] font-mono border border-[#2B4560]/10">
                    {pill}
                  </span>
                ))}
              </div>
              <h2 className="font-display font-bold text-sm sm:text-base text-[#0B1B2B] mt-0.5">
                {roleBanner.title}
              </h2>
              <p className="text-xs text-[#2B4560]/80">
                {roleBanner.desc}
              </p>
            </div>
          </div>

          {onSelectRole && (
            <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
              <span className="text-xs text-[#2B4560]/60 font-mono">Switch Role:</span>
              <select
                value={currentUserRole}
                onChange={(e) => onSelectRole(e.target.value as UserRole)}
                className="px-2.5 py-1.5 bg-[#F4F1EA] border border-[#2B4560]/20 rounded-lg text-xs font-semibold text-[#0B1B2B] focus:outline-hidden"
              >
                <option value="owner">Project Owner</option>
                <option value="contractor">Main Contractor</option>
                <option value="expert">Expert / Architect / Engineer</option>
                <option value="labour">Fundi / Labourer</option>
                <option value="verifier">Independent Verifier</option>
                <option value="supplier">Material / Machinery Supplier</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Portfolio Status Summary Metrics */}
        <ProjectStats projects={projects} currency={currency} />

        {/* Portfolio Master Header Card */}
        <div className="bg-[#0B1B2B] text-white rounded-2xl p-6 sm:p-10 border border-[#2B4560]/30 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-mono font-medium text-[#C8A24A]">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>FUNDI MULTI-PROJECT EXECUTIVE PORTFOLIO</span>
                </div>
                <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Active Projects &amp; Milestone Control Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-[#D9DEE3]/80 max-w-2xl leading-relaxed">
                  Consolidated oversight of active construction sites across Kenya. Track current structural phase progress, milestone escrow states, budget burn-down, and statutory compliance.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/app/projects/new"
                  className="px-4 py-2.5 bg-[#C8A24A] hover:bg-[#b59039] text-[#0B1B2B] text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Initialize New Project</span>
                </Link>
              </div>
            </div>

            {/* Portfolio Key Roll-Up Metrics */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/60 font-sans block text-[11px]">Active Sites</span>
                <span className="text-lg sm:text-xl font-bold text-white">{totalProjectsCount} Projects</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/60 font-sans block text-[11px]">Portfolio Budget</span>
                <span className="text-lg sm:text-xl font-bold text-[#C8A24A]">
                  {api.formatMoney(totalPortfolioBaselineMinor, currency)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/60 font-sans block text-[11px]">Locked in Escrow</span>
                <span className="text-lg sm:text-xl font-bold text-[#1F6FEB]">
                  {api.formatMoney(totalEscrowHeldMinor, currency)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/60 font-sans block text-[11px]">Released against Proof</span>
                <span className="text-lg sm:text-xl font-bold text-[#1E9E6A]">
                  {api.formatMoney(totalEscrowReleasedMinor, currency)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-white/60 font-sans block text-[11px]">Avg Compliance</span>
                <span className="text-lg sm:text-xl font-bold text-white">{avgComplianceScore}% Score</span>
              </div>
            </div>

            {/* Active Milestone Status Pills */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-white/70 font-sans text-[11px]">Milestones Across Portfolio:</span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md font-mono text-[11px]">
                {milestonesReleasedCount} Released
              </span>
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md font-mono text-[11px]">
                {milestonesInProgressCount} In Progress
              </span>
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md font-mono text-[11px]">
                {milestonesUnderReviewCount} Under Verification
              </span>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md font-mono text-[11px]">
                {milestonesFundedCount} Funded in Vault
              </span>
            </div>
          </div>
        </div>

        {/* Recharts Project Health Chart */}
        <ProjectHealthChart 
          projects={projects} 
          currency={currency} 
        />

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl p-4 border border-[#2B4560]/15 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#2B4560]/50" />
            <input
              type="text"
              placeholder="Search by project name, contractor, owner, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#2B4560]/20 rounded-lg text-xs focus:outline-hidden focus:border-[#1F6FEB]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* County Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#2B4560]/70 font-mono text-[11px]">County:</span>
              <select
                value={countyFilter}
                onChange={(e) => setCountyFilter(e.target.value)}
                className="p-1.5 bg-[#F4F1EA] border border-[#2B4560]/20 rounded-lg text-xs font-medium text-[#0B1B2B] focus:outline-hidden"
              >
                <option value="all">All Counties</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Nakuru">Nakuru</option>
                <option value="Kiambu">Kiambu</option>
              </select>
            </div>

            {/* Stage Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#2B4560]/70 font-mono text-[11px]">Phase:</span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="p-1.5 bg-[#F4F1EA] border border-[#2B4560]/20 rounded-lg text-xs font-medium text-[#0B1B2B] focus:outline-hidden"
              >
                <option value="all">All Structural Phases</option>
                <option value="substructure">Substructure &amp; Ground</option>
                <option value="superstructure">Superstructure &amp; Frame</option>
                <option value="finishes">Roofing &amp; Finishes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Projects Summary Cards List */}
        <div className="space-y-6">
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-[#2B4560] border border-[#2B4560]/15 space-y-3">
              <Building2 className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                No projects found matching the filter
              </h3>
              <p className="text-xs text-[#2B4560]/70">
                Try clearing your search terms or selecting 'All Counties'.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const releasedCount = project.milestones.filter(m => m.state === 'Released').length;
              const totalMilestonesCount = project.milestones.length;
              const isExpandedMilestones = selectedMilestoneProject === project.id;

              return (
                <div 
                  key={project.id}
                  className="bg-white rounded-2xl border border-[#2B4560]/15 shadow-xs overflow-hidden hover:border-[#1F6FEB]/40 transition-all space-y-4 p-6 sm:p-7"
                >
                  {/* Top Bar: Title, Image Thumbnail, Specs & Quick Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#2B4560]/10">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <img 
                        src={project.imageThumbnail} 
                        alt={project.title} 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#2B4560]/15 shrink-0 shadow-2xs"
                      />

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-[10px] text-[#1F6FEB] uppercase tracking-wider">
                            {project.id.toUpperCase()}
                          </span>
                          <span className="text-[#2B4560]/40">·</span>
                          <span className="text-xs text-[#2B4560] flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#FF6B2C]" />
                            <span>{project.ward}, {project.county} County ({project.plotSize})</span>
                          </span>
                          <span className="text-[#2B4560]/40">·</span>
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#C8A24A]/20 text-[#0B1B2B] uppercase">
                            {project.buildingType} · {project.sizeSqm}m²
                          </span>
                        </div>

                        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1B2B]">
                          {project.title}
                        </h2>

                        <div className="text-xs text-[#2B4560]/80 flex flex-wrap items-center gap-2 pt-0.5">
                          <span>Owner: <strong className="text-gray-900">{project.ownerName}</strong></span>
                          <span>·</span>
                          <span>Contractor: <strong className="text-gray-900">{project.activeContractorName}</strong></span>
                          <span>·</span>
                          <span>Architect: <strong>{project.leadArchitectName}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-2 self-start lg:self-center shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setComplianceModalProject(project)}
                        className="px-3 py-2 bg-[#F4F1EA] hover:bg-gray-200 text-[#0B1B2B] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="View dynamic statutory compliance requirements"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#1E9E6A]" />
                        <span>Compliance Checklist</span>
                      </button>

                      <Link
                        to={`/app/projects/${project.id}`}
                        className="px-4 py-2 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Compact Budget Guard Alert Banner */}
                  <BudgetGuardAlert project={project} currency={currency} compact={true} />

                  {/* Phase Progress Stepper & Financial Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-1">
                    
                    {/* Left: Phase Stepper & Overall Progress (Col-span-7) */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#0B1B2B]">Current Active Phase:</span>
                          <span className="font-mono text-[#1F6FEB] font-bold">{project.stage}</span>
                        </div>
                        <span className="font-mono font-bold text-sm text-[#0B1B2B]">
                          {project.overallProgressPct}% Complete
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-[#2B4560]/10 relative">
                        <div 
                          className="h-full bg-gradient-to-r from-[#1F6FEB] to-[#1E9E6A] rounded-full transition-all duration-500"
                          style={{ width: `${project.overallProgressPct}%` }}
                        />
                      </div>

                      {/* Phase Stepper Pills */}
                      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
                        {[
                          { name: '1. Brief/Zoning', done: project.overallProgressPct >= 10 },
                          { name: '2. Substructure', done: project.overallProgressPct >= 30 },
                          { name: '3. Framing', done: project.overallProgressPct >= 50 },
                          { name: '4. MEP/Finishes', done: project.overallProgressPct >= 75 },
                          { name: '5. Handover', done: project.overallProgressPct >= 100 }
                        ].map((step, idx) => (
                          <div 
                            key={idx}
                            className={`p-1.5 rounded-md border text-center ${
                              step.done 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold' 
                                : 'bg-[#F4F1EA]/50 text-gray-500 border-gray-200'
                            }`}
                          >
                            <span className="truncate block">{step.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Escrow & Financial Guard (Col-span-5) */}
                    <div className="lg:col-span-5 bg-[#F4F1EA]/60 p-4 rounded-xl border border-[#2B4560]/10 grid grid-cols-2 gap-3 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-[#2B4560]/70 font-sans block">Budget Baseline</span>
                        <span className="font-bold text-sm text-[#0B1B2B]">
                          {api.formatMoney(project.budgetBaselineMinor, currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#2B4560]/70 font-sans block">Contingency Fund (10%)</span>
                        <span className="font-bold text-sm text-[#2B4560]">
                          {api.formatMoney(project.contingencyMinor, currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#1F6FEB] font-sans block font-semibold">Locked in Escrow</span>
                        <span className="font-bold text-sm text-[#1F6FEB]">
                          {api.formatMoney(project.escrowHeldMinor, currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#1E9E6A] font-sans block font-semibold">Released against Proof</span>
                        <span className="font-bold text-sm text-[#1E9E6A]">
                          {api.formatMoney(project.escrowReleasedMinor, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Milestone Status Section */}
                  <div className="pt-2 border-t border-[#2B4560]/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B4560]/70">
                          Milestone Escrow State Machine ({releasedCount}/{totalMilestonesCount} Released)
                        </span>
                        <span className="text-xs text-[#2B4560]/60">·</span>
                        <span className="text-xs text-emerald-800 font-medium">
                          Compliance: {project.complianceScorePct}%
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedMilestoneProject(isExpandedMilestones ? null : project.id)}
                        className="text-xs font-semibold text-[#1F6FEB] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpandedMilestones ? 'Collapse Milestones' : 'View All Milestones'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpandedMilestones ? 'rotate-90' : ''}`} />
                      </button>
                    </div>

                    {/* Milestone Cards / Carousel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(isExpandedMilestones ? project.milestones : project.milestones.slice(0, 3)).map((ms) => (
                        <div 
                          key={ms.id}
                          className="p-3.5 rounded-xl border border-[#2B4560]/15 bg-[#F4F1EA]/30 hover:bg-[#F4F1EA]/60 transition-colors space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[#0B1B2B] line-clamp-1" title={ms.title}>
                              {ms.title}
                            </span>
                            {getMilestoneStateBadge(ms.state)}
                          </div>

                          <p className="text-[11px] text-[#2B4560]/80 line-clamp-2">
                            {ms.description}
                          </p>

                          <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                            <span className="font-bold text-[#0B1B2B]">
                              {api.formatMoney(ms.amountMinor, currency)}
                            </span>
                            <span className="text-gray-500 text-[10px]">
                              Due: {ms.dueDate}
                            </span>
                          </div>

                          {ms.evidenceRequired && ms.evidenceRequired.length > 0 && (
                            <div className="pt-1 text-[10px] text-[#2B4560]/70 truncate">
                              Proof: {ms.evidenceRequired.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Dynamic Compliance Checklist Modal */}
      {complianceModalProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setComplianceModalProject(null)}
        >
          <div 
            className="bg-[#F4F1EA] rounded-2xl shadow-2xl border border-[#2B4560]/20 max-w-5xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-left relative my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#2B4560]/15 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase">
                  PROJECT COMPLIANCE INSPECTOR · {complianceModalProject.id.toUpperCase()}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0B1B2B] mt-0.5">
                  {complianceModalProject.title}
                </h3>
                <p className="text-xs text-[#2B4560]/80 mt-1">
                  Location: {complianceModalProject.ward}, {complianceModalProject.county} County · Registered Contractor: {complianceModalProject.activeContractorName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setComplianceModalProject(null)}
                className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-black/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Dynamic Compliance Checklist */}
            <ComplianceChecklist 
              project={complianceModalProject}
              onProjectUpdated={loadProjects}
            />

            <div className="pt-3 border-t border-[#2B4560]/15 flex justify-end">
              <button
                type="button"
                onClick={() => setComplianceModalProject(null)}
                className="px-4 py-2 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
