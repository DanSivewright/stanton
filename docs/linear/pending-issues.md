# Pending Linear issues

**Status:** All issues created (2026-06-09) — BUI-274–325 (+ prior BUI-224–273). Workspace quota **not** hit at 103 issues.

Parent epic IDs (BM Team / Stanton project):

| Epic | ID |
|------|-----|
| E0 Documentation | BUI-224 |
| E1 Platform | BUI-225 |
| E2 Foundations | BUI-226 |
| E3 SPD | BUI-227 |

---

## Phase 1a — CREATE FIRST

### PLAT-002 — Vercel project + env secrets
- **parent:** BUI-225 | **labels:** data, phase-1a, plugin | **priority:** 1 | **milestone:** Phase 1a
- **blockedBy:** PLAT-001
- **Objective:** Vercel project linked to GitHub repo; `DATABASE_URL`, `PAYLOAD_SECRET` in env.
- **Acceptance:** Preview deploy boots Payload admin.

### PLAT-003 — Import-export plugin + Vercel cron
- **parent:** BUI-225 | **labels:** data, phase-1a, plugin | **priority:** 1
- **blockedBy:** PLAT-001, PLAT-002
- **Spec:** [data-management.md](../modules/data-management.md) — Jobs Queue, `/api/payload-jobs/run` cron
- **Files:** `src/payload.config.ts`, `vercel.json`

### PLAT-005 — Documents upload collection
- **parent:** BUI-225 | **labels:** foundations, phase-1a, collection | **priority:** 1
- **Spec:** [foundations.md](../modules/foundations.md) — `documents` with module/confidentiality metadata
- **Files:** `src/collections/Documents.ts`

### PLAT-006 — Extend users (roles, employee link, companyScope)
- **parent:** BUI-225 | **labels:** foundations, phase-1a, collection | **priority:** 1
- **Spec:** roles Admin/Staff; optional `employee` relationship; optional `companyScope` array
- **Files:** `src/collections/Users.ts`

### FND-001 — Companies collection
- **parent:** BUI-226 | **labels:** foundations, phase-1a, collection | **priority:** 2
- **blockedBy:** PLAT-001
- **Fields:** name, code, active; seed one PIMMS company for POC

### FND-003 — Employees + import template
- **parent:** BUI-226 | **labels:** foundations, phase-1a, collection | **priority:** 2
- **blockedBy:** FND-001
- **Fields:** employeeId (unique), name, jobTitle, → company, link to users for approvers
- **Import:** CSV template in `docs/` or `scripts/seed/`

### FND-004 — Customers and contacts
- **parent:** BUI-226 | **labels:** foundations, phase-1a, collection | **priority:** 2
- **blockedBy:** FND-001

### SPD-001 — spd-process-templates
- **parent:** BUI-227 | **labels:** spd, phase-1a, collection | **priority:** 1
- **blockedBy:** PLAT-001
- **Spec:** [spd.md](../modules/spd.md) — blocks: phases → stages → gates, version, draft/published

### SPD-003 — spd-projects + process snapshot on create
- **parent:** BUI-227 | **labels:** spd, phase-1a, collection | **priority:** 1
- **blockedBy:** SPD-001, FND-004
- **Hook:** deep-copy template to `processSnapshot` on create; never mutate on template update

### SPD-004 — spd-gate-sign-offs + phase unlock hooks
- **parent:** BUI-227 | **labels:** spd, phase-1a, collection, hook | **priority:** 1
- **Spec:** append-only sign-offs; unlock next phase on approve

### SPD-005 — spd-change-requests
- **parent:** BUI-227 | **labels:** spd, phase-1a, collection | **priority:** 2
- **Fields:** in-scope vs out-of-scope classification, approval status

### SPD-006 — tooling-assets
- **parent:** BUI-227 | **labels:** spd, phase-1a, collection | **priority:** 2

### SPD-007 — spd-settings global
- **parent:** BUI-227 | **labels:** spd, phase-1a, global | **priority:** 2

### SPD-002 — Import SPD_ProcessFlow.docx → template
- **parent:** BUI-227 | **labels:** spd, phase-1a, blocked-client | **priority:** 1
- **Depends:** SPD-001, client docx file

### SPD-011 — Conrad POC review (milestone gate)
- **parent:** BUI-227 | **labels:** spd, phase-1a, milestone, blocked-client | **priority:** 1
- **Acceptance:** ~75% process accuracy; demo project passed one gate

### PLAT-001 — MongoDB Atlas replica set
- **parent:** BUI-225 | **priority:** 1 | **state:** Todo
- Full description drafted in agent session — see Implementation Playbook

### DOC-001 through DOC-008
- **parent:** BUI-224 | **labels:** docs, phase-0 | **state:** Done (work complete in repo)
- Mark Done when created for audit trail

---

## Phase 2–3 — CREATE AFTER 1a

Listed in scope-map.md; bodies follow same template. Epic parents: BUI-227 (SPD-008–010), BUI-231 (FIN-INT-006–007), BUI-232 (SAL), BUI-233 (HR), BUI-234 (LLM), BUI-235 (WEB).
