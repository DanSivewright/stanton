# Stanton Asset Management

Bespoke asset registry and maintenance ticket system for the Stanton group and its subsidiaries, replacing FIX.

## Language

**Company**:
A legal or operating entity within the Stanton group (e.g. Stanton, PIMMS). May optionally belong to a parent **Company** (Stanton is the group root).
_Avoid_: Operating unit, subsidiary (as field names), tenant

**Location**:
A physical site, building, floor, or zone where assets sit and tickets are raised.
_Avoid_: Site (unless spoken informally), facility

**Asset**:
A tracked piece of equipment or infrastructure with a known location and category.
_Avoid_: Item (reserved for catalog templates), equipment (too generic)

**Asset Category**:
A simple admin-defined label classifying an **Asset** (e.g. Injection Machines, HVAC, Molds). Chosen from a predefined list or created on the fly.
_Avoid_: Kind, type (as field names), item group

**Asset Status**:
An admin-defined label for an **Asset**'s operational state (e.g. Active, Out of Service, Disposed). Chosen from a predefined list or created on the fly.
_Avoid_: State, condition

**Item**:
A catalog template describing a class of assets (model, SKU, default specs) — not a physical unit.
_Avoid_: Product, stock item, SKU (as a noun for the physical thing)

**Ticket**:
A maintenance request or work record with a work lifecycle and a separate review lifecycle.
_Avoid_: Work order, job, case, repair

**Ticket activity**:
A timestamped entry on a **Ticket** recording who did what — comment, photo, completion, or review — forming a chronological log.
_Avoid_: Note, update, message

**Maintenance Team**:
A crew of **Employees** grouped by function (e.g. Facilities, Machine Shop). Used for routing and filtering tickets — not a strict ownership boundary.
_Avoid_: Department, squad

**Ticket Type**:
An admin-defined label classifying a **Ticket**'s nature (e.g. Breakdown, Inspection, General). Chosen from a predefined list or created on the fly. Labels only — does not change workflow.
_Avoid_: Category, kind

**Priority**:
A fixed urgency level on a **Ticket** (`low`, `medium`, `high`, `urgent`). Hard-coded select — not a collection.
_Avoid_: Severity, urgency (as field names)

**Asset Movement**:
A recorded transfer of an **Asset** from one **Location** to another; the canonical audit trail for placement changes.
_Avoid_: Transfer, relocation, stock movement

**Portal**:
A separate worker-facing frontend (not Payload admin) for logging tickets without login.
_Avoid_: Public form (too vague)

**Employee**:
A person in the organisation — technician, manager, or worker — whether or not they log in.
_Avoid_: User, staff member, worker (as collection names)

**User**:
A person with login access to Payload admin (or future portal with auth). Every **User** has a corresponding **Employee**.
_Avoid_: Account

**Role**:
A permission label on a **User** (`admin`, `manager`, `technician`, `staff`). Enforcement deferred — client confirmation pending.
_Avoid_: Permission, access level

**Location group**:
A non-physical node in the location tree used only for organisation (e.g. region, building).
_Avoid_: Folder, category

**Location leaf**:
A physical place where assets sit and tickets are raised — always at the bottom of a branch.
_Avoid_: Site (informal OK), endpoint

**Location kind**:
An optional label describing what a node represents in the hierarchy (region, building, floor, zone).
_Avoid_: Level, type (too generic)

## Relationships

- A **Company** may have a parent **Company** (Stanton is the group parent; PIMMS is a child)
- A **Location** belongs to exactly one **Company**
- An **Asset** belongs to one **Company** and sits at one **Location**
- A **Ticket** is raised against a **Location**; it may optionally reference an **Asset**
- An **Asset** has its own **Company** (owner) independent of its **Location**'s **Company** (placement)
- A **Ticket**'s **Company** is derived from its **Location** at creation (or from **Asset** when one is linked); admins may override in Payload admin
- A **Location** belongs to exactly one **Company**
- A **Location** may have a parent **Location**, forming a tree up to **three levels** deep (depth is optional — a branch may be one, two, or three nodes)
- Only **Location leaf** nodes hold **Assets** and receive **Tickets**; **Location group** nodes organise the tree above them
- All **Locations** in a branch share the same **Company** as their root ancestor
- An **Asset Movement** updates the **Asset**'s **Location**; editing an **Asset**'s **Location** in admin also creates an **Asset Movement** — both paths stay in sync
- Every **User** has exactly one **Employee**; an **Employee** may optionally link to a **User** (most workers have no login)
- **Ticket** assignment fields reference **Employees**, not **Users**
- A **Ticket** has two independent state fields: **status** (work: `open` | `in_progress` | `completed` | `cancelled`) and **reviewStatus** (audit: `none` | `pending` | `verified` | `rejected`)
- When work is marked **completed**, **reviewStatus** becomes `pending`; a fully closed **Ticket** has **reviewStatus** `verified`
- A **Ticket** has one or more **Ticket activity** entries forming its log
- An **Asset** belongs to exactly one **Asset Category** and exactly one **Asset Status**
- A **Maintenance Team** belongs to one **Company** and has many **Employee** members
- A **Ticket** may reference a **Maintenance Team** (`assignedTeam`) and an individual **Employee** (`assignedTo`) — both optional; loose validation, used for defaults and filtering
- An **Asset** may have a `defaultTeam` that pre-fills **Ticket** assignment when linked
- A **Ticket** belongs to exactly one **Ticket Type**

## Example dialogue

> **Dev:** "Worker logs 'aircon broken at PIMMS Gauteng' — do we store Company separately or infer it from Location?"
> **Domain expert:** "Infer from Location. The location already belongs to PIMMS. But managers must be able to filter all PIMMS tickets across every PIMMS site."

> **Dev:** "Can a Stanton group manager see PIMMS tickets?"
> **Domain expert:** "Yes — parent-level company sees everything. A PIMMS-only user sees PIMMS."

> **Dev:** "Worker on the portal — do they pick a location?"
> **Domain expert:** "Location and company are inferred by the portal context. Admins editing in Payload can change anything."

## Flagged ambiguities

- Initially considered a lightweight operating-unit select on Location (option B) vs a full Company entity. **Resolved: full Company entity** — every company in the group is queryable and filterable.
- Company-scoped access control: deferred — pending client confirmation.
- Role-based access control: **deferred for MVP** — `role` field on **User** (`admin` | `manager` | `technician` | `staff`); logged-in users have broad access for now. Strict per-role rules come later.
- User ↔ Employee: **resolved** — optional `employee.user` link; every **User** must have an **Employee**; not every **Employee** has a **User**.
- Ticket activity log: **resolved** — `activity` array on **Ticket** (author, kind, body, photos, timestamp). Replaces flat work/review notes fields; log is the single source of truth for comments and attachments.
- Asset Category: **resolved** — simple collection (`name`, optional `description`); **Asset** → one category. No finance fields, no fixed `kind` enum. Admins pick from list or create new.
- Item / Item Group: **deferred post-MVP** — assets are created directly without catalog templates for now.
- Maintenance Teams: **resolved** — light model (`name`, `company`, `members`). Tickets support team + individual assignment; filter by team or responsible person. No strict validation.
- Asset Movements: **resolved** — in MVP with bidirectional sync to **Asset** location.
- Ticket Type: **resolved** — simple collection (`name`, optional `description`); **Ticket** → one type. Seed: Breakdown, Inspection, General. Same pattern as **Asset Category**.
- Company hierarchy: **resolved** — optional `parent` on **Company**; Stanton is root (`parent: null`), subsidiaries (e.g. PIMMS) reference Stanton.
- Ticket reporter: **resolved** — `reportedBy` → **Employee** required. No free-text reporter name. Worker portal deferred until reporters exist as employees.
- Portal vs employee-only reporter: portal routing deferred; when built, reporters must map to an **Employee** (e.g. kiosk picker, not anonymous text).
- Asset Status: **resolved** — simple collection (`name`, optional `description`); **Asset** → one status. Seed: Active, Out of Service, Disposed. Same lookup pattern as **Asset Category** and **Ticket Type**.
- Ticket Priority: **resolved** — fixed select on **Ticket** (`low` | `medium` | `high` | `urgent`), not a collection.
- Ticket creation UX: **resolved** — company auto-set from location; Payload admin exposes all fields for override. Worker portal is a separate frontend (routing details deferred).
- Location tree depth: **resolved** — flexible 1–3 levels (region → building → floor/zone as needed, not all branches require all levels).
- Group vs leaf: **resolved** — explicit `isGroup` toggle; only non-group locations hold assets and receive tickets.
- Asset company vs location company: **resolved** — may differ (ownership vs placement). Cross-company placement details deferred.
- Asset location changes: **resolved** — always produce an **Asset Movement**; creating a movement updates the **Asset**'s **Location**. Either entry point (asset edit or movement create) keeps both in sync.
