# ADR 0001: Finance report sections as blocks on period

**Status:** Accepted (2026-06-09)  
**Context:** Grill reconciliation — Architect vs Pragmatist vs `payload-data-model.md` Nested Docs candidate

## Decision

Finance report sections are **nested blocks on `finance-reporting-periods`** (`sections[]` with `sectionKey`, label, ordering). `finance-report-lines` reference `period` + `sectionKey` string. No separate `finance-report-sections` collection in Phase 1.

Period **lock** (`status: open | locked`) freezes child lines and `financial-metrics` when locked. Corrections use adjustment lines in an open period or Admin unlock with audit reason.

## Consequences

- Simpler permissions and fewer collections
- Nested Docs plugin not required for Finance v1
- If sections later need independent versioning or cross-period reuse, revisit a collection or `finance-period-snapshots` parent (deferred phase)

## Alternatives considered

- Separate `finance-report-sections` collection — rejected for v1 (no independent lifecycle)
- Nested Docs on sections — rejected (sections are not a same-collection tree)
