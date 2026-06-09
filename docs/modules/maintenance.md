# Module: Maintenance

Machine maintenance and service tracking; replaces legacy "Fix" app.

**Delivery phase:** 1b/2 (after Manufacturing WhatsApp MVP)  
**Boundary:** Separate module; shares `machines`, `moulds`, `employees`, `parts`, `documents`

---

## Purpose

Track service history, parts used, PO attachments, and machine-down workflows. Receive shot-count and machine-stopped triggers from Manufacturing.

---

## Global

| Slug | Settings |
|------|----------|
| `maintenance-settings` | Service interval (20k shots), warning (15k), default notification chain |

---

## Collection cards

### `parts`

| | |
|--|--|
| **Purpose** | Structured parts catalog (no inventory/stock in v1) |
| **Field groups** | name, partNumber, description, supplier (optional text) |

### `maintenance-jobs`

| | |
|--|--|
| **Purpose** | Service / repair work order |
| **Relationships** | → `machine`, optional `mould`; → `employee` (technician); ← line items |
| **Status** | open → in_progress → completed → cancelled |
| **Triggers** | manual; mould shot threshold; machine stopped (from Manufacturing) |
| **Field groups** | scheduledAt, completedAt, notes, downtime duration |

### Parts used on job *(embedded array — resolved)*

| | |
|--|--|
| **Purpose** | Parts used on a job |
| **Structure** | **`partsUsed[]` array on `maintenance-jobs`** — no separate `maintenance-job-parts` collection |
| **Field groups** | part (relationship), quantity, notes |

### `maintenance-pos`

| | |
|--|--|
| **Purpose** | PO attachment for a job |
| **Relationships** | → `documents` upload, → `maintenance-job`, → `machine` |

---

## Payload-native notes

- **No** inventory management collection in v1
- Hooks: on job complete → update mould service reset if applicable; activity event
- Jobs Queue: machine-down notifications per global chain

---

## Out of scope (v1)

- Predictive maintenance
- ERP inventory
- Data migration from Fix

---

## Source evidence

- [Machine Maintenance Tracker — Project Brief](../intake/Machine%20Maintenance%20Tracker%20%E2%80%94%20Project%20Brief.md)
- [Manufacturing brief](../intake/Manufacturing%20Automation%20%E2%80%94%20Project%20Brief.md) — integration bullets

---

## Open questions

- Standalone app vs Manufacturing sub-nav only (ecosystem: same Payload app, module group)
- Machine-down notification chain (Trevor/Conrad)
- Scope: moulds only vs all machinery
