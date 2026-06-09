# ADR 0002: One-on-one scores canonical home in Manufacturing

**Status:** Accepted (2026-06-09)  
**Context:** Fork between `one-on-one-scores` (manufacturing.md) and `one-on-one-sessions` (hr.md)

## Decision

When built (deferred phase — after SPD POC or with Manufacturing/HR milestone):

- **Single collection:** `one-on-one-scores` owned by **Manufacturing** (managers enter on factory dashboard)
- **HR** reads by `employee` relationship for composite rollup — no `one-on-one-sessions` collection
- Employee ID is the cross-module join key

## Consequences

- One write path; no duplicate rollup logic
- HR module does not own weekly factory score entry UI
- Collection ships with Manufacturing path or explicit HR+Manufacturing joint milestone — not SPD POC

## Alternatives considered

- HR-owned collection with Manufacturing write API — rejected (split ownership, duplicate UI risk)
- `one-on-one-sessions` in HR — rejected (duplicate domain concept)
