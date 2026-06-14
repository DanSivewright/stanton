export type MockupCollectionSlug =
  | 'companies'
  | 'locations'
  | 'asset-categories'
  | 'asset-statuses'
  | 'ticket-types'
  | 'employees'
  | 'maintenance-teams'
  | 'users'
  | 'assets'
  | 'asset-movements'
  | 'tickets'

export type MockupNavGroup = {
  label: string
  items: {
    slug: MockupCollectionSlug
    label: string
    description: string
  }[]
}

export const MOCKUP_NAV: MockupNavGroup[] = [
  {
    label: 'Organization',
    items: [
      { slug: 'companies', label: 'Companies', description: 'Group entities and subsidiaries' },
      { slug: 'locations', label: 'Locations', description: 'Site hierarchy and placement' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { slug: 'asset-categories', label: 'Asset Categories', description: 'Equipment classifications' },
      { slug: 'asset-statuses', label: 'Asset Statuses', description: 'Operational states' },
      { slug: 'ticket-types', label: 'Ticket Types', description: 'Maintenance request kinds' },
    ],
  },
  {
    label: 'People',
    items: [
      { slug: 'employees', label: 'Employees', description: 'Staff and technicians' },
      { slug: 'maintenance-teams', label: 'Maintenance Teams', description: 'Crews and routing' },
      { slug: 'users', label: 'Users', description: 'Admin login accounts' },
    ],
  },
  {
    label: 'Assets',
    items: [
      { slug: 'assets', label: 'Assets', description: 'Tracked equipment registry' },
      { slug: 'asset-movements', label: 'Asset Movements', description: 'Placement audit trail' },
    ],
  },
  {
    label: 'Maintenance',
    items: [
      { slug: 'tickets', label: 'Tickets', description: 'Work requests and reviews' },
    ],
  },
]

export const MOCKUP_VARIANTS = [
  { slug: 'sana', label: 'Sana AI', reference: 'Soft cards, chat-forward workspace' },
  { slug: 'linear', label: 'Linear', reference: 'Dark dense issue tracker' },
  { slug: 'qatalog', label: 'Qatalog', reference: 'Airy directory and teams' },
  { slug: 'elevenlabs', label: 'ElevenLabs', reference: 'Light sidebar library browse' },
] as const

export type MockupVariantSlug = (typeof MOCKUP_VARIANTS)[number]['slug']

export function getNavItem(slug: string) {
  for (const group of MOCKUP_NAV) {
    const item = group.items.find((i) => i.slug === slug)
    if (item) return { group, item }
  }
  return null
}

export function getAllCollectionSlugs(): MockupCollectionSlug[] {
  return MOCKUP_NAV.flatMap((g) => g.items.map((i) => i.slug))
}
