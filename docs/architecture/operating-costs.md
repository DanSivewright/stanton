# Operating Costs — Internal Estimates

**Audience:** Buildmore / technical provider (internal). Includes markup guidance for client-facing allowances. **Not** stored in Payload.

**Last updated:** 2026-06-04  
**Currency:** USD unless noted; ranges are rough — validate against actual usage.

---

## Markup policy

| Column | Meaning |
|--------|---------|
| **Vendor cost** | Estimated pass-through to platform vendor |
| **Client allowance** | Recommended charge to client (vendor × ~1.15–1.30 default band) |
| **Notes** | Assumptions, unknowns |

Some services (AI usage, storage overages) may use **managed-service fee** rather than flat % markup.

---

## Stage assumptions

| Stage | Users | Data volume | Traffic |
|-------|-------|-------------|---------|
| **MVP** | &lt; 50 internal | Low Mongo, few files | Admin + light API |
| **Production** | 50–300 | Growing snapshots, documents | Daily ops + cron |
| **Scaled** | 300+ | Heavy manufacturing snapshots, finance history | Multiple crons, LLM queries |

---

## Infrastructure

| Service | MVP vendor | MVP client allowance | Production vendor | Production client allowance | Notes |
|---------|------------|----------------------|-------------------|----------------------------|-------|
| **Vercel** (Pro team) | $20–40/mo | $25–55/mo | $40–150/mo | $50–195/mo | Hosting Next + Payload; Pro for cron |
| **Vercel Cron** | Included in Pro limits | Included | May need Pro+ usage | TBD | Jobs: sync, reminders, imports |
| **MongoDB Atlas** | $0–25/mo (M10) | $0–35/mo | $57–150/mo (M10–M30) | $70–195/mo | Replica set for transactions; scale with snapshot volume |
| **Vercel Blob** | $0–10/mo | $0–15/mo | $20–80/mo | $25–105/mo | Documents, photos, exports |
| **Vercel Analytics** (optional) | $0–10/mo | $0–15/mo | $10–30/mo | $15–40/mo | Stakeholder site later |
| **Domain / DNS** | $1–2/mo | $2–5/mo | Same | Same | If custom domain |

---

## AI and communications

| Service | MVP vendor | MVP client allowance | Production vendor | Production client allowance | Notes |
|---------|------------|----------------------|-------------------|----------------------------|-------|
| **Claude / OpenAI API** | $0 (off) | $0 | $50–500+/mo | $75–650+/mo | Phase 3 LLM; highly usage-dependent |
| **Embeddings** | $0–20/mo | $0–30/mo | $20–100/mo | $30–130/mo | If indexing large doc sets |
| **Resend / email** | $0–20/mo | $0–30/mo | $20–80/mo | $30–105/mo | Notifications, report delivery |
| **Linear** | $0–8/user | Pass-through + margin | Same | Same | PM — client or provider account |

---

## Observability and security

| Service | MVP vendor | MVP client allowance | Production vendor | Production client allowance | Notes |
|---------|------------|----------------------|-------------------|----------------------------|-------|
| **Sentry / logging** | $0–26/mo | $0–35/mo | $26–80/mo | $35–105/mo | Error tracking |
| **Secrets manager** | $0 | $0 | $0–20/mo | $0–30/mo | Vercel env may suffice initially |

---

## One-time / episodic

| Item | Estimate | Notes |
|------|----------|-------|
| MongoDB migration / cluster setup | Internal time | Replica set config |
| Odoo integration user setup | Internal time | Per handoff checklist |
| Spike: Pipedrive field mapping | Internal time | Before Sales Phase 2 |

---

## Monthly rollup (indicative)

| Stage | Vendor total (range) | Client allowance (range) |
|-------|------------------------|---------------------------|
| **MVP** | $25–120/mo | $30–160/mo |
| **Production** | $150–600/mo | $195–780/mo |
| **Production + active LLM** | $250–1,200+/mo | $325–1,500+/mo |

---

## Unknowns

- Actual manufacturing snapshot frequency (40 machines × hourly → storage growth)
- Finance report count expansion (client confirmation pending)
- SharePoint / Microsoft licensing (client-owned?)
- South Africa data residency requirements
- Client expectation for 24/7 support vs business-hours

---

## Stakeholder website

Deferred. When built (Huashu design skill), add marginal Vercel traffic only — likely within existing hosting tier.
