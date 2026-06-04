# Manufacturing Automation — Project Brief

**Client:** Stanton Group / PIMMS
**Owner:** Branden-Roy Unsworth (Mase Capital)
**Build Team:** Jordy (Buildmore London)
**Status:** 🟢 ACTIVE
**Last Updated:** 2026-06-01

---

## What It Is
Real-time equipment monitoring and operator data entry platform for Stanton's plastic injection moulding operation. Replaces 40 WhatsApp groups the CEO used to monitor manually.

- 3 factories
- 40 machines
- Line managers do rounds on tablets, input data per machine per shift

---

## What's Live
- Machine grid dashboard (grouped by factory) — Running / Stopped / Scheduled
- OEE progress bar per machine (green >70%, amber >60%, red below)
- Planning sheet upload (Excel → dashboard in seconds)
- Operator data entry (tablet-optimised, interactive prototype)
- Deployed to: `pimms-dashboard-mvp.vercel.app`

---

## Phase 2 — In Active Development
- Direct tablet input by line managers
- Machine dropdown → product auto-populated
- Actual cycle time entry → OEE + variance calculated live
- Units produced + rejects per machine per hour

---

## Latest Change Requests (2026-06-01)
1. **Tool Change Flow** — select machine → product → tool change; upload tool list with time allocations; flag overruns vs allocation
2. **Cycle Counter** — count cycles per mould; warning at 15,000; service due at 20,000; resets after mould service
3. **Quality Checklist** — when mould goes on, quality person completes configurable test list; sign-off recorded before production starts
4. **Setter Sign-Off + Photos** — setter uploads photos of machine settings (mandatory) + digital sign-off (name, employee ID, timestamp)
5. **Machine Stopped Button** — one press sends instant notification to all; machine stays offline until reason is submitted

---

## Full Platform Scope

### Dashboard
- **List/card view** — toggle between card grid and table view (machine, status, OEE, cycle time, production — colour-coded)
- **TV display mode** — read-only factory floor broadcast: top 3 and bottom 3 machines by performance
- **Units produced per hour** on each machine card
- **Filters** — Running only / Critical only / All
- **Order progress tracker** — total hours per MO + running tally with progress indicator
- **Rejection alerts** — triggered when scrap exceeds threshold (global 2%; per-product overrides configurable)
- **Scrap/MOQ logic** — fixed setup waste treated as fixed cost; orders below scrap break-even flagged

### Operator Input
- **Compulsory identity** — First Name, Surname, Employee Code on every submission
- **Planned Cycle Time hidden from operators** — visible on physical job cards only; removed from screen to prevent gaming
- **Behind-schedule indicator** — flags when actual output falls short of theoretical for the period
- **Dual OEE display** — operator-entered vs system-calculated; variance flagged automatically
- **Input validation** — cycle time and output validated for consistency before submission accepted
- **Robotic vs manual machine logic** — separate output validation per machine type
- **Machine efficiency + operator efficiency** — tracked independently
- **Stoppage reason** — free text, mandatory if stoppage logged
- **Stoppage history** — line graph per machine: last 3 hours + last 24 hours
- **3-hourly reporting** — 12-hour production day; snapshots at 7am, 10am, 1pm, 4pm, 7pm
- **Login persistence + offline capability** — syncs on reconnect

### Planning & Scheduling
- **Static product display** — Stock Code + Product Name per machine (not a dropdown)
- **Job re-assignment** — move active MO from downed machine to another
- **Mould change scheduling** — planner adds changeover event; machine shows "In Changeover" instead of red alert
- **Planned vs unplanned delays** — planned changeover excluded from alerts; crew unavailability flagged separately

### Asset & Maintenance
- **Mould service tracker** — shot count per mould; warning at 15,000; service threshold at 20,000
- **Machine lifetime tracking** — cumulative repair costs and total downtime per machine

### Version History
- **Planning snapshot archive** — snapshot saved on every plan change; browse and compare previous states

### People & Performance
- **Manager 1-on-1 scorecard** — weekly/monthly scoring per Employee ID on Accuracy and Runs
- **Team Analytics view** — surfaced in the dashboard; feeds directly into HR platform via Employee ID

---

## Key Metrics Tracked
- OEE vs 70% benchmark
- Cycle time (actual vs planned), variance %
- Production output (actual vs target), variance %
- Machine stoppages (reason mandatory)
- Reject rate (flag when >2% of MOQ)
- Schedule drift per MO
- Mould cycle count
- Operator efficiency + machine efficiency (separate metrics)

---

## Cross-Platform Link
Every machine submission tied to **Employee ID**. Manufacturing floor scores (accuracy, output, OEE, rejects) feed directly into PIMMS HR quarterly KPI reviews. This is the primary data bridge between Manufacturing and HR.

### Scope — In vs Out
| In Scope | Out of Scope |
|----------|-------------|
| 3 factories, 40 machines | IoT/sensor integration (future phase) |
| Tablet operator input | Native mobile app (web app only) |
| Operator + manager roles | ERP integration (future phase) |
| Mould service tracking | Predictive maintenance (future phase) |
| Machine maintenance link (via Maintenance Tracker) | Costings integration (future phase) |

---

## Open Items
- [ ] Send Change Request 2026-06-01 to Jordy
- [ ] Confirm AWS setup status with Jordy
- [ ] Confirm build deadlines with Jordy
- [ ] Trevor meeting 2026-06-02 11:30 — Production App / Data Collection Process (Walt@pimms.co.za)

---

## Key Docs
- Developer Brief: `Manufacturing Automation/Developer Briefs/Manufacturing Automation — Developer Brief 2026-05-18.md`
- Change Request: `Manufacturing Automation/Developer Briefs/Change Request — 2026-06-01.md`
