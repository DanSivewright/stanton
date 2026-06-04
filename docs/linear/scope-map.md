# Linear Scope Map

**Status:** Markdown only — **do not create Linear issues until this map is reviewed and explicitly approved.**

**Canonical spec:** [MASTER-SPEC.md](../MASTER-SPEC.md)  
**After approval:** Use Linear MCP to create projects/issues; comment on issues when specs change; keep markdown in sync.

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
| `phase:1` | MVP / active modules |
| `phase:2` | Sales, HR |
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

- **Urgent:** SPD POC (June 2026), Finance active
- **High:** Manufacturing Phase 2, Foundations
- **Medium:** Maintenance, Sales
- **Low:** HR (deferred), LLM

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
| DOC-006 | Linear scope map approval | `module:docs`, `phase:0`, `blocked:client` |
| DOC-007 | Operating rule: markdown + Linear sync | `module:docs` |

### EPIC: Payload platform setup (Phase 0–1)

| Issue | Description | Labels |
|-------|-------------|--------|
| PLAT-001 | MongoDB Atlas replica set + `DATABASE_URL` | `phase:1` |
| PLAT-002 | Vercel project + env secrets | `phase:1` |
| PLAT-003 | Install import-export plugin + jobs autoRun/cron | `module:data`, `type:plugin` |
| PLAT-004 | Install nested-docs plugin (configure collections) | `type:plugin` |
| PLAT-005 | Create `documents` upload collection | `module:foundations` |
| PLAT-006 | Extend `users` — roles, employee link | `module:foundations` |
| PLAT-007 | Access control matrix design | `blocked:access` |
| PLAT-008 | Admin collection grouping | `type:admin-ui` |
| PLAT-009 | Activity events hook helpers | `type:hook` |

### EPIC: Foundations (Phase 1)

| Issue | Collection / task | Spec ref |
|-------|-------------------|----------|
| FND-001 | `groups`, `companies` | [foundations.md](../modules/foundations.md) |
| FND-002 | `sites`, `departments`, `teams` | foundations |
| FND-003 | `employees` + import template | foundations |
| FND-004 | `customers`, `contacts` | foundations |
| FND-005 | `products`, `machines`, `moulds` | foundations |
| FND-006 | `tags`, `activity-events` | foundations |
| FND-007 | Seed data script / import for 3 sites, 40 machines | `phase:1` |

### EPIC: Manufacturing (Phase 1)

| Issue | Collection / task | Spec ref |
|-------|-------------------|----------|
| MFG-001 | `manufacturing-orders` + planning import mapping | [manufacturing.md](../modules/manufacturing.md) |
| MFG-002 | `planning-snapshots` | manufacturing |
| MFG-003 | `production-snapshots` + validation hooks | manufacturing |
| MFG-004 | `stoppage-events` + notification job | manufacturing |
| MFG-005 | `tool-change-events` | manufacturing |
| MFG-006 | `quality-checklists` + setter sign-offs | manufacturing |
| MFG-007 | `one-on-one-scores` | manufacturing |
| MFG-008 | `manufacturing-settings` global | manufacturing |
| MFG-009 | Admin: machine grid dashboard view | `type:admin-ui` |
| MFG-010 | Admin: tablet round entry view | `type:admin-ui` |
| MFG-011 | Mould shot count → maintenance job hook | `module:maintenance` |

### EPIC: Maintenance (Phase 1)

| Issue | Collection / task | Spec ref |
|-------|-------------------|----------|
| MTN-001 | `parts` catalog | [maintenance.md](../modules/maintenance.md) |
| MTN-002 | `maintenance-jobs` + statuses | maintenance |
| MTN-003 | `maintenance-pos` → documents | maintenance |
| MTN-004 | `maintenance-settings` global | maintenance |
| MTN-005 | Triggers: shot count, machine stopped | `type:hook` |
| MTN-006 | Machine-down notification job | `type:hook`, `blocked:client` |

### EPIC: Finance (Phase 1)

| Issue | Collection / task | Spec ref |
|-------|-------------------|----------|
| FIN-001 | `finance-reporting-periods` | [finance.md](../modules/finance.md) |
| FIN-002 | `finance-report-lines` + import mapping | finance |
| FIN-003 | `financial-metrics` | finance |
| FIN-004 | `debtors-aging`, `creditors-aging` | finance |
| FIN-005 | `finance-targets` | finance |
| FIN-006 | `finance-settings` global | finance |
| FIN-007 | Finance API route for downstream reports | `phase:1` |
| FIN-008 | Confirm full report list with client | `blocked:client` |

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

### EPIC: SPD (Phase 1 — POC pressure)

| Issue | Collection / task | Spec ref |
|-------|-------------------|----------|
| SPD-001 | `spd-process-templates` (nested blocks) | [spd.md](../modules/spd.md) |
| SPD-002 | Import/template from SPD_ProcessFlow.docx | `blocked:client` |
| SPD-003 | `spd-projects` + template snapshot on create | spd |
| SPD-004 | `spd-gate-sign-offs` + phase unlock hooks | spd |
| SPD-005 | `spd-change-requests` | spd |
| SPD-006 | `tooling-assets` | spd |
| SPD-007 | `spd-settings` global | spd |
| SPD-008 | Admin: project progress view | `type:admin-ui` |
| SPD-009 | Admin: gate approval queue | `type:admin-ui` |
| SPD-010 | Client form submission endpoint | spd |
| SPD-011 | Conrad POC review meeting | `blocked:client` |

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

## Creation checklist (post-approval)

- [ ] Create top-level project
- [ ] Create labels listed above
- [ ] Create epics as parent issues or projects
- [ ] Create child issues with descriptions copied from module specs
- [ ] Set SPD and Finance issues to current cycle
- [ ] Attach links to GitHub repo `docs/` paths

---

## Issue count summary

| Epic area | Approx. issues |
|-----------|----------------|
| Documentation | 7 |
| Platform | 9 |
| Foundations | 7 |
| Manufacturing | 11 |
| Maintenance | 6 |
| Finance | 8 + 7 integration |
| SPD | 11 |
| Sales | 7 |
| HR | 7 |
| LLM | 5 |
| Stakeholder web | 3 |
| **Total** | **~88** |

Adjust granularity when creating in Linear (split collection field work into sub-tasks as needed).
