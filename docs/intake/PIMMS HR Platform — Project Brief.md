# PIMMS HR Platform — Project Brief

**Client:** Stanton Group / PIMMS
**Owner:** Branden-Roy Unsworth (Mase Capital)
**Build Team:** Dan & Jordy (Buildmore London)
**Primary Contact (Client):** Morganna Kirkman
**Status:** 🔴 DEFERRED — Starts after Manufacturing + Finance are stable
**Last Updated:** 2026-06-01

> **Do not initiate build or raise with Trevor until he gives the green light.**

---

## The Core Idea

The HR platform is not a standalone tool. It is the **central node of the entire PIMMS ecosystem**.

Every platform we build that tracks a person — Manufacturing, Sales, CRM, or anything else — links into HR via **Employee ID**. Performance data, activity scores, output metrics, 1-on-1 ratings: all of it flows into one place. HR becomes the single source of truth for who every employee is, what they're responsible for, and how they're performing — across every company in the group.

This is infrastructure. Not a software licence.

---

## The Connected Platform Vision

```
Manufacturing Dashboard
        ↓
  Operator performance + 1-on-1 scores (via Employee ID)
        ↓
CRM / Sales / Any other tracking system
        ↓
  Activity scores, pipeline performance, customer scores (via Employee ID)
        ↓
  HR Platform (hub) → contracts, reviews, composite KPI score, SharePoint
        ↓
  Finance Reporting (future) → headcount + performance + cost per head → board analytics
```

**Today:** Manufacturing tracks operator performance by machine. Manager 1-on-1 scorecards (Accuracy + Runs, weekly) are entered in the manufacturing dashboard and sync to HR via Employee ID — forming part of the quarterly composite KPI score.

**Near term:** Quarterly KPI score = weekly 1-on-1 scores + formal quarterly KPA/KPI review. HR platform owns the final score, the history, and the development recommendations.

**Long term:** Every system that scores or tracks a person — CRM activity, Sales performance, project management contribution, Manufacturing output — feeds into HR. Finance connects people data to financial performance. The HR platform becomes the data source that makes every other report meaningful at a people level.

As each platform matures, the HR platform's value compounds.

---

## What's Already Built

Validated by Morganna's team — live at launch:

- AI-assisted performance contract generation (branded DOCX — PIMMS Group, Stanton Global, PMG)
- AI-assisted KPA/KPI scorecard generation (XLSX — matching existing PIMMS template exactly)
- Role-based generation — correct KPAs and KPIs from role title or job description
- Multi-company branding — correct logo per company, automatic
- SharePoint auto-filing — documents filed to correct folder structure on generation
- Output database — one row per employee per contract period, contract status tracked

---

## Full Platform Scope

### Organogram & Multi-Company Structure
- Full group structure: companies → departments → managers → direct reports (~300 employees)
- Organogram is the master data model — contract generation, review routing, notifications, and access control all flow from it
- New employee added → manager, review cycle, and filing path assigned automatically
- All group companies included; new entities onboarded as the group grows

### Contract Generation
- HR or manager selects any employee → AI generates role-appropriate performance contract
- Correct company logo, branding, and template applied automatically
- Contract saved to employee record and auto-filed to SharePoint
- Status tracking: draft → submitted → approved → rejected → needs changes
- Full audit log on every resubmission
- Managers generate for direct reports only; HR and Exco generate for anyone

### Scorecard Generation
- Matching PIMMS scorecard template exactly — layout, colours, formulas
- Generated alongside the contract or independently
- Saved to employee record and filed to SharePoint

### Quarterly Review Workflow
- System notifies all managers automatically at the start of each quarter
- Manager opens platform, sees team queue, completes each review in-platform
- Scoring: 1 / 2 / 3 per KPI; weighted totals and performance rating calculated automatically
- AI generates a one-paragraph performance summary + recommended development actions on submission
- Completed reviews auto-filed to SharePoint
- HR sees real-time completion status — who has submitted, who has not
- Morganna can trigger a manual notification at any time

### Employee Status Dashboard
- Full group employee list — filtered by company, department, or manager
- Per employee: contract status, scorecard status, review due date
- HR sees everyone; managers see direct reports only; executives see cross-company
- Real-time — no manual updates required

### Manager 1-on-1 Scorecard System
- Weekly structured 1-on-1s between managers and employees
- Scores per Employee ID: **Accuracy** and **Runs**
- Weekly scores roll up to monthly summaries
- Monthly summaries feed into the quarterly composite KPI score alongside the formal quarterly review

### Role-Based Access
| Role | Access |
|------|--------|
| HR (Morganna) | Full — all employees, all companies; manages organogram, periods, approvals |
| Executive | Read-only cross-company; cross-company analytics and drill-down |
| Manager | Direct reports only — contracts, reviews, 1-on-1 scorecards |
| Employee | Own contract + scorecard — read-only once submitted |

### Team & Executive Analytics
- Completion rates by manager, department, company
- Score distributions and performance rating breakdowns
- Manager performance trends over time
- Weekly 1-on-1 data surfaced at team level
- Cross-company view: headcount, contract status, review completion, performance distribution

---

## Phase Structure

### Phase 1 (Priority — build first)
- Organogram setup (~300 employees, companies, departments, managers, reports)
- AI-assisted contract + scorecard generation
- Employee status dashboard
- Quarterly notification + review workflow
- Review scoring in platform (weighted totals, performance rating)
- AI-generated one-paragraph performance summary on submission
- SharePoint auto-filing

### Phase 2
- Offline scorecard upload interface
- SimplePay integration (hours worked — nice-to-have)
- Best practices library (AI recommendations by role/KPA)
- Advanced analytics and cross-company comparisons

### Phase 3
- Training budget input → AI skills development plan per employee

### Phase 4
- Bulk contract generation for all 300 employees (parallel agent runs)

---

## Tech Stack (locked)
- Auth: Better Auth (org + teams + magic link)
- Frontend: TanStack Router + TanStack Form
- Backend: Hono + oRPC
- DB: Drizzle ORM + Neon Postgres + pgvector
- Email: Resend (sync MVP → Inngest queue in Phase 2)
- Documents: SharePoint auto-filing

---

## Companies In Scope
PIMMS Group JHB · Stanton Global · PMG · (Medena, Pallchem, UK, USA, Tego — phased in as group grows)

---

## Open Items
- [ ] Trevor green light before starting
- [ ] Confirm SimplePay API access and data structure
- [ ] Define SharePoint filing path and naming convention
- [ ] Organogram source — existing system or manual setup?
- [ ] Contract period cadence — annual? When does first period start?
- [ ] Confirm which other platforms (CRM, Sales) will feed scores into HR and agree on Employee ID mapping

---

## Key Docs
- Scope document: `PIMMS HR/docs/HR Platform — Scope 2026-05-21.md`
- Developer Brief v2: `PIMMS HR/Developer Brief/PIMMS HR Platform — Developer Brief v2 2026-05-18.md`
- Architecture Plan: `PIMMS HR/docs/HR Performance Platform Architecture Plan.pdf`
