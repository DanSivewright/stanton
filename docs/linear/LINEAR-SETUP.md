# Linear setup — Stanton / PIMMS Payload Ecosystem

**Project:** [Stanton / PIMMS Payload Ecosystem](https://linear.app/bui-workspace/project/stanton-pimms-payload-ecosystem-d04036adc64f)  
**Team:** BM Team (`BUI`)  
**Status:** **Complete** — all scope-map issues created 2026-06-09 (BUI-224–325, 103 issues in project)

---

## What was created

### Program structure

| Artifact | Details |
|----------|---------|
| **Project** | Urgent priority, target Jun 2026, agent workflow in description |
| **Milestones** | Phase 1a SPD POC · Phase 1b Ops module · Phase 1.5 Hardening · Phase 2 Business modules |
| **Label groups** | `stanton-module` · `stanton-phase` · `stanton-work-type` · `stanton-blocked` |
| **Epics** | E0–E11 (BUI-224–235) — parent issues with `epic` label |
| **Project documents** | Implementation Playbook · Phase 1 MVP · Issue templates · Architecture & forks |

### Issue template (every child issue)

```markdown
## Context
* **Epic:** BUI-XXX
* **Phase:** phase-1a|1b|1.5|2|3
* **Depends:** …
* **Spec:** GitHub link

## Objective
…

## Spec
…

## Files
…

## Acceptance
- [ ] …

## Verify
…

## Out of scope
…
```

### Shared context (Linear Documents)

Linear **Documents** attached to the project act as shared context for all issues — equivalent to a Confluence space or wiki. Agents and engineers should read **Implementation Playbook** first, then **Phase 1 MVP**.

Canonical specs remain in GitHub `docs/`; Linear documents mirror and link to them.

---

## Created issues (50)

| Range | Content |
|-------|---------|
| BUI-224–235 | 12 epics (E0–E11) |
| BUI-236–273 | 38 child issues (deferred + phase 1b/1.5/2 backlog) |

**Created 2026-06-09 (BUI-274–325):**

- **Phase 1a:** PLAT-001–003, 005–006, FND-001/003/004, SPD-001–007, SPD-011 (BUI-274–289)
- **DOC audit trail:** DOC-001–008 marked Done (BUI-290–297)
- **Phase 2–3 backlog:** FIN-INT-006/007, SPD-008–010, SAL-001–007, HR-000–007, LLM-001–005, WEB-001–003 (BUI-298–325)

**Start implementation:** PLAT-001 (BUI-274, Todo) → PLAT-006 → FND-* → SPD-* per [PHASE-1-MVP.md](../PHASE-1-MVP.md).

---

## Label reference

| Group | Values |
|-------|--------|
| **stanton-module** | foundations, manufacturing, maintenance, finance, spd, sales, llm, data, docs (+ existing `hr`) |
| **stanton-phase** | phase-0, phase-1a, phase-1b, phase-1.5, phase-2, phase-3 |
| **stanton-work-type** | collection, global, hook, admin-ui, integration, plugin, milestone |
| **stanton-blocked** | blocked-client, blocked-access |
| **type** (existing) | epic |

Note: Linear label groups are **exclusive** — one label per group per issue.

---

## Workflow rules

1. Spec change → update `docs/modules/*.md` first, then Linear issue comment
2. Issue done → comment with changed file paths + link PR
3. Scope map ID (e.g. `PLAT-001`) stays in issue **title** for grep/traceability
4. Phase 1a active work: filter `phase-1a` + milestone **Phase 1a — SPD POC**

---

## Sync with markdown

| Markdown | Linear |
|----------|--------|
| [scope-map.md](./scope-map.md) | Issue titles + phases |
| [PHASE-1-MVP.md](../PHASE-1-MVP.md) | Project doc + milestone 1a |
| [MASTER-SPEC.md](../MASTER-SPEC.md) | Project description |
