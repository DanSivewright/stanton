# Odoo Financial Reporting — Project Brief

**Client:** Stanton Group / PIMMS
**Owner:** Branden-Roy Unsworth (Mase Capital)
**Build Team:** Dan & Jordy (Buildmore London)
**Status:** 🟢 ACTIVE
**Last Updated:** 2026-06-01

---

## What It Is
Automates the finance department's monthly reporting pipeline. Currently 2–3 people manually pull data from Odoo each month and build a PowerPoint. This replaces that entirely.

**Data source:** Odoo (`pimmsv14.odoo.com`) → auto-generated reports/dashboards. All data from Odoo — no manual inputs.

---

## Platform Scope

### Report Sections
> ⚠️ **Additional reports incoming — confirmation expected 2026-06-02.** Current list is not exhaustive.

| Report | What It Delivers |
|--------|-----------------|
| Profitability | Revenue, gross profit, net profit — current vs prior period + same period last year |
| Debtors Aging | Outstanding debtors by bucket (30 / 60 / 90 / 120+ days) — local only |
| Creditors Aging | Outstanding creditors by aging bucket |
| Invoice vs Target | Actual invoiced revenue vs target, broken out by division |
| Wages & Salaries % | Total payroll as % of revenue |
| Financial Ratios | Gross margin %, net margin %, current ratio, quick ratio, debt-to-equity |
| Good vs Bad Debt | Debt classified by collectability |
| Sales Reporting | Target vs Forecast — actuals, targets, forecasting from Odoo |

All ratios and variances computed automatically from raw Odoo data — no manual entry required.

### Report Delivery
- **On-demand** — select company + reporting period → finished PowerPoint in minutes
- **Scheduled auto-delivery** — monthly report generated and emailed to named recipients (default: 12th of each month)
- **Weekly cadence** — same flow, shorter period selection
- **PDF export** available
- Board-pack grade output — formatted for executive and board consumption

---

## What's Been Built
- PIMMS Group demo PPT (9 slides) ✅
- Stanton Global demo PPT (8 slides) ✅
- Excel input template ✅
- Odoo API connection tested and live ✅
- CEO demo completed ✅ 2026-05-21

---

## Odoo API
- URL: `[REDACTED — Odoo instance host]`
- DB: `[REDACTED]`
- User: `[REDACTED — integration user]`
- UID: `[REDACTED]` | Auth: XML-RPC v2
- Covers all group companies: PIMMS JHB, Stanton Global, Medena, Pallchem, PIMMS UK, PIMMS USA, Tego Plastics

> **Note:** Credentials and instance identifiers were redacted in the committed intake copy. Store live values only in server environment configuration.

---

## Scope — In vs Out
| In Scope | Out of Scope |
|----------|-------------|
| PIMMS Group + Stanton Global **only** | All other group companies (Medena, Pallchem, UK, USA, Tego — excluded for now) |
| Monthly reports (weekly option to build in) | Costing (flagged as separate project) |
| Auto-generated PPT/dashboard | CRM (feasibility still to assess) |
| Board pack (4 board members) | Budget vs actual (no budgets in Odoo yet) |

---

## Open Items
- [ ] **Confirm full report list — expected 2026-06-02**
- [ ] Assess CRM feasibility from Odoo data
- [ ] Scope costing as separate standalone project
- [ ] Confirm hard deadline for monthly deck (12th of month — to verify)
- [ ] Confirm who receives the PPT (board, exco, line managers?)

---

## Key Docs
- Developer Brief: `Odoo Financial Modelling/Developer Briefs/Odoo Finance Automation — Developer Brief 2026-05-18.md`
- Demo PPTs: `Odoo Financial Modelling/` (PIMMS + Stanton demo files)
