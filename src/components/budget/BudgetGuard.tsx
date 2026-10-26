import React, { useState } from 'react';
import { Project, BudgetCategory, VariationOrder } from '../../types';
import { api } from '../../lib/api';
import { BudgetGuardAlert } from './BudgetGuardAlert';
import { 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  FileCheck, 
  DollarSign, 
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export { BudgetGuardAlert };

interface BudgetGuardProps {
  project: Project;
  currency: 'KES' | 'USD';
  onProjectUpdated: () => void;
}

export const BudgetGuard: React.FC<BudgetGuardProps> = ({
  project,
  currency,
  onProjectUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'variations' | 'whatif'>('categories');
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [newVoTitle, setNewVoTitle] = useState('');
  const [newVoReason, setNewVoReason] = useState('');
  const [newVoCostKes, setNewVoCostKes] = useState(250000);
  const [newVoDays, setNewVoDays] = useState(2);
  const [whatIfFinish, setWhatIfFinish] = useState<'standard' | 'premium' | 'luxury'>('luxury');
  const [whatIfSolar, setWhatIfSolar] = useState(true);

  // Compute total sums
  const totalAllocatedMinor = project.budgetCategories.reduce((sum, c) => sum + c.allocatedMinor, 0);
  const totalCommittedMinor = project.budgetCategories.reduce((sum, c) => sum + c.committedMinor, 0);
  const totalPaidMinor = project.budgetCategories.reduce((sum, c) => sum + c.paidMinor, 0);
  const totalForecastMinor = project.budgetCategories.reduce((sum, c) => sum + c.forecastMinor, 0);

  // Overrun variance
  const varianceMinor = totalForecastMinor - totalAllocatedMinor;
  const isOverrun = varianceMinor > 0;
  const spendPct = Math.round((totalPaidMinor / totalAllocatedMinor) * 100);

  const handleAddVariation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoTitle.trim()) return;

    try {
      await api.addVariation(project.id, {
        projectId: project.id,
        title: newVoTitle,
        reason: newVoReason,
        costDeltaMinor: newVoCostKes * 100,
        timeDeltaDays: Number(newVoDays),
        requestedBy: 'Contractor Site Rep & QS',
        scopeImpact: `Approved under contingency draw. Escrow top-up verified.`
      });
      setShowVariationModal(false);
      setNewVoTitle('');
      setNewVoReason('');
      onProjectUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Budget Alert Banner */}
      <BudgetGuardAlert project={project} currency={currency} />
      
      {/* Top Banner: Liquid-Fill Budget Gauge & Early Warning Center */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-[#2B4560]/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#2B4560]/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1F6FEB]">
                AI-BACKED CONSTRUCTION BUDGET GUARD
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                isOverrun ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isOverrun ? 'Contingency Warning (98%)' : 'Nominal Within Baseline'}
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B1B2B] mt-1">
              Contract Baseline: {api.formatMoney(totalAllocatedMinor, currency)}
            </h3>
            <p className="text-xs text-[#2B4560]/70 mt-0.5">
              Strict spend controls prevent unapproved changes. Real-time variance tracking alerts before line items overrun.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 shrink-0 text-center">
            <div className="p-3 bg-[#F4F1EA] rounded-xl border border-[#2B4560]/10">
              <span className="text-[10px] text-[#2B4560]/70 font-semibold uppercase block">Committed</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#0B1B2B]">
                {api.formatMoney(totalCommittedMinor, currency)}
              </span>
            </div>
            <div className="p-3 bg-[#F4F1EA] rounded-xl border border-[#2B4560]/10">
              <span className="text-[10px] text-[#2B4560]/70 font-semibold uppercase block">Certified Paid</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#1E9E6A]">
                {api.formatMoney(totalPaidMinor, currency)}
              </span>
            </div>
            <div className="p-3 bg-[#F4F1EA] rounded-xl border border-[#2B4560]/10">
              <span className="text-[10px] text-[#2B4560]/70 font-semibold uppercase block">Forecast Total</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#1F6FEB]">
                {api.formatMoney(totalForecastMinor, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Liquid-Fill Progress Gauge */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#0B1B2B]">
              Overall Spend Execution: <span className="font-mono text-[#1F6FEB]">{spendPct}% of Baseline</span>
            </span>
            <span className="font-mono text-[11px] text-[#2B4560]/70">
              Contingency Reserve: {api.formatMoney(project.contingencyMinor, currency)}
            </span>
          </div>

          <div className="w-full h-5 bg-[#0B1B2B]/10 rounded-full overflow-hidden p-0.5 flex relative">
            {/* 80% and 95% warning markers */}
            <div className="absolute left-[80%] top-0 bottom-0 w-0.5 bg-amber-500 z-10" title="80% Warning Mark" />
            <div className="absolute left-[95%] top-0 bottom-0 w-0.5 bg-rose-500 z-10" title="95% Critical Mark" />

            <div 
              style={{ width: `${Math.min(100, spendPct)}%` }}
              className="h-full bg-linear-to-r from-[#1F6FEB] via-[#1E9E6A] to-[#C8A24A] rounded-full transition-all duration-700 shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#2B4560]/60 font-mono pt-1">
            <span>0% Start</span>
            <span className="text-amber-600 font-semibold">80% Early Warning Threshold</span>
            <span className="text-rose-600 font-semibold">95% Hard Cap Lock</span>
            <span>100% Handover</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2B4560]/15 pb-2">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#0B1B2B] text-white shadow-xs'
              : 'text-[#2B4560] hover:bg-black/5'
          }`}
        >
          Bill of Quantities (BoQ) Categories
        </button>
        <button
          onClick={() => setActiveTab('variations')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'variations'
              ? 'bg-[#0B1B2B] text-white shadow-xs'
              : 'text-[#2B4560] hover:bg-black/5'
          }`}
        >
          <span>Formal Variations (VO)</span>
          <span className="text-[10px] px-1.5 rounded-full bg-[#C8A24A] text-[#0B1B2B] font-bold">
            {project.variations.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('whatif')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'whatif'
              ? 'bg-[#0B1B2B] text-white shadow-xs'
              : 'text-[#2B4560] hover:bg-black/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-[#C8A24A]" />
          <span>What-If Cost Simulator</span>
        </button>
      </div>

      {/* TAB 1: Categories Table */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-xl shadow-xs border border-[#2B4560]/15 overflow-hidden">
          <div className="p-4 bg-[#F4F1EA] border-b border-[#2B4560]/10 flex items-center justify-between">
            <span className="text-xs font-display font-bold text-[#0B1B2B]">
              Standardized BoQ Cost Centers
            </span>
            <span className="text-[11px] text-[#2B4560]/70 font-mono">
              Certified by QS Brian Mwangi (BORAQS #Q812)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#2B4560]/10 bg-white text-[#2B4560]/80 font-mono text-[11px]">
                  <th className="py-2.5 px-4 font-semibold">Category</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Allocated (BoQ)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Committed</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Certified Paid</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Forecast to Complete</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B4560]/10 font-mono">
                {project.budgetCategories.map((cat) => {
                  const variance = cat.forecastMinor - cat.allocatedMinor;
                  const isCatOver = variance > 0;
                  const committedPct = Math.round((cat.committedMinor / cat.allocatedMinor) * 100);

                  return (
                    <tr key={cat.id} className="hover:bg-[#F4F1EA]/50 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-[#0B1B2B]">
                        {cat.name}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#0B1B2B]">
                        {api.formatMoney(cat.allocatedMinor, currency)}
                      </td>
                      <td className="py-3 px-4 text-right text-[#2B4560]">
                        {api.formatMoney(cat.committedMinor, currency)}
                      </td>
                      <td className="py-3 px-4 text-right text-[#1E9E6A] font-semibold">
                        {api.formatMoney(cat.paidMinor, currency)}
                      </td>
                      <td className="py-3 px-4 text-right text-[#1F6FEB]">
                        {api.formatMoney(cat.forecastMinor, currency)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          committedPct >= 95
                            ? 'bg-rose-100 text-rose-800'
                            : committedPct >= 80
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {committedPct}% committed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Formal Variations (VO) */}
      {activeTab === 'variations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-bold text-sm text-[#0B1B2B]">
                Formal Variation Orders Log
              </h4>
              <p className="text-xs text-[#2B4560]/70">
                Any scope or specification modification requires an authorized change order and escrow adjustment.
              </p>
            </div>
            <button
              onClick={() => setShowVariationModal(true)}
              className="py-1.5 px-3 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#C8A24A]" />
              <span>Request Variation Order</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.variations.map((vo) => (
              <div key={vo.id} className="p-4 rounded-xl border border-[#2B4560]/15 bg-white shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#C8A24A]/20 text-[#0B1B2B] rounded font-bold">
                      {vo.orderNumber}
                    </span>
                    <h5 className="font-semibold text-xs text-[#0B1B2B] mt-1.5">
                      {vo.title}
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {vo.state}
                  </span>
                </div>

                <p className="text-xs text-[#2B4560] leading-relaxed">
                  {vo.reason}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-[#2B4560]/10">
                  <div>
                    <span className="text-[10px] text-[#2B4560]/60 block font-sans">Cost Impact</span>
                    <span className="font-bold text-[#0B1B2B]">
                      +{api.formatMoney(vo.costDeltaMinor, currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#2B4560]/60 block font-sans">Schedule Impact</span>
                    <span className="font-bold text-[#0B1B2B]">
                      {vo.timeDeltaDays === 0 ? '0 Days (On Schedule)' : `+${vo.timeDeltaDays} Days`}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#2B4560]/70 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#1E9E6A]" />
                  <span>{vo.scopeImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: What-If Cost Simulator */}
      {activeTab === 'whatif' && (
        <div className="bg-white rounded-xl p-5 border border-[#2B4560]/15 shadow-xs space-y-4">
          <div>
            <h4 className="font-display font-bold text-sm text-[#0B1B2B]">
              Interactive What-If Cost & Scope Simulator
            </h4>
            <p className="text-xs text-[#2B4560]/70">
              Simulate the financial impact of changing finishes, adding solar PV, or altering specification before signing change orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1B2B] mb-1.5">
                  Finish Specification Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'premium', 'luxury'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setWhatIfFinish(lvl)}
                      className={`py-2 text-xs capitalize font-medium rounded-lg border transition-all cursor-pointer ${
                        whatIfFinish === lvl
                          ? 'border-[#0B1B2B] bg-[#0B1B2B] text-white font-bold'
                          : 'border-[#2B4560]/20 bg-[#F4F1EA] text-[#0B1B2B]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F4F1EA] rounded-lg border border-[#2B4560]/10">
                <div>
                  <span className="text-xs font-semibold text-[#0B1B2B] block">Rooftop Solar PV & Solar Hot Water</span>
                  <span className="text-[11px] text-[#2B4560]/70">8kW Hybrid Inverter + Lithium Battery</span>
                </div>
                <input
                  type="checkbox"
                  checked={whatIfSolar}
                  onChange={(e) => setWhatIfSolar(e.target.checked)}
                  className="w-4 h-4 accent-[#1F6FEB] cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 bg-[#0B1B2B] text-white rounded-xl space-y-3">
              <span className="text-[10px] font-mono text-[#C8A24A] font-bold uppercase tracking-wider block">
                SIMULATED REVISED BUDGET PROJECTION
              </span>
              <div className="font-display font-bold text-2xl text-white">
                {api.formatMoney(
                  project.budgetBaselineMinor + 
                  (whatIfFinish === 'luxury' ? 120000000 : whatIfFinish === 'premium' ? 50000000 : 0) +
                  (whatIfSolar ? 95000000 : 0),
                  currency
                )}
              </div>
              <p className="text-xs text-[#D9DEE3]/70">
                {whatIfSolar 
                  ? 'Includes KES 950,000 net-metering solar system with estimated KES 28,000/mo electricity bill savings.'
                  : 'Grid power only without solar backup.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Variation Order Request */}
      {showVariationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#2B4560]/20 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#1F6FEB]" />
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Submit Formal Variation Order
                </h3>
              </div>
              <button onClick={() => setShowVariationModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddVariation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1B2B] mb-1">
                  Variation Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upgrade to Decra charcoal roofing shingles..."
                  value={newVoTitle}
                  onChange={(e) => setNewVoTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#2B4560]/20 focus:outline-[#1F6FEB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1B2B] mb-1">
                  Engineering or Owner Justification
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Technical justification and material specifications..."
                  value={newVoReason}
                  onChange={(e) => setNewVoReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#2B4560]/20 focus:outline-[#1F6FEB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0B1B2B] mb-1">
                    Cost Delta (KES)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={newVoCostKes}
                    onChange={(e) => setNewVoCostKes(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-[#2B4560]/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0B1B2B] mb-1">
                    Time Impact (Days)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newVoDays}
                    onChange={(e) => setNewVoDays(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-[#2B4560]/20 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F4F1EA] rounded-lg text-[11px] text-[#2B4560]/80">
                Note: Upon approval, an escrow top-up request will be initiated prior to work commencement.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVariationModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-[#2B4560] border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#0B1B2B] hover:bg-[#1F6FEB] rounded-lg shadow-sm"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
