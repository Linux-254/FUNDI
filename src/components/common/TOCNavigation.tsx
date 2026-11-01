import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  FileText, 
  Users, 
  PenTool, 
  ShieldCheck, 
  ShoppingBag, 
  Calendar, 
  Vault, 
  Camera, 
  FolderLock, 
  MessageSquare, 
  AlertTriangle,
  Activity,
  Radio
} from 'lucide-react';

export interface TOCSection {
  id: string;
  number: string;
  title: string;
  icon: React.ReactNode;
  badge?: string;
  children?: {
    id: string;
    number: string;
    title: string;
    completed?: boolean;
    active?: boolean;
  }[];
}

interface TOCNavigationProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  className?: string;
}

export const TOCNavigation: React.FC<TOCNavigationProps> = ({
  activeSection,
  onSelectSection,
  className = ''
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    '8': false, // Keep budget expanded by default
    '5': false  // Keep compliance expanded
  });

  const toggleCollapse = (num: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedSections(prev => ({ ...prev, [num]: !prev[num] }));
  };

  const sections: TOCSection[] = [
    {
      id: 'overview',
      number: '1',
      title: 'Overview & Blueprint',
      icon: <Layers className="w-4 h-4 text-[#1F6FEB]" />,
      children: [
        { id: 'overview-blueprint', number: '1.1', title: 'Interactive Cross-Section' },
        { id: 'overview-kpi', number: '1.2', title: 'Progress & Completion Velocity' }
      ]
    },
    {
      id: 'brief',
      number: '2',
      title: 'Project Brief & Scope',
      icon: <FileText className="w-4 h-4 text-[#2B4560]" />,
      children: [
        { id: 'brief-specs', number: '2.1', title: 'Architectural Specifications' },
        { id: 'brief-estimator', number: '2.2', title: 'Rate-Card Estimator Model' }
      ]
    },
    {
      id: 'team',
      number: '3',
      title: 'Team & Assigned Roles',
      icon: <Users className="w-4 h-4 text-[#2B4560]" />,
      children: [
        { id: 'team-contractor', number: '3.1', title: 'General Contractor (NCA 1)' },
        { id: 'team-experts', number: '3.2', title: 'Consulting Engineers & QS' },
        { id: 'team-crews', number: '3.3', title: 'Fundi Gangs & Trade Leads' }
      ]
    },
    {
      id: 'design',
      number: '4',
      title: 'Design & BIM Drawings',
      icon: <PenTool className="w-4 h-4 text-[#2B4560]" />,
      children: [
        { id: 'design-arch', number: '4.1', title: 'Architectural Set (BORAQS)' },
        { id: 'design-struct', number: '4.2', title: 'Structural & Rebar Schedules' }
      ]
    },
    {
      id: 'compliance',
      number: '5',
      title: 'Approvals & Compliance',
      icon: <ShieldCheck className="w-4 h-4 text-[#1E9E6A]" />,
      badge: '91%',
      children: [
        { id: 'compliance-statutory', number: '5.1', title: 'Statutory Permits (NCA/NEMA)' },
        { id: 'compliance-county', number: '5.2', title: 'Nairobi County Building Permit' },
        { id: 'compliance-insurance', number: '5.3', title: 'CAR & WIBA Insurance Policy' }
      ]
    },
    {
      id: 'procurement',
      number: '6',
      title: 'Procurement & Bids',
      icon: <ShoppingBag className="w-4 h-4 text-[#2B4560]" />,
      children: [
        { id: 'procurement-bids', number: '6.1', title: 'Competitive Tenders' },
        { id: 'procurement-materials', number: '6.2', title: 'Bulk Cement & Steel Orders' }
      ]
    },
    {
      id: 'schedule',
      number: '7',
      title: 'Schedule & Milestones',
      icon: <Calendar className="w-4 h-4 text-[#2B4560]" />,
      children: [
        { id: 'schedule-timeline', number: '7.1', title: 'Gantt Progress Baseline' },
        { id: 'schedule-evidence', number: '7.2', title: 'Milestone Verification Queue' }
      ]
    },
    {
      id: 'budget-escrow',
      number: '8',
      title: 'Budget Guard & Escrow',
      icon: <Vault className="w-4 h-4 text-[#C8A24A]" />,
      badge: 'Locked',
      children: [
        { id: 'budget-gauge', number: '8.1', title: 'Liquid Budget Gauge & Variance' },
        { id: 'budget-escrow-vault', number: '8.2', title: 'Escrow Vault & M-Pesa Funding' },
        { id: 'budget-variations', number: '8.3', title: 'Formal Variations Log (VO)' },
        { id: 'budget-ledger', number: '8.4', title: 'Double-Entry Audit Ledger' }
      ]
    },
    {
      id: 'site-log',
      number: '9',
      title: 'Site Log & Attendance',
      icon: <Camera className="w-4 h-4 text-[#FF6B2C]" />,
      children: [
        { id: 'site-daily-logs', number: '9.1', title: 'Daily Geotagged Photo Log' },
        { id: 'site-attendance', number: '9.2', title: 'Worker Muster & Wage Payouts' }
      ]
    },
    {
      id: 'documents',
      number: '10',
      title: 'Documents & Certificates',
      icon: <FolderLock className="w-4 h-4 text-[#2B4560]" />
    },
    {
      id: 'messages',
      number: '11',
      title: 'Project Communication',
      icon: <MessageSquare className="w-4 h-4 text-[#2B4560]" />
    },
    {
      id: 'disputes',
      number: '12',
      title: 'Dispute Mediation & ADR',
      icon: <AlertTriangle className="w-4 h-4 text-[#D64545]" />
    },
    {
      id: 'iot-health',
      number: '13',
      title: 'Site IoT & Structural Health',
      icon: <Activity className="w-4 h-4 text-[#00E5FF]" />,
      badge: 'Live',
      children: [
        { id: 'iot-moisture', number: '13.1', title: 'Slab Curing RH% (ASTM F2170)' },
        { id: 'iot-temp', number: '13.2', title: 'Hydration Thermal Gradient ΔT' },
        { id: 'iot-maturity', number: '13.3', title: 'Concrete Maturity Index (MPa)' },
        { id: 'iot-stress', number: '13.4', title: 'Rebar Stress & Load Gauges' }
      ]
    }
  ];

  return (
    <div className={`w-full bg-white/70 backdrop-blur-sm border border-[#2B4560]/15 rounded-xl p-3 shadow-xs select-none ${className}`}>
      <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-[#2B4560]/10">
        <span className="text-xs font-display font-bold uppercase tracking-wider text-[#0B1B2B]">
          Navigation Contents
        </span>
        <span className="text-[10px] text-[#2B4560]/60 font-mono">Word Outline</span>
      </div>

      <nav className="space-y-1 text-xs">
        {sections.map((section) => {
          const isSectionActive = activeSection === section.id || (section.children && section.children.some(c => c.id === activeSection));
          const isCollapsed = collapsedSections[section.number] ?? true;

          return (
            <div key={section.id} className="rounded-lg transition-colors">
              <div 
                onClick={() => onSelectSection(section.id)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                  isSectionActive 
                    ? 'bg-[#0B1B2B] text-white font-semibold' 
                    : 'text-[#0B1B2B] hover:bg-[#F4F1EA]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`font-mono text-[11px] shrink-0 ${isSectionActive ? 'text-[#C8A24A]' : 'text-[#2B4560]/70'}`}>
                    {section.number}.
                  </span>
                  <span className="shrink-0">{section.icon}</span>
                  <span className="truncate text-xs">{section.title}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {section.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSectionActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-[#C8A24A]/15 text-[#C8A24A] font-semibold'
                    }`}>
                      {section.badge}
                    </span>
                  )}
                  {section.children && (
                    <button
                      type="button"
                      onClick={(e) => toggleCollapse(section.number, e)}
                      className="p-1 hover:bg-black/10 rounded"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Children Sub-headings */}
              {section.children && !isCollapsed && (
                <div className="ml-5 pl-2 border-l border-[#2B4560]/20 space-y-0.5 my-1">
                  {section.children.map((child) => {
                    const isChildActive = activeSection === child.id;
                    return (
                      <div
                        key={child.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSection(child.id);
                        }}
                        className={`flex items-center justify-between px-2 py-1 text-[11px] rounded cursor-pointer transition-colors ${
                          isChildActive
                            ? 'text-[#1F6FEB] font-bold bg-[#1F6FEB]/10'
                            : 'text-[#2B4560] hover:text-[#0B1B2B] hover:bg-black/5'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-mono text-[10px] text-[#2B4560]/60 shrink-0">{child.number}</span>
                          <span className="truncate">{child.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};
