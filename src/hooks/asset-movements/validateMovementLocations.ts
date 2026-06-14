import type { CollectionBeforeChangeHook } from 'payload'
import { getRelationshipId } from '../../lib/relationships'
import { validateLocationIsLeaf } from '../../lib/locations'

export const validateMovementLocations: CollectionBeforeChangeHook = async ({ data, req }) => {
  const toLocationId = getRelationshipId(data?.toLocation)
  if (toLocationId) {
    const result = await validateLocationIsLeaf(req, toLocationId)
    if (result !== true) throw new Error(result)
  }

  return data
}
