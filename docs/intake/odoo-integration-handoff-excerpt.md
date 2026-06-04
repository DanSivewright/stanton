# Odoo Integration — Handoff Excerpt (Historical Context)

**Status:** Historical implementation context from prior `stanton-global` work. **Not** canonical architecture for this Payload project.

**Date archived:** 2026-06-04  
**Source:** Pasted handoff during ecosystem scoping session (full file was unavailable on disk).

---

## Purpose of this document

Records how Odoo was integrated in a previous stack so future work can reuse proven patterns. The **canonical direction for this repo** is Payload-first normalized finance collections, manual/import-first data entry, and automated Odoo sync as a **later** integration phase.

---

## Principles from prior implementation (still useful)

- Create Odoo integration user + API key; document required Odoo security groups.
- Server-side Odoo access only (JSON-RPC / `search_read`); **no direct Odoo from UI**.
- Discover models/fields in staging (`fields_get`) before defining sync scope.
- Persist normalized data in MongoDB (in this repo: **Payload + MongoDB adapter** is the store).
- Incremental sync + full reconcile job; secrets only on server/worker; document key rotation.
- Internal API reads persisted store; monitor sync lag, error rate, Odoo latency.

---

## Suggested implementation checklist (deferred integration)

- [ ] Create Odoo integration user + API key; document required Odoo security groups
- [ ] Copy/adapt `odoo/client.ts`; unit-test auth + one `search_read`
- [ ] List models/fields to sync (`fields_get` in staging)
- [ ] Define Payload finance collections, indexes, upsert keys (not raw external schema)
- [ ] Implement incremental sync + full reconcile job (Jobs Queue)
- [ ] Secrets only on server/worker; rotate key procedure documented
- [ ] Admin/API reads Payload only; no direct Odoo from UI
- [ ] Monitoring: sync lag, error rate, Odoo latency

---

## PoC vs target (from handoff)

| Done in PoC | Not done |
|-------------|----------|
| End-to-end finance dashboard | Raw record export API |
| Live Odoo via JSON-RPC | Warehouse/BI |
| Server-side only | Configurable report month in product |
| Grouped accounting queries | Budget/target fields from Odoo |
| Graceful missing-data messages | MongoDB or secondary store in that PoC |

**Target for ecosystem:** Fetch from Odoo when integration is built; **persist into Payload** for other apps, agents, and MCP to consume.

---

## Related intake

- [Odoo Financial Reporting — Project Brief](./Odoo%20Financial%20Reporting%20%E2%80%94%20Project%20Brief.md)

---

*Redact instance-specific URLs, logins, and API keys before sharing externally.*
