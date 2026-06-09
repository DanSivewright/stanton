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
| `spd-process-templates` | Yes — synthetic stand-in seeded; reconcile docx later | Done (SPD-001); content stand-in (SPD-002) |
| `spd-projects` | Yes — with embedded process snapshot at create | Done (SPD-003) |
| `spd-gate-sign-offs` | Yes — append-only event records | Done (SPD-004) |
| `spd-change-requests` | Yes | Done (SPD-005) |
| `tooling-assets` | Yes — minimal (name + version) | Done (SPD-006) |
| `spd-settings` | Yes | Done (SPD-007) |

**UI:** Default Payload admin + Wave 2 lightweight views: `beforeList` workflow summary on `spd-projects`; custom `/workflow` pipeline table (`src/components/admin/SpdProjectWorkflowView.tsx`). **Deferred:** full management dashboard (SPD-008–009), client forms (SPD-010), AI validation.

### Known gaps (remaining)

- **`gate.requiredRoles` quorum simplified** — sign-off `role` must match one of the gate's `requiredRoles` when defined; a **single** approved sign-off unlocks the next phase (not one approval per required role).
- **Document generation, client forms, full management dashboard** — deferred (see PLATFORM-ROADMAP.md).

### Gate enforcement (Wave 3 — 2026-06-09)

| Rule | Implementation |
|------|----------------|
| Checklist completion before approve | `src/hooks/spd/validateGateSignOff.ts` — blocks `decision: approved` when any checklist item in `currentPhase` is incomplete |
| Phase edit lock | `src/hooks/spd/lockPhaseEdits.ts` — blocks `checklistCompletion` edits for stages outside `currentPhase` |
| Role authorization | Approver `role` must be listed on the gate's `requiredRoles` when that list is non-empty |
| Quorum | **Simplified:** one approved sign-off unlocks; full multi-role quorum deferred |

### Assumptions (full-platform build 2026-06-09)

- Synthetic `1.0-synthetic` template is canonical until `SPD_ProcessFlow.docx` arrives; Conrad review is not a build gate.
- Optional stages: `optional` flag on template stages; `includedOptionalStages` on project at create filters snapshot.
- Checklist: per-project `checklistCompletion` array with `stageId`, `itemIndex`, `done`, `completedBy`, `completedAt`.
- Tooling: `previousVersion` relationship for lineage; CR links remain on change requests.
- Optional `relatedMould` → `moulds` when SPD tooling and floor mould are the same physical tool (nullable bridge; collections stay split until client confirms).
- `externalRefs` on `tooling-assets` (same hub pattern as foundations collections).
- Out-of-scope CR costing: `estimatedCost` fields only; no finance integration logic.

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
| **Implementation** | `src/collections/SpdGateSignOffs.ts`, `src/hooks/spd/validateGateSignOff.ts`, `src/hooks/spd/unlockPhaseOnApprove.ts` — append-only (no update/delete); validates checklist + role before approve; advances `currentPhase` on approve |

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
| **Relationships** | → optional `relatedMould` (`moulds`); ↔ `product` (phased); ← change requests |
| **Implementation** | `src/collections/ToolingAssets.ts` — name, version, status, optional `project`, `relatedMould`, `externalRefs` |

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

## Synthetic template stand-in (SPD-002 / BUI-288)

Until `SPD_ProcessFlow.docx` is delivered, boot seed publishes **`Stanton Product Development (Synthetic v1)`** (`version: 1.0-synthetic`) from the intake brief and [PHASE-1-MVP](../PHASE-1-MVP.md) structure: 6 phases, 18 stages, 5 gates, checklist items, deliverables, and gate RASCI. `spd-settings.defaultTemplate` points at this record; demo project **`SPD Demo — Sample Opportunity`** is created idempotently on first boot.

**Reconcile when docx arrives** — update the published template (or publish a new version) to match Conrad's source document; do not mutate in-flight project snapshots.

Implementation: `src/seed/spdSyntheticTemplate.data.ts`, `src/seed/spdProcessTemplate.ts`, wired in `payload.config.ts` `onInit`.

---

## Open questions

- Costing logic for out-of-scope change requests
- Volume of concurrent active projects
- Conrad POC feedback on process template accuracy (synthetic template unblocks demo; docx reconciliation still pending)
