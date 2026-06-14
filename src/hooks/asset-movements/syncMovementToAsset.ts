import type { CollectionAfterChangeHook } from 'payload'
import { getRelationshipId } from '../../lib/relationships'
import { SKIP_ASSET_SYNC } from '../../lib/constants/sync-context'

export const syncMovementToAsset: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  if (context[SKIP_ASSET_SYNC]) return

  const assetId = getRelationshipId(doc.asset)
  const toLocationId = getRelationshipId(doc.toLocation)
  if (!assetId || !toLocationId) return

  await req.payload.update({
    collection: 'assets',
    id: assetId,
    data: { location: toLocationId },
    context: { ...context, [SKIP_ASSET_SYNC]: true },
    req,
  })
}
