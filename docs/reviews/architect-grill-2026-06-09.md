# Architect Grill — 2026-06-09

## Persona mandate

Protect **data integrity**, **auditability**, and **cross-module consistency** across the Stanton/PIMMS Payload ecosystem. Intake briefs are requirements; the design question is *how completely* each must be modeled in v1.

**Architect biases applied in this grill:**

- Separate **event/snapshot collections** over embedded mutable fields when history must not be overwritten
- **Explicit status machines** and **locked periods** (Finance open/locked; gate sign-offs as first-class events)
- **Early access-control skeleton** — no "fix later" on multi-company scope
- Hooks must be **atomic-safe** with documented failure modes
- `activity-events` only if a **polymorphic contract** is specified

---

## Executive summary (top 5 blockers + recommended v1 shape)

| # | Blocker | Risk | Recommended v1 resolution |
|---|---------|------|---------------------------|
| 1 | **Access control deferred** while intake requires company/manager/direct-report scopes (HR brief, Manufacturing operator identity) | Cross-company data leakage; HR/Manufacturing cannot ship safely | **Phase 1 skeleton:** `users.roles` + `company` scope field + `overrideAccess: false` in all hooks; full matrix deferred but not zero |
| 2 | **`one-on-one-scores` canonical home unresolved** (Manufacturing vs HR) | Duplicate scores, broken HR composite rollup | **Single collection:** `one-on-one-scores` owned by Manufacturing (source of entry); HR reads via Employee ID — no `one-on-one-sessions` |
| 3 | **Finance period lock + line immutability unspecified** | Reporting facts overwritten; audit failure vs Odoo intake ("no manual inputs") | **`finance-reporting-periods.status`:** `open` → `locked`; lines editable only when open; lock is hook-enforced; corrections via new adjustment lines or reopen (Admin only) |
| 4 | **`activity-events` polymorphic contract missing** | Inconsistent audit trail or unused collection | **Deferred phase:** omit `activity-events` from Phase 1 MVP; add in Phase 1.5 only after `sourceCollection` + `sourceId` + `eventType` enum spec |
| 5 | **Cross-module hook orchestration lacks idempotency/failure modes** (mould shots → maintenance job; stoppage → notification) | Duplicate jobs, partial writes, silent failures on Vercel | Document + implement: **idempotency keys**, `req` transaction pass-through, job retry policy, `context.skipHooks` flags |

**Recommended Phase 1 data shape (Architect view):** Foundations master data + access skeleton → Manufacturing operational facts (snapshots, stoppages, mould counters) → Maintenance jobs with embedded parts → Finance periods/lines with lock → SPD template + project snapshot + gate sign-offs. HR/Sales/Odoo sync/activity-events/report rendering = **deferred phase** (still in backlog per intake).

---

## Self-grill Q&A

### History & immutability

**Q1. After a line manager submits a `production-snapshot`, can it be edited?**

**Recommended resolution:** Treat submitted snapshots as **immutable facts**. Allow `draft` → `submitted` status transition once; after `submitted`, corrections require a new superseding snapshot or Admin-only `void` + reason (audit field). Reject edits that change Employee ID post-submit.

**Intake citation:** Manufacturing brief — "Compulsory identity — First Name, Surname, Employee Code on every submission" (`Manufacturing Automation — Project Brief.md`, Operator Input); "3-hourly reporting" with fixed snapshot times (same file, Operator Input).

**Spec files affected:** `docs/modules/manufacturing.md`, `docs/architecture/payload-data-model.md`, `docs/architecture/automation.md`

---

**Q2. Should `planning-snapshots` fire on every Excel import or only when plan fields change?**

**Recommended resolution:** Create a planning snapshot when **any plan-affecting field** changes on an MO or on bulk import that alters MO state — not on no-op re-imports. Store `sourceDocument` → `documents` ref and `snapshotAt`. Compare hash of frozen fields to skip duplicate snapshots.

**Intake citation:** "Planning snapshot archive — snapshot saved on every plan change" (`Manufacturing Automation — Project Brief.md`, Version History).

**Spec files affected:** `docs/modules/manufacturing.md`, `docs/architecture/automation.md`

---

**Q3. Where does reject data live — fields on `production-snapshots` or separate `reject-events`?**

**Recommended resolution:** **Fields on `production-snapshots`** for v1 (`rejects` count + optional `rejectRate` computed). Threshold breach → queue notification job. Separate `reject-events` is **deferred phase** unless analytics needs per-reject reason codes later.

**Intake citation:** "Units produced + rejects per machine per hour" and "Reject rate (flag when >2% of MOQ)" (`Manufacturing Automation — Project Brief.md`, Key Metrics / Phase 2).

**Spec files affected:** `docs/modules/manufacturing.md` (resolve fork), `docs/architecture/automation.md`

---

**Q4. Is `moulds.shotCount` current-state or event-sourced?**

**Recommended resolution:** **Current-state on `moulds`** (master data rollup) updated atomically from production snapshots and tool-change events; optionally append `shot-count-events` **deferred phase** if audit of every increment is required. Maintenance trigger reads `moulds.shotCount` with idempotent job creation at threshold.

**Intake citation:** "Cycle Counter — count cycles per mould; warning at 15,000; service due at 20,000; resets after mould service" (`Manufacturing Automation — Project Brief.md`, Latest Change Requests 2026-06-01).

**Spec files affected:** `docs/modules/manufacturing.md`, `docs/modules/maintenance.md`, `docs/architecture/automation.md`

---

**Q5. When a `finance-reporting-period` is `locked`, what happens to `finance-report-lines`?**

**Recommended resolution:** **Lines immutable** when parent period `status = locked`. `beforeChange` hook on lines rejects updates/deletes unless `req.context.financePeriodOverride === true` (Admin). Corrections: (a) Admin unlock with audit reason, or (b) **adjustment lines** in a new open period — prefer (b) for audit trail.

**Intake citation:** Finance brief implies stable period facts for board packs — "select company + reporting period → finished PowerPoint" (`Odoo Financial Reporting — Project Brief.md`, Report Delivery); ratios "computed automatically from raw Odoo data" (Platform Scope).

**Spec files affected:** `docs/modules/finance.md`, `docs/architecture/payload-data-model.md`, `docs/architecture/automation.md`

---

**Q6. Should finance report sections be a collection, blocks on period, or a `finance-period-snapshots` parent?**

**Recommended resolution:** **Nested blocks on `finance-reporting-periods`** for v1 (`sections[]` with `sectionKey`, labels, ordering). No separate `finance-report-sections` collection. `finance-report-lines` reference `period` + `sectionKey` string. Full `finance-period-snapshots` parent collection is **deferred phase** until Odoo sync needs raw-vs-normalized separation.

**Intake citation:** Report sections table — Profitability, Debtors Aging, etc. (`Odoo Financial Reporting — Project Brief.md`, Report Sections).

**Spec files affected:** `docs/modules/finance.md`, `docs/architecture/payload-data-model.md`

---

**Q7. SPD: when `spd-process-templates` is republished, what happens to in-flight `spd-projects`?**

**Recommended resolution:** **No retroactive mutation.** On project create, **deep-copy** template blocks into `spd-projects.processSnapshot` (embedded, versioned `templateId` + `templateVersion`). Template updates affect **new projects only**. In-flight projects may optionally "upgrade template" via explicit Admin action that creates a new snapshot version — **deferred phase** for POC.

**Intake citation:** "Waterfall/linear — phases lock until sign-off"; configurable steps at project creation (`SPD Project Management App — Project Brief.md`, Core Platform Principles).

**Spec files affected:** `docs/modules/spd.md`, `docs/MASTER-SPEC.md` §4

---

**Q8. Are `spd-gate-sign-offs` append-only events?**

**Recommended resolution:** **Yes.** Sign-off records are **event records** — no in-place edit of `decision` after create. Rejection creates a new sign-off or change-request workflow; approved sign-offs cannot be deleted (Admin void only with reason). Hook unlocks next phase on `decision = approved` only.

**Intake citation:** "5 gates — Sign-off checkpoints between phases — phase locks until approved" (`SPD Project Management App — Project Brief.md`, In Scope table).

**Spec files affected:** `docs/modules/spd.md`, `docs/architecture/payload-data-model.md`, `CONTEXT.md` (Gate Sign-Off term)

---

### Employee ID & cross-module rollup

**Q9. Where is the canonical home for weekly Accuracy/Runs 1-on-1 scores?**

**Recommended resolution:** **`one-on-one-scores` collection in Manufacturing module** (manager entry UI lives on factory dashboard). HR module **reads** by `employee` relationship — no duplicate `one-on-one-sessions` collection. HR composite hook aggregates Manufacturing scores + quarterly review scores in Phase 2.

**Intake citation:** Manufacturing: "Manager 1-on-1 scorecard — weekly/monthly scoring per Employee ID on Accuracy and Runs" + "feeds directly into HR platform via Employee ID" (`Manufacturing Automation — Project Brief.md`, People & Performance / Cross-Platform Link). HR: "Scores per Employee ID: Accuracy and Runs" (`PIMMS HR Platform — Project Brief.md`, Manager 1-on-1 Scorecard System).

**Spec files affected:** `docs/modules/manufacturing.md`, `docs/modules/hr.md`, `docs/linear/scope-map.md` (HR-006)

---

**Q10. Should `production-snapshots` store both `employee` relationship and denormalized `employeeId` string?**

**Recommended resolution:** **Relationship `→ employee` required**; denormalize `employeeId` (string) on snapshot at submit time for import resilience and reporting indexes. Hook validates `employee.employeeId` matches entered code before `submitted`.

**Intake citation:** "Every machine submission tied to Employee ID" (`Manufacturing Automation — Project Brief.md`, Cross-Platform Link).

**Spec files affected:** `docs/modules/manufacturing.md`, `docs/modules/foundations.md`

---

**Q11. How does HR "composite KPI score" get stored in v1 Manufacturing-only phase?**

**Recommended resolution:** **No HR composite in Phase 1.** Manufacturing stores source facts only. Phase 2: `quarterly-reviews` holds formal review scores; composite computed at read time or stored on review submit — **not** on Employee master record. Employee tab shows read-only rollup query.

**Intake citation:** "Quarterly KPI score = weekly 1-on-1 scores + formal quarterly KPA/KPI review" (`PIMMS HR Platform — Project Brief.md`, Connected Platform Vision).

**Spec files affected:** `docs/modules/hr.md`, `docs/MASTER-SPEC.md` §5

---

**Q12. What if Employee changes company or manager mid-quarter?**

**Recommended resolution:** Operational facts **retain historical `employee` ref** at time of event (snapshots immutable). Access control uses Employee's **current** company for visibility; reporting rollups attribute scores to employee regardless of transfer. Contract/review routing uses **period start** organogram snapshot — **deferred phase** detail; v1: manual HR reassignment with audit note.

**Intake citation:** "Organogram is the master data model — contract generation, review routing, notifications, and access control all flow from it" (`PIMMS HR Platform — Project Brief.md`, Organogram & Multi-Company Structure).

**Spec files affected:** `docs/modules/foundations.md`, `docs/modules/hr.md`, access control (TBD matrix)

---

### Manufacturing → Maintenance chain

**Q13. When mould shot count crosses 20,000, how is the maintenance job created without duplicates?**

**Recommended resolution:** Hook on `moulds` afterChange checks threshold; queues job with **idempotency key** `mould:{id}:threshold:20000:serviceCycle:{n}`. Job handler creates `maintenance-jobs` with `triggerType: shot_threshold` only if no open job exists for same mould + trigger. On job complete, reset shot counter per intake and increment `serviceCycle`.

**Intake citation:** "Service interval: every 20,000 shots" + "When threshold hit → triggers a service notification/job" (`Machine Maintenance Tracker — Project Brief.md`, Shot Counter → Service Trigger); Manufacturing thresholds 15k/20k (`Manufacturing Automation — Project Brief.md`, Latest Change Requests).

**Spec files affected:** `docs/modules/maintenance.md`, `docs/architecture/automation.md`, `docs/linear/scope-map.md` (MFG-011, MTN-005)

---

**Q14. Does machine-stopped in Manufacturing always create a maintenance job?**

**Recommended resolution:** **No.** Stoppage creates `stoppage-events` + notification job always; maintenance job creation is **optional** via reason code mapping or manual — default **deferred phase** until client confirms chain (TBD with Trevor/Conrad). v1: notification only + link to create job from admin.

**Intake citation:** "Machine stopped events in Manufacturing → can trigger maintenance job here" (`Machine Maintenance Tracker — Project Brief.md`, Integration); notification chain TBD (Open Questions).

**Spec files affected:** `docs/modules/manufacturing.md`, `docs/modules/maintenance.md`, `docs/architecture/automation.md`

---

**Q15. Parts on maintenance jobs — embedded array or `maintenance-job-parts` collection?**

**Recommended resolution:** **Embedded array** `partsUsed[]` on `maintenance-jobs` for v1 (part ref + quantity + notes). No inventory; no separate collection unless cross-job part analytics requires it (**deferred phase**).

**Intake citation:** "Simple — attach a PO to a machine for a job. No inventory tracking" (`Machine Maintenance Tracker — Project Brief.md`, Confirmed Decisions).

**Spec files affected:** `docs/modules/maintenance.md`

---

### Finance & intake tension

**Q16. Finance intake says "no manual inputs" but MASTER-SPEC says manual/import-first — which wins for v1?**

**Recommended resolution:** **Payload model-first with manual/import v1**; automated Odoo sync is **deferred phase** per ecosystem decision. Intake outcome (auto PPT) unchanged — downstream report app reads Payload. Document explicitly: v1 data entry = import plugin + admin; sync epic FIN-INT-* Phase 2+.

**Intake citation:** "All data from Odoo — no manual inputs" (`Odoo Financial Reporting — Project Brief.md`, What It Is) vs handoff "Payload-first normalized finance collections, manual/import-first" (`odoo-integration-handoff-excerpt.md`, Purpose).

**Spec files affected:** `docs/MASTER-SPEC.md` §6, `docs/modules/finance.md`, `docs/architecture/integrations.md`

---

**Q17. Do `financial-metrics` get recomputed when lines change or stored as snapshots?**

**Recommended resolution:** **Stored records** per period + `metricKey`, recomputed in `afterChange` hook on lines when period is `open`. When period locks, metrics frozen. Avoid read-time-only computation for board-pack consistency.

**Intake citation:** "All ratios and variances computed automatically" (`Odoo Financial Reporting — Project Brief.md`, Platform Scope).

**Spec files affected:** `docs/modules/finance.md`, `docs/architecture/automation.md`

---

### SPD & tooling

**Q18. How is Tooling Asset version history modeled?**

**Recommended resolution:** `tooling-assets` is **current-state** with `version` number; each approved `spd-change-request` creates a **`tooling-asset-versions`** event/snapshot record **deferred phase** — for POC, append version history as embedded `versions[]` block on tooling asset updated only on CR approval (immutable entries).

**Intake citation:** "Asset library — every project = an asset (tool); full version history including all change requests" (`SPD Project Management App — Project Brief.md`, In Scope).

**Spec files affected:** `docs/modules/spd.md`, `CONTEXT.md` (Tooling Asset)

---

**Q19. Can SPD POC ship without Product/Mould links to Manufacturing?**

**Recommended resolution:** **Yes.** POC requires `spd-projects`, template snapshot, gate sign-offs, change requests, tooling asset. Links to `products` / `moulds` are **optional relationships** — phased per MASTER-SPEC §4. No runtime dependency on Manufacturing for gate progression.

**Intake citation:** Intake says standalone / no cross-platform (`SPD Project Management App — Project Brief.md`, Out of Scope) — superseded by ecosystem decision for shared foundations only.

**Spec files affected:** `docs/MASTER-SPEC.md` §4, `docs/modules/spd.md`

---

### Automation, hooks & jobs

**Q20. Which side effects belong in hooks vs Jobs Queue on Vercel?**

**Recommended resolution:** **Hooks:** validation, denormalized fields, enqueue. **Jobs Queue:** email, SharePoint, Odoo sync, bulk import, notifications. On Vercel: **cron → `/api/payload-jobs/run`** — never rely on in-process `autoRun` alone. Document failure: failed jobs visible in `payload-jobs` admin; retry with backoff; no silent `void` without logging.

**Intake citation:** Ecosystem architecture (`docs/architecture/automation.md`, Vercel / serverless); data-management Vercel cron guidance.

**Spec files affected:** `docs/architecture/automation.md`, `docs/modules/data-management.md`

---

**Q21. How do we prevent hook infinite loops (mould update → job → mould update)?**

**Recommended resolution:** Pass `req` with `context: { skipMaintenanceHook: true }` on internal updates; use `overrideAccess: false` for user-context operations; idempotent checks before nested creates. Document standard `context` flags in automation.md.

**Intake citation:** Hook safety section (`docs/architecture/automation.md`, Hook safety) — needs expansion.

**Spec files affected:** `docs/architecture/automation.md`

---

**Q22. Should `activity-events` be written from every module in Phase 1?**

**Recommended resolution:** **No — defer collection to Phase 1.5.** If included, require polymorphic contract: `eventType` (enum), `module`, `actor` (user | employee), `sourceCollection`, `sourceId`, `summary`, `occurredAt`. Without spec, skip to avoid inconsistent partial audit.

**Intake citation:** Foundations card lists activity-events (`docs/modules/foundations.md`); LLM module mentions optional traceability (`docs/modules/llm-mcp.md`).

**Spec files affected:** `docs/modules/foundations.md`, `docs/architecture/automation.md`, `docs/linear/scope-map.md` (PLAT-009)

---

### Access control & multi-company

**Q23. Is "access control deferred" compatible with HR brief role matrix?**

**Recommended resolution:** **Not for any module handling Employee or financial data.** Phase 1 minimum: role enum on `users`, `companyScope` relationship array, collection-level `read` filtered by company; Manufacturing/Finance/SPD hooks use `overrideAccess: false`. Full manager/direct-report scopes **deferred phase** but skeleton mandatory.

**Intake citation:** HR role table — HR / Executive / Manager / Employee (`PIMMS HR Platform — Project Brief.md`, Role-Based Access); "~300 employees", multi-company (`Organogram & Multi-Company Structure`).

**Spec files affected:** `docs/MASTER-SPEC.md` §3.6, `docs/modules/foundations.md`, `CONTEXT.md` (Flagged ambiguities)

---

**Q24. Should `sales-performance-snapshots` exist in Phase 2?**

**Recommended resolution:** **Defer** until query profiling proves need. Compute discrepancy dashboards from `sales-targets`, `sales-actuals`, `sales-activities` at read time in Phase 2 MVP. Add materialized snapshots only if admin views are slow.

**Intake citation:** "Target vs Planned vs Actual — discrepancy surfaced per person" (`Sales Performance Dashboard — Project Brief.md`, Core View).

**Spec files affected:** `docs/modules/sales.md`

---

**Q25. Are `performance-contracts` separate collection or only Employee admin UI state?**

**Recommended resolution:** **Separate `performance-contracts` collection** (HR-owned) with `employee`, `contract-template`, `period`, status machine, nested KPA/KPI blocks copied from template. Employee tab is **join UI**, not embedded unbounded arrays on Employee document. Aligns with history pattern and SharePoint filing per contract.

**Intake citation:** "Output database — one row per employee per contract period, contract status tracked" (`PIMMS HR Platform — Project Brief.md`, What's Already Built); status tracking draft → approved (`Contract Generation`).

**Spec files affected:** `docs/modules/hr.md`, `docs/MASTER-SPEC.md` §5

---

## Fork resolutions (Architect position on each fork)

| Fork | Options in specs | **Architect position** | Rationale |
|------|------------------|------------------------|-----------|
| **`one-on-one-scores` vs `one-on-one-sessions`** | manufacturing.md vs hr.md | **`one-on-one-scores` only** (Manufacturing-owned) | Single write path; HR reads by Employee ID; matches intake primary entry on factory dashboard |
| **`reject-events` vs embedded** | manufacturing.md note | **Embedded on `production-snapshots`** for v1 | Simpler; threshold hooks sufficient; split only if per-scrap reason analytics required |
| **`finance-report-sections` collection vs blocks** | finance.md, payload-data-model.md | **Blocks on `finance-reporting-periods`** + `sectionKey` on lines | Owned substructure; no extra permissions entity; matches payload-data-model nested-when-owned rule |
| **`maintenance-job-parts` collection vs array** | maintenance.md | **Array on `maintenance-jobs`** for v1 | No cross-job reuse requirements; no inventory |
| **`performance-contracts` collection vs Employee tab only** | hr.md | **Dedicated collection** | Period history, status machine, filing, audit — cannot overwrite prior contracts |
| **`sales-performance-snapshots`** | sales.md optional | **Defer** | Premature optimization; intake does not require precomputed rollups |

---

## CONTEXT.md glossary proposals (terms only, no implementation)

| Term | Proposed definition | Avoid |
|------|---------------------|-------|
| **Production Snapshot** | Immutable operational fact record for a machine/MO at a point in time (round or 3-hourly submission) | round, hourly entry |
| **Planning Snapshot** | Frozen copy of plan/MO state when planning changes | plan version |
| **Period Lock** | Finance Reporting Period status that forbids mutation of child lines and metrics | closed period (ambiguous with Sales) |
| **Process Snapshot** | Embedded SPD template structure copied to a project at creation; not updated when canonical template changes | project template |
| **Service Cycle** | Ordinal count of mould service completions used for idempotent maintenance triggers | shot reset count |
| **Adjustment Line** | Finance report line posted to correct locked-period data without rewriting history | correction entry |
| **Trigger Type** | Classification of how a maintenance job was created (manual, shot_threshold, machine_stopped) | source (overloaded) |
| **Submitted** | Operational status indicating an immutable fact record (snapshots, sign-offs) | final, complete |
| **Company Scope** | Access-control dimension limiting User visibility to selected Companies | tenant (generic) |
| **Composite Performance Score** | HR-owned rollup of 1-on-1 scores + quarterly review for a Review Period | overall KPI |
| **Template Version** | Published identifier on `spd-process-templates` referenced by project Process Snapshot | template id alone |
| **Idempotency Key** | Deterministic key preventing duplicate jobs/records from retried hooks | dedup hash (informal) |

**Resolve flagged ambiguity:** Update **Access control** entry from "deferred" to "skeleton in Phase 1; full matrix deferred" once spec amendments land.

---

## Spec amendment recommendations

1. **`docs/modules/finance.md`** — Add explicit **Period Lock** section: status enum, hook rules on `finance-report-lines` and `financial-metrics`, adjustment-line pattern, Admin unlock audit fields.

2. **`docs/modules/manufacturing.md`** — Resolve forks: reject fields on snapshot; `one-on-one-scores` canonical; snapshot `draft`/`submitted` immutability; denormalized `employeeId`.

3. **`docs/modules/hr.md`** — Remove `one-on-one-sessions` as parallel option; document read-only consumption of Manufacturing `one-on-one-scores`; affirm `performance-contracts` as separate collection.

4. **`docs/modules/maintenance.md`** — Specify `partsUsed[]` array; `triggerType` enum; idempotent shot-threshold job creation; default stoppage → notify only (not auto-job).

5. **`docs/modules/foundations.md`** — Move `activity-events` to **deferred phase** or add full polymorphic field spec; add `companyScope` to `users` card.

6. **`docs/architecture/automation.md`** — Add **Failure modes** section: idempotency keys, job retry, hook `context` flags, transaction requirements, logging for `void` fire-and-forget.

7. **`docs/architecture/payload-data-model.md`** — Remove `finance-report-sections` as Nested Docs candidate; document Finance sections as blocks.

8. **`docs/MASTER-SPEC.md` §3.6** — Replace "Deferred in detail" with **Phase 1 access skeleton** requirement; link to PLAT-007 deliverable.

9. **`docs/linear/scope-map.md`** — Split PLAT-007 into skeleton (Phase 1) vs full matrix; defer PLAT-009 / FND-006 activity-events or gate on polymorphic spec.

10. **`CONTEXT.md`** — Add glossary terms above; update Access control flagged ambiguity.

---

## Phase 1 MVP shape (Architect view)

### In v1 (minimum integrity-compliant)

| Area | Collections / behavior |
|------|------------------------|
| **Foundations** | `groups`, `companies`, `sites`, `departments`, `teams`, `employees`, `users` (+ roles + company scope), `customers`, `contacts`, `products`, `machines`, `moulds`, `documents`, `media`, `tags` |
| **Manufacturing** | `manufacturing-orders`, `planning-snapshots`, `production-snapshots` (immutable submit), `stoppage-events`, `one-on-one-scores`, `manufacturing-settings`; defer tool-change, quality checklists, setter sign-offs to **Phase 1.5** (intake CR 2026-06-01) |
| **Maintenance** | `parts`, `maintenance-jobs` (embedded `partsUsed[]`), `maintenance-pos`, shot-threshold hook with idempotency, `maintenance-settings` |
| **Finance** | `finance-reporting-periods` (open/locked), lines as `finance-report-lines`, `financial-metrics`, aging collections, import-export; manual/import only |
| **SPD (POC)** | `spd-process-templates`, `spd-projects` + embedded process snapshot, `spd-gate-sign-offs`, `spd-change-requests`, `tooling-assets` (embedded version history entries), `spd-settings` |
| **Platform** | Import-export plugin, Jobs Queue + Vercel cron, MongoDB replica set for transactions, hook `context` conventions |

### Deferred phase (still required by intake — not "out of scope")

| Item | Intake driver | Target phase |
|------|---------------|--------------|
| HR contracts, reviews, composite rollup | HR brief Phase 1 | Phase 2 (gated: Trevor) |
| Sales targets/actuals/activities | Sales brief | Phase 2 |
| Odoo automated sync | Finance brief | Phase 2+ (FIN-INT epic) |
| `activity-events` audit collection | Foundations / LLM | Phase 1.5 (after polymorphic spec) |
| Tool change, quality checklist, setter sign-offs | Manufacturing CR 2026-06-01 | Phase 1.5 |
| Report PPT/PDF generation | Finance brief delivery | Downstream app (not Payload core) |
| Full access matrix (manager/direct reports) | HR brief | Phase 1 skeleton → Phase 2 full |
| LLM / MCP | Internal LLM brief | Phase 3 |
| `sales-performance-snapshots` | sales.md optional | Phase 2+ if perf requires |
| Separate `reject-events`, `maintenance-job-parts`, `finance-report-sections` collections | Spec forks | **Not planned** unless requirements change |

### Cross-module chain (Phase 1)

```
Employee ID (foundations)
    → production-snapshots, stoppage-events, one-on-one-scores (Manufacturing)
    → moulds.shotCount → maintenance-jobs (Maintenance, idempotent)
    → [Phase 2] quarterly-reviews + composite (HR)
```

Finance and SPD share **Company**, **Customer**, **Contact**, **documents** but do not block Manufacturing/Maintenance delivery.

---

*Grill conducted 2026-06-09. Intake files unchanged per governance. Canonical specs should be updated per amendment recommendations above.*
