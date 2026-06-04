# Module: Foundations

Shared master data and cross-cutting records used by all modules.

**Delivery phase:** 0 (scoped in full; implement with Phase 1)  
**Owner module key:** `foundations`

---

## Purpose

Provide canonical **organisation**, **people**, **customers**, **production assets**, **files**, and **audit** anchors so Manufacturing, Maintenance, Finance, Sales, HR, and SPD do not duplicate core entities.

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
| **Key relationships** | → `company`, `site`, `department`, `team`, `manager` (employee); ← manufacturing, sales, HR records |
| **Field groups** | employeeId (unique), name, job title, manager, managerMor, active |
| **Admin** | Tabs: profile, contracts (HR), performance summary (read-only rollup later) |
| **Plugin notes** | Import/export for organogram (~300 rows) |

### `users`

| | |
|--|--|
| **Business term** | User |
| **Purpose** | Payload auth account |
| **Key relationships** | → optional `employee` |
| **Field groups** | roles (Admin/Manager/Staff + scopes TBD), company scope |

### `customers`

| | |
|--|--|
| **Purpose** | Lightweight external org for SPD/Sales/Finance |
| **Key relationships** | ← `contacts`, SPD projects |
| **Field groups** | name, type, company link optional |

### `contacts`

| | |
|--|--|
| **Purpose** | External people |
| **Key relationships** | → `customer` and/or `company` |
| **Field groups** | name, email, role label |

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
| **Key relationships** | → actor `user`/`employee`, polymorphic source ref |
| **Field groups** | eventType, module, summary, timestamp |
| **Hooks** | Written by other modules' afterChange |

### `media` / `documents`

| | |
|--|--|
| **Purpose** | Payload-native uploads (existing `media` + new `documents`) |
| **Field groups** | module, tags, confidentiality, source link |

---

## Source evidence

- [Manufacturing brief](../intake/Manufacturing%20Automation%20%E2%80%94%20Project%20Brief.md) — Employee ID, 3 factories, 40 machines
- [HR brief](../intake/PIMMS%20HR%20Platform%20%E2%80%94%20Project%20Brief.md) — organogram ~300, multi-company
- [Maintenance brief](../intake/Machine%20Maintenance%20Tracker%20%E2%80%94%20Project%20Brief.md) — machines from Manufacturing
- [Sales brief](../intake/Sales%20Performance%20Dashboard%20%E2%80%94%20Project%20Brief.md) — rep/team/department
- [SPD brief](../intake/SPD%20Project%20Management%20App%20%E2%80%94%20Project%20Brief.md) — client forms, assets
- Ecosystem scoping session — Employee vs User, org hierarchy, Customers/Contacts

---

## Open questions

- Mould ↔ Product cardinality
- Access control scopes per collection
- Whether `product-categories` needs Nested Docs tree
