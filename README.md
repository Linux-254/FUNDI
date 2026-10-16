# FUNDI - Construction Marketplace, Escrow & Budget Control Platform

> **Build with certainty.**  
> **F** - Find the right experts, crews, materials and machinery  
> **U** - Unite owner, contractor, experts and labour on one transparent project  
> **N** - Negotiate bids and contracts in the open  
> **D** - Deliver milestone by milestone, with evidence  
> **I** - Ironclad escrow so money only moves when work is proven  

---

## 1. Executive Summary & Architecture

FUNDI is a command-centre platform designed for property owners, diaspora builders, licensed contractors, registered professionals (BORAQS, EBK), and fundi artisan crews in East Africa.

### System Architecture Diagram
```
Client Tier (Vite + React 19 + TypeScript)
  ├── PWA / Browser (Tailwind CSS v4, Motion, Lucide)
  └── Data Adapter (src/lib/api.ts -> Local Storage Seed / Remote API)
        ↓
Edge Tier (Cloudflare Pages, Workers Edge Gateway, Turnstile, R2)
        ↓
Application Tier (Node 20+ Express Modular Monolith)
  ├── Identity & RBAC (ABAC policies)
  ├── Escrow Orchestration & Double-Entry Ledger
  ├── Project Blueprint & Milestone State Machine
  ├── Budget Guard (BoQ, Variations, Contingency)
  └── Statutory Compliance Engine (Kenya Seed Pack)
        ↓
Data Tier (MongoDB Atlas / Atlas Search / Encrypted Fields)
```

---

## 2. Documented Configuration Placeholders ({{DOUBLE_BRACES}})

All external partner and environment parameters are centralized in configuration:

| Placeholder | Context & Purpose | Sample / Fallback |
| :--- | :--- | :--- |
| `{{ESCROW_PARTNER}}` | CBK-licensed bank/trust partner holding funds under National Payment System Act | Stanbic Bank Nominees / NCBA Trust |
| `{{ESCROW_API_BASE}}` | Base endpoint for programmatic escrow custody instructions | `https://api.escrow-partner.co.ke/v1` |
| `{{KYC_PROVIDER}}` | Automated ID document liveness and business registration checks | Smile Identity / Metamap Africa |
| `{{LLM_PROVIDER}}` | Server-side Gemini API provider for brief drafting and contract summaries | Google Gemini API (`@google/genai`) |
| `{{ADR_PARTNER}}` | Independent Alternative Dispute Resolution arbitration center | Chartered Institute of Arbitrators (CIArb Kenya) |
| `{{TAM_SOURCE}}` | Kenya National Bureau of Statistics (KNBS) / NCA Construction Survey | Q3 2026 Economic Survey |
| `{{PILOT_METRICS}}` | Audited cohort performance figures for Seed / Series A | Q4 2026 Cohort Audit |
| `{{RATE_CARD}}` | Institute of Quantity Surveyors of Kenya (IQSK) building cost benchmarks | IQSK / BORAQS Q4 2026 Rate Card |
| `{{COMPANY_NAME}}` | Registered entity name under Kenya Companies Act 2015 | FUNDI Technology Ltd |
| `{{SUPPORT_EMAIL}}` | Platform operational support desk | `support@fundi.build` |
| `{{WHATSAPP_NUMBER}}` | Direct site hotline & USSD/WhatsApp fallback channel | `+254 700 000 000` |

---

## 3. Threat Model (STRIDE) & Security Highlights

1. **Custodial Fund Security (Elevation of Privilege / Tampering):**
   - FUNDI does not custody customer deposits directly. Funds sit in segregated trust bank accounts.
   - Payout releases require step-up authentication, verified GPS-tagged evidence, and independent QS sign-off.
2. **Anti-Circumvention & Privacy:**
   - Contact details are masked prior to contract signing.
   - PII and statutory national ID numbers are encrypted at rest under the Kenya Data Protection Act 2019 (ODPC).
3. **Double-Entry Audit Ledger:**
   - Every funding, release, retention holdback, and M-Pesa wage disbursement is recorded in an immutable, cryptographically hash-chained double-entry ledger.

---

## 4. Quickstart & Development

### Install & Run
```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Run TypeScript compile validation
npm run lint

# Build for production
npm run build
```

---

## 5. Key Demo Routes
- `/` - Landing Page with interactive architectural SVG elevation & Four Doors onboarding
- `/app/projects/proj-karen-villa` - Project Workspace with Word-style TOC Navigation, Project Blueprint cross-section, and Escrow Vault
- `/marketplace` - Construction Marketplace with BORAQS/EBK verified experts, NCA contractors, and machinery hire
- `/trust` - Escrow state machine & custody legal framework
- `/pricing` - Zero-fee owner model & contractor milestone success fee
- `/investors` - Gated Investor Demo Dashboard (Invite Code: `FUNDI-2026`)
- `/admin` - Cloudflare Access protected operations console & verification workbench
