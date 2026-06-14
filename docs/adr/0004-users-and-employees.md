# Users and Employees

Every User has exactly one Employee; not every Employee has a User. The `users.employee` field is required; `employees.user` is optional. Ticket assignment and reporting reference Employees, not Users, because most workers (portal users, technicians on the floor) never log into Payload admin.

`reportedBy` on tickets requires an Employee — no free-text reporter name. When the worker portal is built, reporters will map to existing employee records (e.g. kiosk picker), not anonymous text entry.
