# Module: Data Management (Cross-cutting)

Operational data movement: import, export, jobs, and integration plumbing.

**Delivery phase:** 0–1 (plugin setup); grows with integrations

---

## Purpose

Enable bulk load and export of Payload collections without making "Import Batch" a primary business domain concept. Provide admin visibility into jobs and plugin-managed import/export artifacts.

Payload is the **canonical operational hub** — external systems (Odoo, Pipedrive, SharePoint) attach via metadata, not duplicate entities. Connectors are **not built** in the current phase; the schema is integration-ready.

---

## Hub pattern — canonical records + external refs

**Pattern chosen:** Option A — `externalRefs` array on hub collections (see `src/lib/integration/externalRefsField.ts`).

Each row links one canonical Payload document to an external system:

| Field | Purpose |
|-------|---------|
| `system` | `odoo` \| `pipedrive` \| `sharepoint` \| `manual` |
| `externalId` | ID in the external system |
| `lastSyncedAt` | Last successful sync timestamp (future jobs) |
| `syncStatus` | `synced` \| `pending` \| `error` \| `stale` |

**Collections with `externalRefs`:** `employees`, `customers`, `contacts`, `products`, `machines`, `moulds`, `documents`, `finance-report-lines`, `financial-metrics`, `sales-targets`, `sales-actuals`, `parts`, `manufacturing-orders`, `production-snapshots`.

**Integration settings global** (`integration-settings`): per-system stubs — `enabled: false`, `notes`, `baseUrlPlaceholder`, empty `fieldMapping` JSON. No secrets in repo.

**Sync audit** (`integration-sync-events`): append-only log for future jobs — `system`, `direction`, `entityType`, `entityId`, `status`, `message`, `occurredAt`.

Assumptions documented here only; connector implementation is deferred per [PLATFORM-ROADMAP.md](../PLATFORM-ROADMAP.md).

---

## Payload components

| Component | Role |
|-----------|------|
| `@payloadcms/plugin-import-export` | CSV/JSON import/export UI |
| Jobs Queue | Large imports, exports, sync, notifications |
| `payload-jobs` collection | Visible when `jobsCollectionOverrides` enables admin debugging |
| Hooks | Queue jobs on business events |

---

## Collections enabled for import/export

| Collection | Status | Notes |
|------------|--------|-------|
| `employees` | Enabled | Organogram onboarding |
| `users`, `media` | Enabled | Admin verify export |
| `products`, `machines`, `moulds` | Enabled | Factory setup |
| `parts` | Enabled | Maintenance catalog |
| `manufacturing-orders` | Enabled | Planning sheet |
| `production-snapshots` | Enabled | Round entry bulk load |
| `one-on-one-scores` | Enabled | HR rollup path |
| `maintenance-jobs` | Enabled | Job history import |
| `finance-reporting-periods` | Enabled | Period headers |
| `finance-report-lines` | Enabled | Manual finance load |
| `financial-metrics` | Enabled | Derived metrics |
| `sales-targets`, `sales-actuals`, `sales-activities` | Enabled | Sales performance |
| `spd-projects`, `spd-gate-sign-offs`, `spd-change-requests` | Enabled | SPD fixtures |

Configured in `src/payload.config.ts` → `importExportCollections`.

Governance: privileged import roles — **deferred** (admin-only write on finance/HR applies; import still uses authenticated user).

---

## Jobs Queue setup (Vercel)

- Do **not** rely on in-process `autoRun` alone on serverless
- **Hobby plan (current):** `vercel.json` crons are **disabled** — Hobby allows [at most one cron per day](https://vercel.com/docs/cron-jobs/usage-and-pricing); our `*/5` and hourly schedules fail deploy. Import/export jobs queue in admin but do not auto-process on Vercel until cron is enabled.
- **Pro plan (later):** copy `vercel.cron.example.json` → `vercel.json`, set `CRON_SECRET` in Vercel env, redeploy.
- Cron hits `/api/payload-jobs/run` and `/api/payload-jobs/handle-schedules` per [Payload jobs docs](https://payloadcms.com/docs/jobs-queue/overview)
- `jobs.access.run` validates `Authorization: Bearer {CRON_SECRET}` for cron/manual job runs
- `jobsCollectionOverrides` exposes `payload-jobs` in admin for debugging
- Local dev: set `ENABLE_PAYLOAD_AUTORUN=true` to process jobs in-process (optional)

### Verification

`pnpm tsx scripts/verify/platform-smoke.ts` — asserts demo seed records exist across modules after `onInit`.

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
