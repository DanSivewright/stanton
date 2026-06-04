# Stanton Group — Manufacturing Dashboard: Developer Brief

**Client:** Stanton Group
**Project owner:** Branden-Roy Unsworth (Mase Capital)
**MVP due:** Monday 19 May 2026
**Check-in:** Monday with Trevor (client) after delivery

---

## What This Is

A **real-time equipment monitoring dashboard** for a plastic injection moulding factory.

There are **40 machines on the factory floor** across 3 factories. Management currently has no live visibility into what any machine is doing. This dashboard gives them a single screen showing, for every machine:

1. **What job is currently running**
2. **Target vs actual — cycle time** (how fast each shot should take vs how fast it is actually running)
3. **Target vs actual — production output** (how many units should have been produced vs how many actually were)
4. **The variance between target and actual for both, as a percentage**

**Data source for MVP: the existing Excel planning sheet. The dashboard reads from it. There is no new data entry in this MVP.**

---

## Why It's Being Built — The Current Problem

Every hour, the CEO manually skims through **40 separate WhatsApp groups** to track targets, rejects, and cycle times across all machines. He catches everything — but it is an enormous waste of his time and the factory managers' time.

There is no way to see at a glance whether any machine is behind, running slow, or stopped without reading through every chat.

This app replaces that.

---

## The Data Source — Excel Planning Sheet

File: `Planning Sheet - Book1.xlsx` (shared with developer separately)

Three sheets, one per factory:
- Factory 1 — Main Factory
- Factory 2 — New Factory 2
- Factory 3 — New Factory C / Row 3 / Toolroom

One row per active production order. The dashboard reads all three sheets and displays them in a single consolidated view.

**Columns per order:**

| Field | Description |
|---|---|
| PROD START DATE | Actual production start |
| ORIGINAL PLANNED DATE | Planned start |
| DRIFT | Days ahead/behind plan (negative = late) |
| REASON FOR DRIFT | Free text (mould change, power outage, etc.) |
| MACHINE | Machine ID (e.g. N650, H380, H160, H7001) |
| SALES O/N OR STOCK O/N | Sales order or stock replenishment |
| MONTH | Order month |
| MO NUMBER | Manufacturing Order number |
| PRODUCT NAME | Full product description |
| PALLET TYPE | Pallet specification |
| SETUP TIME | Setup time in minutes |
| L/S | Large/Small flag |
| CYCLE TIME | Seconds per shot (planned) |
| ORDER QTY | Total quantity ordered |
| CAV QTY | Cavity quantity (cavities per mould) |
| SHOT QTY | Total shots required |
| OEE | Overall Equipment Effectiveness (%) |
| 70% TARGET | 70% OEE benchmark |
| REMAIN QTY | Remaining quantity to produce |
| QTY P/DAY | Quantity per day at current OEE |
| REMAIN HRS | Remaining hours |
| REMAIN DAYS | Remaining production days |
| SAT–MON | Flag: does this run over the weekend? |
| PROD END DATE | Calculated completion date |

**Order statuses (colour-coded rows in Excel):**

| Status | Meaning |
|---|---|
| Running | Order actively in production |
| Awaiting Trial | Awaiting confirmation of trial run |
| Ghost Booking | Placeholder booking |
| Trial | Trial run in progress |
| To Create MO | Manufacturing order not yet created |
| Completed | Done — exclude from dashboard |

---

## What the Dashboard Displays Per Machine

For each active machine, display:

| What | Field / Calculation |
|---|---|
| Machine | MACHINE |
| Current job | PRODUCT NAME + MO NUMBER |
| Target cycle time | CYCLE TIME (seconds/shot, from Excel) |
| Actual cycle time | Reported by operator (input phase) / derived from OEE for MVP |
| Cycle time variance % | ((Actual ÷ Target cycle time) − 1) × 100 |
| Target production output | Units/hr at 100% = (CAV QTY ÷ CYCLE TIME) × 3600 |
| Actual production output | TARGET OUTPUT × (OEE ÷ 100) |
| Production variance % | ((Actual output ÷ Target output) − 1) × 100 |
| Status | From row colour/status |
| Machine stoppage | Yes/No — with reason if Yes |
| Drift | DRIFT (days — negative = late) |
| Remaining days | REMAIN DAYS |
| End date | PROD END DATE |

---

## Variance and Alert Logic

**Cycle time variance:**
- Planned: e.g. 60 seconds/shot
- Actual: e.g. 62 seconds/shot → 3.3% variance → within 5% threshold → **green**
- Exceeds 5% → **red flag**

**Production output variance:**
- Target: e.g. 1,100 units/hr
- Actual: e.g. 1,000 units/hr → 9% variance → **flag**

**OEE:**
- Benchmark: 70%
- Below 70% → **red**

**Machine stoppages:**
- A checkbox/toggle on each machine entry: **"Machine stoppage?"**
- If **No** → no action required, assumed running
- If **Yes** → a reason field becomes mandatory before the entry can be submitted
- Stoppages must be visible on the dashboard (separate indicator — not just buried in a status field)

**Rejects:**
- Called "rejects" in the WhatsApp reports
- Not currently in the Excel — reported manually in the background
- Not trackable on the MVP dashboard (no data source yet)
- Will be added as a field in the direct input phase

**The dashboard must make underperformance immediately visible** — open the screen, see 40 machines, instantly know which are red. No number-reading required.

---

## How WhatsApp Reporting Currently Works

Each of the 40 machines has a corresponding WhatsApp group. Every hour, operators post production updates covering targets, rejects, and cycle times. The CEO skims all 40 groups every hour to catch issues.

This app replaces that loop entirely.

---

## Calculated Fields — Do Not Ask Users to Enter These

| Field | How to Calculate |
|---|---|
| DRIFT | PROD START DATE − ORIGINAL PLANNED DATE |
| Target output | (CAV QTY ÷ CYCLE TIME) × 3600 = units/hr |
| Actual output | TARGET OUTPUT × (OEE ÷ 100) |
| Cycle time variance % | ((Actual cycle time ÷ Planned cycle time) − 1) × 100 |
| Production variance % | ((Actual output ÷ Target output) − 1) × 100 |
| REMAIN QTY | ORDER QTY − qty produced to date |
| QTY P/DAY | Actual rate × shift hours |
| REMAIN HRS | REMAIN QTY ÷ actual rate |
| REMAIN DAYS | REMAIN HRS ÷ shift hours |
| PROD END DATE | Today + REMAIN DAYS (accounting for SAT–MON flag) |

---

## Scale

- 3 factories
- 40 machines
- ~24 data fields per active order
- Operators report **hourly** per machine

---

## MVP Deliverable — Monday 19 May

**1. Dashboard**
A working read-only dashboard that:
- Reads from the existing Excel planning sheet
- Displays all active machines across all 3 factories
- Shows current job, target vs actual cycle time, target vs actual production output, variance % for both
- Shows machine stoppage status per machine
- Flags machines below 70% OEE visually
- Flags cycle time variance above 5%
- Excludes completed orders
- Readable at a glance — one screen, all 40 machines, green/red without reading numbers

**2. Wireframe / Screen Mockup**
Alongside the working dashboard, provide a mockup of what the **data entry screen** will look like when operators input directly. Does not need to be functional — Trevor wants to see the layout before the input phase is built.

---

## Direct Input Phase — Confirmed Approach

**Option A is confirmed.** This is not a future consideration — the infrastructure is already in place.

**How it works:**
- Trevor has purchased tablets for line managers
- Each line manager is responsible for approximately 10 machines
- The line manager does rounds on the factory floor with their tablet
- At each machine, they input the operator's data, hit submit, and move to the next machine
- Fields to log per machine per hour: actual cycle time, actual production qty, machine stoppage (yes/no + reason if yes), rejects

**Future state (after MVP):**
- One tablet per machine, stationary at the machine
- Operator logs their own data directly without waiting for the line manager

**Platform:** Web app on tablet. Trevor is happy with a web app that works on the tablets — no native app required.

**Data entry UX requirements:**
- Machine selected from dropdown (list of active machines)
- Product currently running auto-populated or selected from dropdown filtered to that machine
- Fields: actual cycle time, actual production qty, machine stoppage checkbox, reason (mandatory if stoppage ticked), rejects
- Fast to complete — line manager is doing this for 10 machines per round

---

## Open Questions for the Developer

- **How is the Excel file accessed?** Confirm whether it lives on a shared drive the app can read directly, or needs to be uploaded each time.
- **Shift hours:** Required to validate REMAIN DAYS calculations. Confirm with client.
- **Rejects threshold:** To be confirmed with client when rejects field is added in the input phase.
- **Stoppage reason list:** Free text or predefined dropdown? Confirm with client.

---

*Brief prepared by Mase Capital — 15 May 2026*
*Updated with client feedback — 15 May 2026*
