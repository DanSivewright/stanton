# Collection Fields

Authoritative field spec for MVP collections. Terms defined in [CONTEXT.md](../../CONTEXT.md).

## companies

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | text | yes | Display name |
| `code` | text | yes | Short code (e.g. `STN`, `PIMMS`) |
| `parent` | relationship → companies | no | Null for group root (Stanton) |

## locations

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | text | yes | |
| `company` | relationship → companies | yes | Every node belongs to one company |
| `parent` | relationship → locations | no | Must reference a group location |
| `isGroup` | checkbox | yes | `true` = group node; `false` = leaf (holds assets/tickets) |
| `kind` | select | no | `region` \| `building` \| `floor` \| `zone` |
| `notes` | textarea | no | |

**Validation:** max depth 3; parent must be `isGroup`; child `company` matches parent `company`.

## asset-categories

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | text | yes | e.g. Injection Machines, HVAC |
| `description` | textarea | no | |

## asset-statuses

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | text | yes | e.g. Active, Out of Service, Disposed |
| `description` | textarea | no | |

## ticket-types

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | text | yes | e.g. Breakdown, Inspection, General |
| `description` | textarea | no | |

## employees

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `fullName` | text | yes | |
| `company` | relationship → companies | yes | |
| `jobTitle` | text | no | |
| `phone` | text | no | |
| `email` | email | no | |
| `user` | relationship → users | no | Most employees have no login |
| `team` | relationship → maintenance-teams | no | Primary team membership |

## maintenance-teams

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | text | yes | e.g. Facilities, Machine Shop |
| `company` | relationship → companies | yes | |
| `members` | relationship → employees (hasMany) | no | |

## users

Extends Payload auth defaults (`email`, password).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `role` | select | yes | `admin` \| `manager` \| `technician` \| `staff` |
| `employee` | relationship → employees | yes | Every user has an employee record |

## assets

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | text | yes | |
| `assetTag` | text | yes | Unique identifier / tag number |
| `company` | relationship → companies | yes | Owner company (may differ from location company) |
| `location` | relationship → locations | yes | Must be a leaf (`isGroup: false`) |
| `category` | relationship → asset-categories | yes | |
| `status` | relationship → asset-statuses | yes | |
| `serialNumber` | text | no | |
| `tonnage` | number | no | |
| `custodian` | relationship → employees | no | |
| `defaultTeam` | relationship → maintenance-teams | no | Pre-fills ticket assignment |
| `notes` | textarea | no | |

## asset-movements

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `reference` | text | auto | Generated on create (e.g. `MOV-00001`) |
| `asset` | relationship → assets | yes | |
| `company` | relationship → companies | yes | |
| `fromLocation` | relationship → locations | no | Null for initial placement |
| `toLocation` | relationship → locations | yes | Must be a leaf |
| `movedBy` | relationship → employees | no | |
| `movedAt` | date | yes | |
| `reason` | textarea | no | |

## tickets

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `ticketNumber` | text | auto | Generated on create (e.g. `TKT-00001`) |
| `title` | text | yes | |
| `description` | textarea | no | |
| `type` | relationship → ticket-types | yes | |
| `priority` | select | yes | `low` \| `medium` \| `high` \| `urgent` |
| `status` | select | yes | `open` \| `in_progress` \| `completed` \| `cancelled` |
| `reviewStatus` | select | yes | `none` \| `pending` \| `verified` \| `rejected` |
| `company` | relationship → companies | yes | Auto-set from location or asset |
| `location` | relationship → locations | yes | Must be a leaf |
| `asset` | relationship → assets | no | Optional link to specific asset |
| `reportedBy` | relationship → employees | yes | No free-text reporter |
| `reportedAt` | date | yes | |
| `assignedTeam` | relationship → maintenance-teams | no | |
| `assignedTo` | relationship → employees | no | |
| `activity` | array | no | Chronological log (see below) |

### activity[] entry

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `kind` | select | yes | `comment` \| `photo` \| `completion` \| `review` |
| `author` | relationship → employees | yes | |
| `body` | textarea | no | Text content |
| `photos` | upload → media (hasMany) | no | |
| `createdAt` | date | yes | Auto-set on append |

## media

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `alt` | text | yes | Payload upload default |
