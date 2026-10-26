import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  DollarSign, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Sliders,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';
import { Project, BudgetCategory } from '../../types';
import { api } from '../../lib/api';

export interface BudgetGuardAlertProps {
  project: Project;
  currency?: 'KES' | 'USD';
  warningThresholdPct?: number; // Defaults to 80%
  criticalThresholdPct?: number; // Defaults to 95%
  onMitigateAction?: (actionType: 'freeze_escrow' | 'draw_contingency' | 'audit_boq') => void;
  showCategoryBreakdown?: boolean;
  compact?: boolean;
}

export const BudgetGuardAlert: React.FC<BudgetGuardAlertProps> = ({
  project,
  currency = 'KES',
  warningThresholdPct = 80,
  criticalThresholdPct = 95,
  onMitigateAction,
  showCategoryBreakdown = true,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeMitigation, setActiveMitigation] = useState<string | null>(null);
  const [customThreshold, setCustomThreshold] = useState<number>(warningThresholdPct);
  const [isThresholdSettingOpen, setIsThresholdSettingOpen] = useState(false);

  // Compute key financial totals
  const totalAllocated = project.budgetCategories?.length 
    ? project.budgetCategories.reduce((sum, c) => sum + c.allocatedMinor, 0)
    : project.budgetBaselineMinor;

  const totalCommitted = project.budgetCategories?.length
    ? project.budgetCategories.reduce((sum, c) => sum + c.committedMinor, 0)
    : Math.round(project.budgetBaselineMinor * 0.72);

  const totalPaid = project.budgetCategories?.length
    ? project.budgetCategories.reduce((sum, c) => sum + c.paidMinor, 0)
    : project.escrowReleasedMinor;

  const totalForecast = project.budgetCategories?.length
    ? project.budgetCategories.reduce((sum, c) => sum + c.forecastMinor, 0)
    : project.budgetBaselineMinor + (project.variations?.reduce((s, v) => s + v.costDeltaMinor, 0) || 0);

  const contingency = project.contingencyMinor || Math.round(totalAllocated * 0.05);

  // Percentages relative to total BoQ baseline
  const committedPct = Math.round((totalCommitted / (totalAllocated || 1)) * 100);
  const paidPct = Math.round((totalPaid / (totalAllocated || 1)) * 100);
  const forecastPct = Math.round((totalForecast / (totalAllocated || 1)) * 100);

  // Variance calculation
  const overrunMinor = totalForecast - totalAllocated;
  const isOverrun = overrunMinor > 0;
  const isCriticalOverrun = forecastPct >= 100 || committedPct >= criticalThresholdPct;
  const isWarningOverrun = committedPct >= customThreshold || paidPct >= customThreshold;

  // Identify categories exceeding warning threshold or forecast
  const flaggedCategories = (project.budgetCategories || []).filter(cat => {
    const catCommittedPct = Math.round((cat.committedMinor / (cat.allocatedMinor || 1)) * 100);
    const catForecastOver = cat.forecastMinor > cat.allocatedMinor;
    return catCommittedPct >= customThreshold || catForecastOver;
  });

  const handleApplyMitigation = (action: 'freeze_escrow' | 'draw_contingency' | 'audit_boq') => {
    setActiveMitigation(action);
    if (onMitigateAction) {
      onMitigateAction(action);
    }
  };

  // If budget is nominal and compact is set, render a subtle indicator
  if (compact && !isWarningOverrun && !isCriticalOverrun) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#1E9E6A]/10 border border-[#1E9E6A]/30 text-xs text-[#0B1B2B]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1E9E6A]" />
          <span className="font-semibold">Budget Guard Active:</span>
          <span className="text-[#2B4560]/80">Spending is within safe limits ({committedPct}% committed).</span>
        </div>
        <span className="font-mono text-[11px] font-bold text-[#1E9E6A]">
          {api.formatMoney(totalAllocated - totalCommitted, currency)} Buffer Remaining
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
      isCriticalOverrun
        ? 'bg-gradient-to-br from-rose-50 via-white to-rose-50/60 border-rose-300'
        : isWarningOverrun
        ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/60 border-amber-300'
        : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 border-emerald-300'
    }`}>
      {/* Alert Header Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 shadow-xs ${
            isCriticalOverrun
              ? 'bg-rose-600 text-white animate-pulse'
              : isWarningOverrun
              ? 'bg-amber-500 text-white'
              : 'bg-[#1E9E6A] text-white'
          }`}>
            {isCriticalOverrun ? (
              <ShieldAlert className="w-6 h-6" />
            ) : isWarningOverrun ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isCriticalOverrun
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : isWarningOverrun
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {isCriticalOverrun
                  ? 'CRITICAL BUDGET OVERRUN ALERT'
                  : isWarningOverrun
                  ? `BUDGET CAUTION THRESHOLD (≥${customThreshold}%)`
                  : 'BUDGET GUARD NOMINAL'}
              </span>

              <button
                type="button"
                onClick={() => setIsThresholdSettingOpen(!isThresholdSettingOpen)}
                className="text-[11px] text-[#2B4560]/70 hover:text-[#1F6FEB] flex items-center gap-1 cursor-pointer font-mono"
                title="Adjust Warning Threshold"
              >
                <Sliders className="w-3 h-3 text-[#1F6FEB]" />
                <span>Threshold: {customThreshold}%</span>
              </button>
            </div>

            <h3 className="font-display font-bold text-base sm:text-lg text-[#0B1B2B] flex items-center gap-2">
              {isCriticalOverrun ? (
                <>Projected Overrun of {api.formatMoney(overrunMinor, currency)} Detected</>
              ) : isWarningOverrun ? (
                <>Budget Reaching {committedPct}% Committed Limit</>
              ) : (
                <>All Expense Centers Operating Within Baseline</>
              )}
            </h3>

            <p className="text-xs text-[#2B4560]/80 mt-0.5 max-w-2xl">
              {isCriticalOverrun ? (
                <>Total forecast ({api.formatMoney(totalForecast, currency)}) exceeds baseline contract limit ({api.formatMoney(totalAllocated, currency)}). Unapproved change orders or line-item inflation must be resolved.</>
              ) : isWarningOverrun ? (
                <>Committed subcontracts and purchase orders have reached {committedPct}% of the approved KES budget. Automated escrow guards are watching unreleased milestone funds.</>
              ) : (
                <>Escrow guard is monitoring baseline of {api.formatMoney(totalAllocated, currency)} with KES {api.formatMoney(contingency, currency)} contingency reserve intact.</>
              )}
            </p>
          </div>
        </div>

        {/* Financial KPI Summary Pills */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center font-mono">
          <div className="px-3 py-2 bg-white/80 rounded-xl border border-black/10 text-right shadow-2xs">
            <span className="text-[9px] text-[#2B4560]/60 uppercase font-sans font-bold block">Baseline</span>
            <span className="text-xs font-bold text-[#0B1B2B]">
              {api.formatMoney(totalAllocated, currency)}
            </span>
          </div>

          <div className="px-3 py-2 bg-white/80 rounded-xl border border-black/10 text-right shadow-2xs">
            <span className="text-[9px] text-[#2B4560]/60 uppercase font-sans font-bold block">Forecast</span>
            <span className={`text-xs font-bold ${isOverrun ? 'text-rose-600' : 'text-[#1F6FEB]'}`}>
              {api.formatMoney(totalForecast, currency)}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white hover:bg-black/5 border border-black/10 text-[#0B1B2B] cursor-pointer transition-colors"
            title={isExpanded ? 'Collapse Alert Details' : 'Expand Alert Details'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Threshold Setting Sub-Panel */}
      {isThresholdSettingOpen && (
        <div className="p-4 bg-white/90 border-b border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1F6FEB]" />
            <span className="font-semibold text-[#0B1B2B]">Configure Sensitivity Alert Threshold:</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {[75, 80, 85, 90, 95].map((pct) => (
              <button
                key={pct}
                onClick={() => setCustomThreshold(pct)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer ${
                  customThreshold === pct
                    ? 'bg-[#0B1B2B] text-white shadow-2xs'
                    : 'bg-[#F4F1EA] text-[#2B4560] hover:bg-black/10'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Breakdown & Mitigation Actions */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-5 bg-white/60">
          
          {/* Progress Bar with Multi-Level Ticks */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-semibold">
              <span className="text-[#0B1B2B] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#1F6FEB]" />
                <span>Spend vs Allocated Baseline:</span>
                <span className="text-[#1F6FEB] font-bold">{committedPct}% Committed</span>
              </span>
              <span className="text-[#2B4560]/80">
                Contingency Reserve: <strong className="text-[#1E9E6A]">{api.formatMoney(contingency, currency)}</strong>
              </span>
            </div>

            {/* Visual Gauge */}
            <div className="relative w-full h-4 bg-gray-200/80 rounded-full overflow-hidden p-0.5">
              {/* Threshold Ticks */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-20"
                style={{ left: `${customThreshold}%` }}
                title={`Warning Threshold (${customThreshold}%)`}
              />
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-rose-600 z-20"
                style={{ left: `${criticalThresholdPct}%` }}
                title={`Critical Threshold (${criticalThresholdPct}%)`}
              />

              {/* Stacked Progress Bar */}
              <div className="h-full flex rounded-full overflow-hidden">
                {/* Paid Portion */}
                <div 
                  style={{ width: `${Math.min(100, paidPct)}%` }} 
                  className="h-full bg-[#1E9E6A] transition-all duration-500"
                  title={`Certified Paid: ${paidPct}%`}
                />
                {/* Committed Unpaid Portion */}
                <div 
                  style={{ width: `${Math.min(100 - paidPct, Math.max(0, committedPct - paidPct))}%` }} 
                  className="h-full bg-[#1F6FEB] transition-all duration-500"
                  title={`Committed Subcontracts: ${committedPct - paidPct}%`}
                />
                {/* Overrun Portion if exceeds 100% */}
                {forecastPct > 100 && (
                  <div 
                    style={{ width: `${Math.min(30, forecastPct - 100)}%` }} 
                    className="h-full bg-rose-600 animate-pulse"
                    title={`Unfunded Variance: +${forecastPct - 100}%`}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#2B4560]/70 font-mono pt-0.5">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#1E9E6A] inline-block" /> Paid ({paidPct}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#1F6FEB] inline-block" /> Committed ({committedPct}%)
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-semibold">
                Warning Mark ({customThreshold}%)
              </span>
              <span className="flex items-center gap-1 text-rose-700 font-semibold">
                Critical Cap ({criticalThresholdPct}%)
              </span>
            </div>
          </div>

          {/* Line Item / Category Breakdown if Flagged */}
          {showCategoryBreakdown && flaggedCategories.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#0B1B2B]">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cost Centers Exceeding Baseline / Threshold ({flaggedCategories.length})</span>
                </span>
                <span className="text-[11px] font-mono font-normal text-[#2B4560]/70">
                  QS Audit Flagged
                </span>
              </div>

              <div className="divide-y divide-black/5 bg-white rounded-xl border border-black/10 overflow-hidden text-xs">
                {flaggedCategories.map((cat) => {
                  const catCommittedPct = Math.round((cat.committedMinor / (cat.allocatedMinor || 1)) * 100);
                  const catVariance = cat.forecastMinor - cat.allocatedMinor;

                  return (
                    <div key={cat.id} className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors">
                      <div>
                        <div className="font-semibold text-[#0B1B2B] flex items-center gap-2">
                          <span>{cat.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            catCommittedPct >= 95
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {catCommittedPct}% committed
                          </span>
                        </div>
                        <p className="text-[11px] text-[#2B4560]/70 font-mono mt-0.5">
                          Allocated: {api.formatMoney(cat.allocatedMinor, currency)} · Committed: {api.formatMoney(cat.committedMinor, currency)}
                        </p>
                      </div>

                      <div className="text-right font-mono shrink-0">
                        <span className="text-[10px] text-[#2B4560]/60 block font-sans">Forecast Overrun</span>
                        <span className={`font-bold text-xs ${catVariance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {catVariance > 0 ? `+${api.formatMoney(catVariance, currency)}` : 'On Target'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actionable Budget Mitigation Controls */}
          <div className="p-4 bg-white/90 rounded-xl border border-black/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B1B2B] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#1F6FEB]" />
                <span>Recommended Automated Budget Mitigation Protocols:</span>
              </span>
              {activeMitigation && (
                <span className="text-[11px] font-mono font-bold text-[#1E9E6A] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mitigation Triggered</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Freeze Unreleased Escrow */}
              <button
                type="button"
                onClick={() => handleApplyMitigation('freeze_escrow')}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                  activeMitigation === 'freeze_escrow'
                    ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-sm'
                    : 'bg-white hover:bg-rose-50/50 border-rose-200 text-[#0B1B2B]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-700 dark:text-rose-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>1. Freeze Escrow Releases</span>
                  </div>
                  <p className="text-[11px] opacity-80 leading-snug">
                    Temporarily hold future milestone disbursements until QS re-aligns BoQ limits.
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-semibold underline flex items-center gap-1">
                  <span>Enforce Hold</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* Option 2: Reallocate Contingency */}
              <button
                type="button"
                onClick={() => handleApplyMitigation('draw_contingency')}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                  activeMitigation === 'draw_contingency'
                    ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-sm'
                    : 'bg-white hover:bg-amber-50/50 border-amber-200 text-[#0B1B2B]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-800">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>2. Draw Contingency Buffer</span>
                  </div>
                  <p className="text-[11px] opacity-80 leading-snug">
                    Reallocate KES {api.formatMoney(contingency, currency)} from contingency reserve to balance variance.
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-semibold underline flex items-center gap-1">
                  <span>Transfer Buffer</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* Option 3: Mandatory QS BoQ Review */}
              <button
                type="button"
                onClick={() => handleApplyMitigation('audit_boq')}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                  activeMitigation === 'audit_boq'
                    ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-sm'
                    : 'bg-white hover:bg-blue-50/50 border-blue-200 text-[#0B1B2B]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-[#1F6FEB]">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>3. Request QS Audit</span>
                  </div>
                  <p className="text-[11px] opacity-80 leading-snug">
                    Issue formal notice to Quantity Surveyor (BORAQS) to review line-item rates on site.
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono font-semibold underline flex items-center gap-1">
                  <span>Order Audit</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
