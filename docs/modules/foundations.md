# Module: Foundations

Shared master data and cross-cutting records used by all modules.

**Delivery phase:** 0 (scoped in full; implement with Phase 1)  
**Owner module key:** `foundations`

---

## Purpose

Provide canonical **organisation**, **people**, **customers**, **production assets**, **files**, and **audit** anchors so Manufacturing, Maintenance, Finance, Sales, HR, and SPD do not duplicate core entities.

### SPD POC foundation slice (Phase 1a)

Minimum collections before SPD ships:

- `companies`, `employees`, `customers`, `contacts`, `users`, `documents`

**Deferred phase:** `groups`, `sites`, `departments`, `teams`, `products`, `machines`, `moulds`, `tags`, `activity-events` — expand when Manufacturing, HR, or multi-site reporting starts.

---

## Globals

| Slug | Purpose |
|------|---------|
| `ecosystem-settings` | Optional cross-cutting flags |

---

## Collection cards

### `groups`

| | |
|--|--|
| **Business term** | Group |
| **Purpose** | Top-level Stanton/PIMMS umbrella |
| **Key relationships** | → many `companies` |
| **Field groups** | name, slug, status |
| **Nested Docs** | No |
| **Plugin notes** | Import/export if bulk onboarding |

### `companies`

| | |
|--|--|
| **Business term** | Company |
| **Purpose** | Legal/reporting entity (PIMMS JHB, Stanton Global, …) |
| **Key relationships** | → `group`; ← `sites`, `departments`, `employees` |
| **Field groups** | name, code, branding refs (media), active |

### `sites`

| | |
|--|--|
| **Business term** | Site |
| **Purpose** | Factory / physical location |
| **Key relationships** | → `company`; ← `machines`, `departments` |
| **Field groups** | name, code, address (optional) |

### `departments` / `teams`

| | |
|--|--|
| **Purpose** | Org structure for HR, Sales, access scope |
| **Key relationships** | → `company`, optional `site` |
| **Field groups** | name, parent department (optional) |

### `employees`

| | |
|--|--|
| **Business term** | Employee |
| **Purpose** | Business person record; HR-owned master |
| **Key relationships** | → `company`, optional `user`; `site`, `department`, `team`, `manager` deferred phase |
| **Field groups (1a)** | employeeId (unique), name, jobTitle, active |
| **Admin** | Tabs: profile, contracts (HR), performance summary (read-only rollup later) |
| **Plugin notes** | CSV template: `scripts/seed/employees-template.csv`; import-export in PLAT-003 |
| **Seed** | Three sample approver employees on boot (`src/seed/employees.ts`) |

### `users`

| | |
|--|--|
| **Business term** | User |
| **Purpose** | Payload auth account |
| **Key relationships** | → optional `employee` |
| **Field groups** | roles (Admin/Staff in 1a; Manager when matrix ships), `companyScope` (relationship array, optional in 1a) |

### `customers`

| | |
|--|--|
| **Purpose** | Lightweight external org for SPD/Sales/Finance |
| **Key relationships** | → `company`; ← `contacts`, SPD projects |
| **Field groups (1a)** | name, code (unique), active |

### `contacts`

| | |
|--|--|
| **Purpose** | External people |
| **Key relationships** | → `customer`, optional `company` |
| **Field groups (1a)** | name, email, phone, roleTitle |

### `products`

| | |
|--|--|
| **Purpose** | Canonical product across SPD, Manufacturing, Sales, Finance |
| **Key relationships** | ↔ `moulds` (TBD cardinality); ← MOs, SPD tooling |
| **Field groups** | name, stockCode, description, company |

### `machines`

| | |
|--|--|
| **Purpose** | Factory equipment (~40) |
| **Key relationships** | → `site`; ← snapshots, maintenance jobs |
| **Field groups** | machineId, name, status, type (robotic/manual) |

### `moulds`

| | |
|--|--|
| **Purpose** | Tooling; shot count & service thresholds |
| **Key relationships** | ↔ `products` (TBD); ← maintenance |
| **Field groups** | shotCount, warningAt, serviceAt, lastServiceAt |

### `tags`

| | |
|--|--|
| **Purpose** | Lightweight classification |
| **Field groups** | label, module hint |

### `activity-events`

| | |
|--|--|
| **Purpose** | Cross-module business audit trail |
| **Key relationships** | → actor `users`; polymorphic source via `collectionSlug` + `documentId` |
| **Field groups** | summary, eventType, module, collectionSlug, documentId, metadata (json) |
| **Access** | Authenticated read; append-only (no update/delete); writes via hooks with `overrideAccess` |
| **Hooks (Wave 2)** | Gate sign-off, snapshot submit, maintenance complete, period lock, contract approved — `src/hooks/platform/recordActivityOnChange.ts` |

### `documents`

| | |
|--|--|
| **Purpose** | PDF, Office, and image uploads with cross-module metadata |
| **Key relationships** | Polymorphic source link deferred (v1 upload-only) |
| **Field groups** | title, description, module (enum), confidentiality (public / internal / confidential / restricted) |
| **Access (1a skeleton)** | Authenticated read/create; delete Admin only until PLAT-007 |

### `media`

| | |
|--|--|
| **Purpose** | Images, photos, logos (existing collection) |
| **Field groups** | alt text |

---

## Source evidence

- [Manufacturing brief](../intake/Manufacturing%20Automation%20%E2%80%94%20Project%20Brief.md) — Employee ID, 3 factories, 40 machines
- [HR brief](../intake/PIMMS%20HR%20Platform%20%E2%80%94%20Project%20Brief.md) — organogram ~300, multi-company
- [Maintenance brief](../intake/Machine%20Maintenance%20Tracker%20%E2%80%94%20Project%20Brief.md) — machines from Manufacturing
- [Sales brief](../intake/Sales%20Performance%20Dashboard%20%E2%80%94%20Project%20Brief.md) — rep/team/department
- [SPD brief](../intake/SPD%20Project%20Management%20App%20%E2%80%94%20Project%20Brief.md) — client forms, assets
- Ecosystem scoping session — Employee vs User, org hierarchy, Customers/Contacts

---

## Assumptions (full-platform build 2026-06-09)

- `groups` collection deferred — single `companies` record sufficient; no top-level Group entity yet.
- `sites` / `departments` / `teams` / `products` / `machines` / `moulds` / `tags` / `activity-events` **shipped** as thin collections (`src/collections/`).
- `companies.logo` upload field added for branding; no multi-company doc-gen yet.
- `employees` extended with optional `site`, `department`, `team`, `manager` relationships.
- Demo seed: 3 sites, 9 machines (3 per site), 3 products, 3 moulds — `src/seed/platformDemo.ts`.
- `activity-events` is append-only audit log; polymorphic source uses `collectionSlug` + `documentId` text fields.

## Open questions

- Mould ↔ Product cardinality
- Access control scopes per collection
- Whether `product-categories` needs Nested Docs tree
