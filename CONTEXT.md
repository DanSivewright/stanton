# Stanton / PIMMS Ecosystem

Shared language for the Stanton Group and PIMMS operational hub built on Payload CMS. One integrated data model organized by module for admin, documentation, and delivery.

## Language

### Organisation

**Group**:
The top-level umbrella entity for Stanton Group / PIMMS operating companies.
_Avoid_: client, account (when meaning organisation)

**Company**:
A legal or reporting entity within the Group (e.g. PIMMS Group JHB, Stanton Global).
_Avoid_: organisation (generic)

**Site**:
A physical operating location or factory within a Company.
_Avoid_: factory (as the canonical term — use Site; factory is UI copy)

**Department**:
An organisational unit within a Company or Site used for reporting and access scope.
_Avoid_: team (when meaning department)

**Team**:
A working group within a Department, often used for operational or sales rollups.
_Avoid_: department

### People

**Employee**:
The business person record — identity, role, manager chain, Employee ID, and HR/performance data.
_Avoid_: user, staff member (ambiguous)

**User**:
The Payload login account used to access the admin UI; may link to one Employee.
_Avoid_: employee (when meaning login only)

**Employee ID**:
The durable cross-module identifier tying Manufacturing, HR, Sales, and other modules to one person.
_Avoid_: user id, staff code (unless client-standardised)

**Contact**:
An external person linked to a Customer or Company (client stakeholders, finance recipients).
_Avoid_: employee

### Assets and production

**Machine**:
Factory equipment that runs production (injection moulding lines, etc.).
_Avoid_: asset (when meaning machine only)

**Mould**:
Injection moulding tooling; shot counts and service thresholds attach to the Mould.
_Avoid_: tool (unless SPD tooling context)

**Product**:
The canonical item or offering designed, manufactured, sold, or reported on across modules.
_Avoid_: SKU (as primary term — SKU/stock code may be a field on Product)

**Asset**:
Broad umbrella term only when a generic cross-module label is required.
_Avoid_: using Asset instead of Machine, Mould, Product, or Tooling Asset

**Tooling Asset**:
SPD’s long-lived project output (tool/product asset) with version history — not the same as Machine or Mould.
_Avoid_: asset (alone), project (when meaning the physical tool)

### Customers and documents

**Customer**:
An external organisation or account involved in SPD, Sales, or finance reporting — lightweight, not a full CRM.
_Avoid_: client (in data model), account

**Document**:
A PDF, Office file, or generated report stored via Payload upload collections with metadata.
_Avoid_: file (generic)

**Media**:
Images, photos, logos, and visual uploads (setter photos, branding).
_Avoid_: document (when meaning image only)

### Performance and metrics

**Performance KPI**:
A measurable goal row on an HR performance contract (under a KPA).
_Avoid_: KPI (alone in HR specs)

**Sales KPI**:
A sales goal or target structure in the Sales module (often alongside KPA 1–4).
_Avoid_: KPI (alone in Sales specs)

**Operational Metric**:
A quantified factory or dashboard measure (OEE, cycle variance, reject rate, output).
_Avoid_: KPI (in Manufacturing operational docs)

**Financial Metric**:
A ratio or margin derived from finance reporting data (gross margin %, current ratio, etc.).
_Avoid_: KPI (in Finance docs)

**KPA**:
Key Performance Area — weighted area grouping KPIs (HR contracts, Sales SMART structure).
_Avoid_: goal area (informal)

### SPD

**SPD Project**:
A product development initiative following the 6-phase SPD process with gates and deliverables.
_Avoid_: product (when meaning the project), job

**Gate**:
A sign-off checkpoint between SPD phases that unlocks the next phase when approved.
_Avoid_: milestone (informal), approval (generic)

**Gate Sign-Off**:
An explicit approval event with approver, role, timestamp, evidence, and decision.
_Avoid_: checkbox, status tick

**Change Request**:
A scoped change to an SPD project — in-scope redo or out-of-scope (costed, client sign-off).
_Avoid_: CR (in client-facing copy without definition)

### Maintenance

**Maintenance Job**:
A service or repair work record for a Machine (and related Parts/POs).
_Avoid_: ticket, fix (legacy app name)

**Part**:
A catalogued machine part used on maintenance jobs — structured catalog, no stock/inventory in v1.
_Avoid_: inventory item, SKU (unless aligned with Product)

### Finance and sales time

**Finance Reporting Period**:
The time box for normalized finance report lines and metrics in Payload.
_Avoid_: period (alone)

**Sales Performance Period**:
The monthly (or agreed) window for targets, actuals, and activities per rep/team.
_Avoid_: period (alone)

**HR Contract Period** / **Review Period**:
The performance contract or quarterly review time box for an Employee.
_Avoid_: period (alone)

**Manufacturing Production Day** / **Production Snapshot**:
Operational time boundaries for rounds, 3-hourly snapshots, and planning history.
_Avoid_: shift (unless explicitly shift-based)

### System

**Ecosystem**:
The single Payload application housing all modules and shared foundations.
_Avoid_: ERP (unless client-facing), platform (generic)

## Relationships

- A **Group** has many **Companies**
- A **Company** has many **Sites**, **Departments**, and **Teams**
- An **Employee** belongs to a **Company** (and optionally **Site** / **Department** / **Team**)
- A **User** may link to exactly one **Employee**
- A **Machine** belongs to a **Site**; a **Mould** may relate to one or more **Products** (cardinality TBD from client data)
- A **Maintenance Job** belongs to a **Machine** and may reference **Parts** and **Documents**
- An **SPD Project** snapshots an **SPD Process Template** and may link **Customers**, **Contacts**, and **Tooling Assets**
- **Finance Reporting Period** and **Sales Performance Period** are module-specific — not one universal Period entity

## Example dialogue

> **Dev:** "When a line manager submits a **Production Snapshot**, does that update the employee's **Performance KPI**?"
> **Domain expert:** "No — it feeds **Operational Metrics** by **Employee ID**. HR rolls those into the quarterly composite alongside the formal **Review Period** scores."

> **Dev:** "Is the **Tooling Asset** the same as the **Mould** on the factory floor?"
> **Domain expert:** "No — **Tooling Asset** is the SPD project output with version history. **Mould** is what we track shots and service on in Manufacturing and Maintenance."

## Flagged ambiguities

- **KPI** in client briefs is overloaded — resolved: disambiguate in canonical docs as Performance KPI, Sales KPI, Operational Metric, or Financial Metric; UI may still say "KPI" where the client expects it.
- **SPD brief** says standalone with no cross-platform integration — resolved: SPD lives in the shared Payload ecosystem with shared foundations; cross-module workflow automation is phased.
- **Asset** in SPD brief means project/tool output — resolved: use **Tooling Asset** in glossary; **Machine** / **Mould** / **Product** remain distinct.
- **Mould ↔ Product** cardinality — unresolved; validate against real tool/mould/product data before locking schema.
- **Access control** — deferred; simple Admin/Manager/Staff roles with hidden scopes planned for implementation phase.
