# Integrations — Architecture

External systems **feed or receive** data; they do **not** define the Payload schema. Humans or automated jobs normalize into Payload collections.

---

## Priority rule

| Phase | What |
|-------|------|
| **Now (scope)** | Payload collections, manual entry, import/export plugin |
| **Later** | Automated sync, webhooks, SharePoint filing, MCP agents |

---

## Integration matrix

| System | Role | Payload module | v1 scope | Later |
|--------|------|----------------|----------|-------|
| **Odoo** | Accounting / finance source | Finance | Manual import + normalized collections | Sync jobs, reconcile, monitoring ([handoff excerpt](../intake/odoo-integration-handoff-excerpt.md)) |
| **Pipedrive** | Targets, pipeline, activities | Sales | Manual/import | API sync |
| **SharePoint** | Document filing destination | HR, SPD, Finance | Metadata + links in Payload | Auto-filing jobs |
| **Excel / planning sheets** | Manufacturing planning intake | Manufacturing | Import → normalized MOs | Scheduled import job |
| **SimplePay** (optional) | Hours worked | HR | Out of v1 | Phase 2 nice-to-have per HR brief |
| **Claude / OpenAI** | LLM provider | LLM | Out of scope | Phase 3 |
| **Payload MCP** | Agent API | LLM | Out of scope | Phase 3 — [@payloadcms/plugin-mcp](https://payloadcms.com/docs/plugins/mcp) |

---

## Odoo (finance)

**Principles from prior PoC (historical):**

- Server-side only — never browser → Odoo
- `search_read` / JSON-RPC pattern
- Persist to MongoDB (here: **Payload collections**)
- Incremental sync + full reconcile when automated
- Secrets in env; rotation documented
- Monitor sync lag and errors

**This repo v1:** Model [finance collections](../modules/finance.md); enter data via admin or import/export. Automated sync is a **separate Linear epic** after model validation.

Optional future: raw `odoo-sync-snapshots` collection for audit — aligned with earlier "snapshots + normalized" decision; implement when sync starts.

---

## Import / Export plugin

[@payloadcms/plugin-import-export](https://payloadcms.com/docs/plugins/import-export)

| Capability | Notes |
|------------|-------|
| CSV / JSON export | Admin UI + download |
| Import with preview | Selected collections only |
| Jobs queue | Large imports/exports — configure `jobs.autoRun` or Vercel cron endpoints |
| Hidden `imports` / `exports` collections | Can surface under Data Management group |

**Governance:** Deferred — do not enable on all collections by default. Privileged import roles TBD with access control pass.

**Manufacturing:** Primary candidate for planning sheet bulk import.

---

## MCP (future)

When Phase 3 starts:

1. Install `@payloadcms/plugin-mcp`
2. Enable `find` (and optionally `create`/`update`) per collection with least privilege
3. Agent authenticates as Payload User — same access rules as admin
4. Document which collections are exposed in [llm-mcp.md](../modules/llm-mcp.md)

---

## SharePoint / email

Not modeled as integrations collections. Implement as **Jobs Queue tasks** triggered from hooks (e.g. contract approved → queue filing job). Store filing status on `documents` records.

---

## No UI-to-external rule

All external API calls run server-side (hooks, jobs, custom endpoints). Admin UI reads/writes Payload only.
