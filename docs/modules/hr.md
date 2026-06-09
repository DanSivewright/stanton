# Module: HR (Performance & Organogram)

People performance hub — **not** a full HRIS.

**Delivery phase:** 2 (client deferred per intake — do not initiate without Trevor green light)  
**Prior art:** [stanton-global-hr-platform-handoff](../intake/stanton-global-hr-platform-handoff.md) — reference only

---

## Purpose

Organogram, performance contracts, scorecards, quarterly reviews, 1-on-1 rollups, and employee status visibility. Manufacturing (and later Sales) feed **operational metrics** by Employee ID; HR owns **composite performance view** while preserving source contributions.

---

## Global

| Slug | Settings |
|------|----------|
| `hr-settings` | Review cadence, rating band labels, default contract period |

---

## Collection cards

### `contract-templates`

| | |
|--|--|
| **Purpose** | Reusable contract/scorecard templates by role/company |
| **Field groups** | name, company, KPA/KPI structure (nested blocks), branding refs |
| **Admin** | Template library |

### `performance-contracts`

| | |
|--|--|
| **Purpose** | Employee-specific contract for a period — **separate collection** (not embedded unbounded arrays on Employee) |
| **Relationships** | → `employee`, → `contract-template`, → `documents` |
| **Field groups** | period, status (draft/submitted/approved/…), KPAs/KPIs (from template + overrides) |
| **Admin** | Employee tab is join UI; contracts query by `employee` |
| **Workflow** | Status fields; activity events deferred phase |

### `quarterly-reviews`

| | |
|--|--|
| **Purpose** | Manager review per employee per period |
| **Field groups** | scores 1–3 per KPI, weighted total, rating, AI summary (later) |
| **Status** | not_started → … → signed_off |

### Weekly 1-on-1 scores *(read-only in HR — canonical home in Manufacturing)*

| | |
|--|--|
| **Purpose** | HR composite rollup reads `one-on-one-scores` by Employee ID |
| **Resolved** | No `one-on-one-sessions` collection — see [ADR 0002](../adr/0002-one-on-one-scores-manufacturing.md) |
| **Phase** | Collection ships with Manufacturing path or HR milestone (deferred phase) |

### `performance-summaries` (Phase 2+)

| | |
|--|--|
| **Purpose** | AI-generated review summary text |
| **Deferred** | Schema placeholder only in scope |

---

## Simplified model (scoping decision)

- **Contract Templates** collection + **Employee** admin tab to select template and fill fields
- Avoid separate KPA Template / KPI Template collections unless template complexity requires
- SharePoint filing via jobs — metadata on `documents`

---

## Assumptions (full-platform build 2026-06-09)

- **Shipped despite Trevor gate:** `contract-templates`, `performance-contracts`, `quarterly-reviews`, `hr-settings` global.
- KPA/KPI structure as nested arrays on templates and contracts (no separate KPA collections).
- `one-on-one-scores` read from Manufacturing module; no HR-owned session collection.
- SharePoint filing and AI summary fields stubbed (`aiSummary` on reviews); jobs not built.
- Organogram via employee `manager` chain + department/team relationships on foundations.

## Out of scope (v1)

- Payroll, leave, benefits, recruitment
- SimplePay integration (Phase 2 nice-to-have)
- Bulk 300-employee generation (Phase 4 in intake)
- Full HRIS sync

---

## Source evidence

- [PIMMS HR Platform — Project Brief](../intake/PIMMS%20HR%20Platform%20%E2%80%94%20Project%20Brief.md)
- [HR handoff](../intake/stanton-global-hr-platform-handoff.md)
- [Manufacturing brief](../intake/Manufacturing%20Automation%20%E2%80%94%20Project%20Brief.md) — 1-on-1 scores

---

## Open questions

- Trevor green light
- SharePoint paths and naming
- Organogram source system vs manual import
- Single home for 1-on-1 scores (HR vs Manufacturing collection)
