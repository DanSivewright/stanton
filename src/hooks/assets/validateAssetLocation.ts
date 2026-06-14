import type { CollectionBeforeChangeHook } from 'payload'
import { getRelationshipId } from '../../lib/relationships'
import { validateLocationIsLeaf } from '../../lib/locations'

export const validateAssetLocation: CollectionBeforeChangeHook = async ({ data, req }) => {
  const locationId = getRelationshipId(data?.location)
  if (!locationId) return data

  const result = await validateLocationIsLeaf(req, locationId)
  if (result !== true) throw new Error(result)

  return data
}
