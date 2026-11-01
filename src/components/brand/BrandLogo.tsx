import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'mark' | 'stamp' | 'compact';
  theme?: 'dark' | 'light';
  className?: string;
  subtext?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  theme = 'light',
  className = '',
  subtext
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#0B1B2B]';
  const mutedColor = isDark ? 'text-[#D9DEE3]/70' : 'text-[#2B4560]/75';

  // Architectural Precision Mark (Integrated Compass, Truss Joint & Vault Shield)
  const ArchitecturalMark = (
    <div className="relative shrink-0 flex items-center justify-center">
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-9 h-9 sm:w-10 sm:h-10 transition-transform group-hover:scale-105 duration-200"
        aria-label="JengaTrust Architectural Seal"
      >
        {/* Outer Hexagonal Foundation Frame */}
        <polygon
          points="22,3 39,12 39,32 22,41 5,32 5,12"
          className={isDark ? 'fill-[#07131F] stroke-[#1F6FEB]/60' : 'fill-[#0B1B2B] stroke-[#1F6FEB]/40'}
          strokeWidth="1.5"
        />

        {/* CAD Crosshairs / Drafting Grid Lines */}
        <line x1="22" y1="3" x2="22" y2="41" stroke="#1F6FEB" strokeWidth="0.75" strokeDasharray="2 2" strokeOpacity="0.4" />
        <line x1="5" y1="22" x2="39" y2="22" stroke="#1F6FEB" strokeWidth="0.75" strokeDasharray="2 2" strokeOpacity="0.4" />

        {/* Structural Truss / Triangular Pylon */}
        <path
          d="M22 8L34 30H10L22 8Z"
          fill="none"
          stroke="#C8A24A"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Internal Cross Bracing (K-Truss) */}
        <path
          d="M22 8V30M16 19L22 24L28 19"
          stroke="#C8A24A"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Escrow Node / Key Vault Lock */}
        <circle cx="22" cy="22" r="3.5" fill="#1F6FEB" />
        <circle cx="22" cy="22" r="1.5" fill="#FFFFFF" />

        {/* Survey Datum Triangles */}
        <polygon points="22,4 20.5,6.5 23.5,6.5" fill="#C8A24A" />
      </svg>
    </div>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center ${className}`}>{ArchitecturalMark}</div>;
  }

  if (variant === 'stamp') {
    return (
      <div className={`inline-flex items-center gap-3 p-3 rounded-xl border border-[#C8A24A]/40 bg-[#0B1B2B]/95 text-white font-mono text-[11px] ${className}`}>
        <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#C8A24A] flex items-center justify-center p-1">
          <span className="text-[8px] font-bold text-[#C8A24A] text-center uppercase tracking-tighter leading-none">
            BORAQS<br/>EBK<br/>NCA
          </span>
        </div>
        <div className="border-l border-[#C8A24A]/30 pl-3">
          <div className="font-bold text-[#C8A24A] uppercase tracking-wider text-[10px]">
            ARCHITECTURAL SEAL · CERTIFIED
          </div>
          <div className="text-[9px] text-[#D9DEE3]/80">
            REGISTERED PROFESSIONAL · ESCROW VERIFIED
          </div>
          <div className="text-[8px] text-[#1F6FEB] mt-0.5">
            KENYA BS 8110 / EUROCODE 2 COMPLIANT
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {ArchitecturalMark}
        <div className="flex flex-col">
          <span className={`font-display font-extrabold text-base tracking-tight ${textColor}`}>
            JENGA<span className="text-[#1F6FEB]">TRUST</span>
          </span>
          <span className="text-[9px] font-mono tracking-wider text-[#C8A24A] uppercase -mt-0.5">
            BIM ESCROW
          </span>
        </div>
      </div>
    );
  }

  // Full lockup
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {ArchitecturalMark}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-display font-extrabold text-lg sm:text-xl tracking-tight ${textColor}`}>
            FUNDI<span className="text-[#1F6FEB]">.</span><span className="text-[#C8A24A] text-sm sm:text-base font-bold ml-0.5">JENGA TRUST</span>
          </span>
          <span className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/20">
            NCA & ESCROW
          </span>
        </div>
        <span className={`text-[10px] font-medium tracking-wide uppercase -mt-0.5 ${mutedColor}`}>
          {subtext || 'Verified Kenyan Construction & BIM Escrow'}
        </span>
      </div>
    </div>
  );
};
