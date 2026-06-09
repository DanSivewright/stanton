# Linear Scope Map

**Status:** **Linear project complete** — all scope-map issues created 2026-06-09. See [LINEAR-SETUP.md](./LINEAR-SETUP.md).

**Linear project:** [Stanton / PIMMS Payload Ecosystem](https://linear.app/bui-workspace/project/stanton-pimms-payload-ecosystem-d04036adc64f) (BUI-224–325, 103 issues)

**Canonical spec:** [MASTER-SPEC.md](../MASTER-SPEC.md)  
**Phase 1 delivery:** [PHASE-1-MVP.md](../PHASE-1-MVP.md)  
**Pending issues:** [pending-issues.md](./pending-issues.md)

---

## Proposed Linear structure

### Top-level project

**Name:** `Stanton / PIMMS Payload Ecosystem`  
**Description:** Single Payload CMS hub for Stanton Group / PIMMS — normalized data, admin UI, phased modules.

### Module initiatives (labels or sub-projects)

Use **labels** `module:*` on every issue. Optional **projects** per module if workspace prefers separation.

| Label | Module |
|-------|--------|
| `module:foundations` | Foundations |
| `module:manufacturing` | Manufacturing |
| `module:maintenance` | Maintenance |
| `module:finance` | Finance |
| `module:spd` | SPD |
| `module:sales` | Sales |
| `module:hr` | HR |
| `module:llm` | LLM / MCP |
| `module:data` | Data Management |
| `module:docs` | Documentation / ops |

### Cross-cutting labels

| Label | Use |
|-------|-----|
| `phase:0` | Documentation, foundations scope |
| `phase:1a` | SPD POC + platform minimum (June 2026) |
| `phase:1b` | Finance **or** Manufacturing (client choice) |
| `phase:1` | Legacy label — prefer `phase:1a` / `phase:1b` |
| `phase:1.5` | Maintenance, activity-events, custom admin views |
| `phase:2` | Sales, HR, Odoo sync |
| `phase:3` | LLM, deep integrations |
| `type:collection` | New Payload collection |
| `type:global` | New Payload global |
| `type:hook` | Hooks / jobs |
| `type:admin-ui` | Custom admin view |
| `type:integration` | External system |
| `type:plugin` | Payload plugin setup |
| `blocked:client` | Waiting on client input |
| `blocked:access` | Access control TBD |

### Priority (Linear priority field)

- **Urgent:** SPD POC (June 2026), Platform minimum (PLAT-001–006)
- **High:** Foundations slice (FND-003, FND-004), SPD core (SPD-001–007)
- **Urgent (pick one after POC):** Finance data hub **or** Manufacturing WhatsApp MVP — client decision
- **Medium:** Maintenance, deferred Phase 1 items, Sales
- **Low:** HR (deferred), LLM, custom admin views

---

## Epic breakdown

### EPIC: Documentation & governance (Phase 0) — largely complete in repo

| Issue | Description | Labels |
|-------|-------------|--------|
| DOC-001 | Intake archive + README | `module:docs`, `phase:0` |
| DOC-002 | CONTEXT.md glossary | `module:docs`, `phase:0` |
| DOC-003 | MASTER-SPEC.md | `module:docs`, `phase:0` |
| DOC-004 | Architecture docs (4 files) | `module:docs`, `phase:0` |
| DOC-005 | Module specs (9 files) | `module:docs`, `phase:0` |
| DOC-006 | Linear scope map epic-level approval | `module:docs`, `phase:0`, `blocked:client` |
| DOC-008 | Phase 1 MVP reconciliation complete | `module:docs`, `phase:0` |
| DOC-007 | Operating rule: markdown + Linear sync | `module:docs` |

### EPIC: Payload platform setup

| Issue | Description | Labels |
|-------|-------------|--------|
| PLAT-001 | MongoDB Atlas replica set + `DATABASE_URL` | `phase:1a` |
| PLAT-002 | Vercel project + env secrets | `phase:1a` |
| PLAT-003 | Install import-export plugin + jobs autoRun/cron | `module:data`, `type:plugin`, `phase:1a` |
| PLAT-004 | Install nested-docs plugin (configure collections) | `type:plugin`, `phase:1.5` — **deferred** |
| PLAT-005 | Create `documents` upload collection | `module:foundations`, `phase:1a` |
| PLAT-006 | Extend `users` — roles, employee link, companyScope skeleton | `module:foundations`, `phase:1a` |
| PLAT-007 | Access control matrix design (full) | `blocked:access`, `phase:1.5` — **deferred** |
| PLAT-008 | Admin collection grouping | `type:admin-ui`, `phase:1.5` — **deferred** |
| PLAT-009 | Activity events hook helpers | `type:hook`, `phase:1.5` — **deferred** |

### EPIC: Foundations

| Issue | Collection / task | Spec ref | Phase |
|-------|-------------------|----------|-------|
| FND-001 | `companies` (minimal; `groups` deferred) | [foundations.md](../modules/foundations.md) | `phase:1a` |
| FND-002 | `sites`, `departments`, `teams` | foundations | `phase:1.5` — **deferred** |
| FND-003 | `employees` + import template | foundations | `phase:1a` |
| FND-004 | `customers`, `contacts` | foundations | `phase:1a` |
| FND-005 | `products`, `machines`, `moulds` | foundations | `phase:1b` (Manufacturing path) |
| FND-006 | `tags`, `activity-events` | foundations | `phase:1.5` — **deferred** |
| FND-007 | Seed data script / import for 3 sites, 40 machines | foundations | `phase:1b` (Manufacturing path) |

### EPIC: Manufacturing (Phase 1b option)

| Issue | Collection / task | Spec ref | Phase |
|-------|-------------------|----------|-------|
| MFG-001 | `manufacturing-orders` + planning import mapping | [manufacturing.md](../modules/manufacturing.md) | `phase:1b` |
| MFG-002 | `planning-snapshots` | manufacturing | `phase:1.5` — **deferred** |
| MFG-003 | `production-snapshots` + validation hooks | manufacturing | `phase:1b` |
| MFG-004 | `stoppage-events` + notification job | manufacturing | `phase:1.5` — **deferred** |
| MFG-005 | `tool-change-events` | manufacturing | `phase:1.5` — **deferred** (CR 2026-06-01) |
| MFG-006 | `quality-checklists` + setter sign-offs | manufacturing | `phase:1.5` — **deferred** (CR 2026-06-01) |
| MFG-007 | `one-on-one-scores` | manufacturing | `phase:1.5` — **deferred** |
| MFG-008 | `manufacturing-settings` global | manufacturing | `phase:1b` |
| MFG-009 | Admin: machine grid dashboard view | `type:admin-ui` | `phase:1.5` — **deferred** |
| MFG-010 | Admin: tablet round entry view | `type:admin-ui` | `phase:1.5` — **deferred** |
| MFG-011 | Mould shot count → maintenance job hook | `module:maintenance` | `phase:1.5` — **deferred** |

### EPIC: Maintenance (Phase 1.5 — after Manufacturing)

| Issue | Collection / task | Spec ref | Phase |
|-------|-------------------|----------|-------|
| MTN-001 | `parts` catalog | [maintenance.md](../modules/maintenance.md) | `phase:1.5` |
| MTN-002 | `maintenance-jobs` + statuses | maintenance | `phase:1.5` |
| MTN-003 | `maintenance-pos` → documents | maintenance | `phase:1.5` |
| MTN-004 | `maintenance-settings` global | maintenance | `phase:1.5` |
| MTN-005 | Triggers: shot count, machine stopped | `type:hook` | `phase:1.5` |
| MTN-006 | Machine-down notification job | `type:hook`, `blocked:client` | `phase:1.5` |

### EPIC: Finance (Phase 1b option)

| Issue | Collection / task | Spec ref | Phase |
|-------|-------------------|----------|-------|
| FIN-001 | `finance-reporting-periods` + sections blocks + period lock | [finance.md](../modules/finance.md) | `phase:1b` |
| FIN-002 | `finance-report-lines` + import mapping | finance | `phase:1b` |
| FIN-003 | `financial-metrics` | finance | `phase:1b` |
| FIN-004 | Aging as typed lines (or split collections if needed) | finance | `phase:1b` |
| FIN-005 | `finance-targets` | finance | `phase:1.5` — optional in 1b minimum |
| FIN-006 | `finance-settings` global | finance | `phase:1b` |
| FIN-007 | Finance API route for downstream reports | finance | `phase:2` — **deferred** |
| FIN-008 | Confirm full report list with client | `blocked:client` | `phase:1b` |

### EPIC: Finance — Odoo sync (Phase 2+ integration)

| Issue | Description | Labels |
|-------|-------------|--------|
| FIN-INT-001 | Odoo integration user + API key | `type:integration`, `phase:2` |
| FIN-INT-002 | Port/test `odoo/client.ts` | `type:integration` |
| FIN-INT-003 | `fields_get` discovery doc | `type:integration` |
| FIN-INT-004 | Incremental sync job | `type:hook` |
| FIN-INT-005 | Full reconcile job | `type:hook` |
| FIN-INT-006 | Sync monitoring + alerts | `type:hook` |
| FIN-INT-007 | Optional `odoo-sync-snapshots` | `type:collection` |

### EPIC: SPD (Phase 1a — POC pressure)

| Issue | Collection / task | Spec ref | Phase |
|-------|-------------------|----------|-------|
| SPD-001 | `spd-process-templates` (nested blocks) | [spd.md](../modules/spd.md) | `phase:1a` |
| SPD-002 | Import/template from SPD_ProcessFlow.docx | `blocked:client` | `phase:1a` |
| SPD-003 | `spd-projects` + template snapshot on create | spd | `phase:1a` |
| SPD-004 | `spd-gate-sign-offs` + phase unlock hooks | spd | `phase:1a` |
| SPD-005 | `spd-change-requests` | spd | `phase:1a` |
| SPD-006 | `tooling-assets` | spd | `phase:1a` |
| SPD-007 | `spd-settings` global | spd | `phase:1a` |
| SPD-008 | Admin: project progress view | `type:admin-ui` | `phase:1.5` — **deferred** |
| SPD-009 | Admin: gate approval queue | `type:admin-ui` | `phase:1.5` — **deferred** |
| SPD-010 | Client form submission endpoint | spd | `phase:1.5` — **deferred** |
| SPD-011 | Conrad POC review meeting | `blocked:client` | `phase:1a` |

### EPIC: Sales (Phase 2)

| Issue | Collection / task | Spec ref |
|-------|-------------------|----------|
| SAL-001 | `sales-performance-periods` | [sales.md](../modules/sales.md) |
| SAL-002 | `sales-targets` | sales |
| SAL-003 | `sales-activities` (Hunt/Care) | sales |
| SAL-004 | `sales-actuals` | sales |
| SAL-005 | `sales-settings` global | sales |
| SAL-006 | Pipedrive field mapping spike | `blocked:client`, `type:integration` |
| SAL-007 | Discrepancy dashboard admin view | `type:admin-ui` |

### EPIC: HR (Phase 2 — gated)

| Issue | Collection / task | Spec ref |
|-------|-------------------|----------|
| HR-000 | Trevor green light | `blocked:client` |
| HR-001 | `contract-templates` | [hr.md](../modules/hr.md) |
| HR-002 | Employee contracts tab + `performance-contracts` | hr |
| HR-003 | `quarterly-reviews` workflow | hr |
| HR-004 | `hr-settings` global | hr |
| HR-005 | SharePoint filing job | `type:integration` |
| HR-006 | Composite score rollup from Manufacturing/Sales | `type:hook` |
| HR-007 | AI summary generation (optional) | `phase:3` |

### EPIC: LLM / MCP (Phase 3)

| Issue | Description | Labels |
|-------|-------------|--------|
| LLM-001 | MCP plugin install + collection allowlist | `module:llm`, `type:plugin` |
| LLM-002 | Agent user role + access policy | `module:llm` |
| LLM-003 | Admin chat panel or standalone UI spike | `type:admin-ui` |
| LLM-004 | Provider selection (Claude/OpenAI) | `blocked:client` |
| LLM-005 | Indexing strategy (if needed beyond MCP find) | `module:llm` |

### EPIC: Stakeholder website (deferred)

| Issue | Description | Labels |
|-------|-------------|--------|
| WEB-001 | Stakeholder site — after doc approval | `phase:3`, `blocked:client` |
| WEB-002 | Huashu design implementation | `phase:3` |
| WEB-003 | Operating costs page with markup columns | `phase:3` |

---

## Suggested Linear workflow rules

1. Every implementation issue links to a module spec section and intake source where applicable.
2. On issue completion: comment summary + link to changed markdown paths.
3. On scope change: update `docs/modules/*.md` first, then Linear.
4. @mention Lee (or configured teammate) on status changes per team preference.

---

## Creation checklist

- [x] Create top-level project + milestones + project documents
- [x] Create label groups (stanton-module, phase, work-type, blocked)
- [x] Create epics E0–E11 (BUI-224–235)
- [x] Create deferred/1b/1.5/2 child issues (BUI-236–273)
- [x] Unblock workspace limit (deleted legacy projects 2026-06-09)
- [x] Create Phase 1a issues (BUI-274–289)
- [x] Create DOC audit trail (BUI-290–297, Done)
- [x] Create phase 2–3 backlog (BUI-298–325)
- [ ] Set Phase 1a issues to current cycle

---

## Issue count summary

| Epic area | Total issues | Phase 1a (June POC) | Phase 1b (one module) | Deferred |
|-----------|--------------|---------------------|-------------------------|----------|
| Documentation | 8 | — | — | — |
| Platform | 9 | 6 (PLAT-001–006) | — | 3 |
| Foundations | 7 | 3 (FND-001, 003, 004) | 2 (FND-005, 007 Mfg) | 2 |
| SPD | 11 | 8 (SPD-001–007, 011) | — | 3 |
| Manufacturing | 11 | — | 3 (MFG-001, 003, 008) | 8 |
| Finance | 8 | — | 5–6 (FIN-001–004, 006, 008) | 2+ |
| Maintenance | 6 | — | — | 6 |
| Finance Odoo sync | 7 | — | — | 7 |
| Sales | 7 | — | — | 7 |
| HR | 7 | — | — | 7 |
| LLM | 5 | — | — | 5 |
| Stakeholder web | 3 | — | — | 3 |
| **Active slice** | **~88** | **~17** | **~8–9** (one path) | **~62** |

**Phase 1a target:** ~17 implementation issues (Platform 6 + Foundations 3 + SPD 8).  
**Phase 1b target:** ~8–9 additional issues for Finance **or** Manufacturing — not both.

Adjust granularity when creating in Linear (split collection field work into sub-tasks as needed).
