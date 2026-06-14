import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { relLabel } from '@/lib/mockups/helpers'

type Doc = Record<string, unknown>

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
  'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
]

export function avatarGradient(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length]
}

export function docId(doc: Doc): string {
  return String(doc.id ?? '')
}

export function itemTitle(slug: MockupCollectionSlug, doc: Doc): string {
  switch (slug) {
    case 'employees':
      return String(doc.fullName ?? 'Untitled')
    case 'users':
      return String(doc.email ?? 'Untitled')
    case 'assets':
      return String(doc.name ?? doc.assetTag ?? 'Untitled')
    case 'asset-movements':
      return String(doc.reference ?? 'Untitled')
    case 'tickets':
      return String(doc.title ?? doc.ticketNumber ?? 'Untitled')
    default:
      return String(doc.name ?? doc.title ?? doc.code ?? 'Untitled')
  }
}

export function itemSubtitle(slug: MockupCollectionSlug, doc: Doc): string {
  switch (slug) {
    case 'companies':
      return relLabel(doc.code as never)
    case 'locations':
      return doc.isGroup ? 'Group' : relLabel(doc.kind as never, 'Location')
    case 'assets':
      return `${relLabel(doc.assetTag as never)} · ${relLabel(doc.category as never)}`
    case 'asset-movements':
      return `${relLabel(doc.asset as never)} · ${relLabel(doc.toLocation as never)}`
    case 'tickets':
      return `${relLabel(doc.ticketNumber as never)} · ${relLabel(doc.type as never)}`
    case 'employees':
      return relLabel(doc.jobTitle as never, relLabel(doc.company as never))
    case 'users':
      return relLabel(doc.role as never)
    case 'maintenance-teams':
      return relLabel(doc.company as never)
    default:
      return relLabel(doc.description as never, '—')
  }
}

export function itemMeta(slug: MockupCollectionSlug, doc: Doc): string | undefined {
  switch (slug) {
    case 'assets':
      return relLabel(doc.status as never)
    case 'tickets':
      return String(doc.status ?? '').replace(/_/g, ' ')
    case 'locations':
      return relLabel(doc.company as never)
    default:
      return undefined
  }
}

export function isLibraryCollection(slug: string): slug is 'assets' | 'tickets' {
  return slug === 'assets' || slug === 'tickets'
}

export type LibraryTab = 'active' | 'all' | 'archived'

export function filterLibraryDocs(
  slug: 'assets' | 'tickets',
  docs: Doc[],
  tab: LibraryTab,
): Doc[] {
  if (tab === 'all') return docs

  if (slug === 'assets') {
    return docs.filter((doc) => {
      const statusName = relLabel(doc.status as never, '').toLowerCase()
      const isArchived = statusName.includes('disposed') || statusName.includes('out of service')
      return tab === 'archived' ? isArchived : !isArchived
    })
  }

  return docs.filter((doc) => {
    const status = String(doc.status ?? '')
    const isArchived = status === 'completed' || status === 'cancelled'
    return tab === 'archived' ? isArchived : !isArchived
  })
}

export function filterBySearch(docs: Doc[], query: string, slug: MockupCollectionSlug): Doc[] {
  if (!query.trim()) return docs
  const q = query.toLowerCase()
  return docs.filter((doc) => {
    const title = itemTitle(slug, doc).toLowerCase()
    const subtitle = itemSubtitle(slug, doc).toLowerCase()
    return title.includes(q) || subtitle.includes(q)
  })
}

export function filterByChip(
  slug: 'assets' | 'tickets',
  docs: Doc[],
  chipId: string | undefined,
): Doc[] {
  if (!chipId) return docs
  const field = slug === 'assets' ? 'category' : 'type'
  return docs.filter((doc) => {
    const rel = doc[field]
    if (rel && typeof rel === 'object' && 'id' in rel) {
      return String(rel.id) === chipId
    }
    return String(rel) === chipId
  })
}
