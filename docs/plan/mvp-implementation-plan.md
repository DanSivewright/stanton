# MVP Implementation Plan

Phased build plan for the Stanton asset management Payload CMS backend. Domain terms are defined in [CONTEXT.md](../../CONTEXT.md).

**No seed data** — lookup values (Breakdown, Active, etc.) are created manually in admin. See [collection-fields.md](../reference/collection-fields.md) for suggested examples.

## Phase 0 — Scaffold

- [x] Reorganize `src/collections/` into domain modules: `organization/`, `catalog/`, `assets/`, `people/`, `maintenance/`
- [x] Remove obsolete stubs (`items.ts`, `item-group.ts`, old single-file stubs)
- [x] Add `src/collections/index.ts` export array
- [x] Add `src/hooks/`, `src/access/`, `src/lib/constants/`
- [x] Leave website template collections (`Pages`, `Posts`, etc.) out of `payload.config.ts`

## Phase 1 — Organization and lookups

| Collection | File | Validation |
|------------|------|------------|
| `companies` | `organization/companies.ts` | Optional parent → companies |
| `locations` | `organization/locations.ts` | Max depth 3; parent must be `isGroup`; child `company` matches parent |
| `asset-categories` | `catalog/asset-categories.ts` | — |
| `asset-statuses` | `catalog/asset-statuses.ts` | — |
| `ticket-types` | `catalog/ticket-types.ts` | — |

**Location hooks** (`src/hooks/locations/`):

- `validateParentLocation` — parent is group, no circular refs
- `validateLocationDepth` — max 3 levels from root
- `validateCompanyMatchesParent` — child company equals parent company

## Phase 2 — People

| Collection | File | Notes |
|------------|------|-------|
| `employees` | `people/employees.ts` | `user` → users optional |
| `maintenance-teams` | `people/maintenance-teams.ts` | `members` → employees hasMany |
| `users` | `people/users.ts` | Extend with `role` + required `employee` |

**User flow:** Admin creates an **Employee** first, then a **User** linked to that employee. No auto-create.

## Phase 3 — Assets and movements

| Collection | File | Hooks |
|------------|------|-------|
| `assets` | `assets/assets.ts` | `syncLocationToMovement` (afterChange) |
| `asset-movements` | `assets/asset-movements.ts` | `syncMovementToAsset` (afterChange) |

**Context guards** (`src/lib/constants/sync-context.ts`):

- `skipAssetSync` — movement hook updating asset
- `skipMovementSync` — asset hook creating movement

**Leaf validation:** Assets require `location` where `isGroup: false` (hook on assets).

## Phase 4 — Tickets

| Collection | File | Hooks |
|------------|------|-------|
| `tickets` | `maintenance/tickets.ts` | See below |

**Hooks** (`src/hooks/tickets/`):

1. `generateTicketNumber` — beforeChange on create
2. `inheritFromAsset` — beforeChange when asset linked
3. `inheritCompanyFromLocation` — beforeChange on create when no asset
4. `validateLocationIsLeaf` — beforeChange
5. `onWorkCompleted` — beforeChange when status → `completed`

**Constants** (`src/lib/constants/`):

- `ticketStatuses.ts`, `ticketReviewStatuses.ts`, `ticketPriorities.ts`, `activityKinds.ts`, `userRoles.ts`

## Phase 5 — Access (loose MVP)

- `src/access/authenticated.ts` — any logged-in user can CRUD all MVP collections
- `src/access/roles.ts` — helpers reading `users.role` (for future strict RBAC)

## Phase 6 — Wire and verify

1. Register all collections in `src/payload.config.ts` via `src/collections/index.ts`
2. Run `pnpm generate:types`
3. Smoke test in admin: company → location tree → employee → user → asset → ticket → movement

**Out of scope:** seed scripts, worker portal, custom endpoints, items/item-groups, strict RBAC, company-scoped access.

## Suggested manual smoke test order

1. Create companies: Stanton (root), PIMMS (child of Stanton)
2. Create location tree under PIMMS: region (group) → building (group) → floor (leaf)
3. Create lookup values: asset category, asset status, ticket type
4. Create maintenance team + employees
5. Create user linked to employee
6. Create asset at leaf location
7. Create ticket at same location
8. Edit asset location → verify movement auto-created
9. Create movement manually → verify asset location updates
