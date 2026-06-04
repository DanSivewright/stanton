# Intake Archive

Immutable source documents for the Stanton / PIMMS Payload ecosystem. These files are **evidence**, not the canonical product specification.

**Canonical specs live in:**

- [MASTER-SPEC](../MASTER-SPEC.md)
- [Module specs](../modules/)
- [Architecture](../architecture/)
- [CONTEXT.md](../../CONTEXT.md) (glossary only)

---

## Index

| File | Type | Status | Notes |
|------|------|--------|-------|
| [Internal LLM — Project Brief.md](./Internal%20LLM%20%E2%80%94%20Project%20Brief.md) | Client brief | Scoping | RAG/LLM over ecosystem data |
| [Machine Maintenance Tracker — Project Brief.md](./Machine%20Maintenance%20Tracker%20%E2%80%94%20Project%20Brief.md) | Client brief | New | Replaces "Fix" app |
| [Manufacturing Automation — Project Brief.md](./Manufacturing%20Automation%20%E2%80%94%20Project%20Brief.md) | Client brief | Active | Live MVP referenced |
| [Manufacturing Automation — Developer Brief 2026-05-15.md](./Manufacturing%20Automation%20%E2%80%94%20Developer%20Brief%202026-05-15.md) | Developer brief | Historical | Excel → dashboard MVP |
| [Odoo Financial Reporting — Project Brief.md](./Odoo%20Financial%20Reporting%20%E2%80%94%20Project%20Brief.md) | Client brief | Active | **Redacted** API credentials |
| [odoo-integration-handoff-excerpt.md](./odoo-integration-handoff-excerpt.md) | Handoff excerpt | Historical context | Not canonical architecture |
| [PIMMS HR Platform — Project Brief.md](./PIMMS%20HR%20Platform%20%E2%80%94%20Project%20Brief.md) | Client brief | Deferred | Performance/org hub |
| [Sales Performance Dashboard — Project Brief.md](./Sales%20Performance%20Dashboard%20%E2%80%94%20Project%20Brief.md) | Client brief | Written | Pipedrive + Odoo |
| [SPD Project Management App — Project Brief.md](./SPD%20Project%20Management%20%E2%80%94%20Project%20Brief.md) | Client brief | POC due Jun 2026 | Says "standalone" — superseded by ecosystem decision |
| [stanton-global-hr-platform-handoff.md](./stanton-global-hr-platform-handoff.md) | Handoff | Historical context | Prior HR PoC; not canonical |

---

## Redaction policy

Committed intake may include client/project names and operational context. **Redact** before commit:

- API keys, passwords, tokens
- Database names and private URLs where they create security risk
- Personal phone numbers and unnecessary PII

Mark redactions in this README or inline in the source file.

---

## Conflicts with current direction

Some intake documents conflict with decisions made during ecosystem scoping. The master spec and module specs take precedence. Notable examples:

| Intake says | Ecosystem decision |
|-------------|-------------------|
| SPD is completely standalone | SPD is a bounded module in one Payload app; shared foundations; phased cross-module workflows |
| HR brief lists non-Payload stack | This repo is Payload + MongoDB; HR is performance/org hub only |
| Finance brief focuses on PPT delivery | Payload owns normalized finance data; report rendering is downstream |
| Odoo handoff targets raw Mongo sync jobs | Model-first in Payload; Odoo sync is a later integration feature set |

Do not edit intake files to match new decisions — preserve originals (with redactions) and document overrides in specs.
