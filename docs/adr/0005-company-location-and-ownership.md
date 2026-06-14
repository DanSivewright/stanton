# Company, location, and ownership

Companies are a full collection with optional `parent` hierarchy (Stanton as group root, subsidiaries like PIMMS as children). Locations form a flexible 1–3 depth tree per company with an explicit `isGroup` toggle — only leaf locations (`isGroup: false`) hold assets and receive tickets.

An asset's owner company may differ from its location's company (ownership vs placement). Ticket company is derived from location at creation, or from the linked asset when one is set; admins can override in Payload admin. Company-scoped access control is deferred pending client confirmation.
