# Automation — Hooks and Jobs Queue

Side effects and long-running work use Payload-native mechanisms — **not** generic Automation Rule collections unless business users must edit rules in admin.

References:

- [Hooks overview](https://payloadcms.com/docs/hooks/overview)
- [Jobs Queue overview](https://payloadcms.com/docs/jobs-queue/overview)

---

## When to use what

| Mechanism | Use for |
|-----------|---------|
| **beforeChange / afterChange hooks** | Validation, denormalized fields, queueing jobs, activity events |
| **Non-blocking hooks** | Fire-and-forget side effects that must not block save (`void` + no returned Promise) |
| **Jobs Queue** | Email, SharePoint filing, Odoo sync, large imports, embeddings, report generation |
| **Globals** | Thresholds, default recipient chains, cron expressions (labels), template default IDs |
| **Activity Events collection** | Cross-module audit trail of meaningful business events |

---

## Job tasks (conceptual — implement later)

| Task slug | Trigger | Module |
|-----------|---------|--------|
| `sendNotification` | Machine stopped, maintenance due, review due | Cross-cutting |
| `fileDocumentToSharePoint` | Contract/review approved | HR |
| `syncOdooFinance` | Schedule / manual | Finance |
| `importPlanningSheet` | Upload / schedule | Manufacturing |
| `refreshEmbeddings` | Record change (Phase 3) | LLM |
| `generateFinanceReport` | On-demand (downstream) | Finance |

---

## Manufacturing examples

- **afterChange** on `production-snapshots`: update machine rollup fields; if reject % > global threshold → queue notification job
- **afterChange** on `moulds`: if shot count ≥ threshold from `maintenance-settings` → queue maintenance job creation
- **afterChange** on stoppage: queue machine-down notification per escalation in global

---

## SPD examples

- **afterChange** on gate sign-off: unlock next phase on project snapshot; write activity event
- **beforeChange** on change request: validate classification and required approvals

---

## HR examples

- **afterChange** on review submission: compute weighted score; queue summary generation (Phase 2+); optional SharePoint job
- Scheduled job (cron): quarterly review reminders — read `hr-settings`

---

## Hook safety

- Pass `req` to nested payload operations in hooks (transactions)
- Use `context` flags to prevent infinite loops
- Local API: `overrideAccess: false` when acting on behalf of a user

---

## Vercel / serverless

On Vercel, prefer **cron → API routes** that call `payload.jobs.run` and `handle-schedules` rather than `autoRun` in-process. Document in deployment runbook when implementation starts.

---

## What we are not building (v1)

- Notification Rules collection
- Workflow engine collection
- Separate Import Batch domain collection (plugin handles operational imports)
