import { Project, MarketplaceEntity, EscrowTransaction, SiteLogEntry, AttendanceRecord } from '../types';

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-karen-villa',
    ownerId: 'user-diaspora-1',
    ownerName: 'Dr. Wanjiku Githinji (Diaspora - London / Nairobi)',
    title: 'Karen Sanctuary Villa (4-Bedroom Eco-Contemporary)',
    buildingType: 'Mansion or villa',
    worksType: 'New build',
    county: 'Nairobi',
    ward: 'Karen',
    plotSize: '0.50 Acre',
    sizeSqm: 380,
    floors: 2,
    finishLevel: 'luxury',
    budgetBaselineMinor: 2850000000, // KES 28,500,000.00
    contingencyMinor: 285000000,    // KES 2,850,000.00 (10%)
    currency: 'KES',
    stage: 'Superstructure Works (Level 1 Slab & Columns)',
    overallProgressPct: 44,
    escrowHeldMinor: 820000000,     // KES 8,200,000.00 in locked vault
    escrowReleasedMinor: 1150000000, // KES 11,500,000.00 released against evidence
    complianceScorePct: 91,
    activeContractorName: 'Apex Build Construction Ltd (NCA 1)',
    leadArchitectName: 'Arch. Njeri Kamau (BORAQS #A1092)',
    quantitySurveyorName: 'QS Brian Mwangi (BORAQS #Q812)',
    imageThumbnail: '/src/assets/images/project_karen_villa_1792155227975.jpg',
    milestones: [
      {
        id: 'ms-1',
        projectId: 'proj-karen-villa',
        title: 'M1. Site Clearing, Geotechnical Soil Test & Substructure Excavation',
        description: 'Complete site grading, perimeter survey verification, core soil boreholes, and foundation trenching to hard basalt bedrock.',
        phaseOrder: 1,
        criteria: [
          'Registered land surveyor beacon re-establishment report signed',
          'NEMA Environmental compliance certificate on site',
          'Excavation down to 2.2m load-bearing bedrock level certified by structural engineer'
        ],
        evidenceRequired: ['Geotechnical lab soil density test', 'GPS stamped trench photos', 'Surveyor certificate'],
        amountMinor: 350000000,
        retentionPct: 5,
        state: 'Released',
        dueDate: '2026-03-15',
        verifierRequired: true,
        verifierId: 'qs-brian-mwangi',
        payoutBreakdown: {
          contractorAmountMinor: 297500000,
          labourWagesAmountMinor: 35000000,
          expertFeesAmountMinor: 0,
          platformFeeMinor: 7000000,
          retentionAmountMinor: 17500000
        }
      },
      {
        id: 'ms-2',
        projectId: 'proj-karen-villa',
        title: 'M2. Strip Footing, Foundation Rebar & DPC Concrete Casting',
        description: 'High-tensile D16 rebar installation, BRC mesh A142, termite chemical barrier, waterproof damp-proof membrane and Class 25 concrete pour.',
        phaseOrder: 2,
        criteria: [
          'Pre-pour inspection form signed by Eng. David Ochieng (EBK)',
          '7-day concrete crushing cube lab test results exceeding 25 N/mm²',
          'Plinth beam level tolerance within ±5mm'
        ],
        evidenceRequired: ['Cube crushing strength certificate', 'Rebar grid spacing photos', 'Ready-mix batch ticket'],
        amountMinor: 800000000,
        retentionPct: 5,
        state: 'Released',
        dueDate: '2026-06-20',
        verifierRequired: true,
        verifierId: 'qs-brian-mwangi',
        payoutBreakdown: {
          contractorAmountMinor: 680000000,
          labourWagesAmountMinor: 80000000,
          expertFeesAmountMinor: 0,
          platformFeeMinor: 16000000,
          retentionAmountMinor: 40000000
        }
      },
      {
        id: 'ms-3',
        projectId: 'proj-karen-villa',
        title: 'M3. Ground Floor Columns, Solid Suspended Slab & Staircase Formwork',
        description: 'Erection of reinforced concrete columns, shuttering plywood formwork, 150mm thick suspended slab casting and electrical conduit 1st fix.',
        phaseOrder: 3,
        criteria: [
          'Formwork stability and prop load certification',
          'MEP conduit piping embedded before pour without pipe pinch',
          'Concrete batch delivery and vibration compaction monitored'
        ],
        evidenceRequired: ['Pre-pour MEP photo log', 'Inspection form signed by Verifier', 'Post-pour curing log'],
        amountMinor: 820000000,
        retentionPct: 5,
        state: 'EvidenceSubmitted',
        dueDate: '2026-10-25',
        verifierRequired: true,
        verifierId: 'qs-brian-mwangi',
        submittedEvidence: [
          {
            id: 'ev-1',
            photoUrl: '/src/assets/images/site_inspection_foundation_1792155229622.jpg',
            description: 'Slab rebar spacing & MEP orange conduits verified on site by Clerk of Works prior to pour.',
            geoCoordinates: '-1.3214° S, 36.7118° E (Karen, Nairobi)',
            timestamp: '2026-10-14 11:24 EAT',
            submittedBy: 'Eng. Ochieng (Site Engineer, Apex Build)'
          }
        ],
        payoutBreakdown: {
          contractorAmountMinor: 697000000,
          labourWagesAmountMinor: 82000000,
          expertFeesAmountMinor: 0,
          platformFeeMinor: 16400000,
          retentionAmountMinor: 41000000
        }
      },
      {
        id: 'ms-4',
        projectId: 'proj-karen-villa',
        title: 'M4. First Floor Ring Beam, Steel Trusses & Decra Roofing',
        description: 'First floor masonry walling, lintels, engineered cold-formed steel roof trusses, insulation felt and charcoal stone-coated tile installation.',
        phaseOrder: 4,
        criteria: [
          'Truss anchor tie-down bolts checked for wind load uplift',
          'Under-tile felt membrane overlap minimum 150mm verified',
          'Rainwater gutter drainage gradient check'
        ],
        evidenceRequired: ['Roof framing alignment photo', 'Material test certificate for timber/steel', 'Watertightness rain test log'],
        amountMinor: 480000000,
        retentionPct: 5,
        state: 'AwaitingFunding',
        dueDate: '2026-12-15',
        verifierRequired: true
      },
      {
        id: 'ms-5',
        projectId: 'proj-karen-villa',
        title: 'M5. Internal Plaster, MEP 2nd Fix, Floor Screeds & Porcelain Tiles',
        description: 'High quality cement-sand wall plastering, sanitary ware rough-ins, 60x120cm Italian porcelain floor tiling and gypsum ceiling boards.',
        phaseOrder: 5,
        criteria: [
          'Tile hollow tap test with zero hollow sounding tiles',
          'Water pressure test at 4.5 bar for 24 hours with zero pressure drop',
          'Ceiling flush alignment check under raking light'
        ],
        evidenceRequired: ['Plumbing pressure gauge log', 'Tile acoustic test video', 'Finish snag list sign-off'],
        amountMinor: 400000000,
        retentionPct: 5,
        state: 'Draft',
        dueDate: '2027-02-28',
        verifierRequired: true
      }
    ],
    blueprintLayers: [
      {
        id: 'layer-substructure',
        layerName: '01. Substructure & Foundation',
        stageName: 'Substructure',
        elevationLevel: 1,
        progressPct: 100,
        budgetAllocatedMinor: 1150000000,
        budgetSpentMinor: 1150000000,
        assignedRole: 'Contractor',
        assignedEntityName: 'Apex Build Construction Ltd',
        escrowStatus: 'Released',
        complianceBlockersCount: 0,
        riskLevel: 'nominal',
        details: 'Strip footing, DPC, 150mm hardcore bed, anti-termite treatment completed and verified.'
      },
      {
        id: 'layer-superstructure',
        layerName: '02. Superstructure & Columns',
        stageName: 'Frame & Columns',
        elevationLevel: 2,
        progressPct: 75,
        budgetAllocatedMinor: 820000000,
        budgetSpentMinor: 615000000,
        assignedRole: 'Contractor & Labour Crew',
        assignedEntityName: 'Apex Build + Fundi Peter Masonry Gang',
        escrowStatus: 'Funded',
        complianceBlockersCount: 0,
        riskLevel: 'nominal',
        details: 'Columns poured to 3.2m height; Ground suspended slab poured; 14-day curing underway.'
      },
      {
        id: 'layer-masonry',
        layerName: '03. External Walling & Partitions',
        stageName: 'Walling',
        elevationLevel: 3,
        progressPct: 20,
        budgetAllocatedMinor: 380000000,
        budgetSpentMinor: 76000000,
        assignedRole: 'Masonry Fundis',
        assignedEntityName: 'Fundi Peter Maina Crew (8 masons)',
        escrowStatus: 'Awaiting',
        complianceBlockersCount: 0,
        riskLevel: 'nominal',
        details: 'Machine cut stone blocks (Thika 9x9) delivered on site and dry stacked for level 1 walls.'
      },
      {
        id: 'layer-roofing',
        layerName: '04. Roof Structure & Rainwater Harvesting',
        stageName: 'Roofing',
        elevationLevel: 4,
        progressPct: 0,
        budgetAllocatedMinor: 480000000,
        budgetSpentMinor: 0,
        assignedRole: 'Roofing Specialist',
        assignedEntityName: 'Decra Kenya & Fundi Juma Hassan',
        escrowStatus: 'Awaiting',
        complianceBlockersCount: 1,
        riskLevel: 'watch',
        details: 'Truss fabrication shop drawings submitted for structural engineer approval.'
      },
      {
        id: 'layer-mep',
        layerName: '05. MEP (Electrical, Solar, Plumbing)',
        stageName: 'MEP Services',
        elevationLevel: 5,
        progressPct: 25,
        budgetAllocatedMinor: 320000000,
        budgetSpentMinor: 80000000,
        assignedRole: 'EPRA Licensed Tech',
        assignedEntityName: 'Fundi Evans Kiprono + SolarTech',
        escrowStatus: 'Partial',
        complianceBlockersCount: 0,
        riskLevel: 'nominal',
        details: '1st fix conduits embedded in concrete slab; solar hot water piping routed.'
      },
      {
        id: 'layer-finishes',
        layerName: '06. Finishes, Glazing & Joinery',
        stageName: 'Finishes',
        elevationLevel: 6,
        progressPct: 0,
        budgetAllocatedMinor: 400000000,
        budgetSpentMinor: 0,
        assignedRole: 'Interior Team',
        assignedEntityName: 'Swahili Joinery Craftsmen',
        escrowStatus: 'Awaiting',
        complianceBlockersCount: 0,
        riskLevel: 'nominal',
        details: 'Tile selection approved; MV-01 variation approved for Italian porcelain.'
      },
      {
        id: 'layer-external',
        layerName: '07. External Works, Bio-Digester & Boundary',
        stageName: 'Handover',
        elevationLevel: 7,
        progressPct: 35,
        budgetAllocatedMinor: 250000000,
        budgetSpentMinor: 87500000,
        assignedRole: 'Subcontractor',
        assignedEntityName: 'GreenBio Digesters Kenya',
        escrowStatus: 'Partial',
        complianceBlockersCount: 0,
        riskLevel: 'nominal',
        details: 'Perimeter stone boundary wall 100% complete; bio-digester tank installed.'
      }
    ],
    budgetCategories: [
      { id: 'cat-prelim', name: 'Preliminaries & Approvals', allocatedMinor: 180000000, committedMinor: 175000000, paidMinor: 175000000, forecastMinor: 180000000, warningThresholdPct: 95 },
      { id: 'cat-substructure', name: 'Substructure & Earthworks', allocatedMinor: 350000000, committedMinor: 350000000, paidMinor: 350000000, forecastMinor: 350000000, warningThresholdPct: 100 },
      { id: 'cat-superstructure', name: 'Superstructure & Frame', allocatedMinor: 820000000, committedMinor: 820000000, paidMinor: 615000000, forecastMinor: 820000000, warningThresholdPct: 80 },
      { id: 'cat-roofing', name: 'Roofing & Waterproofing', allocatedMinor: 480000000, committedMinor: 440000000, paidMinor: 0, forecastMinor: 460000000, warningThresholdPct: 80 },
      { id: 'cat-mep', name: 'MEP (Plumbing, Power & Solar)', allocatedMinor: 320000000, committedMinor: 280000000, paidMinor: 80000000, forecastMinor: 310000000, warningThresholdPct: 80 },
      { id: 'cat-finishes', name: 'Finishes, Doors & Glazing', allocatedMinor: 400000000, committedMinor: 435000000, paidMinor: 0, forecastMinor: 435000000, warningThresholdPct: 95 },
      { id: 'cat-external', name: 'External Works & Boundary', allocatedMinor: 250000000, committedMinor: 230000000, paidMinor: 87500000, forecastMinor: 245000000, warningThresholdPct: 80 },
      { id: 'cat-profees', name: 'Professional Fees (Arch/Eng/QS)', allocatedMinor: 250000000, committedMinor: 250000000, paidMinor: 180000000, forecastMinor: 250000000, warningThresholdPct: 80 },
      { id: 'cat-contingency', name: 'Contingency Reserve (10%)', allocatedMinor: 285000000, committedMinor: 35000000, paidMinor: 0, forecastMinor: 120000000, warningThresholdPct: 50 }
    ],
    variations: [
      {
        id: 'var-1',
        projectId: 'proj-karen-villa',
        orderNumber: 'VO-01',
        title: 'Bedrock Depth Adjustment for Western Retaining Wall',
        reason: 'Encountered fractured weathered rock layer at -1.8m requiring additional 400mm mass concrete blinding to ensure seismic stability.',
        costDeltaMinor: 45000000, // +KES 450,000
        timeDeltaDays: 4,
        requestedBy: 'Eng. David Ochieng (Structural Engineer)',
        state: 'EscrowFunded',
        dateSubmitted: '2026-04-10',
        scopeImpact: 'Drawn from Contingency reserve; approved by owner Dr. Wanjiku.'
      },
      {
        id: 'var-2',
        projectId: 'proj-karen-villa',
        orderNumber: 'VO-02',
        title: 'Upgrade to Anti-Slip Porcelain Tiles & Low-E Glazing',
        reason: 'Owner requested thermal insulation glass upgrade and premium Italian porcelain tiles for living & veranda area.',
        costDeltaMinor: 35000000, // +KES 350,000
        timeDeltaDays: 0,
        requestedBy: 'Dr. Wanjiku Githinji (Owner)',
        state: 'OwnerApproved',
        dateSubmitted: '2026-10-02',
        scopeImpact: 'Finishes line item increased; requires KES 350,000 escrow top-up prior to tile container release.'
      }
    ],
    complianceItems: [
      {
        id: 'comp-1',
        projectId: 'proj-karen-villa',
        title: 'Land Title Search & Beacon Verification Certificate',
        category: 'landAndOwnership',
        authority: 'Ministry of Lands & Physical Planning',
        statutoryReference: 'Land Registration Act No. 3 of 2012',
        status: 'Verified',
        blocking: true,
        evidenceDocName: 'Official_Search_Karen_LR330_512.pdf',
        verifiedAt: '2026-01-14',
        verifiedBy: 'QS Brian Mwangi'
      },
      {
        id: 'comp-2',
        projectId: 'proj-karen-villa',
        title: 'Architectural & Structural Drawings Stamped by Registered Boards',
        category: 'designAndApprovals',
        authority: 'BORAQS / Engineers Board of Kenya (EBK)',
        statutoryReference: 'Cap 525 (Architects) & Engineers Act 2011',
        status: 'Verified',
        blocking: true,
        evidenceDocName: 'Stamped_Architectural_BORAQS_A1092.pdf',
        verifiedAt: '2026-02-04',
        verifiedBy: 'Nairobi County Physical Planning Directorate'
      },
      {
        id: 'comp-3',
        projectId: 'proj-karen-villa',
        title: 'Nairobi City County Development Approval & Building Permit',
        category: 'designAndApprovals',
        authority: 'Nairobi City County Government',
        statutoryReference: 'Physical and Land Use Planning Act 2019',
        status: 'Verified',
        blocking: true,
        evidenceDocName: 'NCC_Building_Permit_B2026_9881.pdf',
        verifiedAt: '2026-02-18',
        verifiedBy: 'County Building Inspectorate'
      },
      {
        id: 'comp-4',
        projectId: 'proj-karen-villa',
        title: 'NEMA Environmental Impact Assessment (EIA) License',
        category: 'designAndApprovals',
        authority: 'National Environment Management Authority (NEMA)',
        statutoryReference: 'EMCA Act 1999 & 2015 Regulations',
        status: 'Verified',
        blocking: true,
        evidenceDocName: 'NEMA_EIA_License_Nairobi_04112.pdf',
        verifiedAt: '2026-02-28',
        verifiedBy: 'NEMA Lead Expert #1893'
      },
      {
        id: 'comp-5',
        projectId: 'proj-karen-villa',
        title: 'NCA Project Registration & 0.5% Construction Levy Clearance',
        category: 'ncaAndCounty',
        authority: 'National Construction Authority (NCA)',
        statutoryReference: 'NCA Act No. 41 of 2011 (Sec 17)',
        status: 'Verified',
        blocking: true,
        evidenceDocName: 'NCA_Compliance_Cert_PR_2026_0944.pdf',
        verifiedAt: '2026-03-05',
        verifiedBy: 'NCA Compliance Officer'
      },
      {
        id: 'comp-6',
        projectId: 'proj-karen-villa',
        title: 'Contractors All Risk (CAR) & WIBA Workers Insurance Policy',
        category: 'contractsAndInsurance',
        authority: 'Insurance Regulatory Authority (IRA) registered underwriter',
        statutoryReference: 'Work Injury Benefits Act (WIBA 2007)',
        status: 'Verified',
        blocking: true,
        evidenceDocName: 'Jubilee_CAR_WIBA_Cover_ApexBuild.pdf',
        verifiedAt: '2026-03-10',
        verifiedBy: 'Apex Build Legal Desk'
      },
      {
        id: 'comp-7',
        projectId: 'proj-karen-villa',
        title: 'Site Safety Induction, First Aid Station & Mandatory PPE Log',
        category: 'healthSafetyAndLabour',
        authority: 'DOSHS (Directorate of Occupational Safety and Health Services)',
        statutoryReference: 'OSHA Act 2007',
        status: 'Verified',
        blocking: false,
        evidenceDocName: 'Site_Safety_Plan_PPE_Induction.pdf',
        verifiedAt: '2026-03-12',
        verifiedBy: 'Site Safety Officer'
      },
      {
        id: 'comp-8',
        projectId: 'proj-karen-villa',
        title: 'County Occupation / Completion Certificate',
        category: 'qualityAndCloseout',
        authority: 'Nairobi City County Public Health & Inspectorate',
        statutoryReference: 'Building Code of Kenya (Section 114)',
        status: 'Pending',
        blocking: false,
        notes: 'Due upon 100% practical completion inspection and snagging clearance.'
      }
    ]
  },
  {
    id: 'proj-kilimani-apartments',
    ownerId: 'user-corp-dev',
    ownerName: 'Simba Properties & Investments Ltd',
    title: 'Kilimani Horizon Executive Residences (24 Units)',
    buildingType: 'Apartment block',
    worksType: 'New build',
    county: 'Nairobi',
    ward: 'Kilimani',
    plotSize: '0.25 Acre',
    sizeSqm: 2100,
    floors: 6,
    finishLevel: 'standard',
    budgetBaselineMinor: 14500000000, // KES 145,000,000.00
    contingencyMinor: 1450000000,
    currency: 'KES',
    stage: 'Substructure Basement Casting & Retaining Shoring',
    overallProgressPct: 18,
    escrowHeldMinor: 2800000000,
    escrowReleasedMinor: 1200000000,
    complianceScorePct: 98,
    activeContractorName: 'Crown Heights Contractors (NCA 1)',
    leadArchitectName: 'Studio Arch Design (BORAQS #A0941)',
    quantitySurveyorName: 'QS Brian Mwangi (BORAQS #Q812)',
    imageThumbnail: '/src/assets/images/project_kilimani_apartments_1792155228819.jpg',
    milestones: [],
    blueprintLayers: [],
    budgetCategories: [],
    variations: [],
    complianceItems: []
  }
];

export const SEED_MARKETPLACE_ENTITIES: MarketplaceEntity[] = [
  {
    id: 'exp-arch-njeri',
    category: 'expert',
    title: 'Arch. Njeri Kamau',
    subtitle: 'Principal Architect & Sustainable Urban Design Specialist',
    registrationBadge: 'BORAQS Reg #A1092',
    county: 'Nairobi',
    rating: 4.96,
    completedProjectsCount: 28,
    rateDisplay: 'KES 4,500 / hr or 6% of BoQ',
    verificationTier: 'Trusted',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    skills: ['Tropical Modern Architecture', 'BORAQS Board Certified', 'Nairobi County Approvals', 'ArchiCAD / Revit BIM'],
    insuranceOnBoard: true,
    contactMasked: true
  },
  {
    id: 'exp-eng-david',
    category: 'expert',
    title: 'Eng. David Ochieng, PE',
    subtitle: 'Consulting Civil & Structural Engineer',
    registrationBadge: 'EBK Reg #E4821 | IEK Member',
    county: 'Nairobi & Kiambu',
    rating: 4.98,
    completedProjectsCount: 42,
    rateDisplay: 'KES 5,000 / hr or milestone fee',
    verificationTier: 'Trusted',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    skills: ['Seismic Structural Calculations', 'Deep Foundations', 'Post-Tensioned Slabs', 'EBK Stamped Calculations'],
    insuranceOnBoard: true,
    contactMasked: true
  },
  {
    id: 'exp-qs-brian',
    category: 'expert',
    title: 'QS Brian Mwangi',
    subtitle: 'Chartered Quantity Surveyor & Independent Verifier',
    registrationBadge: 'BORAQS Reg #Q812 | IQSK',
    county: 'Nairobi & Nakuru',
    rating: 4.94,
    completedProjectsCount: 35,
    rateDisplay: 'KES 4,000 / hr or 2.5% BoQ',
    verificationTier: 'Trusted',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    skills: ['Detailed BoQ Preparation', 'Milestone Evidence Verification', 'Cost Control & Auditing', 'Arbitration Advice'],
    insuranceOnBoard: true,
    contactMasked: true
  },
  {
    id: 'con-apex-build',
    category: 'contractor',
    title: 'Apex Build Construction Ltd',
    subtitle: 'NCA 1 Registered Building & Civil Works Contractor',
    registrationBadge: 'NCA 1 Building | KRA Compliant',
    county: 'Nationwide (HQ Nairobi)',
    rating: 4.92,
    completedProjectsCount: 19,
    rateDisplay: 'Contract values KES 15M - 350M',
    verificationTier: 'Trusted',
    photo: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=400&q=80',
    skills: ['Turnkey Construction', 'CAR & WIBA In Force', 'Dedicated Site Plant', 'ISO 9001 Quality QA'],
    insuranceOnBoard: true,
    contactMasked: true
  },
  {
    id: 'con-primestone',
    category: 'contractor',
    title: 'PrimeStone Residential Ltd',
    subtitle: 'NCA 3 Specialist Residential & Townhouse Builders',
    registrationBadge: 'NCA 3 Residential',
    county: 'Nairobi & Machakos',
    rating: 4.88,
    completedProjectsCount: 12,
    rateDisplay: 'Contract values KES 5M - 80M',
    verificationTier: 'Verified',
    photo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80',
    skills: ['Luxury Villas', 'Timber & Stone Masonry', 'Green Construction', 'On-Time Guaranteed'],
    insuranceOnBoard: true,
    contactMasked: true
  },
  {
    id: 'labour-peter-mason',
    category: 'labour',
    title: 'Fundi Peter Maina (Gang Lead)',
    subtitle: 'Master Stone Mason & Plinth Specialist (8-Fundi Crew)',
    registrationBadge: 'NCA Certified Craftsman #CR882',
    county: 'Nairobi (Karen / Langata)',
    rating: 4.95,
    completedProjectsCount: 48,
    rateDisplay: 'KES 2,200 / day (Master), KES 1,200 (Helper)',
    verificationTier: 'Trusted',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    skills: ['Machine-Cut Stone Walling', 'Blockwork', 'Reinforced Formwork', 'Daily M-Pesa Muster Payouts'],
    insuranceOnBoard: true,
    contactMasked: true
  },
  {
    id: 'labour-juma-carpenter',
    category: 'labour',
    title: 'Fundi Juma Hassan',
    subtitle: 'Master Roofer & Swahili Coastal Hardwood Joiner',
    registrationBadge: 'VTC Certified Master Joiner',
    county: 'Mombasa & Nairobi',
    rating: 4.91,
    completedProjectsCount: 31,
    rateDisplay: 'KES 2,400 / day or piece-rate',
    verificationTier: 'Verified',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    skills: ['Engineered Timber Trusses', 'Decra / Shingle Installation', 'Mvule & Teak Doors', 'Cabinetry'],
    insuranceOnBoard: false,
    contactMasked: true
  },
  {
    id: 'mat-bamburi-cement',
    category: 'material',
    title: 'Bamburi PowerMax 42.5N Structural Cement',
    subtitle: 'Direct Depot Bulk Supply (50kg Bag Tiers)',
    registrationBadge: 'KEBS Diamond Mark Certified',
    county: 'Nairobi & Environs (Depot Delivery)',
    rating: 4.99,
    completedProjectsCount: 160,
    rateDisplay: 'KES 760 / bag (Min 200 bags, delivered)',
    verificationTier: 'Trusted',
    photo: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
    skills: ['42.5N High Early Strength', 'Tested Batch Certificates', 'Free Offloading within 25km'],
    insuranceOnBoard: true,
    contactMasked: false
  },
  {
    id: 'mach-cat-excavator',
    category: 'machinery',
    title: 'CAT 320D Hydraulic Track Excavator',
    subtitle: 'Includes Certified Operator & Diesel Mobilisation',
    registrationBadge: 'DOSHS Annual Boiler & Plant Inspected',
    county: 'Nairobi, Kiambu, Machakos',
    rating: 4.93,
    completedProjectsCount: 52,
    rateDisplay: 'KES 38,000 / 8-hr dry shift',
    verificationTier: 'Trusted',
    photo: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=400&q=80',
    skills: ['Rock Bucket 1.2m³', 'Certified Heavy Plant Operator', 'GPS Telemetry Logged'],
    insuranceOnBoard: true,
    contactMasked: false
  }
];

export const SEED_ESCROW_TRANSACTIONS: EscrowTransaction[] = [
  {
    id: 'txn-esc-101',
    projectId: 'proj-karen-villa',
    type: 'Funding_Deposit',
    amountMinor: 820000000,
    currency: 'KES',
    status: 'Completed',
    rail: 'M-Pesa',
    reference: 'MPESA-QRT8921804',
    idempotencyKey: 'idemp-karen-fund-m3',
    timestamp: '2026-09-01 14:10:02 EAT',
    payeeName: 'FUNDI Escrow Trust Custody Account (NCBA / M-Pesa B2B)'
  },
  {
    id: 'txn-esc-102',
    projectId: 'proj-karen-villa',
    milestoneId: 'ms-2',
    type: 'Milestone_Release',
    amountMinor: 800000000,
    currency: 'KES',
    status: 'Completed',
    rail: 'RTGS_Bank',
    reference: 'CBK-RTGS-9812903',
    idempotencyKey: 'idemp-rel-ms2-karen',
    timestamp: '2026-06-21 16:45:00 EAT',
    payeeName: 'Apex Build Construction Ltd (Stanbic KES A/C)'
  },
  {
    id: 'txn-esc-103',
    projectId: 'proj-karen-villa',
    milestoneId: 'ms-2',
    type: 'Retention_Hold',
    amountMinor: 40000000,
    currency: 'KES',
    status: 'Completed',
    rail: 'RTGS_Bank',
    reference: 'RET-HOLD-MS2-KAREN',
    idempotencyKey: 'idemp-ret-ms2-karen',
    timestamp: '2026-06-21 16:45:01 EAT',
    payeeName: 'FUNDI Defects Liability Retention Vault'
  },
  {
    id: 'txn-esc-104',
    projectId: 'proj-karen-villa',
    type: 'Wage_Disbursement',
    amountMinor: 14200000, // KES 142,000 for week 38 labour
    currency: 'KES',
    status: 'Completed',
    rail: 'M-Pesa',
    reference: 'MPESA-B2C-PAYROLL-W38',
    idempotencyKey: 'idemp-wage-w38-karen',
    timestamp: '2026-10-10 17:30:15 EAT',
    payeeName: 'M-Pesa Payout to 8 Crew Members (Fundi Peter Maina Gang)'
  }
];

export const SEED_SITE_LOGS: SiteLogEntry[] = [
  {
    id: 'log-01',
    projectId: 'proj-karen-villa',
    date: '2026-10-15',
    weather: 'Clear & Sunny',
    notes: 'Ground floor slab curing day 8: water ponding maintained consistently. Commenced setting out profiles for first-floor masonry walls along gridline A-D.',
    authorName: 'Eng. Ochieng (Resident Site Engineer)',
    role: 'Contractor Site Rep',
    workersPresentCount: 12,
    photos: [
      {
        id: 'p-1',
        url: '/src/assets/images/site_inspection_foundation_1792155229622.jpg',
        caption: 'Curing ponding test & concrete surface integrity check',
        geotag: 'Karen Plot LR 330/512 (-1.3214°, 36.7118°)',
        timestamp: '15 Oct 2026, 09:15 AM'
      }
    ]
  },
  {
    id: 'log-02',
    projectId: 'proj-karen-villa',
    date: '2026-10-14',
    weather: 'Clear & Sunny',
    notes: 'Delivery of 1,200 pcs Thika machine-cut foundation stone blocks from verified supplier. Verified block edge sharpness and crushed strength test certificates.',
    authorName: 'Fundi Peter Maina',
    role: 'Lead Mason',
    workersPresentCount: 10,
    photos: []
  }
];

export const SEED_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', workerId: 'w-1', workerName: 'Peter Maina', trade: 'Master Mason (Lead)', crewName: 'Maina Masonry Gang', dailyRateMinor: 220000, checkedInAt: '07:45 AM', geoVerified: true, status: 'Present', payoutStatus: 'Pending', mpesaPhoneMasked: '+254 712 *** 491' },
  { id: 'att-2', workerId: 'w-2', workerName: 'Joseph Kinyua', trade: 'Mason', crewName: 'Maina Masonry Gang', dailyRateMinor: 180000, checkedInAt: '07:50 AM', geoVerified: true, status: 'Present', payoutStatus: 'Pending', mpesaPhoneMasked: '+254 722 *** 810' },
  { id: 'att-3', workerId: 'w-3', workerName: 'Stephen Otieno', trade: 'Steel Fixer', crewName: 'Maina Masonry Gang', dailyRateMinor: 190000, checkedInAt: '07:52 AM', geoVerified: true, status: 'Present', payoutStatus: 'Pending', mpesaPhoneMasked: '+254 733 *** 129' },
  { id: 'att-4', workerId: 'w-4', workerName: 'Emmanuel Mwamba', trade: 'Helper / Labourer', crewName: 'Maina Masonry Gang', dailyRateMinor: 120000, checkedInAt: '08:00 AM', geoVerified: true, status: 'Present', payoutStatus: 'Pending', mpesaPhoneMasked: '+254 790 *** 734' },
  { id: 'att-5', workerId: 'w-5', workerName: 'Collins Kibet', trade: 'Helper / Labourer', crewName: 'Maina Masonry Gang', dailyRateMinor: 120000, checkedInAt: '08:02 AM', geoVerified: true, status: 'Present', payoutStatus: 'Pending', mpesaPhoneMasked: '+254 714 *** 552' }
];
