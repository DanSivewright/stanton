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
- **Hobby plan (current):** `vercel.json` crons are **disabled** — Hobby allows [at most one cron per day](https://vercel.com/docs/cron-jobs/usage-and-pricing); our `*/5` and hourly schedules fail deploy. Import/export jobs queue in admin but do not auto-process on Vercel until cron is enabled.
- **Pro plan (later):** copy `vercel.cron.example.json` → `vercel.json`, set `CRON_SECRET` in Vercel env, redeploy.
- Cron hits `/api/payload-jobs/run` and `/api/payload-jobs/handle-schedules` per [Payload jobs docs](https://payloadcms.com/docs/jobs-queue/overview)
- `jobs.access.run` validates `Authorization: Bearer {CRON_SECRET}` for cron/manual job runs
- `jobsCollectionOverrides` exposes `payload-jobs` in admin for debugging
- Local dev: set `ENABLE_PAYLOAD_AUTORUN=true` to process jobs in-process (optional)

### Initial import-export collections (Phase 1a)

| Collection | Status |
|------------|--------|
| `employees` | Enabled |
| `users` | Enabled (verify export) |
| `media` | Enabled (verify export) |

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
