import type { CollectionBeforeChangeHook } from 'payload'
import { getRelationshipId } from '../../lib/relationships'
import { validateLocationIsLeaf as checkLeaf } from '../../lib/locations'

export const validateTicketLocationIsLeaf: CollectionBeforeChangeHook = async ({ data, req }) => {
  const locationId = getRelationshipId(data?.location)
  if (!locationId) return data

  const result = await checkLeaf(req, locationId)
  if (result !== true) throw new Error(result)

  return data
}
