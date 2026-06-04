# Module: Data Management (Cross-cutting)

Operational data movement: import, export, jobs, and integration plumbing.

**Delivery phase:** 0–1 (plugin setup); grows with integrations

---

## Purpose

Enable bulk load and export of Payload collections without making "Import Batch" a primary business domain concept. Provide admin visibility into jobs and plugin-managed import/export artifacts.

---

## Payload components

| Component | Role |
|-----------|------|
| `@payloadcms/plugin-import-export` | CSV/JSON import/export UI |
| Jobs Queue | Large imports, exports, sync, notifications |
| `payload-jobs` collection | Visible when `jobsCollectionOverrides` enables admin debugging |
| Hooks | Queue jobs on business events |

---

## Collections enabled for import/export (initial recommendation)

| Collection | Priority | Notes |
|------------|----------|-------|
| `employees` | High | Organogram onboarding |
| `machines` | High | Factory setup |
| `manufacturing-orders` | High | Planning sheet |
| `finance-report-lines` | Medium | Manual finance load |
| `sales-targets`, `sales-actuals` | Medium | Phase 2 |
| `parts` | Low | Maintenance catalog |

Governance: privileged import roles — **deferred** with access control pass.

---

## Jobs Queue setup (Vercel)

- Do **not** rely on in-process `autoRun` alone on serverless
- Use Vercel Cron → `/api/payload-jobs/run` and `handle-schedules` per [Payload jobs docs](https://payloadcms.com/docs/jobs-queue/overview)
- Requires Vercel Pro for cron in most cases — see [operating-costs](../architecture/operating-costs.md)

---

## Admin grouping (deferred)

Suggested group: **Data Management** — imports, exports, jobs visibility.

---

## Source evidence

- Ecosystem scoping — import-export plugin, defer import batch domain model
- [integrations.md](../architecture/integrations.md)
- [automation.md](../architecture/automation.md)

---

## Open questions

- Per-collection import limits for non-admin users
- Separate export targets for HR vs Finance (plugin `overrideCollection`)
