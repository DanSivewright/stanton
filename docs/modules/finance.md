# Module: Finance

Normalized finance reporting data center (Odoo-shaped, Payload-owned).

**Delivery phase:** 1  
**Status (intake):** Active

---

## Purpose

Store report-ready financial data in Payload for dashboards, APIs, and downstream PPT/PDF generators. **Not** to rebuild full accounting or render board packs inside Payload core.

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

### `finance-report-sections`

| | |
|--|--|
| **Purpose** | Report section (Profitability, Debtors Aging, …) |
| **Structure** | Nested blocks on period OR separate collection — prefer **blocks on period snapshot** for v1 simplicity |
| **Alternative** | `finance-period-snapshots` parent with sections[] blocks |

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

### `debtors-aging` / `creditors-aging`

| | |
|--|--|
| **Purpose** | Bucketed aging rows |
| **Field groups** | bucket (30/60/90/120+), amount, party ref (text or customer link) |

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

## Open questions

- Final report list (expected client confirmation)
- Whether to use single `finance-period-snapshots` with nested sections vs many collections
- CRM-from-Odoo feasibility (flagged in intake)
