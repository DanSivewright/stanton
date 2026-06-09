# Employees CSV import template

Use `employees-template.csv` for bulk organogram onboarding (import-export plugin ships in PLAT-003).

## Columns

| Column | Required | Notes |
|--------|----------|-------|
| `employeeId` | Yes | Unique business ID |
| `name` | Yes | Display name |
| `jobTitle` | No | Job title |
| `companyCode` | Yes | Matches `companies.code` (e.g. `PIMMS`) |
| `active` | No | `true` / `false`; defaults to `true` |

## Manual import (POC)

1. Ensure the company exists (`PIMMS` is seeded on boot).
2. Create employees in Payload admin, or run `seedEmployees` via `onInit`.
3. Link approver employees to `users` via the **User** field on the employee record.

## Sample approvers

`seedEmployees` creates three sample approver records for SPD gate sign-off testing.
