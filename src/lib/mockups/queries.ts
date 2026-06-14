import { getPayload, type PaginatedDocs } from 'payload'
import config from '@payload-config'
import type { MockupCollectionSlug } from './navigation'

const DEFAULT_DEPTH = 2

async function getPayloadClient() {
  return getPayload({ config })
}

export async function findCollection<T = Record<string, unknown>>(
  slug: MockupCollectionSlug,
  options?: { limit?: number; page?: number; sort?: string },
): Promise<PaginatedDocs<T>> {
  const payload = await getPayloadClient()
  return payload.find({
    collection: slug,
    depth: DEFAULT_DEPTH,
    limit: options?.limit ?? 100,
    page: options?.page ?? 1,
    sort: options?.sort ?? '-updatedAt',
    overrideAccess: true,
  }) as Promise<PaginatedDocs<T>>
}

export async function findById<T = Record<string, unknown>>(
  slug: MockupCollectionSlug,
  id: string,
): Promise<T | null> {
  const payload = await getPayloadClient()
  try {
    return (await payload.findByID({
      collection: slug,
      id,
      depth: DEFAULT_DEPTH,
      overrideAccess: true,
    })) as T
  } catch {
    return null
  }
}

export async function getDashboardStats() {
  const payload = await getPayloadClient()
  const slugs: MockupCollectionSlug[] = [
    'companies',
    'locations',
    'assets',
    'tickets',
    'employees',
    'maintenance-teams',
    'asset-movements',
  ]

  const counts = await Promise.all(
    slugs.map(async (slug) => {
      const result = await payload.find({ collection: slug, limit: 0, overrideAccess: true })
      return [slug, result.totalDocs] as const
    }),
  )

  const openTickets = await payload.find({
    collection: 'tickets',
    where: { status: { in: ['open', 'in_progress'] } },
    limit: 0,
    overrideAccess: true,
  })

  const pendingReview = await payload.find({
    collection: 'tickets',
    where: { reviewStatus: { equals: 'pending' } },
    limit: 0,
    overrideAccess: true,
  })

  return {
    counts: Object.fromEntries(counts) as Record<string, number>,
    openTickets: openTickets.totalDocs,
    pendingReview: pendingReview.totalDocs,
  }
}

export async function getRecentTickets(limit = 8) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'tickets',
    depth: DEFAULT_DEPTH,
    limit,
    sort: '-reportedAt',
    overrideAccess: true,
  })
  return result.docs
}

export async function getLocationTree() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'locations',
    depth: 2,
    limit: 200,
    sort: 'name',
    overrideAccess: true,
  })
  return result.docs
}
