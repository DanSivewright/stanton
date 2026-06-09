# Pragmatist Grill — 2026-06-09

## Persona mandate

**Smallest schema that satisfies intake for the next shippable milestone (SPD POC, June 2026).** Challenge every collection, custom admin view, and plugin with "needed now?" Prefer embedded blocks over new collections when records are not independently queried; Payload default admin over custom views for v1; manual CSV import over Odoo sync, notification jobs, and SharePoint; sequence Foundations → SPD POC → **one** of Finance or Manufacturing (not both in parallel). Defer activity-events, nested-docs plugin, and LLM entirely.

Cuts are labeled **deferred phase** unless intake explicitly excludes them.

---

## Executive summary (top cuts + recommended sequencing)

### Top cuts from Phase 1 scope map (~88 issues → ~35 shippable issues)

| Area | Delete or defer from Phase 1 | Rationale |
|------|------------------------------|-----------|
| **Platform** | PLAT-004 (nested-docs), PLAT-007 (access matrix design epic), PLAT-008 (admin grouping), PLAT-009 (activity-events helpers) | No SPD POC dependency; access = Admin/Staff only until post-POC |
| **Foundations** | FND-006 (`activity-events`, `tags`), FND-005 partial (`machines`, `moulds`, `products` until Mfg chosen), FND-007 full 40-machine seed | SPD needs Company, Employee, Customer, Contact, Documents only |
| **Manufacturing** | MFG-002 planning-snapshots, MFG-004–007 (stoppage jobs, tool-change, quality, setter, 1-on-1), MFG-009–011 (custom admin, maintenance hook) | WhatsApp replacement = MO import + production snapshots + default list views |
| **Maintenance** | Entire epic MTN-001–006 | Intake status NEW; Manufacturing shot trigger can be a mould field increment without Maintenance module |
| **Finance** | FIN-INT-001–007 (Odoo sync), FIN-007 (API route for PPT), defer FIN-004–005 if timeboxed | Data hub in Payload via CSV; PPT pipeline is downstream per ecosystem decision |
| **SPD** | SPD-008–010 (custom admin views), SPD-010 (client form endpoint) | Conrad POC = correct process template + gate workflow in default admin |
| **Cross-cutting** | All LLM, Sales, HR, Stakeholder web epics | Already Phase 2–3 in MASTER-SPEC |

### Recommended sequencing (Pragmatist)

1. **Platform minimum** — MongoDB replica set, Vercel, `users` + roles, `documents` upload, import-export plugin + cron (PLAT-001, 002, 003, 005, 006).
2. **Foundations slice for SPD** — `companies`, `employees`, `customers`, `contacts` (+ `users` link). Skip `groups`, `sites`, `departments`, `teams`, `tags`, `activity-events` until second module.
3. **SPD POC (June 2026)** — `spd-process-templates`, `spd-projects` (template snapshot), `spd-gate-sign-offs`, `spd-change-requests`, `tooling-assets`, `spd-settings`. Default Payload admin only. Conrad meeting (SPD-011) is the milestone gate.
4. **Pick one module** (client call after POC, not parallel):
   - **Finance path** — if monthly reporting pressure wins: periods + lines + metrics + CSV import (no PPT generator in repo).
   - **Manufacturing path** — if factory WhatsApp pain wins: `machines`, `sites`, `manufacturing-orders`, `production-snapshots`, planning CSV import.
5. **Deferred phase** — Maintenance module, Manufacturing CR 2026-06-01 features, Odoo sync, custom admin views, HR/Sales/LLM.

### Hard truth on intake vs ecosystem

SPD intake says "standalone" and Finance intake says "replaces PowerPoint entirely." Ecosystem decisions already override: SPD is a bounded module; Finance owns normalized data with rendering downstream. The Pragmatist accepts those overrides but **refuses to build integration surfaces (Odoo jobs, PPT API, custom dashboards) in the same milestone as SPD POC.**

---

## Self-grill Q&A

### SPD and Conrad POC

**Q1. Does Conrad's June POC require all 6 phases × 18 stages modeled before the meeting?**  
**Recommended resolution:** Yes for **structure** (template blocks), no for **populated production data**. Import `SPD_ProcessFlow.docx` into one published `spd-process-templates` record; seed 1–2 demo `spd-projects` with gate 1 partially complete.  
**Intake citation:** SPD brief — "POC Plan" / "Build a proof-of-concept from SPD_ProcessFlow.docx… ~75% accuracy" (`docs/intake/SPD Project Management App — Project Brief.md`, POC Plan).  
**Defer:** Analytics, AI document validation, management dashboard custom UI.

**Q2. Are custom admin views (project progress, gate queue) required for POC sign-off?**  
**Recommended resolution:** No. Use Payload default collection views + filters on `spd-projects.currentPhase` and `spd-gate-sign-offs` list. Custom views are polish after template accuracy is validated.  
**Intake citation:** SPD brief — "Dashboards Required" lists three views (`docs/intake/SPD Project Management App — Project Brief.md`, Dashboards Required); ecosystem spec flags custom admin as phased (`docs/MASTER-SPEC.md` §3.5).  
**Defer:** SPD-008, SPD-009 to post-POC phase.

**Q3. Is `spd-gate-sign-offs` a separate collection or embedded checkboxes on the project?**  
**Recommended resolution:** **Separate collection.** Gates are auditable events with approver, role, timestamp, evidence — not a checkbox. This matches glossary **Gate Sign-Off** and unlock hooks.  
**Intake citation:** SPD brief — "Sign-off gates — manager ticks off checklist, signs off, next phase unlocks" (`docs/intake/SPD Project Management App — Project Brief.md`, Core Platform Principles).  
**Defer:** Activity-event writes from gate hooks (no `activity-events` collection in v1).

**Q4. Do we need `spd-client-form-submissions` for June?**  
**Recommended resolution:** No. Internal POC first; client forms are intake in-scope but not POC-critical.  
**Intake citation:** SPD brief — "Client-facing forms" in scope table; "Customer portal" out of scope (`docs/intake/SPD Project Management App — Project Brief.md`, Scope).  
**Defer:** SPD-010, public form endpoint.

**Q5. Is `tooling-assets` required for POC or can projects stand alone?**  
**Recommended resolution:** **Minimal `tooling-assets`** — one record per project with name + version label; full change-request version history can be shallow (CR links + documents) for POC.  
**Intake citation:** SPD brief — "Asset library — every project = an asset (tool); full version history" (`docs/intake/SPD Project Management App — Project Brief.md`, Core Platform Principles).  
**Defer:** Deep `product` / `mould` links (phased per `docs/modules/spd.md`).

**Q6. Does ecosystem "standalone" override mean SPD skips shared `employees` and `customers`?**  
**Recommended resolution:** No. Use shared foundations lightly — SPD projects link `company`, `customer`, `contacts`; approvers link `users` → `employees`. No Manufacturing/Finance **workflow** dependencies.  
**Intake citation:** SPD brief out-of-scope: "Connection to Manufacturing, HR, or Odoo" (`docs/intake/SPD Project Management App — Project Brief.md`, Out of Scope); MASTER-SPEC §4 ecosystem override (`docs/MASTER-SPEC.md`).  
**Defer:** Cross-module automation.

**Q7. Is AI document validation in scope for June?**  
**Recommended resolution:** No. Explicitly Phase 2+ in module spec.  
**Intake citation:** SPD brief lists "AI — document validation" (`docs/intake/SPD Project Management App — Project Brief.md`, Core Platform Principles); `docs/modules/spd.md` — "AI document validation — Phase 2+ hook/job".  
**Defer:** All AI validation jobs.

---

### Finance

**Q8. Can Finance ship without the PPT pipeline and scheduled email on the 12th?**  
**Recommended resolution:** Yes for **ecosystem v1**; intake still wants PPT eventually — treat as **deferred phase** downstream app, not Payload core. Payload ships periods + lines + metrics + CSV import.  
**Intake citation:** Finance brief — "Report Delivery" on-demand PPT, scheduled email (`docs/intake/Odoo Financial Reporting — Project Brief.md`, Report Delivery); MASTER-SPEC §6 — "Report generation… downstream consumer" (`docs/MASTER-SPEC.md`).  
**Defer:** FIN-007 API route, PPT generator, Resend scheduled jobs.

**Q9. Is live Odoo sync required for Finance "Active" status?**  
**Recommended resolution:** No. Manual CSV / import-export first; Odoo remains system of record. Sync is separate epic.  
**Intake citation:** Finance brief says "All data from Odoo — no manual inputs" (`docs/intake/Odoo Financial Reporting — Project Brief.md`, What It Is) — **conflicts** with ecosystem; integrations.md Phase "Now" = manual/import (`docs/architecture/integrations.md`, Priority rule).  
**Defer:** FIN-INT-001–007 entire epic (already Phase 2+ in scope map).

**Q10. How many report types for Finance v1 minimum?**  
**Recommended resolution:** **One period, one company, two sections** — e.g. Profitability lines + Financial Metrics — prove the model before all eight intake reports.  
**Intake citation:** Finance brief report table (`docs/intake/Odoo Financial Reporting — Project Brief.md`, Report Sections); "Additional reports incoming" warning same file.  
**Defer:** Good vs Bad Debt, Sales Reporting, Wages % until client confirms list (FIN-008).

**Q11. `finance-report-sections` as collection vs blocks on period?**  
**Recommended resolution:** **Nested blocks on `finance-reporting-periods`** for v1; `finance-report-lines` as flat rows with `sectionKey` text.  
**Intake citation:** `docs/modules/finance.md` — "prefer blocks on period snapshot for v1 simplicity".  
**Defer:** Separate `finance-report-sections` collection and nested-docs on sections.

**Q12. Separate `debtors-aging` / `creditors-aging` collections or lines?**  
**Recommended resolution:** **Single pattern:** aging rows as `finance-report-lines` with `lineType: aging` and bucket enum — unless query volume forces split. Pragmatist starts unified.  
**Intake citation:** Finance brief — Debtors/Creditors Aging rows (`docs/intake/Odoo Financial Reporting — Project Brief.md`, Report Sections); `docs/modules/finance.md` collection cards.  
**Defer:** Standalone aging collections if unified lines work.

---

### Manufacturing

**Q13. What is the minimum that "replaces WhatsApp"?**  
**Recommended resolution:** Planning sheet → `manufacturing-orders` (import) + `production-snapshots` (line manager tablet entry: cycle time, units, rejects, stoppage flag + reason) + machine status derived in admin list — **not** full dashboard/TV mode/custom views.  
**Intake citation:** Manufacturing brief — "Replaces 40 WhatsApp groups" (`docs/intake/Manufacturing Automation — Project Brief.md`, What It Is); Developer brief — direct input fields per machine (`docs/intake/Manufacturing Automation — Developer Brief 2026-05-15.md`, Direct Input Phase).  
**Defer:** TV display, team analytics, card/table toggle, offline sync.

**Q14. Are Change Request 2026-06-01 features (tool change, quality checklist, setter photos) Phase 1?**  
**Recommended resolution:** No — all **deferred phase** after WhatsApp loop is closed.  
**Intake citation:** Manufacturing brief — "Latest Change Requests (2026-06-01)" five items (`docs/intake/Manufacturing Automation — Project Brief.md`).  
**Defer:** MFG-005–007, `tool-change-events`, `quality-checklists`, `setter-sign-offs`.

**Q15. Do we need `planning-snapshots` for v1?**  
**Recommended resolution:** No. Re-import planning CSV when plan changes; store source file as `document`. Immutable snapshot archive is valuable but not WhatsApp-critical.  
**Intake citation:** Manufacturing brief — "Planning snapshot archive" (`docs/intake/Manufacturing Automation — Project Brief.md`, Version History).  
**Defer:** MFG-002, `planning-snapshots` collection.

**Q16. Machine-down notification jobs in Phase 1?**  
**Recommended resolution:** No. Capture stoppage on snapshot; notify via existing WhatsApp until chain is defined.  
**Intake citation:** Manufacturing brief — "one press sends instant notification" (`docs/intake/Manufacturing Automation — Project Brief.md`, Change Requests); Maintenance brief — "chain TBD" (`docs/intake/Machine Maintenance Tracker — Project Brief.md`, Open Questions).  
**Defer:** MFG-004 notification job, MTN-006.

**Q17. Is Maintenance module required when Manufacturing tracks mould shots?**  
**Recommended resolution:** No for v1. Increment `moulds.shotCount` on production snapshot; show warning in admin. Maintenance jobs when module ships.  
**Intake citation:** Maintenance brief — "Receives cycle counts from Manufacturing" (`docs/intake/Machine Maintenance Tracker — Project Brief.md`, Shot Counter); Manufacturing brief — shot warning/service (`docs/intake/Manufacturing Automation — Project Brief.md`, Change Requests item 2).  
**Defer:** Entire Maintenance epic.

**Q18. `one-on-one-scores` in Manufacturing for HR bridge?**  
**Recommended resolution:** Defer. HR is Phase 2 gated; don't build HR feed without Trevor green light.  
**Intake citation:** Manufacturing brief — "feeds directly into HR platform" (`docs/intake/Manufacturing Automation — Project Brief.md`, People & Performance); HR brief deferred (`docs/intake/README.md`).  
**Defer:** MFG-007.

---

### Platform and foundations

**Q19. What is the platform setup minimum before any module?**  
**Recommended resolution:** MongoDB Atlas replica set, Vercel deploy, Payload `users` with Admin/Staff + optional `employee` link, `documents` upload collection, import-export plugin with Vercel cron for jobs. **Skip** nested-docs and activity-events.  
**Intake citation:** `docs/linear/scope-map.md` PLAT-001–006; `docs/architecture/integrations.md` import-export; `docs/modules/data-management.md` Jobs Queue on Vercel.  
**Defer:** PLAT-004, 007, 008, 009.

**Q20. Do we need `groups`, `departments`, `teams` before SPD POC?**  
**Recommended resolution:** No. Single seeded `companies` row (PIMMS) is enough; expand org tree when HR or Sales starts.  
**Intake citation:** Foundations spec lists full org (`docs/modules/foundations.md`); HR brief organogram ~300 (`docs/intake/PIMMS HR Platform — Project Brief.md`) — Phase 2.  
**Defer:** FND-001 `groups`, FND-002 `departments`/`teams`.

**Q21. Is `activity-events` collection needed for audit in v1?**  
**Recommended resolution:** No. Use collection native `createdAt`/`updatedBy` and gate sign-off records as audit trail.  
**Intake citation:** `docs/architecture/automation.md` — Activity Events for cross-module audit; foundations FND-006 (`docs/modules/foundations.md`).  
**Defer:** `activity-events` collection and PLAT-009.

**Q22. Install nested-docs plugin at platform setup?**  
**Recommended resolution:** No. No v1 candidate requires same-collection trees; SPD phases use blocks.  
**Intake citation:** `docs/architecture/payload-data-model.md` — Nested Docs candidates all "evaluate at implementation"; SPD spec — "prefer blocks for v1" (`docs/modules/spd.md`).  
**Defer:** PLAT-004.

---

### Scope map and phasing

**Q23. Can Finance and Manufacturing both stay "Phase 1 Urgent" in Linear?**  
**Recommended resolution:** No. After SPD POC, **re-prioritize one**. Scope map priority table should show SPD Urgent, Foundations High, Finance **or** Manufacturing Urgent (client choice), not both parallel.  
**Intake citation:** `docs/linear/scope-map.md` — Priority: "SPD POC (June 2026), Finance active" and Manufacturing Phase 2 label vs brief Active.  
**Defer:** Parallel implementation of full Finance + full Manufacturing epics.

**Q24. How many Linear issues should Phase 1 actually contain?**  
**Recommended resolution:** ~**35** implementation issues (down from ~51 Phase 1 module issues + 9 platform): Platform 5, Foundations 4, SPD 7, plus **either** Finance 5 **or** Manufacturing 5 — not Maintenance, not integration, not custom admin.  
**Intake citation:** `docs/linear/scope-map.md` Issue count summary (~88 total).  
**Defer:** ~25–30 issues to Phase 1b/2 labels.

**Q25. Is the stakeholder website in scope for any June milestone?**  
**Recommended resolution:** No. Already deferred epic WEB-001–003.  
**Intake citation:** `docs/linear/scope-map.md` — Stakeholder website (deferred); MASTER-SPEC §3.5 team reference vs client site.  
**Defer:** Entire WEB epic.

---

## Fork resolutions (Pragmatist position on each fork)

| Fork | Pragmatist position | Notes |
|------|---------------------|-------|
| **Mould ↔ Product cardinality** | Nullable optional relationship both ways; **do not block POC** on cardinality decision | Unresolved in CONTEXT.md; validate when Manufacturing ships |
| **`finance-report-sections` collection vs blocks** | Blocks on `finance-reporting-periods` + flat `finance-report-lines` | Avoid extra collection |
| **`finance-period-snapshots` parent** | Use `finance-reporting-periods` as the snapshot parent; no separate snapshot collection | One period = one reporting snapshot |
| **`debtors-aging` / `creditors-aging` split** | Start as typed lines; split collections only if reporting queries hurt | YAGNI |
| **`spd-gate-sign-offs` vs embedded** | Separate event collection | Independent query + audit |
| **`spd-change-requests` vs block** | Separate collection | Intake first-class module; own approvals |
| **`planning-snapshots` vs re-import** | Re-import + document attachment for v1 | Defer snapshot collection |
| **`stoppage-events` vs snapshot fields** | Fields on `production-snapshots` for v1; promote to events if analytics need it | Fewer collections |
| **`reject-events` separate** | Fields on snapshot | Same as stoppage |
| **`quality-checklists` / `setter-sign-offs`** | Defer entire features (CR 2026-06-01) | Not WhatsApp MVP |
| **`tool-change-events`** | Defer | CR 2026-06-01 |
| **`maintenance-job-parts` collection vs array** | Array on `maintenance-jobs` when module ships | Owned substructure |
| **`one-on-one-scores` home (Mfg vs HR)** | Defer; when built, **HR owns** canonical collection, Manufacturing writes via shared Employee ID | Avoid duplicate |
| **`activity-events` cross-module** | Defer collection entirely | Use native audit + domain events |
| **`groups` hierarchy depth** | Skip `groups`; single company seed for POC | Add when multi-company reporting needs it |
| **`spd-client-form-submissions`** | Defer | Forms not POC |
| **Nested Docs plugin** | Do not install for v1 | No eligible tree |
| **`tags` collection** | Defer | Use `documents` metadata fields |
| **`odoo-sync-snapshots`** | Defer to Odoo sync epic | Phase 2+ per finance.md |
| **`sales-performance-snapshots`** | Defer; compute at read time | Phase 2 |
| **SPD standalone vs ecosystem** | Ecosystem wins — shared app, minimal shared foundations | Documented override in MASTER-SPEC §4 |
| **Finance PPT vs data hub** | Data hub in Payload first; PPT **deferred phase** consumer | Documented override in intake README conflicts table |
| **Maintenance standalone vs module** | Same Payload app, separate admin group; **module deferred** | Maintenance brief open question |

---

## CONTEXT.md glossary proposals (terms only, no implementation)

Proposed additions or clarifications for `CONTEXT.md` — terminology only:

1. **Reporting Snapshot** — A point-in-time finance (or module-specific) data package for one Company and Reporting Period; not a universal Period entity.
2. **Process Template Snapshot** — The frozen copy of an SPD Process Template embedded on an SPD Project at creation; template updates do not retroactively change active projects.
3. **In-Scope Change** — SPD change request classification: redo without client cost approval (intake: in-scope).
4. **Out-of-Scope Change** — SPD change request requiring cost and client sign-off before work proceeds.
5. **Planning Import** — A bulk load of manufacturing orders from Excel/CSV via import-export plugin; not live Excel-as-database.
6. **Production Round** — One line-manager submission cycle covering assigned machines (tablet rounds); maps to `production-snapshots` records.
7. **WhatsApp Replacement Milestone** — Minimum Manufacturing delivery: imported plan + round entry + stoppage capture; excludes TV dashboard and CR 2026-06-01 features.
8. **Downstream Report Consumer** — External app or job that reads Payload finance data to render PPT/PDF; not part of core schema.
9. **Deferred Phase** — Intake capability scheduled after current milestone; still in product backlog, not rejected.
10. **POC Gate** — Conrad review meeting validating SPD process template accuracy (~75%) before custom UI or integrations investment.

---

## Spec amendment recommendations

### `docs/MASTER-SPEC.md`

1. **§10 Delivery phases** — Split Phase 1 into **1a (Foundations + SPD POC)** and **1b (Finance *or* Manufacturing)**; move Maintenance to Phase 1b or 2.
2. **§3.5 UI** — State explicitly: "Custom admin views are **post-POC** for SPD and **post-WhatsApp-MVP** for Manufacturing unless client pays for parallel UI track."
3. **§11 Open decisions** — Add row: "Phase 1 module sequencing after SPD POC — Finance vs Manufacturing (client decision)."
4. **Priority footnote** — Align with Pragmatist: Odoo sync and PPT generation are **deferred phase**, not Phase 1 deliverables.

### `docs/linear/scope-map.md`

1. Re-label **Maintenance epic** → `phase:2` (or `phase:1b` after Manufacturing).
2. Re-label **MFG-002, 004–011, MFG-009–010** → deferred; keep MFG-001, 003, 008 (settings), import mapping.
3. Re-label **PLAT-004, 007–009** → `phase:2` or remove from initial creation checklist.
4. Re-label **SPD-008–010** → `phase:1b` post-Conrad.
5. Re-label **FIN-007, FIN-INT-*** → `phase:2` / integration.
6. Update **Issue count summary** with Pragmatist tier: ~35 Phase 1a, ~15 Phase 1b (one ops module).
7. **Priority table** — Change to: Urgent = SPD POC + platform minimum; High = Foundations slice; Urgent (pick one) = Finance **or** Manufacturing.

### `docs/modules/spd.md`

1. Add **"POC minimum (June 2026)"** section listing six collections + default admin only.
2. Move custom admin views and client forms to **"Post-POC (deferred phase)"**.

### `docs/modules/manufacturing.md`

1. Add **"WhatsApp Replacement MVP"** subsection explicitly excluding CR 2026-06-01 features.
2. Mark `planning-snapshots`, `quality-checklists`, `setter-sign-offs`, `tool-change-events`, `one-on-one-scores` as deferred phase.

### `docs/modules/finance.md`

1. Add **"Payload data hub MVP (no PPT)"** subsection: periods, lines, metrics, CSV import.
2. Clarify intake conflict: automated Odoo + zero manual entry is **target state deferred phase**.

### `docs/modules/foundations.md`

1. Add **"SPD POC foundation slice"** — `companies`, `employees`, `users`, `customers`, `contacts`, `documents` only.

### `docs/architecture/payload-data-model.md`

1. Mark `activity-events` and Nested Docs plugin as **Phase 2+** in shared foundations table footnote.

---

## Phase 1 MVP shape (Pragmatist view — ordered delivery)

### Phase 1a — Ship by end of June 2026 (SPD POC)

| Order | Deliverable | Collections / artifacts |
|-------|-------------|-------------------------|
| 1 | Platform | MongoDB, Vercel, `users`, `documents`, import-export + cron |
| 2 | Foundations slice | `companies`, `employees`, `customers`, `contacts` |
| 3 | SPD core | `spd-process-templates`, `spd-projects`, `spd-gate-sign-offs`, `spd-change-requests`, `tooling-assets`, `spd-settings` |
| 4 | POC content | Import SPD_ProcessFlow.docx → template; 1–2 demo projects |
| 5 | Milestone | Conrad POC review (SPD-011) |

**Explicitly not in 1a:** Custom SPD dashboards, client forms, AI validation, machines/moulds, Finance, Manufacturing, Maintenance, Odoo, activity-events, nested-docs.

### Phase 1b — Client picks one (July–September 2026 target)

**Option A — Finance minimum**

| Deliverable | Collections |
|-------------|-------------|
| Reporting periods + CSV import | `finance-reporting-periods`, `finance-report-lines`, `financial-metrics`, `finance-settings` |
| Optional second slice | `finance-targets`, aging as typed lines |
| Out of repo | PPT generator, scheduled email, Odoo sync jobs |

**Option B — Manufacturing WhatsApp replacement**

| Deliverable | Collections |
|-------------|-------------|
| Factory master | `sites`, `machines`, `products`, `moulds` (minimal) |
| Plan + rounds | `manufacturing-orders`, `production-snapshots`, `manufacturing-settings` |
| Import | Planning Excel via import-export |
| Out of v1 | Custom tablet UI (use Payload responsive admin), notifications, planning snapshots, CR 2026-06-01 features |

### Phase 2+ (deferred phase backlog)

- Maintenance module (after Manufacturing mould shots live)
- Remaining Finance report types + downstream PPT consumer
- Manufacturing CR features (quality, setter, tool change)
- Custom admin views (SPD, Manufacturing, Finance)
- Odoo sync epic (FIN-INT)
- HR, Sales, LLM, stakeholder website
- `activity-events`, nested-docs, full org hierarchy, access control matrix

---

*Grill conducted 2026-06-09 by Pragmatist persona. Intake files unchanged per mandate.*
