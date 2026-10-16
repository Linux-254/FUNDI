import React, { useState, useEffect } from 'react';
import { MarketplaceEntity } from '../types';
import { api } from '../lib/api';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Briefcase, 
  Hammer, 
  Package, 
  Truck,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarketplacePageProps {
  currency: 'KES' | 'USD';
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ currency }) => {
  const [entities, setEntities] = useState<MarketplaceEntity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [hireModalEntity, setHireModalEntity] = useState<MarketplaceEntity | null>(null);

  useEffect(() => {
    api.getMarketplaceEntities(selectedCategory, searchQuery).then(res => {
      if (selectedCounty !== 'all') {
        setEntities(res.filter(e => e.county.toLowerCase().includes(selectedCounty.toLowerCase())));
      } else {
        setEntities(res);
      }
    });
  }, [selectedCategory, searchQuery, selectedCounty]);

  const categoryTabs = [
    { id: 'all', label: 'All Listings', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'expert', label: 'Registered Experts (BORAQS / EBK)', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'contractor', label: 'NCA Contractors', icon: <Hammer className="w-4 h-4" /> },
    { id: 'labour', label: 'Fundis & Crews', icon: <Hammer className="w-4 h-4" /> },
    { id: 'material', label: 'Materials Depot', icon: <Package className="w-4 h-4" /> },
    { id: 'machinery', label: 'Machinery Hire', icon: <Truck className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F6FEB]">
              KENYA CONSTRUCTION SUPPLY DIRECTORY
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#0B1B2B] mt-1">
              Find verified experts, contractors, crews, and machinery.
            </h1>
            <p className="text-xs sm:text-sm text-[#2B4560]/70 mt-1.5 leading-relaxed">
              Every professional and builder is vetted against board registers (BORAQS, EBK, NCA). Payouts are protected via milestone-based escrow.
            </p>
          </div>

          {/* Search Bar & County Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-[#2B4560]/60 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by name, trade (e.g. Mason, Architect, Structural Engineer), or material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50 focus:bg-white focus:outline-[#1F6FEB] transition-colors"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50 focus:bg-white focus:outline-[#1F6FEB]"
              >
                <option value="all">All Counties (Nationwide)</option>
                <option value="Nairobi">Nairobi (Karen, Kilimani, Westlands)</option>
                <option value="Kiambu">Kiambu (Ruiru, Thika, Kiambu Town)</option>
                <option value="Machakos">Machakos (Syokimau, Athi River)</option>
                <option value="Mombasa">Mombasa & Coastal Region</option>
                <option value="Nakuru">Nakuru & Rift Valley</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-6 border-t border-[#2B4560]/10 mt-6 pb-1">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-[#0B1B2B] text-white shadow-2xs'
                    : 'bg-[#F4F1EA] text-[#2B4560] hover:bg-black/5'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Anti-Circumvention Trust Banner */}
        <div className="p-4 bg-[#0B1B2B] text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-[#C8A24A]/30">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#C8A24A] shrink-0" />
            <p className="text-[#D9DEE3]/80">
              <strong className="text-white">Anti-Circumvention Guarantee:</strong> Contact details are masked until an in-platform contract is initiated. Work performed outside platform escrow forfeits payment protection, dispute mediation, and verified reputation accreditation.
            </p>
          </div>
          <span className="font-mono text-[#C8A24A] text-[11px] shrink-0">
            Escrow Protected
          </span>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map((entity) => (
            <div
              key={entity.id}
              className="bg-white rounded-2xl border border-[#2B4560]/15 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <img
                    src={entity.photo}
                    alt={entity.title}
                    className="w-14 h-14 rounded-xl object-cover border border-[#2B4560]/20 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-[#0B1B2B] truncate">{entity.title}</h3>
                      <ShieldCheck className="w-4 h-4 text-[#1E9E6A] shrink-0" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#1F6FEB] block truncate">
                      {entity.registrationBadge}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-[#2B4560]/70 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF6B2C]" />
                        <span>{entity.county}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Star className="w-3 h-3 text-[#C8A24A] fill-[#C8A24A]" />
                        <span className="font-bold text-[#0B1B2B]">{entity.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#2B4560] line-clamp-2 mb-3 leading-relaxed">
                  {entity.subtitle}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {entity.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#F4F1EA] text-[#2B4560] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Rates & CTA */}
              <div className="pt-3 border-t border-[#2B4560]/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#2B4560]/60 font-semibold block uppercase">Indicative Rate</span>
                  <span className="text-xs font-mono font-bold text-[#0B1B2B]">
                    {entity.rateDisplay}
                  </span>
                </div>

                <button
                  onClick={() => setHireModalEntity(entity)}
                  className="py-1.5 px-3 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Engage & Request Bid
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Engagement Modal */}
      {hireModalEntity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#2B4560]/20 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#1F6FEB] font-bold uppercase">
                  INITIALIZE PLATFORM ENGAGEMENT
                </span>
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Engage {hireModalEntity.title}
                </h3>
              </div>
              <button onClick={() => setHireModalEntity(null)}>✕</button>
            </div>

            <div className="p-3 bg-[#F4F1EA] rounded-xl text-xs space-y-1 text-[#2B4560]">
              <p>• Board Registration: <strong className="text-[#0B1B2B]">{hireModalEntity.registrationBadge}</strong></p>
              <p>• Location: <strong className="text-[#0B1B2B]">{hireModalEntity.county}</strong></p>
              <p>• Verified Completions: <strong className="text-[#0B1B2B]">{hireModalEntity.completedProjectsCount}</strong></p>
            </div>

            <p className="text-xs text-[#2B4560] leading-relaxed">
              Initiating this engagement will link this professional/contractor to your project workspace. Direct unmasked communication will open immediately once terms are drafted under escrow protection.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setHireModalEntity(null)}
                className="flex-1 py-2 text-xs font-semibold text-[#2B4560] border rounded-lg"
              >
                Cancel
              </button>
              <Link
                to="/app/projects/proj-karen-villa"
                onClick={() => setHireModalEntity(null)}
                className="flex-1 py-2 text-xs font-bold text-center text-white bg-[#0B1B2B] hover:bg-[#1F6FEB] rounded-lg shadow-sm"
              >
                Assign to Project
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
