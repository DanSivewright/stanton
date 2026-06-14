# MVP Scope

Consolidated scope from the domain grilling session. Glossary terms live in [CONTEXT.md](../../CONTEXT.md).

## In scope

### Collections (10 domain + 2 system)

| Slug | Purpose |
|------|---------|
| `companies` | Legal/operating entities with optional parent hierarchy |
| `locations` | 1–3 depth tree per company; groups vs leaves |
| `asset-categories` | Admin-defined asset classification (pick or create) |
| `asset-statuses` | Admin-defined operational state (pick or create) |
| `ticket-types` | Admin-defined ticket classification (pick or create) |
| `employees` | People in the organisation, with or without login |
| `maintenance-teams` | Crews for routing and filtering tickets |
| `assets` | Tracked equipment with location, category, status |
| `asset-movements` | Audit trail for placement changes |
| `tickets` | Maintenance requests with dual lifecycle + activity log |
| `users` | Payload admin auth; every user has an employee |
| `media` | File uploads for ticket activity photos |

### Behaviours

- **Lookup collections** — categories, statuses, ticket types are collections (not fixed enums)
- **Fixed select** — ticket priority (`low` | `medium` | `high` | `urgent`)
- **Dual ticket state** — `status` (work) + `reviewStatus` (audit), independent fields
- **Activity array** — single source of truth for comments, photos, completion, review entries
- **Bidirectional sync** — asset location edits create movements; movement creates update asset location
- **Company inference** — ticket company from location (or asset when linked); admin can override
- **Loose RBAC** — authenticated users have broad CRUD access; `role` field stored for future enforcement

## Deferred

| Item | Notes |
|------|-------|
| `items` / `item-groups` | Catalog templates for asset classes — post-MVP |
| Worker portal | Separate frontend for ticket logging without Payload admin |
| Seed data | Lookup values created manually in admin |
| Strict RBAC | Per-role matrix pending client confirmation |
| Company-scoped access | Parent sees all vs subsidiary-only — pending client |
| Nested Docs plugin | Optional future enhancement for location breadcrumbs |

## Suggested lookup examples (admin-created, not seeded)

| Collection | Examples |
|------------|----------|
| `asset-categories` | Injection Machines, HVAC, Molds |
| `asset-statuses` | Active, Out of Service, Disposed |
| `ticket-types` | Breakdown, Inspection, General |

## Related ADRs

- [0001](../adr/0001-lookup-collections-pattern.md) — lookup pattern
- [0002](../adr/0002-ticket-status-and-review.md) — ticket lifecycles
- [0003](../adr/0003-bidirectional-asset-movement-sync.md) — movement sync
- [0004](../adr/0004-users-and-employees.md) — users ↔ employees
- [0005](../adr/0005-company-location-and-ownership.md) — org structure
