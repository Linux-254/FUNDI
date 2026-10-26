import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  BarChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { Project, Milestone } from '../../types';
import { api } from '../../lib/api';
import { Activity, TrendingUp, AlertCircle, CheckCircle2, ShieldCheck, BarChart2, Layers } from 'lucide-react';

interface ProjectHealthChartProps {
  projects: Project[];
  selectedProjectId?: string | 'all';
  onSelectProject?: (id: string) => void;
  currency?: 'KES' | 'USD';
  className?: string;
}

export const ProjectHealthChart: React.FC<ProjectHealthChartProps> = ({
  projects,
  selectedProjectId = 'all',
  onSelectProject,
  currency = 'KES',
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'portfolio' | 'milestones'>('portfolio');
  const [activeProjectId, setActiveProjectId] = useState<string>(
    selectedProjectId !== 'all' ? selectedProjectId : projects[0]?.id || 'proj-karen-villa'
  );

  // 1. Prepare Portfolio Overview Data
  const portfolioChartData = projects.map((p) => {
    // Calculate planned target progress based on elapsed milestones or stage target
    const releasedMilestones = p.milestones.filter(m => m.state === 'Released').length;
    const totalMilestones = p.milestones.length || 1;
    const releasedPct = Math.round((releasedMilestones / totalMilestones) * 100);
    
    // Estimate planned target progress based on phase stage
    let plannedTargetPct = 50;
    if (p.id === 'proj-karen-villa') plannedTargetPct = 50;
    else if (p.id === 'proj-kilimani-apartments') plannedTargetPct = 25;
    else if (p.id === 'proj-naivasha-lodge') plannedTargetPct = 70;
    else plannedTargetPct = p.overallProgressPct + 5;

    const variancePct = p.overallProgressPct - plannedTargetPct;

    return {
      id: p.id,
      name: p.title.length > 22 ? `${p.title.substring(0, 20)}...` : p.title,
      fullTitle: p.title,
      county: p.county,
      actualProgress: p.overallProgressPct,
      plannedTarget: plannedTargetPct,
      releasedMilestonesPct: releasedPct,
      complianceScore: p.complianceScorePct,
      variancePct,
      status: variancePct >= -3 ? 'On Track' : variancePct >= -10 ? 'Slight Variance' : 'Attention Needed',
      budgetKes: p.budgetBaselineMinor / 100,
      escrowHeldKes: p.escrowHeldMinor / 100
    };
  });

  // 2. Prepare Single Project Milestone Breakdown Data
  const currentProject = projects.find(p => p.id === activeProjectId) || projects[0];
  
  const milestoneChartData = currentProject?.milestones.map((m, idx) => {
    const isReleased = m.state === 'Released';
    const isInProgress = m.state === 'InProgress';
    const isUnderReview = m.state === 'UnderReview' || m.state === 'EvidenceSubmitted';
    const isFunded = m.state === 'Funded';

    const actualCompletionVal = isReleased ? 100 : isInProgress ? 60 : isUnderReview ? 80 : isFunded ? 20 : 0;
    const targetVal = 100; // Planned target for each scheduled milestone

    return {
      id: m.id,
      shortTitle: `M${idx + 1}`,
      fullTitle: m.title,
      amountKes: m.amountMinor / 100,
      amountFormatted: api.formatMoney(m.amountMinor, currency),
      state: m.state,
      actualCompletionPct: actualCompletionVal,
      targetPct: targetVal,
      retentionPct: m.retentionPct,
      dueDate: m.dueDate
    };
  }) || [];

  // Custom Tooltip for Portfolio View
  const CustomPortfolioTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0B1B2B] text-white p-3.5 rounded-xl border border-[#2B4560]/40 shadow-xl text-xs space-y-1.5 font-mono max-w-xs">
          <span className="font-sans font-bold text-sm block text-[#C8A24A]">{data.fullTitle}</span>
          <div className="text-[11px] text-gray-300">County: {data.county}</div>
          <div className="border-t border-white/10 pt-1.5 space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-blue-300">Actual Progress:</span>
              <span className="font-bold text-white">{data.actualProgress}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-amber-300">Planned Target:</span>
              <span className="font-bold text-white">{data.plannedTarget}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-emerald-300">Compliance Score:</span>
              <span className="font-bold text-emerald-400">{data.complianceScore}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">Schedule Variance:</span>
              <span className={`font-bold ${data.variancePct >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {data.variancePct > 0 ? `+${data.variancePct}%` : `${data.variancePct}%`}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Milestone View
  const CustomMilestoneTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0B1B2B] text-white p-3.5 rounded-xl border border-[#2B4560]/40 shadow-xl text-xs space-y-1 font-mono max-w-xs">
          <span className="font-sans font-bold text-xs block text-[#C8A24A]">{data.fullTitle}</span>
          <div className="flex justify-between gap-4 text-[11px]">
            <span className="text-gray-300">Escrow Value:</span>
            <span className="font-bold text-white">{data.amountFormatted}</span>
          </div>
          <div className="flex justify-between gap-4 text-[11px]">
            <span className="text-gray-300">State:</span>
            <span className="font-bold text-emerald-400">{data.state}</span>
          </div>
          <div className="flex justify-between gap-4 text-[11px]">
            <span className="text-gray-300">Target Date:</span>
            <span className="text-gray-300">{data.dueDate}</span>
          </div>
          <div className="flex justify-between gap-4 text-[11px] pt-1 border-t border-white/10">
            <span className="text-blue-300">Verification Progress:</span>
            <span className="font-bold text-blue-300">{data.actualCompletionPct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-2xl p-6 sm:p-7 border border-[#2B4560]/15 shadow-xs space-y-6 ${className}`}>
      
      {/* Header & View Switcher Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B4560]/10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#1F6FEB]" />
            <h3 className="font-display font-bold text-base sm:text-lg text-[#0B1B2B]">
              Project Health Chart (Progress vs. Planned Milestones)
            </h3>
          </div>
          <p className="text-xs text-[#2B4560]/70 mt-0.5">
            Visual comparison of actual site phase progression against scheduled statutory milestone targets.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* View Mode Buttons */}
          <div className="flex bg-[#F4F1EA] p-1 rounded-xl border border-[#2B4560]/15 text-xs font-mono">
            <button
              onClick={() => setViewMode('portfolio')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'portfolio' 
                  ? 'bg-[#0B1B2B] text-white font-bold shadow-xs' 
                  : 'text-[#2B4560] hover:text-[#0B1B2B]'
              }`}
            >
              Portfolio Comparison
            </button>
            <button
              onClick={() => setViewMode('milestones')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'milestones' 
                  ? 'bg-[#0B1B2B] text-white font-bold shadow-xs' 
                  : 'text-[#2B4560] hover:text-[#0B1B2B]'
              }`}
            >
              Milestone Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* PORTFOLIO COMPARISON VIEW */}
      {viewMode === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#2B4560] font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#1F6FEB]" />
                <span>Actual Progress (%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#C8A24A]" />
                <span>Planned Target (%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#1E9E6A]" />
                <span>Compliance Score (%)</span>
              </span>
            </div>
            <span className="text-[11px] text-gray-500 hidden sm:inline">
              Hover bars for detailed milestone variance
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={portfolioChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#0B1B2B', fontFamily: 'monospace' }}
                  interval={0}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 11, fill: '#2B4560', fontFamily: 'monospace' }}
                  unit="%"
                />
                <Tooltip content={<CustomPortfolioTooltip />} />
                <Bar dataKey="actualProgress" name="Actual Progress (%)" fill="#1F6FEB" radius={[6, 6, 0, 0]} />
                <Bar dataKey="plannedTarget" name="Planned Target (%)" fill="#C8A24A" radius={[6, 6, 0, 0]} />
                <Bar dataKey="complianceScore" name="Compliance Score (%)" fill="#1E9E6A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Variance Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            {portfolioChartData.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProjectId(p.id);
                  setViewMode('milestones');
                }}
                className="p-3 bg-[#F4F1EA]/60 hover:bg-[#F4F1EA] rounded-xl border border-[#2B4560]/10 text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0B1B2B] truncate">{p.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    p.variancePct >= 0 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#2B4560]/80">
                  <span>Actual: <strong>{p.actualProgress}%</strong></span>
                  <span>Target: <strong>{p.plannedTarget}%</strong></span>
                  <span>Var: <strong className={p.variancePct >= 0 ? 'text-emerald-700' : 'text-amber-700'}>{p.variancePct}%</strong></span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SINGLE PROJECT MILESTONE BREAKDOWN VIEW */}
      {viewMode === 'milestones' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F4F1EA]/70 p-3 rounded-xl border border-[#2B4560]/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#2B4560]/70 font-semibold">Project Breakdown:</span>
              <select
                value={activeProjectId}
                onChange={(e) => setActiveProjectId(e.target.value)}
                className="p-1.5 bg-white border border-[#2B4560]/20 rounded-lg text-xs font-bold text-[#0B1B2B] focus:outline-hidden"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-[#2B4560]">
              <span>Stage: <strong className="text-[#1F6FEB]">{currentProject.stage}</strong></span>
              <span>·</span>
              <span>Overall: <strong className="text-[#0B1B2B]">{currentProject.overallProgressPct}%</strong></span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={milestoneChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="shortTitle" 
                  tick={{ fontSize: 11, fill: '#0B1B2B', fontFamily: 'monospace' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 11, fill: '#2B4560', fontFamily: 'monospace' }}
                  unit="%"
                />
                <Tooltip content={<CustomMilestoneTooltip />} />
                <Bar dataKey="actualCompletionPct" name="Verified Completion (%)" fill="#1F6FEB" radius={[6, 6, 0, 0]}>
                  {milestoneChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.state === 'Released' ? '#1E9E6A' : 
                        entry.state === 'InProgress' ? '#1F6FEB' : 
                        entry.state === 'UnderReview' ? '#8B5CF6' : '#C8A24A'
                      } 
                    />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="targetPct" name="Target Schedule (%)" stroke="#FF6B2C" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Milestone Cards Mini Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-mono">
            {milestoneChartData.map((m) => (
              <div 
                key={m.id} 
                className="p-2.5 bg-[#F4F1EA]/50 rounded-xl border border-[#2B4560]/10 text-center space-y-1"
              >
                <span className="font-bold text-[#0B1B2B] block">{m.shortTitle}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase block ${
                  m.state === 'Released' ? 'bg-emerald-100 text-emerald-800' :
                  m.state === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                  m.state === 'UnderReview' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {m.state}
                </span>
                <span className="text-[10px] text-gray-600 block">{m.amountFormatted}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
