import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildingType, FinishLevel, WorksType } from '../types';
import { api } from '../lib/api';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  MapPin, 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

interface SmartBriefWizardPageProps {
  currency: 'KES' | 'USD';
}

export const SmartBriefWizardPage: React.FC<SmartBriefWizardPageProps> = ({ currency }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState('Runda Modern 4-Bed Residence');
  const [buildingType, setBuildingType] = useState<BuildingType>('Mansion or villa');
  const [worksType, setWorksType] = useState<WorksType>('New build');
  const [county, setCounty] = useState('Nairobi');
  const [ward, setWard] = useState('Runda');
  const [plotSize, setPlotSize] = useState('0.50 Acre');
  const [sizeSqm, setSizeSqm] = useState(340);
  const [floors, setFloors] = useState(2);
  const [finishLevel, setFinishLevel] = useState<FinishLevel>('luxury');
  const [targetBudgetKes, setTargetBudgetKes] = useState(24500000);
  const [submitting, setSubmitting] = useState(false);

  const handleCompleteWizard = async () => {
    setSubmitting(true);
    try {
      const newProj = await api.createProject({
        title,
        buildingType,
        worksType,
        county,
        ward,
        plotSize,
        sizeSqm,
        floors,
        finishLevel,
        budgetBaselineMinor: targetBudgetKes * 100
      });
      confetti({ particleCount: 60, spread: 60 });
      navigate(`/app/projects/${newProj.id}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6FEB]/10 text-[#1F6FEB] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A24A]" />
            <span>AI-GUIDED SMART BRIEF GENERATOR</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B2B]">
            Define Your Construction Project Brief
          </h1>
          <p className="text-xs sm:text-sm text-[#2B4560]/70 max-w-lg mx-auto">
            Input your site details and specifications to generate an architectural brief, statutory compliance checklist, and milestone plan.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {[
            { num: 1, label: 'Typology & Plot' },
            { num: 2, label: 'Specs & Finishes' },
            { num: 3, label: 'Draft BoQ & Save' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                step === s.num
                  ? 'bg-[#0B1B2B] text-white ring-2 ring-[#C8A24A]'
                  : step > s.num
                  ? 'bg-[#1E9E6A] text-white'
                  : 'bg-white border text-[#2B4560]'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[10px] font-semibold text-[#2B4560] mt-1">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-sm space-y-6">
          
          {/* STEP 1: Typology & Site */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-[#0B1B2B] border-b pb-2">
                1. Project Identity & Site Location
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                  Project Title / Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#2B4560]/20 focus:outline-[#1F6FEB]"
                  placeholder="e.g. Karen Villa Residence"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                    Building Typology
                  </label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value as BuildingType)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#2B4560]/20 focus:outline-[#1F6FEB]"
                  >
                    <option value="Mansion or villa">Mansion or Villa</option>
                    <option value="Maisonette">Maisonette</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Apartment block">Apartment Block</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                    Works Category
                  </label>
                  <select
                    value={worksType}
                    onChange={(e) => setWorksType(e.target.value as WorksType)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#2B4560]/20 focus:outline-[#1F6FEB]"
                  >
                    <option value="New build">New Build (Greenfield)</option>
                    <option value="Extension">Extension</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Interior fit-out">Interior Fit-out</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                    County
                  </label>
                  <input
                    type="text"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#2B4560]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                    Ward / Area
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#2B4560]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                    Plot Dimensions
                  </label>
                  <input
                    type="text"
                    value={plotSize}
                    onChange={(e) => setPlotSize(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#2B4560]/20"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2 px-5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Dimensions & Finish Level */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-[#0B1B2B] border-b pb-2">
                2. Sizing, Floors & Finish Quality
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                    Built-up Area: <span className="font-mono text-[#1F6FEB] font-bold">{sizeSqm} m²</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="10"
                    value={sizeSqm}
                    onChange={(e) => setSizeSqm(Number(e.target.value))}
                    className="w-full accent-[#1F6FEB] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#2B4560]/60 block mt-1 font-mono">
                    Approx {Math.round(sizeSqm * 10.764)} square feet
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                    Number of Storeys
                  </label>
                  <select
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#2B4560]/20"
                  >
                    <option value={1}>1 (Single Storey)</option>
                    <option value={2}>2 (Ground + First Floor)</option>
                    <option value={3}>3 (Ground + 2 Floors)</option>
                    <option value={4}>4 (4 Storeys)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1B2B] mb-1.5">
                  Specification & Finishes Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'premium', 'luxury'] as FinishLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFinishLevel(lvl)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        finishLevel === lvl
                          ? 'border-[#0B1B2B] bg-[#0B1B2B] text-white'
                          : 'border-[#2B4560]/20 bg-[#F4F1EA] text-[#0B1B2B]'
                      }`}
                    >
                      <span className="text-xs font-bold capitalize block">{lvl}</span>
                      <span className="text-[10px] opacity-75 block mt-0.5">
                        {lvl === 'luxury' ? 'Italian porcelain, Decra roof' : lvl === 'premium' ? 'Ceramic tiles, stone' : 'Standard local finish'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1B2B] mb-1">
                  Target Construction Budget (KES)
                </label>
                <input
                  type="number"
                  step="500000"
                  value={targetBudgetKes}
                  onChange={(e) => setTargetBudgetKes(Number(e.target.value))}
                  className="w-full text-sm font-mono p-2.5 rounded-lg border border-[#2B4560]/20 font-bold"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#2B4560] hover:underline"
                >
                  ← Back to Location
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-2 px-5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Review Draft Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Initialize */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-base text-[#0B1B2B] border-b pb-2">
                3. Generated Brief & Milestone Skeleton
              </h3>

              <div className="p-4 bg-[#F4F1EA] rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#2B4560]">Project:</span>
                  <strong className="text-[#0B1B2B]">{title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2B4560]">Location:</span>
                  <strong className="text-[#0B1B2B]">{ward}, {county} County</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2B4560]">Typology & Size:</span>
                  <strong className="text-[#0B1B2B]">{buildingType} · {sizeSqm} m² ({floors} Floors)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2B4560]">Finish Quality:</span>
                  <strong className="text-[#0B1B2B] capitalize">{finishLevel}</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#2B4560]/10 text-sm">
                  <span className="font-semibold text-[#0B1B2B]">Baseline Budget:</span>
                  <strong className="font-mono text-[#1F6FEB]">
                    {api.formatMoney(targetBudgetKes * 100, currency)}
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#1E9E6A]" />
                  <span>Automated Compliance Checklist Ready:</span>
                </span>
                <p className="text-[11px]">
                  Kenya Seed Pack (BORAQS drawings, NCA registration, 0.5% levy clearance, NEMA EIA licence, CAR insurance) will be initialized automatically in your workspace.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#2B4560] hover:underline"
                >
                  ← Back to Specs
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleCompleteWizard}
                  className="py-2.5 px-6 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-[#C8A24A]" />
                  <span>{submitting ? 'Generating Workspace...' : 'Launch Project Workspace'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
