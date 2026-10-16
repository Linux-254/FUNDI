import React, { useState } from 'react';
import { BuildingType, FinishLevel } from '../../types';
import { api } from '../../lib/api';
import { Calculator, ArrowRight, Info, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InstantEstimatorProps {
  currency: 'KES' | 'USD';
  onStartProjectWithEstimate?: (estimateData: any) => void;
}

export const InstantEstimator: React.FC<InstantEstimatorProps> = ({ currency }) => {
  const [buildingType, setBuildingType] = useState<BuildingType>('Mansion or villa');
  const [sizeSqm, setSizeSqm] = useState<number>(320);
  const [finishLevel, setFinishLevel] = useState<FinishLevel>('luxury');
  const [county, setCounty] = useState<string>('Nairobi');

  // Baseline rates per sqm in KES (minor units: 1 KES = 100 minor units)
  const baseRatesPerSqm: Record<BuildingType, number> = {
    'Bungalow': 48000,
    'Maisonette': 58000,
    'Mansion or villa': 75000,
    'Townhouse': 62000,
    'Apartment block': 54000,
    'Rental units or bedsitters': 38000,
    'Office': 68000,
    'Retail shop or mall': 64000,
    'Hotel or lodge': 82000,
    'Warehouse': 32000,
    'School': 42000,
    'Clinic or hospital': 78000,
    'Boundary wall and fencing': 22000
  };

  const finishMultipliers: Record<FinishLevel, number> = {
    basic: 0.85,
    standard: 1.0,
    premium: 1.25,
    luxury: 1.55
  };

  const countyMultipliers: Record<string, number> = {
    'Nairobi': 1.05,
    'Kiambu': 1.0,
    'Machakos': 0.98,
    'Kajiado': 1.02,
    'Nakuru': 0.96,
    'Mombasa': 1.08,
    'Kisumu': 1.02
  };

  const baseRate = baseRatesPerSqm[buildingType] || 55000;
  const finishFactor = finishMultipliers[finishLevel];
  const countyFactor = countyMultipliers[county] || 1.0;

  const costPerSqmKes = Math.round(baseRate * finishFactor * countyFactor);
  const likelyCostKes = costPerSqmKes * sizeSqm;
  const lowCostKes = Math.round(likelyCostKes * 0.92);
  const highCostKes = Math.round(likelyCostKes * 1.12);

  // Convert to minor units (x100)
  const likelyMinor = likelyCostKes * 100;
  const lowMinor = lowCostKes * 100;
  const highMinor = highCostKes * 100;

  // Breakdown percentages by trade
  const breakdown = [
    { trade: 'Substructure & Earthworks', pct: 18, color: 'bg-[#1F6FEB]' },
    { trade: 'Superstructure (Frame & Slabs)', pct: 28, color: 'bg-[#0B1B2B]' },
    { trade: 'Roofing & Waterproofing', pct: 14, color: 'bg-[#FF6B2C]' },
    { trade: 'MEP (Plumbing, Solar, Power)', pct: 12, color: 'bg-[#1E9E6A]' },
    { trade: 'Finishes, Joinery & Glazing', pct: 16, color: 'bg-[#C8A24A]' },
    { trade: 'Prelims, Approvals & Pro Fees', pct: 12, color: 'bg-[#2B4560]' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#2B4560]/15 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B4560]/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1F6FEB]">
              KENYA CONSTRUCTION RATE-CARD MODEL
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1F6FEB]/10 text-[#1F6FEB] font-mono">
              Q4 2026 IQSK/BORAQS Benchmarks
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B1B2B] mt-1">
            Instant Building Cost Estimator
          </h3>
          <p className="text-xs text-[#2B4560]/70 mt-0.5">
            Get an indicative budget range and trade cost breakdown in 3 taps.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#2B4560]/80 bg-[#F4F1EA] px-3 py-1.5 rounded-lg shrink-0">
          <Info className="w-4 h-4 text-[#C8A24A]" />
          <span>Indicative guidance, not a quotation</span>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {/* Building Type */}
        <div>
          <label className="block text-xs font-semibold text-[#0B1B2B] mb-1.5">
            Building Type
          </label>
          <select
            value={buildingType}
            onChange={(e) => setBuildingType(e.target.value as BuildingType)}
            className="w-full text-xs p-2.5 rounded-lg border border-[#2B4560]/20 bg-white text-[#0B1B2B] focus:outline-[#1F6FEB] transition-colors"
          >
            <option value="Mansion or villa">Mansion or Villa</option>
            <option value="Maisonette">Maisonette (2-storey)</option>
            <option value="Bungalow">Bungalow (Single-storey)</option>
            <option value="Townhouse">Townhouse Gated Unit</option>
            <option value="Apartment block">Apartment Block (Multi-unit)</option>
            <option value="Rental units or bedsitters">Rental Bedsitters / Flats</option>
            <option value="Commercial">Commercial / Retail Office</option>
          </select>
        </div>

        {/* Built-up Square Metres Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#0B1B2B]">
              Built-up Size
            </label>
            <span className="text-xs font-mono font-bold text-[#1F6FEB]">
              {sizeSqm} m² ({Math.round(sizeSqm * 10.764)} sqft)
            </span>
          </div>
          <input
            type="range"
            min="80"
            max="1200"
            step="10"
            value={sizeSqm}
            onChange={(e) => setSizeSqm(Number(e.target.value))}
            className="w-full accent-[#1F6FEB] cursor-pointer"
          />
        </div>

        {/* Finish Level */}
        <div>
          <label className="block text-xs font-semibold text-[#0B1B2B] mb-1.5">
            Finish Specification
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['standard', 'premium', 'luxury'] as FinishLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFinishLevel(level)}
                className={`py-2 px-1 text-xs capitalize font-medium rounded border transition-all text-center cursor-pointer ${
                  finishLevel === level
                    ? 'border-[#0B1B2B] bg-[#0B1B2B] text-white font-bold shadow-2xs'
                    : 'border-[#2B4560]/20 bg-[#F4F1EA] text-[#0B1B2B] hover:bg-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Location County */}
        <div>
          <label className="block text-xs font-semibold text-[#0B1B2B] mb-1.5">
            Site County (Logistics Factor)
          </label>
          <select
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-[#2B4560]/20 bg-white text-[#0B1B2B] focus:outline-[#1F6FEB]"
          >
            <option value="Nairobi">Nairobi County (Base 1.05)</option>
            <option value="Kiambu">Kiambu County (Base 1.00)</option>
            <option value="Machakos">Machakos County (Base 0.98)</option>
            <option value="Kajiado">Kajiado (Kitengela/Ngong 1.02)</option>
            <option value="Nakuru">Nakuru County (Base 0.96)</option>
            <option value="Mombasa">Mombasa / Coastal (Base 1.08)</option>
          </select>
        </div>
      </div>

      {/* Output Results Card */}
      <div className="mt-6 p-5 sm:p-6 bg-[#0B1B2B] text-white rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Cost Estimates */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-[11px] font-mono text-[#C8A24A] font-semibold uppercase tracking-wider block">
              ESTIMATED PROJECT COST RANGE
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-3xl sm:text-4xl text-white">
                {api.formatMoney(likelyMinor, currency)}
              </span>
              <span className="text-xs text-[#D9DEE3]/60 font-mono">Likely</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#D9DEE3]/80 pt-1">
              <span>Low: {api.formatMoney(lowMinor, currency)}</span>
              <span>·</span>
              <span>High: {api.formatMoney(highMinor, currency)}</span>
            </div>

            <div className="text-[11px] text-[#D9DEE3]/70 font-mono">
              Indicative Rate: {api.formatMoney(costPerSqmKes * 100, currency)} per m²
            </div>
          </div>

          {/* Trade Cost Breakdown Bars */}
          <div className="md:col-span-7 space-y-2 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <span className="text-xs font-semibold text-white/90 block mb-2">
              Cost Allocation by Construction Trade
            </span>

            {/* Stacked Bar Visual */}
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-white/10">
              {breakdown.map((b) => (
                <div
                  key={b.trade}
                  style={{ width: `${b.pct}%` }}
                  className={`${b.color} h-full transition-all`}
                  title={`${b.trade}: ${b.pct}%`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
              {breakdown.map((b) => (
                <div key={b.trade} className="flex items-center gap-1.5 text-white/80">
                  <span className={`w-2 h-2 rounded-full ${b.color} shrink-0`} />
                  <span className="truncate">{b.trade}</span>
                  <span className="font-mono text-[10px] text-white/50 shrink-0">{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action Link to Smart Brief */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[#D9DEE3]/70">
            Ready to generate a full Bill of Quantities (BoQ) and draft milestone schedule?
          </p>
          <Link
            to="/app/projects/new"
            className="px-4 py-2 bg-[#1F6FEB] hover:bg-[#1F6FEB]/90 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Generate Full Project Brief & BoQ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
