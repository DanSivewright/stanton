# Platform Roadmap — Full Hub Build

**Status:** Active (2026-06-09)  
**Supersedes:** POC-gated / client-blocked phasing for **implementation** (docs still reference Phase 1a/1b for delivery history)

## Decision

Build **all intake modules** as thin, working Payload collections now. Client can refine domain models later. Assumptions are documented per module spec.

**Explicitly deprioritized:**

- Conrad POC review gate (SPD-011 / BUI-289)
- Trevor HR green light as implementation blocker
- Phase 1b fork (Finance **or** Manufacturing) — **both** MVP slices shipped

## Admin navigation groups

| Group | Contents |
|-------|----------|
| **Platform** | Users, Media, Tags, Activity Events, Integration Sync Events, Jobs, LLM Prompts, Integration Settings |
| **Foundations** | Companies, Sites, Departments, Teams, Employees, Customers, Contacts, Products, Machines, Moulds, Documents |
| **SPD** | Process templates, projects, gate sign-offs, change requests, tooling assets |
| **Manufacturing** | MOs, production snapshots, one-on-one scores |
| **Maintenance** | Parts, jobs, POs |
| **Finance** | Reporting periods, lines, metrics |
| **Sales** | Performance periods, targets, actuals, activities |
| **HR** | Contract templates, performance contracts, quarterly reviews |
| **AI / LLM** | LLM settings (MCP plugin not installed) |

## Globals

`spd-settings`, `manufacturing-settings`, `maintenance-settings`, `finance-settings`, `sales-settings`, `hr-settings`, `integration-settings`, `llm-settings`

## Seed data

`src/seed/platformDemo.ts` runs on `onInit` after foundations + SPD seeds — demo records for every module.

## Wave 2 (2026-06-09) — shipped

| Area | Status |
|------|--------|
| Activity events | `recordActivityEvent` helper + hooks on gate sign-offs, snapshot submit, maintenance complete, period lock, contract approved |
| Admin custom views (lightweight) | `beforeList` summaries on production-snapshots + spd-projects; SPD `/workflow` pipeline view; SPD-008 `/management` dashboard |
| Import-export | Extended to parts, maintenance-jobs, finance periods/lines/metrics, one-on-one-scores |
| Access control (PLAT-007 basics) | Finance + HR collections/globals: staff read, admin write; `companyScope` read filter on finance |
| Verification | `scripts/verify/platform-smoke.ts` |

## Wave 3 (2026-06-09) — shipped

| Area | Status |
|------|--------|
| SPD gate enforcement | Checklist validation + phase edit locks + role check on sign-off (`validateGateSignOff`, `lockPhaseEdits`) |
| SAL-007 (lightweight) | `beforeList` discrepancy summary on `sales-performance-periods` |
| MTN-005 (stub) | Shot-count threshold → auto `maintenance-jobs` record; log-only warning notification |
| Verification | `platform-smoke.ts` extended for gate enforcement + maintenance trigger; `spd-wave3.ts` covers enforcement paths |

## Integration readiness (no connectors) — 2026-06-09

| Area | Status |
|------|--------|
| `externalRefs` on hub collections | Shipped — Option A array field (`src/lib/integration/externalRefsField.ts`) |
| `integration-settings` global | Shipped — Odoo / Pipedrive / SharePoint stubs (`enabled: false`, empty `fieldMapping`) |
| `integration-sync-events` | Shipped — append-only audit; demo seed rows |
| Demo external refs | Seeded on products, customers, sales targets, employees (Pipedrive) |
| Actual connectors / sync jobs | **Deferred** — no SDKs, no cron sync |

See [data-management.md](./modules/data-management.md) for hub pattern detail.

## Still thin / deferred

- Full custom admin views (MFG-009 tablet/TV, SPD-009 analytics dashboard, SAL-007 full dashboard)
- `@payloadcms/plugin-mcp` install (LLM-001)
- Odoo / Pipedrive / SharePoint **connectors** (schema ready; jobs not built)
- Document generation engine
- Full access control matrix (manager/direct-report, per-field HR roles)
- Nested-docs plugin (PLAT-004)
- Machine-down notification jobs (MTN-006)
- Board pack / PPT generation (FIN-007)

## References

- [requirements-audit-2026-06-09.md](./intake/requirements-audit-2026-06-09.md) — updated statuses
- [PHASE-1-MVP.md](./PHASE-1-MVP.md) — historical phasing
- [MASTER-SPEC.md](./MASTER-SPEC.md)
