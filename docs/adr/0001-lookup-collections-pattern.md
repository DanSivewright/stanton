# Lookup collections pattern

Asset categories, asset statuses, and ticket types are Payload collections with `name` and optional `description`, not fixed select enums. Admins pick from existing values or create new ones inline in the admin UI. Ticket priority stays a hard-coded select (`low` | `medium` | `high` | `urgent`) because urgency levels are stable and don't need admin-defined labels.

Collections were chosen for lookup data because Stanton operators routinely add new categories and types as the business grows; a fixed enum would require code deploys for every new label. Priority is the exception — it's a small, stable set used for sorting and escalation rules.
