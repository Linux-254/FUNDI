import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  DollarSign, 
  ExternalLink, 
  Search, 
  Filter, 
  ChevronRight, 
  Briefcase, 
  Users, 
  FileText,
  Lock,
  ArrowRight,
  PlusCircle,
  Eye,
  Check,
  X,
  Activity,
  Cpu,
  Thermometer,
  Droplets,
  Radio,
  FileCheck,
  Wrench,
  Truck,
  Package,
  Plus,
  Send,
  Sparkles
} from 'lucide-react';
import { api } from '../../lib/api';
import { Project, Milestone, MilestoneState, UserRole } from '../../types';
import { ComplianceChecklist } from '../compliance/ComplianceChecklist';
import { ProjectHealthChart } from './ProjectHealthChart';
import { ProjectStats } from './ProjectStats';
import { BudgetGuardAlert } from '../budget/BudgetGuardAlert';
import { IoTHealth } from '../iot/IoTHealth';

interface ProjectDashboardProps {
  currency: 'KES' | 'USD';
  currentUserRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
}

interface ChangeOrderRequest {
  id: string;
  title: string;
  description: string;
  costImpactKes: number;
  timeImpactDays: number;
  status: 'Draft' | 'Submitted' | 'Approved_Escrow_Locked' | 'Completed';
  category: 'Finishes' | 'Structural' | 'MEP & Solar' | 'Landscape';
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  currency,
  currentUserRole = 'owner',
  onSelectRole
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>(currentUserRole);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [countyFilter, setCountyFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedMilestoneProject, setSelectedMilestoneProject] = useState<string | null>(null);

  // Modals
  const [complianceModalProject, setComplianceModalProject] = useState<Project | null>(null);
  const [changeOrderModalOpen, setChangeOrderModalOpen] = useState(false);
  const [newCoTitle, setNewCoTitle] = useState('');
  const [newCoDesc, setNewCoDesc] = useState('');
  const [newCoCostKes, setNewCoCostKes] = useState(350000);
  const [newCoDays, setNewCoDays] = useState(7);
  const [newCoCategory, setNewCoCategory] = useState<'Finishes' | 'Structural' | 'MEP & Solar' | 'Landscape'>('Finishes');

  // Local state for mid-construction change orders
  const [changeOrders, setChangeOrders] = useState<ChangeOrderRequest[]>([
    {
      id: 'co-101',
      title: 'Upgrade Master Bathroom to Italian Calacatta Marble & Rainfall Suite',
      description: 'Switch porcelain floor tiles to imported Italian sintered slab marble with dual concealed thermostatic mixers.',
      costImpactKes: 480000,
      timeImpactDays: 5,
      status: 'Approved_Escrow_Locked',
      category: 'Finishes'
    },
    {
      id: 'co-102',
      title: 'Expand Hybrid Solar Inverter Bank from 10kW to 15kW + LiFePO4 Storage',
      description: 'Add 6 additional Tier-1 monocrystalline panels and expand battery storage to 20kWh for full off-grid backup.',
      costImpactKes: 620000,
      timeImpactDays: 4,
      status: 'Submitted',
      category: 'MEP & Solar'
    }
  ]);

  // Verifier checklist status
  const [verifiedInspections, setVerifiedInspections] = useState<Record<string, boolean>>({
    'rebar-cover': true,
    'slump-test': true,
    'cube-crush': false,
    'dpc-membrane': true
  });

  const handleRoleTabClick = (role: UserRole) => {
    setActiveRole(role);
    if (onSelectRole) onSelectRole(role);
  };

  const loadProjects = async () => {
    setLoading(true);
    const data = await api.getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateChangeOrder = () => {
    if (!newCoTitle.trim()) return;
    const co: ChangeOrderRequest = {
      id: `co-${Date.now()}`,
      title: newCoTitle.trim(),
      description: newCoDesc.trim() || 'Mid-construction specification refinement requested by owner.',
      costImpactKes: Number(newCoCostKes),
      timeImpactDays: Number(newCoDays),
      status: 'Submitted',
      category: newCoCategory
    };
    setChangeOrders(prev => [co, ...prev]);
    setNewCoTitle('');
    setNewCoDesc('');
    setChangeOrderModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8 bg-[#F4F1EA]">
        <div className="flex items-center gap-3 text-xs font-mono text-[#0B1B2B]">
          <div className="w-5 h-5 border-2 border-[#1F6FEB] border-t-transparent rounded-full animate-spin" />
          <span>Loading FUNDI Construction Dashboard...</span>
        </div>
      </div>
    );
  }

  // Primary active project
  const primaryProject = projects[0] || null;

  // Filter projects
  const filteredProjects = projects.filter(p => {
    if (countyFilter !== 'all' && p.county !== countyFilter) return false;
    if (stageFilter !== 'all') {
      if (stageFilter === 'substructure' && !p.stage.toLowerCase().includes('substructure')) return false;
      if (stageFilter === 'superstructure' && !p.stage.toLowerCase().includes('superstructure')) return false;
      if (stageFilter === 'roofing' && !p.stage.toLowerCase().includes('roof')) return false;
      if (stageFilter === 'finishes' && !p.stage.toLowerCase().includes('finish')) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.county.toLowerCase().includes(q) ||
        p.ward.toLowerCase().includes(q) ||
        p.activeContractorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ========================================================
            FLAGSHIP HEADER & ROLE-BASED DASHBOARD SWITCHER
           ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#2B4560]/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6FEB]/10 text-[#1F6FEB] text-xs font-mono font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A24A]" />
                <span>ROLE-TAILORED CONSTRUCTION WORKSPACE</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1B2B]">
                FUNDI Active Construction Portfolio
              </h1>
              <p className="text-xs sm:text-sm text-[#2B4560]/75 mt-1">
                Role-specific commands, milestone releases, IoT structural telemetry, and change orders.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/app/projects/new"
                className="px-4 py-2.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C8A24A]" />
                <span>New Project Brief</span>
              </Link>
            </div>
          </div>

          {/* Role Navigation Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { role: 'owner', label: 'Client / Diaspora Owner', icon: Building2, desc: 'Escrow Vault & Approvals' },
              { role: 'contractor', label: 'NCA Contractor', icon: Wrench, desc: 'Daily Logs & Payouts' },
              { role: 'verifier', label: 'Clerk of Works / Verifier', icon: ShieldCheck, desc: 'Site Inspections & Tests' },
              { role: 'supplier', label: 'Supplier & Plant Hire', icon: Truck, desc: 'Materials & Equipment' }
            ].map(item => {
              const Icon = item.icon;
              const isSelected = activeRole === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => handleRoleTabClick(item.role as UserRole)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[#0B1B2B] text-white border-[#0B1B2B] shadow-md ring-2 ring-[#C8A24A]/40'
                      : 'bg-[#F4F1EA]/60 border-[#2B4560]/15 text-[#0B1B2B] hover:bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#1F6FEB] text-white' : 'bg-white text-[#1F6FEB]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs truncate block">{item.label}</span>
                    <span className="text-[10px] opacity-70 truncate block">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Budget Guard Alert Component */}
        {primaryProject && <BudgetGuardAlert project={primaryProject} currency={currency} />}

        {/* Project KPI Stats Cards */}
        <ProjectStats projects={projects} currency={currency} />

        {/* ========================================================
            ROLE VIEW 1: CLIENT / DIASPORA OWNER DASHBOARD
           ======================================================== */}
        {activeRole === 'owner' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Escrow Vault Status & Approvals */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Milestone Approvals Action Card */}
                <div className="bg-white rounded-3xl p-6 border border-[#2B4560]/15 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-[#2B4560]/10">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#C8A24A]" />
                      <h3 className="font-bold text-sm text-[#0B1B2B]">
                        Milestone Releases Pending Owner Authorization
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#1E9E6A]">
                      1 Awaiting Release
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F1EA]/50 border border-[#2B4560]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#1F6FEB] uppercase">
                        KAREN RESIDENCE · TRANCHE 2
                      </span>
                      <h4 className="font-bold text-sm text-[#0B1B2B]">
                        Ground Floor Reinforced Columns & Plinth Beam Casting
                      </h4>
                      <p className="text-xs text-[#2B4560]/80 mt-1">
                        Independent Clerk of Works has verified Class 25 concrete slump (75mm), 25mm rebar cover blocks, and formwork plumbness.
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0">
                      <span className="text-sm font-mono font-extrabold text-[#0B1B2B]">
                        {api.formatMoney(320000000, currency)}
                      </span>
                      <Link
                        to="/app/projects/proj-karen-villa"
                        className="mt-2 px-4 py-1.5 bg-[#1E9E6A] hover:bg-[#168a55] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        Approve & Release
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Live Project Refinements & Mid-Construction Change Orders */}
                <div className="bg-white rounded-3xl p-6 border border-[#2B4560]/15 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-[#2B4560]/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#1F6FEB]" />
                      <div>
                        <h3 className="font-bold text-sm text-[#0B1B2B]">
                          Live Project Refinements & Change Orders (VO)
                        </h3>
                        <p className="text-[11px] text-[#2B4560]/70">
                          Submit design additions or upgrades as construction progresses with instant cost & timeline impact
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setChangeOrderModalOpen(true)}
                      className="px-3.5 py-1.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C8A24A]" />
                      <span>Request Refinement</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {changeOrders.map(co => (
                      <div key={co.id} className="p-4 rounded-2xl bg-[#F4F1EA]/40 border border-[#2B4560]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-gray-200 text-[#0B1B2B] font-bold">
                              {co.category}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              co.status === 'Approved_Escrow_Locked' ? 'bg-[#1E9E6A]/20 text-[#1E9E6A]' : 'bg-[#FF6B2C]/20 text-[#FF6B2C]'
                            }`}>
                              {co.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <h4 className="font-bold text-[#0B1B2B]">{co.title}</h4>
                          <p className="text-[11px] text-[#2B4560]/80">{co.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-extrabold text-[#0B1B2B] block">
                            +{api.formatMoney(co.costImpactKes * 100, currency)}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            +{co.timeImpactDays} Days Schedule Delta
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: IoT Telemetry & Live Site Feed */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* IoT Concrete Curing & Structural Sensor Card */}
                <div className="bg-[#0B1B2B] text-white rounded-3xl p-6 border border-[#2B4560]/40 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                      <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-white">
                        IoT Site Telemetry
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[#1E9E6A] font-bold">
                      ● LIVE SENSORS SYNCED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                        <Thermometer className="w-3.5 h-3.5 text-[#FF6B2C]" />
                        <span>Hydration Temp</span>
                      </div>
                      <div className="font-mono font-bold text-base text-white">34.2 °C</div>
                      <span className="text-[9px] text-[#1E9E6A] font-mono">Nominal Heat of Hydration</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                        <Droplets className="w-3.5 h-3.5 text-[#00E5FF]" />
                        <span>Curing Enclosure</span>
                      </div>
                      <div className="font-mono font-bold text-base text-white">88 % RH</div>
                      <span className="text-[9px] text-[#1E9E6A] font-mono">Optimal Moisture Retained</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                        <Activity className="w-3.5 h-3.5 text-[#C8A24A]" />
                        <span>MEMS Tiltmeter</span>
                      </div>
                      <div className="font-mono font-bold text-base text-white">0.02 °</div>
                      <span className="text-[9px] text-[#1E9E6A] font-mono">Zero Ground Settlement</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E6A]" />
                        <span>Concrete Slump</span>
                      </div>
                      <div className="font-mono font-bold text-base text-white">75 mm</div>
                      <span className="text-[9px] text-gray-300 font-mono">BS 1881-102 Compliant</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const el = document.getElementById('iot-telemetry-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2 bg-[#1F6FEB] hover:bg-[#1250b8] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>View Live Sensor Charts</span>
                    </button>
                    <Link
                      to="/instagram"
                      className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Open Live Site Camera Feed</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C8A24A]" />
                    </Link>
                  </div>
                </div>

                {/* Quick Link to CAD Blueprints */}
                <div className="bg-white rounded-3xl p-6 border border-[#2B4560]/15 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B1B2B]">
                    Architectural CAD BIM Engine
                  </h4>
                  <p className="text-xs text-[#2B4560]/75">
                    View structural engineering foundation layers, beam schedules, and MEP conduit pathways in the interactive viewer.
                  </p>
                  <Link
                    to="/blueprint"
                    className="w-full py-2 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Launch Blueprint Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C8A24A]" />
                  </Link>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            ROLE VIEW 2: CONTRACTOR (NCA) WORKSPACE
           ======================================================== */}
        {activeRole === 'contractor' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Daily Site Diary & Attendance */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#2B4560]/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-[#2B4560]/10">
                  <div>
                    <h3 className="font-bold text-sm text-[#0B1B2B]">
                      Daily Site Mobilization & Fundi Crew Muster Roll
                    </h3>
                    <p className="text-xs text-[#2B4560]/70">
                      Karen Villa Site · Apex Build General Contractors (NCA 4)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1E9E6A]/20 text-[#1E9E6A] font-mono text-xs font-bold">
                    18 Workers Clocked In Today
                  </span>
                </div>

                {/* Attendance list */}
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Mwangi Njoroge', trade: 'Master Mason (NITA Grade I)', time: '07:30 AM', wage: 2500, paid: true },
                    { name: 'Otieno James', trade: 'Steel Fixer (Fundi Chuma)', time: '07:35 AM', wage: 2800, paid: true },
                    { name: 'Kiprono Cheruiyot', trade: 'Concrete Spreader & Vibro', time: '07:40 AM', wage: 1800, paid: false },
                    { name: 'Wanjiku Kamau', trade: 'Materials Storekeeper', time: '07:20 AM', wage: 2000, paid: true }
                  ].map((w, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#F4F1EA]/50 border border-[#2B4560]/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#0B1B2B] block">{w.name}</span>
                        <span className="text-[11px] text-[#2B4560]/70">{w.trade} · Clocked {w.time}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#0B1B2B] block">
                          {api.formatMoney(w.wage * 100, currency)}
                        </span>
                        <span className={`text-[10px] font-mono ${w.paid ? 'text-[#1E9E6A] font-bold' : 'text-gray-400'}`}>
                          {w.paid ? 'Paid via M-Pesa' : 'Pending Shift Sign-off'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contractor Payout Claim Tracker */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#2B4560]/15 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-[#0B1B2B]">
                  Contractor Escrow Payout Rail
                </h3>
                <div className="p-4 rounded-2xl bg-gray-50 border space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contractor Share (85%):</span>
                    <strong className="text-[#0B1B2B]">{api.formatMoney(272000000, currency)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fundi Labour Pool (10%):</span>
                    <strong className="text-[#0B1B2B]">{api.formatMoney(32000000, currency)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Defect Retention (5%):</span>
                    <strong className="text-[#C8A24A]">{api.formatMoney(16000000, currency)}</strong>
                  </div>
                  <div className="pt-2 border-t flex justify-between font-bold text-sm text-[#0B1B2B]">
                    <span>Tranche Total:</span>
                    <span>{api.formatMoney(320000000, currency)}</span>
                  </div>
                </div>

                <Link
                  to="/app/projects/proj-karen-villa"
                  className="w-full py-2.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#C8A24A]" />
                  <span>Submit Milestone Completion Proof</span>
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            ROLE VIEW 3: CLERK OF WORKS / VERIFIER INSPECTION QUEUE
           ======================================================== */}
        {activeRole === 'verifier' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2B4560]/15 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-[#2B4560]/10">
                <div>
                  <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase">
                    INDEPENDENT CLERK OF WORKS INSPECTION DESK
                  </span>
                  <h3 className="font-display font-bold text-xl text-[#0B1B2B] mt-0.5">
                    Statutory Construction Audit Queue
                  </h3>
                  <p className="text-xs text-[#2B4560]/75 mt-1">
                    BORAQS Registered Architect / EBK Professional Engineer statutory checklist
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#1E9E6A] block">
                    Inspector: Eng. Kelvin Ochieng, PE (EBK M.2891)
                  </span>
                  <span className="text-[10px] text-gray-500">NCA Certified Structural Verifier</span>
                </div>
              </div>

              {/* Inspection items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: 'rebar-cover',
                    title: 'Concrete Cover Blocks (25mm)',
                    code: 'BS 8110-1:1997 Cl 3.3',
                    desc: 'Precast mortar spacer blocks positioned under beam cages to prevent reinforcement corrosion exposure.'
                  },
                  {
                    key: 'slump-test',
                    title: 'Concrete Slump Cone Test (75mm)',
                    code: 'BS 1881: Part 102',
                    desc: 'True slump checked on Class 25 ready-mix batch before pouring into column shutters.'
                  },
                  {
                    key: 'cube-crush',
                    title: '28-Day Compressive Strength Test (25 N/mm²)',
                    code: 'BS EN 12390-3',
                    desc: 'Crushing strength certification by accredited laboratory for superstructure structural columns.'
                  },
                  {
                    key: 'dpc-membrane',
                    title: 'Damp Proof Course (DPC) & Bituminous Felt',
                    code: 'KS 02-138 Standard',
                    desc: 'Continuous barrier laid along plinth beam masonry joints to inhibit moisture capillary action.'
                  }
                ].map(item => {
                  const isChecked = verifiedInspections[item.key];
                  return (
                    <div key={item.key} className="p-4 rounded-2xl bg-[#F4F1EA]/40 border border-[#2B4560]/10 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-[#0B1B2B]">{item.title}</h4>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white text-[#1F6FEB] font-bold shrink-0">
                            {item.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#2B4560]/80 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#2B4560]/10 flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold ${isChecked ? 'text-[#1E9E6A]' : 'text-[#FF6B2C]'}`}>
                          {isChecked ? '✓ Signed Off & Certified' : '⚠ Lab Crush Pending (Day 28)'}
                        </span>

                        <button
                          type="button"
                          onClick={() => setVerifiedInspections(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            isChecked ? 'bg-[#1E9E6A] text-white' : 'bg-[#0B1B2B] text-white hover:bg-[#1F6FEB]'
                          }`}
                        >
                          {isChecked ? 'Revoke' : 'Sign Off'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ROLE VIEW 4: SUPPLIER & PLANT HIRE OPERATOR
           ======================================================== */}
        {activeRole === 'supplier' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Active Leased Equipment */}
              <div className="bg-white rounded-3xl p-6 border border-[#2B4560]/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-[#2B4560]/10">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#FF6B2C]" />
                    <h3 className="font-bold text-sm text-[#0B1B2B]">
                      Active Equipment Leased On Site
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1E9E6A]">2 Units Deployed</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#F4F1EA]/60 border border-[#2B4560]/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0B1B2B] block">Winget 400L Diesel Mixer</span>
                      <span className="text-[11px] text-[#2B4560]/70">Karen Plot LR 330/512 · Day 4 of 7</span>
                    </div>
                    <span className="font-mono font-bold text-[#1E9E6A]">KES 18,000 in Escrow</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F1EA]/60 border border-[#2B4560]/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0B1B2B] block">Cuplock Scaffolding (100 Frames)</span>
                      <span className="text-[11px] text-[#2B4560]/70">Karen Plot LR 330/512 · Week 2 of 4</span>
                    </div>
                    <span className="font-mono font-bold text-[#1E9E6A]">KES 45,600 in Escrow</span>
                  </div>
                </div>
              </div>

              {/* Material Delivery Dockets */}
              <div className="bg-white rounded-3xl p-6 border border-[#2B4560]/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-[#2B4560]/10">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#1E9E6A]" />
                    <h3 className="font-bold text-sm text-[#0B1B2B]">
                      Recent Material Dispatch Receipts
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1F6FEB]">Weighbridge Verified</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#F4F1EA]/60 border border-[#2B4560]/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0B1B2B] block">50 Bags Bamburi Powerplus 42.5N</span>
                      <span className="text-[11px] text-[#2B4560]/70">Delivery Docket #BMB-9921 · Delivered</span>
                    </div>
                    <span className="font-mono font-bold text-[#0B1B2B]">KES 44,500 Paid</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F1EA]/60 border border-[#2B4560]/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0B1B2B] block">20 Tonnes Naivasha River Sand</span>
                      <span className="text-[11px] text-[#2B4560]/70">Weighbridge Docket #WB-4819 · Verified</span>
                    </div>
                    <span className="font-mono font-bold text-[#0B1B2B]">KES 34,000 Paid</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            PROJECT HEALTH CHART & COMPLIANCE SECTION
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ProjectHealthChart projects={projects} />
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#2B4560]/15 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-[#1F6FEB] font-bold uppercase">
                STATUTORY COMPLIANCE INSPECTOR
              </span>
              <h3 className="font-bold text-base text-[#0B1B2B]">
                Agency Permit Status
              </h3>
              <p className="text-xs text-[#2B4560]/75 leading-relaxed">
                Nairobi City County building approval, NEMA environmental impact assessment (EIA), and NCA 0.5% construction levy are in order.
              </p>
            </div>

            <div className="pt-4 border-t border-[#2B4560]/10">
              <button
                onClick={() => setComplianceModalProject(primaryProject)}
                className="w-full py-2.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-[#C8A24A]" />
                <span>Open Full Compliance Checklist</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            REAL-TIME IOT SITE HEALTH & STRUCTURAL SENSORS
           ======================================================== */}
        <div id="iot-telemetry-section" className="space-y-4">
          <IoTHealth project={primaryProject} currency={currency} />
        </div>

      </div>

      {/* ========================================================
          MODAL: REQUEST MID-CONSTRUCTION REFINEMENT / CHANGE ORDER
         ======================================================== */}
      {changeOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#2B4560]/20 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#1F6FEB] font-bold uppercase">
                  CHANGE ORDER & SPECIFICATION REFINEMENT
                </span>
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Propose Design Variation Order (VO)
                </h3>
              </div>
              <button 
                onClick={() => setChangeOrderModalOpen(false)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0B1B2B] block mb-1">
                  Variation Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Add Motorized Pergola over Swimming Pool Deck"
                  value={newCoTitle}
                  onChange={(e) => setNewCoTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B1B2B] block mb-1">
                  Specification Details & Material Changes:
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe exact materials, finishes, or electrical work required..."
                  value={newCoDesc}
                  onChange={(e) => setNewCoDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0B1B2B] block mb-1">
                    Estimated Cost Delta (KES):
                  </label>
                  <input
                    type="number"
                    value={newCoCostKes}
                    onChange={(e) => setNewCoCostKes(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B1B2B] block mb-1">
                    Schedule Extension (Days):
                  </label>
                  <input
                    type="number"
                    value={newCoDays}
                    onChange={(e) => setNewCoDays(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-[#2B4560]/20 bg-[#F4F1EA]/50"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F4F1EA] rounded-xl text-xs text-[#2B4560] leading-relaxed">
              Upon submission, this refinement order will be audited by the Clerk of Works and NCA Contractor before adjustment of escrow milestone funds.
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setChangeOrderModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-[#2B4560] border rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateChangeOrder}
                className="flex-1 py-2 text-xs font-bold text-white bg-[#0B1B2B] hover:bg-[#1F6FEB] rounded-lg shadow-sm cursor-pointer"
              >
                Submit Variation Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Compliance Checklist Modal */}
      {complianceModalProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setComplianceModalProject(null)}
        >
          <div 
            className="bg-[#F4F1EA] rounded-3xl shadow-2xl border border-[#2B4560]/20 max-w-5xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-left relative my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#2B4560]/15 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase">
                  PROJECT COMPLIANCE INSPECTOR · {complianceModalProject.id.toUpperCase()}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0B1B2B] mt-0.5">
                  {complianceModalProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setComplianceModalProject(null)}
                className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-black/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ComplianceChecklist 
              project={complianceModalProject}
              onProjectUpdated={loadProjects}
            />

            <div className="pt-3 border-t border-[#2B4560]/15 flex justify-end">
              <button
                type="button"
                onClick={() => setComplianceModalProject(null)}
                className="px-4 py-2 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
