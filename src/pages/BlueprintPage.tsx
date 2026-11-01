import React, { useState } from 'react';
import { RealisticArchitecturalViewer } from '../components/blueprint/RealisticArchitecturalViewer';
import { AIBlueprintRenderModal } from '../components/blueprint/AIBlueprintRenderModal';
import { 
  Building2, 
  Compass, 
  Layers, 
  Download, 
  FileText, 
  ShieldCheck, 
  Ruler, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Info,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlueprintPageProps {
  currency: 'KES' | 'USD';
}

export const BlueprintPage: React.FC<BlueprintPageProps> = ({ currency }) => {
  const [selectedProjectId, setSelectedProjectId] = useState('proj-karen');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const projects = [
    {
      id: 'proj-karen',
      title: 'Karen 4-Bed Residential Eco-Villa',
      location: 'Karen, Nairobi County (L.R. 11914/8)',
      type: 'Bespoke Residential Dwelling',
      engineer: 'Eng. Kelvin Ochieng, PE (EBK M.2891)',
      architect: 'Arch. David Mwangi (BORAQS A/1429)',
      ncaCategory: 'NCA 4 Building Works',
      totalArea: '480 m²',
      revisions: 'Rev C (Approved by Nairobi County)',
      boqTotal: 18450000
    },
    {
      id: 'proj-kilifi',
      title: 'Kilifi Coral-Stone Eco-Lodge',
      location: 'Bofa Beach, Kilifi County',
      type: 'Hospitality / Eco-Resort',
      engineer: 'Eng. Fatuma Salim (EBK M.3412)',
      architect: 'Arch. Peter Kamau (BORAQS A/1890)',
      ncaCategory: 'NCA 3 Building Works',
      totalArea: '620 m²',
      revisions: 'Rev B (NEMA & County Certified)',
      boqTotal: 24800000
    },
    {
      id: 'proj-westlands',
      title: 'Parklands Commercial Office Annex',
      location: 'Parklands Road, Westlands, Nairobi',
      type: 'Commercial Office Suite',
      engineer: 'Eng. Joshua Kiprono (EBK M.1990)',
      architect: 'Arch. Sharon Otieno (BORAQS A/1204)',
      ncaCategory: 'NCA 2 Commercial Works',
      totalArea: '1,250 m²',
      revisions: 'Rev D (Full Structural & MEP)',
      boqTotal: 49500000
    }
  ];

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#2B4560]/15">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase tracking-wider">
              BIM LEVEL 2 · KENYA NATIONAL BUILDING CODE 2024
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#C8A24A]/20 text-[#C8A24A] font-mono font-semibold">
              CAD & ESCROW SYNC
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#0B1B2B]">
            Architectural CAD Blueprint & BIM Engine
          </h1>
          <p className="text-sm text-[#2B4560]/80 mt-1 max-w-3xl">
            Explore authentic structural engineering plans, foundation layouts, beam rebar schedules, and MEP conduit pathways. Every physical element directly maps to an ironclad milestone in the FUNDI escrow vault.
          </p>
        </div>

        {/* Action Controls: AI Render Button & Project Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#0B1B2B] to-[#1F6FEB] hover:from-[#1F6FEB] hover:to-[#0B1B2B] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer ring-1 ring-[#C8A24A]/40"
            title="Generate AI-powered photorealistic renderings from current blueprint"
          >
            <Sparkles className="w-4 h-4 text-[#C8A24A]" />
            <span>AI Aesthetic Renders</span>
          </button>

          {/* Project Selector Switcher */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#2B4560]/20 shadow-xs">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedProjectId === proj.id
                    ? 'bg-[#0B1B2B] text-white font-semibold shadow-xs'
                    : 'text-[#2B4560] hover:text-[#0B1B2B] hover:bg-gray-100'
                }`}
              >
                {proj.title.split(' ')[0]} {proj.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Architectural Viewer Component */}
      <RealisticArchitecturalViewer 
        currency={currency} 
        onOpenAiRenderModal={() => setIsAiModalOpen(true)}
      />

      {/* AI Architectural Image Generation Modal */}
      <AIBlueprintRenderModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        projectTitle={currentProject.title}
        projectLocation={currentProject.location}
        currentFloorPlanLayer="Ground Floor Framing (RC Beams) & Plinth Layout"
      />

      {/* Project Meta Cards & Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[#2B4560]/15 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#1F6FEB]">
            <Building2 className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-[#0B1B2B]">
              Project Identification
            </h3>
          </div>
          <div className="text-xs space-y-1.5 font-mono text-[#2B4560]">
            <p><strong className="text-[#0B1B2B]">Title:</strong> {currentProject.title}</p>
            <p><strong className="text-[#0B1B2B]">Site Location:</strong> {currentProject.location}</p>
            <p><strong className="text-[#0B1B2B]">Gross Plinth Area:</strong> {currentProject.totalArea}</p>
            <p><strong className="text-[#0B1B2B]">NCA Class:</strong> {currentProject.ncaCategory}</p>
            <p><strong className="text-[#0B1B2B]">Drawing Revision:</strong> {currentProject.revisions}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#2B4560]/15 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#C8A24A]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-[#0B1B2B]">
              Registered Professionals
            </h3>
          </div>
          <div className="text-xs space-y-1.5 font-mono text-[#2B4560]">
            <p><strong className="text-[#0B1B2B]">Lead Architect:</strong> {currentProject.architect}</p>
            <p><strong className="text-[#0B1B2B]">Structural Engineer:</strong> {currentProject.engineer}</p>
            <p><strong className="text-[#0B1B2B]">Compliance Code:</strong> BS 8110-1:1997 / NBC 2024</p>
            <p><strong className="text-[#0B1B2B]">Concrete Spec:</strong> C25/20 with Sika additive</p>
            <p><strong className="text-[#0B1B2B]">Rebar Quality:</strong> 500 N/mm² High Yield (KEBS)</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#2B4560]/15 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#1E9E6A]">
            <FileText className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-[#0B1B2B]">
              Bill of Quantities Link
            </h3>
          </div>
          <p className="text-xs text-[#2B4560]/80">
            Structural quantities in this drawing are reconciled with the certified Bill of Quantities (BORAQS Standard).
          </p>
          <div className="bg-[#F4F1EA] p-2.5 rounded-xl flex items-center justify-between">
            <span className="text-xs font-mono text-[#2B4560]">Total Structural Cost:</span>
            <span className="text-xs font-mono font-bold text-[#0B1B2B]">
              {currency === 'KES' ? `KES ${currentProject.boqTotal.toLocaleString()}` : `$${Math.round(currentProject.boqTotal / 130).toLocaleString()}`}
            </span>
          </div>
          <Link
            to="/app/projects/proj-karen-villa"
            className="w-full py-2 px-3 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <span>Open in Active Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
