export type InternalModuleSlug =
  | 'foundations'
  | 'manufacturing'
  | 'maintenance'
  | 'finance'
  | 'spd'
  | 'sales'
  | 'hr'
  | 'llm'
  | 'data'

export type RecordCard = {
  slug: string
  term: string
  purpose: string
  relationships?: string
  fieldGroups?: string
  notes?: string
}

export type InternalModule = {
  slug: InternalModuleSlug
  name: string
  phase: string
  owner: string
  summary: string
  globals: { slug: string; purpose: string }[]
  records: RecordCard[]
  hooks: string[]
  outOfScope: string[]
  openQuestions: string[]
}

export const internalBrand = {
  title: 'Stanton / PIMMS Ecosystem',
  subtitle: 'Buildmore · Team reference',
  badge: 'Internal only',
}

export const internalNav = [
  { href: '/team', label: 'Hub' },
  { href: '/team/architecture', label: 'Architecture' },
  { href: '/team/data-model', label: 'Data model' },
  { href: '/team/modules', label: 'Modules' },
  { href: '/team/integrations', label: 'Integrations' },
  { href: '/team/automation', label: 'Automation' },
  { href: '/team/delivery', label: 'Delivery' },
  { href: '/team/costs', label: 'Costs' },
] as const

export const platformPrinciples = [
  {
    title: 'Ecosystem source of truth',
    body: 'Normalized models and workflows live in one MongoDB-backed application. Odoo remains legal accounting authority; the platform owns reporting representation and cross-module intelligence.',
  },
  {
    title: 'Model first, integrations later',
    body: 'Collections and manual/import paths ship before automated Odoo, Pipedrive, or SharePoint sync. External data conforms to our schema — not the reverse.',
  },
  {
    title: 'Records vs module settings',
    body: 'Business data = collections. Thresholds, cadences, default chains = globals (not large record sets). Files = media + documents uploads.',
  },
  {
    title: 'History discipline',
    body: 'Master data is current-state. Operational facts are snapshots/events. Content templates may use drafts; factory/SPD/HR workflows use explicit status + transition events.',
  },
  {
    title: 'Employee ≠ login account',
    body: 'Employee is the business person (Employee ID is the cross-module key). User is the admin login — optional link to one Employee.',
  },
]

export const dataLayers = [
  {
    id: 'master',
    label: 'Master data',
    construct: 'Collections',
    examples: 'employees, machines, products, companies',
    color: '#3d8b7a',
  },
  {
    id: 'facts',
    label: 'Operational facts',
    construct: 'Snapshot / event collections',
    examples: 'production-snapshots, gate-sign-offs, finance lines',
    color: '#4a7ab8',
  },
  {
    id: 'settings',
    label: 'Module settings',
    construct: 'Globals',
    examples: 'manufacturing-settings, maintenance-settings',
    color: '#9a7b4f',
  },
  {
    id: 'files',
    label: 'Files',
    construct: 'Upload collections',
    examples: 'media, documents',
    color: '#7a6b8a',
  },
  {
    id: 'auto',
    label: 'Automation',
    construct: 'Hooks + job queue',
    examples: 'notifications, sync, SharePoint filing',
    color: '#c45c26',
  },
]

export const orgLevels = [
  { level: 'Group', slug: 'groups', children: 'companies' },
  { level: 'Company', slug: 'companies', children: 'sites, departments, employees' },
  { level: 'Site', slug: 'sites', children: 'machines, departments' },
  { level: 'Department / Team', slug: 'departments · teams', children: 'HR scope, sales rollups' },
]

export const integrations = [
  {
    system: 'Odoo',
    role: 'Accounting / finance source of record',
    module: 'Finance',
    v1: 'Manual import + normalized reporting collections',
    later: 'Scheduled sync, reconcile, odoo-sync-snapshots audit',
    rule: 'Server-side only — never browser → Odoo',
  },
  {
    system: 'Pipedrive',
    role: 'Targets, pipeline, activities',
    module: 'Sales',
    v1: 'Manual / CSV import',
    later: 'API sync — field mapping TBD',
    rule: 'Schema owned by platform',
  },
  {
    system: 'SharePoint',
    role: 'Document filing destination',
    module: 'HR, SPD, Finance',
    v1: 'Metadata + links on documents',
    later: 'Jobs queue auto-filing after approvals',
    rule: 'Not modeled as integration collection',
  },
  {
    system: 'Excel / planning sheets',
    role: 'Manufacturing planning intake',
    module: 'Manufacturing',
    v1: 'Import → manufacturing-orders',
    later: 'Scheduled import job',
    rule: 'Primary bulk-import candidate',
  },
  {
    system: 'Claude / OpenAI',
    role: 'LLM provider',
    module: 'Intelligence',
    v1: 'Out of scope',
    later: 'Phase 3 — usage-based cost',
    rule: 'No duplicate KB collections',
  },
  {
    system: 'Agent API (MCP plugin)',
    role: 'Future agent access',
    module: 'Intelligence',
    v1: 'Out of scope',
    later: 'Per-collection find permissions; User auth',
    rule: 'Same access as human operators',
  },
]

export const jobTasks = [
  { slug: 'sendNotification', trigger: 'Machine stopped, maintenance due, review due', module: 'Cross-cutting' },
  { slug: 'fileDocumentToSharePoint', trigger: 'Contract / review approved', module: 'HR' },
  { slug: 'syncOdooFinance', trigger: 'Schedule or manual', module: 'Finance' },
  { slug: 'importPlanningSheet', trigger: 'Upload or schedule', module: 'Manufacturing' },
  { slug: 'refreshEmbeddings', trigger: 'Record change', module: 'LLM (Phase 3)' },
  { slug: 'generateFinanceReport', trigger: 'On-demand', module: 'Finance (downstream)' },
]

export const deliveryEpics = [
  { id: 'DOC', name: 'Documentation & governance', status: 'Largely complete in repo', count: 7 },
  { id: 'PLAT', name: 'Platform setup', status: 'Mongo, Vercel, plugins, jobs cron', count: 6 },
  { id: 'FOUND', name: 'Foundations collections', status: 'Phase 0–1', count: 12 },
  { id: 'MFG', name: 'Manufacturing', status: 'Active — replaces WhatsApp rounds', count: 14 },
  { id: 'MAINT', name: 'Maintenance', status: 'Replaces Fix app concept', count: 6 },
  { id: 'FIN', name: 'Finance reporting', status: 'Active — PIMMS + Stanton Global first', count: 8 },
  { id: 'SPD', name: 'SPD POC', status: 'June 2026 pressure — bounded module', count: 10 },
  { id: 'SALES', name: 'Sales performance', status: 'Phase 2', count: 6 },
  { id: 'HR', name: 'HR performance hub', status: 'Deferred — Trevor green light', count: 8 },
  { id: 'LLM', name: 'LLM / agent API', status: 'Phase 3', count: 4 },
]

export const linearLabels = [
  'module:foundations', 'module:manufacturing', 'module:maintenance', 'module:finance',
  'module:spd', 'module:sales', 'module:hr', 'module:llm', 'module:data', 'module:docs',
  'phase:0', 'phase:1', 'phase:2', 'phase:3',
  'type:collection', 'type:global', 'type:hook', 'type:admin-ui', 'type:integration', 'type:plugin',
  'blocked:client', 'blocked:access',
]

export const openDecisions = [
  { topic: 'Mould ↔ Product cardinality', status: 'Unresolved — needs client sample data', refs: 'CONTEXT.md, foundations' },
  { topic: 'Access control matrix', status: 'Deferred — Admin/Manager/Staff + hidden scopes intended', refs: 'MASTER-SPEC §3.6' },
  { topic: 'Import/export per collection', status: 'Deferred — plugin-first, privileged roles TBD', refs: 'data-management' },
  { topic: 'Admin collection grouping', status: 'Deferred', refs: 'data-management' },
  { topic: 'Finance full report list', status: 'Client confirmation pending', refs: 'intake Odoo brief' },
  { topic: 'Maintenance notification chain', status: 'TBD with client', refs: 'maintenance-settings global' },
  { topic: 'Pipedrive field mapping', status: 'Before Sales Phase 2', refs: 'sales module' },
  { topic: 'HR go-ahead', status: 'Do not initiate without Trevor', refs: 'hr module' },
  { topic: '1-on-1 scores home', status: 'Manufacturing vs HR single source — decide at implement', refs: 'hr module' },
  { topic: 'Linear issue creation', status: 'Blocked until scope-map approved', refs: 'docs/linear/scope-map.md' },
]

export const intakeOverrides = [
  'SPD intake says standalone app → ecosystem uses shared application with bounded SPD module',
  'HR intake lists non-current stack → this repo is the canonical rebuild',
  'Finance intake emphasizes PPT → platform owns data; PPT/PDF rendering is downstream consumer',
]

export const internalModules: InternalModule[] = [
  {
    slug: 'foundations',
    name: 'Foundations',
    phase: '0 scope · Phase 1 implement',
    owner: 'module:foundations',
    summary: 'Shared org, people, customers, assets, files, tags, activity — everything else hangs off this.',
    globals: [{ slug: 'ecosystem-settings', purpose: 'Optional cross-cutting flags' }],
    records: [
      { slug: 'groups', term: 'Group', purpose: 'Stanton/PIMMS umbrella', relationships: '→ companies' },
      { slug: 'companies', term: 'Company', purpose: 'Legal/reporting entity', fieldGroups: 'name, code, branding refs' },
      { slug: 'sites', term: 'Site', purpose: 'Factory / physical location', relationships: '→ company; ← machines' },
      { slug: 'departments', term: 'Department', purpose: 'Org unit for HR/sales scope' },
      { slug: 'teams', term: 'Team', purpose: 'Working group rollups' },
      {
        slug: 'employees',
        term: 'Employee',
        purpose: 'Business person — Employee ID unique',
        relationships: '→ company, site, dept, manager; ← all modules',
        notes: 'Admin tabs: profile, contracts (HR), performance rollup',
      },
      { slug: 'users', term: 'User', purpose: 'Admin login', relationships: '→ optional employee', notes: 'Roles: Admin/Manager/Staff + scopes TBD' },
      { slug: 'customers', term: 'Customer', purpose: 'Lightweight external org' },
      { slug: 'contacts', term: 'Contact', purpose: 'External people' },
      { slug: 'products', term: 'Product', purpose: 'Canonical item across modules', notes: '↔ moulds cardinality TBD' },
      { slug: 'machines', term: 'Machine', purpose: '~40 factory equipment', relationships: '→ site' },
      { slug: 'moulds', term: 'Mould', purpose: 'Shot counts, service thresholds', fieldGroups: 'shotCount, warningAt, serviceAt' },
      { slug: 'tags', term: 'Tag', purpose: 'Lightweight classification' },
      { slug: 'activity-events', term: 'Activity Event', purpose: 'Cross-module audit trail', notes: 'Written by other modules hooks' },
      { slug: 'media', term: 'Media', purpose: 'Images, photos, logos' },
      { slug: 'documents', term: 'Document', purpose: 'PDF, Office, POs, contracts', fieldGroups: 'module, confidentiality, filing status' },
    ],
    hooks: ['activity-events from downstream afterChange handlers'],
    outOfScope: ['Full CRM', 'Payroll', 'ERP inventory'],
    openQuestions: ['Mould ↔ Product', 'product-categories nested tree?'],
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    phase: 'Phase 1 · Active',
    owner: 'module:manufacturing',
    summary: '3 factories, ~40 machines. Replaces WhatsApp hourly reporting. Prior MVP is reference only — clean rebuild.',
    globals: [
      {
        slug: 'manufacturing-settings',
        purpose: 'OEE benchmark 70%, reject 2%, 3-hourly snapshot times, shift hours',
      },
    ],
    records: [
      { slug: 'manufacturing-orders', term: 'MO', purpose: 'Active job on machine', notes: 'Planning sheet import target' },
      { slug: 'planning-snapshots', term: 'Planning snapshot', purpose: 'Immutable plan change record' },
      { slug: 'production-snapshots', term: 'Production round', purpose: 'Hourly/3-hourly operator entry', relationships: '→ machine, MO, employee' },
      { slug: 'stoppage-events', term: 'Stoppage', purpose: 'Machine down + reason', notes: 'Queues notification + maintenance' },
      { slug: 'tool-change-events', term: 'Tool change', purpose: 'Allocation vs actual time' },
      { slug: 'quality-checklists', term: 'Quality checklist', purpose: 'Tests when mould on machine' },
      { slug: 'setter-sign-offs', term: 'Setter sign-off', purpose: 'Setter accountability' },
    ],
    hooks: [
      'production-snapshots afterChange: rollups, reject threshold → notification job',
      'stoppage afterChange: machine-down chain',
      'moulds afterChange: shot threshold → maintenance job',
    ],
    outOfScope: ['Carry legacy MVP as-is', 'Full MES'],
    openQuestions: ['Reject as separate collection vs snapshot fields'],
  },
  {
    slug: 'maintenance',
    name: 'Maintenance',
    phase: 'Phase 1',
    owner: 'module:maintenance',
    summary: 'Separate module sharing machines, moulds, employees, parts, documents. Replaces Fix — no v1 migration.',
    globals: [{ slug: 'maintenance-settings', purpose: '20k service interval, 15k warning, notification chain' }],
    records: [
      { slug: 'parts', term: 'Part', purpose: 'Catalog only — no inventory v1' },
      { slug: 'maintenance-jobs', term: 'Maintenance job', purpose: 'open → in_progress → completed', relationships: '→ machine, mould, technician' },
      { slug: 'maintenance-job-parts', term: 'Job parts', purpose: 'Parts used — may be array on job' },
      { slug: 'maintenance-pos', term: 'PO attachment', purpose: '→ documents, job, machine' },
    ],
    hooks: ['Job complete → mould service reset; activity event', 'Machine-down notifications via jobs queue'],
    outOfScope: ['Predictive maintenance', 'ERP inventory', 'Fix data migration'],
    openQuestions: ['Notification chain recipients — client TBD'],
  },
  {
    slug: 'finance',
    name: 'Finance',
    phase: 'Phase 1 · Active',
    owner: 'module:finance',
    summary: 'Report-ready normalized data. Odoo-shaped, platform-owned. PPT/PDF generators consume API — not core modeling.',
    globals: [{ slug: 'finance-settings', purpose: 'Default companies, period cadence, recipient labels' }],
    records: [
      { slug: 'finance-reporting-periods', term: 'Reporting period', purpose: 'Month/week/custom window', fieldGroups: 'open/locked status' },
      { slug: 'finance-report-lines', term: 'Report line', purpose: 'Account, division, amount, comparatives' },
      { slug: 'financial-metrics', term: 'Financial metric', purpose: 'Margin %, current ratio, etc.' },
      { slug: 'debtors-aging', term: 'Debtors aging', purpose: 'Bucketed 30/60/90/120+' },
      { slug: 'creditors-aging', term: 'Creditors aging', purpose: 'Bucketed aging' },
      { slug: 'finance-targets', term: 'Finance target', purpose: 'Invoice vs target by division' },
      { slug: 'odoo-sync-snapshots', term: 'Sync snapshot', purpose: 'Phase 2+ raw audit when sync ships', notes: 'Deferred for v1' },
    ],
    hooks: ['Future syncOdooFinance job — server-side JSON-RPC pattern from PoC'],
    outOfScope: ['Replacing Odoo', 'Board pack rendering inside admin'],
    openQuestions: ['Full report list beyond PIMMS + Stanton Global'],
  },
  {
    slug: 'spd',
    name: 'SPD',
    phase: 'Phase 1 · POC end June 2026',
    owner: 'module:spd',
    summary: '6 phases × 3 stages × 5 gates. Intake standalone → overridden: bounded module in shared app.',
    globals: [{ slug: 'spd-settings', purpose: 'Default process template pointer' }],
    records: [
      { slug: 'spd-process-templates', term: 'Process template', purpose: 'Versioned canonical process — blocks/arrays', fieldGroups: 'draft/published' },
      { slug: 'spd-projects', term: 'SPD project', purpose: 'Live instance + embedded template snapshot at create', relationships: '→ company, customer, tooling-asset' },
      { slug: 'spd-gate-sign-offs', term: 'Gate sign-off', purpose: 'Explicit approval event with evidence' },
      { slug: 'spd-change-requests', term: 'Change request', purpose: 'In-scope redo vs out-of-scope costed' },
      { slug: 'tooling-assets', term: 'Tooling asset', purpose: 'SPD output — not Machine/Mould', relationships: '↔ product, mould phased' },
      { slug: 'spd-client-form-submissions', term: 'Client form', purpose: 'Optional external form landing' },
    ],
    hooks: ['Gate sign-off → phase unlock + activity event', 'Change request validation beforeChange'],
    outOfScope: ['Hard runtime deps on Mfg/HR/Finance for v1 POC'],
    openQuestions: ['Role → User scope mapping at implement'],
  },
  {
    slug: 'sales',
    name: 'Sales',
    phase: 'Phase 2',
    owner: 'module:sales',
    summary: 'Target / planned / actual. Pipedrive/Odoo are sources — not schema owners.',
    globals: [{ slug: 'sales-settings', purpose: 'Hunt/Care defaults (8 visits, 30% conversion, etc.)' }],
    records: [
      { slug: 'sales-performance-periods', term: 'Performance period', purpose: 'Monthly window' },
      { slug: 'sales-targets', term: 'Sales target', purpose: 'Per rep/team/dept' },
      { slug: 'sales-actuals', term: 'Sales actual', purpose: 'From Odoo or manual' },
      { slug: 'sales-activities', term: 'Sales activity', purpose: 'Hunt/Care counts' },
      { slug: 'sales-performance-snapshots', term: 'Rollup snapshot', purpose: 'Optional if query perf needs' },
    ],
    hooks: ['Import-export on targets/actuals/activities'],
    outOfScope: ['Full CRM', 'Companies beyond PIMMS + Stanton Global initially'],
    openQuestions: ['Pipedrive field mapping'],
  },
  {
    slug: 'hr',
    name: 'HR',
    phase: 'Phase 2 · Deferred',
    owner: 'module:hr',
    summary: 'Performance & organogram hub — not HRIS. stanton-global handoff is reference only.',
    globals: [{ slug: 'hr-settings', purpose: 'Review cadence, rating bands' }],
    records: [
      { slug: 'contract-templates', term: 'Contract template', purpose: 'KPA/KPI nested blocks by role' },
      { slug: 'performance-contracts', term: 'Performance contract', purpose: 'On employee — draft → approved workflow' },
      { slug: 'quarterly-reviews', term: 'Quarterly review', purpose: 'Scores 1–3 per KPI, weighted total' },
      { slug: 'one-on-one-sessions', term: '1-on-1', purpose: 'May consolidate with Manufacturing — TBD' },
      { slug: 'performance-summaries', term: 'AI summary', purpose: 'Phase 2+ placeholder' },
    ],
    hooks: ['Review afterChange: weighted score, SharePoint job', 'Cron: review reminders from hr-settings'],
    outOfScope: ['Payroll, leave, benefits, recruitment, SimplePay v1, bulk 300-employee gen'],
    openQuestions: ['Trevor green light', '1-on-1 canonical home'],
  },
  {
    slug: 'llm',
    name: 'LLM / Agent API',
    phase: 'Phase 3',
    owner: 'module:llm',
    summary: 'No separate KB. Complete normalized data now; agent plugin later with same access rules.',
    globals: [],
    records: [],
    hooks: ['Future: refreshEmbeddings job', 'Activity events for sensitive reads (optional)'],
    outOfScope: ['KB duplicate collections', 'Embedding tables v1', 'Chat UI unless prioritized'],
    openQuestions: ['Agent User role', 'Per-collection MCP permissions'],
  },
  {
    slug: 'data',
    name: 'Data Management',
    phase: 'Cross-cutting 0–1+',
    owner: 'module:data',
    summary: 'Import-export plugin, jobs queue visibility, no Import Batch as business domain.',
    globals: [],
    records: [
      { slug: 'payload-jobs', term: 'Jobs (admin)', purpose: 'Visible when jobsCollectionOverrides enabled' },
    ],
    hooks: ['Vercel cron → /api/.../run + handle-schedules — not in-process autoRun alone'],
    outOfScope: ['Notification Rules collection', 'Workflow engine collection'],
    openQuestions: ['Import governance per collection'],
  },
]

export function getInternalModule(slug: string): InternalModule | undefined {
  return internalModules.find((m) => m.slug === slug)
}

export const internalCostRows = [
  { service: 'Vercel (Pro team)', mvpVendor: '$20–40', mvpClient: '$25–55', prodVendor: '$40–150', prodClient: '$50–195', notes: 'Next app + admin; Pro for cron' },
  { service: 'MongoDB Atlas', mvpVendor: '$0–25', mvpClient: '$0–35', prodVendor: '$57–150', prodClient: '$70–195', notes: 'Replica set for transactions' },
  { service: 'Vercel Blob', mvpVendor: '$0–10', mvpClient: '$0–15', prodVendor: '$20–80', prodClient: '$25–105', notes: 'Documents, photos' },
  { service: 'Resend / email', mvpVendor: '$0–20', mvpClient: '$0–30', prodVendor: '$20–80', prodClient: '$30–105', notes: 'Notifications' },
  { service: 'Sentry', mvpVendor: '$0–26', mvpClient: '$0–35', prodVendor: '$26–80', prodClient: '$35–105', notes: 'Error tracking' },
  { service: 'Claude / OpenAI', mvpVendor: '$0', mvpClient: '$0', prodVendor: '$50–500+', prodClient: '$75–650+', notes: 'Phase 3 — usage dependent' },
]

export const internalCostRollups = [
  { stage: 'MVP', vendor: '$25–120/mo', client: '$30–160/mo' },
  { stage: 'Production', vendor: '$150–600/mo', client: '$195–780/mo' },
  { stage: 'Production + LLM', vendor: '$250–1,200+/mo', client: '$325–1,500+/mo' },
]

export const markupNote =
  'Client allowance uses ~1.15–1.30× vendor in docs; stakeholder site uses 1.5× for client-facing tiers. Some lines are managed-service fees rather than flat %.';
