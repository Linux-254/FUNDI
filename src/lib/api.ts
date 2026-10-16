import { 
  Project, 
  Milestone, 
  MarketplaceEntity, 
  EscrowTransaction, 
  SiteLogEntry, 
  AttendanceRecord, 
  VariationOrder, 
  ComplianceItem,
  UserRole
} from '../types';
import { 
  SEED_PROJECTS, 
  SEED_MARKETPLACE_ENTITIES, 
  SEED_ESCROW_TRANSACTIONS, 
  SEED_SITE_LOGS, 
  SEED_ATTENDANCE 
} from '../data/seedData';

const STORAGE_KEYS = {
  PROJECTS: 'fundi_projects_v1',
  TRANSACTIONS: 'fundi_txns_v1',
  SITE_LOGS: 'fundi_site_logs_v1',
  ATTENDANCE: 'fundi_attendance_v1',
  ACTIVE_ROLE: 'fundi_active_role_v1',
  ACTIVE_CURRENCY: 'fundi_active_currency_v1'
};

class FundiApiAdapter {
  private projects: Project[] = [];
  private transactions: EscrowTransaction[] = [];
  private siteLogs: SiteLogEntry[] = [];
  private attendance: AttendanceRecord[] = [];
  private activeRole: UserRole = 'owner';
  private activeCurrency: 'KES' | 'USD' = 'KES';

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      this.projects = storedProjects ? JSON.parse(storedProjects) : JSON.parse(JSON.stringify(SEED_PROJECTS));

      const storedTxns = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      this.transactions = storedTxns ? JSON.parse(storedTxns) : JSON.parse(JSON.stringify(SEED_ESCROW_TRANSACTIONS));

      const storedLogs = localStorage.getItem(STORAGE_KEYS.SITE_LOGS);
      this.siteLogs = storedLogs ? JSON.parse(storedLogs) : JSON.parse(JSON.stringify(SEED_SITE_LOGS));

      const storedAttendance = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      this.attendance = storedAttendance ? JSON.parse(storedAttendance) : JSON.parse(JSON.stringify(SEED_ATTENDANCE));

      const storedRole = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
      if (storedRole) this.activeRole = storedRole as UserRole;

      const storedCurrency = localStorage.getItem(STORAGE_KEYS.ACTIVE_CURRENCY);
      if (storedCurrency) this.activeCurrency = storedCurrency as 'KES' | 'USD';
    } catch {
      this.projects = JSON.parse(JSON.stringify(SEED_PROJECTS));
      this.transactions = JSON.parse(JSON.stringify(SEED_ESCROW_TRANSACTIONS));
      this.siteLogs = JSON.parse(JSON.stringify(SEED_SITE_LOGS));
      this.attendance = JSON.parse(JSON.stringify(SEED_ATTENDANCE));
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEYS.SITE_LOGS, JSON.stringify(this.siteLogs));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(this.attendance));
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

  // --- Reset to seed ---
  public resetToSeed() {
    this.projects = JSON.parse(JSON.stringify(SEED_PROJECTS));
    this.transactions = JSON.parse(JSON.stringify(SEED_ESCROW_TRANSACTIONS));
    this.siteLogs = JSON.parse(JSON.stringify(SEED_SITE_LOGS));
    this.attendance = JSON.parse(JSON.stringify(SEED_ATTENDANCE));
    this.persist();
  }
}

export const api = new FundiApiAdapter();
