# Internal LLM — Project Brief

**Client:** Stanton Group / PIMMS
**Owner:** Branden-Roy Unsworth (Mase Capital)
**Build Team:** Branden-Roy + Dan & Jordy (Buildmore London)
**Status:** 🟡 SCOPING
**Last Updated:** 2026-06-02

---

## What It Is
An internal large language model (LLM) built on top of the PIMMS/Stanton ecosystem knowledge base. Runs inside the ecosystem — meaning it has access to all internal data, processes, documents, and system outputs across the full platform. Staff can ask questions in plain language and get accurate, context-aware answers drawn from their own data.

**Why we're building it:** The ecosystem generates enormous amounts of structured data (Manufacturing runs, SPD project docs, Odoo financials, HR records, maintenance logs). An internal LLM turns that data into an accessible, queryable intelligence layer — no training required, no searching through folders.

---

## Scope

### In Scope
| Feature | Detail |
|---------|--------|
| Knowledge base integration | Indexes all ecosystem data: Manufacturing, Odoo, HR, SPD, Maintenance |
| Natural language querying | Staff ask plain English questions, get answers from live data |
| Document generation | Pull from data hub to draft reports, summaries, SPD documents |
| Role-aware access | Each user only queries data within their permission scope |
| Internal-only | No external access — runs inside PIMMS infrastructure |

### Out of Scope (to be confirmed)
| Item | Reason |
|------|--------|
| Public-facing chatbot | Internal tool only |
| Training a custom base model | Use an existing LLM (Claude, OpenAI, etc.) + RAG over internal data |
| Replacing existing workflows | Augments, does not replace, existing platform tools |

---

## Architecture (Preliminary)

| Layer | Detail |
|-------|--------|
| Base LLM | Claude API (claude-sonnet-4-6 or claude-opus-4-8) — subject to confirmation |
| Data access | RAG (Retrieval-Augmented Generation) over indexed ecosystem data |
| Knowledge base | All PIMMS platform data: Manufacturing, Odoo, HR, SPD docs, Maintenance logs |
| Hosting | Internal — runs inside PIMMS infrastructure |
| Interface | Embedded in PIMMS dashboard (TBD: standalone widget or integrated panel) |

---

## Integration Points

| System | Data Available to LLM |
|--------|----------------------|
| Manufacturing Automation | Production runs, machine state, cycle counts, setter sign-offs, quality checklists |
| Odoo Financial Reporting | P&L, balance sheet, financial reports by entity |
| PIMMS HR Platform | Employee records, scores, attendance, payroll data |
| SPD Project Management | Phase/gate status, deliverables, project timelines, change requests |
| Machine Maintenance Tracker | Service history, shot counts, POs per machine |

---

## Use Cases (Initial)
- "Show me all machines that are within 2,000 shots of a service trigger"
- "Summarise last week's production output by mould"
- "Generate a Gate 1 review pack for project X"
- "Which employees have not completed their comprehension test for SOP #12?"
- "What is the current cash position for PIMMS Group?"

---

## Open Items
- [ ] Confirm base LLM (Claude API vs OpenAI vs self-hosted)
- [ ] Confirm hosting environment (PIMMS infrastructure — cloud or on-prem?)
- [ ] Confirm scope: which systems are in scope for v1 knowledge base?
- [ ] Confirm user roles + access control (who can query what?)
- [ ] Confirm interface: standalone tool or embedded in existing PIMMS dashboard?
- [ ] Agree pricing model (once-off build + monthly hosting/maintenance?)
- [ ] Identify internal champion (Trevor? Conrad?)
- [ ] Define MVP — what does the first working demo look like?

---

## Key Docs
- Master Ecosystem Plan: `Consulting/Stanton Group/docs/PIMMS Ecosystem — Master Project Plan 2026-06-01.md`
- Stanton Group Umbrella: `memory/project_stanton_group.md`
