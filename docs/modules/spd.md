# Module: SPD (Stanton Product Development)

Waterfall product development: 6 phases, 18 stages, 5 gates, change requests, tooling assets.

**Delivery phase:** 1a (POC due end of June 2026 per intake)  
**Note:** Intake says standalone — **ecosystem decision** overrides: shared Payload app with bounded module and phased integrations.

---

## Purpose

Digitise SPD process; gate-enforced progression; data hub for document generation; management dashboards and analytics.

### POC minimum (June 2026 — Phase 1a)

| Collection | Required for POC | Status |
|------------|------------------|--------|
| `spd-process-templates` | Yes — import SPD_ProcessFlow.docx | Done (SPD-001) |
| `spd-projects` | Yes — with embedded process snapshot at create | Done (SPD-003) |
| `spd-gate-sign-offs` | Yes — append-only event records | Done (SPD-004) |
| `spd-change-requests` | Yes | Done (SPD-005) |
| `tooling-assets` | Yes — minimal (name + version) | Done (SPD-006) |
| `spd-settings` | Yes | Done (SPD-007) |

**UI:** Default Payload admin only. **Deferred phase:** custom dashboards (SPD-008–009), client forms (SPD-010), AI validation, Product/Mould links to Manufacturing.

---

## Global

| Slug | Settings |
|------|----------|
| `spd-settings` | Pointer to default `spd-process-templates` record (`src/globals/SpdSettings.ts`) |

---

## Collection cards

### `spd-process-templates`

| | |
|--|--|
| **Purpose** | Versioned canonical process (6 phases × 3 stages, gates, RASCI) |
| **Structure** | Nested arrays: `phases[]` → `stages[]` → checklist items, deliverables, gate group, RASCI assignments |
| **Nested Docs** | Only if same-collection phase tree needed — prefer blocks for v1 |
| **Field groups (1a)** | name, version, effectiveDate, `_status` (draft/published via Payload versions) |
| **Gate fields** | `gateId`, name, description, `requiredRoles` (SPD role enum) |
| **RASCI** | Per-stage array: role + responsibility (R/A/S/C/I) |

### `spd-projects`

| | |
|--|--|
| **Purpose** | Live project instance |
| **Relationships** | → `company`, `customer`, `contacts`, `tooling-asset`, `product` (optional); → template ref |
| **Field groups** | name, currentPhase, onTrack, dates |
| **Snapshot** | Embedded copy of template structure at creation — **do not mutate** when template updates |
| **Implementation** | `src/collections/SpdProjects.ts`, `src/hooks/spd/snapshotOnCreate.ts` — deep-copy on create; defaults template from `spd-settings` |

### `spd-gate-sign-offs`

| | |
|--|--|
| **Business term** | Gate Sign-Off |
| **Purpose** | Approval event unlocking next phase |
| **Field groups** | gateId, approver, role, decision, comments, evidence documents |
| **Hooks** | Update project phase lock state on approve; activity event writes deferred phase |
| **Implementation** | `src/collections/SpdGateSignOffs.ts`, `src/hooks/spd/unlockPhaseOnApprove.ts` — append-only (no update/delete); advances `currentPhase` on approve |

### `spd-change-requests`

| | |
|--|--|
| **Purpose** | In-scope redo vs out-of-scope (costed, client sign-off) |
| **Relationships** | → `spd-project`, `tooling-asset`, documents |
| **Field groups** | classification, impact, cost fields, approval status |
| **Implementation** | `src/collections/SpdChangeRequests.ts` — `in-scope-redo` / `out-of-scope-costed`; conditional cost + client sign-off group |

### `tooling-assets`

| | |
|--|--|
| **Business term** | Tooling Asset |
| **Purpose** | Project output / tool with version history |
| **Relationships** | ↔ `product`, `mould` (phased); ← change requests |
| **Implementation** | `src/collections/ToolingAssets.ts` — name, version, status, optional `project` link |

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
