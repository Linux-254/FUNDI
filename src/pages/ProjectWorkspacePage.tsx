import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, UserRole } from '../types';
import { api } from '../lib/api';
import { TOCNavigation } from '../components/common/TOCNavigation';
import { ProjectBlueprint } from '../components/blueprint/ProjectBlueprint';
import { EscrowVault } from '../components/escrow/EscrowVault';
import { BudgetGuard } from '../components/budget/BudgetGuard';
import { ComplianceEngine } from '../components/compliance/ComplianceEngine';
import { ComplianceChecklist } from '../components/compliance/ComplianceChecklist';
import { SiteLogAttendance } from '../components/site/SiteLogAttendance';
import { InstantEstimator } from '../components/estimator/InstantEstimator';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Share2, 
  FileText,
  AlertTriangle,
  Users,
  Briefcase
} from 'lucide-react';

interface ProjectWorkspacePageProps {
  currency: 'KES' | 'USD';
  currentUserRole: UserRole;
}

export const ProjectWorkspacePage: React.FC<ProjectWorkspacePageProps> = ({
  currency,
  currentUserRole
}) => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const loadProject = async () => {
    const projId = id || 'proj-karen-villa';
    const found = await api.getProjectById(projId);
    if (found) {
      setProject(found);
    } else {
      const all = await api.getProjects();
      setProject(all[0]);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#1F6FEB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#2B4560]">Loading project workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Project Header Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#2B4560]/15 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2B4560]/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F6FEB]">
                  PROJECT ID: {project.id.toUpperCase()}
                </span>
                <span className="text-xs text-[#2B4560]/40">·</span>
                <span className="text-xs font-medium text-[#2B4560] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  <span>{project.ward}, {project.county} County ({project.plotSize})</span>
                </span>
                <span className="text-xs text-[#2B4560]/40">·</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#C8A24A]/20 text-[#0B1B2B]">
                  {project.finishLevel.toUpperCase()} SPECIFICATION
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1B2B]">
                {project.title}
              </h1>

              <p className="text-xs text-[#2B4560]/80 mt-1">
                Owner: <strong className="text-[#0B1B2B]">{project.ownerName}</strong> · Lead Contractor: <strong>{project.activeContractorName}</strong>
              </p>
            </div>

            {/* Quick Summary Pill Badges */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="p-3 bg-[#F4F1EA] rounded-xl border border-[#2B4560]/10 text-right">
                <span className="text-[10px] text-[#2B4560]/60 uppercase font-semibold block">Total Baseline</span>
                <span className="font-display font-bold text-sm sm:text-base text-[#0B1B2B]">
                  {api.formatMoney(project.budgetBaselineMinor, currency)}
                </span>
              </div>
              <div className="p-3 bg-[#F4F1EA] rounded-xl border border-[#2B4560]/10 text-right">
                <span className="text-[10px] text-[#2B4560]/60 uppercase font-semibold block">Overall Progress</span>
                <span className="font-display font-bold text-sm sm:text-base text-[#1F6FEB]">
                  {project.overallProgressPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Context Breadcrumb */}
          <div className="pt-3 flex items-center justify-between text-xs text-[#2B4560]/80">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0B1B2B]">Active Stage:</span>
              <span>{project.stage}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[#1E9E6A] font-semibold">
                Compliance: {project.complianceScorePct}%
              </span>
              <span>·</span>
              <span className="font-mono text-[#C8A24A] font-semibold">
                Locked in Escrow: {api.formatMoney(project.escrowHeldMinor, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Layout: Word-style TOC on Left (Col-span-3), Dynamic Section on Right (Col-span-9) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Word-Style Table of Contents (TOC) */}
          <div className="lg:col-span-3 sticky top-20">
            <TOCNavigation
              activeSection={activeSection}
              onSelectSection={(secId) => {
                setActiveSection(secId);
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
            />

            {/* Impersonated Persona Notice */}
            <div className="mt-4 p-3 bg-white/60 rounded-xl border border-[#2B4560]/10 text-[11px] text-[#2B4560] space-y-1">
              <div className="font-semibold text-[#0B1B2B] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#1F6FEB]" />
                <span>Simulated Role: {currentUserRole.toUpperCase()}</span>
              </div>
              <p className="text-[#2B4560]/70">
                You can switch between Owner, Contractor, Expert, and Fundi personas from the top navigation bar at any time.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Section Views */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. Overview & Project Blueprint */}
            {(activeSection === 'overview' || activeSection === 'overview-blueprint' || activeSection === 'overview-kpi') && (
              <div className="space-y-6">
                <ProjectBlueprint layers={project.blueprintLayers} currency={currency} />

                {/* Progress & Milestone Overview Card */}
                <div className="bg-white rounded-xl p-5 shadow-xs border border-[#2B4560]/15 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2B4560]/10 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                        Contract Milestone Execution
                      </h3>
                      <p className="text-xs text-[#2B4560]/70">
                        {project.milestones.filter(m => m.state === 'Released').length} of {project.milestones.length} milestones released against verified evidence.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveSection('budget-escrow')}
                      className="text-xs font-semibold text-[#1F6FEB] hover:underline"
                    >
                      Open Escrow Vault →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {project.milestones.map((m) => (
                      <div 
                        key={m.id}
                        onClick={() => setActiveSection('budget-escrow')}
                        className="p-3 rounded-lg border border-[#2B4560]/15 bg-[#F4F1EA]/40 hover:bg-[#F4F1EA] transition-all cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-[#2B4560]/70">Phase {m.phaseOrder}</span>
                          <span className={`px-2 py-0.2 rounded font-mono font-bold ${
                            m.state === 'Released'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.state === 'EvidenceSubmitted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {m.state}
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-[#0B1B2B] truncate">{m.title}</h4>
                        <div className="font-mono font-bold text-xs text-[#0B1B2B]">
                          {api.formatMoney(m.amountMinor, currency)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Brief & Specifications */}
            {(activeSection === 'brief' || activeSection === 'brief-specs' || activeSection === 'brief-estimator') && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-xs border border-[#2B4560]/15 space-y-4">
                  <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                    Project Specifications & Architectural Brief
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="p-3 bg-[#F4F1EA] rounded-lg">
                      <span className="text-[#2B4560]/70 block font-sans">Plot Size</span>
                      <span className="font-bold text-[#0B1B2B]">{project.plotSize}</span>
                    </div>
                    <div className="p-3 bg-[#F4F1EA] rounded-lg">
                      <span className="text-[#2B4560]/70 block font-sans">Built-up Area</span>
                      <span className="font-bold text-[#0B1B2B]">{project.sizeSqm} m² ({Math.round(project.sizeSqm * 10.764)} sqft)</span>
                    </div>
                    <div className="p-3 bg-[#F4F1EA] rounded-lg">
                      <span className="text-[#2B4560]/70 block font-sans">Floors</span>
                      <span className="font-bold text-[#0B1B2B]">{project.floors} Storeys</span>
                    </div>
                    <div className="p-3 bg-[#F4F1EA] rounded-lg">
                      <span className="text-[#2B4560]/70 block font-sans">Finishes</span>
                      <span className="font-bold text-[#0B1B2B] capitalize">{project.finishLevel}</span>
                    </div>
                  </div>
                </div>

                <InstantEstimator currency={currency} />
              </div>
            )}

            {/* 3. Team & Assigned Roles */}
            {(activeSection === 'team' || activeSection.startsWith('team-')) && (
              <div className="bg-white rounded-xl p-6 shadow-xs border border-[#2B4560]/15 space-y-5">
                <div className="border-b border-[#2B4560]/10 pb-3">
                  <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                    Assigned Project Team & Registered Entities
                  </h3>
                  <p className="text-xs text-[#2B4560]/70">
                    All consultants and contractors have active practising licences on file with board confirmation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[#2B4560]/15 bg-[#F4F1EA]/30 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#1F6FEB]">General Contractor</span>
                    <h4 className="font-bold text-sm text-[#0B1B2B]">{project.activeContractorName}</h4>
                    <p className="text-xs text-[#2B4560]">NCA 1 Registered Building & Civil Works. Contractors All Risk insurance policy in force.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#2B4560]/15 bg-[#F4F1EA]/30 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#C8A24A]">Lead Architect</span>
                    <h4 className="font-bold text-sm text-[#0B1B2B]">{project.leadArchitectName}</h4>
                    <p className="text-xs text-[#2B4560]">Board of Registration of Architects and Quantity Surveyors (BORAQS) compliant architectural set.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#2B4560]/15 bg-[#F4F1EA]/30 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#1E9E6A]">Independent Verifier & QS</span>
                    <h4 className="font-bold text-sm text-[#0B1B2B]">{project.quantitySurveyorName}</h4>
                    <p className="text-xs text-[#2B4560]">Certifies milestone completion and site lab reports prior to each escrow disbursement.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#2B4560]/15 bg-[#F4F1EA]/30 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#FF6B2C]">Lead Mason & Gang</span>
                    <h4 className="font-bold text-sm text-[#0B1B2B]">Fundi Peter Maina (8-Member Masonry Crew)</h4>
                    <p className="text-xs text-[#2B4560]">Daily geo-attendance verified. Wage payouts disbursed weekly via M-Pesa B2C.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Approvals & Compliance */}
            {(activeSection === 'compliance' || activeSection.startsWith('compliance-')) && (
              <div className="space-y-6">
                <ComplianceChecklist project={project} onProjectUpdated={loadProject} />
                <ComplianceEngine project={project} onProjectUpdated={loadProject} />
              </div>
            )}

            {/* 8. Budget Guard & Escrow */}
            {(activeSection === 'budget-escrow' || activeSection.startsWith('budget-')) && (
              <div className="space-y-6">
                <BudgetGuard project={project} currency={currency} onProjectUpdated={loadProject} />
                <EscrowVault 
                  project={project} 
                  currency={currency} 
                  currentUserRole={currentUserRole} 
                  onProjectUpdated={loadProject} 
                />
              </div>
            )}

            {/* 9. Site Log & Attendance */}
            {(activeSection === 'site-log' || activeSection.startsWith('site-')) && (
              <SiteLogAttendance 
                project={project} 
                currency={currency} 
                currentUserRole={currentUserRole} 
                onProjectUpdated={loadProject} 
              />
            )}

            {/* 10. Documents Vault */}
            {activeSection === 'documents' && (
              <div className="bg-white rounded-xl p-6 shadow-xs border border-[#2B4560]/15 space-y-4">
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Encrypted Documents & Certificates Vault
                </h3>
                <p className="text-xs text-[#2B4560]/70">
                  Stored on private Cloudflare R2 storage with signed tamper-evident hashes.
                </p>

                <div className="space-y-2 text-xs">
                  {[
                    { name: 'NCA_Compliance_Certificate_2026.pdf', size: '2.4 MB', authority: 'NCA', date: '05 Mar 2026' },
                    { name: 'Nairobi_City_County_Building_Permit_B9881.pdf', size: '4.8 MB', authority: 'NCCG', date: '18 Feb 2026' },
                    { name: 'BORAQS_Stamped_Architectural_Set.dwg.pdf', size: '14.2 MB', authority: 'BORAQS', date: '04 Feb 2026' },
                    { name: 'Contractors_All_Risk_Jubilee_Insurance.pdf', size: '1.9 MB', authority: 'IRA', date: '10 Mar 2026' },
                    { name: 'Geotechnical_Basalt_Bedrock_Soil_Report.pdf', size: '6.1 MB', authority: 'Lab QA', date: '15 Jan 2026' }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-3 bg-[#F4F1EA] rounded-lg flex items-center justify-between border border-[#2B4560]/10">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#1F6FEB]" />
                        <div>
                          <span className="font-semibold text-[#0B1B2B]">{doc.name}</span>
                          <span className="text-[10px] text-[#2B4560]/60 block font-mono">
                            {doc.authority} · {doc.size} · Uploaded {doc.date}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#1F6FEB] font-semibold hover:underline cursor-pointer">
                        Download
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. Messages */}
            {activeSection === 'messages' && (
              <div className="bg-white rounded-xl p-6 shadow-xs border border-[#2B4560]/15 space-y-4">
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Project Coordination Messages
                </h3>
                <p className="text-xs text-[#2B4560]/70">
                  All discussions and site instructions logged with timestamp for transparency.
                </p>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#F4F1EA] border border-[#2B4560]/10 text-xs">
                    <div className="flex items-center justify-between font-semibold text-[#0B1B2B] mb-1">
                      <span>QS Brian Mwangi</span>
                      <span className="font-mono text-[10px] text-[#2B4560]/60">14 Oct 2026, 14:20 EAT</span>
                    </div>
                    <p className="text-[#2B4560]">
                      Inspected ground floor slab casting rebar spacing on site. Quality complies with drawing S-04. Ready for milestone review.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F4F1EA] border border-[#2B4560]/10 text-xs">
                    <div className="flex items-center justify-between font-semibold text-[#0B1B2B] mb-1">
                      <span>Eng. David Ochieng (EBK)</span>
                      <span className="font-mono text-[10px] text-[#2B4560]/60">12 Oct 2026, 09:45 EAT</span>
                    </div>
                    <p className="text-[#2B4560]">
                      7-day concrete crushing test report uploaded: 26.8 N/mm², which exceeds the Class 25 target.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 12. Disputes & Mediation */}
            {activeSection === 'disputes' && (
              <div className="bg-white rounded-xl p-6 shadow-xs border border-[#2B4560]/15 space-y-4">
                <div className="flex items-center gap-2 text-[#D64545]">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                    Structured Alternative Dispute Resolution (ADR)
                  </h3>
                </div>
                <p className="text-xs text-[#2B4560] leading-relaxed">
                  In case of disagreement on milestone criteria or quality, funds are frozen exclusively on the disputed tranche. An independent clerk of works or registered QS conducts an on-site physical inspection within 48 hours to issue an evidence-based binding resolution.
                </p>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1E9E6A] shrink-0" />
                  <span>Zero active disputes on this project. All released milestones were verified and settled amicably.</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
