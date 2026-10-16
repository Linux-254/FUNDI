import React, { useState } from 'react';
import { BlueprintLayer } from '../../types';
import { api } from '../../lib/api';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Users, 
  DollarSign, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface ProjectBlueprintProps {
  layers: BlueprintLayer[];
  currency: 'KES' | 'USD';
}

export const ProjectBlueprint: React.FC<ProjectBlueprintProps> = ({ layers, currency }) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>(layers[1]?.id || layers[0]?.id);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const selectedLayer = layers.find(l => l.id === selectedLayerId) || layers[0];

  // Helper colors for risk
  const getRiskColor = (risk: BlueprintLayer['riskLevel'], progress: number) => {
    if (showHeatmap) {
      if (risk === 'critical') return 'bg-rose-500/80 border-rose-600 text-white';
      if (risk === 'watch') return 'bg-amber-500/80 border-amber-600 text-white';
      return 'bg-emerald-500/80 border-emerald-600 text-white';
    }
    // Default blueprint styling
    if (progress === 100) return 'bg-[#1E9E6A]/20 border-[#1E9E6A] text-[#0B1B2B]';
    if (progress > 0) return 'bg-[#1F6FEB]/20 border-[#1F6FEB] text-[#0B1B2B]';
    return 'bg-[#2B4560]/10 border-[#2B4560]/30 text-[#2B4560]';
  };

  return (
    <div className="bg-[#0B1B2B] text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-[#2B4560]/40 overflow-hidden relative">
      {/* Background Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#1F6FEB 1px, transparent 1px), linear-gradient(90deg, #1F6FEB 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header & Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2B4560]/50 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C8A24A]">
              ARCHITECTURAL SECTION ELEVATION
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1F6FEB]/20 text-[#1F6FEB] font-mono">
              BIM Level 2 LOD 300
            </span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold mt-1 text-white">
            Project Blueprint & Structural Cross-Section
          </h3>
          <p className="text-xs text-[#D9DEE3]/70">
            Click any building layer to inspect milestone completion, budget burn, assigned trades, and statutory blockers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
              showHeatmap
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs'
                : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/15'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A24A]" />
            <span>{showHeatmap ? 'Risk Heatmap Active' : 'Toggle Risk Heatmap'}</span>
          </button>
        </div>
      </div>

      {/* Visual Blueprint Section & Detail Inspector */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Left Column: Interactive Cross-Section Elevation (7 Layers) */}
        <div className="lg:col-span-7 bg-[#07131F]/90 rounded-xl p-4 sm:p-5 border border-[#2B4560]/60 relative">
          
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#D9DEE3]/60">
            <span>ROOF LEVEL +7.20m</span>
            <span>STRUCTURE AXIS A - D</span>
            <span>BEDROCK LEVEL -2.20m</span>
          </div>

          {/* Cross-section stacked layers (top to bottom) */}
          <div className="space-y-2">
            {/* Reverse layers for elevation: Roof at top, Foundation at bottom */}
            {[...layers].sort((a, b) => b.elevationLevel - a.elevationLevel).map((layer) => {
              const isSelected = selectedLayer.id === layer.id;
              const riskClass = getRiskColor(layer.riskLevel, layer.progressPct);

              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected 
                      ? 'ring-2 ring-[#C8A24A] shadow-md scale-[1.01]' 
                      : 'hover:border-white/40'
                  } ${riskClass}`}
                >
                  {/* Progress bar background fill */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-white/10 pointer-events-none transition-all duration-500"
                    style={{ width: `${layer.progressPct}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-[#C8A24A] text-[#0B1B2B]' : 'bg-black/30 text-white'
                      }`}>
                        {layer.elevationLevel}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs truncate group-hover:text-white transition-colors">
                          {layer.layerName}
                        </div>
                        <div className="text-[10px] text-white/70 truncate flex items-center gap-2">
                          <span>{layer.assignedEntityName}</span>
                          <span>·</span>
                          <span className="font-mono">{api.formatMoney(layer.budgetAllocatedMinor, currency)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Escrow badge */}
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        layer.escrowStatus === 'Released' 
                          ? 'bg-emerald-400/20 text-emerald-300'
                          : layer.escrowStatus === 'Funded'
                          ? 'bg-[#C8A24A]/20 text-[#C8A24A]'
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {layer.escrowStatus}
                      </span>

                      {/* Progress percentage */}
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold">
                          {layer.progressPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#2B4560]/40 flex items-center justify-between text-[11px] text-[#D9DEE3]/70 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Complete / Released
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1F6FEB]" /> In Progress / Escrow Funded
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/20" /> Scheduled
            </span>
          </div>
        </div>

        {/* Right Column: Layer Inspection Drawer */}
        <div className="lg:col-span-5 bg-white text-[#0B1B2B] rounded-xl p-5 shadow-md border border-[#2B4560]/20 space-y-4">
          <div className="flex items-start justify-between gap-2 border-b border-black/10 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1F6FEB]">
                Layer Level {selectedLayer.elevationLevel} Inspection
              </span>
              <h4 className="font-display font-bold text-base text-[#0B1B2B]">
                {selectedLayer.layerName}
              </h4>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold uppercase ${
              selectedLayer.riskLevel === 'critical'
                ? 'bg-rose-100 text-rose-800'
                : selectedLayer.riskLevel === 'watch'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {selectedLayer.riskLevel} Risk
            </span>
          </div>

          {/* Details narrative */}
          <p className="text-xs text-[#2B4560] leading-relaxed">
            {selectedLayer.details}
          </p>

          {/* Progress & Escrow Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#F4F1EA] rounded-lg border border-[#2B4560]/10">
              <span className="text-[10px] text-[#2B4560]/70 font-medium uppercase block">Allocated Budget</span>
              <span className="text-sm font-mono font-bold text-[#0B1B2B]">
                {api.formatMoney(selectedLayer.budgetAllocatedMinor, currency)}
              </span>
            </div>
            <div className="p-3 bg-[#F4F1EA] rounded-lg border border-[#2B4560]/10">
              <span className="text-[10px] text-[#2B4560]/70 font-medium uppercase block">Certified Spend</span>
              <span className="text-sm font-mono font-bold text-[#1F6FEB]">
                {api.formatMoney(selectedLayer.budgetSpentMinor, currency)}
              </span>
            </div>
          </div>

          {/* Assigned Contractor / Trades */}
          <div className="p-3 rounded-lg border border-[#2B4560]/15 bg-[#F4F1EA]/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0B1B2B] mb-1">
              <Users className="w-3.5 h-3.5 text-[#1F6FEB]" />
              <span>Assigned Trades & Responsible Team</span>
            </div>
            <p className="text-xs text-[#2B4560] font-medium">
              {selectedLayer.assignedEntityName} ({selectedLayer.assignedRole})
            </p>
          </div>

          {/* Compliance & Blockers */}
          <div className="p-3 rounded-lg border border-[#2B4560]/15 bg-[#F4F1EA]/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-[#0B1B2B] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#C8A24A]" />
                <span>Statutory Blockers</span>
              </span>
              <span className="font-mono text-xs font-bold text-[#0B1B2B]">
                {selectedLayer.complianceBlockersCount === 0 ? 'Clear (0)' : `${selectedLayer.complianceBlockersCount} Required`}
              </span>
            </div>
            <p className="text-[11px] text-[#2B4560]/80">
              {selectedLayer.complianceBlockersCount === 0
                ? 'All mandatory permits, engineer pre-pour inspections, and lab tests certified.'
                : 'Requires engineer review of shop drawings before milestone payment release.'}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="pt-2">
            <button 
              className="w-full py-2 px-3 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-[#C8A24A]" />
              <span>View Milestone Evidence & Inspection Log</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
