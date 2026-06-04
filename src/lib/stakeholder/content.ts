export type ModuleSlug =
  | 'foundations'
  | 'manufacturing'
  | 'maintenance'
  | 'finance'
  | 'spd'
  | 'sales'
  | 'hr'
  | 'intelligence'
  | 'connectivity'

export type PhaseId = '0' | '1' | '2' | '3'

export type ModuleMeta = {
  slug: ModuleSlug
  name: string
  tagline: string
  phase: PhaseId
  phaseLabel: string
  status: 'active' | 'planned' | 'deferred'
  statusLabel: string
  icon: string
  outcomes: string[]
  connectsTo: string[]
  notIncluded: string[]
}

export const brand = {
  title: 'Stanton Group · PIMMS',
  subtitle: 'Integrated Operations Platform',
  descriptor:
    'One connected system for how your group runs factories, develops products, reports finances, and grows people — without juggling disconnected tools.',
}

export const principles = [
  {
    title: 'One source of truth',
    body: 'Organisation, people, machines, products, and customers live once in the platform. Every module reads the same records — no duplicate spreadsheets.',
  },
  {
    title: 'Built for how you work',
    body: 'Operational teams use a single management portal. Leaders get dashboards and exports. External systems feed in when you are ready — they do not dictate your data model.',
  },
  {
    title: 'History you can trust',
    body: 'Master data stays current. Production rounds, gate sign-offs, and finance periods are stored as snapshots and events — so reports stay auditable.',
  },
  {
    title: 'Phased, not big-bang',
    body: 'Foundations and factory operations land first. Sales, HR performance, and intelligent search follow once the core is stable.',
  },
]

export const phases: {
  id: PhaseId
  title: string
  summary: string
  modules: string[]
}[] = [
  {
    id: '0',
    title: 'Align & blueprint',
    summary: 'Shared language, scope agreement, and delivery backlog — so everyone sees the same picture before build accelerates.',
    modules: ['Foundations (scoped)', 'Documentation sign-off'],
  },
  {
    id: '1',
    title: 'Operations core',
    summary: 'Live factory monitoring, maintenance, finance reporting data, and product development (SPD) on shared foundations.',
    modules: ['Foundations', 'Manufacturing', 'Maintenance', 'Finance', 'SPD'],
  },
  {
    id: '2',
    title: 'Commercial & people',
    summary: 'Sales performance against targets and the HR performance hub — subject to your go-ahead on HR.',
    modules: ['Sales', 'HR (performance hub)'],
  },
  {
    id: '3',
    title: 'Intelligence & deep links',
    summary: 'Plain-language questions over your data, plus automated sync with Odoo, Pipedrive, and document filing where agreed.',
    modules: ['Intelligent assistant', 'ERP & CRM connectors'],
  },
]

export const modules: ModuleMeta[] = [
  {
    slug: 'foundations',
    name: 'Foundations',
    tagline: 'Organisation, people, assets, and files — shared by every module.',
    phase: '1',
    phaseLabel: 'Phase 1',
    status: 'active',
    statusLabel: 'Core',
    icon: '◈',
    outcomes: [
      'Group → Company → Site → Department structure',
      'Employee records with one Employee ID across the ecosystem',
      'Machines, moulds, products, customers, and document library',
      'Activity trail for who changed what, when',
    ],
    connectsTo: ['Manufacturing', 'Maintenance', 'Finance', 'SPD', 'Sales', 'HR'],
    notIncluded: ['Full CRM', 'Payroll', 'Inventory ERP'],
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    tagline: 'Real-time factory visibility across ~40 machines and three sites.',
    phase: '1',
    phaseLabel: 'Phase 1',
    status: 'active',
    statusLabel: 'In delivery',
    icon: '⚙',
    outcomes: [
      'Replace WhatsApp hourly reporting with structured production rounds',
      'Planning imports from spreadsheets into live manufacturing orders',
      'OEE, rejects, stoppages, tool changes, and quality checklists',
      'Every submission tied to Employee ID for performance rollups',
    ],
    connectsTo: ['Foundations', 'Maintenance', 'HR'],
    notIncluded: ['MES replacement for entire ERP', 'Legacy MVP carry-over as-is'],
  },
  {
    slug: 'maintenance',
    name: 'Maintenance',
    tagline: 'Service history, parts, and machine-down workflows.',
    phase: '1',
    phaseLabel: 'Phase 1',
    status: 'active',
    statusLabel: 'In delivery',
    icon: '🔧',
    outcomes: [
      'Maintenance jobs from manual entry, shot counts, or machine stopped events',
      'Parts catalog (no stock inventory in v1)',
      'Purchase orders and photos attached to jobs',
      'Notifications when thresholds are hit',
    ],
    connectsTo: ['Foundations', 'Manufacturing'],
    notIncluded: ['Predictive maintenance', 'Full inventory management', 'Legacy Fix app migration'],
  },
  {
    slug: 'finance',
    name: 'Finance reporting',
    tagline: 'Board-ready numbers in one place — Odoo stays your accounting authority.',
    phase: '1',
    phaseLabel: 'Phase 1',
    status: 'active',
    statusLabel: 'In delivery',
    icon: '◐',
    outcomes: [
      'Normalized periods, sections, lines, metrics, and aging buckets',
      'PIMMS Group and Stanton Global first; other group companies phased',
      'Targets vs actuals and division rollups',
      'PowerPoint and PDF packs generated from platform data — not locked inside it',
    ],
    connectsTo: ['Foundations', 'Odoo (future sync)'],
    notIncluded: ['Replacing Odoo accounting', 'Rendering full board packs inside the admin tool'],
  },
  {
    slug: 'spd',
    name: 'Product development (SPD)',
    tagline: 'Six phases, eighteen stages, five gates — with change control built in.',
    phase: '1',
    phaseLabel: 'Phase 1',
    status: 'active',
    statusLabel: 'POC pressure',
    icon: '◇',
    outcomes: [
      'Versioned process templates with per-project snapshot',
      'Gate sign-offs as explicit approval events with evidence',
      'In-scope vs out-of-scope change requests',
      'Tooling assets linked to products and moulds over time',
    ],
    connectsTo: ['Foundations', 'Manufacturing (phased)'],
    notIncluded: ['Standalone app separate from the group platform'],
  },
  {
    slug: 'sales',
    name: 'Sales performance',
    tagline: 'Target, planned, and actual — by rep, team, and department.',
    phase: '2',
    phaseLabel: 'Phase 2',
    status: 'planned',
    statusLabel: 'Scoped',
    icon: '↗',
    outcomes: [
      'Monthly performance periods with Hunt/Care activity targets',
      'Actuals from Odoo or manual load — you choose the path',
      'Discrepancy views per rep for coaching conversations',
      'Pipedrive-shaped data until CRM sync is approved',
    ],
    connectsTo: ['Foundations', 'Odoo', 'Pipedrive (future)'],
    notIncluded: ['Full CRM replacement'],
  },
  {
    slug: 'hr',
    name: 'HR & performance',
    tagline: 'Organogram and performance hub — not a full HRIS.',
    phase: '2',
    phaseLabel: 'Phase 2',
    status: 'deferred',
    statusLabel: 'Awaiting go-ahead',
    icon: '◎',
    outcomes: [
      'Contract templates and employee performance contracts',
      'Quarterly reviews and 1-on-1 score rollups',
      'Manufacturing metrics flow in by Employee ID',
      'SharePoint filing for documents via automated jobs',
    ],
    connectsTo: ['Foundations', 'Manufacturing', 'Sales'],
    notIncluded: ['Payroll', 'Leave', 'Benefits', 'Recruitment', 'SimplePay in v1'],
  },
  {
    slug: 'intelligence',
    name: 'Intelligent assistant',
    tagline: 'Ask questions in plain language — answers grounded in your live data.',
    phase: '3',
    phaseLabel: 'Phase 3',
    status: 'planned',
    statusLabel: 'Future',
    icon: '✦',
    outcomes: [
      '“Which machines are near service?” — without building a report first',
      'Gate pack summaries, production by mould, finance snapshots',
      'Same access rules as human users — no shadow database',
    ],
    connectsTo: ['All modules'],
    notIncluded: ['Separate knowledge base duplicate of your records'],
  },
  {
    slug: 'connectivity',
    name: 'Connectivity & data',
    tagline: 'Imports, exports, and scheduled jobs — the plumbing behind the scenes.',
    phase: '1',
    phaseLabel: 'Cross-cutting',
    status: 'active',
    statusLabel: 'Ongoing',
    icon: '⇄',
    outcomes: [
      'Bulk CSV/JSON import for organogram, machines, planning sheets',
      'Scheduled reminders, sync windows, and notification delivery',
      'Odoo, Pipedrive, and SharePoint integrations phased after the model is stable',
    ],
    connectsTo: ['All modules'],
    notIncluded: ['Client-visible “integration batch” bureaucracy'],
  },
]

export const ecosystemNodes = [
  { id: 'foundations', label: 'Foundations', x: 50, y: 50, r: 42 },
  { id: 'manufacturing', label: 'Manufacturing', x: 22, y: 28, r: 32 },
  { id: 'maintenance', label: 'Maintenance', x: 78, y: 28, r: 32 },
  { id: 'finance', label: 'Finance', x: 18, y: 72, r: 30 },
  { id: 'spd', label: 'SPD', x: 50, y: 18, r: 30 },
  { id: 'sales', label: 'Sales', x: 82, y: 72, r: 28 },
  { id: 'hr', label: 'HR', x: 50, y: 82, r: 28 },
  { id: 'intelligence', label: 'Assistant', x: 88, y: 50, r: 26 },
] as const

export const ecosystemEdges: [string, string][] = [
  ['foundations', 'manufacturing'],
  ['foundations', 'maintenance'],
  ['foundations', 'finance'],
  ['foundations', 'spd'],
  ['foundations', 'sales'],
  ['foundations', 'hr'],
  ['manufacturing', 'maintenance'],
  ['manufacturing', 'hr'],
  ['foundations', 'intelligence'],
  ['manufacturing', 'intelligence'],
  ['finance', 'intelligence'],
  ['spd', 'intelligence'],
]

export const openItems = [
  'Mould ↔ product relationships — confirm with sample data',
  'Finance report list expansion beyond PIMMS + Stanton Global',
  'Maintenance notification chain — confirm recipients',
  'Pipedrive field mapping before Sales build',
  'HR module — proceed when leadership gives green light',
]

export function getModule(slug: string): ModuleMeta | undefined {
  return modules.find((m) => m.slug === slug)
}

export const navLinks = [
  { href: '/', label: 'Overview' },
  { href: '/ecosystem', label: 'How it connects' },
  { href: '/modules', label: 'Modules' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/investment', label: 'Investment' },
] as const
