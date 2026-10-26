import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign,
  Building2,
  PieChart
} from 'lucide-react';
import { Project, Currency } from '../../types';
import { api } from '../../lib/api';

interface ProjectStatsProps {
  projects: Project[];
  currency?: Currency;
  className?: string;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({
  projects,
  currency = 'KES',
  className = ''
}) => {
  const totalProjects = projects.length;

  // 1. Active Projects: Projects currently in execution phase
  const activeProjects = projects.filter(p => 
    p.stage !== 'Handover & Occupancy' && 
    p.stage !== 'Completed' && 
    p.overallProgressPct < 100
  );

  // 2. Completed Projects: Projects with 100% progress or in Handover
  const completedProjects = projects.filter(p => 
    p.stage === 'Handover & Occupancy' || 
    p.stage === 'Completed' || 
    p.overallProgressPct >= 100
  );

  // 3. Delayed Projects: Projects with low progress or overdue/unreleased milestone roadblocks
  const delayedProjects = projects.filter(p => {
    const hasPendingBlocking = p.complianceItems?.some(c => c.blocking && c.status !== 'Verified');
    const hasCriticalRisk = p.blueprintLayers?.some(l => l.riskLevel === 'critical');
    const isProgressSlow = p.overallProgressPct < 40 && p.milestones.some(m => m.state === 'Disputed' || m.state === 'UnderReview');
    return hasPendingBlocking || hasCriticalRisk || isProgressSlow;
  });

  // 4. Budget-at-Risk Projects: Projects with low compliance score or high variance / critical risk layers
  const budgetAtRiskProjects = projects.filter(p => {
    const lowCompliance = p.complianceScorePct < 75;
    const hasBudgetBurnAlert = p.budgetCategories?.some(b => b.paidMinor > b.allocatedMinor || b.committedMinor > b.allocatedMinor);
    const hasUnfundedEscrow = p.escrowHeldMinor < (p.budgetBaselineMinor * 0.2);
    return lowCompliance || hasBudgetBurnAlert || hasUnfundedEscrow;
  });

  // Calculate percentage ratios
  const activePct = totalProjects ? Math.round((activeProjects.length / totalProjects) * 100) : 0;
  const completedPct = totalProjects ? Math.round((completedProjects.length / totalProjects) * 100) : 0;
  const delayedPct = totalProjects ? Math.round((delayedProjects.length / totalProjects) * 100) : 0;
  const budgetRiskPct = totalProjects ? Math.round((budgetAtRiskProjects.length / totalProjects) * 100) : 0;

  // Financial aggregates
  const totalBaselineMinor = projects.reduce((sum, p) => sum + p.budgetBaselineMinor, 0);
  const totalEscrowHeldMinor = projects.reduce((sum, p) => sum + p.escrowHeldMinor, 0);
  const totalEscrowReleasedMinor = projects.reduce((sum, p) => sum + p.escrowReleasedMinor, 0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Title & Subheading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#1F6FEB] uppercase tracking-wider block">
            PORTFOLIO EXECUTIVE SUMMARY METRICS
          </span>
          <h3 className="font-display font-bold text-lg text-[#0B1B2B]">
            Project Status &amp; Risk Distribution
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#2B4560]/70 bg-white/80 px-3 py-1.5 rounded-lg border border-[#2B4560]/15">
          <PieChart className="w-3.5 h-3.5 text-[#1F6FEB]" />
          <span>{totalProjects} Total Construction Projects Monitored</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Projects */}
        <div className="bg-white rounded-2xl p-5 border border-[#2B4560]/15 shadow-2xs hover:border-[#1F6FEB]/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#2B4560]/70">
              Active Sites
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1F6FEB] flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-2xl text-[#0B1B2B]">
                {activeProjects.length}
              </span>
              <span className="text-xs font-mono font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {activePct}% of Portfolio
              </span>
            </div>
            <p className="text-[11px] text-[#2B4560]/70 mt-1">
              Projects currently in substructure, superstructure, or finishes phase.
            </p>
          </div>

          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1F6FEB] rounded-full transition-all duration-500"
              style={{ width: `${activePct}%` }}
            />
          </div>
        </div>

        {/* Card 2: Completed Projects */}
        <div className="bg-white rounded-2xl p-5 border border-[#2B4560]/15 shadow-2xs hover:border-emerald-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#2B4560]/70">
              Completed / Handover
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1E9E6A] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-2xl text-[#0B1B2B]">
                {completedProjects.length}
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                {completedPct}% Rate
              </span>
            </div>
            <p className="text-[11px] text-[#2B4560]/70 mt-1">
              Occupation certificate obtained or final milestone released.
            </p>
          </div>

          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1E9E6A] rounded-full transition-all duration-500"
              style={{ width: `${completedPct}%` }}
            />
          </div>
        </div>

        {/* Card 3: Delayed Projects */}
        <div className="bg-white rounded-2xl p-5 border border-[#2B4560]/15 shadow-2xs hover:border-amber-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#2B4560]/70">
              Schedule Delayed
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-2xl text-[#0B1B2B]">
                {delayedProjects.length}
              </span>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md border ${
                delayedProjects.length > 0 
                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {delayedPct}% Watchlist
              </span>
            </div>
            <p className="text-[11px] text-[#2B4560]/70 mt-1">
              Blocked by pending statutory clearances or milestone disputes.
            </p>
          </div>

          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${delayedPct}%` }}
            />
          </div>
        </div>

        {/* Card 4: Budget-at-Risk Projects */}
        <div className="bg-white rounded-2xl p-5 border border-[#2B4560]/15 shadow-2xs hover:border-rose-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#2B4560]/70">
              Budget At Risk
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-2xl text-[#0B1B2B]">
                {budgetAtRiskProjects.length}
              </span>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md border ${
                budgetAtRiskProjects.length > 0 
                  ? 'bg-rose-50 text-rose-800 border-rose-200' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {budgetRiskPct}% High Risk
              </span>
            </div>
            <p className="text-[11px] text-[#2B4560]/70 mt-1">
              Low compliance index (&lt;75%) or escrow funding deficit.
            </p>
          </div>

          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${budgetRiskPct}%` }}
            />
          </div>
        </div>

      </div>

      {/* Financial Health Summary Strip */}
      <div className="bg-[#0B1B2B] text-white rounded-xl p-4 border border-[#2B4560]/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C8A24A]/20 text-[#C8A24A] flex items-center justify-center font-bold shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#C8A24A] font-bold uppercase tracking-wider block">
              FUNDI ESCROW LIQUIDITY GUARANTEE
            </span>
            <span className="text-white font-semibold">
              Total Capital Vault: {api.formatMoney(totalBaselineMinor, currency)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1F6FEB]" />
            <span className="text-[#D9DEE3]">Locked in Escrow:</span>
            <span className="font-bold text-[#1F6FEB]">
              {api.formatMoney(totalEscrowHeldMinor, currency)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1E9E6A]" />
            <span className="text-[#D9DEE3]">Released against Proof:</span>
            <span className="font-bold text-[#1E9E6A]">
              {api.formatMoney(totalEscrowReleasedMinor, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
