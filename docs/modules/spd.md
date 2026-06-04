# Module: SPD (Stanton Product Development)

Waterfall product development: 6 phases, 18 stages, 5 gates, change requests, tooling assets.

**Delivery phase:** 1 (POC due end of June 2026 per intake)  
**Note:** Intake says standalone — **ecosystem decision** overrides: shared Payload app with bounded module and phased integrations.

---

## Purpose

Digitise SPD process; gate-enforced progression; data hub for document generation; management dashboards and analytics.

---

## Global

| Slug | Settings |
|------|----------|
| `spd-settings` | Pointer to default `spd-process-templates` record |

---

## Collection cards

### `spd-process-templates`

| | |
|--|--|
| **Purpose** | Versioned canonical process (6 phases × 3 stages, gates, RASCI) |
| **Structure** | Nested **blocks/arrays**: phases → stages → checklist items, deliverables, gate definitions, role responsibilities |
| **Nested Docs** | Only if same-collection phase tree needed — prefer blocks for v1 |
| **Field groups** | version, status (draft/published), effectiveDate |

### `spd-projects`

| | |
|--|--|
| **Purpose** | Live project instance |
| **Relationships** | → `company`, `customer`, `contacts`, `tooling-asset`, `product` (optional); → template ref |
| **Field groups** | name, currentPhase, onTrack, dates |
| **Snapshot** | Embedded copy of template structure at creation — **do not mutate** when template updates |

### `spd-gate-sign-offs`

| | |
|--|--|
| **Business term** | Gate Sign-Off |
| **Purpose** | Approval event unlocking next phase |
| **Field groups** | gateId, approver, role, decision, comments, evidence documents |
| **Hooks** | Update project phase lock state; activity event |

### `spd-change-requests`

| | |
|--|--|
| **Purpose** | In-scope redo vs out-of-scope (costed, client sign-off) |
| **Relationships** | → `spd-project`, `tooling-asset`, documents |
| **Field groups** | classification, impact, cost fields, approval status |

### `tooling-assets`

| | |
|--|--|
| **Business term** | Tooling Asset |
| **Purpose** | Project output / tool with version history |
| **Relationships** | ↔ `product`, `mould` (phased); ← change requests |

### `spd-client-form-submissions` (optional)

| | |
|--|--|
| **Purpose** | External client form data landing in platform |
| **Field groups** | formType, payload JSON or structured fields, submittedAt |

---

## Roles (from intake — access TBD)

Business Lead, PDM, Product Director, Design Lead, Quality Lead, Manufacturing Lead, Tooling Lead, Process Lead — map to User scopes at implementation.

---

## Payload-native notes

- Gate sign-off = explicit event collection, not checkbox only
- AI document validation — Phase 2+ hook/job
- Custom admin: project progress, gate queue, management dashboard views
- Client-facing forms — API endpoint or public form → `spd-client-form-submissions`

---

## Out of scope (v1 POC)

- Deep Manufacturing/Odoo/HR runtime dependencies
- Full costing engine (finance team may own)
- Customer portal (forms only)

---

## Source evidence

- [SPD Project Management App — Project Brief](../intake/SPD%20Project%20Management%20App%20%E2%80%94%20Project%20Brief.md)

---

## Open questions

- Costing logic for out-of-scope change requests
- Volume of concurrent active projects
- Conrad POC feedback on process template accuracy
