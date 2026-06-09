# Module: Finance

Normalized finance reporting data center (Odoo-shaped, Payload-owned).

**Delivery phase:** 1b option (client choice after SPD POC)  
**Status (intake):** Active

---

## Purpose

Store report-ready financial data in Payload for dashboards, APIs, and downstream PPT/PDF generators. **Not** to rebuild full accounting or render board packs inside Payload core.

### Payload data hub MVP (Phase 1b — Finance path)

Minimum when client selects Finance after SPD POC:

- `finance-reporting-periods` with `sections[]` blocks and `status: open | locked`
- `finance-report-lines` with `sectionKey`; aging rows as typed lines (`lineType: aging`)
- `financial-metrics` recomputed when period open; frozen on lock
- CSV import via import-export plugin

**Intake tension (documented):** Finance brief says "all data from Odoo — no manual inputs." Ecosystem v1 uses **manual/import-first**; automated Odoo sync and zero-manual-entry are **deferred phase** target state. PPT generation and scheduled email are **downstream consumers**, not Payload core (FIN-007 deferred).

---

## Global

| Slug | Settings |
|------|----------|
| `finance-settings` | Default companies in scope, period cadence labels, default recipients (text) |

---

## Collection cards

### `finance-reporting-periods`

| | |
|--|--|
| **Business term** | Finance Reporting Period |
| **Purpose** | Month/week/custom reporting window |
| **Relationships** | → `company`; ← lines, metrics |
| **Field groups** | periodStart, periodEnd, periodType (monthly/weekly), status (open/locked) |

### Report sections *(embedded — not a collection)*

| | |
|--|--|
| **Purpose** | Report section (Profitability, Debtors Aging, …) |
| **Structure** | **`sections[]` blocks on `finance-reporting-periods`** — resolved; see [ADR 0001](../adr/0001-finance-sections-on-period.md) |
| **Lines** | `finance-report-lines` reference `period` + `sectionKey` string |

### `finance-report-lines`

| | |
|--|--|
| **Purpose** | Normalized line items (account, division, amount) |
| **Relationships** | → period, → company, optional section key |
| **Field groups** | label, amount, priorPeriodAmount, samePeriodLastYear, division |

### `financial-metrics`

| | |
|--|--|
| **Business term** | Financial Metric |
| **Purpose** | Computed ratios (margin %, current ratio, …) |
| **Field groups** | metricKey, value, comparison values |

### Aging rows *(typed lines in MVP)*

| | |
|--|--|
| **Purpose** | Bucketed aging rows (Debtors / Creditors) |
| **MVP** | `finance-report-lines` with `lineType: aging` and bucket enum |
| **Deferred** | Standalone `debtors-aging` / `creditors-aging` collections only if query volume requires split |

### `finance-targets`

| | |
|--|--|
| **Purpose** | Invoice vs target, division targets |
| **Field groups** | targetAmount, actualAmount, division |

### `odoo-sync-snapshots` (Phase 2+)

| | |
|--|--|
| **Purpose** | Optional raw sync audit when automated Odoo sync ships |
| **Note** | Deferred — not required for manual/import v1 |

---

## Payload-native notes

- Manual entry and import-export plugin for initial data load
- No direct Odoo from admin UI
- Downstream report apps read Payload REST/GraphQL/local API
- Automated sync: separate epic per [odoo-integration-handoff-excerpt](../intake/odoo-integration-handoff-excerpt.md)

---

## Report types (from intake — scope backlog)

Profitability, Debtors Aging, Creditors Aging, Invoice vs Target, Wages & Salaries %, Financial Ratios, Good vs Bad Debt, Sales Reporting — **full list confirmation pending**

---

## Out of scope (v1)

- Full journal/ledger/payment model
- Board pack rendering in Payload
- All group companies (Medena, UK, USA, …) — PIMMS + Stanton Global first
- Budget vs actual (no budgets in Odoo yet)

---

## Source evidence

- [Odoo Financial Reporting — Project Brief](../intake/Odoo%20Financial%20Reporting%20%E2%80%94%20Project%20Brief.md)
- [odoo-integration-handoff-excerpt](../intake/odoo-integration-handoff-excerpt.md)

---

## Period lock

When `finance-reporting-periods.status = locked`:

- `finance-report-lines` and `financial-metrics` are **immutable** (hook-enforced)
- Corrections via **adjustment lines** in an open period, or Admin unlock with audit reason
- Metrics recomputed on line changes only while period is `open`

## Open questions

- Final report list (expected client confirmation — FIN-008)
- CRM-from-Odoo feasibility (flagged in intake)
