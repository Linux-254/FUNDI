import { KnowledgeBaseData, NcaClassLimit } from '../types';

export const SEED_NCA_CLASS_LIMITS: NcaClassLimit[] = [
  { ncaClass: 'NCA 1', category: 'Building & Civil Works', contractValueLimitKes: 'Unlimited', displayLimit: 'Unlimited Capacity', notes: 'Top-tier commercial towers, highways, heavy industrial plants, and mega dams.' },
  { ncaClass: 'NCA 2', category: 'Building & Civil Works', contractValueLimitKes: 500000000, displayLimit: 'Up to KES 500,000,000', notes: 'Large residential estates, multi-storey commercial complexes, and trunk roads.' },
  { ncaClass: 'NCA 3', category: 'Building Works', contractValueLimitKes: 300000000, displayLimit: 'Up to KES 300,000,000', notes: 'Mid-rise apartment blocks (up to 8 floors), shopping centres, and schools.' },
  { ncaClass: 'NCA 4', category: 'Building Works', contractValueLimitKes: 200000000, displayLimit: 'Up to KES 200,000,000', notes: 'Townhouse developments, small apartments (4-6 storeys), and warehouses.' },
  { ncaClass: 'NCA 5', category: 'Building Works', contractValueLimitKes: 100000000, displayLimit: 'Up to KES 100,000,000', notes: 'Commercial retail units, clinics, godowns, and institutional extensions.' },
  { ncaClass: 'NCA 6', category: 'Building Works', contractValueLimitKes: 50000000, displayLimit: 'Up to KES 50,000,000', notes: 'Luxury residential villas, maisonettes, and light commercial buildings.' },
  { ncaClass: 'NCA 7', category: 'Building Works', contractValueLimitKes: 20000000, displayLimit: 'Up to KES 20,000,000', notes: 'Standard bungalows, maisonettes, and perimeter boundary walling.' },
  { ncaClass: 'NCA 8', category: 'Building Works', contractValueLimitKes: 10000000, displayLimit: 'Up to KES 10,000,000', notes: 'Small residential renovations, single-storey cottages, and simple masonry.' }
];

export const INITIAL_KNOWLEDGE_BASE: KnowledgeBaseData = {
  agencies: [
    { id: 'lands', name: 'Ministry of Lands and Physical Planning (Ardhisasa)', issues: ['Official land search', 'Title and lease records'], stage: 'before' },
    { id: 'county-planning', name: 'County Government: Physical Planning / Development Control', issues: ['Zoning compliance', 'Development permission', 'Occupation certificate'], stage: 'before,after' },
    { id: 'county-works', name: 'County Government: Public Works and Engineering', issues: ['Structural and building plan approval', 'Stage inspections'], stage: 'before,during' },
    { id: 'county-fire', name: 'County Government: Fire and Disaster Management', issues: ['Fire safety design vetting', 'Fire safety certificate'], stage: 'before,after' },
    { id: 'county-health', name: 'County Public Health', issues: ['Public health certificate for food, beauty, hospitality premises', 'Health facility inspections'], stage: 'after' },
    { id: 'nca', name: 'National Construction Authority', issues: ['Contractor registration and practicing licence', 'Project registration', 'Levy and compliance certificate', 'Site supervisor registration', 'Completion notice'], stage: 'before,during,after' },
    { id: 'nema', name: 'National Environment Management Authority', issues: ['EIA licence', 'Effluent discharge licence', 'Waste licences'], stage: 'before,after' },
    { id: 'wra', name: 'Water Resources Authority', issues: ['Borehole drilling and abstraction permits'], stage: 'before' },
    { id: 'doshs', name: 'Directorate of Occupational Safety and Health Services', issues: ['Workplace registration', 'Statutory examinations (lifts, pressure vessels, hoists)', 'Site safety inspections'], stage: 'before,during,lifecycle' },
    { id: 'epra', name: 'Energy and Petroleum Regulatory Authority', issues: ['Petroleum and energy facility licences', 'Electrical contractor licensing', 'Solar and energy efficiency requirements'], stage: 'before,after' },
    { id: 'kplc', name: 'Kenya Power and Lighting Company', issues: ['Power connection approvals, metering and energisation'], stage: 'after' },
    { id: 'kebs', name: 'Kenya Bureau of Standards', issues: ['Product standards and certification marks', 'Material compliance'], stage: 'during' },
    { id: 'roads', name: 'KeNHA / KURA / KeRRA', issues: ['Road reserve, access and traffic management approvals for civil works'], stage: 'before,during' },
    { id: 'utilities', name: 'Water and sewer utilities (county water companies)', issues: ['Water and sewer connection approvals'], stage: 'before,after' },
    { id: 'ca', name: 'Communications Authority of Kenya', issues: ['Licensing for communications and structured cabling contractors'], stage: 'before' },
    { id: 'boraqs', name: 'Board of Registration of Architects and Quantity Surveyors', issues: ['Registration of architects and QSs'], stage: 'before' },
    { id: 'ebk', name: 'Engineers Board of Kenya', issues: ['Registration of engineers and firms'], stage: 'before' },
    { id: 'nita', name: 'National Industrial Training Authority', issues: ['Trade testing and certification for artisans'], stage: 'any' },
    { id: 'knra', name: 'Kenya Nuclear Regulatory Authority (verify)', issues: ['Ionising radiation equipment installations such as X-ray and CT'], stage: 'before,after' },
    { id: 'ppb', name: 'Pharmacy and Poisons Board (verify)', issues: ['Pharmacy premises licensing'], stage: 'after' },
    { id: 'health-reg', name: 'Health facility regulators (KMPDC or successor and county health, verify)', issues: ['Health facility licensing'], stage: 'after' },
    { id: 'tra', name: 'Tourism Regulatory Authority (verify)', issues: ['Hotel, restaurant and tourism facility licensing'], stage: 'after' },
    { id: 'alcohol', name: 'County alcohol control or licensing (verify)', issues: ['Liquor licences'], stage: 'after' },
    { id: 'moe', name: 'Ministry of Education and county education offices (verify)', issues: ['School registration and premises standards'], stage: 'after' },
    { id: 'agri-regs', name: 'Agriculture regulators such as Kenya Dairy Board, KEPHIS, DVS (verify)', issues: ['Dairy, plant health and livestock facility licensing'], stage: 'after' }
  ],
  documentChecklist: [
    // Before stage
    { id: 'doc-b-1', doc: 'Title deed, lease or allotment letter plus recent official search', agency: 'Ministry of Lands (Ardhisasa)', appliesTo: 'All projects', blocking: true, stage: 'before', source: 'Land Registration Act 2012', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'ardhisasa.lands.go.ke' },
    { id: 'doc-b-2', doc: 'Survey plan or mutation and beacon certificate', agency: 'Ministry of Lands / Survey of Kenya', appliesTo: 'All projects', blocking: false, stage: 'before', source: 'Survey Act Cap 299', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'Survey of Kenya' },
    { id: 'doc-b-3', doc: 'Zoning and physical planning approval', agency: 'County Physical Planning', appliesTo: 'All projects', blocking: true, stage: 'before', source: 'Physical and Land Use Planning Act 2019', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'County Planning Portal' },
    { id: 'doc-b-4', doc: 'Architectural plans signed by BORAQS-registered architect', agency: 'County Works / BORAQS', appliesTo: 'All projects', blocking: true, stage: 'before', source: 'Cap 525 Architects and Quantity Surveyors Act', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'boraqs.or.ke' },
    { id: 'doc-b-5', doc: 'Structural drawings and calculations signed by EBK-registered engineer', agency: 'County Works / EBK', appliesTo: 'All projects', blocking: true, stage: 'before', source: 'Engineers Act 2011', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'ebk.go.ke' },
    { id: 'doc-b-6', doc: 'MEP drawings signed by registered engineers', agency: 'County Works', appliesTo: 'R3, R4, R5, sector-fitouts', blocking: false, stage: 'before', source: 'Kenya Building Code / EPRA', confidence: 'medium', lastVerifiedAt: '2026-02-15', verifyAt: 'County Engineering' },
    { id: 'doc-b-7', doc: 'Geotechnical or soil investigation report', agency: 'County Works / Materials Lab', appliesTo: 'Multi-storey, industrial, poor soil', blocking: false, stage: 'before', source: 'Geotechnical Standards BS 5930', confidence: 'medium', lastVerifiedAt: '2026-02-15', verifyAt: 'Materials Branch MOPW' },
    { id: 'doc-b-8', doc: 'County development permission and building permit', agency: 'County Planning', appliesTo: 'All projects', blocking: true, stage: 'before', source: 'County Urban Development Acts', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'County Government' },
    { id: 'doc-b-9', doc: 'NEMA EIA licence (or project report outcome) with public participation records', agency: 'NEMA', appliesTo: 'Apartments, commercial, industrial, health, large works', blocking: false, stage: 'before', source: 'EMCA Act 1999 & EIA Regs', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'nema.go.ke' },
    { id: 'doc-b-10', doc: 'NCA project registration, levy payment (0.5% above KES 5M) and compliance certificate, site signboard', agency: 'NCA', appliesTo: 'All projects above KES 5M', blocking: true, stage: 'before', note: 'Developer registers within 30 days of contract award; verify current threshold at nca.go.ke', source: 'NCA Act No. 41 of 2011', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'nca.go.ke' },
    { id: 'doc-b-11', doc: 'Contractor NCA registration in correct class and valid annual practicing licence', agency: 'NCA', appliesTo: 'All projects', blocking: true, stage: 'before', source: 'NCA Contractors Register', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'nca.go.ke' },
    { id: 'doc-b-12', doc: 'Workplace registration and construction-phase health and safety plan', agency: 'DOSHS', appliesTo: 'All projects', blocking: false, stage: 'before', source: 'OSHA 2007 Section 44', confidence: 'medium', lastVerifiedAt: '2026-02-01', verifyAt: 'doshs.go.ke' },
    { id: 'doc-b-13', doc: 'Borehole or water abstraction permit', agency: 'WRA', appliesTo: 'Off-grid water / deep wells', blocking: false, stage: 'before', source: 'Water Resources Authority Rules', confidence: 'medium', lastVerifiedAt: '2026-01-10', verifyAt: 'wra.go.ke' },
    { id: 'doc-b-14', doc: 'Fire safety design vetting and approval', agency: 'County Fire Service', appliesTo: 'Commercial, health, hospitality, education, R3+', blocking: false, stage: 'before', source: 'Fire Safety Regulations', confidence: 'medium', lastVerifiedAt: '2026-01-10', verifyAt: 'County Fire' },
    { id: 'doc-b-15', doc: 'Contract, BoQ, programme, consultant appointment letters, insurances (CAR, public liability, WIBA)', agency: 'Private / Insurers', appliesTo: 'All projects', blocking: true, stage: 'before', source: 'Insurance Act / WIBA 2007', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'IRA Approved Insurer' },

    // During stage
    { id: 'doc-d-1', doc: 'Daily site diary and clerk of works log', agency: 'Site Team', appliesTo: 'All projects', blocking: false, stage: 'during', source: 'Standard Conditions of Contract', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'FUNDI Site App' },
    { id: 'doc-d-2', doc: 'Concrete cube test results (150mm cubes at 7 and 28 days), steel tensile certificates, soil compaction', agency: 'Accredited Lab / KEBS', appliesTo: 'All projects', blocking: true, stage: 'during', source: 'BS EN 12390 / KS 02-1070', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'Ministry of Works Lab' },
    { id: 'doc-d-3', doc: 'Site instruction book (signed change notices)', agency: 'Architect / Engineer', appliesTo: 'All projects', blocking: false, stage: 'during', source: 'JBCC / FIDIC', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'Project Desk' },
    { id: 'doc-d-4', doc: 'County stage inspections (foundation trenching, suspended slab rebar, roof framing)', agency: 'County Works / Inspectorate', appliesTo: 'All projects', blocking: true, stage: 'during', source: 'Building Code of Kenya', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'County Building Inspector' },
    { id: 'doc-d-5', doc: 'NCA and DOSHS quality enforcement inspection records', agency: 'NCA, DOSHS', appliesTo: 'All projects', blocking: false, stage: 'during', source: 'NCA Quality Assurance Directorate', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'NCA Site QA' },
    { id: 'doc-d-6', doc: 'Permits to work (hot work, confined space, work at height >2m, deep excavation)', agency: 'Safety Officer', appliesTo: 'R3, R4, R5, Industrial', blocking: false, stage: 'during', source: 'OSHA 2007', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'Site Safety Desk' },

    // After stage
    { id: 'doc-a-1', doc: 'As-built architectural and structural drawings', agency: 'Design Team', appliesTo: 'All projects', blocking: false, stage: 'after', source: 'BORAQS Handover Protocol', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'Lead Consultant' },
    { id: 'doc-a-2', doc: 'Certificate of Practical Completion', agency: 'Architect / Project Manager', appliesTo: 'All projects', blocking: true, stage: 'after', source: 'Standard Form of Agreement', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'Lead Architect' },
    { id: 'doc-a-3', doc: 'Occupation certificate', agency: 'County Planning / Public Health', appliesTo: 'All projects', blocking: true, stage: 'after', source: 'Physical and Land Use Planning Act 2019', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'County Director of Planning' },
    { id: 'doc-a-4', doc: 'NCA project completion notice', agency: 'NCA', appliesTo: 'All projects', blocking: false, stage: 'after', source: 'NCA Regulations', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'nca.go.ke' },
    { id: 'doc-a-5', doc: 'Fire safety certificate', agency: 'County Fire', appliesTo: 'Commercial, health, hospitality, education, apartments', blocking: false, stage: 'after', source: 'Fire Safety Audit', confidence: 'medium', lastVerifiedAt: '2026-01-15', verifyAt: 'County Fire Officer' },
    { id: 'doc-a-6', doc: 'Electrical installation completion certificate by licensed EPRA contractor', agency: 'EPRA / KPLC', appliesTo: 'All projects', blocking: true, stage: 'after', source: 'Energy Act 2019', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'epra.go.ke' },

    // Lifecycle stage
    { id: 'doc-l-1', doc: 'Periodic structural and safety audit (5-year cycle per National Building Code 2024)', agency: 'County Works / DOSHS', appliesTo: 'All commercial and residential multi-unit', blocking: false, stage: 'lifecycle', note: 'Verify exact NBC 2024 clause number against gazette notice', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'National Building Code gazette' },
    { id: 'doc-l-2', doc: 'Defects liability period tracking (typically 6-12 months)', agency: 'Private Contract', appliesTo: 'All projects', blocking: true, stage: 'lifecycle', source: 'Standard Building Contract', confidence: 'high', lastVerifiedAt: '2026-03-01', verifyAt: 'FUNDI Escrow Engine' },
    { id: 'doc-l-3', doc: 'Annual servicing logs: passenger lifts, generators, fire suppression, biodigesters', agency: 'Certified Vendors / DOSHS', appliesTo: 'Apartments, commercial, industrial', blocking: false, stage: 'lifecycle', source: 'OSHA 2007 (Lifting plant rules)', confidence: 'medium', lastVerifiedAt: '2026-02-01', verifyAt: 'DOSHS Boiler & Plant' }
  ],
  feeSeeds: [
    {
      id: 'fee-county',
      item: 'County development fees',
      indicative: 'About 0.5% to 1% of estimated construction value, varies by county bylaws',
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'County Finance Act & Fee Schedule'
    },
    {
      id: 'fee-nca',
      item: 'NCA levy',
      indicative: '0.5% of contract value for projects exceeding KES 5,000,000 (developer duty to pay within 30 days)',
      source: 'NCA Act No. 41 of 2011 Regulations',
      confidence: 'medium',
      lastVerifiedAt: '2026-03-01',
      verifyAt: 'nca.go.ke'
    },
    {
      id: 'fee-nema',
      item: 'NEMA EIA licence processing',
      indicative: 'About 0.1% of project cost with minimum and maximum statutory caps',
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'NEMA Fee Schedule (nema.go.ke)'
    },
    {
      id: 'fee-doshs',
      item: 'DOSHS workplace registration',
      indicative: 'KES 5,000 to 20,000 per site depending on workforce size',
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'DOSHS Fee Schedule'
    },
    {
      id: 'fee-boraqs',
      item: 'Architect and QS professional fees',
      indicative: 'About 3% to 6% of construction cost depending on complexity and scale',
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'BORAQS Scale of Fees Guidance'
    },
    {
      id: 'fee-ebk',
      item: 'Consulting engineer fees (Structural/MEP)',
      indicative: 'About 2% to 4% of the respective engineering scope value',
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Engineers Board of Kenya (EBK)'
    }
  ],
  costPerSqmSeeds: [
    {
      id: 'cps-bungalow',
      type: 'Bungalow or maisonette',
      minKesPerSqm: 35000,
      maxKesPerSqm: 55000,
      note: 'Single or two-storey domestic residential building',
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'IQSK Building Cost Index'
    },
    {
      id: 'cps-apartments',
      type: 'Commercial apartments (Mid-Rise)',
      minKesPerSqm: 45000,
      maxKesPerSqm: 70000,
      note: 'Reinforced concrete frame, 4-8 storeys with lift provision',
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'IQSK Building Cost Index'
    },
    {
      id: 'cps-office',
      type: 'Corporate office towers (High-Rise)',
      minKesPerSqm: 70000,
      maxKesPerSqm: 120000,
      note: 'Curtain walling, central VRF HVAC, basement parking, BMS',
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'IQSK Commercial Benchmarks'
    },
    {
      id: 'cps-industrial',
      type: 'Heavy industrial or refinery',
      note: 'Custom EPC contract, dynamic machine foundations. No flat per-sqm seed applies.',
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'EPC Contractor Tender Data'
    }
  ],
  ncaClassLimits: SEED_NCA_CLASS_LIMITS,
  professionalsByTier: {
    tier1_domesticResidential: [
      'Architect (BORAQS)',
      'Structural engineer (EBK)',
      'Quantity surveyor',
      'Geotechnical technician (trial pits)',
      'NCA-registered building contractor',
      'Lead mason (foreman)',
      'Plumber',
      'Licensed electrician'
    ],
    tier2_midRiseApartments: [
      'Lead architect and physical planner',
      'Geotechnical engineer (core drilling, SPT)',
      'Structural engineer',
      'Civil engineer',
      'Electrical engineer',
      'Mechanical & plumbing engineer (water storage, booster pumps, solar water heating, fire hose reels)',
      'NEMA-registered EIA lead expert',
      'Project manager',
      'Main contractor (class by contract value)',
      'Lift installers',
      'Licensed borehole contractor'
    ],
    tier3_corporateAndHighRise: [
      'Principal architect and facade specialist',
      'High-rise structural engineer',
      'Commercial QS (FIDIC / JBCC)',
      'HVAC engineer',
      'ICT and telecoms engineer',
      'Acoustic consultant',
      'Fire protection engineer',
      'Energy auditor (EPRA-licensed)',
      'NCA 1 main contractor'
    ],
    tier4_heavyIndustrial: [
      'Process chemical engineer',
      'Piping stress engineer',
      'Heavy civil and geotechnical engineer (machine foundations)',
      'Instrumentation and control engineer',
      'Hazardous-area electrical engineer',
      'Safety and loss prevention engineer (HAZOP)',
      'Environmental and regulatory compliance lead',
      'NCA 1 specialist engineering contractor',
      'Coded welders',
      'NDT technicians',
      'Industrial insulators and riggers'
    ]
  },
  sectorPacks: [
    {
      id: 'residential',
      label: 'Residential',
      types: ['Bungalow', 'Maisonette', 'Villa', 'Townhouse', 'Apartments', 'Rental units', 'Student hostel', 'Gated estate'],
      specialSystems: ['Solar water heating where hot water demand meets regulatory threshold', 'Rainwater harvesting and storage tanks', 'Septic tank / biodigester or trunk sewer connection', 'Parking ratios per county bylaws', 'Hostel sanitation and fire escape ratios'],
      keyApprovals: ['county-planning', 'county-works', 'nca', 'nema', 'kplc'],
      milestoneTemplate: ['Setting out and excavation', 'Foundation footing & DPC', 'Substructure slab casting', 'Superstructure walling and columns', 'Roof framing & cladding', 'Doors, windows and MEP rough-in', 'Plastering, floor tiling and finishes', 'External works & drainage', 'Final inspection and handover'],
      source: 'Kenya National Building Regulations & BORAQS Practice Notes',
      confidence: 'medium',
      lastVerifiedAt: '2026-03-01',
      verifyAt: 'nca.go.ke'
    },
    {
      id: 'healthcare',
      label: 'Healthcare and Medical',
      types: ['Dispensary or clinic', 'Dental clinic', 'Diagnostic imaging centre', 'Laboratory', 'Pharmacy', 'Hospital', 'Nursing home', 'Medical aesthetics clinic'],
      extraProfessionals: ['Architect with healthcare planning experience', 'Medical gas engineer', 'Biomedical equipment planning engineer', 'Infection prevention consultant', 'Radiation shielding specialist (for X-ray, CT)', 'Fire engineer', 'ICT and nurse-call integrator'],
      specialSystems: ['Medical gas and vacuum pipeline (MGPS)', 'Backup generator with seamless UPS for operating theatres and ICUs', 'HVAC with positive/negative pressure regimes and HEPA filtration', 'Biomedical hazardous waste handling and effluent neutralization', 'Lead-lined walls and doors for radiological imaging rooms (KNRA certified)', 'Seamless antimicrobial vinyl flooring and washable wall finishes', 'Accessible barrier-free patient flow separation'],
      keyApprovals: ['county-planning', 'county-works', 'county-fire', 'nema', 'health-reg', 'knra', 'ppb', 'doshs'],
      constructionSafetyNotes: ['Infection control risk assessment (ICRA) when working near active patient areas', 'Airtight dust barrier partitions and negative air pressure machines', 'Noise and vibration mitigation near sensitive diagnostic equipment'],
      milestoneTemplate: ['Design and statutory approvals', 'Substructure and radiation vaults', 'Reinforced frame structure', 'Shell and watertight envelope', 'MEP, medical gas & HVAC rough-in', 'Cleanroom & theatre antimicrobial fit-out', 'Diagnostic equipment installation and lead shielding test', 'Commissioning & air balancing tests', 'KMPDC / KNRA licensing inspections', 'Handover'],
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Ministry of Health & KMPDC standards'
    },
    {
      id: 'beauty-wellness',
      label: 'Beauty, Salon, Spa and Wellness',
      types: ['Salon', 'Barbershop', 'Nail bar', 'Spa and massage', 'Gym and fitness studio', 'Yoga studio', 'Cosmetic clinic'],
      extraProfessionals: ['Interior designer (lead)', 'Architect where structural layout changes', 'Electrical engineer / licensed electrician for high-draw salon equipment', 'Plumber for backwash basins and drainage with chemical hair traps', 'HVAC / mechanical ventilation designer'],
      specialSystems: ['Wet-area multi-coat waterproofing and R11 anti-slip flooring', 'Hot water storage sized to peak salon simultaneous washing', 'Active mechanical extraction for acetone and chemical fumes', 'Dedicated sub-circuits for hood dryers, steamers, and sauna heaters', 'High CRI (Color Rendering Index >90) natural lighting', 'Acoustic attenuation for treatment suites', 'Hazardous cosmetic chemical containment', 'Fire exits and powder/CO2 extinguishers'],
      keyApprovals: ['county-planning', 'county-health', 'county-fire'],
      materialsHighlights: ['Moisture-resistant green plasterboards and epoxy grouting', 'Washable satin antimicrobial finishes', 'Slip-resistant commercial vinyl or textured porcelain tile', '304 stainless steel or ceramic basin fixtures'],
      milestoneTemplate: ['Interior design layout and 3D schematic', 'Demolition and wet service trenching', 'Electrical high-load and plumbing rough-in', 'Acoustic partitions, ceilings and tanking waterproofing', 'Anti-slip flooring and wall tiling', 'Cabinetry, salon styling stations and mirrors', 'Air testing and county health inspection', 'Final handover'],
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'County Public Health bylaws'
    },
    {
      id: 'hospitality',
      label: 'Hospitality and Food',
      types: ['Restaurant', 'Bar and club', 'Hotel or lodge', 'Short-stay serviced apartments', 'Commercial central kitchen'],
      extraProfessionals: ['Commercial kitchen consultant', 'Acoustic engineer (clubs and entertainment)', 'Fire protection engineer', 'Landscape architect', 'Swimming pool & water features engineer'],
      specialSystems: ['Stainless steel commercial canopy extraction with Ansul fire suppression', 'Multi-chamber grease traps and BOD effluent pre-treatment', 'Walk-in cold rooms and blast chillers', 'Centralized LPG bulk storage and gas leak detection shut-off valves', 'Soundproofing and acoustic baffles', 'Universal guest accessibility and ramps'],
      keyApprovals: ['county-planning', 'county-fire', 'county-health', 'alcohol', 'tra', 'nema'],
      milestoneTemplate: ['Concept and physical planning', 'Civil works and kitchen underground drainage', 'Structural frame & external envelope', 'Cold room and MEP rough-in', 'Kitchen equipment hookup and extraction installation', 'Dining finishes, lighting and acoustic walling', 'County public health food hygiene clearance', 'TRA star rating and handover'],
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Tourism Regulatory Authority (TRA)'
    },
    {
      id: 'education',
      label: 'Education',
      types: ['ECDE or nursery', 'Primary or secondary school', 'College or university', 'Science laboratory', 'Student hostel'],
      specialSystems: ['Sanitation ratios (toilets per pupil per Ministry of Education guidelines)', 'Multiple wide fire escapes and clear muster assembly points', 'Child-safe non-toxic playground surfacing and safety rails', 'Science lab fume cupboards, acid-resistant drainage, and emergency showers', 'Universal barrier-free wheelchair access to all classrooms'],
      keyApprovals: ['county-planning', 'county-works', 'county-fire', 'moe', 'county-health'],
      milestoneTemplate: ['Masterplan and zoning approval', 'Foundation and ground slab', 'Classroom blocks superstructure', 'Roofing and ceiling acoustics', 'Doors, safety windows, and electrical rough-in', 'Plastering, painting, and durable terrazzo flooring', 'Ablution blocks and water storage', 'MOE quality assurance inspection', 'Handover'],
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Ministry of Education Safety Standards Manual'
    },
    {
      id: 'commercial-office-retail',
      label: 'Commercial, Office and Retail',
      types: ['Office block', 'Corporate tower', 'Shopping centre', 'Retail shop fit-out', 'Petrol service station', 'Mixed-use commercial'],
      extraProfessionals: ['Facade and curtain-wall specialist', 'HVAC engineer (VRF or chilled water)', 'ICT and BMS automated controls engineer', 'Fire protection specialist', 'EPRA-licensed energy auditor', 'Acoustic consultant'],
      specialSystems: ['Double-glazed low-E thermal curtain walling', 'Central energy-efficient variable refrigerant flow (VRF) HVAC', 'Structured category 6A cabling and server room cold aisles', 'Automatic wet-pipe sprinkler grid and smoke exhaust shafts', 'Basement multi-level parking with carbon monoxide ventilation', 'High-speed destination-dispatch passenger lifts'],
      keyApprovals: ['county-planning', 'county-works', 'county-fire', 'nema', 'epra', 'doshs', 'kplc'],
      milestoneTemplate: ['Excavation and shoring basement walls', 'Raft foundation and retaining walls', 'Suspended slab casting (levels 1-N)', 'Curtain wall facade glazing', 'Central MEP, lift shafts, and generator installation', 'Floor screeds, ceiling tiles, and partition grids', 'BMS and fire alarm integration testing', 'Occupation certificate and handover'],
      source: 'BORAQS / EBK Corporate Practice Guidelines',
      confidence: 'medium',
      lastVerifiedAt: '2026-02-20',
      verifyAt: 'NCA Technical Audit Directorate'
    },
    {
      id: 'agribusiness',
      label: 'Agribusiness',
      types: ['Commercial greenhouse', 'Cold storage and packhouse', 'Dairy processing unit', 'Poultry and livestock housing', 'Agro-processing plant', 'Grain storage godown'],
      specialSystems: ['Precision climate control and insulated sandwich panel cold chain', 'Bio-digester manure handling and washdown effluent treatment', 'Biosecurity airlocks, footbaths, and barrier zones', 'Borehole water sourcing with UV filtration and high-volume storage', 'HACCP food-grade stainless steel surfaces and washable walls'],
      keyApprovals: ['county-planning', 'nema', 'wra', 'kebs', 'agri-regs'],
      milestoneTemplate: ['Topographical site plan and drainage', 'Hardcore foundation and heavy-duty slab', 'Steel portal frame erection', 'Insulated panel installation', 'Cold room refrigeration and MEP rough-in', 'Epoxy flooring and drainage channels', 'KEPHIS / Dairy Board compliance review', 'Commissioning and handover'],
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Kenya Dairy Board / KEPHIS'
    },
    {
      id: 'industrial',
      label: 'Industrial and Manufacturing',
      types: ['Factory', 'Warehouse or godown', 'Cold room depot', 'Engineering workshop', 'Oil or vegetable-oil refinery', 'Fuel depot and storage'],
      extraProfessionals: ['Process chemical engineer', 'Piping stress and flexibility engineer', 'Instrumentation and control (I&C) engineer', 'Hazardous-area ATEX electrical engineer', 'Safety and loss prevention engineer (HAZOP / QRA)', 'Environmental compliance lead', 'ASNT-certified NDT technicians', 'ASME IX coded welders'],
      specialSystems: ['Dynamic heavy machinery foundations and vibration dampeners', 'Process piping with 100% radiographic weld testing', 'PLC / DCS automated safety instrumented systems', 'ATEX explosion-proof electrical switchgear', 'Emergency shutdown (ESD), flare stacks, and aqueous foam deluge', 'Secondary chemical containment bund walls and API oil-water separators'],
      documents: ['Process Flow Diagrams (PFD) and P&IDs', 'Pressure vessel design ASME Section VIII calculations', 'Quantitative Risk Assessment (QRA) and HAZOP records', 'Blast-radius zoning maps', 'KEBS material compliance logs', 'Mill test certificates (MTC 3.1)'],
      keyApprovals: ['county-planning', 'nema', 'epra', 'doshs', 'wra', 'kebs', 'county-fire'],
      milestoneTemplate: ['Geotechnical bedrock testing and piling', 'Heavy machine plinths and retaining bunds', 'Structural steel portal frame erection', 'Process vessel rigging and pipe fabrication', 'NDT weld inspections and hydrostatic testing', 'Hazardous electrical wiring and DCS calibration', 'Fire suppression and foam tests', 'DOSHS statutory plant registration', 'Final commissioning and handover'],
      source: 'EPRA Petroleum Rules & DOSHS Factories Act',
      confidence: 'medium',
      lastVerifiedAt: '2026-02-15',
      verifyAt: 'epra.go.ke / doshs.go.ke'
    },
    {
      id: 'ict-data-centre',
      label: 'ICT and Data Centres',
      types: ['Tier II/III Server room', 'Colocation data centre', 'Telecom base transceiver station (BTS)'],
      specialSystems: ['N+1 or 2N redundant diesel generators and flywheel/lithium UPS', 'Hot/cold aisle containment with in-row precision cooling units (CRAC)', 'FM-200 / Novec 1230 clean agent gaseous fire suppression', 'Anti-static raised access flooring and copper grounding busbars', 'Multi-factor biometric access controls and CCTV telemetry'],
      keyApprovals: ['county-planning', 'ca', 'kplc', 'county-fire'],
      milestoneTemplate: ['Civil shell construction', 'Raised floor and Faraday shielding', 'Electrical transformer and UPS installation', 'CRAC precision cooling ducting', 'Gaseous fire suppression pipework', 'Server rack installation and fiber patching', 'Thermal load testing (heat bank test)', 'Handover'],
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Communications Authority of Kenya (CA)'
    },
    {
      id: 'energy',
      label: 'Energy and Utilities',
      types: ['Commercial solar PV installation or farm', 'Borehole deep well and reticulation', 'Biogas energy plant', 'Electrical substation'],
      specialSystems: ['Commercial solar PV inverters and charge controllers', 'High-voltage grid transformers and switchgear', 'Submersible borehole pump reticulation and storage', 'SCADA remote telemetry monitoring'],
      keyApprovals: ['epra', 'nema', 'wra', 'kplc'],
      milestoneTemplate: ['Solar resource survey or hydrological test', 'Civil foundations and ballast mounting', 'Panel array / borehole casing installation', 'Inverter and transformer installation', 'Grid interconnect testing with KPLC / EPRA', 'Final commissioning'],
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Energy and Petroleum Regulatory Authority (EPRA)'
    },
    {
      id: 'civil',
      label: 'Civil and Infrastructure',
      types: ['Access road and paving', 'Box culvert and bridge', 'Stormwater drainage canal', 'Water and trunk sewer pipelines', 'Perimeter boundary stone wall'],
      specialSystems: ['Subgrade geogrid stabilization and heavy road compaction', 'Reinforced concrete box culverts and stormwater canals', 'Bitumen emulsion tack coating and asphalt wearing course', 'Deep trench shoring for water and sewer trunk mains'],
      documents: ['Hydrological and catchment survey', 'Concrete and asphalt mix design reports', 'Borrow pit environmental clearances', 'Land acquisition and road reserve maps', 'Traffic diversion and management plan', 'Utility relocation permits (KPLC, water, fiber)'],
      keyApprovals: ['roads', 'nema', 'nca', 'utilities', 'wra'],
      milestoneTemplate: ['Survey alignment and setting out', 'Earthworks cut-and-fill to subgrade', 'Sub-base and base layer compaction', 'Drainage culverts and kerb stones', 'Asphalt paving / stone block pitching', 'Road signage and road markings', 'Final inspection and handover'],
      source: 'KeNHA / KURA Civil Engineering Standards',
      confidence: 'medium',
      lastVerifiedAt: '2026-03-01',
      verifyAt: 'kenha.co.ke'
    },
    {
      id: 'religious-community',
      label: 'Religious and Community',
      types: ['Church and sanctuary', 'Mosque and minaret', 'Community social hall', 'Sports pavilion'],
      specialSystems: ['Assembly occupancy wide outward-opening panic escape doors', 'Acoustic reverberation treatment and line-array audio cabling', 'Natural cross-ventilation and high-volume low-speed (HVLS) fans', 'Accessible ramps and ablution facilities'],
      keyApprovals: ['county-planning', 'county-works', 'county-fire'],
      milestoneTemplate: ['Foundation and columns', 'Long-span roof trusses', 'Walling and fenestration', 'Acoustic ceiling panels', 'Flooring and sanctuary fit-out', 'Sound and lighting commissioning', 'Occupation permit and handover'],
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'County Physical Planning'
    }
  ],
  safety: {
    ppeMatrix: [
      { item: 'Industrial hard hat', spec: 'EN 397 or equivalent KS', when: 'Everyone inside site perimeter at all times' },
      { item: 'Safety footwear', spec: 'Steel toe-cap and midsole puncture resistance, EN ISO 20345', when: 'All field personnel on active site' },
      { item: 'High-visibility vest', spec: 'Class 2 retro-reflective fluorescent', when: 'All personnel near machinery, mobile plant and vehicle traffic' },
      { item: 'Full-body fall arrest harness', spec: 'EN 361 with double lanyard and energy absorber', when: 'Work above 2 metres, scaffold erection, steelwork, roof work' },
      { item: 'Eye and face protection', spec: 'Impact goggles or welding face shields, EN 166', when: 'Grinding, drilling, stone cutting, chemical mixing, arc welding' },
      { item: 'Respiratory protection', spec: 'N95 dust masks or chemical cartridge respirators', when: 'Dry cement handling, aggregate mixing, spray painting, demolition' },
      { item: 'Heavy-duty gloves', spec: 'Chrome leather or chemical-resistant nitrile', when: 'Steel fixing, concrete handling, chemicals, material handling' },
      { item: 'Hearing protection', spec: 'Ear defenders or foam plugs, EN 352-1', when: 'Operating concrete breakers, cutters, heavy compactors, generators' }
    ],
    siteDemarcation: {
      hoarding: 'About 2.4 m solid corrugated sheet hoarding in urban and built-up areas; sturdy chain-link fencing with shade netting in rural sites',
      tape: 'Red-and-white or black-and-yellow heavy-duty hazard tape for edge drop-offs and exclusion zones',
      signage: [
        { en: 'DANGER: CONSTRUCTION SITE - AUTHORISED PERSONS ONLY', sw: 'HATARI: MAHALI PA UJENZI - WALE WALIORUHUSIWA TU' },
        { en: 'MANDATORY PPE: HARD HAT, BOOTS & HI-VIZ VEST REQUIRED', sw: 'NI LAZIMA KUVAA: KOFIA NGUMU, VIATU VYA USALAMA NA VESTI' },
        { en: 'NO UNAUTHORISED ENTRY - REPORT TO SITE OFFICE', sw: 'MARUFUKU KUINGIA BILA RUHUSA - RIPOTI OFISI YA SITE' },
        { en: 'FIRST AID STATION & EMERGENCY EYEWASH', sw: 'HUDUMA YA KWANZA NA MAHALI PA KUOSHA MACHO' },
        { en: 'EMERGENCY ASSEMBLY POINT', sw: 'MAHALI PA KUKUSANYIKA WAKATI WA DHARURA' }
      ],
      sanitation: 'Separate, clean temporary toilets for male and female workers provided before foundation works commence (ratios per public health regulations)'
    },
    protocols: [
      { hazard: 'Work at height', controls: ['Tubular steel scaffolding with double guardrails, toe-boards and base plates, designed and inspected weekly', 'Harness anchored to independent vertical/horizontal lifeline above 2 m', 'Daily scaffold green tagging inspection prior to morning shift'] },
      { hazard: 'Excavation', controls: ['Shoring, timber trench sheeting or 45-degree benching for excavations deeper than 1.5 m', 'Excavated soil spoil and plant kept at least 1.5 m away from trench lip', 'Ladders placed every 25 m of trench length for rapid egress', 'Underground utility strike scanning before any mechanized digging'] },
      { hazard: 'Hot work', controls: ['Written hot work permit issued by site safety officer', 'Dedicated fire watcher with 9kg dry powder extinguisher and fire blanket', 'Gas testing for flammable vapours before cutting or welding'] },
      { hazard: 'Confined space', controls: ['Entry permit required for manholes, tanks, and deep chambers', 'Continuous 4-gas atmosphere testing (O2, LEL, CO, H2S)', 'Mechanical forced ventilation and safety harness retrieval line'] },
      { hazard: 'Lifting operations', controls: ['Certified lifting plan for crane and hoist movements', 'Third-party certified crane operators and slinger/riggers', 'Inspected web slings, wire ropes and shackles with valid proof-load tags', 'Barricaded exclusion zone under swinging loads'] },
      { hazard: 'Electrical hazard', controls: ['Lock-Out / Tag-Out (LOTO) procedures on all isolation switches', 'Residual Current Device (RCD 30mA) protection on all temporary distribution boards', 'Work performed solely by EPRA-licensed electricians'] },
      { hazard: 'Dust and environmental noise', controls: ['Water spray dust suppression on demolition and aggregate piles', 'Restricted high-noise machinery working hours in residential neighbourhoods', 'Hearing conservation zones marked with signage'] },
      { hazard: 'Chemical and fuel handling', controls: ['Secondary containment drip trays under all diesel generators and fuel drums', 'Safety Data Sheets (SDS) displayed at chemical storage stores', 'Spill cleanup kit (absorbent pads and sand) kept on site'] }
    ],
    digitalSafetyFeatures: [
      'Digital worker safety induction with bilingual Swahili and English audio-visual briefing and 5-question comprehension quiz',
      'Daily morning toolbox talk scheduler with foreman mobile attendance capture',
      'Digital PPE issue register and weekly harness/scaffold inspection tracker',
      'Permit-To-Work (PTW) electronic approval workflow for high-risk operations',
      'Near-miss and incident camera reporting with instant GPS coordinates',
      'Sector-specific safety inspection checklists (Healthcare, High-Rise, Industrial, Residential)',
      'Digital safety score that can automatically block milestone payout approval when critical OSHA infractions remain open'
    ]
  },
  cement: [
    {
      id: 'cem-22.5',
      brand: 'Bamburi / Simba',
      product: 'Fundi / Masonry (as listed in notes)',
      grade: '22.5',
      use: 'Non-structural masonry walling, internal plastering, and floor screeds',
      unit: '50kg bag',
      priceKesMin: 630,
      priceKesMax: 680,
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Bamburi / National Cement Depot Feed'
    },
    {
      id: 'cem-32.5',
      brand: 'Bamburi / Simba / Savannah',
      product: 'Nguvu / Baraka / Blue (as listed in notes)',
      grade: '32.5',
      use: 'Ordinary reinforced concrete: domestic footings, ground slabs, columns, ring beams',
      unit: '50kg bag',
      priceKesMin: 720,
      priceKesMax: 850,
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Manufacturer Price Sheet'
    },
    {
      id: 'cem-42.5',
      brand: 'Bamburi / Duracem / Savannah',
      product: 'Powermax / Duracem (as listed in notes)',
      grade: '42.5',
      use: 'High-strength structural concrete, post-tensioned slabs, multi-storey columns, precast bridges',
      unit: '50kg bag',
      priceKesMin: 940,
      priceKesMax: 1180,
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Manufacturer Technical Data Sheet'
    }
  ],
  reinforcementSteel: {
    standard: 'BS 4449 / KS 02-1070: Deformed high-yield steel bars 500 N/mm²',
    brandsListed: ['Apex Steel', 'Devki Steel', 'Tononoka Steel', 'Prime Steel'],
    bulkKesPerTonne: {
      min: 95000,
      max: 120000,
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Apex / Devki Rolling Mill Feed'
    },
    retail12mBars: [
      { size: 'D8', use: 'Slabs, mesh distribution, and beam shear stirrups', kesMin: 600, kesMax: 650, kgPerMetre: 0.395 },
      { size: 'D10', use: 'Light residential columns, staircases and ground beams', kesMin: 900, kesMax: 950, kgPerMetre: 0.617 },
      { size: 'D12', use: 'Standard apartment columns, main beam reinforcement and footings', kesMin: 1300, kesMax: 1400, kgPerMetre: 0.888 },
      { size: 'D16', use: 'Heavy structural framing, basement retaining walls, multi-storey columns', kesMin: 2300, kesMax: 2600, kgPerMetre: 1.580 }
    ],
    calculators: {
      unitWeightKgPerMetre: 'Formula: d^2 / 162 (where d is nominal diameter in mm)',
      note: 'Use for preliminary steel take-off. Precise bar cutting lists and lap lengths must come from the registered structural engineer schedules.'
    }
  },
  aggregatesAndWalling: [
    {
      id: 'mat-stone-9x9',
      item: 'Machine-cut quarry stone 9x9 inch',
      origin: 'Thika / Juja / Ndarugo quarries',
      unit: 'Piece delivered on site',
      kesMin: 35,
      kesMax: 48,
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Quarry Association Daily Price List'
    },
    {
      id: 'mat-sand',
      item: 'Clean coarse river or manufactured sand',
      origin: 'Machakos / Makueni / Naivasha',
      unit: 'Tonne (truckload weighbridge)',
      kesMin: 2800,
      kesMax: 3800,
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Sand Harvesting Cooperative'
    },
    {
      id: 'mat-ballast',
      item: 'Machine-crushed ballast 3/4 inch aggregate',
      origin: 'Athi River / Mlolongo crushers',
      unit: 'Tonne',
      kesMin: 1850,
      kesMax: 2400,
      source: 'User-compiled research (AI-generated, unverified)',
      confidence: 'low',
      lastVerifiedAt: null,
      verifyAt: 'Crusher Plant Delivery Rate Sheet'
    }
  ],
  machinery: [
    { id: 'mach-mixer', tier: 'Residential', equipment: 'Concrete mixer 500L (Diesel)', use: 'Site casting of footings, slabs, and columns', rateKes: 'KES 5,000 - 7,000 per day', unit: 'per day', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Equipment Hire Yard' },
    { id: 'mach-poker', tier: 'Residential', equipment: 'Poker vibrator needle (Petrol)', use: 'Concrete vibration and void compaction', rateKes: 'KES 2,000 - 3,500 per day', unit: 'per day', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Equipment Hire Yard' },
    { id: 'mach-backhoe', tier: 'Apartments', equipment: 'Wheel backhoe loader (JCB / CAT)', use: 'Foundation trenching, site clearance, loading', rateKes: 'KES 6,500 - 8,500 per hour', unit: 'per hour', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Plant Operators Association' },
    { id: 'mach-compactor', tier: 'Apartments', equipment: 'Single-drum ride-on soil compactor 10T', use: 'Hardcore bed and road base compaction', rateKes: 'KES 25,000 - 35,000 per day', unit: 'per day', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Heavy Plant Rental' },
    { id: 'mach-hoist', tier: 'Apartments', equipment: 'Twin-cage passenger & material hoist', use: 'Vertical lifting of bricks, mortar, and crews', rateKes: 'KES 150,000 - 250,000 per month', unit: 'per month', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Scaffold & Hoist Leasing' },
    { id: 'mach-excavator-30t', tier: 'High-rise', equipment: '30-tonne tracked hydraulic excavator', use: 'Deep multi-level basement bulk earthworks', rateKes: 'KES 7,500 - 10,000 per hour', unit: 'per hour', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Heavy Earthmoving Kenya' },
    { id: 'mach-tower-crane', tier: 'High-rise', equipment: 'Tower crane (Top-slewing 50m jib)', use: 'Vertical materials and formwork lifting', rateKes: 'KES 450,000 - 750,000 per month', unit: 'per month', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Crane Engineering Services' },
    { id: 'mach-boom-pump', tier: 'High-rise', equipment: 'Stationary concrete boom pump (36m)', use: 'Pumping high-volume concrete to upper floors', rateKes: 'KES 120,000 - 180,000 per pour day', unit: 'per pour day', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Ready-mix Concrete Pumpers' },
    { id: 'mach-mobile-crane', tier: 'Industrial', equipment: '100 to 500-tonne mobile telescopic crane', use: 'Heavy pressure vessel and steel truss rigging', rateKes: 'KES 180,000 - 350,000 per day', unit: 'per day', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Heavy Lift Logistics Kenya' },
    { id: 'mach-ndt-unit', tier: 'Industrial', equipment: 'Mobile X-ray / Gamma NDT testing rig', use: 'Volumetric radiographic pipeline weld testing', rateKes: 'KES 40,000 - 75,000 per day', unit: 'per day', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Certified NDT Inspection Lab' },
    { id: 'mach-pipe-bender', tier: 'Industrial', equipment: 'Hydraulic heavy-wall pipe bending machine', use: 'Process piping and conduit pre-fabrication', rateKes: 'Project lease / custom', unit: 'project lease', source: 'User-compiled research (AI-generated, unverified)', confidence: 'low', lastVerifiedAt: null, verifyAt: 'Industrial Fab Yard' }
  ]
};
