# Architecture

Module layout and integration patterns for the Stanton MVP Payload backend.

## Source layout

```
src/
├── collections/
│   ├── index.ts                 # All MVP collections export array
│   ├── media.ts
│   ├── organization/
│   │   ├── companies.ts
│   │   └── locations.ts
│   ├── catalog/
│   │   ├── asset-categories.ts
│   │   ├── asset-statuses.ts
│   │   └── ticket-types.ts
│   ├── people/
│   │   ├── employees.ts
│   │   ├── maintenance-teams.ts
│   │   └── users.ts
│   ├── assets/
│   │   ├── assets.ts
│   │   └── asset-movements.ts
│   └── maintenance/
│       └── tickets.ts
├── hooks/
│   ├── locations/
│   ├── assets/
│   ├── asset-movements/
│   └── tickets/
├── access/
│   ├── authenticated.ts
│   └── roles.ts
├── lib/
│   ├── constants/
│   │   ├── ticketStatuses.ts
│   │   ├── ticketReviewStatuses.ts
│   │   ├── ticketPriorities.ts
│   │   ├── activityKinds.ts
│   │   ├── userRoles.ts
│   │   └── sync-context.ts
│   └── relationships.ts
└── payload.config.ts
```

## Entity diagram

```mermaid
erDiagram
  companies ||--o{ companies : parent
  companies ||--o{ locations : has
  companies ||--o{ employees : employs
  companies ||--o{ maintenance-teams : has
  companies ||--o{ assets : owns
  companies ||--o{ tickets : scopes

  locations ||--o{ locations : parent
  locations ||--o{ assets : holds
  locations ||--o{ tickets : receives

  asset-categories ||--o{ assets : classifies
  asset-statuses ||--o{ assets : states
  ticket-types ||--o{ tickets : classifies

  employees ||--o| users : may_login
  employees }o--o{ maintenance-teams : members
  employees ||--o{ assets : custodian
  employees ||--o{ tickets : reportedBy
  employees ||--o{ tickets : assignedTo
  employees ||--o{ asset-movements : movedBy

  assets ||--o{ asset-movements : history
  assets ||--o{ tickets : optional_link

  maintenance-teams ||--o{ tickets : assignedTeam
  maintenance-teams ||--o{ assets : defaultTeam
```

## Asset movement flow

```mermaid
sequenceDiagram
  participant Admin
  participant Asset
  participant Movement

  Admin->>Asset: Edit location field
  Asset->>Movement: afterChange creates movement (skipMovementSync)
  Note over Movement: Records from/to, reason

  Admin->>Movement: Create movement manually
  Movement->>Asset: afterChange updates location (skipAssetSync)
```

**Loop prevention:** `req.context.skipAssetSync` and `req.context.skipMovementSync` flags ensure each direction fires only once.

## Ticket lifecycle

```mermaid
stateDiagram-v2
  direction LR
  state work_status {
    open --> in_progress
    in_progress --> completed
    open --> cancelled
    in_progress --> cancelled
  }
  state review_status {
    none --> pending: work completed
    pending --> verified
    pending --> rejected
  }
```

When `status` transitions to `completed`, `reviewStatus` becomes `pending` and a `completion` activity entry is appended.

## Access control (MVP)

| Rule | Implementation |
|------|----------------|
| Unauthenticated | No access to domain collections |
| Authenticated | Full CRUD on all MVP collections |
| Future RBAC | `users.role` stored with `saveToJWT`; helpers in `access/roles.ts` |

Strict per-role matrix documented as **future** — pending client confirmation on company-scoped visibility.

## Website template collections

`Pages`, `Posts`, `Categories` remain in the repo but are **not registered** in `payload.config.ts` for the MVP backend.
