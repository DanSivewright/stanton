import type { CollectionBeforeChangeHook } from 'payload'
import { getRelationshipId } from '../../lib/relationships'

export const inheritFromAsset: CollectionBeforeChangeHook = async ({ data, req }) => {
  const assetId = getRelationshipId(data?.asset)
  if (!assetId) return data

  const asset = await req.payload.findByID({
    collection: 'assets',
    id: assetId,
    depth: 0,
    req,
  })

  return {
    ...data,
    company: getRelationshipId(asset.company) ?? data?.company,
    location: getRelationshipId(asset.location) ?? data?.location,
    assignedTeam: getRelationshipId(asset.defaultTeam) ?? data?.assignedTeam,
  }
}
