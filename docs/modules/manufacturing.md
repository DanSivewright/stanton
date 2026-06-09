# Module: Manufacturing

Real-time equipment monitoring and operator data for plastic injection moulding (3 factories, ~40 machines).

**Delivery phase:** 1b option (client choice after SPD POC)  
**Status (intake):** Active — prior MVP at `pimms-dashboard-mvp.vercel.app` (reference only)

---

## Purpose

Replace WhatsApp hourly reporting with Payload-stored planning and production data. Tie every submission to **Employee ID** for HR performance feeds.

### WhatsApp Replacement MVP (Phase 1b — Manufacturing path)

Minimum shippable slice when client selects Manufacturing after SPD POC:

- Planning Excel → `manufacturing-orders` (import-export plugin)
- `production-snapshots` with `draft` → `submitted` (immutable after submit)
- Rejects and stoppage captured as **fields on snapshot** (not separate collections in MVP)
- Mould `shotCount` incremented on submit; warning at 15k (Maintenance module deferred)
- Default Payload admin — no custom tablet/TV views in MVP

**Deferred phase** (intake still applies): `planning-snapshots`, `stoppage-events` collection, notification jobs, `tool-change-events`, `quality-checklists`, `setter-sign-offs`, `one-on-one-scores`, CR 2026-06-01 features, custom admin views (MFG-009–010).

---

## Global

| Slug | Settings |
|------|----------|
| `manufacturing-settings` | OEE benchmark (70%), reject threshold (2%), 3-hourly snapshot times, shift hours |

---

## Collection cards

### `manufacturing-orders`

| | |
|--|--|
| **Purpose** | Active MO / job on a machine |
| **Relationships** | → `machine`, `product`, `site`; ← snapshots |
| **Field groups** | moNumber, orderQty, cycleTimePlanned, status, dates, remainQty, OEE fields |
| **Import** | Primary target for planning sheet import |

### `planning-snapshots` *(deferred phase)*

| | |
|--|--|
| **Purpose** | Immutable snapshot when plan changes |
| **Relationships** | → `manufacturing-order` or machine group |
| **Field groups** | snapshotAt, source document, frozen plan fields |
| **MVP** | Re-import planning CSV + attach source `document`; collection ships when plan history is required |

### `production-snapshots` (round submissions)

| | |
|--|--|
| **Purpose** | Line manager / operator hourly (or 3-hourly) entry |
| **Relationships** | → `machine`, `manufacturing-order`, `employee` |
| **Field groups** | actualCycleTime, unitsProduced, **rejects** (embedded), **stoppage flag + reason** (embedded), denormalized `employeeId`, `status` (draft/submitted) |
| **Hooks** | Validate employee ID on submit; increment mould shotCount; reject edits after `submitted` |
| **Resolved** | Rejects and stoppage are **fields on snapshot** for MVP — see [ADR 0002](../adr/0002-one-on-one-scores-manufacturing.md) for related cross-module decisions |

### `stoppage-events` *(deferred phase)*

| | |
|--|--|
| **Purpose** | Machine down as independent event record |
| **Note** | MVP uses stoppage fields on `production-snapshots`; promote to collection if analytics require per-event history |

### `tool-change-events` *(deferred phase — CR 2026-06-01)*

| | |
|--|--|
| **Purpose** | Tool change with allocation vs actual time |
| **Source** | Change request 2026-06-01 |

### `quality-checklists` *(deferred phase — CR 2026-06-01)*

| | |
|--|--|
| **Purpose** | Configurable tests when mould on machine |
| **Field groups** | checklist template (blocks), sign-off, passed |

### `setter-sign-offs` *(deferred phase — CR 2026-06-01)*

| | |
|--|--|
| **Purpose** | Photos + digital sign-off (name, employee ID, timestamp) |
| **Relationships** | → `media`, `employee`, `machine` |

### `one-on-one-scores` *(deferred phase)*

| | |
|--|--|
| **Purpose** | Weekly Accuracy / Runs by Employee ID — **canonical home: Manufacturing** |
| **Relationships** | → `employee`; HR reads for composite (Phase 2) |
| **Field groups** | week, accuracy, runs, manager |
| **Resolved** | No `one-on-one-sessions` in HR — see [ADR 0002](../adr/0002-one-on-one-scores-manufacturing.md) |

---

## Payload-native notes

- Excel import via **import-export plugin** → normalized MOs; Excel file stored as `document`
- Payload owns data after import (not live Excel as DB)
- Planned cycle time hidden from operator UI (field-level admin condition)
- Custom admin view: tablet-friendly round entry — **deferred phase**; use default Payload admin for MVP

---

## Out of scope (v1)

- IoT sensors
- Native mobile app
- ERP MO sync
- Predictive maintenance (Maintenance module)

---

## Source evidence

- [Manufacturing — Project Brief](../intake/Manufacturing%20Automation%20%E2%80%94%20Project%20Brief.md)
- [Manufacturing — Developer Brief 2026-05-15](../intake/Manufacturing%20Automation%20%E2%80%94%20Developer%20Brief%202026-05-15.md)
- [Maintenance brief](../intake/Machine%20Maintenance%20Tracker%20%E2%80%94%20Project%20Brief.md) — shot counts 15k warn / 20k service

---

## Open questions

- Excel access pattern (upload vs shared drive)
- Shift hours for remain days calculation
- Stoppage reason: free text vs enum
