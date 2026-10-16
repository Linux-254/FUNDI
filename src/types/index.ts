export type Currency = 'KES' | 'USD';

export type UserRole = 
  | 'owner' 
  | 'contractor' 
  | 'expert' 
  | 'labour' 
  | 'supplier' 
  | 'verifier' 
  | 'admin';

export type BuildingType = 
  | 'Bungalow'
  | 'Maisonette'
  | 'Mansion or villa'
  | 'Townhouse'
  | 'Apartment block'
  | 'Rental units or bedsitters'
  | 'Office'
  | 'Retail shop or mall'
  | 'Hotel or lodge'
  | 'Warehouse'
  | 'School'
  | 'Clinic or hospital'
  | 'Boundary wall and fencing';

export type WorksType = 
  | 'New build'
  | 'Extension'
  | 'Renovation'
  | 'Interior fit-out'
  | 'Solar and MEP retrofit';

export type FinishLevel = 'basic' | 'standard' | 'premium' | 'luxury';

export type MilestoneState = 
  | 'Draft'
  | 'AwaitingFunding'
  | 'Funded'
  | 'InProgress'
  | 'EvidenceSubmitted'
  | 'UnderReview'
  | 'Approved'
  | 'Released'
  | 'Disputed'
  | 'Resolved'
  | 'Cancelled';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  phaseOrder: number;
  criteria: string[];
  evidenceRequired: string[];
  amountMinor: number; // in integer cents (e.g. 100000 = KES 1,000.00)
  retentionPct: number;
  state: MilestoneState;
  dueDate: string;
  verifierRequired: boolean;
  verifierId?: string;
  submittedEvidence?: {
    id: string;
    photoUrl: string;
    description: string;
    geoCoordinates?: string;
    timestamp: string;
    submittedBy: string;
  }[];
  payoutBreakdown?: {
    contractorAmountMinor: number;
    labourWagesAmountMinor: number;
    expertFeesAmountMinor: number;
    platformFeeMinor: number;
    retentionAmountMinor: number;
  };
}

export interface BlueprintLayer {
  id: string;
  layerName: string;
  stageName: string;
  elevationLevel: number; // 1 = foundation/substructure, 7 = finishes
  progressPct: number;
  budgetAllocatedMinor: number;
  budgetSpentMinor: number;
  assignedRole: string;
  assignedEntityName: string;
  escrowStatus: 'Funded' | 'Released' | 'Awaiting' | 'Partial';
  complianceBlockersCount: number;
  riskLevel: 'nominal' | 'watch' | 'critical';
  details: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocatedMinor: number;
  committedMinor: number;
  paidMinor: number;
  forecastMinor: number;
  warningThresholdPct: number;
}

export interface VariationOrder {
  id: string;
  projectId: string;
  orderNumber: string;
  title: string;
  reason: string;
  costDeltaMinor: number;
  timeDeltaDays: number;
  requestedBy: string;
  state: 'Draft' | 'Submitted' | 'OwnerApproved' | 'EscrowFunded' | 'Rejected';
  dateSubmitted: string;
  scopeImpact: string;
}

export interface ComplianceItem {
  id: string;
  projectId: string;
  title: string;
  category: 
    | 'landAndOwnership'
    | 'designAndApprovals'
    | 'ncaAndCounty'
    | 'contractorCompliance'
    | 'contractsAndInsurance'
    | 'healthSafetyAndLabour'
    | 'qualityAndCloseout';
  authority: string; // e.g. "BORAQS", "EBK", "NEMA", "NCA", "Nairobi City County"
  statutoryReference: string;
  status: 'Pending' | 'Uploaded' | 'Verified' | 'Exempt';
  blocking: boolean; // if true, blocks milestone funding or start of works
  evidenceDocName?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface Project {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  buildingType: BuildingType;
  worksType: WorksType;
  county: string;
  ward: string;
  plotSize: string;
  sizeSqm: number;
  floors: number;
  finishLevel: FinishLevel;
  budgetBaselineMinor: number;
  contingencyMinor: number;
  currency: Currency;
  stage: string;
  overallProgressPct: number;
  escrowHeldMinor: number;
  escrowReleasedMinor: number;
  complianceScorePct: number;
  activeContractorName: string;
  leadArchitectName: string;
  quantitySurveyorName: string;
  imageThumbnail: string;
  milestones: Milestone[];
  blueprintLayers: BlueprintLayer[];
  budgetCategories: BudgetCategory[];
  variations: VariationOrder[];
  complianceItems: ComplianceItem[];
}

export interface EscrowTransaction {
  id: string;
  projectId: string;
  milestoneId?: string;
  type: 'Funding_Deposit' | 'Milestone_Release' | 'Retention_Hold' | 'Dispute_Freeze' | 'Refund' | 'Wage_Disbursement';
  amountMinor: number;
  currency: Currency;
  status: 'Completed' | 'Pending' | 'Failed';
  rail: 'M-Pesa' | 'RTGS_Bank' | 'Card_Diaspora';
  reference: string;
  idempotencyKey: string;
  timestamp: string;
  payeeName: string;
}

export interface SiteLogEntry {
  id: string;
  projectId: string;
  date: string;
  weather: 'Clear & Sunny' | 'Light Showers' | 'Heavy Rain' | 'Overcast';
  notes: string;
  authorName: string;
  role: string;
  workersPresentCount: number;
  photos: {
    id: string;
    url: string;
    caption: string;
    geotag: string;
    timestamp: string;
  }[];
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  trade: string;
  crewName: string;
  dailyRateMinor: number;
  checkedInAt: string;
  geoVerified: boolean;
  status: 'Present' | 'Half-day' | 'Absent';
  payoutStatus: 'Pending' | 'Paid_MPesa';
  mpesaPhoneMasked: string;
}

export interface MarketplaceEntity {
  id: string;
  category: 'expert' | 'contractor' | 'labour' | 'material' | 'machinery';
  title: string;
  subtitle: string;
  registrationBadge: string; // e.g. "NCA 1 Building", "BORAQS Reg #A1092", "EBK Registered"
  county: string;
  rating: number;
  completedProjectsCount: number;
  rateDisplay: string;
  verificationTier: 'Verified' | 'Trusted' | 'Basic';
  photo: string;
  skills: string[];
  insuranceOnBoard: boolean;
  contactMasked: boolean;
}
