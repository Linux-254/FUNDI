import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Users, 
  Hammer, 
  Sparkles, 
  Coins, 
  Briefcase,
  Star,
  MapPin,
  FileCheck,
  Compass,
  Layers,
  Camera
} from 'lucide-react';
import { BrandLogo } from '../components/brand/BrandLogo';
import { ScrollBuiltBuilding } from '../components/building/ScrollBuiltBuilding';
import { InstantEstimator } from '../components/estimator/InstantEstimator';
import { SEED_MARKETPLACE_ENTITIES } from '../data/seedData';
import { UserRole } from '../types';

interface LandingPageProps {
  currency: 'KES' | 'USD';
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ currency, onSelectRole }) => {
  const navigate = useNavigate();

  const handleDoorClick = (role: UserRole, targetPath: string) => {
    onSelectRole(role);
    navigate(targetPath);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-16 pb-20">
      
      {/* 1. HERO SECTION: Brand Promise + Scroll-Built Elevation Drawing */}
      <section className="pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1B2B] tracking-tight text-balance leading-tight">
            Build with certainty.<br />
            <span className="text-[#1F6FEB]">From first beacon</span> to handover.
          </h1>

          <p className="text-base sm:text-lg text-[#2B4560] text-balance leading-relaxed">
            Unite diaspora & local owners, verified NCA contractors, registered architects, and skilled fundis on one transparent project. Money only moves when work is proven.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/app/projects/proj-karen-villa"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Interactive Villa Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#C8A24A]" />
            </Link>

            <Link
              to="/app/projects/new"
              className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#2B4560]/20 hover:bg-[#F4F1EA] text-[#0B1B2B] font-semibold text-sm rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2"
            >
              <span>Start Smart Brief Wizard</span>
            </Link>
          </div>
        </div>

        {/* Scroll-Built Building Interactive Elevation Component */}
        <ScrollBuiltBuilding />
      </section>

      {/* 2. THE FOUR DOORS ONBOARDING CONCEPT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B2B]">
            Four doors into the FUNDI network.
          </h2>
          <p className="text-xs sm:text-sm text-[#2B4560]/70 mt-1">
            Choose your profile to launch tailored workspaces, verified contracts, and safe payment rails.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Door 1: Owner */}
          <div 
            onClick={() => handleDoorClick('owner', '/app/projects/proj-karen-villa')}
            className="p-6 rounded-2xl bg-white border border-[#2B4560]/15 hover:border-[#1F6FEB] hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1F6FEB]/10 text-[#1F6FEB] flex items-center justify-center mb-4 group-hover:bg-[#1F6FEB] group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                I am building
              </h3>
              <p className="text-xs text-[#2B4560]/80 mt-1 leading-relaxed">
                Individual, diaspora, or corporate developer. Post projects, hire verified teams, lock funds in escrow, and track budget against baseline.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#2B4560]/10 flex items-center justify-between text-xs font-semibold text-[#1F6FEB]">
              <span>Owner Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Door 2: Contractor */}
          <div 
            onClick={() => handleDoorClick('contractor', '/marketplace?tab=contractor')}
            className="p-6 rounded-2xl bg-white border border-[#2B4560]/15 hover:border-[#0B1B2B] hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0B1B2B]/10 text-[#0B1B2B] flex items-center justify-center mb-4 group-hover:bg-[#0B1B2B] group-hover:text-white transition-colors">
                <Hammer className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                I build
              </h3>
              <p className="text-xs text-[#2B4560]/80 mt-1 leading-relaxed">
                NCA registered general or specialized contractor. Access guaranteed funded milestones, submit evidence, and eliminate payment delays.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#2B4560]/10 flex items-center justify-between text-xs font-semibold text-[#0B1B2B]">
              <span>Contractor Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Door 3: Expert */}
          <div 
            onClick={() => handleDoorClick('expert', '/marketplace?tab=expert')}
            className="p-6 rounded-2xl bg-white border border-[#2B4560]/15 hover:border-[#C8A24A] hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#C8A24A]/15 text-[#C8A24A] flex items-center justify-center mb-4 group-hover:bg-[#C8A24A] group-hover:text-[#0B1B2B] transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                I am an expert
              </h3>
              <p className="text-xs text-[#2B4560]/80 mt-1 leading-relaxed">
                BORAQS registered architects, EBK certified structural engineers, quantity surveyors, and NEMA environmental assessors.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#2B4560]/10 flex items-center justify-between text-xs font-semibold text-[#C8A24A]">
              <span>Expert Network</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Door 4: Fundi */}
          <div 
            onClick={() => handleDoorClick('labour', '/app/site')}
            className="p-6 rounded-2xl bg-white border border-[#2B4560]/15 hover:border-[#FF6B2C] hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 text-[#FF6B2C] flex items-center justify-center mb-4 group-hover:bg-[#FF6B2C] group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                I am a fundi / gang lead
              </h3>
              <p className="text-xs text-[#2B4560]/80 mt-1 leading-relaxed">
                Masons, carpenters, plumbers, electricians, steel fixers. Log daily check-ins, build a verified work reputation, and receive M-Pesa wage payouts.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#2B4560]/10 flex items-center justify-between text-xs font-semibold text-[#FF6B2C]">
              <span>Fundi Wage Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Smaller 5th Link: Supplier */}
        <div className="mt-4 text-center">
          <Link
            to="/marketplace?category=material"
            className="inline-flex items-center gap-1.5 text-xs text-[#2B4560] hover:text-[#1F6FEB] font-medium"
          >
            <span>Are you a materials supplier or heavy plant equipment owner?</span>
            <span className="font-semibold underline">Explore Supplier & Plant Booking →</span>
          </Link>
        </div>
      </section>

      {/* ARCHITECTURAL RIGOR, CAD BLUEPRINTS & SITE EVIDENCE SHOWCASE */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#07131F] text-white rounded-3xl p-6 sm:p-10 border border-[#2B4560]/50 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 border-b border-[#2B4560]/60 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Architectural blueprints meet ironclad financial custody.
              </h2>
            </div>
            
            <BrandLogo variant="stamp" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Card 1: CAD Blueprint */}
            <Link
              to="/blueprint"
              className="p-5 rounded-2xl bg-[#0B1B2B] border border-[#2B4560]/60 hover:border-[#1F6FEB] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#1F6FEB]/20 text-[#1F6FEB] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5 text-[#C8A24A]" />
                </div>
                <h3 className="font-display font-bold text-base text-white group-hover:text-[#1F6FEB] transition-colors">
                  Structural Plans & Section Cuts
                </h3>
                <p className="text-xs text-[#D9DEE3]/70 leading-relaxed">
                  Inspect foundation footings, reinforced concrete beams, bar bending schedules (BS 8110), and MEP conduit overlays.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#1F6FEB]">
                <span>Launch Blueprint Engine</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Trade Skills */}
            <Link
              to="/skills"
              className="p-5 rounded-2xl bg-[#0B1B2B] border border-[#2B4560]/60 hover:border-[#C8A24A] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#C8A24A]/20 text-[#C8A24A] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5 text-[#1E9E6A]" />
                </div>
                <h3 className="font-display font-bold text-base text-white group-hover:text-[#C8A24A] transition-colors">
                  Trade Skills & Artisan Verification
                </h3>
                <p className="text-xs text-[#D9DEE3]/70 leading-relaxed">
                  Accredited masonry, steel fixing, EPRA electrician licensing, and daily Kenyan labor productivity benchmarks.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#C8A24A]">
                <span>Verify Trade Credentials</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Site Instagram */}
            <Link
              to="/instagram"
              className="p-5 rounded-2xl bg-[#0B1B2B] border border-[#2B4560]/60 hover:border-[#1E9E6A] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E9E6A]/20 text-[#1E9E6A] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5 text-[#1F6FEB]" />
                </div>
                <h3 className="font-display font-bold text-base text-white group-hover:text-[#1E9E6A] transition-colors">
                  Site Instagram: Proof Stream
                </h3>
                <p className="text-xs text-[#D9DEE3]/70 leading-relaxed">
                  Geotagged site photos, concrete slump tests, and laboratory cube crushing strength certificates with SHA-256 signatures.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#1E9E6A]">
                <span>Explore Site Proof Feed</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. TRUST & ESCROW PILLARS */}
      <section className="bg-[#0B1B2B] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#C8A24A]/20 text-[#C8A24A] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-white">
                Statutory Bank-Backed Custody
              </h4>
              <p className="text-xs text-[#D9DEE3]/70 leading-relaxed">
                FUNDI does not hold your deposits directly. Money is secured in licensed trust custody (Stanbic / NCBA) under the National Payment System Act.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1F6FEB]/20 text-[#1F6FEB] flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-white">
                Evidence Before Release
              </h4>
              <p className="text-xs text-[#D9DEE3]/70 leading-relaxed">
                No advance cash disappears into thin air. Payouts require concrete cube test certificates, GPS stamped site photos, and QS verifier sign-off.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E9E6A]/20 text-[#1E9E6A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-white">
                5% Retention & Defect Protection
              </h4>
              <p className="text-xs text-[#D9DEE3]/70 leading-relaxed">
                A 5% retention holdback is retained in the vault until defects liability period ends, guaranteeing prompt rectification of any snags.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. INSTANT RATE-CARD ESTIMATOR */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <InstantEstimator currency={currency} />
      </section>

      {/* 5. MARKETPLACE PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B2B]">
              Top registered talent on site.
            </h2>
            <p className="text-xs text-[#2B4560]/70 mt-1">
              Every professional's board registration is validated against BORAQS, EBK, and NCA databases.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-semibold text-[#1F6FEB] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View all 150+ verified experts & contractors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SEED_MARKETPLACE_ENTITIES.slice(0, 4).map((entity) => (
            <div key={entity.id} className="bg-white rounded-xl border border-[#2B4560]/15 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={entity.photo}
                    alt={entity.title}
                    className="w-12 h-12 rounded-lg object-cover border border-[#2B4560]/15"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-[#0B1B2B] truncate">{entity.title}</h4>
                    <span className="text-[10px] font-mono text-[#1F6FEB] font-semibold block truncate">
                      {entity.registrationBadge}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-[#2B4560]/70 mt-0.5">
                      <Star className="w-3 h-3 text-[#C8A24A] fill-[#C8A24A]" />
                      <span className="font-mono font-bold text-[#0B1B2B]">{entity.rating}</span>
                      <span>({entity.completedProjectsCount} projects)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#2B4560] line-clamp-2 mb-3">
                  {entity.subtitle}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {entity.skills.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-[#F4F1EA] text-[#2B4560] rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#2B4560]/10 flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-[#0B1B2B]">
                  {entity.rateDisplay}
                </span>
                <Link
                  to={`/marketplace`}
                  className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#0B1B2B] hover:bg-[#1F6FEB] rounded transition-colors"
                >
                  Hire
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INVESTOR DEMO CTA BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0B1B2B] text-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              Explore the FUNDI Investor Demo Dashboard
            </h3>
            <p className="text-xs sm:text-sm text-[#D9DEE3]/70 mt-1 max-w-xl">
              Inspect live-looking unit economics, take rates, escrow float retention, and the construction credit graph. (Gated by demo code: FUNDI-2026).
            </p>
          </div>
          <Link
            to="/investors"
            className="px-5 py-2.5 bg-[#C8A24A] hover:bg-[#b5923f] text-[#0B1B2B] font-bold text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Open Investor Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};
