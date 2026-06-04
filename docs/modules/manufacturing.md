# Module: Manufacturing

Real-time equipment monitoring and operator data for plastic injection moulding (3 factories, ~40 machines).

**Delivery phase:** 1  
**Status (intake):** Active — prior MVP at `pimms-dashboard-mvp.vercel.app` (reference only)

---

## Purpose

Replace WhatsApp hourly reporting with Payload-stored planning and production data. Tie every submission to **Employee ID** for HR performance feeds.

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

### `planning-snapshots`

| | |
|--|--|
| **Purpose** | Immutable snapshot when plan changes |
| **Relationships** | → `manufacturing-order` or machine group |
| **Field groups** | snapshotAt, source document, frozen plan fields |

### `production-snapshots` (round submissions)

| | |
|--|--|
| **Purpose** | Line manager / operator hourly (or 3-hourly) entry |
| **Relationships** | → `machine`, `manufacturing-order`, `employee` |
| **Field groups** | actualCycleTime, unitsProduced, rejects, stoppage flag, employeeId |
| **Hooks** | Validate consistency; update rollups; activity event |

### `stoppage-events`

| | |
|--|--|
| **Purpose** | Machine down with mandatory reason |
| **Relationships** | → `machine`, `employee` |
| **Hooks** | Queue notification job; optional maintenance job trigger |

### `reject-events` / embedded in snapshot

| | |
|--|--|
| **Note** | May be fields on snapshot unless separate analytics needed |

### `tool-change-events`

| | |
|--|--|
| **Purpose** | Tool change with allocation vs actual time |
| **Source** | Change request 2026-06-01 |

### `quality-checklists`

| | |
|--|--|
| **Purpose** | Configurable tests when mould on machine |
| **Field groups** | checklist template (blocks), sign-off, passed |

### `setter-sign-offs`

| | |
|--|--|
| **Purpose** | Photos + digital sign-off (name, employee ID, timestamp) |
| **Relationships** | → `media`, `employee`, `machine` |

### `one-on-one-scores` (manufacturing)

| | |
|--|--|
| **Purpose** | Weekly Accuracy / Runs by Employee ID |
| **Relationships** | → `employee`; feeds HR composite (Phase 2 link) |
| **Field groups** | week, accuracy, runs, manager |

---

## Payload-native notes

- Excel import via **import-export plugin** → normalized MOs; Excel file stored as `document`
- Payload owns data after import (not live Excel as DB)
- Planned cycle time hidden from operator UI (field-level admin condition)
- Custom admin view: tablet-friendly round entry (Phase 1 implementation)

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
