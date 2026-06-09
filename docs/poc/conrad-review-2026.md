# Conrad POC Review — June 2026

**Decision:** Option A (grill session 2026-06-09) — schedule review **now** on the synthetic SPD template. Do not wait for `SPD_ProcessFlow.docx`. Conrad's feedback informs docx reconciliation (BUI-288).

**Linear:** [BUI-289](https://linear.app/bui-workspace/issue/BUI-289) (SPD-011) · [BUI-288](https://linear.app/bui-workspace/issue/BUI-288) (SPD-002)  
**Phase criteria:** [PHASE-1-MVP.md](../PHASE-1-MVP.md) §1a success criteria  
**Manual QA:** [phase-1a-manual-qa.md](../qa/phase-1a-manual-qa.md) Part 5

---

## Stakeholders

| Role | Name | Contact |
|------|------|---------|
| Internal lead (client) | Conrad Eksteen — Head of Design & Development | conrad@pimms.co.za |
| Build / demo | Branden-Roy / Dan | Book via client |

---

## Environment URLs

| Environment | URL | Notes |
|-------------|-----|-------|
| **Production (demo)** | https://stanton-dansivewrights-projects.vercel.app/admin | Primary for Conrad demo |
| **Production (alias)** | https://stanton-sigma.vercel.app/admin | Same deployment |
| **Local dev** | http://localhost:8080/admin | For pre-flight QA only |

> **Vercel Deployment Protection:** Production may return **401** until the visitor authenticates with a Vercel team account. Before the meeting: either add Conrad (or a shared demo account) to the Vercel project team, temporarily relax protection for the review window, or screen-share from an authenticated session. Document the chosen approach in meeting notes.

---

## Agenda (~60 minutes)

| Time | Topic | Owner |
|------|-------|-------|
| 0–5 min | Context: Phase 1a POC goal, synthetic template stand-in, feedback → template + docx reconciliation | Facilitator |
| 5–15 min | **Process template** — 6 phases × 18 stages × 5 gates, checklist items, deliverables, gate RASCI | Conrad |
| 15–30 min | **Live project walk** — demo project, process snapshot, gate sign-off → phase advance | Facilitator + Conrad |
| 30–40 min | **Change requests & tooling** — in-scope redo vs out-of-scope costed; tooling asset link | Conrad |
| 40–50 min | **Accuracy review** — what's wrong, missing, or out of order (~25% correction target) | Conrad |
| 50–55 min | **Deferred phase** — custom dashboards, client forms, AI validation not in this POC | Facilitator |
| 55–60 min | Next steps: template updates, docx handoff, Phase 1b module choice (Finance vs Manufacturing) | All |

---

## What to demo (admin paths)

Pre-flight: complete [phase-1a-manual-qa.md](../qa/phase-1a-manual-qa.md) steps 0.1–0.5 and Part 4 on production.

### 1. Process template (synthetic stand-in)

| Admin path | Record | What to show |
|------------|--------|--------------|
| **SPD Process Templates** | `Stanton Product Development (Synthetic v1)` | Version `1.0-synthetic`, published; expand phases → stages → gates |
| **SPD Settings** (global) | Default template | Points at synthetic template |

**Talking point:** Structure is derived from the intake brief, not Conrad's docx. Goal is ~75% accuracy so Conrad can correct the remainder.

### 2. Demo project

| Admin path | Record | What to show |
|------------|--------|--------------|
| **SPD Projects** | `SPD Demo — Sample Opportunity` | Company PIMMS; customer linked; `currentPhase` = `phase-1` |
| Same record → **Process Snapshot** | Embedded copy | Matches template at create time; `templateVersion` = `1.0-synthetic` |
| **Tooling Assets** | `Demo Tool — Sample Opportunity` | Linked to demo project |

**Live action (if not pre-seeded):** Create a **SPD Gate Sign-Off** for the demo project — `gateId` from snapshot, approver EMP-001, decision **approved** — then re-open project to show `currentPhase` advanced.

### 3. Change requests (optional depth)

| Admin path | What to show |
|------------|--------------|
| **SPD Change Requests** | One in-scope redo + one out-of-scope costed CR linked to demo project/tooling |

### 4. Snapshot immutability (quick proof)

1. Edit template version label (e.g. add `-mutated` in admin).
2. Re-open demo project → snapshot **unchanged**.

---

## Success criteria

Aligned with intake POC plan and **POC Gate** glossary term ([CONTEXT.md](../../CONTEXT.md)):

| Criterion | Target | Pass? |
|-----------|--------|-------|
| Phase/stage/gate **structure** matches Conrad's mental model | ~75% accurate on first pass | ☐ |
| Gate sign-off workflow understandable (approver, role, decision, phase unlock) | Conrad can explain it back | ☐ |
| Change request classifications make sense | In-scope vs out-of-scope distinction accepted | ☐ |
| Willingness to iterate on template | Agrees corrections can be applied without re-scoping POC | ☐ |
| Phase 1b direction | Finance **or** Manufacturing preference captured (non-binding) | ☐ |

**Not required for POC pass:** custom dashboards, client-facing forms, AI document validation, full RASCI population, 100% docx parity.

---

## Feedback capture template

Copy into BUI-289 Linear comment or attach as meeting notes.

### Process structure

| Area | Accurate? | Correction / note |
|------|-----------|-------------------|
| Phase names & order (1–6) | ☐ Yes ☐ Partial ☐ No | |
| Stages per phase (3 each) | ☐ Yes ☐ Partial ☐ No | |
| Gate placement (end of phases 1–5) | ☐ Yes ☐ Partial ☐ No | |
| Gate names / descriptions | ☐ Yes ☐ Partial ☐ No | |
| Checklist items per stage | ☐ Yes ☐ Partial ☐ No | |
| Deliverables per stage | ☐ Yes ☐ Partial ☐ No | |
| RASCI / required roles on gates | ☐ Yes ☐ Partial ☐ No | |

### Workflow & data model

| Area | Feedback |
|------|----------|
| Gate sign-off fields (approver, role, evidence) | |
| Phase advance behaviour | |
| Change request — in-scope redo | |
| Change request — out-of-scope costed | |
| Tooling asset linkage | |

### Deferred / Phase 1b

| Question | Answer |
|----------|--------|
| Priority module after SPD POC: Finance or Manufacturing? | |
| Custom admin views — must-haves vs nice-to-haves | |
| Client forms — when needed | |

### Action items

| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Apply template corrections from feedback | | |
| 2 | Request / receive `SPD_ProcessFlow.docx` for reconciliation (BUI-288) | Conrad | |
| 3 | Vercel access for Conrad (if ongoing self-serve demo) | | |
| 4 | | | |

---

## Post-meeting checklist

- [ ] Feedback logged on [BUI-289](https://linear.app/bui-workspace/issue/BUI-289)
- [ ] Template correction tasks filed (may overlap BUI-288 reconciliation)
- [ ] [PHASE-1-MVP.md](../PHASE-1-MVP.md) Conrad criterion checked off when review held
- [ ] Phase 1b preference noted for planning (July–September target)

---

## Related artifacts

| File | Role |
|------|------|
| [spd.md](../modules/spd.md) | Module spec + synthetic template notes |
| [SPD Project Brief](../intake/SPD%20Project%20Management%20App%20%E2%80%94%20Project%20Brief.md) | Intake POC plan |
| [pragmatist-grill-2026-06-09.md](../reviews/pragmatist-grill-2026-06-09.md) | Sequencing rationale |
