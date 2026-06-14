import type { RelationshipFieldSingleValidation } from 'payload'
import { getRelationshipId } from '../../lib/relationships'
import { getLocationDepth, MAX_LOCATION_DEPTH } from '../../lib/locations'

export const validateParentLocation: RelationshipFieldSingleValidation = async (
  value,
  { req, id, siblingData },
) => {
  const parentId = getRelationshipId(value)
  if (!parentId) return true

  if (id && parentId === id) {
    return 'A location cannot be its own parent.'
  }

  const parent = await req.payload.findByID({
    collection: 'locations',
    id: parentId,
    depth: 0,
    req,
  })

  if (!parent.isGroup) {
    return 'Parent must be a group location.'
  }

  const childCompanyId = getRelationshipId(
    (siblingData as { company?: unknown } | undefined)?.company,
  )
  const parentCompanyId = getRelationshipId(parent.company)

  if (childCompanyId && parentCompanyId && childCompanyId !== parentCompanyId) {
    return 'Child location must belong to the same company as its parent.'
  }

  const parentDepth = await getLocationDepth(req, parentId)
  if (parentDepth >= MAX_LOCATION_DEPTH) {
    return `Location tree cannot exceed ${MAX_LOCATION_DEPTH} levels.`
  }

  let currentParentId: string | null = parentId
  const visited = new Set<string>()

  while (currentParentId) {
    if (id && currentParentId === id) {
      return 'Cannot assign a descendant as parent (circular reference).'
    }

    if (visited.has(currentParentId)) break
    visited.add(currentParentId)

    const ancestor = await req.payload.findByID({
      collection: 'locations',
      id: currentParentId,
      depth: 0,
      req,
    })

    currentParentId = getRelationshipId(ancestor.parent)
  }

  return true
}
