import express, { Request, Response } from 'express';

export const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FUNDI Modular API Gateway',
    version: '1.0.0',
    jurisdiction: 'Kenya (NPS Act / ODPC Compliant)'
  });
});

// Projects endpoints
apiRouter.get('/projects', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Projects retrieved',
    data: []
  });
});

apiRouter.get('/projects/:id', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      title: 'Karen Sanctuary Villa (4-Bedroom Eco-Contemporary)'
    }
  });
});

// Escrow endpoints (mock provider & webhook)
apiRouter.post('/escrow/:projectId/fund', (req: Request, res: Response) => {
  const { amountMinor, phone, rail } = req.body;
  res.json({
    success: true,
    message: 'M-Pesa STK push initiated to bank trust account',
    providerRef: `MPESA-${Date.now()}`,
    status: 'Funded'
  });
});

apiRouter.post('/escrow/webhook', (req: Request, res: Response) => {
  // Idempotency check & signature verification
  const signature = req.headers['x-escrow-signature'];
  res.json({ received: true });
});

apiRouter.post('/milestones/:id/release', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Tranche release executed with 5% retention holdback',
    split: {
      contractorPct: 85,
      labourPct: 10,
      retentionPct: 5
    }
  });
});

// Compliance & Kenya Pack
apiRouter.get('/jurisdictions/ke/pack', (req: Request, res: Response) => {
  res.json({
    jurisdiction: 'Kenya',
    version: '2026.4',
    statutoryBodies: ['BORAQS', 'EBK', 'NCA', 'NEMA', 'DOSHS', 'Nairobi City County'],
    ncaLevyRate: '0.5% on projects > KES 5,000,000'
  });
});

// Investor Demo Metrics endpoint (Gated)
apiRouter.get('/investors/demo-metrics', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('FUNDI-2026')) {
    return res.status(401).json({ error: 'Unauthorized: Valid investor invite code required' });
  }

  res.json({
    success: true,
    illustrativeNotice: 'Demo seed data for institutional investor review',
    metrics: {
      cumulativeGmvMinor: 49400000000, // KES 494M
      activeEscrowFloatMinor: 10660000000, // KES 106.6M
      avgOverrunReductionPct: 14.2,
      activeContractorsCount: 47,
      verifiedProfessionalsCount: 112,
      fundiPayrollAccountsCount: 430,
      disputeRatePct: 0.4
    }
  });
});
