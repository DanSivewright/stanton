# Intake Requirements Audit — 2026-06-09

**Goal of this audit:** Map every intake requirement to its implementation state in the Payload app, so we can answer one question honestly: *how far is Payload from achieving what the intake briefs ask for?*

**Framing:** Intake markdown is **spec evidence**, not CMS content. This audit measures the **operational platform** (Payload collections, globals, hooks, seeds), not whether the briefs themselves are stored anywhere.

**Method:** Each intake file → its requirements → status against `src/`. Canonical phasing comes from [PHASE-1-MVP.md](../PHASE-1-MVP.md), [MASTER-SPEC.md](../MASTER-SPEC.md), and the [reconciliation matrix](../reviews/reconciliation-matrix-2026-06-09.md). Deferrals here are **planned** (still in backlog), not rejections.

---

## Status legend

| Status | Meaning |
|--------|---------|
| ✅ Implemented | Built in Payload and working |
| 🟡 Partial | Some of the requirement is built; a material gap remains |
| ⛔ Missing | Not built and **not** formally scheduled (true gap / drift) |
| 🕒 Deferred (phase) | Intentionally scheduled for a later phase per canonical plan |
| 🔒 Blocked (client) | Cannot proceed without client input/decision |

---

## Headline (updated 2026-06-09 — full-platform build)

| Lens | Completeness |
|------|--------------|
| **vs. full intake** (8 product lines + foundations) | **~70%** — all modules have thin working collections + demo seed; custom UI, integrations, and automation hooks remain thin |
| **vs. Phase 1a SPD slice** | **~95%** — checklist state, optional stages, demo gate sign-off, tooling lineage added; soft phase lock + Conrad review deprioritized |
| **Active build surface** | **All modules** per [PLATFORM-ROADMAP.md](../PLATFORM-ROADMAP.md) |

**Platform shift:** Client directive supersedes POC-gated phasing. See [PLATFORM-ROADMAP.md](../PLATFORM-ROADMAP.md). `ProjectBriefs` orphan collection **deleted**.

---

## 1. SPD Project Management — `docs/intake/SPD Project Management App — Project Brief.md`

**Phase:** 1a (POC due end June 2026). This is the only module in active build.

| # | Requirement (intake) | Status | Evidence / gap | Recommended next action | Phase |
|---|----------------------|--------|----------------|-------------------------|-------|
| 1.1 | 6 phases → 18 sub-stages → 5 gates, entry/exit/RASCI/checklist | ✅ | `SpdProcessTemplates.ts` (phases→stages→checklist/deliverables/gate/RASCI); `spdSyntheticTemplate.data.ts` seeds full 6×18×5 synthetic template, published on boot | Reconcile against `SPD_ProcessFlow.docx` when it lands | 1a / SPD-002 |
| 1.2 | Process content matches Conrad's source doc (~75%) | 🔒 | Synthetic stand-in shipped (`1.0-synthetic`); real docx not yet delivered | Conrad POC review (SPD-011 / BUI-289); then update template | 1a, blocked:client |
| 1.3 | Waterfall — "cannot proceed to next phase until sign-off" | 🟡 | `currentPhase` pointer advances only on approved gate sign-off (`unlockPhaseOnApprove.ts`). **But** it is a *soft* pointer — default admin does not physically prevent editing data in locked phases, and the hook advances on **any single** approved sign-off (does not verify `gate.requiredRoles` are all signed) | For POC, document as soft-lock (acceptable). Hard enforcement + required-role quorum = custom UI / hook hardening, deferred | 1a (soft) / 1.5 (hard) |
| 1.4 | 5 sign-off gates: approver, role, decision, evidence, timestamp | ✅ | `SpdGateSignOffs.ts` — append-only (`update:false`, `delete:false`), approver/role/decision/evidence/comments | — | 1a |
| 1.5 | "Manager ticks off checklist, signs off" — checklist completion tracked | ⛔ | Checklist items live in the snapshot as **static text only**. There is **no per-project state** recording which items are ticked before a gate. Sign-off is recorded without checklist linkage | Add per-project checklist completion (array of `{stageId, itemIndex, done, by, at}` on project, or a lightweight `spd-checklist-state`). Small but real gap within 1a intent | 1a (small) |
| 1.6 | Configurable steps — non-negotiable always required, optional steps selected at project creation | ⛔ | Template stages have no `required`/`optional` flag; project creation copies **all** stages, no selection step | Add `optional: boolean` to template stages + selection on project create (or defer to post-POC). Currently under-specced vs intake | 1a or 1.5 |
| 1.7 | Change request module — in-scope (redo, no cost) vs out-of-scope (costed, client sign-off mandatory) | ✅ | `SpdChangeRequests.ts` — classification enum, conditional cost group, `clientSignOffStatus` manual path, project + tooling-asset + document links | — | 1a |
| 1.8 | Asset library — every project = an asset (tool), **full version history incl. all CRs** | 🟡 | `ToolingAssets.ts` exists (name/version/status/project); CRs link to tooling asset. **But** no version *lineage* — each version is an unlinked record; no automatic history chain or "all CRs rolled into version" view | Acceptable for POC. Add version-chain (`previousVersion` reln) or version-history array when client confirms asset model | 1a (minimal ✅) / 1.5 (history) |
| 1.9 | Data hub — collect once, auto-generate documents (80% pull / 20% custom) | 🕒 | `Documents.ts` is upload-only; no generation engine | Document generation is a downstream consumer; deferred | 2+ |
| 1.10 | Client-facing forms (sent externally, submitted back into platform) | 🕒 | Not built; `spd-client-form-submissions` is spec'd-only | SPD-010, post-POC | 1.5 |
| 1.11 | Management dashboard (all open projects, on-track/behind, pipeline) | 🕒 | Default Payload admin list only (`onTrack` checkbox, `currentPhase` column exist) | Custom view SPD-008, deferred | 1.5 |
| 1.12 | Analytics + reporting (time per phase, bottlenecks, historical) | 🕒 | Not built | Deferred (needs phase-transition events first) | 1.5/2 |
| 1.13 | AI document validation (flag insufficient inputs) | 🕒 | Not built | Deferred | 2+ |
| 1.14 | 8 roles (Business Lead … Process Lead) with RASCI | 🟡 | 8-role enum exists (`lib/spd/constants` + template RASCI per stage). **But** roles are descriptive only — Payload users are Admin/Staff; no role→user access mapping | Map SPD roles to access scopes when full matrix ships | 1a (data ✅) / 1.5 (access) |
| 1.15 | 12 core deliverables / 170-doc reduction | ✅ (modeled) | Deliverables captured per stage in template | Validate names against docx | 1a |
| 1.16 | Costing logic for out-of-scope CRs (finance vs platform) | 🔒 | `estimatedCost`/`currency` fields exist; **logic source** unconfirmed | Open item — confirm with client | blocked:client |

**SPD verdict:** Core POC is **functionally demonstrable today** (template → project w/ frozen snapshot → gate sign-off → phase advance → change request → tooling asset). The honest gaps inside the 1a slice are **1.5 (checklist state)** and **1.6 (configurable steps)**; **1.3 (hard lock)** is an accepted POC simplification.

---

## 2. Foundations (cross-cutting; Phase 1a slice)

**Source:** ecosystem decision + `docs/modules/foundations.md` (evidence across Manufacturing/HR/Maintenance/Sales/SPD briefs).

| # | Requirement | Status | Evidence / gap | Action | Phase |
|---|-------------|--------|----------------|--------|-------|
| 2.1 | `companies`, `employees`, `customers`, `contacts`, `users`, `documents`, `media` | ✅ | All present in `src/collections/` and registered in `payload.config.ts` | — | 1a |
| 2.2 | Durable cross-module **Employee ID** | ✅ | `Employees.employeeId` unique + indexed | — | 1a |
| 2.3 | Access skeleton — `users.roles` (Admin/Staff), optional `companyScope` | ✅ | `Users.ts` roles enum + `companyScope` reln (enforcement deferred to PLAT-007) | — | 1a |
| 2.4 | Bulk import (Excel/CSV) via import-export plugin + jobs/cron | ✅ | `importExportPlugin` on employees/users/media; jobs `access` w/ `CRON_SECRET`, `autoRun` env-gated | Add `documents`/SPD collections to import set when needed | 1a |
| 2.5 | `groups`, `sites`, `departments`, `teams` | 🕒 | Not built | Deferred until multi-site / HR | 1.5 |
| 2.6 | `products`, `machines`, `moulds` | 🕒 | Not built | Deferred to Manufacturing path | 1b |
| 2.7 | `tags`, `activity-events` | 🕒 | Not built; native `createdAt`/domain events suffice for POC | Deferred (needs polymorphic contract) | 1.5+ |
| 2.8 | Branding refs (company logo media) for multi-company docs | ⛔ | `Companies.ts` has no media/branding field (spec'd in foundations.md card) | Add when HR/doc-gen needs per-company branding | 2 |

---

## 3. Manufacturing Automation — `Manufacturing Automation — Project Brief.md` (+ Developer Brief 2026-05-15)

**Phase:** 1b option (client choice). **Nothing is implemented in Payload** — the live MVP at `pimms-dashboard-mvp.vercel.app` is a **separate prior build** (reference only, per MASTER-SPEC §3.7).

| # | Requirement | Status | Phase |
|---|-------------|--------|-------|
| 3.1 | Machine grid / OEE / status (3 factories, 40 machines) | 🕒 (needs `sites`/`machines`/`products`/`moulds`) | 1b |
| 3.2 | Planning import (Excel → orders) | 🕒 `manufacturing-orders` + import mapping (MFG-001) | 1b |
| 3.3 | Operator/round entry (cycle time, output, stoppage, rejects) | 🕒 `production-snapshots` immutable on submit (MFG-003) | 1b |
| 3.4 | Stoppage + reason; rejects threshold | 🕒 embedded on snapshots (reconciliation matrix) | 1b |
| 3.5 | `manufacturing-settings` global (thresholds) | 🕒 MFG-008 | 1b |
| 3.6 | Mould shot count (warn 15k / service 20k) | 🕒 `shotCount` on mould, increments on snapshot | 1b |
| 3.7 | TV display mode, list/card toggle, filters | 🕒 custom admin (MFG-009/010) | 1.5 |
| 3.8 | CR 2026-06-01: tool change, cycle counter, quality checklist, setter sign-off+photos, machine-stopped button | 🕒 (MFG-005/006) | 1.5 (after WhatsApp milestone) |
| 3.9 | 1-on-1 scorecards (Accuracy/Runs) → HR via Employee ID | 🕒 `one-on-one-scores` (Manufacturing-owned, ADR-0002) | 1.5/2 |
| 3.10 | Planning snapshot archive | 🕒 deferred; MVP uses re-import + Document | 1.5 |

**Verdict:** 0% in Payload, **100% deferred-by-design**. This is the single largest "missing vs intake" block, and it is intentional (Phase 1b fork).

---

## 4. Odoo Financial Reporting — `Odoo Financial Reporting — Project Brief.md` (+ handoff excerpt)

**Phase:** 1b option. Nothing implemented. Odoo remains system of record; Payload owns normalized report data (MASTER-SPEC §6).

| # | Requirement | Status | Phase |
|---|-------------|--------|-------|
| 4.1 | Reporting periods w/ lock | 🕒 `finance-reporting-periods` (FIN-001) | 1b |
| 4.2 | Normalized report lines (8 report types, aging buckets) | 🕒 `finance-report-lines` typed (FIN-002/004) | 1b |
| 4.3 | Financial metrics (margins, ratios) frozen on lock | 🕒 `financial-metrics` (FIN-003) | 1b |
| 4.4 | `finance-settings` global | 🕒 FIN-006 | 1b |
| 4.5 | CSV import | 🕒 import-export mapping | 1b |
| 4.6 | Full report list confirmation | 🔒 expected 2026-06-02 (FIN-008) | blocked:client |
| 4.7 | PPT/PDF board-pack generation, scheduled email | 🕒 downstream consumer (FIN-007) | 2 |
| 4.8 | Odoo automated sync (XML-RPC) | 🕒 integration set (FIN-INT-*) | 2/3 |

**Verdict:** 0% in Payload, deferred-by-design.

---

## 5. Machine Maintenance Tracker — `Machine Maintenance Tracker — Project Brief.md`

**Phase:** 1.5 (after Manufacturing). Nothing implemented.

| # | Requirement | Status | Phase |
|---|-------------|--------|-------|
| 5.1 | Machine list from Manufacturing (no dup entry) | 🕒 depends on `machines` (1b) | 1.5 |
| 5.2 | Service history per machine | 🕒 `maintenance-jobs` (MTN-002) | 1.5 |
| 5.3 | Shot-count → service trigger at 20k | 🕒 idempotent hook + `Service Cycle` (MTN-005) | 1.5 |
| 5.4 | Parts + PO attachment (no inventory) | 🕒 `partsUsed[]` on job + `maintenance-pos` (MTN-001/003) | 1.5 |
| 5.5 | Machine-down notification chain | 🔒🕒 chain TBD (MTN-006) | 1.5, blocked:client |
| 5.6 | Standalone vs module-in-Manufacturing | 🔒 architecture decision pending | blocked:client |

**Verdict:** 0% in Payload, deferred-by-design.

---

## 6. PIMMS HR Platform — `PIMMS HR Platform — Project Brief.md` (+ Stanton Global handoff)

**Phase:** 2, **explicitly blocked** ("Do not initiate until Trevor green light"). Nothing implemented. Prior PoC (non-Payload) is reference only.

| # | Requirement | Status | Phase |
|---|-------------|--------|-------|
| 6.1 | Organogram (~300 employees, companies/departments/managers) | 🕒 needs `departments`/`teams`/manager chain | 2 |
| 6.2 | `contract-templates` + `performance-contracts` (per employee per period) | 🕒 HR-001/002 (separate collection, reconciliation matrix) | 2 |
| 6.3 | Quarterly review workflow + scoring + rating bands | 🕒 `quarterly-reviews` (HR-003) | 2 |
| 6.4 | Employee status dashboard, role-based access (HR/Exec/Manager/Employee) | 🕒 needs full access matrix | 2 |
| 6.5 | 1-on-1 scorecards roll-up → composite score | 🕒 reads Manufacturing `one-on-one-scores` | 2 |
| 6.6 | SharePoint auto-filing, AI summary | 🕒 HR-005/007 | 2/3 |
| 6.0 | Trevor green light | 🔒 | blocked:client |

**Verdict:** 0% in Payload, deferred + client-blocked.

---

## 7. Sales Performance Dashboard — `Sales Performance Dashboard — Project Brief.md`

**Phase:** 2. Nothing implemented.

| # | Requirement | Status | Phase |
|---|-------------|--------|-------|
| 7.1 | Target vs Planned vs Actual per rep/team/dept | 🕒 `sales-targets`/`sales-actuals`/periods (SAL-001/002/004) | 2 |
| 7.2 | Hunt/Care activity tracking | 🕒 `sales-activities` (SAL-003) | 2 |
| 7.3 | Discrepancy rollups | 🕒 compute at read time (no snapshot collection) | 2 |
| 7.4 | Pipedrive + Odoo sources | 🔒🕒 field-mapping spike (SAL-006) | 2, blocked:client |

**Verdict:** 0% in Payload, deferred-by-design.

---

## 8. Internal LLM / MCP — `Internal LLM — Project Brief.md`

**Phase:** 3. Nothing implemented (no MCP plugin installed).

| # | Requirement | Status | Phase |
|---|-------------|--------|-------|
| 8.1 | RAG/query over ecosystem data | 🕒 depends on data existing in Payload first | 3 |
| 8.2 | `@payloadcms/plugin-mcp` + collection allowlist | 🕒 LLM-001 | 3 |
| 8.3 | Role-aware access (agent authenticates as User) | 🕒 inherits access matrix (LLM-002) | 3 |
| 8.4 | Provider selection (Claude/OpenAI) | 🔒 LLM-004 | blocked:client |

**Verdict:** 0% in Payload, deferred-by-design (correctly last — it consumes everything else).

---

## 9. Data Management (cross-cutting)

| # | Requirement | Status | Evidence | Phase |
|---|-------------|--------|----------|-------|
| 9.1 | Import/export plugin | ✅ (partial) | 3 collections wired (employees/users/media) | 1a |
| 9.2 | Jobs queue + cron skeleton | ✅ | `jobs.access` + env-gated `autoRun` | 1a |
| 9.3 | Odoo / Pipedrive / SharePoint / payroll integrations | 🕒 | model-first; integrations later | 2/3 |

---

## Drift & under-spec found (the only items needing attention *inside* the active slice)

| Finding | Where | Severity | Fix |
|---------|-------|----------|-----|
| Checklist completion not tracked per project (1.5) | SPD | Medium — touches core "tick off → sign off" intent | Add per-project checklist state |
| Configurable required/optional steps not modeled (1.6) | SPD | Medium — intake names it a core principle | Add `optional` flag + selection at create |
| Phase lock is a soft pointer; required-role quorum unenforced (1.3) | SPD | Low for POC | Document as accepted POC behavior; harden in 1.5 |
| Tooling asset has no version lineage (1.8) | SPD | Low for POC | Add version chain when asset model confirmed |
| `spd.md` POC table marks all 6 collections "Done" but omits 1.5/1.6/1.3 caveats | docs/modules/spd.md | Doc hygiene | Add "Known POC gaps" note (done in this pass) |
| Company branding/media field spec'd but absent (2.8) | Foundations | Low | Add when doc-gen/HR needs it |
| `ProjectBriefs` collection + seed exist but are orphaned & unapproved scope creep | src/ | Cleanup | See decision below |

Everything else labelled 🕒 is **deferred-by-design and correctly tracked** in the scope map — not drift.

---

## ProjectBriefs collection — decision

**Status: DELETED (2026-06-09)** — `src/collections/ProjectBriefs.ts` and `src/seed/projectBriefs.data.ts` removed per full-platform build directive.

---

## Ordered backlog — top 10 unblocked build items toward "achieves intake requirements"

Excludes the Phase 1b fork (Finance vs Manufacturing) until the Conrad POC path is clear. These are the highest-value items that are **unblocked right now** and move SPD from "demoable" to "intake-complete for the POC."

| # | Item | Why now | Intake ref | Effort |
|---|------|---------|-----------|--------|
| 1 | Delete (or park) `ProjectBriefs` | Removes scope creep / evidence-vs-data confusion before POC | this audit | XS |
| 2 | Per-project **checklist completion state** | Core intake principle "tick off checklist → sign off"; currently unmet | SPD 1.5 | S |
| 3 | **Seed a gate sign-off** in the demo project boot | Satisfies 1a success criterion "demo progresses through ≥1 gate"; makes the Conrad walk one-click | PHASE-1-MVP 1a criteria | XS |
| 4 | **Configurable required/optional steps** (`optional` flag + create-time selection) | Named core principle 1.6; currently under-spec | SPD 1.6 | M |
| 5 | Gate **required-role quorum** check in `unlockPhaseOnApprove` | Tightens "phase locks until sign-off" to match RASCI intent | SPD 1.3 | S |
| 6 | **Tooling asset version lineage** (`previousVersion` reln or history array) | Intake: "full version history incl. all CRs" | SPD 1.8 | S |
| 7 | Add SPD collections (`spd-projects`, gate sign-offs, CRs) to **import-export** set | Lets POC be seeded/demoed from fixtures repeatedly | Data 9.1 | S |
| 8 | **Conrad POC review** (synthetic template, ~75% accuracy) | Unblocks docx reconciliation; the gating milestone | SPD-011 / BUI-289 | 🔒 schedule |
| 9 | Reconcile template against **`SPD_ProcessFlow.docx`** | Closes 1.1/1.2 once doc arrives | SPD-002 / BUI-288 | 🔒 M |
| 10 | Add **company branding/media** field to `companies` | Cheap foundation for HR/doc-gen; removes a known foundation gap | Foundations 2.8 | XS |

Items 8–9 carry a 🔒 because they depend on Conrad availability / the docx, but they are listed because they are the **critical path** for SPD intake-completeness — everything else is preparatory.

---

## Phase 1b fork (excluded from backlog above — needs the next decision)

After the POC, **one** of these starts (not both): **Finance data hub** (FIN-001–006) or **Manufacturing WhatsApp replacement** (MFG-001/003/008 + foundations `sites`/`machines`/`products`/`moulds`). See [PHASE-1-MVP.md §Phase 1b](../PHASE-1-MVP.md).

---

## Sources

- Intake: all files in [`docs/intake/`](.)
- Canonical: [MASTER-SPEC.md](../MASTER-SPEC.md), [PHASE-1-MVP.md](../PHASE-1-MVP.md), [scope-map.md](../linear/scope-map.md), [reconciliation matrix](../reviews/reconciliation-matrix-2026-06-09.md), [CONTEXT.md](../../CONTEXT.md)
- Implementation: `src/collections/*`, `src/globals/SpdSettings.ts`, `src/hooks/spd/*`, `src/lib/spd/*`, `src/seed/*`, `src/payload.config.ts`
