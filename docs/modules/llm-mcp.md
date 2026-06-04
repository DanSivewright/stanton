# Module: Internal LLM / MCP (Future)

Internal intelligence layer over normalized Payload data — **not** a separate data architecture.

**Delivery phase:** 3  
**Status (intake):** Scoping

---

## Purpose

Enable staff to query ecosystem data in plain language with answers grounded in Payload records. Future implementation via LLM provider + Payload API and/or [@payloadcms/plugin-mcp](https://payloadcms.com/docs/plugins/mcp).

---

## What to build now (documentation + data only)

1. **Complete normalized collections** in all modules so nothing critical lives only outside Payload.
2. **Consistent collection descriptions** for MCP tool exposure later.
3. **Access control** ready so agent User cannot exceed human permissions (unless explicit admin agent role).
4. **Activity events** for traceability of sensitive reads (optional enhancement).

---

## What not to build now

- Knowledge Base duplicate collections
- Embedding tables (unless Payload AI plugin adopted later)
- Chat UI in admin (unless prioritized)
- Per-record `indexable` flags — optional; add at Phase 3 if needed

---

## Future MCP configuration (checklist)

- [ ] Install `@payloadcms/plugin-mcp`
- [ ] Enable per-collection `find` (minimally); `create`/`update`/`delete` only where justified
- [ ] Configure globals read access if needed
- [ ] Authenticate agent as Payload `users` record
- [ ] Document allowed collections in runbook
- [ ] Rate limits and logging

---

## Use cases (from intake)

- Machines near service trigger
- Production output by mould
- Gate 1 pack summary for project X
- Employees missing SOP comprehension (when that data exists)
- Cash position (when finance data populated)

---

## Source evidence

- [Internal LLM — Project Brief](../intake/Internal%20LLM%20%E2%80%94%20Project%20Brief.md)
- Ecosystem scoping — same access rules as admin; MCP wording in [MASTER-SPEC](../MASTER-SPEC.md)

---

## Open questions

- Base LLM vendor (Claude vs OpenAI)
- Embedded panel vs standalone tool
- v1 knowledge modules in scope for first demo
