# Sales Performance Dashboard — Project Brief

**Client:** Stanton Group / PIMMS
**Owner:** Branden-Roy Unsworth (Mase Capital)
**Build Team:** TBD
**Status:** 🟡 BRIEF WRITTEN — Not yet in active build
**Last Updated:** 2026-06-01

---

## What It Is
Replaces the manual monthly SMART Goals PowerPoint process. Pulls from Pipedrive (targets + planned pipeline) and Odoo (actuals) to give a live view of sales performance by rep, team, and department.

**Core view:** Target vs Planned vs Actual — with discrepancy per person.

---

## Data Sources
| Source | What It Provides |
|--------|-----------------|
| Pipedrive | Sales targets, planned pipeline, activity targets (Hunt + Care) |
| Odoo | Actual sales (invoiced/closed) |

---

## Platform Scope

### Core View
**Target vs Planned vs Actual** — discrepancy surfaced per person, per team, per department.

### Reporting Dimensions
| Level | What It Shows |
|-------|--------------|
| Sales rep | Individual target vs planned vs actual + discrepancy |
| Team | Team-level rollup |
| Department | Department-level target and actual |
| Business-wide | Total monthly target vs forecast vs actual |

### Activity Tracking
- **Hunt** (KPA 1 — Sales Targets): maintaining existing business + new account growth
- **Care** (KPA 2 — Customer Care): care visits (target: 8/month), lead conversion (target: 30%+), satisfaction surveys

### Scope — In vs Out
| In Scope | Out of Scope |
|----------|-------------|
| Pipedrive — targets, planned pipeline, Hunt/Care activity | Manual SMART Goals PPT (this replaces it) |
| Odoo — actual invoiced/closed sales | Other CRM systems |
| Rep, team, department, business-wide views | Real-time deal tracking |
| PIMMS Group + Stanton Global | Other group companies (for now) |

---

## KPA Structure
| KPA | Focus | Key Targets |
|-----|-------|-------------|
| KPA 1 | Sales Targets | Within 5% of annual, 15% new business growth, forecast within 10% |
| KPA 2 | Customer Care | 8 care visits/month, 30%+ lead conversion, 80% satisfaction |
| KPA 3 | Profitability | GP1 targets per company |
| KPA 4 | Budget | Within 5% of sales dept expense budget |

---

## Phasing
**Phase 1 (MVP):** Pipedrive only — target, planned pipeline, Hunt/Care activity tracking. Surface discrepancy per rep.

**Phase 2:** Layer in Odoo actuals. Full Target vs Planned vs Actual view.

---

## Open Items (must resolve before build starts)
- [ ] Does Pipedrive have structured target fields per rep per month, or managed outside it?
- [ ] What constitutes "Hunt" vs "Care" in Pipedrive — tag, pipeline, or activity type?
- [ ] Who are the sales reps and how many teams?
- [ ] Output format — PPT, live dashboard, or both?

---

## Key Docs
- Developer Brief: `Sales Performance/` (written 2026-05-19)
- Reference PPTs: `Sales Performance/docs/` (PIMMS + Stanton SMART Goals presentations)
