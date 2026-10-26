import { 
  Project, 
  Milestone, 
  MarketplaceEntity, 
  EscrowTransaction, 
  SiteLogEntry, 
  AttendanceRecord, 
  VariationOrder, 
  ComplianceItem,
  UserRole,
  KnowledgeBaseData,
  FeeScheduleItem,
  CementItem,
  AggregateWallingItem,
  MachineryRateItem
} from '../types';
import { 
  SEED_PROJECTS, 
  SEED_MARKETPLACE_ENTITIES, 
  SEED_ESCROW_TRANSACTIONS, 
  SEED_SITE_LOGS, 
  SEED_ATTENDANCE 
} from '../data/seedData';
import { INITIAL_KNOWLEDGE_BASE } from '../data/knowledgeBaseData';

const STORAGE_KEYS = {
  PROJECTS: 'fundi_projects_v1',
  TRANSACTIONS: 'fundi_txns_v1',
  SITE_LOGS: 'fundi_site_logs_v1',
  ATTENDANCE: 'fundi_attendance_v1',
  ACTIVE_ROLE: 'fundi_active_role_v1',
  ACTIVE_CURRENCY: 'fundi_active_currency_v1',
  KNOWLEDGE_BASE: 'fundi_kb_v1'
};

class FundiApiAdapter {
  private projects: Project[] = [];
  private transactions: EscrowTransaction[] = [];
  private siteLogs: SiteLogEntry[] = [];
  private attendance: AttendanceRecord[] = [];
  private knowledgeBase: KnowledgeBaseData = INITIAL_KNOWLEDGE_BASE;
  private activeRole: UserRole = 'owner';
  private activeCurrency: 'KES' | 'USD' = 'KES';

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        const parsed = JSON.parse(storedProjects);
        SEED_PROJECTS.forEach(sp => {
          const existing = parsed.find((p: any) => p.id === sp.id);
          if (!existing) {
            parsed.push(sp);
          } else if ((!existing.milestones || existing.milestones.length === 0) && sp.milestones.length > 0) {
            existing.milestones = sp.milestones;
            existing.blueprintLayers = sp.blueprintLayers;
            existing.budgetCategories = sp.budgetCategories;
            existing.complianceItems = sp.complianceItems;
          }
        });
        this.projects = parsed;
      } else {
        this.projects = JSON.parse(JSON.stringify(SEED_PROJECTS));
      }

      const storedTxns = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      this.transactions = storedTxns ? JSON.parse(storedTxns) : JSON.parse(JSON.stringify(SEED_ESCROW_TRANSACTIONS));

      const storedLogs = localStorage.getItem(STORAGE_KEYS.SITE_LOGS);
      this.siteLogs = storedLogs ? JSON.parse(storedLogs) : JSON.parse(JSON.stringify(SEED_SITE_LOGS));

      const storedAttendance = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      this.attendance = storedAttendance ? JSON.parse(storedAttendance) : JSON.parse(JSON.stringify(SEED_ATTENDANCE));

      const storedKb = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BASE);
      this.knowledgeBase = storedKb ? JSON.parse(storedKb) : JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_BASE));

      const storedRole = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
      if (storedRole) this.activeRole = storedRole as UserRole;

      const storedCurrency = localStorage.getItem(STORAGE_KEYS.ACTIVE_CURRENCY);
      if (storedCurrency) this.activeCurrency = storedCurrency as 'KES' | 'USD';
    } catch {
      this.projects = JSON.parse(JSON.stringify(SEED_PROJECTS));
      this.transactions = JSON.parse(JSON.stringify(SEED_ESCROW_TRANSACTIONS));
      this.siteLogs = JSON.parse(JSON.stringify(SEED_SITE_LOGS));
      this.attendance = JSON.parse(JSON.stringify(SEED_ATTENDANCE));
      this.knowledgeBase = JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_BASE));
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEYS.SITE_LOGS, JSON.stringify(this.siteLogs));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(this.attendance));
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASE, JSON.stringify(this.knowledgeBase));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, this.activeRole);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CURRENCY, this.activeCurrency);
    } catch (e) {
      console.warn('Storage persistence warning:', e);
    }
  }

  // --- Auth & Role Simulation ---
  public getActiveRole(): UserRole {
    return this.activeRole;
  }

  public setActiveRole(role: UserRole) {
    this.activeRole = role;
    this.persist();
  }

  public getCurrency(): 'KES' | 'USD' {
    return this.activeCurrency;
  }

  public setCurrency(currency: 'KES' | 'USD') {
    this.activeCurrency = currency;
    this.persist();
  }

  // Currency Converter: 1 USD = 130 KES
  public formatMoney(amountMinor: number, currencyOverride?: 'KES' | 'USD'): string {
    const cur = currencyOverride || this.activeCurrency;
    if (cur === 'USD') {
      const usdValue = (amountMinor / 100) / 130;
      return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    const kesValue = amountMinor / 100;
    return `KES ${kesValue.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  // --- Projects ---
  public async getProjects(): Promise<Project[]> {
    return Promise.resolve(this.projects);
  }

  public async getProjectById(id: string): Promise<Project | undefined> {
    const proj = this.projects.find(p => p.id === id);
    return Promise.resolve(proj ? JSON.parse(JSON.stringify(proj)) : undefined);
  }

  public async createProject(newProj: Partial<Project>): Promise<Project> {
    const defaultTemplate = SEED_PROJECTS[0];
    const created: Project = {
      ...defaultTemplate,
      id: `proj-${Date.now()}`,
      title: newProj.title || 'New Construction Project',
      buildingType: newProj.buildingType || 'Mansion or villa',
      worksType: newProj.worksType || 'New build',
      county: newProj.county || 'Nairobi',
      ward: newProj.ward || 'Central',
      plotSize: newProj.plotSize || '0.25 Acre',
      sizeSqm: newProj.sizeSqm || 240,
      floors: newProj.floors || 2,
      finishLevel: newProj.finishLevel || 'standard',
      budgetBaselineMinor: newProj.budgetBaselineMinor || 1800000000,
      contingencyMinor: Math.round((newProj.budgetBaselineMinor || 1800000000) * 0.1),
      currency: 'KES',
      stage: '1 Brief and feasibility',
      overallProgressPct: 5,
      escrowHeldMinor: 0,
      escrowReleasedMinor: 0,
      complianceScorePct: 15,
      imageThumbnail: '/src/assets/images/project_karen_villa_1792155227975.jpg'
    };
    this.projects.unshift(created);
    this.persist();
    return Promise.resolve(created);
  }

  // --- Escrow & Milestone State Machine ---
  public async fundMilestoneViaMpesa(projectId: string, milestoneId: string, phone: string): Promise<{ success: boolean; message: string }> {
    const proj = this.projects.find(p => p.id === projectId);
    if (!proj) throw new Error('Project not found');
    const milestone = proj.milestones.find(m => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    // State transition to Funded
    milestone.state = 'Funded';
    proj.escrowHeldMinor += milestone.amountMinor;

    const txn: EscrowTransaction = {
      id: `txn-mpesa-${Date.now()}`,
      projectId,
      milestoneId,
      type: 'Funding_Deposit',
      amountMinor: milestone.amountMinor,
      currency: 'KES',
      status: 'Completed',
      rail: 'M-Pesa',
      reference: `MPESA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      idempotencyKey: `idemp-fund-${milestoneId}-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EAT',
      payeeName: `FUNDI Custody Vault (M-Pesa STK Push from ${phone})`
    };
    this.transactions.unshift(txn);
    this.persist();
    return Promise.resolve({ 
      success: true, 
      message: `M-Pesa STK push completed. ${this.formatMoney(milestone.amountMinor, 'KES')} locked in ironclad escrow vault.` 
    });
  }

  public async submitMilestoneEvidence(
    projectId: string, 
    milestoneId: string, 
    description: string, 
    photoUrl?: string
  ): Promise<Milestone> {
    const proj = this.projects.find(p => p.id === projectId);
    if (!proj) throw new Error('Project not found');
    const milestone = proj.milestones.find(m => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    milestone.state = 'EvidenceSubmitted';
    if (!milestone.submittedEvidence) milestone.submittedEvidence = [];
    milestone.submittedEvidence.push({
      id: `ev-${Date.now()}`,
      photoUrl: photoUrl || '/src/assets/images/site_inspection_foundation_1792155229622.jpg',
      description,
      geoCoordinates: '-1.3214° S, 36.7118° E',
      timestamp: new Date().toLocaleString(),
      submittedBy: 'Apex Build Site Supervisor'
    });

    this.persist();
    return Promise.resolve(milestone);
  }

  public async approveAndReleaseMilestone(projectId: string, milestoneId: string): Promise<{ success: boolean; message: string }> {
    const proj = this.projects.find(p => p.id === projectId);
    if (!proj) throw new Error('Project not found');
    const milestone = proj.milestones.find(m => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    milestone.state = 'Released';
    proj.escrowHeldMinor = Math.max(0, proj.escrowHeldMinor - milestone.amountMinor);
    proj.escrowReleasedMinor += milestone.amountMinor;
    proj.overallProgressPct = Math.min(100, proj.overallProgressPct + 20);

    // Record release transaction
    const releaseTxn: EscrowTransaction = {
      id: `txn-rel-${Date.now()}`,
      projectId,
      milestoneId,
      type: 'Milestone_Release',
      amountMinor: milestone.amountMinor,
      currency: 'KES',
      status: 'Completed',
      rail: 'RTGS_Bank',
      reference: `REL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      idempotencyKey: `idemp-rel-${milestoneId}-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EAT',
      payeeName: `${proj.activeContractorName} (Payout split executed: contractor 85%, labour 10%, retention 5%)`
    };
    this.transactions.unshift(releaseTxn);
    this.persist();
    return Promise.resolve({
      success: true,
      message: `Milestone approved! ${this.formatMoney(milestone.amountMinor)} released with retention held in vault.`
    });
  }

  public async raiseDispute(projectId: string, milestoneId: string, reason: string): Promise<Milestone> {
    const proj = this.projects.find(p => p.id === projectId);
    if (!proj) throw new Error('Project not found');
    const milestone = proj.milestones.find(m => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    milestone.state = 'Disputed';
    const disputeTxn: EscrowTransaction = {
      id: `txn-disp-${Date.now()}`,
      projectId,
      milestoneId,
      type: 'Dispute_Freeze',
      amountMinor: milestone.amountMinor,
      currency: 'KES',
      status: 'Completed',
      rail: 'RTGS_Bank',
      reference: `DISP-FREEZE-${milestoneId}`,
      idempotencyKey: `idemp-disp-${milestoneId}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EAT',
      payeeName: `Dispute Resolution Hold: ${reason}`
    };
    this.transactions.unshift(disputeTxn);
    this.persist();
    return Promise.resolve(milestone);
  }

  // --- Variations ---
  public async addVariation(projectId: string, variation: Omit<VariationOrder, 'id' | 'orderNumber' | 'dateSubmitted' | 'state'>): Promise<VariationOrder> {
    const proj = this.projects.find(p => p.id === projectId);
    if (!proj) throw new Error('Project not found');

    const newVar: VariationOrder = {
      ...variation,
      id: `var-${Date.now()}`,
      orderNumber: `VO-0${proj.variations.length + 1}`,
      dateSubmitted: new Date().toISOString().split('T')[0],
      state: 'OwnerApproved'
    };
    proj.variations.unshift(newVar);
    this.persist();
    return Promise.resolve(newVar);
  }

  // --- Compliance ---
  public async toggleComplianceItem(projectId: string, itemId: string): Promise<ComplianceItem> {
    const proj = this.projects.find(p => p.id === projectId);
    if (!proj) throw new Error('Project not found');
    const item = proj.complianceItems.find(c => c.id === itemId);
    if (!item) throw new Error('Item not found');

    item.status = item.status === 'Verified' ? 'Pending' : 'Verified';
    if (item.status === 'Verified') {
      item.verifiedAt = new Date().toISOString().split('T')[0];
      item.verifiedBy = 'QS Brian Mwangi (Verifier)';
    }

    const verifiedCount = proj.complianceItems.filter(c => c.status === 'Verified').length;
    proj.complianceScorePct = Math.round((verifiedCount / proj.complianceItems.length) * 100);

    this.persist();
    return Promise.resolve(item);
  }

  // --- Site Logs & Attendance ---
  public async getSiteLogs(projectId: string): Promise<SiteLogEntry[]> {
    return Promise.resolve(this.siteLogs.filter(l => l.projectId === projectId));
  }

  public async addSiteLog(projectId: string, entry: Omit<SiteLogEntry, 'id'>): Promise<SiteLogEntry> {
    const created: SiteLogEntry = {
      ...entry,
      id: `log-${Date.now()}`
    };
    this.siteLogs.unshift(created);
    this.persist();
    return Promise.resolve(created);
  }

  public async getAttendance(projectId: string): Promise<AttendanceRecord[]> {
    return Promise.resolve(this.attendance);
  }

  public async markAttendancePayout(workerId: string): Promise<AttendanceRecord> {
    const rec = this.attendance.find(a => a.workerId === workerId);
    if (!rec) throw new Error('Worker record not found');
    rec.payoutStatus = 'Paid_MPesa';
    this.persist();
    return Promise.resolve(rec);
  }

  // --- Transactions ---
  public async getTransactions(projectId?: string): Promise<EscrowTransaction[]> {
    if (projectId) {
      return Promise.resolve(this.transactions.filter(t => t.projectId === projectId));
    }
    return Promise.resolve(this.transactions);
  }

  // --- Marketplace ---
  public async getMarketplaceEntities(category?: string, query?: string): Promise<MarketplaceEntity[]> {
    let list = SEED_MARKETPLACE_ENTITIES;
    if (category && category !== 'all') {
      list = list.filter(e => e.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.subtitle.toLowerCase().includes(q) ||
        e.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    return Promise.resolve(list);
  }

  // --- Knowledge Base Methods ---
  public async getKnowledgeBase(): Promise<KnowledgeBaseData> {
    return Promise.resolve(this.knowledgeBase);
  }

  public async verifyKbRecord(
    section: 'agencies' | 'documentChecklist' | 'feeSeeds' | 'costPerSqmSeeds' | 'cement' | 'aggregatesAndWalling' | 'machinery' | 'sectorPacks',
    id: string,
    newConfidence: 'medium' | 'high' = 'high',
    verifiedBy: string = 'audit@fundi.build'
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    if (section === 'documentChecklist') {
      const item = this.knowledgeBase.documentChecklist.find(d => d.id === id);
      if (item) {
        item.confidence = newConfidence;
        item.lastVerifiedAt = today;
        item.verifiedBy = verifiedBy;
      }
    } else if (section === 'feeSeeds') {
      const item = this.knowledgeBase.feeSeeds.find(f => f.id === id);
      if (item) {
        item.confidence = newConfidence;
        item.lastVerifiedAt = today;
        item.verifiedBy = verifiedBy;
      }
    } else if (section === 'costPerSqmSeeds') {
      const item = this.knowledgeBase.costPerSqmSeeds.find(c => c.id === id);
      if (item) {
        item.confidence = newConfidence;
        item.lastVerifiedAt = today;
        item.verifiedBy = verifiedBy;
      }
    } else if (section === 'cement') {
      const item = this.knowledgeBase.cement.find(c => c.id === id);
      if (item) {
        item.confidence = newConfidence;
        item.lastVerifiedAt = today;
        item.verifiedBy = verifiedBy;
      }
    } else if (section === 'aggregatesAndWalling') {
      const item = this.knowledgeBase.aggregatesAndWalling.find(a => a.id === id);
      if (item) {
        item.confidence = newConfidence;
        item.lastVerifiedAt = today;
        item.verifiedBy = verifiedBy;
      }
    } else if (section === 'machinery') {
      const item = this.knowledgeBase.machinery.find(m => m.id === id);
      if (item) {
        item.confidence = newConfidence;
        item.lastVerifiedAt = today;
        item.verifiedBy = verifiedBy;
      }
    } else if (section === 'sectorPacks') {
      const item = this.knowledgeBase.sectorPacks.find(s => s.id === id);
      if (item) {
        item.confidence = newConfidence;
        item.lastVerifiedAt = today;
        item.verifiedBy = verifiedBy;
      }
    }

    this.persist();
    return Promise.resolve();
  }

  public async updateFeeScheduleItem(id: string, updates: Partial<FeeScheduleItem>): Promise<void> {
    const idx = this.knowledgeBase.feeSeeds.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.knowledgeBase.feeSeeds[idx] = { ...this.knowledgeBase.feeSeeds[idx], ...updates };
      this.persist();
    }
    return Promise.resolve();
  }

  public async updateMaterialItem(category: 'cement' | 'aggregates', id: string, updates: any): Promise<void> {
    if (category === 'cement') {
      const idx = this.knowledgeBase.cement.findIndex(c => c.id === id);
      if (idx !== -1) {
        this.knowledgeBase.cement[idx] = { ...this.knowledgeBase.cement[idx], ...updates };
        this.persist();
      }
    } else {
      const idx = this.knowledgeBase.aggregatesAndWalling.findIndex(a => a.id === id);
      if (idx !== -1) {
        this.knowledgeBase.aggregatesAndWalling[idx] = { ...this.knowledgeBase.aggregatesAndWalling[idx], ...updates };
        this.persist();
      }
    }
    return Promise.resolve();
  }

  public async updateMachineryItem(id: string, updates: Partial<MachineryRateItem>): Promise<void> {
    const idx = this.knowledgeBase.machinery.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.knowledgeBase.machinery[idx] = { ...this.knowledgeBase.machinery[idx], ...updates };
      this.persist();
    }
    return Promise.resolve();
  }

  // Steel unit weight formula: d^2 / 162 kg/m per BS 4449
  public calculateSteelWeight(diameterMm: number, lengthM: number = 12): { kgPerMetre: number; totalWeightKg: number } {
    const kgPerMetre = Number(((diameterMm * diameterMm) / 162).toFixed(3));
    const totalWeightKg = Number((kgPerMetre * lengthM).toFixed(2));
    return { kgPerMetre, totalWeightKg };
  }

  // Statutory NCA Levy formula: 0.5% on construction contract value exceeding KES 5,000,000
  public calculateNcaLevy(projectValueKes: number): { levyKes: number; rate: number; isApplicable: boolean; rule: string } {
    const THRESHOLD = 5000000;
    if (projectValueKes <= THRESHOLD) {
      return {
        levyKes: 0,
        rate: 0,
        isApplicable: false,
        rule: 'Contracts of KES 5,000,000 or below are exempt from the 0.5% NCA construction levy.'
      };
    }
    const levyKes = Math.round(projectValueKes * 0.005);
    return {
      levyKes,
      rate: 0.005,
      isApplicable: true,
      rule: '0.5% of total contract value applies for projects above KES 5,000,000 (NCA Act Cap 449A / Legal Notice).'
    };
  }

  // --- Reset to seed ---
  public resetToSeed() {
    this.projects = JSON.parse(JSON.stringify(SEED_PROJECTS));
    this.transactions = JSON.parse(JSON.stringify(SEED_ESCROW_TRANSACTIONS));
    this.siteLogs = JSON.parse(JSON.stringify(SEED_SITE_LOGS));
    this.attendance = JSON.parse(JSON.stringify(SEED_ATTENDANCE));
    this.knowledgeBase = JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_BASE));
    this.persist();
  }
}

export const api = new FundiApiAdapter();
