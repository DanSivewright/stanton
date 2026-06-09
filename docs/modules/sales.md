# Module: Sales Performance

Target vs planned vs actual sales performance by rep, team, and department.

**Delivery phase:** 2  
**Status (intake):** Brief written, not in active build

---

## Purpose

Payload owns normalized **Sales Targets**, **Sales Actuals**, **Sales Activities**, and **Sales Performance Periods**. Pipedrive/Odoo are data sources via manual import or future sync — not schema owners.

---

## Global

| Slug | Settings |
|------|----------|
| `sales-settings` | Hunt/Care default targets (8 visits, 30% conversion, etc.) |

---

## Collection cards

### `sales-performance-periods`

| | |
|--|--|
| **Business term** | Sales Performance Period |
| **Purpose** | Monthly (or agreed) performance window |
| **Relationships** | → `company` |
| **Field groups** | month, year, status |

### `sales-targets`

| | |
|--|--|
| **Purpose** | Targets per rep/team/department |
| **Relationships** | → `employee`, `team`, `department`, `period` |
| **Field groups** | revenueTarget, newBusinessTarget, activityTargets (Hunt/Care) |

### `sales-actuals`

| | |
|--|--|
| **Purpose** | Invoiced/closed actuals (from Odoo or manual) |
| **Relationships** | → `employee`, `period`, optional `product`/`customer` |
| **Field groups** | actualAmount, source (manual/odoo/import) |

### `sales-activities`

| | |
|--|--|
| **Purpose** | Hunt/Care activity counts |
| **Relationships** | → `employee`, `period` |
| **Field groups** | activityType (hunt/care), careVisits, conversions, satisfaction |

### `sales-performance-snapshots` *(deferred phase)*

| | |
|--|--|
| **Purpose** | Precomputed discrepancy rollup per rep for dashboards |
| **Note** | Add if query performance requires; else compute at read time |

---

## Phasing (from intake)

| Phase | Scope |
|-------|--------|
| 1 | Pipedrive-shaped targets + activities; discrepancy per rep |
| 2 | Odoo actuals layered in |

---

## Assumptions (full-platform build 2026-06-09)

- **Shipped:** `sales-performance-periods`, `sales-targets`, `sales-actuals`, `sales-activities`, `sales-settings` global.
- Pipedrive/Odoo field mapping not built; `source` enum on actuals supports future import.
- Discrepancy rollups computed at read time (no snapshot collection).
- Hunt/Care targets use defaults from `sales-settings` global.

### Admin view (SAL-007 — lightweight, 2026-06-09)

`beforeList` summary on `sales-performance-periods` (`src/components/admin/SalesDashboardBeforeList.tsx`): latest period label, revenue target vs actual, gap, attainment %, Hunt/Care visit counts, reps tracked. Full discrepancy dashboard UI remains deferred.

## Payload-native notes

- Import-export on targets/actuals/activities
- Link all rows to `employees` via Employee ID or relationship
- Canonical KPI language: **Sales KPI** in docs ([CONTEXT.md](../../CONTEXT.md))

---

## Out of scope (v1)

- Full CRM (deals, pipelines, stages)
- Real-time deal tracking
- Companies beyond PIMMS Group + Stanton Global (initially)

---

## Source evidence

- [Sales Performance Dashboard — Project Brief](../intake/Sales%20Performance%20Dashboard%20%E2%80%94%20Project%20Brief.md)

---

## Open questions

- Pipedrive: structured target fields per rep/month?
- Hunt vs Care: tag, pipeline, or activity type mapping
- Output: live dashboard only vs PPT replacement
