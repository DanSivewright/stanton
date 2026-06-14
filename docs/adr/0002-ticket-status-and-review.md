# Ticket status and reviewStatus

Tickets carry two independent state fields: `status` tracks work progress (`open` → `in_progress` → `completed` | `cancelled`) while `reviewStatus` tracks audit closure (`none` → `pending` → `verified` | `rejected`). A single combined status chain would conflate "technician finished" with "manager signed off", which are separate business events in Stanton's workflow.

Comments, photos, and lifecycle events live in the `activity` array on the ticket — not in separate notes or photo fields. Each entry records `kind`, `author` (employee), `body`, `photos`, and `createdAt`. When work is marked completed, `reviewStatus` auto-transitions to `pending` and a `completion` activity entry is appended.
