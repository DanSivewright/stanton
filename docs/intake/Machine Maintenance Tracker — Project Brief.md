# Machine Maintenance Tracker — Project Brief

**Client:** Stanton Group / PIMMS
**Owner:** Branden-Roy Unsworth (Mase Capital)
**Build Team:** TBD
**Status:** 🔵 NEW — Requirements being gathered
**Last Updated:** 2026-06-01

---

## What It Is
Replaces an existing app called **Fix**. A simple platform to track, manage, and record all machine maintenance and service activity across Stanton's factories.

Works hand-in-hand with the **Manufacturing Automation** platform — shares machine data on the backend. Manufacturing already counts cycles per mould (warning at 15,000 shots, service due at 20,000) — this platform receives that trigger and manages the full service lifecycle from there.

---

## Core Problem It Solves
Currently using an app called "Fix" to track machine issues and services. Goal: replace it with a purpose-built tool that:
- Knows every machine (from Manufacturing platform)
- Tracks service history per machine
- Manages parts and purchase orders
- Notifies the right people when machines go down

---

## Platform Scope

### In Scope
| Feature | Detail |
|---------|--------|
| Machine list | Pulled from Manufacturing backend — no duplicate data entry |
| Service history | Full log per machine: date, technician, parts used, notes, service count |
| Shot counter integration | Receives cycle counts from Manufacturing; triggers service jobs at 20,000 shots |
| PO upload | Attach a purchase order to a specific machine + job. Simple. No inventory management. |
| Machine down notifications | Alert sent to correct chain of people when machine is down (chain TBD) |
| Service logging | Record: what was done, who did it, parts replaced, time taken |

### Out of Scope
| Item | Reason |
|------|--------|
| Full inventory / stock management | Explicitly excluded — PO attachment only |
| Data migration from "Fix" | Starting fresh; historical data uploaded manually if needed |
| Predictive maintenance | Future phase |
| Integration with external ERP | Future phase |

### Users
- Primarily line managers (same as Manufacturing)
- Access level TBD — may be a module inside Manufacturing with different permissions, or standalone app

---

## Key Features (confirmed so far)

### 1. Shot Counter → Service Trigger
- Receives cycle counts from Manufacturing platform
- Service interval: every 20,000 shots
- When threshold hit → triggers a service notification/job
- Service logged: date, technician, parts used, notes

### 2. Service History per Machine
- Full log of every service event per machine
- How many times serviced
- Parts replaced each time
- Labour / technician who did the work
- Time taken

### 3. Parts & Purchase Orders
- Upload purchase orders for machine parts
- Parts linked to specific machines
- Track parts inventory / usage per service

### 4. Machine Down Notifications
- When a machine goes down → notify the correct chain of people
- (Chain of notification TBD — confirm with Trevor/Conrad)

---

## Integration with Manufacturing Platform
- Machine list pulled from Manufacturing backend (no duplicate data entry)
- Shot count tracked in Manufacturing → feeds service trigger here
- Machine stopped events in Manufacturing → can trigger maintenance job here

---

## Confirmed Decisions
- **Parts management:** Simple — attach a PO to a machine for a job. No inventory tracking.
- **Data migration:** Start fresh. Upload historical data in manually if needed.
- **Users:** Probably line managers (same as Manufacturing).

## Open Questions
- [ ] Standalone app or module inside Manufacturing with different access levels? (both options on the table)
- [ ] Machine down notification chain — who gets notified, in what order? (TBD)
- [ ] Scope: moulds only, or all factory machinery?

---

## Key Docs
- Source: Session notes 2026-06-01
