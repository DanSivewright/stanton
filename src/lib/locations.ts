import type { PayloadRequest } from 'payload'
import { getRelationshipId } from './relationships'

const MAX_LOCATION_DEPTH = 3

export async function getLocationDepth(
  req: PayloadRequest,
  locationId: string,
): Promise<number> {
  let depth = 1
  let currentId: string | null = locationId
  const visited = new Set<string>()

  while (currentId) {
    if (visited.has(currentId)) break
    visited.add(currentId)

    const location = await req.payload.findByID({
      collection: 'locations',
      id: currentId,
      depth: 0,
      req,
    })

    const parentId = getRelationshipId(location.parent)
    if (!parentId) return depth

    depth++
    currentId = parentId
  }

  return depth
}

export async function validateLocationIsLeaf(
  req: PayloadRequest,
  locationId: string,
): Promise<true | string> {
  const location = await req.payload.findByID({
    collection: 'locations',
    id: locationId,
    depth: 0,
    req,
  })

  if (location.isGroup) {
    return 'Location must be a leaf (non-group) node.'
  }

  return true
}

export { MAX_LOCATION_DEPTH }
