# SPD Project Management App — Project Brief

**Client:** Stanton Group / PIMMS (Stanton pays, PIMMS uses)
**Owner:** Branden-Roy Unsworth (Mase Capital)
**Build Team:** Branden-Roy + Dan & Jordy (Buildmore London)
**Internal Lead (Client Side):** Conrad Eksteen — Head of Design & Development (conrad@pimms.co.za)
**Status:** 🔵 POC DUE END OF JUNE 2026
**Last Updated:** 2026-06-01

---

## What It Is
A brand new standalone application — completely separate from any other PIMMS platform. Digitises Stanton's full **Stanton Product Development (SPD) process**: the lifecycle for designing and manufacturing plastic injection moulded products, from initial opportunity through to post-launch.

Replaces their current manual/Planner3 process. Forces the team through a structured waterfall workflow — you cannot proceed to the next phase until sign-off is given.

**Why we're building it:** Previous vendor quoted R1M+ in year one. Rejected. PIMMS builds it for a fraction.

---

## Scope

### In Scope
| Feature | Detail |
|---------|--------|
| All 6 phases | Opportunity & Feasibility → Design → Engineering → Tooling → Market Ready → Post-Launch |
| 18 sub-stages | 3 per phase, each with entry/exit criteria, activities, RASCI, checklist |
| 5 gates | Sign-off checkpoints between phases — phase locks until approved |
| Data hub | Collect project data once; auto-generate documents from it (80% pull, 20% custom) |
| Change request module | In-scope (redo, no cost) + out-of-scope (costed, re-scoped, client sign-off) |
| Asset library | Every project = an asset (tool); full version history including all change requests |
| Client-facing forms | Select forms sent externally; client submits back into platform |
| Management dashboard | All open projects, status, on-track vs behind, pipeline metrics |
| Analytics + reporting | Average time per phase, bottlenecks, historical data; AI document validation |
| 8 roles | Business Lead, PDM, Product Director, Design Lead, Quality Lead, Manufacturing Lead, Tooling Lead, Process Lead |

### Out of Scope
| Item | Reason |
|------|--------|
| Connection to Manufacturing, HR, or Odoo platforms | Completely standalone — no cross-platform integration |
| Financial accounting or costing | Costing logic to be confirmed (finance team vs platform) |
| Customer portal | Internal tool only; clients interact via sent forms only |

---

## Core Platform Principles
- **Waterfall/linear** — phases lock until sign-off. No skipping ahead.
- **Data hub** — collect data once; generate all documents from it (80% auto / 20% custom input). No 170 documents from scratch.
- **Configurable steps** — non-negotiables always required; optional steps selected at project creation
- **Sign-off gates** — manager ticks off checklist, signs off, next phase unlocks
- **Change request module** — in-scope (redo, no cost) vs out-of-scope (costed, re-scoped, client sign-off mandatory)
- **Asset library** — every project = an asset (tool); full version history (original + all CRs)
- **Client-facing forms** — select forms sent to client externally; client submits; data lands in platform
- **AI** — document validation (flag insufficient/lazy inputs) + reporting analytics

---

## The 6 Phases

### Phase 1 — Opportunity & Feasibility
*Gate 1: Opportunity Review*

| Stage | Purpose | Key Output |
|-------|---------|-----------|
| 1.1 | Market & Problem Definition | Problem Statement, Value Prop, Volume/Price ranges |
| 1.2 | Commercial Feasibility | Commercial Feasibility Summary, Early pricing (±30–40%), Risk map |
| 1.3 | Product Opportunity Definition | Complete Product & Market Definition Pack → Gate 1 submission |

---

### Phase 2 — Design Foundation
*Gate 2: Design Freeze*

| Stage | Purpose | Key Output |
|-------|---------|-----------|
| 2.1 | Requirements & Architecture Definition | PDS v1, Functional Architecture, Material shortlist, BOM v1, KTF/KTQ |
| 2.2 | Concept Design & Concept Selection | Concept sketches, Early CAD, Concept Evaluation Summary, PDS v2 |
| 2.3 | Design Definition & Freeze Prep | CAD v1, BOM v2, PDS v3, Design Architecture Pack |

---

### Phase 3 — Engineering & Validation
*Gate 3: Tooling Release*

| Stage | Purpose | Key Output |
|-------|---------|-----------|
| 3.1 | Simulation Engineering (MFA/FEA) | MFA Report, FEA Report, Tolerance Analysis, Simulation & Validation Pack |
| 3.2 | Prototype Build & Validation | Prototype Parts, Test Results, CAD v3, PDS v4, Prototyping & Evidence Pack |
| 3.3 | Engineering DFM & Tooling Spec | Complete Tooling Spec (DFT), Tool BOM, RFQ Package, Tooling Definition Pack |

---

### Phase 4 — Tooling & Industrialisation
*Gate 4: Product Gate*

| Stage | Purpose | Key Output |
|-------|---------|-----------|
| 4.1 | Tool Build & T1/T2/Tn Trials | Trial Parts, Trial Reports, CPK Studies, Tooling Trial Pack |
| 4.2 | Production Engineering & Assembly Setup | Assembly Flow, Takt Time, Jig/Fixture Plan, Final BOM, Product Config Pack |
| 4.3 | Pilot Run & Production Validation | Part FAI, Product FAI, CPK, Pilot Run Report, Commercial Viability Pack |

---

### Phase 5 — Market Ready
*Gate 5: Market Ready Sign-Off*

| Stage | Purpose | Key Output |
|-------|---------|-----------|
| 5.1 | Final Documentation Assembly | Processing Book, Assemble Book, Mould Maintenance Book, QC Book, Product Life Book |
| 5.2 | Commercial Launch Pack Finalisation | Final Commercial Viability Pack, Datasheet, Marketing assets |
| 5.3 | Supply Chain & QA Release | Manufacturing Agreement, Supply Agreement, Surveillance Plans, Gate 5 Pack |

---

### Phase 6 — Post-Launch & Continuous Improvement
*No gate required*

| Stage | Purpose | Key Output |
|-------|---------|-----------|
| 6.1 | Post-Launch Surveillance | Tooling Surveillance Report, Production Stability Report, QC trend analysis |
| 6.2 | Field Performance & Customer Feedback | Field Performance Report, Customer Feedback Summary, ECO requests |
| 6.3 | Lessons Learned & Project Close-Out | Lessons Learned Pack, Close-Out Pack, Handover to PLM |

---

## 7 Roles (RASCI across all phases)
1. Business Lead (Sales / PLM / KAM)
2. PDM (Product Development Manager — coordination & governance)
3. Product Director (approval authority)
4. Design Lead (geometry, CAD, concept)
5. Quality Lead (compliance, CTQ, test methods)
6. Manufacturing Lead (assembly, production, takt)
7. Tooling Lead (DFT, gating, tool build)
8. Process Lead (simulation, machine parameters)

---

## 12 Core Deliverables
1. Product & Market Definition Pack
2. Design Architecture Pack
3. Simulation & Validation Pack
4. Prototyping & Evidence Pack
5. Tooling Definition Pack
6. Tooling Trial Pack
7. Product Configuration Pack
8. Industrialisation Readiness Pack
9. Production Validation Pack
10. Commercial Viability Pack
11. Project Controls Pack
12. Gate Review Pack

---

## Dashboards Required
- **Per-project progress view** — where am I in the process, timeline, on-track vs behind
- **Management overview** — all open projects, status, behind/on-track, open items
- **Analytics** — average time per phase, bottlenecks, historical completion data

---

## POC Plan
Build a proof-of-concept from `SPD_ProcessFlow.docx` (Conrad's source document). Present to Conrad + team at ~75% accuracy. Let them correct the 25%. Do not wait for perfect spec — get them in front of something and iterate.

---

## Open Items
- [ ] Book meeting with Conrad Eksteen (before end of June)
- [ ] Confirm costing logic for out-of-scope change requests (finance team vs platform?)
- [ ] Confirm volume of active projects typically running at once
- [ ] Confirm tech stack preference (previous vendor used Microsoft / Power BI)
- [ ] Build POC and present by end of June 2026
- [ ] Deliver cost estimate (low/med/high) by end of June 2026
- [ ] Move `SPD_ProcessFlow.docx` from Downloads to Drive

---

## Key Docs
- SPD Source Document: `C:\Users\brand\Downloads\SPD_ProcessFlow.docx` (move to Drive)
- Requirements Capture: `PIMMS Project Management/docs/PIMMS PM App — Requirements Capture 2026-06-01.md`
- Master Ecosystem Plan: `docs/PIMMS Ecosystem — Master Project Plan 2026-06-01.md`
