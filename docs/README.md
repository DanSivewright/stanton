# Stanton Asset Management — Documentation

Bespoke asset registry and maintenance ticket system for the Stanton group and its subsidiaries.

## Start here

| Document | Purpose |
|----------|---------|
| [CONTEXT.md](../CONTEXT.md) | Domain glossary — canonical terms and relationships (no implementation detail) |
| [plan/mvp-implementation-plan.md](plan/mvp-implementation-plan.md) | Phased build checklist and file paths |
| [reference/mvp-scope.md](reference/mvp-scope.md) | What's in/out of MVP scope |
| [reference/collection-fields.md](reference/collection-fields.md) | Field-level spec per collection |
| [reference/architecture.md](reference/architecture.md) | Module layout, hooks, access intent, diagrams |

## Architecture decisions

| ADR | Topic |
|-----|-------|
| [0001](adr/0001-lookup-collections-pattern.md) | Lookup collections vs fixed selects |
| [0002](adr/0002-ticket-status-and-review.md) | Ticket status + reviewStatus + activity log |
| [0003](adr/0003-bidirectional-asset-movement-sync.md) | Asset ↔ movement bidirectional sync |
| [0004](adr/0004-users-and-employees.md) | Users and Employees relationship |
| [0005](adr/0005-company-location-and-ownership.md) | Company hierarchy, location tree, ownership |

## Relationship between docs

- **CONTEXT.md** — glossary only; link terms, don't duplicate prose.
- **docs/reference/** — implementation spec and scope.
- **docs/adr/** — non-obvious decisions and trade-offs.
- **docs/plan/** — execution order for builders.
