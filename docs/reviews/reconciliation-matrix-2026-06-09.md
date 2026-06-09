# Reconciliation Matrix — 2026-06-09

Synthesis of [Architect grill](./architect-grill-2026-06-09.md) and [Pragmatist grill](./pragmatist-grill-2026-06-09.md). **Intake** (`docs/intake/`) is authoritative; ecosystem overrides are documented in module specs, not intake edits.

**Decision rules applied:**

- Intake requires it → must appear in backlog; Pragmatist may defer **timing** only
- Integrity risk (overwrite reporting facts, cross-module ID breaks) → Architect wins on **shape**
- Custom admin view vs default admin → Pragmatist wins for v1 unless intake names specific UX
- New collection vs embedded blocks → Pragmatist default; Architect wins if independent query/history/permissions needed

---

## Disputed topics

| Topic | Intake requirement | Architect | Pragmatist | **Decision** | Spec updates |
|-------|-------------------|-----------|------------|--------------|--------------|
| **Phase 1 sequencing** | SPD POC June 2026; Finance active; Manufacturing active | Foundations + Mfg + Maint + Finance + SPD in parallel | 1a: Platform + Foundations slice + SPD; 1b: Finance **or** Manufacturing | **Pragmatist sequencing** with Architect integrity rules per slice. See [PHASE-1-MVP.md](../PHASE-1-MVP.md) | MASTER-SPEC §10, scope-map |
| **SPD POC minimum** | 6 phases, gates, change requests, tooling asset, ~75% template accuracy | Full SPD collections + gate immutability | 6 collections, default admin only, no custom views/forms/AI | **Agreed:** templates, projects, gate sign-offs, change requests, tooling assets, settings. Custom UI/forms/AI **deferred phase** | spd.md |
| **Access control** | HR role matrix; multi-company organogram | Phase 1 skeleton: roles + companyScope + hook discipline | Admin/Staff only; defer PLAT-007 | **Split:** `users.roles` + optional `companyScope` in 1a (minimal); full manager/direct-report matrix **deferred phase** (PLAT-007) | MASTER-SPEC §3.6, foundations.md |
| **`activity-events`** | Foundations card; LLM traceability | Defer until polymorphic contract | Defer entirely | **Defer to Phase 1.5+**; native audit + domain events (gate sign-offs) suffice for POC | foundations.md, payload-data-model.md, scope-map |
| **`finance-report-sections` collection** | Report sections table in Finance brief | Blocks on period + sectionKey on lines | Same | **Blocks on `finance-reporting-periods`**; no separate collection | finance.md, payload-data-model.md |
| **`reject-events`** | Rejects per machine per hour | Fields on snapshot for v1 | Fields on snapshot | **Embedded on `production-snapshots`** | manufacturing.md |
| **`stoppage-events` collection** | Machine down + notification | Separate event collection | Fields on snapshot for v1 | **Fields on snapshot** for Manufacturing MVP; separate collection **deferred phase** if analytics need it | manufacturing.md |
| **`maintenance-job-parts`** | Parts on job, no inventory | Embedded array | Embedded array when module ships | **`partsUsed[]` on `maintenance-jobs`**; no separate collection | maintenance.md |
| **`one-on-one-scores` home** | Mfg entry + HR rollup via Employee ID | Manufacturing-owned collection | Defer until HR; HR owns when built | **Deferred phase** (post-SPD / with Manufacturing or HR). When built: **Manufacturing-owned** `one-on-one-scores`; HR reads only. No `one-on-one-sessions` | manufacturing.md, hr.md |
| **`performance-contracts`** | Contract per employee per period | Separate collection | N/A (HR Phase 2) | **Separate collection** when HR ships (Phase 2) | hr.md |
| **`sales-performance-snapshots`** | Discrepancy dashboards | Defer | Defer; compute at read time | **Defer** | sales.md |
| **Maintenance module** | Shot trigger, jobs, parts | Phase 1 with idempotent hooks | Defer entire epic; mould counter on mould field | **Deferred to Phase 1b/2** after Manufacturing MVP. Mould `shotCount` increment on production snapshot in Manufacturing path | maintenance.md, scope-map |
| **Finance PPT / Odoo sync** | PPT on demand; all data from Odoo | Data hub v1; sync/PPT downstream | CSV import only; no PPT in repo | **Payload data hub v1** (CSV/import); PPT consumer and Odoo sync **deferred phase** (intake target state preserved) | finance.md, MASTER-SPEC §6 |
| **Custom admin views** | SPD dashboards; Mfg tablet UI | Phased per MASTER-SPEC | Post-POC / post-WhatsApp-MVP | **Default Payload admin for 1a**; custom views **deferred phase** | MASTER-SPEC §3.5, spd.md, manufacturing.md |
| **Nested Docs plugin** | N/A | Evaluate per tree | Do not install v1 | **Defer** (PLAT-004) | payload-data-model.md, scope-map |
| **Planning snapshots** | Snapshot on every plan change | Immutable collection on plan change | Re-import + document attachment | **Deferred phase** for Manufacturing MVP | manufacturing.md |
| **CR 2026-06-01 (Mfg)** | Tool change, quality, setter photos | Phase 1.5 | Deferred after WhatsApp loop | **Deferred phase** (after WhatsApp replacement milestone) | manufacturing.md |
| **SPD client forms** | Client-facing forms in scope | POC without forms OK | Defer | **Deferred phase** (post-Conrad POC) | spd.md |
| **Finance aging collections** | Debtors/Creditors aging reports | Separate aging collections | Typed lines on finance-report-lines | **Start as typed `finance-report-lines`**; split collections only if query pain | finance.md |
| **Period lock (Finance)** | Stable period facts for board packs | open/locked + immutable lines | Implied by data hub | **`status: open \| locked`**; lines/metrics frozen when locked; adjustment lines for corrections | finance.md |

---

## Fork table — resolved (Phase 1 relevant)

| Fork | **Chosen path** | Phase |
|------|-----------------|-------|
| `one-on-one-scores` vs `one-on-one-sessions` | `one-on-one-scores` only (Manufacturing-owned when built) | Deferred |
| `reject-events` vs embedded | Embedded on `production-snapshots` | 1b (Mfg) |
| `finance-report-sections` vs blocks | Blocks on `finance-reporting-periods` | 1b (Finance) |
| `maintenance-job-parts` vs array | `partsUsed[]` on job | 1b/2 (Maint) |
| `performance-contracts` vs Employee tab only | Separate collection | 2 (HR) |
| `sales-performance-snapshots` | Defer; read-time rollup | 2+ |
| `stoppage-events` vs snapshot fields | Snapshot fields for MVP | 1b (Mfg) |
| `activity-events` | Defer | 1.5+ |

---

## Intake traceability (Phase 1a — SPD POC)

| Phase 1a feature | Intake source |
|------------------|---------------|
| Process template (6 phases × stages) | SPD brief — Core Platform Principles, POC Plan |
| Project with template snapshot | SPD brief — Waterfall/linear, phases lock until sign-off |
| Gate sign-offs | SPD brief — 5 gates, sign-off checkpoints |
| Change requests (in/out of scope) | SPD brief — In Scope table |
| Tooling asset per project | SPD brief — Asset library |
| Shared Company, Customer, Contact | Ecosystem override MASTER-SPEC §4 |
| Document uploads | SPD brief — document generation hub |

---

## Approval status

- [x] Dual grill complete
- [x] Reconciliation matrix
- [x] [PHASE-1-MVP.md](../PHASE-1-MVP.md) written
- [x] Module spec fork language collapsed
- [x] Scope map trimmed for epic-level review
- [ ] **User epic-level approval** before Linear MCP issue creation

---

*Parent reconciliation pass — 2026-06-09*
