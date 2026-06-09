# Payload Data Model — Architecture

How we model the Stanton / PIMMS ecosystem in Payload 3 on MongoDB.

---

## Layering

| Layer | Payload construct | Holds |
|-------|-------------------|--------|
| Master data | Collections | Employee, Machine, Product, Company, … |
| Operational facts | Collections (event/snapshot style) | Production snapshots, gate sign-offs, finance period lines |
| Settings | Globals | Thresholds, cadences, default notification chains |
| Files | Upload collections | `media`, `documents` |
| Automation | Hooks + Jobs Queue | Sync, alerts, embeddings, report generation triggers |
| Hierarchy (selective) | Nested Docs plugin | Same-collection trees only |

---

## Collection design rules

1. **Meaningful normalization** — enough structure for relationships, history, and reporting; do not replicate entire external systems (e.g. full Odoo GL).
2. **Nested when owned** — checklist items, report lines inside a period, SPD template phases: use arrays/blocks on the parent.
3. **Separate collection when independent** — records that need own permissions, querying, reuse, or history (Employee, Maintenance Job, Change Request).
4. **Module ownership** — integrated model, but each collection has a clear module owner for docs and Linear.
5. **Slug convention** — plural kebab-case (`employees`, `finance-report-lines`); glossary uses singular business terms ([CONTEXT.md](../../CONTEXT.md)).

---

## Shared foundations (Phase 0 scope)

See [foundations.md](../modules/foundations.md) for collection cards.

| Slug (proposed) | Business term |
|-----------------|---------------|
| `groups` | Group |
| `companies` | Company |
| `sites` | Site |
| `departments` | Department |
| `teams` | Team |
| `employees` | Employee |
| `users` | User (Payload auth — extend) |
| `customers` | Customer |
| `contacts` | Contact |
| `products` | Product |
| `machines` | Machine |
| `moulds` | Mould |
| `tags` | Tag |
| `activity-events` | Activity Event *(deferred phase — Phase 1.5+)* |
| `media` | Media (existing) |
| `documents` | Document |

---

## History pattern

| Pattern | Use for |
|---------|---------|
| Current-state document | Employee, Machine, Product, Company |
| Snapshot record | Planning snapshot, finance period snapshot, SPD project process snapshot |
| Event record | Gate sign-off, stoppage, maintenance trigger, activity event |
| Status + transition | Maintenance job status, HR review status, import job status (plugin) |

**Payload versions/drafts:** Use for templates and publishable content; not as the sole workflow engine for factory/SPD/HR operations.

---

## Nested Docs plugin *(deferred phase — not installed in Phase 1a)*

Use [@payloadcms/plugin-nested-docs](https://payloadcms.com/docs/plugins/nested-docs) when:

- Documents in the **same collection** form a parent/child tree
- Breadcrumbs and cascade updates are valuable

**Candidates (evaluate when plugin ships):**

- `document-categories` (if taxonomy tree needed)
- `product-categories` (if hierarchical product taxonomy needed)

**Resolved — do not use Nested Docs for Finance sections:** report sections are **`sections[]` blocks on `finance-reporting-periods`** — see [ADR 0001](../adr/0001-finance-sections-on-period.md).

**Do not use** for Employee→Manager, Machine→Mould, Project→Gate — use **relationships** or **embedded blocks**.

---

## Globals (module settings)

| Global slug (proposed) | Module |
|------------------------|--------|
| `manufacturing-settings` | OEE thresholds, snapshot times, reject % default |
| `maintenance-settings` | Shot service threshold, default escalation chain |
| `finance-settings` | Default period cadence, report recipients (labels) |
| `hr-settings` | Review cadence, rating band labels |
| `spd-settings` | Default process template pointer |
| `sales-settings` | Hunt/Care target defaults |
| `ecosystem-settings` | Cross-cutting flags (optional) |

Globals store **pointers and defaults**, not full template bodies (templates are collections).

---

## Upload collections

| Slug | Content |
|------|---------|
| `media` | Images, photos, logos |
| `documents` | PDF, DOCX, XLSX, PPTX, POs, contracts, intake exports |

Shared metadata fields (conceptual): `module`, `sourceRecord` (polymorphic or relationship), `tags`, `confidentiality`, `versionLabel`, `externalFilingStatus`.

---

## Plugins (planned)

| Plugin | Purpose |
|--------|---------|
| `@payloadcms/plugin-import-export` | Bulk CSV/JSON import/export on selected collections |
| `@payloadcms/plugin-nested-docs` | True hierarchies |
| `@payloadcms/plugin-mcp` | Future AI agent access (Phase 3) |

Import/export requires Jobs Queue `autoRun` or external cron on Vercel — see [integrations.md](./integrations.md).

---

## Indexing (guidance)

At implementation, index:

- `employeeId` (unique where applicable)
- Foreign keys: `company`, `site`, `machine`, `employee`, `period`
- Status fields used in admin default columns
- Dates used for reporting filters (`periodStart`, `submittedAt`)

MongoDB replica set required for transactions if hooks use multi-document atomicity.

---

## Custom admin

Workflow-heavy areas (later):

- Manufacturing round submission
- SPD gate approval queue
- HR review queue
- Employee → Contracts tab

Not required for documentation pass; flag in module specs.
