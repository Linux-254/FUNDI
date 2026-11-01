import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Heart, 
  MessageSquare, 
  Share2, 
  Filter, 
  Download, 
  ExternalLink,
  Lock,
  Layers,
  ArrowUpRight,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SitePost {
  id: string;
  projectTitle: string;
  location: string;
  coordinates: string;
  stage: 'Substructure' | 'Superstructure' | 'Roofing' | 'Finishes' | 'MEP';
  timestamp: string;
  weather: string;
  verifier: {
    name: string;
    role: string;
    regNumber: string;
  };
  imageUrl: string;
  caption: string;
  technicalDetails: {
    testType: string;
    result: string;
    standard: string;
    hash: string;
  };
  linkedMilestone: {
    id: string;
    title: string;
    amountKes: number;
    status: 'Verified - Ready to Release' | 'Released' | 'Under Inspection';
  };
  likes: number;
  commentsCount: number;
  featured?: boolean;
}

export const SiteShowcasePage: React.FC<{ currency: 'KES' | 'USD' }> = ({ currency }) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [activeModalImage, setActiveModalImage] = useState<SitePost | null>(null);

  const posts: SitePost[] = [
    {
      id: 'post-1',
      projectTitle: 'Karen 4-Bed Residential Eco-Villa',
      location: 'Karen, Nairobi County',
      coordinates: '-1.3197° S, 36.7065° E',
      stage: 'Superstructure',
      timestamp: 'Today · 11:24 AM EAT',
      weather: '23°C · Dry, 48% Humidity',
      verifier: {
        name: 'Eng. Kelvin Ochieng, PE',
        role: 'Resident Structural Engineer',
        regNumber: 'EBK M.2891'
      },
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1200&auto=format&fit=crop',
      caption: 'Suspended first floor slab rebar pre-pour inspection completed. Top and bottom high-yield Y12 bars spaced at 150mm c/c with BRC A142 fabric. 25mm precast concrete cover blocks tied at 1m intervals. Formwork acro-props checked for vertical tolerance.',
      technicalDetails: {
        testType: 'Pre-Pour Formwork & Rebar Cover Check',
        result: 'PASSED (Cover 25mm uniform, deflection <1mm)',
        standard: 'BS 8110 Cl. 3.3.4 & Kenya NBC 2024',
        hash: 'SHA256:8f419c...2810'
      },
      linkedMilestone: {
        id: 'ms-frame',
        title: 'Milestone 3: Ground Floor Superstructure Frame',
        amountKes: 1420000,
        status: 'Verified - Ready to Release'
      },
      likes: 42,
      commentsCount: 6,
      featured: true
    },
    {
      id: 'post-2',
      projectTitle: 'Kilifi Coral-Stone Eco-Lodge',
      location: 'Bofa Beach, Kilifi County',
      coordinates: '-3.6305° S, 39.8510° E',
      stage: 'Substructure',
      timestamp: 'Yesterday · 03:15 PM EAT',
      weather: '29°C · Coastal Marine Air',
      verifier: {
        name: 'Arch. Peter Kamau',
        role: 'Consulting Architect & Project Manager',
        regNumber: 'BORAQS A/1890'
      },
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
      caption: 'Dressed coral stone masonry walling on continuous strip footings. Class 1 cement-sand mortar batching (1:3 ratio) with sulphate-resisting cement for coastal soil salinity. Damp proof membrane (1000 gauge) installed under floor slab.',
      technicalDetails: {
        testType: 'Coastal Salinity Resistance & Mortar Adhesion',
        result: 'PASSED (KEBS KS 02-1262 Standard)',
        standard: 'BS 5628 Code of Practice for Masonry',
        hash: 'SHA256:77bc01...99a1'
      },
      linkedMilestone: {
        id: 'ms-found',
        title: 'Milestone 2: Substructure & Foundation Strip',
        amountKes: 890000,
        status: 'Released'
      },
      likes: 38,
      commentsCount: 4
    },
    {
      id: 'post-3',
      projectTitle: 'Parklands Commercial Office Annex',
      location: 'Parklands Road, Westlands, Nairobi',
      coordinates: '-1.2612° S, 36.8142° E',
      stage: 'Superstructure',
      timestamp: '26 Oct 2026 · 10:00 AM EAT',
      weather: '21°C · Overcast',
      verifier: {
        name: 'QS David Ndegwa',
        role: 'Independent Clerk of Works',
        regNumber: 'BORAQS QS/981'
      },
      imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200&auto=format&fit=crop',
      caption: 'Ready-mix concrete delivery from Bamburi Special Products. Slump cone test performed on site before pump discharge: 75mm slump within acceptable 75±25mm range. Six 150mm concrete test cubes cast for 7-day and 28-day laboratory crushing.',
      technicalDetails: {
        testType: 'Concrete Slump & Compressive Cube Sampling',
        result: 'PASSED (75mm Slump, C25/20 Class)',
        standard: 'KEBS KS EAS 148 / BS EN 12350-2',
        hash: 'SHA256:39fa42...c540'
      },
      linkedMilestone: {
        id: 'ms-slab',
        title: 'Milestone 4: First Floor Suspended Concrete Slab',
        amountKes: 1850000,
        status: 'Verified - Ready to Release'
      },
      likes: 65,
      commentsCount: 9
    },
    {
      id: 'post-4',
      projectTitle: 'Runda Palm Estate Townhouses',
      location: 'Runda, Nairobi',
      coordinates: '-1.2189° S, 36.8174° E',
      stage: 'MEP',
      timestamp: '25 Oct 2026 · 04:40 PM EAT',
      weather: '24°C · Sunny',
      verifier: {
        name: 'Eng. Fatuma Salim',
        role: 'Consulting Building Services Engineer',
        regNumber: 'EBK M.3412'
      },
      imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
      caption: 'PPR pipework hydrostatic pressure test for domestic hot and cold water distribution. Pressurized to 10.0 bar for 120 minutes with zero pressure drop. Soil and vent stacks smoke-tested for gas tightness.',
      technicalDetails: {
        testType: 'Hydrostatic Pressure & Stack Smoke Test',
        result: 'PASSED (10.0 bar maintained for 2 hrs)',
        standard: 'BS 6700 / Nairobi County Public Health By-laws',
        hash: 'SHA256:119ea7...33dc'
      },
      linkedMilestone: {
        id: 'ms-mep',
        title: 'Milestone 5: Electrical Conduits & Plumbing Rough-In',
        amountKes: 950000,
        status: 'Under Inspection'
      },
      likes: 29,
      commentsCount: 2
    }
  ];

  const filteredPosts = selectedStage === 'all' 
    ? posts 
    : posts.filter(p => p.stage.toLowerCase() === selectedStage.toLowerCase());

  const toggleLike = (id: string) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="pb-6 border-b border-[#2B4560]/15 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase tracking-wider">
              LIVE SITE SHOWCASE · GEOTAGGED PHOTO EVIDENCE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E9E6A]/20 text-[#1E9E6A] font-mono font-semibold">
              FIELD INSPECTION REPO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#0B1B2B]">
            Site Instagram: Live Inspection & Milestone Proof
          </h1>
          <p className="text-sm text-[#2B4560]/80 mt-1 max-w-3xl">
            Real photos from real Kenyan sites. No funds leave the FUNDI escrow vault until certified Clerk of Works and registered engineers upload timestamped, geotagged evidence with cryptographic checksums.
          </p>
        </div>

        {/* Filter Stage Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#2B4560]/20 text-xs">
          {['all', 'Substructure', 'Superstructure', 'MEP'].map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer capitalize ${
                selectedStage.toLowerCase() === stage.toLowerCase()
                  ? 'bg-[#0B1B2B] text-white font-semibold shadow-xs'
                  : 'text-[#2B4560] hover:text-[#0B1B2B]'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredPosts.map((post) => {
          const isLiked = likedPosts[post.id];

          return (
            <article 
              key={post.id}
              className="bg-white rounded-2xl border border-[#2B4560]/15 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Post Header: Project, Geotag & Verifier */}
              <div className="p-4 sm:p-5 border-b border-[#2B4560]/10 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1B2B] text-[#C8A24A] flex items-center justify-center font-bold font-mono text-xs shrink-0">
                    NCA
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#0B1B2B]">
                      {post.projectTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-[#2B4560]/80 font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#1F6FEB]" />
                        {post.location}
                      </span>
                      <span>·</span>
                      <span className="text-[#1E9E6A] font-semibold">{post.stage}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F6FEB]/10 text-[#1F6FEB] font-semibold block">
                    {post.timestamp}
                  </span>
                  <span className="text-[9px] text-[#2B4560]/60 font-mono block mt-0.5">
                    {post.coordinates}
                  </span>
                </div>
              </div>

              {/* Post Image with Inspection Overlays */}
              <div className="relative bg-[#0B1B2B] aspect-16/10 overflow-hidden group">
                <img
                  src={post.imageUrl}
                  alt={`${post.projectTitle} - ${post.stage} inspection`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  loading="lazy"
                />

                {/* Top Badge: Weather & Live Timestamp */}
                <div className="absolute top-3 left-3 bg-[#0B1B2B]/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-white/90 border border-white/10 flex items-center gap-2">
                  <span>{post.weather}</span>
                </div>

                {/* Bottom Left Badge: Cryptographic Hash */}
                <div className="absolute bottom-3 left-3 bg-[#0B1B2B]/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono text-[#C8A24A] border border-[#C8A24A]/30">
                  {post.technicalDetails.hash}
                </div>

                {/* Inspect Button */}
                <button
                  onClick={() => setActiveModalImage(post)}
                  className="absolute bottom-3 right-3 p-2 bg-[#0B1B2B]/85 hover:bg-[#1F6FEB] text-white rounded-lg transition-colors cursor-pointer border border-white/20"
                  title="Expand High-Res Inspection"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Post Details & Verification Meta */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Caption & Technical Findings */}
                <div className="space-y-3">
                  <p className="text-xs text-[#0B1B2B] leading-relaxed">
                    {post.caption}
                  </p>

                  <div className="bg-[#F4F1EA] rounded-xl p-3 border border-[#2B4560]/10 text-xs font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#2B4560]">Quality Test:</span>
                      <strong className="text-[#0B1B2B]">{post.technicalDetails.testType}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2B4560]">Result:</span>
                      <span className="text-[#1E9E6A] font-bold">{post.technicalDetails.result}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2B4560]">Code:</span>
                      <span className="text-[#2B4560]/80">{post.technicalDetails.standard}</span>
                    </div>
                  </div>

                  {/* Real-time IoT Sensor Stream */}
                  <div className="p-2.5 rounded-xl bg-[#0B1B2B]/5 border border-[#2B4560]/15 flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-[#1F6FEB]">
                      <span className="w-2 h-2 rounded-full bg-[#1E9E6A] animate-ping" />
                      <span className="font-bold">IoT Sensors:</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#0B1B2B]">
                      <span>Temp: <strong>34.2°C</strong></span>
                      <span>·</span>
                      <span>RH: <strong>88%</strong></span>
                      <span>·</span>
                      <span>Tilt: <strong>0.02°</strong></span>
                      <span>·</span>
                      <span className="text-[#1E9E6A] font-bold">Slump: 75mm</span>
                    </div>
                  </div>
                </div>

                {/* Linked Escrow Milestone Box */}
                <div className="bg-[#0B1B2B] text-white rounded-xl p-3.5 border border-[#2B4560]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#C8A24A] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#1F6FEB]" /> LINKED MILESTONE IN ESCROW
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      post.linkedMilestone.status === 'Released'
                        ? 'bg-[#1E9E6A]/20 text-[#1E9E6A]'
                        : 'bg-[#1F6FEB]/20 text-[#1F6FEB]'
                    }`}>
                      {post.linkedMilestone.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate pr-2">
                      {post.linkedMilestone.title}
                    </h4>
                    <span className="text-xs font-mono font-bold text-[#1E9E6A] shrink-0">
                      {currency === 'KES' ? `KES ${post.linkedMilestone.amountKes.toLocaleString()}` : `$${Math.round(post.linkedMilestone.amountKes / 130).toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-gray-300">
                    <span>Verifier: {post.verifier.name} ({post.verifier.regNumber})</span>
                    <Link 
                      to="/trust"
                      className="text-[#C8A24A] hover:underline flex items-center gap-0.5"
                    >
                      <span>Escrow Rules</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Post Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#2B4560]/10 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLiked ? 'text-rose-600 font-bold' : 'text-[#2B4560] hover:text-rose-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                      <span>{post.likes + (isLiked ? 1 : 0)}</span>
                    </button>

                    <span className="flex items-center gap-1.5 text-[#2B4560]">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </span>
                  </div>

                  <Link
                    to="/blueprint"
                    className="text-xs font-medium text-[#1F6FEB] hover:underline flex items-center gap-1"
                  >
                    <span>View Architectural Blueprint</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox Modal for Photo Inspection */}
      {activeModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModalImage(null)}
        >
          <div 
            className="bg-[#0B1B2B] text-white rounded-2xl max-w-3xl w-full border border-[#2B4560]/60 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#2B4560]/50 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  {activeModalImage.projectTitle}
                </h3>
                <span className="text-xs font-mono text-[#C8A24A]">
                  {activeModalImage.location} · {activeModalImage.coordinates}
                </span>
              </div>
              <button
                onClick={() => setActiveModalImage(null)}
                className="text-gray-400 hover:text-white text-xs font-mono p-1"
              >
                CLOSE [ESC]
              </button>
            </div>

            <img
              src={activeModalImage.imageUrl}
              alt={activeModalImage.projectTitle}
              className="w-full max-h-[60vh] object-contain bg-black"
            />

            <div className="p-4 text-xs font-mono space-y-2">
              <p className="text-gray-300 font-sans">{activeModalImage.caption}</p>
              <div className="pt-2 border-t border-white/10 flex justify-between text-[#1E9E6A]">
                <span>Verified by {activeModalImage.verifier.name} ({activeModalImage.verifier.regNumber})</span>
                <span>Checksum: {activeModalImage.technicalDetails.hash}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
