# Phase 1a — Manual QA Checklist

**Target:** Production admin at `/admin`  
**Production URL:** https://stanton-dansivewrights-projects.vercel.app  
**Also works:** https://stanton-sigma.vercel.app  
**Phase criteria:** [PHASE-1-MVP.md](../PHASE-1-MVP.md) §1a success criteria

Use this checklist after a successful Vercel deploy. Tick each item as you go. For automated API coverage, run `pnpm tsx scripts/verify/spd-wave3.ts` locally (requires `DATABASE_URL` in `.env`).

---

## Before you start

| Step | Action | Pass? |
|------|--------|-------|
| 0.1 | Open production URL. If Vercel Deployment Protection is on, authenticate with your Vercel team account (401 without login is expected). | ☐ |
| 0.2 | Navigate to `/admin` and log in with your Payload user. | ☐ |
| 0.3 | Confirm your user has **Admin** role: **Users** → your record → `roles` includes `admin`. If missing, add it (or ask another admin). | ☐ |
| 0.4 | Confirm seed data exists: **Companies** → `PIMMS Group JHB` (code `PIMMS`); **Employees** → `EMP-001`..`EMP-003`. | ☐ |

---

## Part 1 — Auth & platform

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 1.1 | Log out and log back in | Session works; no 5xx | ☐ |
| 1.2 | Open **Users** collection | List loads; can view a user record | ☐ |
| 1.3 | Create a test **Staff** user (optional) | Save succeeds; roles = `staff` | ☐ |
| 1.4 | Open **Payload Jobs** (`payload-jobs`) if visible | Admin loads (may be empty) | ☐ |

---

## Part 2 — Foundations slice

### Companies & employees

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 2.1 | **Companies** → open PIMMS | Name, code, active flag present | ☐ |
| 2.2 | **Employees** → open EMP-001 | Linked to PIMMS company; job title shown | ☐ |
| 2.3 | Create employee `EMP-TEST` | Saves with company relationship | ☐ |

### Customers & contacts

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 2.4 | **Customers** → create "QA Test Customer" | Linked to PIMMS; code unique | ☐ |
| 2.5 | **Contacts** → create contact for that customer | Relationship to customer works | ☐ |

### Documents & media

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 2.6 | **Documents** → upload a small PDF or image | File uploads; metadata editable | ☐ |
| 2.7 | **Media** → upload an image | Thumbnail/preview in admin | ☐ |

---

## Part 3 — Import / export (Hobby plan caveat)

> **Vercel Hobby:** `vercel.json` crons are disabled. Jobs **queue** in admin but **do not auto-process** on production until you upgrade to Pro and restore `vercel.cron.example.json` → `vercel.json`. For full import/export job completion tests, run locally with `ENABLE_PAYLOAD_AUTORUN=true` in `.env`.

### On production (smoke only)

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 3.1 | **Employees** → Export | Export UI opens; can start an export job | ☐ |
| 3.2 | Check **Payload Jobs** after export | Job appears (status may stay queued on Hobby) | ☐ |

### Local only (job completion)

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 3.3 | Set `ENABLE_PAYLOAD_AUTORUN=true`, run `pnpm dev` | Dev server starts | ☐ |
| 3.4 | Export **employees** to CSV | Job completes; file downloadable | ☐ |
| 3.5 | Import employees CSV (edit one row) | Import job completes; row updated | ☐ |

---

## Part 4 — SPD core (E2E)

Reference: [spd.md](../modules/spd.md). Mirrors `scripts/verify/spd-wave3.ts`.

### Process template & settings

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 4.1 | **SPD Process Templates** → create template "QA Template v1" | Add ≥2 phases; phase 1 has a stage with a **gate** (`gateId`, name) | ☐ |
| 4.2 | Publish template (`_status` = published) | Version saved | ☐ |
| 4.3 | **SPD Settings** (global) → set **Default Template** to your template | Saves | ☐ |

### Project + snapshot immutability

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 4.4 | **SPD Projects** → create "QA Demo Project" | Company = PIMMS; customer = test customer; `currentPhase` = first phase | ☐ |
| 4.5 | Open project → inspect **Process Snapshot** | Embedded copy of template phases/stages/gates; `templateVersion` matches template | ☐ |
| 4.6 | Edit template (change version to "v2-mutated") | Template updates | ☐ |
| 4.7 | Re-open project | Snapshot **unchanged** (still v1 structure) | ☐ |

### Tooling asset & change requests

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 4.8 | **Tooling Assets** → create "QA Tool v1" | Link to QA project; status active | ☐ |
| 4.9 | **SPD Change Requests** → in-scope redo CR | Classification `in-scope-redo`; linked to project + tooling asset | ☐ |
| 4.10 | Create out-of-scope costed CR | Classification `out-of-scope-costed`; cost fields + client sign-off status visible | ☐ |

### Gate sign-off → phase advance

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 4.11 | **SPD Gate Sign-Offs** → create sign-off for QA project | `gateId` matches gate in snapshot; approver = EMP-001; role = e.g. `pdm`; decision = **approved** | ☐ |
| 4.12 | Re-open QA project | `currentPhase` advanced to next phase | ☐ |
| 4.13 | Try to **edit** the sign-off record | Update blocked (append-only) | ☐ |

---

## Part 5 — Blocked / client-dependent (do not fail QA)

These are **out of scope** for implementation QA until client delivers inputs:

| Item | Linear | Blocker |
|------|--------|---------|
| Import `SPD_ProcessFlow.docx` → published template (~75% match) | BUI-288 (SPD-002) | Client docx |
| Conrad POC review | BUI-289 (SPD-011) | Schedule review meeting |

---

## Sign-off

| Field | Value |
|-------|-------|
| Tester | |
| Date | |
| Environment | Production / Local |
| Deploy commit | `fa98314` or later |
| Overall result | Pass / Fail |
| Notes | |

---

## Quick troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| 401 on production URL | Vercel Deployment Protection | Log in via Vercel SSO or disable protection for the project |
| Import/export job stuck "queued" | Hobby plan — no cron | Test locally with `ENABLE_PAYLOAD_AUTORUN=true`, or upgrade to Pro |
| No seed company/employees | First boot seed skipped | Restart app / check Atlas connection; seed runs in `payload.config.ts` on init |
| Gate sign-off doesn't advance phase | Wrong `gateId` or decision not `approved` | Match `gateId` from project snapshot; use `approved` decision |
| Cannot edit sign-off | By design (append-only) | Create a new sign-off if correction needed |
